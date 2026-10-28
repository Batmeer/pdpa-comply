from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class QuarterlyReport(Base):
    """Quarterly PDPC submission — required for registered organizations (Reg E-03)."""
    __tablename__ = "quarterly_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), index=True)
    assessment_id: Mapped[int | None] = mapped_column(ForeignKey("assessments.id"), nullable=True)

    quarter: Mapped[str] = mapped_column(String(10))   # e.g. "2024-Q1"
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft | submitted

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    organization: Mapped[Organization] = relationship("Organization", back_populates="quarterly_reports")
    assessment: Mapped[Assessment | None] = relationship("Assessment", back_populates="quarterly_reports")
