"""Form 9 — Data Protection Impact Assessment (Reg 33, First Schedule)."""
from __future__ import annotations
from app.forms.base import FormGenerator
from app.models import Organization, Assessment, DPIA


class Form9Generator(FormGenerator):
    template_name = "form9.html"

    def build_context(
        self,
        org: Organization,
        assessment: Assessment,
        dpia: DPIA | None,
    ) -> dict:
        triggers = []
        if org.uses_automated_decisions:
            triggers.append("Automated decision-making [Reg 33(2)(a)]")
        if org.processes_sensitive_data:
            triggers.append("Sensitive personal data [Reg 33(2)(c)]")
        if org.processes_children_data:
            triggers.append("Children's data [Reg 33(2)(e)]")

        return {
            "org": org,
            "assessment": assessment,
            "dpia": dpia,
            "dpia_triggers": triggers,
        }
