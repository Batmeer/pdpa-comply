import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { ControlOut, OrgProfile, Status } from '../lib/types'
import { AnswerSelector } from '../components/AnswerSelector'
import { ScoreCard } from '../components/ScoreCard'
import { Watermark } from '../components/Watermark'
import {
  QUESTION_TEXT, CLUSTER_TO_SECTION, SECTION_ORDER, SECTION_SUBTEXT, MATURITY_DISPLAY,
} from '../lib/questions'
import { filterControls, computeLiveScore, maturityLabel } from '../lib/scoring'
import s from './ControlAssessment.module.css'

/* ── Section icons ────────────────────────────────────────── */
function SectionIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    'Registering with the PDPC': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
    'How you collect and use data': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
    'Keeping data safe': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    'Your Data Protection Officer': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v6c0 5 4 9 9 10 5-1 9-5 9-10V7L12 2z"/>
        <circle cx="12" cy="11" r="3"/>
      </svg>
    ),
    "People's rights over their data": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    'Working with others & records': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  }
  return (
    <span className={s.secIconSvg}>
      {icons[name] ?? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      )}
    </span>
  )
}

/* ── Section grouping ─────────────────────────────────────── */
function groupBySection(controls: ControlOut[]): [string, ControlOut[]][] {
  const map = new Map<string, ControlOut[]>()
  for (const sec of SECTION_ORDER) map.set(sec, [])
  for (const c of controls) {
    const sec = CLUSTER_TO_SECTION[c.cluster]
    if (sec && map.has(sec)) map.get(sec)!.push(c)
  }
  return [...map.entries()].filter(([, v]) => v.length > 0)
}

/* ── Component ────────────────────────────────────────────── */
export function ControlAssessment() {
  const nav = useNavigate()
  const location = useLocation()
  const profile: OrgProfile | undefined = (location.state as { profile?: OrgProfile })?.profile

  const [allControls, setAllControls] = useState<ControlOut[]>([])
  const [answers, setAnswers] = useState<Record<string, Status>>({})
  const [sectionIdx, setSectionIdx] = useState(0)
  const [maxSection, setMaxSection] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) { nav('/assess'); return }
    api.getCatalogue().then(cat => {
      setAllControls(filterControls(cat.controls, profile))
    }).catch(e => setErr(e.message))
  }, [profile, nav])

  if (!profile) return null
  if (err) return <div className={s.errState}>Error: {err}</div>
  if (allControls.length === 0) return <div className={s.loading}>Loading questions…</div>

  const sections     = groupBySection(allControls)
  const totalSecs    = sections.length
  const [secName, secControls] = sections[sectionIdx] ?? ['', []]
  const isLast       = sectionIdx === totalSecs - 1

  const answeredAll   = Object.keys(answers).length
  const liveScore  = computeLiveScore(allControls, answers)
  const liveMat    = MATURITY_DISPLAY[maturityLabel(liveScore)] ?? maturityLabel(liveScore)

  const secAnswered   = secControls.filter(c => answers[c.id] !== undefined).length
  const secTotal      = secControls.length
  const secComplete   = secAnswered === secTotal
  const totalRemaining = allControls.length - answeredAll
  const progressPct   = Math.round((answeredAll / allControls.length) * 100)

  async function handleSubmit() {
    if (!profile) return
    setSubmitting(true)
    try {
      const result = await api.createAssessment({ profile, answers })
      nav(`/results/${result.id}`)
    } catch (e) {
      setErr(`Submission failed: ${(e as Error).message}`)
      setSubmitting(false)
    }
  }

  return (
    <div className={s.page}>
      <Watermark />
      {/* ── Top bar ── */}
      <div className={s.topBar}>
        <div className={s.topBarInner}>
          <div className={s.topLeft}>
            <span className={s.sectionCount}>Section {sectionIdx + 1} of {totalSecs}</span>
            <span className={s.dot} />
            <span className={s.sectionName}>{secName}</span>
          </div>
          <span className={s.ansCount}>{answeredAll} of {allControls.length} answered</span>
        </div>

        <div className={s.trackerWrap}>
          <div className={s.tracker}>
            {sections.map(([name], i) => (
              <button
                key={name}
                className={`${s.segment} ${i < sectionIdx ? s.done : ''} ${i === sectionIdx ? s.active : ''} ${i > maxSection ? s.segmentLocked : ''}`}
                onClick={() => i <= maxSection ? setSectionIdx(i) : undefined}
                disabled={i > maxSection}
                type="button"
                title={i > maxSection ? `Complete section ${sectionIdx + 1} first` : name}
              />
            ))}
          </div>
        </div>

        <div className={s.progressBar}>
          <div className={s.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className={s.body}>
        {/* Main */}
        <div className={s.main}>
          <div className={s.sectionHeader}>
            <div className={s.secIconWrap}><SectionIcon name={secName} /></div>
            <div>
              <h2 className={s.secTitle}>{secName}</h2>
              {SECTION_SUBTEXT[secName] && (
                <p className={s.secSub}>{SECTION_SUBTEXT[secName]}</p>
              )}
            </div>
          </div>

          <div className={s.questions}>
            {secControls.map((c, qi) => (
              <div key={c.id} className={s.qCard}>
                <p className={s.qText}>
                  {qi + 1}. {QUESTION_TEXT[c.id] ?? c.requirement}
                </p>
                <AnswerSelector
                  value={answers[c.id]}
                  onChange={st => setAnswers(prev => ({ ...prev, [c.id]: st }))}
                />
              </div>
            ))}
          </div>

          <div className={s.navRow}>
            <button
              className={s.prevBtn}
              disabled={sectionIdx === 0}
              onClick={() => setSectionIdx(i => i - 1)}
              type="button"
            >
              ← Previous
            </button>

            {isLast ? (
              <button
                className={`${s.nextBtn} ${!secComplete ? s.btnMuted : ''}`}
                onClick={handleSubmit}
                disabled={submitting || !secComplete}
                type="button"
              >
                {submitting
                  ? 'Calculating…'
                  : !secComplete
                  ? `Answer ${secTotal - secAnswered} more to finish`
                  : 'See my results →'}
              </button>
            ) : (
              <button
                className={`${s.nextBtn} ${!secComplete ? s.btnMuted : ''}`}
                disabled={!secComplete}
                onClick={() => {
                  const next = sectionIdx + 1
                  setSectionIdx(next)
                  if (next > maxSection) setMaxSection(next)
                }}
                type="button"
              >
                {secComplete
                  ? 'Next section →'
                  : `Answer ${secTotal - secAnswered} more to continue`}
              </button>
            )}
          </div>

          {err && <p className={s.errMsg}>{err}</p>}
        </div>

        {/* Sidebar */}
        <aside className={s.sidebar}>
          <div className={s.sideCard}>
            <p className={s.sideLabel}>Your score so far</p>
            <ScoreCard score={liveScore} maturity={liveMat} size="sm" />
            <p className={s.sideHint}>Keep answering to improve accuracy.</p>
          </div>

          {isLast && (
            <button
              className={`${s.submitBtn} ${!secComplete ? s.btnMuted : ''}`}
              onClick={handleSubmit}
              disabled={submitting || !secComplete}
              type="button"
            >
              {submitting
                ? 'Calculating…'
                : totalRemaining > 0
                ? `${totalRemaining} questions left`
                : 'See my results →'}
            </button>
          )}

          <p className={s.sideDisclaimer}>
            Your answers are scored against all applicable PDPA requirements.
          </p>
        </aside>
      </div>
    </div>
  )
}
