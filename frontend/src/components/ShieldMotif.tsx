interface Props {
  size?: number
  opacity?: number
  className?: string
}

export function ShieldMotif({ size = 200, opacity = 0.5, className }: Props) {
  return (
    <svg
      viewBox="0 0 120 136"
      width={size}
      height={size}
      style={{ opacity }}
      className={className}
      aria-hidden
    >
      {/* Outer orbit ring */}
      <ellipse
        cx="60" cy="66" rx="57" ry="63"
        fill="none"
        stroke="#9FE1CB"
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.5"
      />

      {/* Outer shield */}
      <path
        d="M60 8 L102 24 L102 66 Q102 102 60 122 Q18 102 18 66 L18 24 Z"
        fill="none"
        stroke="#9FE1CB"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner dashed shield */}
      <path
        d="M60 22 L90 35 L90 64 Q90 89 60 105 Q30 89 30 64 L30 35 Z"
        fill="none"
        stroke="#5DCAA5"
        strokeWidth="1"
        strokeDasharray="5 4"
        strokeLinejoin="round"
      />

      {/* Node — top centre (shield tip) */}
      <circle cx="60" cy="8" r="3.5" fill="#1D9E75" />
      {/* Node — top right */}
      <circle cx="102" cy="24" r="3.5" fill="#1D9E75" />
      {/* Node — top left */}
      <circle cx="18" cy="24" r="3.5" fill="#1D9E75" />
    </svg>
  )
}
