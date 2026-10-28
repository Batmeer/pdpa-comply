"""Full compliance results report — built directly from engine + DB models."""
from __future__ import annotations
from app.forms.base import FormGenerator
from app.models import Organization, Assessment
from app.engine.core import load_catalogue, remediation_roadmap, ControlResult, AssessmentResult

CLUSTER_TO_SECTION: dict[str, str] = {
    'Registration':         'Registering with the PDPC',
    'Lawful Processing':    'How you collect and use data',
    'Accuracy & Retention': 'How you collect and use data',
    'Sensitive Data':       'How you collect and use data',
    'Security':             'Keeping data safe',
    'DPO':                  'Your Data Protection Officer',
    'Data Subject Rights':  "People's rights over their data",
    'Transborder Flow':     'Working with others & records',
    'DPIA':                 'Working with others & records',
    'Accountability':       'Working with others & records',
}

SECTION_ORDER = [
    'Registering with the PDPC',
    'How you collect and use data',
    'Keeping data safe',
    'Your Data Protection Officer',
    "People's rights over their data",
    'Working with others & records',
]


class FullReportGenerator(FormGenerator):
    template_name = "report.html"

    def build_context(self, org: Organization, assessment: Assessment) -> dict:
        catalogue = load_catalogue()
        ctrl_map = {c["id"]: c for c in catalogue["controls"]}

        # Rebuild ControlResult objects from stored DB rows + catalogue text
        engine_results: list[ControlResult] = []
        for cr in assessment.control_responses:
            ctrl = ctrl_map.get(cr.control_id, {})
            engine_results.append(ControlResult(
                control_id=cr.control_id,
                cluster=cr.cluster,
                status=cr.status,
                severity=cr.severity,
                sensitivity_multiplier=cr.sensitivity_multiplier,
                gap=cr.gap,
                max_gap=cr.max_gap,
                requirement=ctrl.get("requirement", cr.control_id),
                remediation=ctrl.get("remediation", ""),
                legal_anchor=ctrl.get("legal_anchor", {}),
            ))

        ar = AssessmentResult(
            org_name=org.name,
            score=assessment.score,
            maturity=assessment.maturity,
            applicable_count=assessment.applicable_count,
            compliant_count=assessment.compliant_count,
            partial_count=assessment.partial_count,
            non_compliant_count=assessment.non_compliant_count,
            review_count=assessment.review_count,
            results=engine_results,
            cluster_scores=assessment.cluster_scores,
            generated_at=assessment.generated_at.isoformat(),
            integrity_hash=assessment.integrity_hash,
        )

        # Plain dicts — safe for Jinja2
        roadmap: list[dict] = remediation_roadmap(ar)

        # Section scores from stored cluster_scores
        section_sums: dict[str, list[float]] = {}
        for cluster, score in assessment.cluster_scores.items():
            sec = CLUSTER_TO_SECTION.get(cluster, cluster)
            section_sums.setdefault(sec, []).append(score)
        section_scores = {
            sec: round(sum(v) / len(v))
            for sec, v in section_sums.items()
        }

        # Gap items (NON_COMPLIANT or PARTIAL) grouped by section
        gaps_by_section: dict[str, list[ControlResult]] = {s: [] for s in SECTION_ORDER}
        for r in engine_results:
            if r.status in ('NON_COMPLIANT', 'PARTIAL'):
                sec = CLUSTER_TO_SECTION.get(r.cluster, r.cluster)
                if sec in gaps_by_section:
                    gaps_by_section[sec].append(r)

        sections = [
            {
                'name': sec,
                'score': section_scores.get(sec, 0),
                'gaps': gaps_by_section.get(sec, []),
            }
            for sec in SECTION_ORDER
            if sec in section_scores
        ]

        return {
            'org':               org,
            'assessment':        assessment,
            'score':             assessment.score,
            'maturity':          assessment.maturity,
            'applicable_count':  assessment.applicable_count,
            'compliant_count':   assessment.compliant_count,
            'partial_count':     assessment.partial_count,
            'non_compliant_count': assessment.non_compliant_count,
            'review_count':      assessment.review_count,
            'roadmap':           roadmap,
            'sections':          sections,
        }
