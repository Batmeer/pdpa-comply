import s from './ScoreCard.module.css'

interface Props {
  score: number
  maturity: string
  orgName?: string
  size?: 'lg' | 'sm' | 'mini'
}

function arcColor(score: number) {
  if (score >= 76) return '#34d399'
  if (score >= 51) return '#22d3ee'
  if (score >= 26) return '#fbbf24'
  return '#f87171'
}

export function ScoreCard({ score, maturity, orgName, size = 'lg' }: Props) {
  const color  = arcColor(score)
  const r      = size === 'lg' ? 70 : size === 'sm' ? 38 : 20
  const cx     = size === 'lg' ? 80 : size === 'sm' ? 48 : 26
  const sw     = size === 'lg' ? 7  : size === 'sm' ? 6  : 4
  const circ   = 2 * Math.PI * r
  const dash   = (score / 100) * circ

  const ring = (
    <svg className={s.gaugeSvg} viewBox={`0 0 ${cx * 2} ${cx * 2}`}>
      <circle cx={cx} cy={cx} r={r} fill="none"
        stroke="rgba(255,255,255,0.1)" strokeWidth={sw} />
      <circle cx={cx} cy={cx} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
    </svg>
  )

  if (size === 'mini') {
    return (
      <div className={`${s.card} ${s.mini}`}>
        <div className={s.gaugeWrap}>
          {ring}
          <div className={s.gaugeScore}>
            <span className={s.scoreNum}>{score}</span>
          </div>
        </div>
        <div className={s.miniInfo}>
          <span className={s.maturity}>{maturity}</span>
          {orgName && <span className={s.orgNameMini}>{orgName}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={`${s.card} ${s[size]}`}>
      <div className={s.gaugeWrap}>
        {ring}
        <div className={s.gaugeScore}>
          <span className={s.scoreNum}>{score}</span>
          <span className={s.scoreOf}>%</span>
        </div>
      </div>

      <div className={s.maturityPill} style={{ color, borderColor: color + '55', background: color + '18' }}>
        {maturity}
      </div>

      {orgName && <div className={s.orgName}>{orgName}</div>}
    </div>
  )
}
