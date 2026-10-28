# PDPA-Comply

A compliance self-assessment tool for Tanzania's **Personal Data Protection Act, Cap. 44 (Act No. 11 of 2022)** and its regulations (GN 449C).

The tool takes an organisation through a structured questionnaire and scores the answers against 52 controls, each mapped to a PDPA legal anchor. It produces:

- A compliance score and maturity rating
- A prioritised remediation roadmap, with the highest-impact fixes first
- Auto-filled PDFs:
  - **Form 1**: PDPC registration
  - **Form 9**: DPIA, generated only when the risk profile requires one
  - **Full Compliance Report**: gap analysis, section breakdowns and the action plan

> For internal readiness use only. This is not legal advice or an official PDPC determination.

## Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, SQLite, Pydantic v2, Jinja2, WeasyPrint
- **Frontend:** React 18, TypeScript, Vite, React Router v6, CSS Modules
- **Launcher:** `concurrently`, which runs the API and the web app in one terminal

## Architecture

1. **Engine** (`backend/app/engine/core.py`): pure, deterministic scoring with no DB or HTTP dependencies. It loads the control catalogue (`app/data/catalogue.json`), filters controls by applicability (sector, sensitive data, cross-border transfers, automated decisions, children's data), applies severity and sensitivity multipliers, and returns a scored result with a roadmap.
2. **API** (`backend/app/api/v1/`): FastAPI routes that persist assessments, serve the catalogue and demo data, and queue form generation.
3. **Forms** (`backend/app/forms/`): an asynchronous PDF pipeline. A `Report` record is created as `pending`, a background worker renders the Jinja2 template through WeasyPrint, and the frontend polls the record until it is `ready`.

## Run locally

Prerequisites: Node 18+, Python 3.11+, and the WeasyPrint system libraries (on Windows, install the [GTK runtime](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer)).

```bash
cd backend && pip install -r requirements.txt && cd ..
npm run install:all
npm start          # Windows: or double-click start.bat
```

- Web: http://localhost:5173
- API: http://localhost:8000 (docs at `/docs`)

The SQLite database is created on first start and seeded with three demo organisations.

## Demo organisations (synthetic data)

- **Bahari Health Centre** (healthcare): sensitive health data, cross-border transfers and automated decisions. It is high-risk, so a DPIA is required.
- **Unique Academy** (education): processes children's data, with a medium-risk profile.
- **Rafiki Commercial Bank** (financial services): automated credit decisions and partner transfers abroad. It is the most complex profile.

All demo profiles and scores are fictional and illustrative.

## Author

Samir Jamal Msami, Cybersecurity, Unique Academy University, Dar es Salaam, Tanzania
