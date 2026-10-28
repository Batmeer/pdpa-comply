import s from './SectionBar.module.css'

interface Props {
  section: string
  score: number
}

function barColor(score: number) {
  if (score >= 76) return 'var(--compliant-fg)'
  if (score >= 51) return 'var(--brand)'
  if (score >= 26) return 'var(--partial-fg)'
  return 'var(--noncompliant-fg)'
}

export function SectionBar({ section, score }: Props) {
  return (
    <div className={s.row}>
      <div className={s.label}>{section}</div>
      <div className={s.track}>
        <div className={s.fill} style={{ width: `${score}%`, background: barColor(score) }} />
      </div>
      <div className={s.pct}>{score}%</div>
    </div>
  )
}
