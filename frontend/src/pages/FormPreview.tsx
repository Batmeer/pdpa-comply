import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { AssessmentOut, ReportOut } from '../lib/types'
import { Watermark } from '../components/Watermark'
import s from './FormPreview.module.css'

export function FormPreview() {
  const { id, formType } = useParams<{ id: string; formType: string }>()
  const nav = useNavigate()
  const [assessment, setAssessment] = useState<AssessmentOut | null>(null)
  const [report, setReport] = useState<ReportOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const type = formType as 'registration' | 'dpia' | 'report'
  const formTitle =
    type === 'registration' ? 'Form 1: Registration' :
    type === 'dpia'         ? 'Form 9: DPIA' :
                              'Full Compliance Report'

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.getAssessment(Number(id)),
      api.enqueueForm(Number(id), type),
    ])
      .then(([a, r]) => { setAssessment(a); setReport(r) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, type])

  useEffect(() => {
    if (report?.status === 'error' && report.error_message) {
      console.error('Form generation failed:', report.error_message)
    }
  }, [report])

  if (loading) return <div className={s.state}>Loading…</div>
  if (error)   return <div className={`${s.state} ${s.err}`}>Error: {error}</div>
  if (!assessment || !report) return null

  return (
    <div className={s.page}>
      <Watermark />
      <div className={s.header}>
        <button className={s.back} onClick={() => nav(`/results/${id}`)} type="button">
          ← Back to results
        </button>
        <h1 className={s.title}>{formTitle}</h1>
        <span className={s.org}>{assessment.org_name}</span>
      </div>

      <div className={s.body}>
        {/* Status panel */}
        <div className={`${s.statusPanel} ${s[report.status]}`}>
          <div className={s.statusDot} />
          <div>
            <div className={s.statusLabel}>
              {report.status === 'pending' && 'Generating your report…'}
              {report.status === 'ready'   && 'Your report is ready'}
              {report.status === 'error'   && 'Something went wrong'}
            </div>
            {report.status === 'pending' && (
              <div className={s.statusSub}>This takes a few seconds.</div>
            )}
            {report.status === 'ready' && report.file_path && (
              <div className={s.statusSub}>Download it below.</div>
            )}
            {report.status === 'error' && (
              <div className={s.statusSub}>{"We couldn't generate your document. Try again."}</div>
            )}
          </div>
        </div>

        {/* Pre-fill summary */}
        <div className={s.card}>
          <h2 className={s.cardTitle}>Auto-filled fields</h2>
          <dl className={s.dl}>
            <dt>Organisation</dt><dd>{assessment.org_name}</dd>
            <dt>Compliance score</dt><dd>{assessment.score}%, {assessment.maturity}</dd>
            <dt>Controls assessed</dt><dd>{assessment.applicable_count}</dd>
            <dt>Assessment date</dt><dd>{new Date(assessment.generated_at).toLocaleDateString()}</dd>
            {type === 'registration' && (
              <>
                <dt>Registration class</dt>
                <dd>{assessment.dpia_required ? 'Data Controller (DPIA required)' : 'Data Controller'}</dd>
              </>
            )}
            {type === 'dpia' && (
              <>
                <dt>DPIA required</dt><dd>{assessment.dpia_required ? 'Yes' : 'No'}</dd>
              </>
            )}
          </dl>
        </div>

        <div className={s.actions}>
          {report.status === 'ready' && (
            <a className={s.downloadBtn} href={`/api/v1/assessments/${id}/forms/${type}/download`} target="_blank" rel="noreferrer">
              Download PDF
            </a>
          )}
          <button
            className={s.refreshBtn}
            onClick={() => { setLoading(true); api.enqueueForm(Number(id), type).then(setReport).finally(() => setLoading(false)) }}
            type="button"
          >
            Refresh status
          </button>
        </div>
      </div>
    </div>
  )
}
