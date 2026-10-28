from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import FileResponse
from pathlib import Path
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.engine.core import OrgProfile
from app.models import Assessment, DPIA, Report
from app.schemas.assessment import AssessmentIn, AssessmentOut
from app.schemas.dpia import DPIAIn, DPIAOut
from app.schemas.report import ReportOut
from app.forms.worker import process_report
from app.services.assessment import (
    build_assessment_out,
    create_assessment,
    load_assessment,
    make_slug,
)

router = APIRouter()


@router.post("", response_model=AssessmentOut, status_code=status.HTTP_201_CREATED,
             summary="Submit an org profile + answers and get a scored assessment")
def post_assessment(body: AssessmentIn, db: Session = Depends(get_db)) -> AssessmentOut:
    p = body.profile
    profile = OrgProfile(
        name=p.name, sector=p.sector,
        registered=p.registered,
        processes_sensitive_data=p.processes_sensitive_data,
        transfers_abroad=p.transfers_abroad,
        uses_processors=p.uses_processors,
        does_direct_marketing=p.does_direct_marketing,
        uses_automated_decisions=p.uses_automated_decisions,
        processes_children_data=p.processes_children_data,
        is_public_institution=p.is_public_institution,
        employee_band=p.employee_band,
        turnover_band=p.turnover_band,
    )
    slug = make_slug(db, p.name)
    org, assessment = create_assessment(db, profile, body.answers, slug=slug)
    return build_assessment_out(assessment, org)


@router.get("/{assessment_id}", response_model=AssessmentOut,
            summary="Retrieve a scored assessment with roadmap")
def get_assessment(assessment_id: int, db: Session = Depends(get_db)) -> AssessmentOut:
    result = load_assessment(db, assessment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Assessment not found")
    assessment, org = result
    return build_assessment_out(assessment, org)


@router.post("/{assessment_id}/dpia", response_model=DPIAOut,
             status_code=status.HTTP_201_CREATED,
             summary="Create or update the DPIA for an assessment")
def post_dpia(assessment_id: int, body: DPIAIn, db: Session = Depends(get_db)) -> DPIAOut:
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    dpia = db.query(DPIA).filter(DPIA.assessment_id == assessment_id).first()
    if dpia:
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(dpia, field, value)
    else:
        dpia = DPIA(assessment_id=assessment_id, **body.model_dump())
        db.add(dpia)

    db.commit()
    db.refresh(dpia)
    return DPIAOut.model_validate(dpia)


@router.get("/{assessment_id}/forms/{form_type}", response_model=ReportOut,
            summary="Enqueue a PDF form generation job (Form 1=registration, Form 9=dpia)")
def get_form(
    assessment_id: int,
    form_type: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> ReportOut:
    if form_type not in ("registration", "dpia", "report"):
        raise HTTPException(status_code=400, detail="form_type must be 'registration' or 'dpia'")

    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Return existing ready job, or a pending job that is recent (< 3 min).
    # Stale pending records mean the background task was never executed — treat as retriable.
    existing = (
        db.query(Report)
        .filter(Report.assessment_id == assessment_id, Report.form_type == form_type)
        .order_by(Report.created_at.desc())
        .first()
    )
    if existing and existing.status == "ready":
        return ReportOut.model_validate(existing)
    if existing and existing.status == "pending":
        created = existing.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) - created < timedelta(minutes=3):
            return ReportOut.model_validate(existing)
        # Stale — mark as error so we fall through and create a fresh one
        existing.status = "error"
        existing.error_message = "Generation timed out — retrying"
        existing.completed_at = datetime.now(timezone.utc)
        db.commit()

    report = Report(assessment_id=assessment_id, form_type=form_type, status="pending")
    db.add(report)
    db.commit()
    db.refresh(report)
    background_tasks.add_task(process_report, report.id)
    return ReportOut.model_validate(report)


@router.get("/{assessment_id}/forms/{form_type}/download",
            summary="Download the generated PDF for a form")
def download_form(
    assessment_id: int,
    form_type: str,
    db: Session = Depends(get_db),
) -> FileResponse:
    if form_type not in ("registration", "dpia", "report"):
        raise HTTPException(status_code=400, detail="Invalid form_type")

    report = (
        db.query(Report)
        .filter(
            Report.assessment_id == assessment_id,
            Report.form_type == form_type,
            Report.status == "ready",
        )
        .order_by(Report.created_at.desc())
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="PDF not ready — generate it first")

    path = Path(report.file_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="PDF file not found on disk")

    filename_map = {
        "registration": f"Form1_Registration_{assessment_id}.pdf",
        "dpia":         f"Form9_DPIA_{assessment_id}.pdf",
        "report":       f"Compliance_Report_{assessment_id}.pdf",
    }
    return FileResponse(
        path=str(path),
        media_type="application/pdf",
        filename=filename_map[form_type],
    )
