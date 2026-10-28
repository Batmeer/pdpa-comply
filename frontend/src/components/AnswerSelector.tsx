import type { Status } from '../lib/types'
import s from './AnswerSelector.module.css'

type Answer = 'YES' | 'PARTIALLY' | 'NO' | 'NA'

const ANSWER_STATUS: Record<Answer, Status> = {
  YES:       'COMPLIANT',
  PARTIALLY: 'PARTIAL',
  NO:        'NON_COMPLIANT',
  NA:        'REVIEW_REQUIRED',
}

const OPTIONS: { key: Answer; label: string; icon: React.ReactNode }[] = [
  {
    key: 'YES',
    label: 'Yes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
  },
  {
    key: 'PARTIALLY',
    label: 'Partially',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'NO',
    label: 'No',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  {
    key: 'NA',
    label: "N/A",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
]

interface Props {
  value: Status | undefined
  onChange: (status: Status) => void
}

export function AnswerSelector({ value, onChange }: Props) {
  return (
    <div className={s.row}>
      {OPTIONS.map(opt => {
        const selected = value === ANSWER_STATUS[opt.key]
        return (
          <button
            key={opt.key}
            type="button"
            className={`${s.option} ${s[opt.key]} ${selected ? s.selected : ''}`}
            onClick={() => onChange(ANSWER_STATUS[opt.key])}
            aria-pressed={selected}
          >
            <span className={s.icon}>{opt.icon}</span>
            <span className={s.label}>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
