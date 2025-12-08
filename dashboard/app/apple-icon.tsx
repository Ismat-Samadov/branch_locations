import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Apple Icon component (larger, more detailed)
export default function AppleIcon() {
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
          borderRadius: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Buildings */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '50px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#667eea',
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#667eea',
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#667eea',
                  borderRadius: '3px',
                }}
              />
            </div>

            <div
              style={{
                width: '50px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#764ba2',
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#764ba2',
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#764ba2',
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#764ba2',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          {/* Map Pin */}
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#ef4444',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid white',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
