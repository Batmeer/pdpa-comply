import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { AssessmentSummary } from '../lib/types'
import { ScoreCard } from '../components/ScoreCard'
import { MATURITY_DISPLAY } from '../lib/questions'
import { Watermark } from '../components/Watermark'
import s from './Dashboard.module.css'

export function Dashboard() {
  const nav = useNavigate()
  const [demos, setDemos] = useState<AssessmentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getDemos()
      .then(setDemos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={s.state}>Loading…</div>
  if (error)   return <div className={`${s.state} ${s.err}`}>Error: {error}</div>

  return (
    <div className={s.page}>
      <Watermark />
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Dashboard</h1>
          <p className={s.sub}>PDPA compliance overview across all assessed organisations</p>
        </div>
        <button className={s.newBtn} onClick={() => nav('/assess')} type="button">
          + New assessment
        </button>
      </div>

      {demos.length === 0 ? (
        <div className={s.empty}>
          <p className={s.emptyText}>No assessments yet. Run your first assessment to see results here.</p>
          <button className={s.emptyCta} onClick={() => nav('/assess')} type="button">
            Assess your organisation →
          </button>
        </div>
      ) : (
        <div className={s.grid}>
          {demos.map(d => {
            const displayMaturity = MATURITY_DISPLAY[d.maturity] ?? d.maturity
            const gaps = d.non_compliant_count
            return (
              <button
                key={d.id}
                className={s.tile}
                onClick={() => nav(`/results/${d.id}`)}
                type="button"
              >
                <ScoreCard score={d.score} maturity={displayMaturity} size="sm" />
                <div className={s.tileInfo}>
                  <div className={s.tileName}>{d.org_name}</div>
                  <div className={s.tileStats}>
                    {d.compliant_count} compliant · {gaps} gaps · {d.applicable_count} assessed
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
