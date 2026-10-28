from __future__ import annotations
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field
from .catalogue import LegalAnchor
from .organization import OrgProfileIn

Status = Literal["COMPLIANT", "PARTIAL", "NON_COMPLIANT", "REVIEW_REQUIRED"]


class AssessmentIn(BaseModel):
    """POST /assessments request body."""
    profile: OrgProfileIn
    answers: dict[str, Status] = Field(
        default_factory=dict,
        description="Map of control_id → status. Omitted controls default to REVIEW_REQUIRED.",
    )


class ControlResultOut(BaseModel):
    """Per-control scored result — mirrors engine.ControlResult."""
    control_id: str
    cluster: str
    status: Status
    severity: int
    sensitivity_multiplier: float
    gap: float
    max_gap: float
    requirement: str
    remediation: str
    legal_anchor: LegalAnchor


class RoadmapItem(BaseModel):
    """Single prioritised remediation action from engine.remediation_roadmap()."""
    rank: int
    control_id: str
    cluster: str
    priority: Literal["High", "Medium", "Low"]
    legal_basis: str
    action: str
    score_impact: float


class AssessmentOut(BaseModel):
    """Full scored assessment response — mirrors engine.AssessmentResult + DB id."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    org_name: str
    score: float
    maturity: str
    applicable_count: int
    compliant_count: int
    partial_count: int
    non_compliant_count: int
    review_count: int
    cluster_scores: dict[str, float]
    generated_at: datetime
    integrity_hash: str
    results: list[ControlResultOut] = []
    roadmap: list[RoadmapItem] = []
    dpia_required: bool = False


class AssessmentSummary(BaseModel):
    """Lightweight card for Dashboard / demo listing."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    org_name: str
    score: float
    maturity: str
    applicable_count: int
    compliant_count: int
    non_compliant_count: int
    generated_at: datetime
