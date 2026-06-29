export function PhyTreeLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#f43f5e" />
      {/* Root */}
      <path
        d="M8 16 L12 16 L12 9 L20 9 L20 6 L24 6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom branch */}
      <path
        d="M12 16 L12 23 L20 23 L20 26"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top leaf dot */}
      <circle cx="24" cy="6" r="1.5" fill="white" />
      {/* Bottom leaf dot */}
      <circle cx="20" cy="26" r="1.5" fill="white" />
      {/* Middle branch split */}
      <path
        d="M12 16 L16 16 L16 13 L20 13"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="13" r="1.5" fill="white" />
    </svg>
  )
}
