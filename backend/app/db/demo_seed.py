"""
Three synthetic demo organizations with fabricated answers.
Used to seed the database and power the demo experience.
All fictional — no real entity, no real data.
"""
from app.engine.core import OrgProfile

# Status shorthand for readability
C = "COMPLIANT"
P = "PARTIAL"
N = "NON_COMPLIANT"
R = "REVIEW_REQUIRED"


# ---------------------------------------------------------------------------
# 1. Unique Academy — education, moderate (Developing/Managed)
# ---------------------------------------------------------------------------
UNIQUE_ACADEMY_PROFILE = OrgProfile(
    name="Unique Academy",
    sector="Education",
    registered=True,
    processes_sensitive_data=True,      # student health/disability records
    uses_processors=True,               # cloud LMS / payroll vendor
    processes_children_data=True,       # some under-18 students
    employee_band="50-99",
    turnover_band="100-500M",
)

UNIQUE_ACADEMY_ANSWERS = {
    # Registration — mostly done
    "A-01": C, "A-02": C, "A-03": P, "A-04": C, "A-05": C,
    # Lawful processing — decent but notice gaps
    "B-01": P, "B-02": C, "B-03": P, "B-04": N, "B-05": C, "B-06": C, "B-07": P,
    # Accuracy/retention — partial
    "C-01": C, "C-02": P, "C-03": N,
    # Security — mixed (a school, not hardened)
    "D-01": P, "D-02": P, "D-03": N, "D-04": C, "D-05": C, "D-06": P, "D-07": C,
    "D-08": N, "D-09": N, "D-10": P, "D-11": N, "D-12": P, "D-13": N,
    # DPO — appointed but incomplete duties
    "E-01": C, "E-02": P, "E-03": N, "E-04": P, "E-05": P,
    # Data subject rights — basic
    "F-01": P, "F-02": N, "F-03": P, "F-04": N, "F-06": R, "F-08": P,
    # Sensitive data (health/disability)
    "G-01": P, "G-02": N, "G-03": P,
    # DPIA
    "I-01": N, "I-02": N,
    # Accountability
    "J-01": N, "J-02": P, "J-03": P,
}


# ---------------------------------------------------------------------------
# 2. Bahari Health Centre — health, low (Initial/Developing, many gaps)
# ---------------------------------------------------------------------------
BAHARI_HEALTH_PROFILE = OrgProfile(
    name="Bahari Health Centre",
    sector="Health",
    registered=False,                   # not yet registered — major gap
    processes_sensitive_data=True,      # health data — heaviest
    uses_processors=True,               # lab / billing vendor
    processes_children_data=True,       # paediatric patients
    uses_automated_decisions=False,
    employee_band="50-99",
    turnover_band="100-500M",
)

BAHARI_HEALTH_ANSWERS = {
    # Registration — not done
    "A-01": N, "A-02": N, "A-03": R, "A-04": R, "A-05": N,
    # Lawful processing — weak
    "B-01": N, "B-02": P, "B-03": N, "B-04": N, "B-05": P, "B-06": P, "B-07": N,
    # Accuracy/retention
    "C-01": P, "C-02": N, "C-03": N,
    # Security — poor for sensitive health data (high impact via x1.5)
    "D-01": N, "D-02": N, "D-03": N, "D-04": P, "D-05": N, "D-06": N, "D-07": P,
    "D-08": N, "D-09": N, "D-10": N, "D-11": N, "D-12": N, "D-13": N,
    # DPO — none
    "E-01": N, "E-02": N, "E-03": N, "E-04": N, "E-05": N,
    # Data subject rights
    "F-01": N, "F-02": N, "F-03": N, "F-04": N, "F-06": R, "F-08": N,
    # Sensitive data — critical gaps
    "G-01": N, "G-02": N, "G-03": N,
    # DPIA — required (sensitive + children) but not done
    "I-01": N, "I-02": N,
    # Accountability
    "J-01": N, "J-02": N, "J-03": N,
}


# ---------------------------------------------------------------------------
# 3. Rafiki Commercial Bank — finance, mature (Managed, well-resourced w/ targeted gaps)
# ---------------------------------------------------------------------------
RAFIKI_BANK_PROFILE = OrgProfile(
    name="Rafiki Commercial Bank",
    sector="Financial Services",
    registered=True,
    processes_sensitive_data=True,      # financial transaction data = sensitive (Act s.3)
    uses_processors=True,               # core-banking / card / cloud vendors
    does_direct_marketing=True,         # product cross-sell campaigns
    uses_automated_decisions=True,      # automated credit scoring / fraud screening
    processes_children_data=False,      # adult account holders (minors via guardians, kept out for clarity)
    employee_band="100+",
    turnover_band=">500M",
)

# A BoT-regulated bank: strong security & governance, but real gaps in
# DPIA, data-subject-rights tooling, quarterly PDPC reporting, and marketing opt-out.
RAFIKI_BANK_ANSWERS = {
    # Registration — fully done
    "A-01": C, "A-02": C, "A-03": C, "A-04": C, "A-05": C,
    # Lawful processing — strong, minor transparency gap
    "B-01": C, "B-02": C, "B-03": C, "B-04": P, "B-05": C, "B-06": C, "B-07": C,
    # Accuracy/retention — good
    "C-01": C, "C-02": C, "C-03": P,
    # Security — strong (BoT cyber guidelines), few partials
    "D-01": C, "D-02": C, "D-03": C, "D-04": C, "D-05": C, "D-06": C, "D-07": C,
    "D-08": C, "D-09": P, "D-10": C, "D-11": P, "D-12": P, "D-13": C,
    # DPO — appointed, but quarterly PDPC reporting lagging
    "E-01": C, "E-02": C, "E-03": P, "E-04": C, "E-05": C,
    # Data subject rights — partial tooling; automated-decision notice is the weak spot
    "F-01": C, "F-02": P, "F-03": C, "F-04": P, "F-05": N, "F-06": N, "F-07": P,
    # Sensitive data (financial) — consent handling mostly there
    "G-01": P, "G-02": P,
    # (G-03 not applicable — no children's data)
    # DPIA — required (sensitive + automated decisions) but not formalized: the headline gap
    "I-01": N, "I-02": N,
    # Accountability — strong governance
    "J-01": P, "J-02": C, "J-03": C,
}


DEMOS = {
    "unique-academy": (UNIQUE_ACADEMY_PROFILE, UNIQUE_ACADEMY_ANSWERS),
    "bahari-health":  (BAHARI_HEALTH_PROFILE, BAHARI_HEALTH_ANSWERS),
    "rafiki-bank": (RAFIKI_BANK_PROFILE, RAFIKI_BANK_ANSWERS),
}
