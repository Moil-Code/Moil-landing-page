export const content360Styles = String.raw`
/* ============================================================
   THEME TOKENS
   ============================================================ */
:root {
  --orange: #FF5C1A;
  --orange-dim: rgba(255,92,26,0.12);
  --orange-glow: rgba(255,92,26,0.35);
  --purple: #7C3AED;
  --purple-light: #9D6EF8;
  --purple-dim: rgba(124,58,237,0.14);
  --purple-glow: rgba(124,58,237,0.35);
  --blue: #3B82F6;
  --blue-dim: rgba(59,130,246,0.12);
  --green: #10B981;
  --mono: 'JetBrains Mono', monospace;
  --display: 'Bebas Neue', sans-serif;
  --body: 'DM Sans', sans-serif;
  --transition-theme: background 0.4s ease, color 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

/* DARK THEME */
[data-theme="dark"] {
  --bg: #06080D;
  --bg2: #080C14;
  --surface: #0C0F18;
  --surface2: #111520;
  --surface3: #161B28;
  --border: #1A1F2E;
  --border2: #242938;
  --text: #EEF2FF;
  --text2: #8892AA;
  --text3: #4A5368;
  --text4: #2E3548;
  --nav-bg: rgba(6,8,13,0.92);
  --card-shadow: 0 20px 60px rgba(0,0,0,0.5);
  --hero-shadow: 0 40px 120px rgba(0,0,0,0.8);
  --grid-color: rgba(255,92,26,0.04);
  --invert-icon: 0;
}

/* LIGHT THEME */
[data-theme="light"] {
  --bg: #F8F7FF;
  --bg2: #F2F0FA;
  --surface: #FFFFFF;
  --surface2: #F4F2FC;
  --surface3: #EDE9FA;
  --border: #E4E0F4;
  --border2: #D4CEEE;
  --text: #0F0A1E;
  --text2: #4A4068;
  --text3: #8878B0;
  --text4: #C4B8E0;
  --nav-bg: rgba(248,247,255,0.92);
  --card-shadow: 0 8px 32px rgba(124,58,237,0.08);
  --hero-shadow: 0 20px 60px rgba(124,58,237,0.12);
  --grid-color: rgba(124,58,237,0.05);
  --invert-icon: 1;
}

/* ============================================================
   BASE
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--body);
  overflow-x: hidden;
  cursor: none;
  transition: var(--transition-theme);
}

/* Grain overlay — lighter in light mode */
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 9997;
  transition: opacity 0.4s;
}
[data-theme="dark"] body::before { opacity: 0.025; }
[data-theme="light"] body::before { opacity: 0.012; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--orange), var(--purple)); border-radius: 2px; }

/* ============================================================
   CUSTOM CURSOR (desktop only)
   ============================================================ */
.cursor {
  position: fixed; width: 12px; height: 12px;
  background: var(--orange); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.1s, width 0.3s, height 0.3s;
  mix-blend-mode: screen;
}
.cursor-ring {
  position: fixed; width: 36px; height: 36px;
  border: 1px solid rgba(124,58,237,0.5); border-radius: 50%;
  pointer-events: none; z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease-out, width 0.3s, height 0.3s, border-color 0.3s;
}
@media (hover: none) { .cursor, .cursor-ring { display: none; } body { cursor: auto; } }

/* ============================================================
   THEME TOGGLE
   ============================================================ */
.theme-toggle {
  width: 48px; height: 26px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 100px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
  display: flex; align-items: center;
  padding: 3px;
  gap: 0;
}
[data-theme="light"] .theme-toggle { background: var(--purple-dim); border-color: rgba(124,58,237,0.3); }
.theme-toggle-knob {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--orange), var(--purple-light));
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; line-height: 1;
}
[data-theme="dark"] .theme-toggle-knob { transform: translateX(0); }
[data-theme="light"] .theme-toggle-knob { transform: translateX(22px); }

/* ============================================================
   NAV
   ============================================================ */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 16px 48px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  transition: background 0.4s, backdrop-filter 0.4s, border-color 0.4s;
  border-bottom: 1px solid transparent;
}
nav.scrolled {
  background: var(--nav-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-color: var(--border);
}
.nav-logo {
  font-family: var(--display); font-size: 22px; letter-spacing: 2px;
  color: var(--text); text-decoration: none;
  display: flex; align-items: center; gap: 8px; white-space: nowrap;
}
.nav-logo .logo-dot { color: var(--orange); }
.nav-badge {
  font-family: var(--mono); font-size: 8px;
  background: var(--orange-dim); color: var(--orange);
  border: 1px solid rgba(255,92,26,0.3);
  padding: 3px 7px; border-radius: 4px;
  letter-spacing: 1px; text-transform: uppercase;
}
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a {
  font-size: 13px; font-weight: 500; color: var(--text2);
  text-decoration: none; letter-spacing: 0.3px; transition: color 0.2s;
}
.nav-links a:hover { color: var(--text); }
.nav-right { display: flex; align-items: center; gap: 14px; }
.nav-cta {
  background: var(--orange); color: white; border: none;
  padding: 9px 20px; border-radius: 6px;
  font-family: var(--body); font-size: 13px; font-weight: 600;
  cursor: pointer; letter-spacing: 0.2px; white-space: nowrap;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.nav-cta:hover { background: #FF7A40; transform: translateY(-1px); box-shadow: 0 8px 28px var(--orange-glow); }

/* Hamburger */
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  cursor: pointer; padding: 4px; background: none; border: none;
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: var(--text); border-radius: 2px;
  transition: all 0.3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  display: none; position: fixed;
  top: 0; left: 0; right: 0; bottom: 0; z-index: 99;
  background: var(--surface); padding: 90px 32px 40px;
  flex-direction: column; gap: 8px;
  transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
  overflow-y: auto;
}
.mobile-menu.open { transform: translateX(0); }
@media (max-width: 900px) { .mobile-menu { display: flex; } }
.mobile-menu a, .mobile-menu button.mmenu-cta {
  font-family: var(--display); font-size: 36px; letter-spacing: 2px;
  color: var(--text); text-decoration: none; text-transform: uppercase;
  padding: 12px 0; border-bottom: 1px solid var(--border);
  display: block; transition: color 0.2s;
}
.mobile-menu a:hover { color: var(--orange); }
.mmenu-cta {
  background: var(--orange) !important; color: white !important;
  border: none !important; border-radius: 10px !important;
  padding: 16px 32px !important; margin-top: 16px;
  font-size: 20px !important; cursor: pointer; text-align: center;
}
.mobile-menu-footer { margin-top: auto; display: flex; align-items: center; gap: 16px; padding-top: 24px; }
.mmenu-theme-label { font-family: var(--mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; }

/* ============================================================
   HERO
   ============================================================ */
#hero {
  min-height: 100svh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 100px 24px 60px;
  position: relative; overflow: hidden; text-align: center;
}
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%);
  transition: var(--transition-theme);
}
.hero-orb {
  position: absolute; border-radius: 50%;
  filter: blur(100px); pointer-events: none;
}
.hero-orb-1 {
  width: min(600px, 100vw); height: min(600px, 100vw);
  background: radial-gradient(circle, rgba(255,92,26,0.15) 0%, transparent 70%);
  top: -80px; left: 50%; transform: translateX(-50%);
  animation: orbFloat1 8s ease-in-out infinite;
}
.hero-orb-2 {
  width: min(400px, 80vw); height: min(400px, 80vw);
  background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
  bottom: 0; left: 5%;
  animation: orbFloat2 10s ease-in-out infinite;
}
.hero-orb-3 {
  width: min(350px, 70vw); height: min(350px, 70vw);
  background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
  top: 30%; right: 0;
  animation: orbFloat3 9s ease-in-out infinite;
}
[data-theme="light"] .hero-orb-1 { background: radial-gradient(circle, rgba(255,92,26,0.12) 0%, transparent 70%); }
[data-theme="light"] .hero-orb-3 { background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%); }

@keyframes orbFloat1 { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(-20px);} }
@keyframes orbFloat2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-25px);} }
@keyframes orbFloat3 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(20px);} }

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--orange-dim); border: 1px solid rgba(255,92,26,0.25);
  padding: 7px 16px; border-radius: 100px;
  font-family: var(--mono); font-size: 10px; color: var(--orange);
  letter-spacing: 1.5px; text-transform: uppercase;
  margin-bottom: 28px;
  animation: fadeUp 0.8s ease forwards; opacity: 0;
}
.eyebrow-dot {
  width: 6px; height: 6px; background: var(--orange);
  border-radius: 50%; animation: blink 2s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.7);} }

.hero-headline {
  font-family: var(--display);
  font-size: clamp(56px, 10vw, 140px);
  line-height: 0.92; letter-spacing: 2px; text-transform: uppercase;
  max-width: 1100px; margin-bottom: 24px;
  animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0;
}
.hl-orange { color: var(--orange); }
.hl-purple { color: var(--purple-light); }

.hero-sub {
  font-size: clamp(15px, 2vw, 18px); font-weight: 300;
  color: var(--text2); max-width: 580px; line-height: 1.7;
  margin-bottom: 40px;
  animation: fadeUp 0.8s ease 0.4s forwards; opacity: 0;
}
.hero-ctas {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  animation: fadeUp 0.8s ease 0.6s forwards; opacity: 0;
  margin-bottom: 60px;
}
@keyframes fadeUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }

/* Buttons */
.btn-primary {
  background: var(--orange); color: white; border: none;
  padding: 15px 32px; border-radius: 8px;
  font-family: var(--body); font-size: 15px; font-weight: 700;
  cursor: pointer; letter-spacing: 0.2px;
  transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px;
  position: relative; overflow: hidden;
}
.btn-primary::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
  transform: translateX(-100%); transition: transform 0.4s;
}
.btn-primary:hover::before { transform: translateX(100%); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px var(--orange-glow); }
.btn-secondary {
  background: transparent; color: var(--text);
  border: 1px solid var(--border2);
  padding: 15px 32px; border-radius: 8px;
  font-family: var(--body); font-size: 15px; font-weight: 500;
  cursor: pointer; letter-spacing: 0.2px;
  transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px;
}
.btn-secondary:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

/* Hero dashboard */
.hero-dashboard {
  position: relative; width: 100%; max-width: 860px;
  margin: 0 auto;
  animation: fadeUp 0.8s ease 0.8s forwards; opacity: 0;
}
.hero-dashboard::before {
  content: ''; position: absolute; top: -20px; left: 50%;
  transform: translateX(-50%); width: 70%; height: 80px;
  background: var(--orange); filter: blur(60px); opacity: 0.15; pointer-events: none;
}
.dashboard-frame {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 14px; overflow: hidden;
  box-shadow: var(--hero-shadow), 0 0 0 1px rgba(255,92,26,0.1);
  transition: var(--transition-theme);
}
.dashboard-bar {
  background: var(--surface2); padding: 10px 18px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border);
  transition: var(--transition-theme);
}
.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-r { background: #FF5F56; } .dot-y { background: #FFBD2E; } .dot-g { background: #27C93F; }
.dashboard-title { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-left: 6px; letter-spacing: 1px; }
.dashboard-status { margin-left: auto; display: flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 10px; color: var(--green); white-space: nowrap; }
.status-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: blink 2s infinite; }
.dashboard-body { padding: 16px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; gap: 6px; }

/* ---- Score panel: spans 2 cols × 2 rows, stacked vertically ---- */
.score-panel {
  grid-column: span 2;
  grid-row: span 2;
  background: linear-gradient(135deg, var(--orange-dim), var(--purple-dim));
  border: 1px solid rgba(255,92,26,0.2); border-radius: 8px;
  padding: 12px; display: flex; flex-direction: column; gap: 8px;
}

/* Top portion: score number + bar + chips */
.score-left { display: flex; flex-direction: column; gap: 6px; }
.score-label { font-family: var(--mono); font-size: 8px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
.score-value { font-family: var(--mono); font-size: 36px; font-weight: 700; color: var(--orange); line-height: 1; }
.score-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.score-fill { height: 100%; background: linear-gradient(90deg, var(--orange), var(--purple-light)); border-radius: 2px; width: 0; transition: width 2s ease; }
.score-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
.score-chip {
  font-family: var(--mono); font-size: 7px; padding: 2px 5px;
  border-radius: 3px; background: rgba(255,255,255,0.07); color: var(--text2);
  border: 1px solid var(--border2);
}

/* Bottom portion: rotating social post preview */
.post-preview {
  flex: 1; display: flex; flex-direction: column; justify-content: space-between;
  min-height: 0;
}
.post-preview-inner {
  background: var(--surface); border: 1px solid var(--border2); border-radius: 6px;
  padding: 8px; display: flex; flex-direction: column; gap: 5px;
  animation: postFadeIn 0.45s ease forwards;
}
.post-preview-top { display: flex; align-items: center; gap: 6px; }
.post-avatar {
  width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--orange), var(--purple-light));
}
.post-meta { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.post-handle { font-family: var(--mono); font-size: 7px; color: var(--text); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post-platform-label { font-family: var(--mono); font-size: 6px; color: var(--text3); }
.post-day-badge {
  font-family: var(--mono); font-size: 6px; padding: 2px 4px;
  background: var(--orange-dim); color: var(--orange); border-radius: 3px; white-space: nowrap;
}

/* Post image block */
.post-img {
  width: 100%; height: 44px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.post-img-promo { background: linear-gradient(135deg, #7C1D0A 0%, #BF3A0D 50%, #7B1FA2 100%); }
.post-img-ent   { background: linear-gradient(135deg, #4A1060 0%, #7B1FA2 50%, #FF6EC7 100%); }
.post-img-edu   { background: linear-gradient(135deg, #0A1F6B 0%, #1565C0 50%, #0D47A1 100%); }
.post-img-eng   { background: linear-gradient(135deg, #0B4027 0%, #1B7A4A 50%, #00BCD4 100%); }
.post-img-bts   { background: linear-gradient(135deg, #1A0A3D 0%, #4527A0 50%, #7C3AED 100%); }
.post-big-emoji { font-size: 22px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5)); }
.post-img-corner {
  position: absolute; bottom: 3px; right: 4px;
  font-family: var(--mono); font-size: 6px; font-weight: 700;
  color: rgba(255,255,255,0.7); letter-spacing: 0.5px;
}

/* Post caption / engagement */
.post-caption-text { font-size: 7px; color: var(--text2); line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-tags-text { font-family: var(--mono); font-size: 6px; color: var(--purple-light); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post-stats { display: flex; gap: 8px; }
.post-stat { display: flex; align-items: center; gap: 3px; }
.post-stat-icon { font-size: 8px; color: var(--orange); }
.post-stat-val { font-family: var(--mono); font-size: 7px; color: var(--text2); font-weight: 700; }

/* Carousel indicator dots */
.post-dots { display: flex; justify-content: center; gap: 4px; padding-top: 4px; }
.post-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--border2); transition: background 0.3s, width 0.3s;
}
.post-dot.active { background: var(--orange); width: 10px; border-radius: 2px; }

@keyframes postFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

/* ---- Legend chips in dashboard bar ---- */
.dashboard-bar-tags { display: flex; align-items: center; gap: 4px; margin-left: 12px; }
.bar-tag {
  font-size: 6px; font-weight: 700; padding: 2px 5px;
  border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;
}

/* ---- Day cards ---- */
.day-card {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 7px; padding: 6px 4px; text-align: center;
  transition: all 0.3s;
  animation: dayCardIn 0.4s ease forwards; opacity: 0;
}
.day-card:hover { border-color: var(--orange); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,92,26,0.12); }

/* Card header: day number + platform badge side by side */
.day-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; }
.day-num { font-family: var(--mono); font-size: 8px; color: var(--text3); }
.day-plat {
  font-family: var(--mono); font-size: 6px; font-weight: 700;
  padding: 1px 3px; border-radius: 2px; text-transform: uppercase;
}
.day-plat-ig  { background: rgba(228,64,95,0.18);  color: #E4405F; }
.day-plat-fb  { background: rgba(24,119,242,0.18); color: #1877F2; }
.day-plat-li  { background: rgba(10,102,194,0.18); color: #0A66C2; }

.day-type {
  font-size: 7px; font-weight: 700; padding: 2px 5px;
  border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 4px; display: inline-block;
}
.type-edu  { background: var(--blue-dim);              color: #60A5FA; }
.type-promo{ background: var(--orange-dim);            color: var(--orange); }
.type-eng  { background: rgba(16,185,129,0.15);        color: #34D399; }
.type-bts  { background: var(--purple-dim);            color: var(--purple-light); }
.type-ent  { background: rgba(168,85,247,0.15);        color: #C084FC; }

/* Day image thumbnail — type-specific rich gradients */
.day-img {
  width: 100%; height: 38px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.day-img-edu   { background: linear-gradient(135deg, #0D1B4B 0%, #1565C0 100%); }
.day-img-promo { background: linear-gradient(135deg, #5C1200 0%, #C0390D 100%); }
.day-img-eng   { background: linear-gradient(135deg, #083020 0%, #16714A 100%); }
.day-img-bts   { background: linear-gradient(135deg, #150830 0%, #4527A0 100%); }
.day-img-ent   { background: linear-gradient(135deg, #3A0050 0%, #8E24AA 100%); }
.day-emoji { font-size: 14px; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6)); }
.day-video-badge {
  position: absolute; bottom: 2px; right: 2px;
  background: var(--orange); width: 11px; height: 11px;
  border-radius: 2px; display: flex; align-items: center; justify-content: center;
  font-size: 6px; color: white;
  box-shadow: 0 1px 4px rgba(255,92,26,0.5);
}
@keyframes dayCardIn { from{opacity:0;transform:translateY(8px) scale(0.95);} to{opacity:1;transform:none;} }

/* ============================================================
   SECTION COMMONS
   ============================================================ */
.section-wrap { max-width: 1280px; margin: 0 auto; padding: 100px 48px; }
.section-tag {
  font-family: var(--mono); font-size: 10px; color: var(--orange);
  text-transform: uppercase; letter-spacing: 3px;
  margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
}
.section-tag::before { content: ''; display: block; width: 20px; height: 1px; background: var(--orange); }
.section-headline {
  font-family: var(--display); font-size: clamp(40px, 6vw, 84px);
  line-height: 0.95; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
}
.section-sub { font-size: 16px; font-weight: 300; color: var(--text2); max-width: 520px; line-height: 1.75; }
.divider { width: 100%; height: 1px; background: var(--border); transition: var(--transition-theme); }
.divider-glow {
  width: 100%; height: 1px; max-width: 800px; margin: 0 auto;
  background: linear-gradient(90deg, transparent, var(--orange) 30%, var(--purple) 70%, transparent);
  opacity: 0.4;
}

/* Reveal animations */
.reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* ============================================================
   PROBLEM SECTION
   ============================================================ */
#problem { max-width: 1280px; margin: 0 auto; padding: 100px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.problem-quote {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: clamp(22px, 2.5vw, 36px); line-height: 1.4;
  color: var(--text); margin: 28px 0;
}
.problem-quote em { color: var(--orange); font-style: normal; }

.chaos-calendar {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 16px; padding: 20px;
  transition: var(--transition-theme);
}
.chaos-title { font-family: var(--mono); font-size: 9px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
.chaos-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 5px; }
.chaos-day {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 5px; padding: 7px 3px; text-align: center;
  font-family: var(--mono); font-size: 9px; color: var(--text3);
  aspect-ratio: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
  transition: var(--transition-theme);
}
.chaos-day.empty { background: transparent; border-color: transparent; opacity: 0.2; }
.chaos-day.missed { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.18); }
.chaos-x { color: #EF4444; font-size: 13px; }
.chaos-day.done { background: rgba(16,185,129,0.05); border-color: rgba(16,185,129,0.12); }
.chaos-day.late { background: var(--purple-dim); border-color: rgba(124,58,237,0.2); }
.chaos-label { font-size: 7px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; }
.chaos-note {
  margin-top: 12px; padding: 9px 12px;
  background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.14);
  border-radius: 6px; font-size: 11px; color: #F87171;
  font-family: var(--mono); display: flex; align-items: center; gap: 8px;
}

/* ============================================================
   SOLUTION / TERMINAL
   ============================================================ */
#solution { max-width: 1280px; margin: 0 auto; padding: 100px 48px; text-align: center; }
.ai-terminal {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 18px; overflow: hidden; margin-top: 56px;
  box-shadow: var(--card-shadow); position: relative;
  transition: var(--transition-theme);
}
.ai-terminal::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 60%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--orange), transparent);
}
.terminal-header {
  background: var(--surface2); padding: 14px 20px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border); transition: var(--transition-theme);
}
.terminal-title { font-family: var(--mono); font-size: 11px; color: var(--text2); flex: 1; text-align: center; letter-spacing: 1px; }
.terminal-body { padding: 24px; }
.terminal-line {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--border);
  font-family: var(--mono); font-size: 12px;
  opacity: 0; transform: translateX(-8px); transition: all 0.4s ease; flex-wrap: wrap;
}
.terminal-line.active { opacity: 1; transform: none; }
.t-prompt { color: var(--orange); font-weight: 600; flex-shrink: 0; }
.t-key { color: var(--purple-light); flex-shrink: 0; }
.t-val { color: var(--text); flex: 1; min-width: 0; word-break: break-word; }
.t-status { color: var(--green); margin-left: auto; white-space: nowrap; font-size: 11px; }
.t-status.running { color: var(--blue); }

.progress-bar-wrap {
  margin-top: 20px; background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 14px;
  opacity: 0; transition: opacity 0.5s ease 1s; flex-wrap: wrap;
}
.progress-bar-wrap.active { opacity: 1; }
.progress-label { font-family: var(--mono); font-size: 10px; color: var(--text2); white-space: nowrap; }
.progress-track { flex: 1; min-width: 80px; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--orange), var(--purple-light)); border-radius: 3px; width: 0; transition: width 2.5s cubic-bezier(0.4,0,0.2,1) 1.2s; }
.progress-score { font-family: var(--mono); font-size: 18px; font-weight: 700; color: var(--purple-light); min-width: 44px; }

/* ============================================================
   HOW IT WORKS
   ============================================================ */
#how { max-width: 1280px; margin: 0 auto; padding: 100px 48px; }
.steps-timeline { margin-top: 72px; position: relative; }
.steps-timeline::before {
  content: ''; position: absolute; left: 35px; top: 36px; bottom: 36px; width: 1px;
  background: linear-gradient(180deg, var(--orange), var(--purple-light), var(--blue), var(--green)); opacity: 0.25;
}
.step-item { display: grid; grid-template-columns: 72px 1fr; gap: 36px; margin-bottom: 52px; align-items: start; }
.step-num {
  width: 72px; height: 72px; border: 1px solid var(--border2); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--orange);
  background: var(--surface); position: relative; z-index: 2;
  flex-shrink: 0; transition: all 0.3s;
}
.step-item:hover .step-num { background: var(--orange); color: white; border-color: var(--orange); box-shadow: 0 0 32px var(--orange-glow); }
.step-time {
  font-family: var(--mono); font-size: 9px; color: var(--orange);
  text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;
  background: var(--orange-dim); display: inline-block;
  padding: 3px 9px; border-radius: 4px; border: 1px solid rgba(255,92,26,0.2);
}
.step-title { font-family: var(--display); font-size: clamp(22px, 3vw, 34px); letter-spacing: 1px; margin-bottom: 10px; text-transform: uppercase; }
.step-desc { font-size: 14px; color: var(--text2); line-height: 1.7; max-width: 580px; margin-bottom: 14px; }
.step-outputs { display: flex; flex-wrap: wrap; gap: 7px; }
.output-chip {
  font-family: var(--mono); font-size: 10px; padding: 5px 11px;
  border-radius: 100px; border: 1px solid var(--border2); color: var(--text2);
  letter-spacing: 0.5px; transition: all 0.2s;
}
.output-chip:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-dim); }

/* ============================================================
   FEATURES
   ============================================================ */
#features { max-width: 1280px; margin: 0 auto; padding: 100px 48px; }
.features-grid { margin-top: 64px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.feature-card {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 20px; padding: 36px; position: relative;
  overflow: hidden; transition: all 0.4s;
}
.feature-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--orange), transparent);
  opacity: 0; transition: opacity 0.4s;
}
.feature-card:hover { border-color: rgba(255,92,26,0.25); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,92,26,0.08); }
.feature-card:hover::before { opacity: 1; }
.feature-card.large { grid-column: span 2; }
.feature-icon { width: 48px; height: 48px; background: var(--orange-dim); border: 1px solid rgba(255,92,26,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 20px; }
.feature-title { font-family: var(--display); font-size: clamp(20px, 2.5vw, 26px); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
.feature-desc { font-size: 14px; color: var(--text2); line-height: 1.7; margin-bottom: 18px; }
.feature-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.f-tag { font-family: var(--mono); font-size: 9px; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; }
.f-tag-o { background: var(--orange-dim); color: var(--orange); border: 1px solid rgba(255,92,26,0.2); }
.f-tag-b { background: var(--blue-dim); color: #60A5FA; border: 1px solid rgba(59,130,246,0.2); }
.f-tag-g { background: rgba(16,185,129,0.1); color: #34D399; border: 1px solid rgba(16,185,129,0.2); }
.f-tag-a { background: var(--purple-dim); color: var(--purple-light); border: 1px solid rgba(124,58,237,0.25); }

.mini-calendar-demo { display: grid; grid-template-columns: repeat(5,1fr); gap: 5px; margin-top: 16px; }
.mini-cal-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 7px; padding: 9px 5px; text-align: center; }
.mcc-day { font-family: var(--mono); font-size: 9px; color: var(--text3); margin-bottom: 4px; }
.mcc-bar { height: 3px; background: linear-gradient(90deg, var(--orange), var(--purple)); border-radius: 2px; margin: 3px 0; }
.mcc-label { font-size: 7px; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; }

/* ============================================================
   STATS
   ============================================================ */
#stats {
  background: linear-gradient(135deg, var(--orange-dim), var(--purple-dim));
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 72px 48px; transition: var(--transition-theme);
}
.stats-inner { max-width: 1280px; margin: 0 auto; }
.stats-grid {
  display: grid; grid-template-columns: repeat(6,1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
}
.stat-item { background: var(--surface); padding: 36px 20px; text-align: center; transition: background 0.3s; }
.stat-item:hover { background: var(--surface2); }
.stat-value { font-family: var(--mono); font-size: clamp(24px, 3vw, 40px); font-weight: 700; color: var(--purple-light); line-height: 1; margin-bottom: 8px; }
.stat-label { font-size: 11px; color: var(--text3); line-height: 1.4; text-transform: uppercase; letter-spacing: 0.5px; }

/* ============================================================
   PRICING
   ============================================================ */
#pricing { max-width: 1280px; margin: 0 auto; padding: 100px 48px; text-align: center; }
.pricing-intro { font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(17px, 2vw, 24px); color: var(--text2); max-width: 680px; margin: 20px auto 52px; line-height: 1.5; }
.pricing-intro strong { color: var(--orange); font-style: normal; }
.annual-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); padding: 7px 18px; border-radius: 100px; font-family: var(--mono); font-size: 10px; color: var(--green); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 44px; }
.pricing-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: left; }
.price-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 20px; padding: 36px; position: relative; transition: all 0.4s; overflow: hidden; }
.price-card:hover { transform: translateY(-6px); box-shadow: var(--card-shadow); }
.price-card.featured { border-color: var(--orange); background: linear-gradient(135deg, rgba(255,92,26,0.06) 0%, rgba(124,58,237,0.04) 60%, var(--surface) 100%); box-shadow: 0 0 0 1px rgba(255,92,26,0.25), 0 32px 80px rgba(255,92,26,0.08); }
.featured-badge { position: absolute; top: 20px; right: 20px; background: var(--orange); color: white; font-family: var(--mono); font-size: 8px; font-weight: 700; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; }
.price-tier { font-family: var(--display); font-size: 32px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
.price-tagline { font-size: 12px; color: var(--text2); margin-bottom: 28px; line-height: 1.5; }
.price-amount { display: flex; align-items: baseline; gap: 3px; margin-bottom: 6px; }
.price-dollar { font-family: var(--display); font-size: clamp(52px, 6vw, 68px); line-height: 1; color: var(--text); }
.featured-price { color: var(--orange); }
.price-period { font-family: var(--mono); font-size: 12px; color: var(--text3); }
.price-divider { height: 1px; background: var(--border); margin: 24px 0; }
.price-features { list-style: none; }
.price-features li { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: var(--text2); margin-bottom: 11px; line-height: 1.5; }
.check { color: var(--green); font-size: 13px; flex-shrink: 0; margin-top: 2px; }
.star { color: var(--orange); font-size: 13px; flex-shrink: 0; margin-top: 2px; }
.price-cta { display: block; width: 100%; padding: 13px; border-radius: 8px; font-family: var(--body); font-size: 14px; font-weight: 700; text-align: center; margin-top: 28px; cursor: pointer; transition: all 0.25s; text-decoration: none; border: none; }
.price-cta-secondary { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
.price-cta-secondary:hover { border-color: var(--purple); color: var(--purple-light); background: var(--purple-dim); }
.price-cta-primary { background: var(--orange); color: white; }
.price-cta-primary:hover { background: #FF7A40; transform: translateY(-2px); box-shadow: 0 8px 28px var(--orange-glow); }

/* ============================================================
   COMPARISON
   ============================================================ */
#comparison { max-width: 1280px; margin: 0 auto; padding: 100px 48px; }
.table-wrap { overflow-x: auto; margin-top: 52px; border-radius: 14px; border: 1px solid var(--border); }
.compare-table { width: 100%; border-collapse: collapse; min-width: 520px; }
.compare-table th { padding: 18px 20px; font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--text2); border-bottom: 1px solid var(--border); text-align: center; }
.compare-table th:first-child { text-align: left; }
.compare-table th.moil-col { color: var(--orange); }
.compare-table td { padding: 16px 20px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text2); text-align: center; vertical-align: middle; transition: background 0.2s; }
.compare-table td:first-child { text-align: left; color: var(--text); font-weight: 500; }
.compare-table tr:last-child td { border-bottom: none; }
.compare-table tr:hover td { background: rgba(255,92,26,0.02); }
.compare-table .moil-col { background: rgba(255,92,26,0.03); }
.compare-table .moil-col.highlight { color: var(--orange); font-family: var(--mono); font-weight: 700; }
.check-yes { color: var(--green); font-size: 17px; }
.check-no { color: var(--text3); font-size: 17px; }
.check-partial { color: var(--purple-light); font-size: 11px; font-family: var(--mono); }
.compare-header-moil { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.moil-best-badge { background: var(--orange); color: white; font-size: 8px; padding: 2px 7px; border-radius: 4px; letter-spacing: 1px; }

/* ============================================================
   TESTIMONIALS
   ============================================================ */
#testimonials { max-width: 1280px; margin: 0 auto; padding: 100px 48px; text-align: center; }
.testimonials-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 52px; text-align: left; }
.testimonial-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 20px; padding: 32px; transition: all 0.3s; position: relative; overflow: hidden; }
.testimonial-card:hover { border-color: rgba(255,92,26,0.2); transform: translateY(-4px); box-shadow: var(--card-shadow); }
.t-quote-mark { font-family: 'Playfair Display', serif; font-size: 72px; color: var(--orange); opacity: 0.12; line-height: 0.6; margin-bottom: 20px; display: block; }
.t-stars { color: var(--purple-light); font-size: 13px; margin-bottom: 14px; letter-spacing: 2px; }
.t-text { font-size: 14px; color: var(--text); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
.t-divider { height: 1px; background: var(--border); margin-bottom: 18px; }
.t-author { display: flex; align-items: center; gap: 11px; }
.t-avatar { width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-family: var(--display); font-size: 17px; color: var(--orange); flex-shrink: 0; }
.t-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
.t-role { font-size: 12px; color: var(--text3); }

/* ============================================================
   FINAL CTA
   ============================================================ */
#final-cta {
  min-height: 100svh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 100px 24px; text-align: center; position: relative; overflow: hidden;
}
.final-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 35% 50%, rgba(255,92,26,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 65% 50%, rgba(124,58,237,0.06) 0%, transparent 70%);
  transition: var(--transition-theme);
}
[data-theme="light"] .final-bg { background: radial-gradient(ellipse 60% 50% at 35% 50%, rgba(255,92,26,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 65% 50%, rgba(124,58,237,0.08) 0%, transparent 70%); }
.final-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--purple-dim) 1px, transparent 1px), linear-gradient(90deg, var(--purple-dim) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
}
.final-eyebrow { font-family: var(--mono); font-size: 10px; color: var(--text3); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 28px; position: relative; }
.final-headline { font-family: var(--display); font-size: clamp(54px, 9vw, 120px); line-height: 0.92; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 28px; position: relative; }
.final-headline .line-purple { color: var(--purple-light); }
.final-sub { font-size: clamp(15px, 2vw, 17px); color: var(--text2); font-weight: 300; max-width: 540px; margin: 0 auto 48px; line-height: 1.7; position: relative; }
.final-cta-btn {
  background: var(--orange); color: white; border: none;
  padding: 18px 52px; border-radius: 10px;
  font-family: var(--body); font-size: clamp(14px, 2vw, 17px); font-weight: 700;
  cursor: pointer; display: inline-flex; align-items: center; gap: 10px;
  transition: all 0.3s; position: relative;
  animation: ctaPulse 3s ease-in-out infinite; letter-spacing: 0.2px;
}
@keyframes ctaPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,92,26,0.3);} 50%{box-shadow:0 0 0 16px rgba(255,92,26,0);} }
.final-cta-btn:hover { background: #FF7A40; transform: translateY(-3px) scale(1.02); box-shadow: 0 16px 64px var(--orange-glow); }
.trust-row { display: flex; align-items: center; gap: 24px; justify-content: center; margin-top: 36px; flex-wrap: wrap; position: relative; }
.trust-item { display: flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
.trust-item .tick { color: var(--green); }

/* ============================================================
   FOOTER
   ============================================================ */
footer { background: var(--surface); border-top: 1px solid var(--border); padding: 48px; transition: var(--transition-theme); }
.footer-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
.footer-logo { font-family: var(--display); font-size: 22px; color: var(--text); letter-spacing: 2px; text-decoration: none; }
.footer-logo span { color: var(--orange); }
.footer-copy { font-family: var(--mono); font-size: 10px; color: var(--text3); letter-spacing: 1px; }
.footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
.footer-links a { font-family: var(--mono); font-size: 10px; color: var(--text3); text-decoration: none; letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s; }
.footer-links a:hover { color: var(--orange); }
.nav-lang-wrap { display: flex; align-items: center; gap: 6px; }
.nav-lang-icon { font-size: 14px; opacity: 0.7; }
.lang-toggle { display: flex; gap: 0; background: var(--surface3); border: 1px solid var(--border2); border-radius: 6px; overflow: hidden; padding: 2px; }
.lang-btn { padding: 5px 11px; font-family: var(--mono); font-size: 10px; cursor: pointer; border: none; background: transparent; color: var(--text2); letter-spacing: 1px; transition: all 0.2s; border-radius: 4px; min-width: 34px; text-align: center; font-weight: 600; }
.lang-btn.active { background: var(--orange); color: white; box-shadow: 0 2px 8px var(--orange-glow); }
.lang-btn:hover:not(.active) { color: var(--text); background: var(--surface2); }

/* ============================================================
   MOBILE RESPONSIVE
   ============================================================ */
@media (max-width: 900px) {
  /* Nav */
  nav { padding: 14px 20px; }
  .nav-links { display: none; }
  .nav-cta { display: none; }
  .nav-lang-wrap { display: none; }
  .hamburger { display: flex; }

  /* Typography */
  .hero-headline { font-size: clamp(48px, 12vw, 72px); }
  .section-headline { font-size: clamp(36px, 8vw, 56px); }

  /* Sections */
  .section-wrap { padding: 72px 20px; }
  #problem { grid-template-columns: 1fr; padding: 72px 20px; gap: 40px; }
  #solution { padding: 72px 20px; }
  #how { padding: 72px 20px; }
  #features { padding: 72px 20px; }
  #comparison { padding: 72px 20px; }
  #testimonials { padding: 72px 20px; }
  #pricing { padding: 72px 20px; }
  #stats { padding: 56px 20px; }

  /* Hero */
  #hero { padding: 90px 20px 48px; }
  .hero-ctas { flex-direction: column; align-items: center; }
  .btn-primary, .btn-secondary { width: 100%; max-width: 320px; justify-content: center; }
  .hero-dashboard { display: none; }

  /* Problem */
  .problem-quote { font-size: clamp(18px, 5vw, 26px); }
  .chaos-calendar { margin-top: 0; }

  /* Terminal */
  .terminal-line { font-size: 11px; }
  .t-val { font-size: 10px; }
  .t-status { font-size: 9px; }

  /* Steps */
  .steps-timeline::before { left: 28px; }
  .step-item { grid-template-columns: 56px 1fr; gap: 20px; margin-bottom: 40px; }
  .step-num { width: 56px; height: 56px; font-size: 11px; }
  .step-title { font-size: clamp(18px, 5vw, 24px); }

  /* Features */
  .features-grid { grid-template-columns: 1fr; }
  .feature-card.large { grid-column: span 1; }
  .feature-card.large > div { grid-template-columns: 1fr !important; gap: 24px !important; }

  /* Stats */
  .stats-grid { grid-template-columns: repeat(3, 1fr); }

  /* Pricing */
  .pricing-grid { grid-template-columns: 1fr; }

  /* Comparison */
  .compare-table td, .compare-table th { padding: 12px 14px; font-size: 12px; }

  /* Testimonials */
  .testimonials-grid { grid-template-columns: 1fr; }

  /* Final CTA */
  #final-cta { padding: 80px 20px; min-height: auto; }
  .final-headline { font-size: clamp(44px, 10vw, 72px); }
  .final-cta-btn { padding: 16px 36px; width: 100%; max-width: 340px; justify-content: center; }
  .trust-row { gap: 14px; }
  .trust-item { font-size: 9px; }

  /* Footer */
  footer { padding: 36px 20px; }
  .footer-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
}

@media (max-width: 480px) {
  /* Extra small */
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-eyebrow { font-size: 9px; padding: 6px 12px; }
  .section-tag { font-size: 9px; }
  .step-item { grid-template-columns: 48px 1fr; gap: 14px; }
  .step-num { width: 48px; height: 48px; font-size: 10px; }
  .steps-timeline::before { left: 23px; }
  nav { padding: 12px 16px; }
  .nav-logo { font-size: 18px; }
  .nav-badge { display: none; }
}
`;
