import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Dashboard } from './pages/Dashboard'
import { Results } from './pages/Results'
import { Assessment } from './pages/Assessment'
import { ControlAssessment } from './pages/ControlAssessment'
import { FormPreview } from './pages/FormPreview'
import s from './App.module.css'

function Nav() {
  return (
    <nav className={s.nav}>
      <div className={s.navInner}>
        <NavLink to="/" className={s.brand} end>
          <span className={s.brandMark}>P</span>
          <span>PDPA-Comply</span>
        </NavLink>
        <div className={s.links}>
          <NavLink to="/" className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
            About PDPA
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
            Demos
          </NavLink>
          <NavLink to="/assess" className={({ isActive }) => `${s.ctaLink} ${isActive ? s.ctaActive : ''}`}>
            Assess your organisation
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className={s.main}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assess" element={<Assessment />} />
          <Route path="/assess/new/controls" element={<ControlAssessment />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/forms/:id/:formType" element={<FormPreview />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
