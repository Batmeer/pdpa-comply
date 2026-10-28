import { useNavigate } from 'react-router-dom'
import { ShieldMotif } from '../components/ShieldMotif'
import { Watermark } from '../components/Watermark'
import s from './About.module.css'

/* ── Inline icons (replaces Tabler) ─────────── */
function IconBank() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v1H3V9z"/>
      <rect x="5" y="10" width="3" height="8"/><rect x="10.5" y="10" width="3" height="8"/><rect x="16" y="10" width="3" height="8"/>
      <line x1="2" y1="18" x2="22" y2="18"/><line x1="2" y1="21" x2="22" y2="21"/>
    </svg>
  )
}
function IconHealth() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 3-5 11-5 11S7 10 7 7a5 5 0 0 1 5-5z"/>
      <circle cx="12" cy="7" r="2"/>
    </svg>
  )
}
function IconSchool() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>
    </svg>
  )
}
function IconNgo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

const WHO_ROWS = [
  { icon: <IconBank />,   text: 'Banks, microfinance institutions, and SACCOs that hold customer records' },
  { icon: <IconHealth />, text: 'Hospitals, health centres, and clinics that handle patient data' },
  { icon: <IconSchool />, text: 'Schools and universities with student enrolment data' },
  { icon: <IconNgo />,    text: 'NGOs and charities collecting beneficiary information' },
  { icon: null,           text: 'Employers who process employee personal data' },
  { icon: null,           text: 'Any business with a customer database, loyalty programme, or mailing list' },
]

const MUST_DO = [
  {
    title: 'Register with the PDPC',
    text: 'All organisations that process personal data must register with the Personal Data Protection Commission and pay the appropriate registration fee based on their size.',
  },
  {
    title: 'Appoint a Data Protection Officer',
    text: 'Organisations that process sensitive data or large volumes of personal data must appoint a DPO and register their details with the PDPC. The DPO submits quarterly compliance reports.',
  },
  {
    title: 'Keep data safe',
    text: 'Put appropriate security measures in place to protect personal data from loss, theft, and unauthorised access. You must also have a written plan for responding to breaches.',
  },
  {
    title: "Respect people's rights",
    text: 'Individuals can request access to, correction of, or deletion of their personal data. Respond within the time limits set by the Act with documented processes.',
  },
  {
    title: 'Keep proper records',
    text: 'Maintain a written record of all personal data processing activities: what you collect, why, how long you keep it, and who can access it.',
  },
]

const TOC = [
  { id: 'what',   label: 'What is the PDPA?' },
  { id: 'who',    label: 'Who must comply?' },
  { id: 'do',     label: 'What you must do' },
  { id: 'dont',   label: 'If you don\'t comply' },
]

export function About() {
  const nav = useNavigate()

  return (
    <div className={s.page}>
      <Watermark />

      {/* ── Hero strip ── */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <h1 className={s.headline}>What is Tanzania's data protection law?</h1>
          <p className={s.sub}>
            A plain-English guide to the Personal Data Protection Act: what it means,
            who it affects, and what you need to do.
          </p>
        </div>
      </section>

      {/* ── Two-column body ── */}
      <div className={s.outer}>
        <div className={s.layout}>

          {/* ── LEFT: article ── */}
          <article className={s.article}>

            <section id="what" className={s.section}>
              <h2 className={s.h2}>What is the PDPA?</h2>
              <p className={s.para}>
                Tanzania's Personal Data Protection Act (Cap 44, Act No. 11 of 2022) is the country's
                main data protection law. It governs how any organisation (whether a business, NGO,
                government body, or school) collects, stores, shares, and uses people's personal information.
              </p>
              <p className={s.para}>
                The law is enforced by the Personal Data Protection Commission (PDPC), established to
                oversee compliance, handle complaints, and issue guidance. Organisations that process
                personal data must register with the PDPC, appoint a Data Protection Officer (DPO),
                and keep proper records of their data practices.
              </p>
              <p className={s.para}>
                The Act also gives individuals rights over their own data: to access it, correct it,
                request deletion, and object to how it is used.
              </p>
            </section>

            <section id="who" className={s.section}>
              <h2 className={s.h2}>Who must comply?</h2>
              <p className={s.para}>
                Any organisation that collects or processes personal data in Tanzania must comply. This includes:
              </p>
              <div className={s.iconList}>
                {WHO_ROWS.map((row, i) => (
                  <div key={i} className={s.iconRow}>
                    {row.icon
                      ? <span className={s.iconWrap}>{row.icon}</span>
                      : <span className={`${s.iconWrap} ${s.iconDot}`}><span className={s.dot} /></span>
                    }
                    <span className={s.iconText}>{row.text}</span>
                  </div>
                ))}
              </div>
              <p className={s.para}>
                If you collect someone's name, phone number, ID number, health record, or any other
                information that can identify them, the PDPA applies to you.
              </p>
            </section>

            <section id="do" className={s.section}>
              <h2 className={s.h2}>What you must do</h2>
              <div className={s.mustCards}>
                {MUST_DO.map(item => (
                  <div key={item.title} className={s.mustCard}>
                    <div className={s.mustIcon}>
                      <ShieldMotif size={30} opacity={0.55} />
                    </div>
                    <div>
                      <h3 className={s.mustTitle}>{item.title}</h3>
                      <p className={s.mustText}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="dont" className={s.section}>
              <h2 className={s.h2}>What happens if you don't comply?</h2>
              <p className={s.para}>
                The PDPC can investigate organisations, issue compliance orders, and impose penalties
                for breaches of the Act. Organisations that fail to register, fail to respond to data
                rights requests, or suffer a breach due to inadequate security can face fines. Serious
                or repeated violations result in larger penalties.
              </p>
              <p className={s.para}>
                Beyond regulatory penalties, a data breach damages your organisation's reputation and
                erodes the trust of the people whose data you hold. Compliance protects both your
                organisation and the individuals you serve.
              </p>
            </section>

          </article>

          {/* ── RIGHT: sticky sidebar ── */}
          <aside className={s.sidebar}>

            {/* Card 1 — The law at a glance */}
            <div className={`${s.sideCard} ${s.glanceCard}`}>
              <p className={s.sideCardTitle}>The law at a glance</p>
              <div className={s.facts}>
                {[
                  { stat: '2022',        desc: 'Act No. 11, Cap 44' },
                  { stat: 'PDPC',        desc: 'The enforcing authority' },
                  { stat: 'All sectors', desc: 'Any org handling personal data' },
                ].map((f, i, arr) => (
                  <div key={f.stat} className={`${s.fact} ${i < arr.length - 1 ? s.factBorder : ''}`}>
                    <div className={s.factStat}>{f.stat}</div>
                    <div className={s.factDesc}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — On this page */}
            <div className={`${s.sideCard} ${s.tocCard}`}>
              <p className={s.sideCardTitle}>On this page</p>
              <nav className={s.toc}>
                {TOC.map((item, i) => (
                  <a key={item.id} href={`#${item.id}`} className={`${s.tocItem} ${i === 0 ? s.tocActive : ''}`}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Card 3 — CTA */}
            <div className={`${s.sideCard} ${s.ctaCard}`}>
              <p className={s.ctaCardHead}>See where you stand</p>
              <p className={s.ctaCardSub}>
                Find out your PDPA compliance score and exactly what to fix first.
              </p>
              <button className={s.ctaCardBtn} onClick={() => nav('/assess')} type="button">
                Assess your organisation →
              </button>
            </div>

          </aside>
        </div>
      </div>

    </div>
  )
}
