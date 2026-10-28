from __future__ import annotations
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class ControlResponse(Base):
    """One row per answered control per assessment."""
    __tablename__ = "control_responses"

    id: Mapped[int] = mapped_column(primary_key=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id"), index=True)

    control_id: Mapped[str] = mapped_column(String(10))   # e.g. "A-01"
    cluster: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20))        # COMPLIANT | PARTIAL | NON_COMPLIANT | REVIEW_REQUIRED
    severity: Mapped[int] = mapped_column(Integer)
    sensitivity_multiplier: Mapped[float] = mapped_column(Float)
    gap: Mapped[float] = mapped_column(Float)
    max_gap: Mapped[float] = mapped_column(Float)

    assessment: Mapped[Assessment] = relationship("Assessment", back_populates="control_responses")
