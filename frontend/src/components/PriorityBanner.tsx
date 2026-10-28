import type { RoadmapItem } from '../lib/types'
import { LegalChip } from './LegalChip'
import s from './PriorityBanner.module.css'

interface Props {
  item: RoadmapItem
  onGenerateForm?: () => void
  formLabel?: string
}

export function PriorityBanner({ item, onGenerateForm, formLabel }: Props) {
  return (
    <div className={s.banner}>
      <div className={s.rank}>#1 Priority</div>
      <div className={s.cluster}>{item.cluster} · {item.control_id}</div>
      <div className={s.action}>{item.action}</div>
      <div className={s.foot}>
        <LegalChip anchor={{ act_section: item.legal_basis, regulation: null }} />
        <span className={s.impact}>+{item.score_impact.toFixed(1)} pts if resolved</span>
        {onGenerateForm && (
          <button className={s.cta} onClick={onGenerateForm} type="button">
            {formLabel ?? 'Generate Form'}
          </button>
        )}
      </div>
    </div>
  )
}
