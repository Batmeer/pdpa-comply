import type { Status } from '../lib/types'
import s from './QuestionCard.module.css'

type Answer = 'YES' | 'PARTIALLY' | 'NO' | 'NA'

const ANSWER_STATUS: Record<Answer, Status> = {
  YES:       'COMPLIANT',
  PARTIALLY: 'PARTIAL',
  NO:        'NON_COMPLIANT',
  NA:        'REVIEW_REQUIRED',
}

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 'YES',       label: 'Yes' },
  { value: 'PARTIALLY', label: 'Partially' },
  { value: 'NO',        label: 'No' },
  { value: 'NA',        label: 'Not applicable' },
]

interface Props {
  question: string
  currentStatus: Status | undefined
  onChange: (status: Status) => void
}

function statusToAnswer(s: Status | undefined): Answer | null {
  if (!s) return null
  const entry = Object.entries(ANSWER_STATUS).find(([, v]) => v === s)
  return entry ? (entry[0] as Answer) : null
}

export function QuestionCard({ question, currentStatus, onChange }: Props) {
  const current = statusToAnswer(currentStatus)

  return (
    <div className={s.card}>
      <p className={s.question}>{question}</p>
      <div className={s.options}>
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`${s.pill} ${current === opt.value ? `${s.selected} ${s[opt.value.toLowerCase()]}` : ''}`}
            onClick={() => onChange(ANSWER_STATUS[opt.value])}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
