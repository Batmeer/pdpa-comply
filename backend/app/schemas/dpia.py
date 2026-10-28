from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DPIAIn(BaseModel):
    """POST /assessments/{id}/dpia request body."""
    description: str | None = None
    necessity_proportionality: str | None = None
    risk_identification: dict | None = None
    mitigation_measures: dict | None = None
    dpo_review: str | None = None
    approved: bool = False


class DPIAOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assessment_id: int
    description: str | None
    necessity_proportionality: str | None
    risk_identification: dict | None
    mitigation_measures: dict | None
    dpo_review: str | None
    approved: bool
    created_at: datetime
    updated_at: datetime
