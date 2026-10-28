"""
Background PDF generator — runs after the HTTP response is sent.
Never call from the request path (WeasyPrint can take 10-100s).
"""
from __future__ import annotations
import os
from datetime import datetime, timezone
from pathlib import Path
from sqlalchemy.orm import joinedload

from app.core.database import SessionLocal
from app.models import Report, Assessment, Organization, DPIA
from app.forms.form1 import Form1Generator
from app.forms.form9 import Form9Generator
from app.forms.full_report import FullReportGenerator

OUTPUT_DIR = Path(os.getenv("FORMS_OUTPUT_DIR", "generated_forms"))


def process_report(report_id: int) -> None:
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report or report.status != "pending":
            return

        assessment = (
            db.query(Assessment)
            .options(
                joinedload(Assessment.organization),
                joinedload(Assessment.control_responses),
            )
            .filter(Assessment.id == report.assessment_id)
            .first()
        )
        if not assessment:
            _fail(db, report, "Assessment not found")
            return

        org: Organization = assessment.organization
        output_path = OUTPUT_DIR / f"report_{report_id}_{report.form_type}.pdf"

        if report.form_type == "registration":
            gen = Form1Generator()
            context = gen.build_context(org, assessment)
            gen.generate_pdf(context, output_path)

        elif report.form_type == "dpia":
            dpia = db.query(DPIA).filter(DPIA.assessment_id == assessment.id).first()
            gen = Form9Generator()
            context = gen.build_context(org, assessment, dpia)
            gen.generate_pdf(context, output_path)

        elif report.form_type == "report":
            gen = FullReportGenerator()
            context = gen.build_context(org, assessment)
            gen.generate_pdf(context, output_path)

        else:
            _fail(db, report, f"Unknown form_type: {report.form_type}")
            return

        report.status = "ready"
        report.file_path = str(output_path)
        report.completed_at = datetime.now(timezone.utc)
        db.commit()

    except Exception as exc:
        _fail(db, report, str(exc))
    finally:
        db.close()


def _fail(db, report: Report, message: str) -> None:
    report.status = "error"
    report.error_message = message
    report.completed_at = datetime.now(timezone.utc)
    db.commit()
