const STRIPES = 12

export const PitchSvg = () => (
  <svg
    className="absolute inset-0 w-full h-full z-10"
    viewBox="0 0 1200 800"
    preserveAspectRatio="none">
    <rect width="1200" height="800" fill="#0f7a2a" />

    {Array.from({ length: STRIPES }).map((_, i) => (
      <rect
        key={i}
        x={(1200 / STRIPES) * i}
        y="0"
        width={1200 / STRIPES}
        height="800"
        fill="#000"
        opacity={i % 2 === 0 ? 0.05 : 0}
      />
    ))}

    <rect
      x="0"
      y="0"
      width="1200"
      height="800"
      rx="20"
      ry="20"
      stroke="white"
      strokeWidth="8"
      fill="none"
      opacity=".5"
    />
    <line x1="600" y1="0" x2="600" y2="800" stroke="white" strokeWidth="4" opacity=".4" />
    <circle cx="600" cy="400" r="55" stroke="white" strokeWidth="4" fill="none" opacity=".5" />

    <rect
      x="0"
      y="160"
      width="120"
      height="480"
      stroke="white"
      strokeWidth="4"
      fill="none"
      opacity=".5"
    />
    <rect
      x="0"
      y="260"
      width="40"
      height="280"
      stroke="white"
      strokeWidth="4"
      fill="none"
      opacity=".5"
    />
    <rect
      x="1080"
      y="160"
      width="120"
      height="480"
      stroke="white"
      strokeWidth="4"
      fill="none"
      opacity=".5"
    />
    <rect
      x="1160"
      y="260"
      width="40"
      height="280"
      stroke="white"
      strokeWidth="4"
      fill="none"
      opacity=".5"
    />
  </svg>
)
