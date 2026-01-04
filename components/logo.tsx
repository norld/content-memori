"use client"

interface LogoProps {
  className?: string
  size?: number
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <circle cx="16" cy="16" r="16" fill="url(#gradient)" />

      {/* Brain/Memory icon */}
      <path
        d="M16 7C11.5817 7 8 10.5817 8 15C8 16.5 8.4 17.9 9.1 19.1C9.5 19.8 10.2 20.2 11 20.2C11.8 20.2 12.5 19.8 12.9 19.1C13.6 17.9 14 16.5 14 15C14 11.5 16.5 9 20 9C20.6 9 21.1 9.1 21.6 9.3C21.1 8.3 20.1 7.5 19 7.1C18 7 17 7 16 7Z"
        fill="white"
        fillOpacity="0.9"
      />

      {/* Spark/star representing ideas */}
      <path
        d="M22 12L23 15L26 16L23 17L22 20L21 17L18 16L21 15L22 12Z"
        fill="white"
        fillOpacity="0.7"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Full logo with text
export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={36} />
      <span className="text-white font-semibold tracking-tight text-base">Memorigw</span>
    </div>
  )
}
