import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WebCore — Website & Online-Buchung für lokale Unternehmen';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#0C1620',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(201, 168, 124, 0.10)',
            border: '1px solid rgba(201, 168, 124, 0.25)',
            borderRadius: 999,
            padding: '6px 18px',
            marginBottom: 36,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A87C' }} />
          <span style={{ fontSize: 15, color: '#C9A87C', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Für lokale Unternehmen in Deutschland
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: '#EDE0C8',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 28,
          }}
        >
          WebCore
        </div>

        {/* Sub line */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(237, 224, 200, 0.62)',
            lineHeight: 1.5,
            maxWidth: 640,
            marginBottom: 56,
          }}
        >
          Website, Online-Buchung und Admin-Panel — eingerichtet in einer Woche, DSGVO-konform.
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['EU-Hosting', 'DSGVO-konform', 'Aus Braunschweig', 'Kein Lock-in'].map(badge => (
            <div
              key={badge}
              style={{
                background: 'rgba(201, 168, 124, 0.08)',
                border: '1px solid rgba(201, 168, 124, 0.28)',
                borderRadius: 8,
                padding: '9px 22px',
                color: '#C9A87C',
                fontSize: 17,
                fontWeight: 500,
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* Bottom right domain */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: 56,
            fontSize: 18,
            color: 'rgba(237, 224, 200, 0.28)',
            letterSpacing: '0.06em',
          }}
        >
          webcore.de
        </div>
      </div>
    ),
    { ...size },
  );
}
