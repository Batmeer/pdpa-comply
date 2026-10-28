"""
The compliance engine — pure, deterministic, fully testable.
Reads catalogue.json (never hardcodes the law) and computes scores + reports.

No AI, no I/O side effects beyond loading the catalogue file.
Every function here is a pure transformation, which is why it's trivially unit-testable.
"""
from __future__ import annotations
import json
import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Literal

Status = Literal["COMPLIANT", "PARTIAL", "NON_COMPLIANT", "REVIEW_REQUIRED"]

CATALOGUE_PATH = Path(__file__).resolve().parent.parent / "data" / "catalogue.json"


# ---------------------------------------------------------------------------
# Catalogue loading
# ---------------------------------------------------------------------------
@lru_cache(maxsize=1)
def load_catalogue(path: str | None = None) -> dict:
    """Load and cache the catalogue. The single source of legal truth."""
    p = Path(path) if path else CATALOGUE_PATH
    with open(p) as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Org profile -> applicability
# ---------------------------------------------------------------------------
@dataclass
class OrgProfile:
    """Flags that determine which conditional controls apply to an org."""
    name: str
    sector: str
    registered: bool = False
    processes_sensitive_data: bool = False
    transfers_abroad: bool = False
    uses_processors: bool = False
    does_direct_marketing: bool = False
    uses_automated_decisions: bool = False
    processes_children_data: bool = False
    is_public_institution: bool = False
    # Size band inputs (drive Form 1 fee field)
    employee_band: str = "1-49"          # "1-49" | "50-99" | "100+"
    turnover_band: str = "<100M"         # "<100M" | "100-500M" | ">500M"

    def dpia_required(self) -> bool:
        """Reg 33(2): a DPIA is required if any high-risk condition is present.
        We derive this from profile flags that map to the 10 statutory triggers."""
        return any([
            self.uses_automated_decisions,    # (a)
            self.processes_sensitive_data,    # (c)(e) biometric/genetic/sensitive
            self.processes_children_data,     # (e)
        ])

    def flag(self, key: str) -> bool:
        if key == "all":
            return True
        if key == "dpia_required":
            return self.dpia_required()
        return bool(getattr(self, key, False))


def applicable_controls(catalogue: dict, profile: OrgProfile) -> list[dict]:
    """Filter the catalogue to controls that apply to this org."""
    return [c for c in catalogue["controls"] if profile.flag(c["applies_to"])]


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------
@dataclass
class ControlResult:
    control_id: str
    cluster: str
    status: Status
    severity: int
    sensitivity_multiplier: float
    gap: float
    max_gap: float
    requirement: str
    remediation: str
    legal_anchor: dict


@dataclass
class AssessmentResult:
    org_name: str
    score: float
    maturity: str
    applicable_count: int
    compliant_count: int
    partial_count: int
    non_compliant_count: int
    review_count: int
    results: list[ControlResult] = field(default_factory=list)
    cluster_scores: dict = field(default_factory=dict)
    generated_at: str = ""
    integrity_hash: str = ""


def _maturity_label(catalogue: dict, score: float) -> str:
    bands = sorted(catalogue["scoring"]["maturity_bands"], key=lambda b: b["min"])
    label = bands[0]["label"]
    for band in bands:
        if score >= band["min"]:
            label = band["label"]
    return label


def score_assessment(
    catalogue: dict,
    profile: OrgProfile,
    answers: dict[str, Status],
) -> AssessmentResult:
    """
    answers: {control_id: status}. Controls not answered default to REVIEW_REQUIRED.
    Score is computed over APPLICABLE controls only.
    """
    mods = catalogue["scoring"]["status_modifiers"]
    controls = applicable_controls(catalogue, profile)

    results: list[ControlResult] = []
    total_gap = 0.0
    total_max = 0.0
    counts = {"COMPLIANT": 0, "PARTIAL": 0, "NON_COMPLIANT": 0, "REVIEW_REQUIRED": 0}
    cluster_acc: dict[str, list[float]] = {}

    for c in controls:
        status: Status = answers.get(c["id"], "REVIEW_REQUIRED")
        counts[status] += 1
        sev = c["severity"]
        sens = c["sensitivity_multiplier"]
        max_gap = sev * sens * 1.0                 # worst case = NON_COMPLIANT
        gap = sev * sens * mods[status]
        total_gap += gap
        total_max += max_gap

        cluster_acc.setdefault(c["cluster"], []).append(1 - (gap / max_gap) if max_gap else 1.0)

        results.append(ControlResult(
            control_id=c["id"], cluster=c["cluster"], status=status,
            severity=sev, sensitivity_multiplier=sens, gap=round(gap, 3),
            max_gap=round(max_gap, 3), requirement=c["requirement"],
            remediation=c["remediation"], legal_anchor=c["legal_anchor"],
        ))

    score = 100.0 * (1 - (total_gap / total_max)) if total_max else 100.0
    score = round(score, 1)
    cluster_scores = {k: round(100 * sum(v) / len(v), 1) for k, v in cluster_acc.items()}

    generated_at = datetime.now(timezone.utc).isoformat()
    payload = f"{profile.name}|{score}|{generated_at}|{sorted(answers.items())}"
    integrity_hash = hashlib.sha256(payload.encode()).hexdigest()

    return AssessmentResult(
        org_name=profile.name, score=score, maturity=_maturity_label(catalogue, score),
        applicable_count=len(controls),
        compliant_count=counts["COMPLIANT"], partial_count=counts["PARTIAL"],
        non_compliant_count=counts["NON_COMPLIANT"], review_count=counts["REVIEW_REQUIRED"],
        results=results, cluster_scores=cluster_scores,
        generated_at=generated_at, integrity_hash=integrity_hash,
    )


# ---------------------------------------------------------------------------
# Remediation roadmap (prioritized by gap size = impact)
# ---------------------------------------------------------------------------
def remediation_roadmap(result: AssessmentResult) -> list[dict]:
    """Ordered list of fixes, highest-impact first. gap = how much the score improves if fixed."""
    open_items = [r for r in result.results if r.status in ("NON_COMPLIANT", "PARTIAL", "REVIEW_REQUIRED")]
    open_items.sort(key=lambda r: r.gap, reverse=True)
    roadmap = []
    for rank, r in enumerate(open_items, start=1):
        anchor = r.legal_anchor
        cite = " / ".join(filter(None, [anchor.get("act_section"), anchor.get("regulation")]))
        roadmap.append({
            "rank": rank,
            "control_id": r.control_id,
            "cluster": r.cluster,
            "priority": "High" if r.gap >= 5 else ("Medium" if r.gap >= 2.5 else "Low"),
            "legal_basis": cite,
            "action": r.remediation,
            "score_impact": r.gap,
        })
    return roadmap
