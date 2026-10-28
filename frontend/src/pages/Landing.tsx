import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldMotif } from '../components/ShieldMotif'
import { Watermark } from '../components/Watermark'
import s from './Landing.module.css'

/* ── Demo data ───────────────────────────────── */
const DEMOS = [
  { score: 79, maturity: 'Mostly compliant',   org: 'Rafiki Commercial Bank' },
  { score: 47, maturity: 'Making progress',     org: 'Unique Academy' },
  { score:  7, maturity: 'Needs urgent action', org: 'Bahari Health Centre' },
]

/* ── Rotating demo score card ────────────────── */
const RING_R  = 52
const RING_CX = 68        // viewBox = 136 × 136
const RING_CIRC = 2 * Math.PI * RING_R

function DemoCard({ score, maturity, org }: { score: number; maturity: string; org: string }) {
  const filled   = (score / 100) * RING_CIRC
  const dashOffset = RING_CIRC - filled

  return (
    <div className={s.demoCard}>
      <div className={s.demoOrg}>{org}</div>

      <div className={s.demoRingWrap}>
        <svg
          className={s.demoRingSvg}
          viewBox={`0 0 ${RING_CX * 2} ${RING_CX * 2}`}
          aria-hidden
        >
          {/* Track */}
          <circle
            cx={RING_CX} cy={RING_CX} r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={7}
          />
          {/* Fill */}
          <circle
            cx={RING_CX} cy={RING_CX} r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.88)"
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${RING_CX} ${RING_CX})`}
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
        </svg>

        <div className={s.demoScore}>
          <span className={s.demoNum}>{score}</span>
          <span className={s.demoPct}>%</span>
        </div>
      </div>

      <div className={s.demoMaturity}>{maturity}</div>
    </div>
  )
}

/* ── SVG icons ───────────────────────────────── */
function IconClipboard() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  )
}
function IconListCheck() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h4M3 12h4M3 17h4"/>
      <path d="M9 7h12M9 12h12M9 17h7"/>
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9"/>
      <rect x="10" y="7" width="4" height="14"/>
      <rect x="17" y="3" width="4" height="18"/>
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 7v6c0 5 4 9 9 10 5-1 9-5 9-10V7L12 2z"/>
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  )
}
function IconLock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
function IconFree() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
    </svg>
  )
}

/* ── Page ────────────────────────────────────── */
export function Landing() {
  const nav = useNavigate()
  const [demoIdx, setDemoIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setDemoIdx(i => (i + 1) % DEMOS.length), 2400)
    return () => clearInterval(t)
  }, [])

  const demo = DEMOS[demoIdx]

  return (
    <div className={s.page}>

      {/* ── Hero ── */}
      <section className={s.hero}>
        <div className={s.heroInner}>

          {/* Left column */}
          <div className={s.heroLeft}>
            <div className={s.eyebrow}>
              <IconShield />
              Tanzania data protection act · cap 44
            </div>

            <h1 className={s.headline}>
              Is your organisation compliant with Tanzania's data protection law?
            </h1>

            <p className={s.subheadline}>
              Answer plain questions about how you handle personal data. Get an instant compliance
              score, your gaps, and exactly what to prepare before registering with the PDPC.
            </p>

            <div className={s.heroBtns}>
              <button className={s.ctaBtn} onClick={() => nav('/assess')} type="button">
                Assess your organisation →
              </button>
              <button className={s.ghostBtn} onClick={() => nav('/about')} type="button">
                What is PDPA?
              </button>
            </div>

            <div className={s.trustRow}>
              <span><IconClock /> 10–15 minutes</span>
              <span><IconLock /> No account needed</span>
              <span><IconFree /> Free</span>
            </div>
          </div>

          {/* Right column — ShieldMotif behind, DemoCard on top */}
          <div className={s.heroRight}>
            <div className={s.cardWrap}>
              <ShieldMotif size={280} opacity={0.45} className={s.motif} />
              <DemoCard score={demo.score} maturity={demo.maturity} org={demo.org} />
            </div>
            <div className={s.demoDots}>
              {DEMOS.map((_, i) => (
                <button
                  key={i}
                  className={`${s.dot} ${i === demoIdx ? s.dotActive : ''}`}
                  onClick={() => setDemoIdx(i)}
                  type="button"
                  aria-label={`Demo ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── How it works ── */}
      <section className={s.howSection} style={{ position: 'relative', isolation: 'isolate' }}>
        <Watermark />
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>How it works</p>
          <div className={s.steps}>
            <div className={s.step}>
              <div className={s.stepIcon}><IconClipboard /></div>
              <h3 className={s.stepTitle}>Describe your organisation</h3>
              <p className={s.stepText}>Your sector, size, and what you do with data.</p>
            </div>
            <div className={s.stepArrow}>→</div>
            <div className={s.step}>
              <div className={s.stepIcon}><IconListCheck /></div>
              <h3 className={s.stepTitle}>Answer plain questions</h3>
              <p className={s.stepText}>Simple yes or no, no legal knowledge needed.</p>
            </div>
            <div className={s.stepArrow}>→</div>
            <div className={s.step}>
              <div className={s.stepIcon}><IconChart /></div>
              <h3 className={s.stepTitle}>Get your score and gaps</h3>
              <p className={s.stepText}>Know what to fix and what to prepare first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <p>
          PDPA-Comply · Built for Tanzania's Personal Data Protection Act (Cap 44, Act No. 11 of 2022).
          An independent readiness tool, not affiliated with the PDPC.
        </p>
      </footer>

    </div>
  )
}
