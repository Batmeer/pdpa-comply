import type { LegalAnchor } from '../lib/types'
import s from './LegalChip.module.css'

interface Props { anchor: LegalAnchor }

export function LegalChip({ anchor }: Props) {
  const parts = [anchor.act_section, anchor.regulation].filter(Boolean)
  if (!parts.length) return null
  return <span className={s.chip}>{parts.join(' / ')}</span>
}
