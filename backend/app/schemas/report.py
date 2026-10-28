from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict

FormType = Literal["registration", "dpia", "report"]
ReportStatus = Literal["pending", "ready", "error"]


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assessment_id: int
    form_type: FormType
    status: ReportStatus
    file_path: str | None
    error_message: str | None
    created_at: datetime
    completed_at: datetime | None
