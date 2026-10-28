from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.core.deps import get_db
from app.models import Organization, Assessment
from app.schemas.assessment import AssessmentSummary

router = APIRouter()


@router.get("", response_model=list[AssessmentSummary], summary="List demo org assessments")
def get_demos(db: Session = Depends(get_db)) -> list[AssessmentSummary]:
    demo_orgs = db.query(Organization).filter(Organization.is_demo == True).all()
    summaries = []
    for org in demo_orgs:
        assessment = (
            db.query(Assessment)
            .filter(Assessment.organization_id == org.id)
            .order_by(Assessment.created_at.desc())
            .first()
        )
        if assessment:
            summaries.append(AssessmentSummary(
                id=assessment.id,
                org_name=org.name,
                score=assessment.score,
                maturity=assessment.maturity,
                applicable_count=assessment.applicable_count,
                compliant_count=assessment.compliant_count,
                non_compliant_count=assessment.non_compliant_count,
                generated_at=assessment.generated_at,
            ))
    return summaries
