"""Form 1 — Application for Registration (Reg 4(1), Second Schedule)."""
from __future__ import annotations
from app.forms.base import FormGenerator
from app.models import Organization, Assessment

# Fee matrix per A-05 / Second Schedule (TZS)
# Band: (employee_band, turnover_band) → fee
# Where criteria conflict, the higher band determines the fee.
_EMPLOYEE_RANK = {"1-49": 0, "50-99": 1, "100+": 2}
_TURNOVER_RANK = {"<100M": 0, "100-500M": 1, ">500M": 2}
_FEE_BY_RANK = {0: 100_000, 1: 200_000, 2: 1_000_000}


def calculate_fee(employee_band: str, turnover_band: str) -> int:
    rank = max(
        _EMPLOYEE_RANK.get(employee_band, 0),
        _TURNOVER_RANK.get(turnover_band, 0),
    )
    return _FEE_BY_RANK[rank]


def fee_band_label(employee_band: str, turnover_band: str) -> str:
    rank = max(
        _EMPLOYEE_RANK.get(employee_band, 0),
        _TURNOVER_RANK.get(turnover_band, 0),
    )
    return {0: "Small", 1: "Medium", 2: "Large"}[rank]


class Form1Generator(FormGenerator):
    template_name = "form1.html"

    def build_context(self, org: Organization, assessment: Assessment) -> dict:
        fee = calculate_fee(org.employee_band, org.turnover_band)
        band = fee_band_label(org.employee_band, org.turnover_band)

        reg_class_parts = []
        if org.registered:
            reg_class_parts.append("Data Controller")
        if org.uses_processors:
            reg_class_parts.append("Data Processor")
        if not reg_class_parts:
            reg_class_parts.append("Data Controller")

        return {
            "org": org,
            "assessment": assessment,
            "registration_class": " / ".join(reg_class_parts),
            "fee_tzs": fee,
            "fee_band": band,
            "fee_formatted": f"TZS {fee:,}",
        }
