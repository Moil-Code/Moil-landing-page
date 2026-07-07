import type { Metadata } from 'next';
import { baseURL1 } from '../../../src/common/constants/baseUrl';

export const metadata: Metadata = {
  title: 'Moil vs ChatGPT — Which AI Tool is Better for Small Business?',
  description:
    'Compare Moil vs ChatGPT for small business owners. Moil is purpose-built: market research, business plans, hiring, and content — all in one bilingual platform. ChatGPT is a general chatbot.',
  alternates: { canonical: `${baseURL1}/compare/moil-vs-chatgpt` },
  openGraph: {
    title: 'Moil vs ChatGPT | Moil',
    description: 'See why Moil beats ChatGPT for small business owners who need an AI co-founder, not a chatbot.',
    url: `${baseURL1}/compare/moil-vs-chatgpt`,
  },
};

const ROWS = [
  { feature: 'Purpose-built for small business', moil: true, competitor: false },
  { feature: 'Investor-ready business plan (PDF)', moil: true, competitor: false },
  { feature: 'Deep market research (8–10 real sources)', moil: true, competitor: false },
  { feature: 'Smart hiring & job matching', moil: true, competitor: false },
  { feature: 'AI content calendar & scheduling', moil: true, competitor: false },
  { feature: 'Bilingual (English & Spanish)', moil: true, competitor: false },
  { feature: '5-year financial projections', moil: true, competitor: false },
  { feature: 'AI image & video creation', moil: true, competitor: false },
  { feature: 'General-purpose chat', moil: false, competitor: true },
  { feature: 'Free plan available', moil: true, competitor: true },
];

function Check({ yes }: { yes: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: yes ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
        color: yes ? '#22c55e' : '#ef4444',
        fontWeight: 700,
        fontSize: 16,
      }}
    >
      {yes ? '✓' : '✗'}
    </span>
  );
}

export default function MoilVsChatGPT() {
  return (
    <main
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: '#06080d',
        color: '#e8e8f0',
        minHeight: '100vh',
        padding: '100px 20px 100px',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Banner image */}
        <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 56 }}>
          <img
            src="https://res.cloudinary.com/daudj5isi/image/upload/v1783397285/moil_vs_chatgpt_oyi8ka.png"
            alt="Moil vs ChatGPT comparison banner"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Header */}
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#7c6ef0', marginBottom: 16 }}>
          Comparison
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: -0.5,
          }}
        >
          Moil vs ChatGPT
        </h1>
        <p style={{ fontSize: 16, color: '#a0a0b8', lineHeight: 1.7, maxWidth: 600, marginBottom: 56 }}>
          ChatGPT is a powerful general-purpose chatbot. Moil is an AI co-founder purpose-built for small business owners —
          with real market research, business plans, smart hiring, and bilingual support baked in.
        </p>

        {/* Table */}
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px 140px',
              background: 'rgba(255,255,255,0.04)',
              padding: '14px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#a0a0b8' }}>
              Feature
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#ff5c1a', textAlign: 'center' }}>Moil</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a0a0b8', textAlign: 'center' }}>ChatGPT</span>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 140px 140px',
                padding: '14px 24px',
                borderBottom: i < ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                gap: 8,
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
              }}
            >
              <span style={{ fontSize: 14, color: '#d0d0e0', display: 'flex', alignItems: 'center' }}>{row.feature}</span>
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Check yes={row.moil} />
              </span>
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Check yes={row.competitor} />
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <p style={{ color: '#a0a0b8', marginBottom: 24, fontSize: 15 }}>
            Ready to go beyond a chatbot and run your business with AI?
          </p>
          <a
            href="https://business.moilapp.com/register"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(110deg, #ff5c1a 0%, #b45cf0 52%, #7c3aed 100%)',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: 50,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              letterSpacing: 0.5,
            }}
          >
            Try Moil Free
          </a>
          <div style={{ marginTop: 20 }}>
            <a href="/business" style={{ color: '#7c6ef0', fontSize: 13, textDecoration: 'none' }}>
              ← Back to Moil for Business
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
