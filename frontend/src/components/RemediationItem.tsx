import s from './RemediationItem.module.css'

interface Props {
  rank: number
  action: string
  scoreImpact: number
  onGenerateForm?: () => void
  formLabel?: string
}

export function RemediationItem({ rank, action, scoreImpact, onGenerateForm, formLabel }: Props) {
  const isTop = rank <= 3

  return (
    <div className={s.item}>
      <div className={`${s.badge} ${isTop ? s.top : s.grey}`}>{rank}</div>
      <div className={s.body}>
        <p className={s.action}>{action}</p>
        <div className={s.foot}>
          <span className={s.impact}>+{scoreImpact.toFixed(1)} pts if resolved</span>
          {onGenerateForm && (
            <button className={s.formBtn} onClick={onGenerateForm} type="button">
              {formLabel ?? 'Generate form'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
