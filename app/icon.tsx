import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 28,
          background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
