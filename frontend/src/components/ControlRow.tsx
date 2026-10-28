import type { Status } from '../lib/types'
import type { LegalAnchor } from '../lib/types'
import { LegalChip } from './LegalChip'
import { StatusBadge } from './StatusBadge'
import s from './ControlRow.module.css'

const STATUSES: Status[] = ['COMPLIANT', 'PARTIAL', 'NON_COMPLIANT', 'REVIEW_REQUIRED']

interface Props {
  controlId: string
  cluster: string
  requirement: string
  remediation?: string
  legalAnchor: LegalAnchor
  status: Status
  editable?: boolean
  onChange?: (status: Status) => void
}

export function ControlRow({
  controlId, cluster, requirement, remediation, legalAnchor,
  status, editable, onChange,
}: Props) {
  return (
    <div className={s.row}>
      <div className={s.meta}>
        <span className={s.id}>{controlId}</span>
        <span className={s.cluster}>{cluster}</span>
        <LegalChip anchor={legalAnchor} />
      </div>

      <div className={s.req}>{requirement}</div>

      {remediation && <div className={s.rem}>{remediation}</div>}

      <div className={s.statusArea}>
        {editable ? (
          <div className={s.selector}>
            {STATUSES.map(st => (
              <button
                key={st}
                className={`${s.opt} ${status === st ? s.selected : ''} ${s[st.toLowerCase().replace('_','-')]}`}
                onClick={() => onChange?.(st)}
                type="button"
              >
                {st === 'NON_COMPLIANT' ? 'Non-Compliant' : st === 'REVIEW_REQUIRED' ? 'Review' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        ) : (
          <StatusBadge status={status} />
        )}
      </div>
    </div>
  )
}
