from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal

EmployeeBand = Literal["1-49", "50-99", "100+"]
TurnoverBand = Literal["<100M", "100-500M", ">500M"]


class OrgProfileIn(BaseModel):
    """Input schema — mirrors engine.OrgProfile."""
    name: str = Field(..., min_length=1, max_length=255)
    sector: str = Field(..., min_length=1, max_length=100)
    registered: bool = False
    processes_sensitive_data: bool = False
    transfers_abroad: bool = False
    uses_processors: bool = False
    does_direct_marketing: bool = False
    uses_automated_decisions: bool = False
    processes_children_data: bool = False
    is_public_institution: bool = False
    employee_band: EmployeeBand = "1-49"
    turnover_band: TurnoverBand = "<100M"


class OrganizationOut(BaseModel):
    """Response schema for a stored organization."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    sector: str
    registered: bool
    processes_sensitive_data: bool
    transfers_abroad: bool
    uses_processors: bool
    does_direct_marketing: bool
    uses_automated_decisions: bool
    processes_children_data: bool
    is_public_institution: bool
    employee_band: str
    turnover_band: str
    is_demo: bool
    created_at: datetime
