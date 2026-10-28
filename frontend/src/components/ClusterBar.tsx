import s from './ClusterBar.module.css'

interface Props { cluster: string; score: number }

function barColor(score: number) {
  if (score >= 76) return 'var(--compliant-fg)'
  if (score >= 51) return 'var(--brand)'
  if (score >= 26) return 'var(--partial-fg)'
  return 'var(--noncompliant-fg)'
}

export function ClusterBar({ cluster, score }: Props) {
  return (
    <div className={s.row}>
      <div className={s.label}>{cluster}</div>
      <div className={s.track}>
        <div
          className={s.fill}
          style={{ width: `${score}%`, background: barColor(score) }}
        />
      </div>
      <div className={s.pct}>{score}%</div>
    </div>
  )
}
