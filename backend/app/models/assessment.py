from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), index=True)

    # Mirrors AssessmentResult from engine
    score: Mapped[float] = mapped_column(Float)
    maturity: Mapped[str] = mapped_column(String(50))
    applicable_count: Mapped[int] = mapped_column(Integer)
    compliant_count: Mapped[int] = mapped_column(Integer)
    partial_count: Mapped[int] = mapped_column(Integer)
    non_compliant_count: Mapped[int] = mapped_column(Integer)
    review_count: Mapped[int] = mapped_column(Integer)
    cluster_scores: Mapped[dict] = mapped_column(JSON)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    integrity_hash: Mapped[str] = mapped_column(String(64))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    organization: Mapped[Organization] = relationship("Organization", back_populates="assessments")
    control_responses: Mapped[list[ControlResponse]] = relationship(
        "ControlResponse", back_populates="assessment", cascade="all, delete-orphan"
    )
    reports: Mapped[list[Report]] = relationship(
        "Report", back_populates="assessment", cascade="all, delete-orphan"
    )
    dpia: Mapped[DPIA | None] = relationship(
        "DPIA", back_populates="assessment", uselist=False, cascade="all, delete-orphan"
    )
    quarterly_reports: Mapped[list[QuarterlyReport]] = relationship(
        "QuarterlyReport", back_populates="assessment"
    )
