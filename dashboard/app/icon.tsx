import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Icon component
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Building icon */}
          <rect x="4" y="4" width="6" height="16" fill="white" opacity="0.9" rx="1" />
          <rect x="14" y="8" width="6" height="12" fill="white" opacity="0.9" rx="1" />

          {/* Windows */}
          <rect x="6" y="7" width="2" height="2" fill="#667eea" rx="0.5" />
          <rect x="6" y="11" width="2" height="2" fill="#667eea" rx="0.5" />
          <rect x="6" y="15" width="2" height="2" fill="#667eea" rx="0.5" />

          <rect x="16" y="11" width="2" height="2" fill="#764ba2" rx="0.5" />
          <rect x="16" y="15" width="2" height="2" fill="#764ba2" rx="0.5" />

          {/* Map pin */}
          <circle cx="12" cy="6" r="3" fill="#ef4444" />
          <circle cx="12" cy="6" r="1.5" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
