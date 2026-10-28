from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class DPIA(Base):
    """Data Protection Impact Assessment — required when OrgProfile.dpia_required() is True (Reg 33(2))."""
    __tablename__ = "dpias"

    id: Mapped[int] = mapped_column(primary_key=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id"), unique=True, index=True)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    necessity_proportionality: Mapped[str | None] = mapped_column(Text, nullable=True)
    risk_identification: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    mitigation_measures: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    dpo_review: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    assessment: Mapped[Assessment] = relationship("Assessment", back_populates="dpia")
