export type Status = 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED'

export interface LegalAnchor {
  act_section: string | null
  regulation: string | null
}

export interface ControlOut {
  id: string
  cluster: string
  legal_anchor: LegalAnchor
  requirement: string
  severity: number
  sensitivity_multiplier: number
  applies_to: string
  evidence: string
  is_dpia_trigger: boolean
  remediation: string
}

export interface MaturityBand {
  min: number
  max: number
  label: string
}

export interface CatalogueOut {
  total: number
  controls: ControlOut[]
  maturity_bands: MaturityBand[]
}

export interface OrgProfile {
  name: string
  sector: string
  registered: boolean
  processes_sensitive_data: boolean
  transfers_abroad: boolean
  uses_processors: boolean
  does_direct_marketing: boolean
  uses_automated_decisions: boolean
  processes_children_data: boolean
  is_public_institution: boolean
  employee_band: '1-49' | '50-99' | '100+'
  turnover_band: '<100M' | '100-500M' | '>500M'
}

export interface AssessmentIn {
  profile: OrgProfile
  answers: Record<string, Status>
}

export interface ControlResultOut {
  control_id: string
  cluster: string
  status: Status
  severity: number
  sensitivity_multiplier: number
  gap: number
  max_gap: number
  requirement: string
  remediation: string
  legal_anchor: LegalAnchor
}

export interface RoadmapItem {
  rank: number
  control_id: string
  cluster: string
  priority: 'High' | 'Medium' | 'Low'
  legal_basis: string
  action: string
  score_impact: number
}

export interface AssessmentOut {
  id: number
  org_name: string
  score: number
  maturity: string
  applicable_count: number
  compliant_count: number
  partial_count: number
  non_compliant_count: number
  review_count: number
  cluster_scores: Record<string, number>
  generated_at: string
  integrity_hash: string
  results: ControlResultOut[]
  roadmap: RoadmapItem[]
  dpia_required: boolean
}

export interface AssessmentSummary {
  id: number
  org_name: string
  score: number
  maturity: string
  applicable_count: number
  compliant_count: number
  non_compliant_count: number
  generated_at: string
}

export interface ReportOut {
  id: number
  assessment_id: number
  form_type: string
  status: 'pending' | 'ready' | 'error'
  file_path: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}
