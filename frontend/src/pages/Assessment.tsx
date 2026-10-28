import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { CatalogueOut, OrgProfile } from '../lib/types'
import { filterControls } from '../lib/scoring'
import { Watermark } from '../components/Watermark'
import s from './Assessment.module.css'

const SECTORS = [
  'Financial Services', 'Health', 'Education', 'Telecommunications',
  'Retail', 'Government', 'Technology', 'Other',
]

const DEFAULT_PROFILE: OrgProfile = {
  name: '', sector: SECTORS[0],
  registered: false, processes_sensitive_data: false, transfers_abroad: false,
  uses_processors: false, does_direct_marketing: false, uses_automated_decisions: false,
  processes_children_data: false, is_public_institution: false,
  employee_band: '1-49', turnover_band: '<100M',
}

const TOGGLES: { key: keyof OrgProfile; label: string }[] = [
  { key: 'registered',               label: 'Already registered with the PDPC' },
  { key: 'processes_sensitive_data', label: 'Handles sensitive data (health records, ID numbers, biometrics)' },
  { key: 'transfers_abroad',         label: 'Shares data with parties outside Tanzania' },
  { key: 'uses_processors',          label: 'Uses external companies to process data on your behalf' },
  { key: 'does_direct_marketing',    label: 'Sends marketing messages to individuals' },
  { key: 'uses_automated_decisions', label: 'Uses automated systems to make decisions about individuals' },
  { key: 'processes_children_data',  label: 'Handles personal data of children under 18' },
  { key: 'is_public_institution',    label: 'Is a government or public institution' },
]

function IconFilter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  )
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

export function Assessment() {
  const nav = useNavigate()
  const [profile, setProfile] = useState<OrgProfile>(DEFAULT_PROFILE)
  const [catalogue, setCatalogue] = useState<CatalogueOut | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { api.getCatalogue().then(setCatalogue) }, [])

  const applicable = catalogue ? filterControls(catalogue.controls, profile).length : null
  const total      = catalogue?.total ?? 52

  function set<K extends keyof OrgProfile>(key: K, val: OrgProfile[K]) {
    setProfile(p => ({ ...p, [key]: val }))
  }

  function handleNext() {
    if (!profile.name.trim()) { setError('Organisation name is required.'); return }
    setError(null)
    nav('/assess/new/controls', { state: { profile } })
  }

  return (
    <div className={s.page}>
      <Watermark />

      <div className={s.layout}>

        {/* ── Left intro column ── */}
        <div className={s.intro}>
          <span className={s.stepPill}>Step 1 of 2</span>

          <h1 className={s.title}>Tell us about your organisation</h1>
          <p className={s.subtitle}>
            We use your profile to show only the requirements that apply to you.
          </p>

          <div className={s.points}>
            <div className={s.point}>
              <div className={s.pointIcon}><IconFilter /></div>
              <div>
                <div className={s.pointHead}>Only relevant questions</div>
                <div className={s.pointText}>
                  We filter the 52 PDPA requirements down to what actually applies based on your sector and activities.
                </div>
              </div>
            </div>
            <div className={s.point}>
              <div className={s.pointIcon}><IconLock /></div>
              <div>
                <div className={s.pointHead}>Private to you</div>
                <div className={s.pointText}>
                  Your answers calculate your score. Nothing is stored or shared after the session.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form card ── */}
        <div className={s.formCard}>

          <div className={s.fields}>
            <div className={s.field}>
              <label className={s.label}>ORGANISATION NAME</label>
              <input
                className={s.input}
                value={profile.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Bahari Health Centre"
              />
            </div>

            <div className={s.field}>
              <label className={s.label}>SECTOR</label>
              <select className={s.select} value={profile.sector}
                onChange={e => set('sector', e.target.value)}>
                {SECTORS.map(sec => <option key={sec}>{sec}</option>)}
              </select>
            </div>

            <div className={s.row2}>
              <div className={s.field}>
                <label className={s.label}>NUMBER OF EMPLOYEES</label>
                <select className={s.select} value={profile.employee_band}
                  onChange={e => set('employee_band', e.target.value as OrgProfile['employee_band'])}>
                  <option value="1-49">1 – 49</option>
                  <option value="50-99">50 – 99</option>
                  <option value="100+">100 or more</option>
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>ANNUAL TURNOVER (TZS)</label>
                <select className={s.select} value={profile.turnover_band}
                  onChange={e => set('turnover_band', e.target.value as OrgProfile['turnover_band'])}>
                  <option value="<100M">Under 100 million</option>
                  <option value="100-500M">100 – 500 million</option>
                  <option value=">500M">Over 500 million</option>
                </select>
              </div>
            </div>

            <div className={s.toggleBox}>
              <p className={s.toggleTitle}>WHAT YOUR ORGANISATION DOES</p>
              {TOGGLES.map(({ key, label }) => (
                <label key={key} className={s.toggle}>
                  <input
                    type="checkbox"
                    checked={!!profile[key]}
                    onChange={e => set(key, e.target.checked as OrgProfile[typeof key])}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {applicable !== null && (
              <div className={s.counter}>
                <strong>{applicable} of {total}</strong> questions apply to your profile.
              </div>
            )}

            {error && <div className={s.error}>{error}</div>}

            <button className={s.cta} onClick={handleNext} type="button">
              Next: answer questions →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
