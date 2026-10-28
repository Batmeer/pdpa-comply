import s from './Watermark.module.css'

const SHIELD = "M100,8 L192,38 L192,148 Q192,232 100,248 Q8,232 8,148 L8,38 Z"

export function Watermark() {
  return (
    <div className={s.wrap} aria-hidden>

      {/* Large shield + padlock — bottom left, bleeds off edge */}
      <svg className={`${s.el} ${s.shieldBL}`} viewBox="0 0 200 256">
        <path d={SHIELD} fill="#1D9E75" opacity="0.06" />
        {/* Padlock body */}
        <rect x="82" y="148" width="36" height="28" rx="4" fill="#0F6E56" opacity="0.07" />
        {/* Padlock shackle */}
        <path d="M90,148 Q90,128 100,128 Q110,128 110,148"
          fill="none" stroke="#0F6E56" strokeWidth="6" strokeLinecap="round" opacity="0.07" />
      </svg>

      {/* Medium shield — top right, bleeds off edge */}
      <svg className={`${s.el} ${s.shieldTR}`} viewBox="0 0 200 256">
        <path d={SHIELD} fill="#0F6E56" opacity="0.05" />
      </svg>

      {/* Tech chevron lines — top right corner */}
      <svg className={`${s.el} ${s.chevronTR}`} viewBox="0 0 110 140">
        {[0, 1, 2, 3].map(i => (
          <polyline
            key={i}
            points={`${88 - i * 20},8 ${104 - i * 20},70 ${88 - i * 20},132`}
            fill="none"
            stroke="#1D9E75"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.05"
          />
        ))}
      </svg>

      {/* Tech chevron lines — bottom left corner */}
      <svg className={`${s.el} ${s.chevronBL}`} viewBox="0 0 110 140">
        {[0, 1, 2, 3].map(i => (
          <polyline
            key={i}
            points={`${22 + i * 20},8 ${6 + i * 20},70 ${22 + i * 20},132`}
            fill="none"
            stroke="#1D9E75"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.05"
          />
        ))}
      </svg>

      {/* Faint record / document rectangle — mid right */}
      <svg className={`${s.el} ${s.document}`} viewBox="0 0 72 92">
        <rect x="4" y="4" width="64" height="84" rx="7" fill="none" stroke="#1D9E75" strokeWidth="2" opacity="0.04" />
        <line x1="14" y1="28" x2="58" y2="28" stroke="#1D9E75" strokeWidth="1.5" opacity="0.04" />
        <line x1="14" y1="42" x2="58" y2="42" stroke="#1D9E75" strokeWidth="1.5" opacity="0.04" />
        <line x1="14" y1="56" x2="44" y2="56" stroke="#1D9E75" strokeWidth="1.5" opacity="0.04" />
        <line x1="14" y1="70" x2="52" y2="70" stroke="#1D9E75" strokeWidth="1.5" opacity="0.04" />
      </svg>

      {/* Scattered nodes — spread across the margins */}
      <svg className={`${s.el} ${s.dots}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="3"  cy="18" r="0.55" fill="#5DCAA5" opacity="0.06" />
        <circle cx="97" cy="12" r="0.55" fill="#5DCAA5" opacity="0.06" />
        <circle cx="4"  cy="55" r="0.4"  fill="#5DCAA5" opacity="0.05" />
        <circle cx="96" cy="62" r="0.4"  fill="#5DCAA5" opacity="0.05" />
        <circle cx="2"  cy="82" r="0.55" fill="#5DCAA5" opacity="0.06" />
        <circle cx="98" cy="88" r="0.55" fill="#5DCAA5" opacity="0.06" />
        <circle cx="50" cy="2"  r="0.4"  fill="#5DCAA5" opacity="0.04" />
      </svg>

    </div>
  )
}
