import s from './MetricCard.module.css'

interface Props {
  label: string
  value: string | number
  sub?: string
  accent?: 'green' | 'amber' | 'red' | 'neutral'
}

export function MetricCard({ label, value, sub, accent }: Props) {
  return (
    <div className={`${s.card} ${accent ? s[accent] : ''}`}>
      <div className={s.label}>{label}</div>
      <div className={s.value}>{value}</div>
      {sub && <div className={s.sub}>{sub}</div>}
    </div>
  )
}
