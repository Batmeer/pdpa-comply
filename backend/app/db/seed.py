"""
Startup seeder — inserts the 3 synthetic demo orgs if they don't exist.
Idempotent: safe to call on every startup.
"""
from sqlalchemy.orm import Session
from app.models import Organization
from app.db.demo_seed import DEMOS
from app.services.assessment import create_assessment


def run_seed(db: Session) -> None:
    for slug, (profile, answers) in DEMOS.items():
        exists = db.query(Organization).filter(Organization.slug == slug).first()
        if not exists:
            create_assessment(db, profile, answers, slug=slug, is_demo=True)
            print(f"[seed] seeded {slug}")
        else:
            print(f"[seed] {slug} already exists, skipping")
