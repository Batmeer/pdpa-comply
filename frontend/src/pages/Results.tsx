import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { AssessmentOut } from '../lib/types'
import { ScoreCard } from '../components/ScoreCard'
import { MetricCard } from '../components/MetricCard'
import { SectionBar } from '../components/SectionBar'
import { RemediationItem } from '../components/RemediationItem'
import { toSectionScores, SECTION_ORDER, MATURITY_DISPLAY } from '../lib/questions'
import { Watermark } from '../components/Watermark'
import s from './Results.module.css'

const VERDICT_BY_MATURITY: Record<string, string> = {
  Initial:    'Significant gaps. Not ready to register.',
  Developing: 'On track, but not yet registration-ready.',
  Managed:    'Close to ready. A few gaps remain.',
  Optimized:  'Strong position. Ready to register with confidence.',
}
const VERDICT_FALLBACK = 'Review your results below to see where you stand.'

export function Results() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [data, setData] = useState<AssessmentOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportMsg,  setReportMsg]  = useState<string | null>(null)
  const [form1Msg,   setForm1Msg]   = useState<string | null>(null)
  const [form9Msg,   setForm9Msg]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.getAssessment(Number(id))
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleReport() {
    if (!data) return
    setReportMsg('Preparing your report…')
    try {
      await api.enqueueForm(data.id, 'report')
      nav(`/forms/${data.id}/report`)
    } catch (e) {
      setReportMsg(`Error: ${(e as Error).message}`)
    }
  }

  async function handleForm1() {
    if (!data) return
    setForm1Msg('Preparing your form…')
    try {
      await api.enqueueForm(data.id, 'registration')
      nav(`/forms/${data.id}/registration`)
    } catch (e) {
      setForm1Msg(`Error: ${(e as Error).message}`)
    }
  }

  async function handleForm9() {
    if (!data) return
    setForm9Msg('Preparing your form…')
    try {
      await api.enqueueForm(data.id, 'dpia')
      nav(`/forms/${data.id}/dpia`)
    } catch (e) {
      setForm9Msg(`Error: ${(e as Error).message}`)
    }
  }

  if (loading) return <div className={s.state}>Loading results…</div>
  if (error)   return <div className={`${s.state} ${s.err}`}>Error: {error}</div>
  if (!data)   return null

  const displayMaturity = MATURITY_DISPLAY[data.maturity] ?? data.maturity
  const verdict          = VERDICT_BY_MATURITY[data.maturity] ?? VERDICT_FALLBACK
  const support          = `You meet ${data.compliant_count} of ${data.applicable_count} applicable requirements. Closing the gaps below will strengthen your compliance position before you register with the PDPC.`
  const sectionScores   = toSectionScores(data.cluster_scores)
  const openGaps        = data.non_compliant_count + data.partial_count
  const topFive         = data.roadmap.slice(0, 5)
  const remaining       = data.roadmap.length - 5

  return (
    <div className={s.page}>
      <Watermark />

      {/* ── Hero ── */}
      <div className={s.heroWrap}>
        <div className={s.heroCard}>
          <div className={s.heroLeft}>
            <ScoreCard score={data.score} maturity={displayMaturity} orgName={data.org_name} size="lg" />
          </div>
          <div className={s.heroRight}>
            <p className={s.orgLabel}>{data.org_name}</p>
            <div className={s.heroSummary}>
              <p className={s.verdict}>{verdict}</p>
              <p className={s.support}>{support}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={s.content}>

        {/* ── Metrics ── */}
        <div className={s.metrics}>
          <MetricCard label="Compliant"      value={data.compliant_count} sub={`of ${data.applicable_count} requirements`} accent="green" />
          <MetricCard label="Gaps to close"  value={openGaps} sub="controls require attention" accent={openGaps > 10 ? 'red' : 'amber'} />
          <MetricCard label="Partially done" value={data.partial_count} sub="started but incomplete" accent="amber" />
        </div>

        {/* ── Compliance by area ── */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Compliance by area</h2>
          <div className={s.card}>
            {SECTION_ORDER
              .filter(sec => sec in sectionScores)
              .map(sec => (
                <SectionBar key={sec} section={sec} score={sectionScores[sec]} />
              ))}
          </div>
        </section>

        {/* ── What you need to do ── */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>What you need to do</h2>
          <p className={s.sectionSub}>
            The {topFive.length} most important steps to improve your compliance. Start from the top.
          </p>
          <div className={s.roadmap}>
            {topFive.map(item => (
              <RemediationItem
                key={item.control_id}
                rank={item.rank}
                action={item.action}
                scoreImpact={item.score_impact}
                onGenerateForm={
                  item.cluster === 'DPIA' && data.dpia_required
                    ? handleForm9
                    : item.cluster === 'Registration'
                    ? handleForm1
                    : undefined
                }
                formLabel={
                  item.cluster === 'DPIA'         ? 'Generate Form 9' :
                  item.cluster === 'Registration'  ? 'Generate Form 1' : undefined
                }
              />
            ))}
          </div>
          {remaining > 0 && (
            <p className={s.moreNote}>
              + {remaining} more action item{remaining !== 1 ? 's' : ''} in the full report below.
            </p>
          )}
        </section>

        {/* ── Download full report ── */}
        <div className={s.downloadBanner}>
          <div className={s.downloadLeft}>
            <div className={s.downloadIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M12 18v-6M9 15l3 3 3-3"/>
              </svg>
            </div>
            <div>
              <p className={s.downloadHead}>Download full results</p>
              <p className={s.downloadSub}>
                A complete PDF report with every gap explained, the full action plan,
                and control-level detail for each area.
              </p>
            </div>
          </div>
          <div className={s.downloadRight}>
            <button className={s.downloadBtn} onClick={handleReport} type="button">
              Download full report →
            </button>
            {reportMsg && <p className={s.downloadMsg}>{reportMsg}</p>}
          </div>
        </div>

        {/* ── Bottom actions ── */}
        <section className={s.bottomRow}>

          {/* Form 1 card */}
          <div className={s.actionCard}>
            <div className={s.actionCardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <p className={s.actionCardHead}>Register with the PDPC</p>
              <p className={s.actionCardText}>
                Form 1 is the official PDPC registration application that every organisation
                processing personal data in Tanzania must submit. This generates a pre-filled
                version using your assessment answers, ready for you to review and submit.
              </p>
              <button className={s.actionPrimary} onClick={handleForm1} type="button">
                Generate Form 1 →
              </button>
              {form1Msg && <p className={s.formMsg}>{form1Msg}</p>}
            </div>
          </div>

          {/* Form 9 card — only when a DPIA is required */}
          {data.dpia_required && (
            <div className={s.actionCard}>
              <div className={s.actionCardIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v6c0 5 4 9 9 10 5-1 9-5 9-10V7L12 2z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div>
                <p className={s.actionCardHead}>Complete a Data Protection Impact Assessment</p>
                <p className={s.actionCardText}>
                  Your organisation processes sensitive personal data, handles children's data,
                  or uses automated decision-making, which means the PDPC requires you to
                  complete a Data Protection Impact Assessment (DPIA) before or alongside
                  registration. Form 9 is the official DPIA document, pre-filled with your answers.
                </p>
                <button className={s.actionPrimary} onClick={handleForm9} type="button">
                  Generate Form 9 (DPIA) →
                </button>
                {form9Msg && <p className={s.formMsg}>{form9Msg}</p>}
              </div>
            </div>
          )}

          {/* New assessment card */}
          <div className={`${s.actionCard} ${s.actionCardAlt}`}>
            <div className={s.actionCardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <line x1="12" y1="11" x2="12" y2="17"/>
                <line x1="9" y1="14" x2="15" y2="14"/>
              </svg>
            </div>
            <div>
              <p className={s.actionCardHead}>Assess a different organisation</p>
              <p className={s.actionCardText}>
                Run a fresh assessment for another organisation, or re-assess after you have
                made improvements to see how your score changes.
              </p>
              <button className={s.actionPrimary} onClick={() => nav('/assess')} type="button">
                Start new assessment →
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}
