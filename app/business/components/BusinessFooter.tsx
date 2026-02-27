'use client';

import { useState } from 'react';

type BusinessFooterProps = {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function BusinessFooter({ theme, onToggleTheme }: BusinessFooterProps) {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <a href="/business" className="footer-brand-logo">
            MO<span>I</span>L
          </a>
          <p className="footer-tagline">
            The AI Co-Founder for small businesses. Market research, business planning, content marketing, AI visuals,
            smart hiring, and 24/7 coaching — one platform.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span className="f-badge fb-g">SOC 2 Compliant</span>
            <span className="f-badge fb-p">Bilingual EN/ES</span>
            <span className="f-badge fb-o">500+ Businesses</span>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Platform</div>
          <div className="footer-links">
            <a href="#capabilities">Features</a>
            <a href="#journey">How It Works</a>
            <a href="#hiring">Smart Hiring</a>
            <a href="#pricing">Pricing</a>
            <a href="https://business.moilapp.com/register" target="_blank" rel="noreferrer">
              Post a Job
            </a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Resources</div>
          <div className="footer-links">
            <a href="https://blog.moilapp.com" target="_blank" rel="noreferrer">
              Blog
            </a>
            <a href="https://moilapp.com/business" target="_blank" rel="noreferrer">
              About Us
            </a>
            <a href="https://moilapp.com/business" target="_blank" rel="noreferrer">
              Contact
            </a>
            <a href="https://moilapp.com/business" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
            <a href="/candidate">For Job Seekers</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Get Started</div>
          <div className="footer-links">
            <a href="https://business.moilapp.com/register" target="_blank" rel="noreferrer">
              Free Consultation
            </a>
            <a href="https://moilapp.com/business" target="_blank" rel="noreferrer">
              Login
            </a>
            <a href="#pricing">Starter — $15/mo</a>
            <a href="#pricing">Professional — $25/mo</a>
            <a href="#pricing">Market Pro — $75/mo</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 MOIL. ALL RIGHTS RESERVED. · TEXAS-BORN. AI-POWERED.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
              EN
            </button>
            <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>
              ES
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '10px',
                color: 'var(--text3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Theme
            </span>
            <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
              <div className="toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
            </button>
          </div>
        </div>
        <div className="footer-badges">
          <span className="f-badge fb-g">SOC 2</span>
          <span className="f-badge fb-p">EN/ES</span>
          <span className="f-badge fb-o">30-Day Guarantee</span>
        </div>
      </div>
    </footer>
  );
}
