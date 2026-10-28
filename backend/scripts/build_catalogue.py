"""
Generates catalogue.json — the machine-readable control catalogue.
The 52 controls derived from PDPA Cap 44 + Reg GN 449C.
Run: python build_catalogue.py  →  writes ../app/data/catalogue.json
"""
import json, os

# Applicability flag keys
ALL = "all"

# (id, cluster, act_anchor, reg_anchor, requirement, severity, sensitivity, applies, evidence, dpia_trigger, remediation)
CONTROLS = [
    # ---- A: Registration ----
    ("A-01","Registration","s.14(1)","Reg 4(1)","Organization must be registered with the PDPC as a data controller and/or processor before collecting or processing personal data.",5,1.0,ALL,"PDPC registration certificate (Form 2) number + date",False,"Submit Form 1 with incorporation documents and the prescribed fee to the PDPC."),
    ("A-02","Registration","s.14(1)","Reg 3, 4","Organization must register under the correct capacity — controller, processor, or both — matching how it actually handles data.",3,1.0,ALL,"Declared class matches processing reality",False,"Determine controller vs processor role and register accordingly."),
    ("A-03","Registration",None,"Reg 10(1)","Any change to registered particulars must be notified to the PDPC in writing within 14 days.",2,1.0,"registered","Record of change notifications",False,"Establish a process to notify the PDPC within 14 days of changes to name, address, data types, or DPO details."),
    ("A-04","Registration","s.16","Reg 7, 8","Registration valid 5 years; renewal applied for within 3 months before expiry, else re-registration required.",3,1.0,"registered","Expiry date tracked; renewal diarised",False,"Diarise certificate expiry and file Form 3 within the 3-month renewal window."),
    ("A-05","Registration",None,"Reg 4(2), Sch 2","Pay the registration fee matching the org size band (employees + turnover).",2,1.0,ALL,"Fee paid matches band",False,"Determine band: Small(1-49 & <100M)=100,000; Medium(50-99 & 100-500M)=200,000; Large(100+ & >500M)=1,000,000; public/religious per schedule."),

    # ---- B: Lawful & Fair Processing ----
    ("B-01","Lawful Processing","s.5(a)","Reg 23(a), 25","All personal data processed lawfully, fairly and transparently, with a lawful basis identified.",4,1.3,ALL,"Documented lawful basis per processing activity",False,"Map each processing activity to a lawful basis and document it."),
    ("B-02","Lawful Processing","s.5(b), s.25","Reg 23(b), 26","Data collected for explicit, specified, legitimate purposes and not used incompatibly.",4,1.0,ALL,"Purpose register; no incompatible secondary use",True,"Define and record the specific purpose for each dataset; restrict secondary use."),
    ("B-03","Lawful Processing","s.5(c)","Reg 23(c), 28","Data collected must be adequate, relevant and limited to what is necessary.",3,1.0,ALL,"Collection limited to necessary fields",False,"Audit collected fields; remove unnecessary data; apply minimisation per Reg 28."),
    ("B-04","Lawful Processing","s.23(1)-(2)",None,"Data collected directly from the subject, who is made aware of purposes, authorization and recipients before collection.",4,1.3,ALL,"Privacy notice shown at point of collection",False,"Deploy a collection notice at every collection point stating purpose, authorization and recipients."),
    ("B-05","Lawful Processing","s.22(3)",None,"Personal data must not be collected by unlawful means.",4,1.0,ALL,"Collection channels lawful and consented",False,"Review collection channels; eliminate covert or deceptive collection."),
    ("B-06","Lawful Processing","s.25(1)",None,"Data used only for the purpose collected, save lawful s.25(2) exceptions.",3,1.0,ALL,"Use audit shows no scope creep",False,"Restrict internal use to the registered purpose; document any s.25(2) exception."),
    ("B-07","Lawful Processing","s.26",None,"Data not disclosed to anyone other than the subject except per s.25 conditions.",4,1.3,ALL,"Disclosure log; third-party disclosures justified",False,"Implement a disclosure-control policy; log and justify every external disclosure."),

    # ---- C: Accuracy, Retention & Disposal ----
    ("C-01","Accuracy & Retention","s.5(d), s.24","Reg 23(d), 29","Data accurate, kept up to date, with inaccurate data erased/rectified without delay.",3,1.0,ALL,"Accuracy checks; rectification process",False,"Implement periodic accuracy verification and a without-delay rectification workflow."),
    ("C-02","Accuracy & Retention","s.5(e), s.28","Reg 23(e), 30","Data kept in identifiable form no longer than necessary; retention periods defined.",3,1.0,ALL,"Documented retention schedule",False,"Create a retention schedule per data category with defined periods and justification."),
    ("C-03","Accuracy & Retention","s.28","Reg 30(a),(d)","Clear internal procedures for deletion/destruction; deleted data not recoverable.",3,1.3,ALL,"Documented, tested disposal procedure",False,"Define and test secure deletion/destruction procedures ensuring irreversibility."),

    # ---- D: Security ----
    ("D-01","Security","s.27(1)-(2)","Reg 23(g), 27","Technical and organizational measures appropriate to risk protect data against loss, unauthorized access, alteration or processing.",5,1.5,ALL,"Security policy + implemented controls",False,"Implement a security baseline covering the Reg 27 factors sized to the data's risk."),
    ("D-02","Security",None,"Reg 27(a)","An operative means of managing information-security policies and procedures must exist.",3,1.3,ALL,"Written, maintained infosec policy",False,"Adopt and maintain an information security policy with assigned ownership."),
    ("D-03","Security",None,"Reg 27(b)","Risks to personal-data security assessed and countermeasures put in place.",3,1.3,ALL,"Documented risk assessment + treatment",False,"Conduct a security risk assessment and implement controls for identified risks."),
    ("D-04","Security",None,"Reg 27(d)","Only authorized personnel may access personal data necessary for their tasks.",4,1.5,ALL,"Access-control matrix; role-based access",False,"Implement role-based access control and remove unnecessary access rights."),
    ("D-05","Security",None,"Reg 27(e)","Transfer of personal data secured against unauthorized access and changes.",4,1.5,ALL,"Encryption in transit (TLS) on data flows",False,"Enforce encryption (TLS/equivalent) on all personal-data transmissions."),
    ("D-06","Security",None,"Reg 27(f)","Storage of personal data secured against unauthorized use, access and alterations.",4,1.5,ALL,"Encryption/controls at rest; restricted storage",False,"Secure storage with access restrictions and, where feasible, encryption at rest."),
    ("D-07","Security",None,"Reg 27(g)","Backups and logs kept to the extent necessary for data security.",3,1.3,ALL,"Backup regime + retained logs",False,"Implement a backup schedule and retain security logs."),
    ("D-08","Security",None,"Reg 27(h)","Audit trails and event monitoring used as routine security controls.",3,1.3,ALL,"Monitoring/logging in place and reviewed",True,"Enable audit logging and routine event monitoring/alerting."),
    ("D-09","Security",None,"Reg 27(i)","Sensitive data protected with adequate measures and, where possible, kept separate.",4,1.5,"processes_sensitive_data","Sensitive data logically/physically segregated",True,"Segregate sensitive data stores and apply enhanced protection."),
    ("D-10","Security",None,"Reg 27(j)","Procedures to detect, handle, report and learn from personal-data breaches.",4,1.3,ALL,"Incident-response procedure documented + tested",False,"Establish an incident-response plan covering detection, handling, reporting and lessons-learned."),
    ("D-11","Security",None,"Reg 27(k)","Software supporting processing regularly reviewed and tested for vulnerabilities.",3,1.3,ALL,"Regular vulnerability testing records",False,"Schedule periodic vulnerability assessments/testing of processing systems."),
    ("D-12","Security",None,"Reg 24","Data-protection mechanisms and technical measures built in by design and default.",3,1.3,ALL,"Privacy-by-design evidenced in systems",False,"Embed data-protection requirements into system design and default configurations."),
    ("D-13","Security","s.27(5)",None,"Controller must notify the PDPC without undue delay of any security breach affecting personal data.",5,1.5,ALL,"Breach-notification procedure naming PDPC + timeline",False,"Add a PDPC breach-notification step (without undue delay) to the incident-response plan."),

    # ---- E: DPO ----
    ("E-01","DPO","s.27(3)","Reg 32","Every controller and processor must appoint a DPO. No thresholds — universal.",5,1.0,ALL,"DPO appointment record; DPO details in registration",False,"Appoint a DPO (may be existing staff) and record their details, including in the PDPC registration."),
    ("E-02","DPO",None,"Reg 32(a)-(b)","DPO must ensure compliance and advise on rectification of violations.",3,1.0,ALL,"DPO monitoring activity/records",False,"Define the DPO's monitoring mandate and reporting lines internally."),
    ("E-03","DPO",None,"Reg 32(c)","DPO must prepare and submit quarterly compliance reports to the PDPC.",4,1.0,ALL,"Evidence of quarterly submissions",False,"Establish a quarterly reporting cycle to the PDPC."),
    ("E-04","DPO",None,"Reg 32(d)","DPO must handle applications/complaints from data subjects.",3,1.0,ALL,"Complaint-handling channel routed via DPO",False,"Create a data-subject complaint channel managed by the DPO."),
    ("E-05","DPO","s.27(4)",None,"Where a processor is used, a contract binds it to the controller's instructions and security standards.",4,1.3,"uses_processors","Signed data-processing agreement(s)",False,"Put data-processing agreements in place with all processors."),

    # ---- F: Data Subject Rights ----
    ("F-01","Data Subject Rights","s.33",None,"Subjects can obtain confirmation of processing, a description of their data, purposes, and recipients.",3,1.0,ALL,"Subject-access request (SAR) procedure",False,"Implement a SAR procedure with defined response steps."),
    ("F-02","Data Subject Rights","s.34","Reg 15","Subjects can require suspension of processing likely to cause substantial damage; controller acknowledges within 72 hours.",3,1.0,ALL,"Form 4 workflow with 72-hour acknowledgement",False,"Build a Form 4 handling workflow with 72-hour acknowledgement and 7-day decision."),
    ("F-03","Data Subject Rights","s.29, s.38","Reg 16","Subjects can apply (Form 5) to rectify incorrect data; controller responds within 14 days.",3,1.0,ALL,"Rectification workflow (Form 5), 14-day SLA",False,"Implement a Form 5 rectification workflow with 14-day decision and pre-amendment record retention."),
    ("F-04","Data Subject Rights",None,"Reg 17","Subjects can apply (Form 6) to erase data on defined grounds; controller responds within 14 days, subject to exceptions.",3,1.0,ALL,"Erasure workflow (Form 6), 14-day SLA, exception checks",False,"Implement a Form 6 erasure workflow including the Reg 17(4) exception checks."),
    ("F-05","Data Subject Rights","s.35",None,"Subjects can require the controller to stop processing for direct marketing.",2,1.0,"does_direct_marketing","Opt-out mechanism",False,"Provide a direct-marketing opt-out and honour it."),
    ("F-06","Data Subject Rights","s.36","Reg 19","Where a decision significantly affecting a subject is solely automated, subject must be notified and may require human reconsideration.",3,1.3,"uses_automated_decisions","Notice + human-review path",True,"Notify subjects of solely-automated decisions and provide a human-reconsideration route."),
    ("F-07","Data Subject Rights","s.37",None,"Org recognizes subjects' right to compensation for damage from contraventions.",2,1.0,ALL,"Liability awareness/policy reference",False,"Document liability exposure and reference it in the data-protection policy."),
    ("F-08","Data Subject Rights",None,"Reg 18(2)","Where the subject is a child, special handling — representative identification, consent rules, parent/guardian informed of risks.",4,1.5,"processes_children_data","Child-data handling procedure",True,"Implement child/vulnerable-person handling per Reg 18(2)."),

    # ---- G: Sensitive Data ----
    ("G-01","Sensitive Data","s.30(1)",None,"Sensitive personal data not processed without prior written consent (save s.30(5) exceptions).",5,1.5,"processes_sensitive_data","Written consent records for sensitive data",True,"Obtain and record prior written consent for all sensitive-data processing, or document a s.30(5) exception."),
    ("G-02","Sensitive Data","s.30(2)",None,"Consent for sensitive data withdrawable at any time without explanation or charge.",3,1.5,"processes_sensitive_data","Withdrawal mechanism + handling",False,"Provide a free, no-explanation consent-withdrawal mechanism."),
    ("G-03","Sensitive Data","s.30(4)",None,"Where the subject is a minor or unable to consent, consent comes from parent/guardian/legal representative.",4,1.5,"processes_children_data","Representative-consent records",True,"Implement representative-consent capture for minors/incapable persons."),

    # ---- H: Transborder Flow ----
    ("H-01","Transborder Flow","s.31, s.32","Reg 20","Data not transferred outside Tanzania without a lawful basis — adequacy, transfer permit (Form 7), or s.32(4) exception.",4,1.3,"transfers_abroad","Form 8 permit or documented adequacy/exception",False,"Apply for a transfer permit (Form 7) or document the adequacy/exception basis before any cross-border transfer."),
    ("H-02","Transborder Flow",None,"Reg 22","Where a permit is issued, transfer conditions (authorized recipient, purpose limitation, no onward transfer) honoured.",3,1.3,"transfers_abroad","Compliance with permit conditions",False,"Enforce permit conditions in transfer agreements and operations."),

    # ---- I: DPIA ----
    ("I-01","DPIA",None,"Reg 33(1)-(2)","Before processing likely to affect rights/freedoms, a DPIA (Form 9) must be conducted.",4,1.3,"dpia_required","Completed Form 9 DPIA(s)",False,"Conduct a Form 9 DPIA for each triggering activity."),
    ("I-02","DPIA",None,"Reg 34(1)","Where the DPIA indicates likely impact, the controller requests PDPC instructions, attaching the report.",3,1.3,"dpia_required","PDPC submission record",False,"Submit high-impact DPIA results to the PDPC and observe Reg 34 timelines."),

    # ---- J: Accountability & Governance ----
    ("J-01","Accountability","s.65(1)-(2)",None,"Every controller must draw up a code of ethics / data-protection policy and submit it to the PDPC for approval.",3,1.0,ALL,"Written policy + PDPC submission",False,"Draft a data-protection code of ethics/policy and submit to the PDPC for approval."),
    ("J-02","Accountability","s.5","Reg 23","Org maintains records of processing activities (categories, purposes) to demonstrate accountability.",3,1.0,ALL,"Processing register / ROPA",False,"Build and maintain a record of processing activities."),
    ("J-03","Accountability","s.27","Reg 27(d)","Staff handling personal data trained to handle it responsibly.",2,1.0,ALL,"Training records",False,"Run periodic data-protection awareness training."),
    ("J-04","Accountability","s.21",None,"Public institutions deemed registered on commencement but must still comply fully.",2,1.0,"is_public_institution","Compliance despite deemed registration",False,"For public bodies — confirm deemed-registration status and ensure full substantive compliance."),
]

# The 10 Reg 33(2) DPIA-trigger conditions (used by the applicability engine to set dpia_required)
DPIA_TRIGGERS = {
    "a": "Automated decisions with significant legal effect / profiling / sensitive data gating access",
    "b": "Large-scale repurposing of personal data",
    "c": "Processing of biometric or genetic data",
    "d": "Significant changes raising risk at any processing stage",
    "e": "Sensitive data of children or vulnerable groups",
    "f": "Combining/cross-referencing datasets from different sources/purposes",
    "g": "Large-scale processing of personal data",
    "h": "Systematic monitoring of public areas at scale",
    "i": "Innovative use of new technological/organizational measures",
    "j": "Processing that prevents subjects exercising their rights",
}

STATUS_MODIFIERS = {"COMPLIANT": 0.0, "PARTIAL": 0.5, "NON_COMPLIANT": 1.0, "REVIEW_REQUIRED": 0.5}
MATURITY_BANDS = [
    {"min": 0,  "max": 25,  "label": "Initial"},
    {"min": 26, "max": 50,  "label": "Developing"},
    {"min": 51, "max": 75,  "label": "Managed"},
    {"min": 76, "max": 100, "label": "Optimized"},
]

def build():
    controls = []
    for (cid, cluster, act, reg, req, sev, sens, applies, evidence, dpia, remediation) in CONTROLS:
        controls.append({
            "id": cid,
            "cluster": cluster,
            "legal_anchor": {"act_section": act, "regulation": reg},
            "requirement": req,
            "severity": sev,
            "sensitivity_multiplier": sens,
            "applies_to": applies,            # "all" or an org-profile flag key
            "evidence": evidence,
            "is_dpia_trigger": dpia,          # failing this also signals a mandatory DPIA
            "remediation": remediation,
        })
    return {
        "meta": {
            "version": "2.0",
            "law": "Personal Data Protection Act, Cap 44 (Act No. 11 of 2022)",
            "regulations": "Personal Data Protection (Collection and Processing) Regulations, 2023 (GN 449C)",
            "control_count": len(controls),
        },
        "scoring": {
            "formula": "control_gap = severity * sensitivity_multiplier * status_modifier",
            "status_modifiers": STATUS_MODIFIERS,
            "maturity_bands": MATURITY_BANDS,
        },
        "dpia_triggers": DPIA_TRIGGERS,
        "applicability_flags": [
            "processes_sensitive_data","transfers_abroad","uses_processors",
            "does_direct_marketing","uses_automated_decisions","processes_children_data",
            "is_public_institution","registered","dpia_required",
        ],
        "controls": controls,
    }

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "app", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "catalogue.json")
    catalogue = build()
    with open(out_path, "w") as f:
        json.dump(catalogue, f, indent=2)
    print(f"Wrote {catalogue['meta']['control_count']} controls to {out_path}")
    # sanity: cluster counts
    from collections import Counter
    counts = Counter(c["cluster"] for c in catalogue["controls"])
    for cl, n in counts.items():
        print(f"  {cl}: {n}")
