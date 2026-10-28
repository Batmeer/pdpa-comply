import type { Status } from '../lib/types'
import s from './StatusBadge.module.css'

const LABELS: Record<Status, string> = {
  COMPLIANT: 'Compliant',
  PARTIAL: 'Partial',
  NON_COMPLIANT: 'Non-Compliant',
  REVIEW_REQUIRED: 'Review',
}

interface Props { status: Status; small?: boolean }

export function StatusBadge({ status, small }: Props) {
  return (
    <span className={`${s.badge} ${s[status.toLowerCase().replace('_', '-')]} ${small ? s.small : ''}`}>
      {LABELS[status]}
    </span>
  )
}
