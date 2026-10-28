import type { ControlOut, OrgProfile, Status } from './types'

const MODIFIERS: Record<Status, number> = {
  COMPLIANT: 0.0,
  PARTIAL: 0.5,
  NON_COMPLIANT: 1.0,
  REVIEW_REQUIRED: 0.5,
}

function dpiaRequired(p: OrgProfile): boolean {
  return p.uses_automated_decisions || p.processes_sensitive_data || p.processes_children_data
}

function flagMatches(profile: OrgProfile, appliesTo: string): boolean {
  if (appliesTo === 'all') return true
  if (appliesTo === 'dpia_required') return dpiaRequired(profile)
  return !!profile[appliesTo as keyof OrgProfile]
}

export function filterControls(controls: ControlOut[], profile: OrgProfile): ControlOut[] {
  return controls.filter(c => flagMatches(profile, c.applies_to))
}

export function computeLiveScore(
  controls: ControlOut[],
  answers: Record<string, Status>,
): number {
  let totalGap = 0, totalMax = 0
  for (const c of controls) {
    const status: Status = (answers[c.id] as Status) ?? 'REVIEW_REQUIRED'
    const max = c.severity * c.sensitivity_multiplier
    totalGap += max * MODIFIERS[status]
    totalMax += max
  }
  if (totalMax === 0) return 100
  return Math.round(10 * (100 * (1 - totalGap / totalMax))) / 10
}

export function maturityLabel(score: number): string {
  if (score >= 76) return 'Optimized'
  if (score >= 51) return 'Managed'
  if (score >= 26) return 'Developing'
  return 'Initial'
}

export function scoreColor(score: number): string {
  if (score >= 76) return 'var(--compliant-fg)'
  if (score >= 51) return 'var(--brand)'
  if (score >= 26) return 'var(--partial-fg)'
  return 'var(--noncompliant-fg)'
}
