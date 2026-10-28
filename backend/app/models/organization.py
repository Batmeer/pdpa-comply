from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    sector: Mapped[str] = mapped_column(String(100))

    # OrgProfile flags
    registered: Mapped[bool] = mapped_column(Boolean, default=False)
    processes_sensitive_data: Mapped[bool] = mapped_column(Boolean, default=False)
    transfers_abroad: Mapped[bool] = mapped_column(Boolean, default=False)
    uses_processors: Mapped[bool] = mapped_column(Boolean, default=False)
    does_direct_marketing: Mapped[bool] = mapped_column(Boolean, default=False)
    uses_automated_decisions: Mapped[bool] = mapped_column(Boolean, default=False)
    processes_children_data: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public_institution: Mapped[bool] = mapped_column(Boolean, default=False)

    # Size bands — drive Form 1 fee field
    employee_band: Mapped[str] = mapped_column(String(20), default="1-49")
    turnover_band: Mapped[str] = mapped_column(String(20), default="<100M")

    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    assessments: Mapped[list[Assessment]] = relationship(
        "Assessment", back_populates="organization", cascade="all, delete-orphan"
    )
    quarterly_reports: Mapped[list[QuarterlyReport]] = relationship(
        "QuarterlyReport", back_populates="organization", cascade="all, delete-orphan"
    )
