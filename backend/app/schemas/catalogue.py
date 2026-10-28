from pydantic import BaseModel


class LegalAnchor(BaseModel):
    act_section: str | None = None
    regulation: str | None = None


class ControlOut(BaseModel):
    id: str
    cluster: str
    legal_anchor: LegalAnchor
    requirement: str
    severity: int
    sensitivity_multiplier: float
    applies_to: str
    evidence: str
    is_dpia_trigger: bool
    remediation: str


class MaturityBand(BaseModel):
    min: float
    max: float
    label: str


class CatalogueOut(BaseModel):
    total: int
    controls: list[ControlOut]
    maturity_bands: list[MaturityBand]
