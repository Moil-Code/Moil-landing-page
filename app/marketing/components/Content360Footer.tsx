type Props = {
  themeEmoji: string;
  onToggleTheme: () => void;
};

export function Content360Footer({ themeEmoji, onToggleTheme }: Props) {
  return (
    <footer className="content360-footer">
      <div className="footer-inner">
        <a href="#hero" className="footer-logo">
          MOIL<span>·</span>AI
        </a>
        <div className="footer-links">
          <a href="#how">How It Works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="https://moilapp.com/business" target="_blank" rel="noreferrer">
            Get Started
          </a>
        </div>
        <div className="lang-toggle">
          <button className="lang-btn active" type="button">
            EN
          </button>
          <button className="lang-btn" type="button">
            ES
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Mode
          </span>
          <button className="theme-toggle" type="button" aria-label="Toggle theme" data-hoverable onClick={onToggleTheme}>
            <div className="theme-toggle-knob">{themeEmoji}</div>
          </button>
        </div>
        <span className="footer-copy">© 2026 MOIL. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
}
