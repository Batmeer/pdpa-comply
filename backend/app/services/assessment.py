"""
Shared logic for creating and reading assessments.
Used by both the startup seeder and the API endpoints.
"""
from __future__ import annotations
import re
from datetime import datetime, timezone
from sqlalchemy.orm import Session, joinedload

from app.engine.core import (
    OrgProfile, ControlResult, AssessmentResult,
    load_catalogue, score_assessment, remediation_roadmap,
)
from app.models import Organization, Assessment, ControlResponse
from app.schemas.assessment import AssessmentOut, ControlResultOut, RoadmapItem
from app.schemas.catalogue import LegalAnchor


def org_to_profile(org: Organization) -> OrgProfile:
    return OrgProfile(
        name=org.name,
        sector=org.sector,
        registered=org.registered,
        processes_sensitive_data=org.processes_sensitive_data,
        transfers_abroad=org.transfers_abroad,
        uses_processors=org.uses_processors,
        does_direct_marketing=org.does_direct_marketing,
        uses_automated_decisions=org.uses_automated_decisions,
        processes_children_data=org.processes_children_data,
        is_public_institution=org.is_public_institution,
        employee_band=org.employee_band,
        turnover_band=org.turnover_band,
    )


def make_slug(db: Session, name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    slug, i = base, 2
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base}-{i}"
        i += 1
    return slug


def create_assessment(
    db: Session,
    profile: OrgProfile,
    answers: dict[str, str],
    slug: str,
    is_demo: bool = False,
) -> tuple[Organization, Assessment]:
    org = db.query(Organization).filter(Organization.slug == slug).first()
    if not org:
        org = Organization(
            slug=slug,
            name=profile.name,
            sector=profile.sector,
            registered=profile.registered,
            processes_sensitive_data=profile.processes_sensitive_data,
            transfers_abroad=profile.transfers_abroad,
            uses_processors=profile.uses_processors,
            does_direct_marketing=profile.does_direct_marketing,
            uses_automated_decisions=profile.uses_automated_decisions,
            processes_children_data=profile.processes_children_data,
            is_public_institution=profile.is_public_institution,
            employee_band=profile.employee_band,
            turnover_band=profile.turnover_band,
            is_demo=is_demo,
        )
        db.add(org)
        db.flush()

    catalogue = load_catalogue()
    result: AssessmentResult = score_assessment(catalogue, profile, answers)

    assessment = Assessment(
        organization_id=org.id,
        score=result.score,
        maturity=result.maturity,
        applicable_count=result.applicable_count,
        compliant_count=result.compliant_count,
        partial_count=result.partial_count,
        non_compliant_count=result.non_compliant_count,
        review_count=result.review_count,
        cluster_scores=result.cluster_scores,
        generated_at=datetime.fromisoformat(result.generated_at),
        integrity_hash=result.integrity_hash,
    )
    db.add(assessment)
    db.flush()

    for cr in result.results:
        db.add(ControlResponse(
            assessment_id=assessment.id,
            control_id=cr.control_id,
            cluster=cr.cluster,
            status=cr.status,
            severity=cr.severity,
            sensitivity_multiplier=cr.sensitivity_multiplier,
            gap=cr.gap,
            max_gap=cr.max_gap,
        ))

    db.commit()
    db.refresh(org)
    db.refresh(assessment)
    return org, assessment


def build_assessment_out(assessment: Assessment, org: Organization) -> AssessmentOut:
    """Reconstruct full AssessmentOut from DB rows + cached catalogue."""
    catalogue = load_catalogue()
    ctrl_map = {c["id"]: c for c in catalogue["controls"]}

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
            requirement=ctrl.get("requirement", ""),
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

    roadmap = remediation_roadmap(ar)
    profile = org_to_profile(org)

    result_out = [
        ControlResultOut(
            control_id=r.control_id,
            cluster=r.cluster,
            status=r.status,
            severity=r.severity,
            sensitivity_multiplier=r.sensitivity_multiplier,
            gap=r.gap,
            max_gap=r.max_gap,
            requirement=r.requirement,
            remediation=r.remediation,
            legal_anchor=LegalAnchor(**r.legal_anchor),
        )
        for r in engine_results
    ]

    return AssessmentOut(
        id=assessment.id,
        org_name=org.name,
        score=assessment.score,
        maturity=assessment.maturity,
        applicable_count=assessment.applicable_count,
        compliant_count=assessment.compliant_count,
        partial_count=assessment.partial_count,
        non_compliant_count=assessment.non_compliant_count,
        review_count=assessment.review_count,
        cluster_scores=assessment.cluster_scores,
        generated_at=assessment.generated_at,
        integrity_hash=assessment.integrity_hash,
        results=result_out,
        roadmap=[RoadmapItem(**item) for item in roadmap],
        dpia_required=profile.dpia_required(),
    )


def load_assessment(db: Session, assessment_id: int) -> tuple[Assessment, Organization] | None:
    assessment = (
        db.query(Assessment)
        .options(
            joinedload(Assessment.organization),
            joinedload(Assessment.control_responses),
        )
        .filter(Assessment.id == assessment_id)
        .first()
    )
    if not assessment:
        return None
    return assessment, assessment.organization
