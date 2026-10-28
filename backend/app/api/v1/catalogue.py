from fastapi import APIRouter
from app.engine.core import load_catalogue
from app.schemas.catalogue import CatalogueOut, ControlOut, MaturityBand, LegalAnchor

router = APIRouter()


@router.get("", response_model=CatalogueOut, summary="List all 52 PDPA controls")
def get_catalogue() -> CatalogueOut:
    cat = load_catalogue()
    controls = [
        ControlOut(
            id=c["id"],
            cluster=c["cluster"],
            legal_anchor=LegalAnchor(**c["legal_anchor"]),
            requirement=c["requirement"],
            severity=c["severity"],
            sensitivity_multiplier=c["sensitivity_multiplier"],
            applies_to=c["applies_to"],
            evidence=c["evidence"],
            is_dpia_trigger=c["is_dpia_trigger"],
            remediation=c["remediation"],
        )
        for c in cat["controls"]
    ]
    bands = [MaturityBand(**b) for b in cat["scoring"]["maturity_bands"]]
    return CatalogueOut(total=len(controls), controls=controls, maturity_bands=bands)
