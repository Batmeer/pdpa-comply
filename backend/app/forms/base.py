"""
Base form generator — subclass for each numbered form (1, 4, 5, 6, 7, 9).
HTML rendered by Jinja2, converted to PDF by WeasyPrint (kept off the request path).
"""
from __future__ import annotations
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML, CSS

TEMPLATES_DIR = Path(__file__).parent / "templates"


class FormGenerator:
    template_name: str  # set by subclass

    def __init__(self) -> None:
        self._env = Environment(
            loader=FileSystemLoader(str(TEMPLATES_DIR)),
            autoescape=select_autoescape(["html"]),
        )

    def render_html(self, context: dict) -> str:
        return self._env.get_template(self.template_name).render(**context)

    def generate_pdf(self, context: dict, output_path: Path) -> None:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        html_string = self.render_html(context)
        HTML(string=html_string, base_url=str(TEMPLATES_DIR)).write_pdf(str(output_path))
