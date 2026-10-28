import type {
  AssessmentIn, AssessmentOut, AssessmentSummary,
  CatalogueOut, ReportOut,
} from './types'

const BASE = import.meta.env.VITE_API_URL ?? ''

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  getDemos: () =>
    req<AssessmentSummary[]>('/api/v1/demos'),

  getCatalogue: () =>
    req<CatalogueOut>('/api/v1/catalogue'),

  getAssessment: (id: number) =>
    req<AssessmentOut>(`/api/v1/assessments/${id}`),

  createAssessment: (body: AssessmentIn) =>
    req<AssessmentOut>('/api/v1/assessments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  enqueueForm: (assessmentId: number, formType: 'registration' | 'dpia' | 'report') =>
    req<ReportOut>(`/api/v1/assessments/${assessmentId}/forms/${formType}`),
}
