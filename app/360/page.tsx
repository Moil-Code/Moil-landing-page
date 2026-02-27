"use client";

import { useEffect, useState } from "react";

export default function Page360() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobOpen, setMobOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>("[data-target]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        io.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const toggleFaq = (i: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const isDark = theme === "dark";

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;600;700&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');

    .p360 {
      --orange: #FF5C1A;
      --orange-dim: rgba(255,92,26,0.12);
      --orange-glow: rgba(255,92,26,0.32);
      --purple: #7C3AED;
      --purple-light: #9D6EF8;
      --purple-dim: rgba(124,58,237,0.14);
      --green: #10B981;
      --green-dim: rgba(16,185,129,0.12);
      --blue: #3B82F6;
      --blue-dim: rgba(59,130,246,0.12);
      --mono: 'JetBrains Mono', monospace;
      --display: 'Bebas Neue', sans-serif;
      --body: 'DM Sans', sans-serif;
      --serif: 'Playfair Display', serif;
    }
    .p360.dark-theme {
      --bg: #06080D; --surface: #0B0E18; --surface2: #10141F; --surface3: #161C2B;
      --border: #1A1F30; --border2: #222840; --text: #EEF2FF; --text2: #8892AA;
      --text3: #4A5368; --text4: #2C3245; --nav-bg: rgba(6,8,13,0.94);
      --shadow: 0 24px 80px rgba(0,0,0,0.6); --hero-glow: 0 40px 120px rgba(0,0,0,0.9);
      --grid-a: rgba(255,92,26,0.04); --grid-b: rgba(124,58,237,0.03);
      --card-border-hover: rgba(255,92,26,0.2);
    }
    .p360.light-theme {
      --bg: #F9F8FF; --surface: #FFFFFF; --surface2: #F3F0FC; --surface3: #EAE5F8;
      --border: #E2DCF5; --border2: #D0C8EE; --text: #0D091C; --text2: #4A3F72;
      --text3: #8878B0; --text4: #C0B4E0; --nav-bg: rgba(249,248,255,0.94);
      --shadow: 0 8px 40px rgba(124,58,237,0.1); --hero-glow: 0 20px 60px rgba(124,58,237,0.14);
      --grid-a: rgba(255,92,26,0.05); --grid-b: rgba(124,58,237,0.04);
      --card-border-hover: rgba(124,58,237,0.2);
    }
    .p360 { background: var(--bg); color: var(--text); font-family: var(--body); overflow-x: hidden; }
    .p360 *, .p360 *::before, .p360 *::after { box-sizing: border-box; }
    .p360 ::-webkit-scrollbar { width: 3px; }
    .p360 ::-webkit-scrollbar-track { background: var(--bg); }
    .p360 ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--orange), var(--purple)); border-radius: 2px; }

    /* NAV */
    .p360-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 14px 52px;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      transition: background 0.4s, border-color 0.4s; border-bottom: 1px solid transparent; }
    .p360-nav.scrolled { background: var(--nav-bg); backdrop-filter: blur(24px); border-color: var(--border); }
    .p360-nav-logo { font-family: var(--display); font-size: 28px; letter-spacing: 3px; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 2px; }
    .p360-nav-logo .lo { color: var(--orange); }
    .p360-nav-logo .ai-badge { font-family: var(--mono); font-size: 8px; letter-spacing: 1px; background: var(--purple-dim); color: var(--purple-light); border: 1px solid rgba(124,58,237,0.25); padding: 3px 7px; border-radius: 4px; text-transform: uppercase; margin-left: 8px; }
    .p360-nav-links { display: flex; gap: 36px; list-style: none; margin: 0; padding: 0; }
    .p360-nav-links a { font-size: 13px; font-weight: 500; color: var(--text2); text-decoration: none; transition: color 0.2s; }
    .p360-nav-links a:hover { color: var(--text); }
    .p360-nav-right { display: flex; align-items: center; gap: 12px; }
    .p360-nav-signin { font-size: 13px; color: var(--text2); background: none; border: none; cursor: pointer; padding: 8px 14px; border-radius: 6px; font-family: var(--body); transition: color 0.2s; }
    .p360-nav-signin:hover { color: var(--text); }
    .p360-nav-cta { background: var(--orange); color: white; border: none; padding: 9px 22px; border-radius: 7px; font-family: var(--body); font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .p360-nav-cta:hover { background: #FF7A40; transform: translateY(-1px); box-shadow: 0 6px 24px var(--orange-glow); }
    .p360-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
    .p360-hamburger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }
    .p360-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .p360-hamburger.open span:nth-child(2) { opacity: 0; }
    .p360-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* MOBILE MENU */
    .p360-mob-menu { display: none; position: fixed; inset: 0; z-index: 199; background: var(--surface); flex-direction: column; gap: 6px; padding: 88px 32px 40px; overflow-y: auto; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); }
    .p360-mob-menu.open { transform: none; }
    .p360-mob-menu a, .p360-mob-cta { font-family: var(--display); font-size: 38px; letter-spacing: 2px; color: var(--text); text-decoration: none; text-transform: uppercase; padding: 10px 0; border-bottom: 1px solid var(--border); display: block; transition: color 0.2s; }
    .p360-mob-menu a:hover { color: var(--orange); }
    .p360-mob-cta { background: var(--orange) !important; color: white !important; border: none !important; border-radius: 10px !important; padding: 16px 24px !important; margin-top: 12px; font-size: 22px !important; cursor: pointer; text-align: center; font-family: var(--display); }

    /* THEME TOGGLE */
    .p360-theme-toggle { width: 46px; height: 25px; border-radius: 100px; background: var(--surface2); border: 1px solid var(--border2); display: flex; align-items: center; padding: 3px; cursor: pointer; flex-shrink: 0; transition: all 0.3s; }
    .p360-toggle-knob { width: 19px; height: 19px; border-radius: 50%; background: linear-gradient(135deg, var(--orange), var(--purple-light)); transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); display: flex; align-items: center; justify-content: center; font-size: 10px; }
    .p360.dark-theme .p360-toggle-knob { transform: translateX(0); }
    .p360.light-theme .p360-toggle-knob { transform: translateX(21px); }

    /* HERO */
    .p360-hero { min-height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 24px 60px; position: relative; overflow: hidden; text-align: center; }
    .p360-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--grid-a) 1px, transparent 1px), linear-gradient(90deg, var(--grid-a) 1px, transparent 1px), linear-gradient(var(--grid-b) 1px, transparent 1px), linear-gradient(90deg, var(--grid-b) 1px, transparent 1px); background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px; mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 100%); }
    .p360-orb { position: absolute; border-radius: 50%; filter: blur(110px); pointer-events: none; }
    .p360-orb1 { width: min(700px,120vw); height: min(700px,120vw); background: radial-gradient(circle, rgba(255,92,26,0.13) 0%, transparent 70%); top: -150px; left: 50%; transform: translateX(-50%); animation: p360f1 9s ease-in-out infinite; }
    .p360-orb2 { width: min(450px,80vw); height: min(450px,80vw); background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%); bottom: 10%; right: -5%; animation: p360f2 11s ease-in-out infinite; }
    .p360-orb3 { width: min(350px,70vw); height: min(350px,70vw); background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%); bottom: 20%; left: -5%; animation: p360f3 13s ease-in-out infinite; }
    @keyframes p360f1 { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(-24px);} }
    @keyframes p360f2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(28px);} }
    @keyframes p360f3 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-20px);} }
    .p360-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--orange-dim); border: 1px solid rgba(255,92,26,0.22); padding: 7px 18px; border-radius: 100px; font-family: var(--mono); font-size: 10px; color: var(--orange); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 30px; animation: p360up 0.9s ease forwards; opacity: 0; }
    .p360-eyebrow-pulse { width: 6px; height: 6px; background: var(--orange); border-radius: 50%; animation: p360pulse 2s infinite; }
    @keyframes p360pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.7);} }
    @keyframes p360up { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:none;} }
    .p360-hero-headline { font-family: var(--display); font-size: clamp(58px,10.5vw,148px); line-height: 0.9; letter-spacing: 1px; text-transform: uppercase; max-width: 1200px; margin-bottom: 28px; animation: p360up 0.9s ease 0.15s forwards; opacity: 0; }
    .p360-hl-o { color: var(--orange); }
    .p360-hl-p { color: var(--purple-light); }
    .p360-hero-sub { font-size: clamp(16px,2vw,20px); font-weight: 300; color: var(--text2); max-width: 600px; line-height: 1.7; margin-bottom: 44px; animation: p360up 0.9s ease 0.3s forwards; opacity: 0; }
    .p360-hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; animation: p360up 0.9s ease 0.45s forwards; opacity: 0; margin-bottom: 72px; }
    .p360-hero-trust { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; justify-content: center; animation: p360up 0.9s ease 0.6s forwards; opacity: 0; }
    .p360-trust-pill { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
    .p360-trust-pill .dot { width: 5px; height: 5px; border-radius: 50%; }
    .dot-o { background: var(--orange); }
    .dot-g { background: var(--green); }
    .dot-p { background: var(--purple-light); }

    /* BUTTONS */
    .p360-btn-primary { background: var(--orange); color: white; border: none; padding: 15px 34px; border-radius: 8px; font-family: var(--body); font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: 0.2px; display: inline-flex; align-items: center; gap: 9px; transition: all 0.25s; position: relative; overflow: hidden; }
    .p360-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 48px var(--orange-glow); background: #FF7A40; }
    .p360-btn-secondary { background: transparent; color: var(--text); border: 1px solid var(--border2); padding: 15px 34px; border-radius: 8px; font-family: var(--body); font-size: 15px; font-weight: 500; cursor: pointer; letter-spacing: 0.2px; display: inline-flex; align-items: center; gap: 9px; transition: all 0.25s; }
    .p360-btn-secondary:hover { border-color: var(--purple); color: var(--purple-light); transform: translateY(-2px); background: var(--purple-dim); }

    /* TICKER */
    .p360-ticker-bar { width: 100%; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden; padding: 14px 0; position: relative; }
    .p360-ticker-bar::before,.p360-ticker-bar::after { content:''; position:absolute; top:0; bottom:0; width:80px; z-index:2; pointer-events:none; }
    .p360-ticker-bar::before { left:0; background: linear-gradient(to right, var(--bg), transparent); }
    .p360-ticker-bar::after { right:0; background: linear-gradient(to left, var(--bg), transparent); }
    .p360-ticker-track { display: flex; gap: 0; white-space: nowrap; animation: p360ticker 30s linear infinite; }
    .p360-ticker-track:hover { animation-play-state: paused; }
    @keyframes p360ticker { from{transform:translateX(0);} to{transform:translateX(-50%);} }
    .p360-ticker-item { display: inline-flex; align-items: center; gap: 12px; padding: 0 32px; font-family: var(--mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 2px; white-space: nowrap; }
    .p360-ticker-item .ti-dot { color: var(--orange); font-size: 16px; opacity: 0.6; }

    /* DIVIDER */
    .p360-divider { width: 100%; height: 1px; background: var(--border); }

    /* SECTION COMMONS */
    .p360-section-wrap { max-width: 1280px; margin: 0 auto; padding: 110px 52px; }
    .p360-section-tag { font-family: var(--mono); font-size: 10px; color: var(--orange); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
    .p360-section-tag::before { content:''; display:block; width:18px; height:1px; background:var(--orange); flex-shrink:0; }
    .p360-section-headline { font-family: var(--display); font-size: clamp(40px,6vw,88px); line-height: 0.93; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 22px; }
    .p360-section-sub { font-size: 16px; font-weight: 300; color: var(--text2); max-width: 540px; line-height: 1.8; }

    /* SCROLL REVEAL */
    .rv { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .rv.in { opacity: 1; transform: none; }
    .d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

    /* COFOUNDER CARD */
    .p360-cf-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 20px; padding: 32px; position: relative; overflow: hidden; }
    .p360-cf-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent, var(--orange), var(--purple), transparent); }
    .p360-cf-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
    .p360-cf-avatar { width:56px; height:56px; border-radius:50%; background: linear-gradient(135deg, var(--orange-dim), var(--purple-dim)); border: 1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
    .p360-cf-title { font-family: var(--display); font-size: 24px; letter-spacing: 1px; text-transform: uppercase; }
    .p360-cf-sub { font-size: 11px; color: var(--text3); font-family: var(--mono); letter-spacing: 1px; text-transform: uppercase; }
    .p360-cf-cap { display:flex; align-items:center; gap:12px; padding:11px 14px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); transition: border-color 0.2s; }
    .p360-cf-cap:hover { border-color: rgba(255,92,26,0.25); }
    .p360-cf-cap-icon { font-size:18px; flex-shrink:0; }
    .p360-cf-cap-text { flex:1; }
    .p360-cf-cap-title { font-weight:600; font-size:13px; }
    .p360-cf-cap-sub { font-size:11px; color:var(--text3); }
    .p360-badge { font-family:var(--mono); font-size:8px; padding:2px 8px; border-radius:3px; text-transform:uppercase; letter-spacing:1px; flex-shrink:0; }
    .badge-o { background:var(--orange-dim); color:var(--orange); border:1px solid rgba(255,92,26,0.2); }
    .badge-p { background:var(--purple-dim); color:var(--purple-light); border:1px solid rgba(124,58,237,0.2); }
    .badge-g { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2); }

    /* PROBLEM / COST */
    .p360-cost-card { background: var(--bg); border: 1px solid var(--border2); border-radius: 16px; padding: 32px; position: relative; overflow: hidden; }
    .p360-cost-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
    .p360-cost-card.old::before { background: linear-gradient(90deg, #EF4444, rgba(239,68,68,0.3)); }
    .p360-cost-card.new::before { background: linear-gradient(90deg, var(--orange), var(--purple-light)); }
    .p360-cost-badge { font-family:var(--mono); font-size:8px; letter-spacing:2px; text-transform:uppercase; padding:4px 10px; border-radius:4px; display:inline-block; margin-bottom:20px; }
    .p360-cost-badge.old-b { background: rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.2); }
    .p360-cost-badge.new-b { background:var(--orange-dim); color:var(--orange); border:1px solid rgba(255,92,26,0.2); }
    .p360-cost-title { font-family:var(--display); font-size:28px; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; }
    .p360-cost-price { font-family:var(--display); font-size:72px; line-height:1; color:var(--text); margin-bottom:4px; }
    .p360-cost-price.strike { color:#EF4444; text-decoration:line-through; }
    .p360-cost-price.moil-p { color:var(--orange); }
    .p360-cost-period { font-family:var(--mono); font-size:12px; color:var(--text3); margin-bottom:24px; }
    .p360-cost-list { list-style:none; display:flex; flex-direction:column; gap:9px; padding:0; margin:0; }
    .p360-cost-list li { display:flex; align-items:flex-start; gap:10px; font-size:13px; color:var(--text2); line-height:1.5; }
    .li-x { color:#EF4444; flex-shrink:0; }
    .li-ok { color:var(--green); flex-shrink:0; }

    /* CAPABILITY CARDS */
    .p360-cap-card { background:var(--surface); border:1px solid var(--border2); border-radius:20px; padding:36px; position:relative; overflow:hidden; transition:all 0.4s; cursor:default; }
    .p360-cap-card::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg, transparent, var(--orange), transparent); opacity:0; transition:opacity 0.4s; }
    .p360-cap-card:hover { border-color:var(--card-border-hover); transform:translateY(-5px); box-shadow:var(--shadow); }
    .p360-cap-card:hover::after { opacity:1; }
    .p360-cap-icon { font-size:36px; margin-bottom:20px; display:block; }
    .p360-cap-title { font-family:var(--display); font-size:clamp(20px,2.5vw,28px); letter-spacing:1px; text-transform:uppercase; margin-bottom:12px; }
    .p360-cap-desc { font-size:14px; color:var(--text2); line-height:1.75; margin-bottom:18px; }
    .p360-cap-tags { display:flex; flex-wrap:wrap; gap:6px; }
    .p360-tag { font-family:var(--mono); font-size:9px; padding:4px 10px; border-radius:4px; text-transform:uppercase; letter-spacing:1px; }
    .tag-o { background:var(--orange-dim); color:var(--orange); border:1px solid rgba(255,92,26,0.18); }
    .tag-p { background:var(--purple-dim); color:var(--purple-light); border:1px solid rgba(124,58,237,0.2); }
    .tag-g { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.18); }
    .tag-b { background:var(--blue-dim); color:#60A5FA; border:1px solid rgba(59,130,246,0.2); }

    /* JOURNEY STEPS */
    .p360-jstep { display:flex; gap:20px; padding-bottom:36px; position:relative; cursor:default; }
    .p360-jstep:last-child { padding-bottom:0; }
    .p360-jnum { width:52px; height:52px; border-radius:50%; border:1px solid var(--border2); background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--mono); font-size:12px; font-weight:700; color:var(--orange); flex-shrink:0; position:relative; z-index:2; transition:all 0.3s; }
    .p360-jstep:hover .p360-jnum { background:var(--orange); color:white; border-color:var(--orange); box-shadow:0 0 28px var(--orange-glow); }
    .p360-jstep-time { font-family:var(--mono); font-size:9px; color:var(--orange); text-transform:uppercase; letter-spacing:2px; margin-bottom:6px; }
    .p360-jstep-title { font-family:var(--display); font-size:clamp(18px,2.5vw,26px); letter-spacing:1px; text-transform:uppercase; margin-bottom:7px; }
    .p360-jstep-desc { font-size:13px; color:var(--text2); line-height:1.7; }

    /* AI CONVO */
    .p360-ai-convo { background:var(--bg); border:1px solid var(--border2); border-radius:18px; overflow:hidden; position:sticky; top:100px; align-self:start; }
    .p360-convo-header { background:var(--surface2); padding:12px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; }
    .p360-convo-dots { display:flex; gap:6px; }
    .p360-convo-dot { width:10px; height:10px; border-radius:50%; }
    .p360-convo-title { font-family:var(--mono); font-size:10px; color:var(--text3); letter-spacing:1px; margin-left:6px; }
    .p360-convo-status { margin-left:auto; display:flex; align-items:center; gap:5px; font-family:var(--mono); font-size:10px; color:var(--green); }
    .p360-convo-blink { width:6px; height:6px; background:var(--green); border-radius:50%; animation:p360pulse 2s infinite; }
    .p360-convo-body { padding:20px; display:flex; flex-direction:column; gap:14px; }
    .p360-msg { max-width:85%; }
    .p360-msg-user { align-self:flex-end; }
    .p360-msg-ai { align-self:flex-start; }
    .p360-msg-bubble { padding:12px 16px; border-radius:14px; font-size:13px; line-height:1.6; }
    .p360-msg-user .p360-msg-bubble { background:var(--orange); color:white; border-radius:14px 14px 4px 14px; }
    .p360-msg-ai .p360-msg-bubble { background:var(--surface2); color:var(--text); border:1px solid var(--border); border-radius:14px 14px 14px 4px; }
    .p360-msg-ai-label { font-family:var(--mono); font-size:9px; color:var(--orange); letter-spacing:1px; margin-bottom:5px; }
    .p360-msg-result { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-top:6px; }
    .p360-mr-title { font-family:var(--mono); font-size:9px; color:var(--green); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
    .p360-mr-item { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text2); margin-top:5px; }
    .p360-mr-dot { width:5px; height:5px; background:var(--green); border-radius:50%; flex-shrink:0; }
    .p360-t-dot { display:inline-block; width:6px; height:6px; background:var(--text3); border-radius:50%; animation:p360td 1.4s ease-in-out infinite; }
    @keyframes p360td { 0%,80%,100%{transform:scale(0.8);opacity:0.5;} 40%{transform:scale(1.2);opacity:1;} }

    /* HIRING */
    .p360-hstep { display:flex; gap:16px; padding:18px; background:var(--surface); border:1px solid var(--border); border-radius:12px; align-items:flex-start; transition:all 0.3s; }
    .p360-hstep:hover { border-color:var(--card-border-hover); transform:translateX(6px); }
    .p360-hnum { width:36px; height:36px; border-radius:50%; background:var(--orange-dim); border:1px solid rgba(255,92,26,0.2); display:flex; align-items:center; justify-content:center; font-family:var(--mono); font-size:12px; font-weight:700; color:var(--orange); flex-shrink:0; }
    .p360-hstep-title { font-weight:600; font-size:14px; margin-bottom:4px; }
    .p360-hstep-desc { font-size:12px; color:var(--text2); line-height:1.6; }
    .p360-cand-card { background:var(--surface); border:1px solid var(--border2); border-radius:14px; padding:18px; display:flex; align-items:center; gap:14px; transition:all 0.3s; }
    .p360-cand-card:hover { border-color:var(--card-border-hover); }
    .p360-cand-avatar { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--display); font-size:20px; flex-shrink:0; }

    /* STATS */
    .p360-stat-box { background:var(--surface); padding:36px 20px; text-align:center; transition:background 0.3s; }
    .p360-stat-box:hover { background:var(--surface2); }
    .p360-stat-val { font-family:var(--mono); font-size:clamp(22px,2.5vw,38px); font-weight:700; color:var(--purple-light); line-height:1; margin-bottom:8px; }
    .p360-stat-lbl { font-size:11px; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; line-height:1.4; }

    /* PRICING */
    .p360-price-card { background:var(--surface); border:1px solid var(--border2); border-radius:22px; padding:38px; position:relative; overflow:hidden; transition:all 0.4s; }
    .p360-price-card:hover { transform:translateY(-7px); box-shadow:var(--shadow); }
    .p360-price-card.star { border-color:var(--orange); background: linear-gradient(135deg, rgba(255,92,26,0.05), rgba(124,58,237,0.04), var(--surface)); box-shadow: 0 0 0 1px rgba(255,92,26,0.2), 0 32px 80px rgba(255,92,26,0.06); }
    .p360-price-badge { position:absolute; top:22px; right:22px; background:var(--orange); color:white; font-family:var(--mono); font-size:8px; font-weight:700; padding:3px 10px; border-radius:4px; letter-spacing:1px; text-transform:uppercase; }
    .p360-price-tier { font-family:var(--display); font-size:34px; letter-spacing:3px; text-transform:uppercase; margin-bottom:6px; }
    .p360-price-tagline { font-size:12px; color:var(--text2); margin-bottom:28px; line-height:1.5; }
    .p360-price-num { font-family:var(--display); font-size:clamp(52px,6vw,70px); line-height:1; color:var(--text); }
    .p360-price-num.featured { color:var(--orange); }
    .p360-price-per { font-family:var(--mono); font-size:12px; color:var(--text3); }
    .p360-p-divider { height:1px; background:var(--border); margin:24px 0; }
    .p360-price-list { list-style:none; display:flex; flex-direction:column; gap:10px; padding:0; margin:0; }
    .p360-price-list li { display:flex; align-items:flex-start; gap:8px; font-size:13px; color:var(--text2); line-height:1.5; }
    .li-check { color:var(--green); flex-shrink:0; margin-top:1px; }
    .li-star { color:var(--orange); flex-shrink:0; margin-top:1px; }
    .p360-price-btn { display:block; width:100%; padding:13px; border-radius:8px; font-family:var(--body); font-size:14px; font-weight:700; text-align:center; margin-top:28px; cursor:pointer; transition:all 0.25s; text-decoration:none; border:none; }
    .pbtn-sec { background:transparent; color:var(--text2); border:1px solid var(--border2); }
    .pbtn-sec:hover { border-color:var(--purple); color:var(--purple-light); background:var(--purple-dim); }
    .pbtn-pri { background:var(--orange); color:white; }
    .pbtn-pri:hover { background:#FF7A40; transform:translateY(-2px); box-shadow:0 8px 32px var(--orange-glow); }
    .p360-pt-item { display:flex; align-items:center; gap:7px; font-family:var(--mono); font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:1px; }
    .p360-pt-item .g { color:var(--green); }

    /* FAQ */
    .p360-faq-item { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; transition:border-color 0.3s; margin-bottom:8px; }
    .p360-faq-item:hover { border-color:var(--card-border-hover); }
    .p360-faq-q { padding:20px 24px; display:flex; align-items:center; justify-content:space-between; gap:12px; cursor:pointer; font-size:15px; font-weight:500; user-select:none; }
    .p360-faq-icon { font-size:18px; color:var(--text3); transition:transform 0.3s, color 0.3s; flex-shrink:0; }
    .p360-faq-item.open .p360-faq-icon { transform:rotate(45deg); color:var(--orange); }
    .p360-faq-a { max-height:0; overflow:hidden; transition:max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
    .p360-faq-item.open .p360-faq-a { max-height:300px; }
    .p360-faq-a-inner { padding:0 24px 20px; font-size:14px; color:var(--text2); line-height:1.75; }

    /* TESTIMONIALS */
    .p360-t-card { background:var(--surface); border:1px solid var(--border2); border-radius:20px; padding:32px; position:relative; overflow:hidden; transition:all 0.3s; }
    .p360-t-card:hover { border-color:var(--card-border-hover); transform:translateY(-5px); box-shadow:var(--shadow); }
    .p360-t-qmark { font-family:var(--serif); font-size:80px; color:var(--orange); opacity:0.1; line-height:0.5; margin-bottom:20px; display:block; }
    .p360-t-stars { color:var(--purple-light); font-size:14px; margin-bottom:14px; letter-spacing:2px; }
    .p360-t-text { font-size:14px; color:var(--text); line-height:1.75; margin-bottom:20px; font-style:italic; }
    .p360-t-divider { height:1px; background:var(--border); margin-bottom:18px; }
    .p360-t-av { width:44px; height:44px; border-radius:50%; border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-family:var(--display); font-size:18px; color:var(--orange); flex-shrink:0; }
    .p360-t-name { font-weight:600; font-size:14px; margin-bottom:2px; }
    .p360-t-role { font-size:11px; color:var(--text3); }

    /* FINAL CTA */
    .p360-final { position:relative; overflow:hidden; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:90svh; padding:100px 24px; }
    .p360-final-btn { background:var(--orange); color:white; border:none; padding:20px 60px; border-radius:10px; font-family:var(--body); font-size:clamp(14px,2vw,17px); font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:12px; transition:all 0.3s; animation:p360fpulse 3s ease-in-out infinite; }
    @keyframes p360fpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,92,26,0.25);} 50%{box-shadow:0 0 0 18px rgba(255,92,26,0);} }
    .p360-final-btn:hover { background:#FF7A40; transform:translateY(-3px) scale(1.02); box-shadow:0 18px 64px var(--orange-glow); }

    /* FOOTER */
    .p360-footer { background:var(--surface); border-top:1px solid var(--border); padding:52px; }
    .p360-footer-col-title { font-family:var(--mono); font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--orange); margin-bottom:16px; }
    .p360-footer-links { display:flex; flex-direction:column; gap:9px; }
    .p360-footer-links a { font-size:13px; color:var(--text3); text-decoration:none; transition:color 0.2s; }
    .p360-footer-links a:hover { color:var(--orange); }
    .p360-footer-brand-logo { font-family:var(--display); font-size:36px; letter-spacing:3px; color:var(--text); text-decoration:none; margin-bottom:12px; display:block; }
    .p360-footer-brand-logo span { color:var(--orange); }
    .p360-footer-tagline { font-size:13px; color:var(--text3); line-height:1.7; max-width:280px; margin-bottom:24px; }
    .p360-f-badge { font-family:var(--mono); font-size:9px; padding:3px 9px; border-radius:4px; text-transform:uppercase; letter-spacing:1px; }
    .fb-g { background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.18); }
    .fb-p { background:var(--purple-dim); color:var(--purple-light); border:1px solid rgba(124,58,237,0.18); }
    .fb-o { background:var(--orange-dim); color:var(--orange); border:1px solid rgba(255,92,26,0.18); }
    .p360-footer-copy { font-family:var(--mono); font-size:10px; color:var(--text3); letter-spacing:1px; }

    /* COMPARE TABLE */
    .p360-compare-wrap { overflow-x:auto; border-radius:18px; border:1px solid var(--border2); }
    .p360-compare-table { width:100%; border-collapse:collapse; font-size:14px; min-width:640px; }
    .p360-compare-table th { padding:20px 28px; border-bottom:1px solid var(--border); }
    .p360-compare-table td { padding:16px 24px; border-bottom:1px solid var(--border); }
    .p360-compare-table tr:last-child td { border-bottom:none; }
    .p360-compare-table tr:hover td { background:var(--surface2); }
    .p360-check { color:var(--green); }
    .p360-cross { color:var(--text3); }
    .p360-partial { color:var(--orange); }

    /* CAL MINI */
    .p360-cal-mini { background:var(--surface2); border:1px solid var(--border); border-radius:7px; padding:8px 4px; text-align:center; }
    .p360-cm-num { font-family:var(--mono); font-size:8px; color:var(--text3); margin-bottom:3px; }
    .p360-cm-type { font-size:7px; font-weight:700; padding:2px 4px; border-radius:3px; text-transform:uppercase; letter-spacing:0.3px; display:inline-block; margin-bottom:4px; }
    .cm-edu { background:var(--blue-dim); color:#60A5FA; }
    .cm-promo { background:var(--orange-dim); color:var(--orange); }
    .cm-eng { background:var(--green-dim); color:var(--green); }
    .cm-bts { background:var(--purple-dim); color:var(--purple-light); }
    .p360-cm-img { height:24px; border-radius:3px; background: linear-gradient(135deg, var(--border), var(--border2)); display:flex; align-items:center; justify-content:center; font-size:12px; position:relative; }
    .p360-cm-vid { position:absolute; bottom:1px; right:1px; background:var(--orange); width:10px; height:10px; border-radius:2px; display:flex; align-items:center; justify-content:center; font-size:5px; color:white; }

    /* RESPONSIVE */
    @media (max-width: 960px) {
      .p360-nav { padding: 12px 20px; }
      .p360-nav-links, .p360-nav-signin { display: none; }
      .p360-hamburger { display: flex; }
      .p360-nav-cta { display: none; }
      .p360-mob-menu { display: flex; }
      .p360-section-wrap, .p360-section-wrap2 { padding: 72px 20px !important; }
      .p360-hero { padding: 88px 20px 48px; }
      .p360-hero-headline { font-size: clamp(50px,13vw,80px); }
      .p360-hero-ctas { flex-direction: column; align-items: center; }
      .p360-btn-primary, .p360-btn-secondary { width: 100%; max-width: 320px; justify-content: center; }
      .p360-grid-2 { grid-template-columns: 1fr !important; gap: 40px !important; }
      .p360-grid-3 { grid-template-columns: 1fr !important; }
      .p360-grid-6 { grid-template-columns: repeat(3,1fr) !important; }
      .p360-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px; }
      .p360-ai-convo { position: static; }
      .p360-final { padding: 80px 20px; min-height: auto; }
      .p360-final-btn { width: 100%; max-width: 360px; justify-content: center; }
      .p360-footer { padding: 40px 20px; }
    }
    @media (max-width: 480px) {
      .p360-grid-6 { grid-template-columns: repeat(2,1fr) !important; }
      .p360-footer-grid { grid-template-columns: 1fr !important; }
      .p360-hero-headline { font-size: clamp(44px,14vw,64px); }
    }
  `;

  const compareRows = [
    { feature: "Market Research (Real-time)", moil: "✓ 20-30 pages", consultant: "✓ $2,000–$10,000", generic: "✗ Not included" },
    { feature: "Business Plan", moil: "✓ Investor-ready PDF", consultant: "✓ $3,000–$15,000", generic: "~ Draft only" },
    { feature: "30-Day Content Calendar", moil: "✓ Full Content360", consultant: "✗ Not included", generic: "~ Basic only" },
    { feature: "AI Images & Video", moil: "✓ Topic-specific visuals", consultant: "✗ Not included", generic: "~ Generic only" },
    { feature: "Smart Hiring (10+ platforms)", moil: "✓ Auto-posted", consultant: "~ Partial", generic: "✗ Not included" },
    { feature: "AI Candidate Scoring", moil: "✓ 95% accuracy", consultant: "✗ Manual only", generic: "✗ Not included" },
    { feature: "24/7 Business Coach", moil: "✓ Always on", consultant: "✗ Limited hours", generic: "~ Generic AI" },
    { feature: "Bilingual EN/ES", moil: "✓ Full platform", consultant: "~ Extra cost", generic: "✗ Not included" },
    { feature: "Monthly Cost", moil: "From $15/month", consultant: "$5,000+/month", generic: "$200–$500/month" },
  ];

  const faqs = [
    { q: "What exactly is Moil's AI Co-Founder?", a: "Moil's AI Co-Founder is an intelligent platform that integrates market research, business planning, content marketing, AI image and video generation, smart hiring, and 24/7 business coaching into a single conversation. Unlike generic AI tools, it learns your specific business through 21 strategic questions and personalizes everything to your goals, market, and brand." },
    { q: "How does Content360 work?", a: "Content360 generates a complete 30-day social media content calendar based on your business, market research, and Brand DNA profile. Each day includes a researched topic, optimized hook, full caption, CTA, hashtags, AI-generated topic-specific image, and AI video for your 5 highest-impact days. Available in the Market Pro plan." },
    { q: "How accurate is AI candidate matching?", a: "Moil's AI scoring achieves 95% accuracy across skills match, location proximity, experience level, and language requirements. Our average time to hire is 11 days vs. the 32-day industry average. Businesses report a 94% interview success rate and 91% employee retention at 90 days." },
    { q: "Can I use Moil in Spanish?", a: "Yes. Everything in Moil is fully bilingual — English and Spanish. The AI co-founder onboarding, market research, business plan, content calendar, captions, and hiring pipeline all support both languages. Our bilingual hiring network reaches 58% more bilingual candidates than the industry average." },
    { q: "How is this different from ChatGPT or other AI tools?", a: "Generic AI tools are blank slates. Moil is purpose-built for small business owners. It learns your specific business through structured onboarding, maintains context across sessions, integrates real market data, generates actual AI visuals and videos, connects to 10+ hiring platforms, and delivers outputs ready to use — not rough drafts to edit." },
    { q: "Is there a free trial?", a: "You can talk to your AI Co-Founder completely free — no credit card required to get started. We offer a 30-day money-back guarantee on all plans. If you don't get actionable business insights and hiring results within 30 days, you receive a full refund." },
    { q: "Is my business data secure?", a: "Yes. Moil is SOC 2 compliant with bank-level encryption. Your business data, market research, and candidate information are protected and never shared with third parties. Trusted by growing businesses and Economic Development Corporations across Texas." },
  ];

  return (
    <div className={`p360 ${isDark ? "dark-theme" : "light-theme"}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* MOBILE MENU */}
      <div className={`p360-mob-menu ${mobOpen ? "open" : ""}`}>
        <a href="#p360-capabilities" onClick={() => setMobOpen(false)}>Features</a>
        <a href="#p360-journey" onClick={() => setMobOpen(false)}>How It Works</a>
        <a href="#p360-hiring" onClick={() => setMobOpen(false)}>Hiring</a>
        <a href="#p360-pricing" onClick={() => setMobOpen(false)}>Pricing</a>
        <a href="https://blog.moilapp.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobOpen(false)}>Blog</a>
        <button className="p360-mob-cta" onClick={() => { window.open("https://business.moilapp.com/register","_blank"); setMobOpen(false); }}>🚀 Get Started Free</button>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 14, paddingTop: 24 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 2 }}>Theme</span>
          <button className="p360-theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            <div className="p360-toggle-knob">{isDark ? "🌙" : "☀️"}</div>
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className={`p360-nav ${navScrolled ? "scrolled" : ""}`}>
        <a href="#" className="p360-nav-logo">MO<span className="lo">I</span>L <span className="ai-badge">AI Co-Founder</span></a>
        <ul className="p360-nav-links">
          <li><a href="#p360-capabilities">Features</a></li>
          <li><a href="#p360-journey">How It Works</a></li>
          <li><a href="#p360-hiring">Hiring</a></li>
          <li><a href="#p360-pricing">Pricing</a></li>
          <li><a href="https://blog.moilapp.com" target="_blank" rel="noopener noreferrer">Blog</a></li>
        </ul>
        <div className="p360-nav-right">
          <button className="p360-theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            <div className="p360-toggle-knob">{isDark ? "🌙" : "☀️"}</div>
          </button>
          <button className="p360-nav-signin" onClick={() => window.open("https://moilapp.com/business","_blank")}>Log In</button>
          <button className="p360-nav-cta" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>Get Started Free</button>
          <button className={`p360-hamburger ${mobOpen ? "open" : ""}`} onClick={() => setMobOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="p360-hero">
        <div className="p360-hero-grid" />
        <div className="p360-orb p360-orb1" />
        <div className="p360-orb p360-orb2" />
        <div className="p360-orb p360-orb3" />
        <div className="p360-hero-eyebrow">
          <span className="p360-eyebrow-pulse" />
          🚀 Trusted by 500+ Businesses in Texas — AI-Powered from Day One
        </div>
        <h1 className="p360-hero-headline">
          The AI <span className="p360-hl-o">Co-Founder</span><br />
          Every Small Business<br />
          <span className="p360-hl-p">Deserves.</span>
        </h1>
        <p className="p360-hero-sub">One platform. 21 questions. Market research, business plan, 30-day content marketing, AI images + video, smart hiring, and a 24/7 business coach — all powered by AI that actually understands your business.</p>
        <div className="p360-hero-ctas">
          <button className="p360-btn-primary" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>🚀 Start With Your AI Co-Founder <span>→</span></button>
          <button className="p360-btn-secondary" onClick={() => window.open("https://www.youtube.com/@MoilApp","_blank")}>▶ See What It Does</button>
        </div>
        <div className="p360-hero-trust">
          {[["dot-g","500+ Businesses"],["dot-o","5,000+ Jobs Posted Monthly"],["dot-p","94% Interview Success Rate"],["dot-g","Bilingual EN/ES"],["dot-o","From $15/month"]].map(([dot,label])=>(
            <div className="p360-trust-pill" key={label}><span className={`dot ${dot}`} />{label}</div>
          ))}
        </div>
      </section>

      {/* TICKER */}
      <div className="p360-ticker-bar">
        <div className="p360-ticker-track">
          {["Market Research","Business Plan Generator","Content360 — 30-Day Calendar","AI Image Generation","AI Video Generation","Smart Hiring — 10+ Platforms","Candidate AI Matching 95%","24/7 AI Business Coach","Document Creation","Brand DNA System","Bilingual EN/ES","Investor-Ready Outputs",
            "Market Research","Business Plan Generator","Content360 — 30-Day Calendar","AI Image Generation","AI Video Generation","Smart Hiring — 10+ Platforms","Candidate AI Matching 95%","24/7 AI Business Coach","Document Creation","Brand DNA System","Bilingual EN/ES","Investor-Ready Outputs"].map((item,i)=>(
            <div className="p360-ticker-item" key={i}><span className="ti-dot">·</span>{item}</div>
          ))}
        </div>
      </div>

      <div className="p360-divider" />

      {/* IDENTITY */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px" }} className="p360-section-wrap2">
        <div className="p360-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="p360-section-tag rv">Your AI Co-Founder</div>
            <h2 className="p360-section-headline rv">The Smartest Hire<br />You'll <span style={{ color: "var(--orange)" }}>Never Pay</span><br /><span style={{ color: "var(--purple-light)" }}>A Salary.</span></h2>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,26px)", lineHeight: 1.45, color: "var(--text)", margin: "24px 0 28px" }} className="rv">"Running a small business means wearing every hat — CEO, marketer, recruiter, strategist — all at once. <em style={{ color: "var(--orange)", fontStyle: "normal" }}>That ends today.</em>"</p>
            <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.8, marginBottom: 16 }} className="rv">Moil is the first AI platform that connects every critical function of a small business into a single intelligent ecosystem. Start a conversation, answer 21 strategic questions, and watch your AI co-founder build your market research, business plan, content strategy, visual assets, and hiring pipeline — all in one session.</p>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 2 }} className="rv">Available in English & Spanish · SOC 2 Compliant · No setup fees</p>
          </div>
          <div className="rv d2">
            <div className="p360-cf-card">
              <div className="p360-cf-header">
                <div className="p360-cf-avatar">🤖</div>
                <div>
                  <div className="p360-cf-title">Your AI Co-Founder</div>
                  <div className="p360-cf-sub">Moil Intelligence Platform · Always On</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["🔍","Market Research Engine","TAM/SAM/SOM · 20-30 Pages · Real Data","badge-o","Live"],
                  ["📅","Content360 System","30-Day Calendar · AI Images · AI Video","badge-p","Pro"],
                  ["🎯","Smart Hiring AI","10+ Platforms · 95% Match Accuracy","badge-g","On"],
                  ["📋","Business Plan Generator","5-Year Projections · Investor-Ready PDF","badge-o","1-Click"],
                  ["🤝","24/7 Business Coach","Strategy · Marketing · Cash Flow · Scaling","badge-p","Always"],
                ].map(([icon, title, sub, badge, badgeText]) => (
                  <div className="p360-cf-cap" key={title}>
                    <span className="p360-cf-cap-icon">{icon}</span>
                    <div className="p360-cf-cap-text">
                      <div className="p360-cf-cap-title">{title}</div>
                      <div className="p360-cf-cap-sub">{sub}</div>
                    </div>
                    <span className={`p360-badge ${badge}`}>{badgeText}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="p360-divider" />

      {/* PROBLEM */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px" }} className="p360-section-wrap2">
          <div className="p360-section-tag rv">The Real Cost</div>
          <h2 className="p360-section-headline rv">What You're Paying<br /><span style={{ color: "var(--orange)" }}>Without Moil</span></h2>
          <div className="p360-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start", marginTop: 60 }}>
            <div className="p360-cost-card old rv">
              <span className="p360-cost-badge old-b">Without Moil</span>
              <div className="p360-cost-title">Traditional Approach</div>
              <div className="p360-cost-price strike">$8,400</div>
              <div className="p360-cost-period">per month · consultant + agency + recruiter</div>
              <ul className="p360-cost-list">
                {["$2,000/mo — Business consultant (2 meetings)","$3,500/mo — Marketing agency (basic plan)","$2,000/mo — Recruiting fees (per hire avg)","$600/mo — Analytics & reporting tools","Weeks to get insights. Months to hire.","Still no AI visuals or content calendar","No bilingual support"].map(l=>(
                  <li key={l}><span className="li-x">✗</span>{l}</li>
                ))}
              </ul>
            </div>
            <div className="p360-cost-card new rv d1">
              <span className="p360-cost-badge new-b">With Moil</span>
              <div className="p360-cost-title">The Moil Advantage</div>
              <div className="p360-cost-price moil-p">$75</div>
              <div className="p360-cost-period">per month · everything included</div>
              <ul className="p360-cost-list">
                {["Full AI business coaching 24/7","20–30 page market research in minutes","Investor-ready business plan in one click","Content360: 30-day calendar + AI images + video","Smart hiring on 10+ platforms at once","95% AI candidate matching accuracy","Full bilingual EN/ES across every feature"].map(l=>(
                  <li key={l}><span className="li-ok">✓</span>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="p360-divider" />

      {/* CAPABILITIES */}
      <section id="p360-capabilities" style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px" }} className="p360-section-wrap2">
        <div className="p360-section-tag rv">Everything You Need</div>
        <h2 className="p360-section-headline rv">Six Capabilities.<br /><span style={{ color: "var(--orange)" }}>One Platform.</span><br /><span style={{ color: "var(--purple-light)" }}>Zero Gaps.</span></h2>
        <p className="p360-section-sub rv">Every tool a small business needs to research, plan, create, market, hire, and grow — connected in a single AI-powered workflow.</p>

        {/* Row 1 */}
        <div className="p360-grid-3 p360-cap-row-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 64 }}>
          {[
            { icon: "🔍", title: "AI Market Research", desc: "Answer 21 strategic questions — by voice or text, in English or Spanish. Moil generates 20–30 pages of real-time market analysis: TAM/SAM/SOM, competitive landscape, customer personas, and opportunity scoring from 8–10 authoritative sources.", tags: [["tag-o","Real-Time Data"],["tag-g","TAM/SAM/SOM"],["tag-b","20–30 Pages"]] },
            { icon: "🤝", title: "24/7 AI Business Coach", desc: "Your AI co-founder knows your business, your market, and your goals. Ask anything — cash flow strategy, marketing tactics, pricing, scaling, retention — and get specific, data-backed answers. Not generic advice.", tags: [["tag-p","Context-Aware"],["tag-o","Always Available"],["tag-g","Bilingual"]] },
            { icon: "📋", title: "Investor-Ready Business Plan", desc: "One click generates a polished PDF with executive summary, 5-year financial projections, revenue models, go-to-market strategy, operational roadmap, and funding requirements.", tags: [["tag-o","5-Year Projections"],["tag-b","PDF Export"],["tag-g","Investor-Ready"]] },
            { icon: "🎨", title: "AI Image & Video Creation", desc: "Custom marketing visuals — not stock photos. Topic-specific AI images that show exactly what your post discusses. AI video auto-assigned to your highest-impact days. No camera, no designer.", tags: [["tag-o","30 Custom Images"],["tag-b","5+ Video Days"],["tag-g","Brand Aligned"]] },
          ].map((cap) => (
            <div className="p360-cap-card rv" key={cap.title}>
              <span className="p360-cap-icon">{cap.icon}</span>
              <div className="p360-cap-title">{cap.title}</div>
              <p className="p360-cap-desc">{cap.desc}</p>
              <div className="p360-cap-tags">{cap.tags.map(([cls,label])=><span key={label} className={`p360-tag ${cls}`}>{label}</span>)}</div>
            </div>
          ))}
        </div>

        {/* Row 2: Content360 featured + Document */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 20 }} className="p360-cap-row-2">
          <div className="p360-cap-card rv" style={{ background: "linear-gradient(135deg,rgba(255,92,26,0.06),var(--purple-dim),var(--surface))", borderColor: "rgba(255,92,26,0.22)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }} className="p360-featured-inner">
              <div>
                <span className="p360-cap-icon">📅</span>
                <div className="p360-cap-title">Content360 — Your 30-Day Marketing Engine</div>
                <p className="p360-cap-desc">Your complete monthly content department, built by AI. 30 days of researched topics, tested hooks, full captions by type, CTAs, hashtags, AI-generated images, and AI video for your highest-impact days.</p>
                <div className="p360-cap-tags" style={{ marginBottom: 20 }}>
                  {[["tag-o","30-Day Calendar"],["tag-p","AI Images"],["tag-b","AI Video"],["tag-g","Brand DNA"]].map(([cls,label])=><span key={label} className={`p360-tag ${cls}`}>{label}</span>)}
                </div>
                <button className="p360-btn-secondary" style={{ fontSize: 13, padding: "10px 22px" }} onClick={() => window.open("https://business.moilapp.com/register","_blank")}>Explore Content360 →</button>
              </div>
              <div>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, textAlign: "center" }}>30-Day Preview</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
                    {[["01","cm-edu","📊"],["02","cm-promo","⚡",true],["03","cm-eng","💬"],["04","cm-bts","🔧"],["05","cm-edu","📈"],
                      ["06","cm-promo","🎯",true],["07","cm-eng","🗣️"],["08","cm-edu","💡"],["09","cm-bts","👀"],["10","cm-promo","🔥",true]].map(([num,type,emoji,hasVid])=>(
                      <div className="p360-cal-mini" key={num}>
                        <div className="p360-cm-num">{num}</div>
                        <div className={`p360-cm-type ${type}`}>{(type as string).replace("cm-","").charAt(0).toUpperCase()+(type as string).replace("cm-","").slice(1)}</div>
                        <div className="p360-cm-img">{emoji}{hasVid && <div className="p360-cm-vid">▶</div>}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textAlign: "center", marginTop: 10, textTransform: "uppercase", letterSpacing: 1 }}>10 of 30 days shown · Every day complete</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p360-cap-card rv d1" style={{ display: "flex", flexDirection: "column" }}>
            <span className="p360-cap-icon">📄</span>
            <div className="p360-cap-title">Document Creation</div>
            <p className="p360-cap-desc" style={{ flex: 1 }}>Contracts, proposals, employee handbooks, invoices, terms of service, NDAs — any business document you need, in seconds. Professional and aligned to your business tone.</p>
            <div className="p360-cap-tags">
              {[["tag-p","Contracts"],["tag-o","Proposals"],["tag-b","Handbooks"],["tag-g","Invoices"]].map(([cls,label])=><span key={label} className={`p360-tag ${cls}`}>{label}</span>)}
            </div>
          </div>
        </div>
      </section>

      <div className="p360-divider" />

      {/* JOURNEY */}
      <section id="p360-journey" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px" }} className="p360-section-wrap2">
          <div className="p360-section-tag rv">Your Complete Journey</div>
          <h2 className="p360-section-headline rv">From 21 Questions to<br /><span style={{ color: "var(--orange)" }}>Total Business</span><br /><span style={{ color: "var(--purple-light)" }}>Command.</span></h2>
          <p className="p360-section-sub rv">Everything automated. Every output professional. Every decision grounded in real market data.</p>

          <div className="p360-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 64 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
              <div style={{ position: "absolute", left: 26, top: 26, bottom: 26, width: 1, background: "linear-gradient(180deg,var(--orange),var(--purple-light),var(--green))", opacity: 0.2 }} />
              {[
                { num: "01", time: "5–10 Minutes", title: "21 Strategic Questions", desc: "Voice or text. English or Spanish. Your AI co-founder learns your business model, market, competitive gaps, goals, and strengths. The foundation for everything that follows.", delay: "" },
                { num: "02", time: "Automated", title: "20–30 Pages Market Research", desc: "Real-time deep analysis. TAM/SAM/SOM calculations. Competitive landscape mapping. Customer personas. Opportunity scoring. 8–10 authoritative sources. Not guesses — data.", delay: "d1" },
                { num: "03", time: "One Click", title: "Investor-Ready Business Plan", desc: "5-year projections, revenue models, go-to-market strategy, operational roadmap. Download a polished PDF ready for investors, banks, or partners. Minutes, not months.", delay: "d1" },
                { num: "04", time: "⭐ Content360", title: "30-Day Content Marketing Engine", desc: "Complete calendar with researched topics, tested hooks, calibrated captions, CTAs, hashtags, 30 AI images, and AI video for your highest-impact days.", delay: "d2" },
                { num: "05", time: "2 Minutes to Post", title: "Smart Hiring & Team Building", desc: "One job description → auto-posted to 10+ platforms. AI scores every candidate on skills, location, experience, and language fit. 95% match accuracy. 11-day average to hire.", delay: "d2" },
                { num: "06", time: "24/7 — Always On", title: "Ongoing AI Business Coach", desc: "The more you use it, the better it knows your business. Cash flow guidance, marketing refinements, retention tactics, scaling strategy. An AI co-founder that never sleeps.", delay: "d3" },
              ].map((step) => (
                <div className={`p360-jstep rv ${step.delay}`} key={step.num}>
                  <div className="p360-jnum">{step.num}</div>
                  <div style={{ paddingTop: 4 }}>
                    <div className="p360-jstep-time">{step.time}</div>
                    <div className="p360-jstep-title">{step.title}</div>
                    <p className="p360-jstep-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p360-ai-convo rv d2">
              <div className="p360-convo-header">
                <div className="p360-convo-dots">
                  <div className="p360-convo-dot" style={{ background: "#FF5F56" }} />
                  <div className="p360-convo-dot" style={{ background: "#FFBD2E" }} />
                  <div className="p360-convo-dot" style={{ background: "#27C93F" }} />
                </div>
                <span className="p360-convo-title">MOIL AI CO-FOUNDER</span>
                <div className="p360-convo-status"><div className="p360-convo-blink" /> ACTIVE</div>
              </div>
              <div className="p360-convo-body">
                <div className="p360-msg p360-msg-user"><div className="p360-msg-bubble">I run a residential HVAC company in Austin. Revenue around $800K. I want to grow to $2M and hire 3 more techs.</div></div>
                <div className="p360-msg p360-msg-ai">
                  <div className="p360-msg-ai-label">⚡ MOIL AI CO-FOUNDER</div>
                  <div className="p360-msg-bubble">Got it. I've analyzed your market position. Central Texas HVAC is booming — demand up 34% YoY. Here's your growth blueprint:</div>
                  <div className="p360-msg-result">
                    <div className="p360-mr-title">✓ Market Research Complete</div>
                    {["Market size: $2.4B TAM in Texas","Your SAM: $180M within 50 miles","3 competitor gaps identified","Premium tier opportunity: $12K ACV"].map(item=>(
                      <div className="p360-mr-item" key={item}><span className="p360-mr-dot" />{item}</div>
                    ))}
                  </div>
                </div>
                <div className="p360-msg p360-msg-user"><div className="p360-msg-bubble">Build me the 30-day content strategy and start the hiring pipeline for 3 HVAC techs.</div></div>
                <div className="p360-msg p360-msg-ai">
                  <div className="p360-msg-ai-label">⚡ MOIL AI CO-FOUNDER</div>
                  <div className="p360-msg-bubble">On it. Building your Content360 calendar + opening hiring on 10+ platforms now.</div>
                  <div className="p360-msg-result">
                    <div className="p360-mr-title">✓ All Systems Active</div>
                    {["30-day calendar: done (AI images included)","Hiring posted to 10 platforms","3 candidates matched — 95%+ fit","Business plan PDF: ready to download"].map(item=>(
                      <div className="p360-mr-item" key={item}><span className="p360-mr-dot" />{item}</div>
                    ))}
                  </div>
                </div>
                <div className="p360-msg p360-msg-ai">
                  <div className="p360-msg-ai-label">⚡ MOIL AI CO-FOUNDER</div>
                  <div className="p360-msg-bubble" style={{ background: "var(--surface3)" }}>
                    <span className="p360-t-dot" style={{ animationDelay: "0s" }} />
                    <span className="p360-t-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="p360-t-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 64 }} className="rv">
            <button className="p360-btn-primary" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>🚀 Start Your AI-Powered Journey →</button>
            <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 14, textTransform: "uppercase", letterSpacing: 1 }}>Free to start · No credit card required</p>
          </div>
        </div>
      </section>

      <div className="p360-divider" />

      {/* HIRING */}
      <section id="p360-hiring" style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px" }} className="p360-section-wrap2">
        <div className="p360-section-tag rv">AI-Powered Hiring</div>
        <h2 className="p360-section-headline rv">Build Your Team<br /><span style={{ color: "var(--orange)" }}>5× Faster</span> Than<br /><span style={{ color: "var(--purple-light)" }}>Anyone Else.</span></h2>
        <p className="p360-section-sub rv">Post once. Reach 10+ platforms automatically. Get AI-matched candidates with 95% accuracy. Average time to hire: 11 days.</p>

        <div className="p360-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, marginTop: 60 }}>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { n: 1, title: "Tell Your AI Co-Founder What You Need", desc: "Describe the role in plain language. AI generates a complete job description, requirements, skills assessment, salary recommendations, and platform-optimized posting copy.", delay: "" },
                { n: 2, title: "Auto-Posted to 10+ Platforms in 2 Minutes", desc: "Indeed · ZipRecruiter · Austin Jobs · Round Rock Hiring · Cedar Park · Spanish Job Groups · Local Trade Networks · Facebook Groups · +3 more. All at once.", delay: "d1" },
                { n: 3, title: "AI Scores Every Candidate Automatically", desc: "Skills match · Location proximity · Experience level · Language requirements (EN/ES). Every applicant ranked before you see them. 95% accuracy. No manual screening.", delay: "d2" },
                { n: 4, title: "You Interview Only the Top Matches", desc: "Review ranked candidates, get AI-generated interview questions for each role, schedule, and hire with confidence. Your time goes to the best fits only.", delay: "d3" },
              ].map((step) => (
                <div className={`p360-hstep rv ${step.delay}`} key={step.n}>
                  <div className="p360-hnum">{step.n}</div>
                  <div>
                    <div className="p360-hstep-title">{step.title}</div>
                    <div className="p360-hstep-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 32 }} className="rv">
              {[["5","×","Faster than Indeed"],["94","%","Interview Success"],["91","%","Retention 90 Days"],["11","","Avg Days to Hire"],["$850","","Avg Cost Per Hire"],["58","%","Bilingual Reach"]].map(([val,suf,lbl],i)=>(
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, textAlign: "center" }} key={i}>
                  <div className="p360-stat-val">{val}{suf}</div>
                  <div className="p360-stat-lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rv d2">
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Top Matched Candidates — HVAC Tech · Austin TX</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { init: "J", name: "Jose M.", detail: "8 yrs experience · Austin · EN/ES ✓", score: "95%", scoreColor: "var(--green)", bg: "linear-gradient(135deg,var(--orange-dim),var(--purple-dim))", color: "var(--orange)" },
                { init: "M", name: "Marcus T.", detail: "5 yrs experience · Round Rock · EN", score: "87%", scoreColor: "var(--orange)", bg: "linear-gradient(135deg,var(--purple-dim),var(--blue-dim))", color: "var(--purple-light)" },
                { init: "A", name: "Ana R.", detail: "6 yrs experience · Cedar Park · EN/ES ✓", score: "82%", scoreColor: "var(--purple-light)", bg: "linear-gradient(135deg,var(--green-dim),var(--orange-dim))", color: "var(--green)" },
              ].map((c) => (
                <div className="p360-cand-card" key={c.name}>
                  <div className="p360-cand-avatar" style={{ background: c.bg, color: c.color }}>{c.init}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>{c.detail}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, color: c.scoreColor }}>{c.score}</div>
                    <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", textTransform: "uppercase" }}>Match</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 16, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>✓ Posted to 10+ Platforms</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[["tag-o","Indeed"],["tag-o","ZipRecruiter"],["tag-p","Austin Jobs"],["tag-p","Spanish Groups"],["tag-b","Facebook Groups"],["tag-g","+5 more"]].map(([cls,label])=>(
                  <span key={label} className={`p360-tag ${cls}`}>{label}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: 16, background: "var(--orange-dim)", border: "1px solid rgba(255,92,26,0.2)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--orange)", textTransform: "uppercase", marginBottom: 6 }}>With Moil</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color: "var(--orange)" }}>$850</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>avg cost per hire</div>
              </div>
              <div style={{ padding: 16, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text3)", textTransform: "uppercase", marginBottom: 6 }}>Industry Avg</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color: "var(--text3)", textDecoration: "line-through" }}>$2,400</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>avg cost per hire</div>
              </div>
            </div>
            <button className="p360-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => window.open("https://business.moilapp.com/register","_blank")}>Start Hiring With AI →</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: "linear-gradient(135deg,var(--orange-dim),var(--purple-dim))", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 52px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="p360-section-tag rv" style={{ justifyContent: "center" }}>Proven at Scale</div>
            <h2 className="p360-section-headline rv" style={{ fontSize: "clamp(32px,5vw,60px)" }}>Numbers That Matter.</h2>
          </div>
          <div className="p360-grid-6" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 1, background: "var(--border)", borderRadius: 16, overflow: "hidden" }}>
            {[
              { target: 500, suffix: "+", label: "Businesses Trusting Moil" },
              { target: 5000, suffix: "+", label: "Jobs Posted Monthly" },
              { target: 94, suffix: "%", label: "Interview Success Rate" },
              { prefix: "$", target: 850, suffix: "", label: "Avg Cost Per Hire" },
              { target: 91, suffix: "%", label: "Retention at 90 Days" },
              { prefix: "$", target: 15, suffix: "", label: "Starting Price / Month" },
            ].map((s, i) => (
              <div className="p360-stat-box rv" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="p360-stat-val" data-target={s.target} data-suffix={s.suffix || ""} data-prefix={s.prefix || ""}>{s.prefix || ""}{s.target.toLocaleString()}{s.suffix || ""}</div>
                <div className="p360-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p360-divider" />

      {/* COMPARE */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px" }} className="p360-section-wrap2">
        <div className="p360-section-tag rv" style={{ justifyContent: "center" }}>Moil vs. Everything Else</div>
        <h2 className="p360-section-headline rv" style={{ textAlign: "center" }}>One Platform.<br /><span style={{ color: "var(--orange)" }}>Every Tool</span> You Need.<br /><span style={{ color: "var(--purple-light)" }}>Nothing You Don&apos;t.</span></h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "var(--text2)", maxWidth: 580, margin: "16px auto 52px", fontWeight: 300 }} className="rv">See how Moil stacks up against paying a traditional consultant or cobbling together generic AI tools.</p>
        <div className="p360-compare-wrap rv">
          <table className="p360-compare-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--text3)", background: "var(--surface2)" }}>Feature</th>
                <th style={{ textAlign: "center", fontFamily: "var(--display)", fontSize: 20, letterSpacing: 2, background: "linear-gradient(135deg,rgba(255,92,26,0.1),rgba(124,58,237,0.07))", borderBottom: "2px solid var(--orange)", color: "var(--orange)", whiteSpace: "nowrap" }}>MOIL ⭐</th>
                <th style={{ textAlign: "center", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--text3)", background: "var(--surface2)", whiteSpace: "nowrap" }}>Traditional Consultant</th>
                <th style={{ textAlign: "center", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--text3)", background: "var(--surface2)", whiteSpace: "nowrap" }}>Generic AI Tools</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, background: "var(--surface2)" }}>{row.feature}</td>
                  <td style={{ textAlign: "center", color: "var(--green)", fontWeight: 600 }}>{row.moil}</td>
                  <td style={{ textAlign: "center", color: row.consultant.startsWith("✓") ? "var(--orange)" : row.consultant.startsWith("~") ? "var(--text2)" : "var(--text3)" }}>{row.consultant}</td>
                  <td style={{ textAlign: "center", color: row.generic.startsWith("✓") ? "var(--orange)" : row.generic.startsWith("~") ? "var(--text2)" : "var(--text3)" }}>{row.generic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }} className="rv">
          <button className="p360-btn-primary" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>🚀 Start Free — Experience The Difference →</button>
        </div>
      </section>

      <div className="p360-divider" />

      {/* PRICING */}
      <section id="p360-pricing" style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px", textAlign: "center" }} className="p360-section-wrap2">
        <div className="p360-section-tag rv" style={{ justifyContent: "center" }}>Simple Pricing</div>
        <h2 className="p360-section-headline rv">A Consultant, Agency,<br />Recruiter & Coach. <span style={{ color: "var(--orange)" }}>One Price.</span></h2>
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "clamp(16px,2vw,22px)", color: "var(--text2)", maxWidth: 660, margin: "18px auto 40px", lineHeight: 1.6 }} className="rv">&quot;Traditional consultants charge more for a single meeting than Moil costs for an entire year. <strong style={{ color: "var(--orange)", fontStyle: "normal" }}>That&apos;s not a discount. That&apos;s a revolution.</strong>&quot;</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-dim)", border: "1px solid rgba(16,185,129,0.2)", padding: "7px 18px", borderRadius: 100, fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 52 }} className="rv">✓ Save up to 25% with annual billing</div>

        <div className="p360-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, textAlign: "left" }}>
          <div className="p360-price-card rv">
            <div className="p360-price-tier">Starter</div>
            <p className="p360-price-tagline">Full AI toolbox for businesses just getting started.</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}><span className="p360-price-num">$15</span><span className="p360-price-per">/month</span></div>
            <div className="p360-p-divider" />
            <ul className="p360-price-list">
              {["AI Business Coach & Market Research","Up to 3 job postings/month","75 AI-generated images","75 AI image edits","5 min audio generation","Full Moil AI toolbox","Bilingual: English & Spanish","Advanced analytics"].map(item=>(
                <li key={item}><span className="li-check">✓</span>{item}</li>
              ))}
            </ul>
            <button className="p360-price-btn pbtn-sec" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>Get Started →</button>
          </div>

          <div className="p360-price-card rv d1">
            <div className="p360-price-tier">Professional</div>
            <p className="p360-price-tagline">More capacity for growing businesses with active hiring and content needs.</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}><span className="p360-price-num">$25</span><span className="p360-price-per">/month</span></div>
            <div className="p360-p-divider" />
            <ul className="p360-price-list">
              {["10 job postings/month","200 AI-generated images","200 AI image edits","15 min audio generation","AI Business Coach & Research","Premium analytics + tracking","Priority email & phone support"].map(item=>(
                <li key={item}><span className="li-check">✓</span>{item}</li>
              ))}
            </ul>
            <button className="p360-price-btn pbtn-sec" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>Get Started →</button>
          </div>

          <div className="p360-price-card star rv d2">
            <span className="p360-price-badge">⭐ BEST VALUE</span>
            <div className="p360-price-tier">Market Pro</div>
            <p className="p360-price-tagline">Unlimited power. Full Content360 access. Maximum AI.</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}><span className="p360-price-num featured">$75</span><span className="p360-price-per">/month</span></div>
            <div className="p360-p-divider" />
            <ul className="p360-price-list">
              {[["★","Unlimited job postings"],["★","Unlimited AI images & edits"],["★","30 min audio generation"],["★","15 video credits/month",true],["★","Content360 Full Access",true],["★","Market Pro suite"],["★","AI Coach & deep market research"],["★","Dedicated account support"]].map(([icon,label,highlight],i)=>(
                <li key={i}><span className="li-star">{icon}</span>{highlight ? <strong style={{ color: "var(--orange)" }}>{label}</strong> : label}</li>
              ))}
            </ul>
            <button className="p360-price-btn pbtn-pri" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>Start Market Pro →</button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center", marginTop: 44, flexWrap: "wrap" }} className="rv">
          {["30-Day Guarantee","No Setup Fees","Cancel Anytime","SOC 2 Compliant","Bilingual EN/ES"].map(item=>(
            <div className="p360-pt-item" key={item}><span className="g">✓</span>{item}</div>
          ))}
        </div>
      </section>

      <div className="p360-divider" />

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 52px", textAlign: "center" }} className="p360-section-wrap2">
        <div className="p360-section-tag rv" style={{ justifyContent: "center" }}>Real Businesses. Real Results.</div>
        <h2 className="p360-section-headline rv">500+ Businesses Can&apos;t<br /><span style={{ color: "var(--orange)" }}>Be Wrong.</span></h2>
        <div className="p360-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 52, textAlign: "left" }}>
          {[
            { text: "I've used it to post a position and I am impressed with how easy, intuitive, and effective Moil is. Within hours, we connected with multiple great candidates. I definitely recommend it and will keep using it.", name: "Luis Vives", role: "Business Owner · Texas", init: "L", bg: "linear-gradient(135deg,var(--orange-dim),var(--purple-dim))", delay: "" },
            { text: "Excellent platform whether to look for a job or to look for workers. I recommend it 100%. The AI matching finds people that fit exactly what we need — the bilingual feature is incredible.", name: "Liliana Cervantes", role: "SMB Owner · Texas", init: "L", bg: "linear-gradient(135deg,var(--purple-dim),var(--blue-dim))", delay: "d1" },
            { text: "100% RECOMMENDABLE. This platform helps me find employees when I need that extra help. Fast, accurate, bilingual. It's like having a full HR department available 24/7 for the price of a coffee a day.", name: "Miguel Bustos", role: "Service Business · Texas", init: "M", bg: "linear-gradient(135deg,var(--orange-dim),var(--green-dim))", delay: "d2" },
          ].map((t) => (
            <div className={`p360-t-card rv ${t.delay}`} key={t.name}>
              <span className="p360-t-qmark">&quot;</span>
              <div className="p360-t-stars">★★★★★</div>
              <p className="p360-t-text">{t.text}</p>
              <div className="p360-t-divider" />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="p360-t-av" style={{ background: t.bg }}>{t.init}</div>
                <div><div className="p360-t-name">{t.name}</div><div className="p360-t-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="p360-divider" />

      {/* FAQ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "110px 52px", textAlign: "center" }} className="p360-section-wrap2">
        <div className="p360-section-tag rv" style={{ justifyContent: "center" }}>Got Questions</div>
        <h2 className="p360-section-headline rv">Frequently Asked<br /><span style={{ color: "var(--orange)" }}>Questions.</span></h2>
        <div style={{ textAlign: "left", marginTop: 52 }} className="rv">
          {faqs.map((faq, i) => (
            <div className={`p360-faq-item ${openFaqs.has(i) ? "open" : ""}`} key={i}>
              <div className="p360-faq-q" onClick={() => toggleFaq(i)}>
                {faq.q}<span className="p360-faq-icon">+</span>
              </div>
              <div className="p360-faq-a"><div className="p360-faq-a-inner">{faq.a}</div></div>
            </div>
          ))}
        </div>
      </section>

      <div className="p360-divider" />

      {/* FINAL CTA */}
      <section className="p360-final">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 30% 50%, rgba(255,92,26,0.06), transparent 70%), radial-gradient(ellipse 65% 55% at 70% 50%, rgba(124,58,237,0.06), transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--purple-dim) 1px, transparent 1px), linear-gradient(90deg, var(--purple-dim) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)" }} />
        <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 28, position: "relative" }} className="rv">Your Competitors Are Using AI Right Now</p>
        <h2 style={{ fontFamily: "var(--display)", fontSize: "clamp(56px,10vw,130px)", lineHeight: 0.9, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28, position: "relative" }} className="rv">
          Stop Running<br />Your Business<br /><span style={{ color: "var(--purple-light)" }}>Alone.</span>
        </h2>
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--text2)", fontWeight: 300, maxWidth: 560, margin: "0 auto 52px", lineHeight: 1.75, position: "relative" }} className="rv">Join 500+ Texas businesses with an AI co-founder in their corner. Market research, business plan, 30-day content strategy, AI visuals, and smart hiring — all in one conversation. Starting at $15/month.</p>
        <button className="p360-final-btn rv" onClick={() => window.open("https://business.moilapp.com/register","_blank")}>🚀 Meet Your AI Co-Founder — Free <span>→</span></button>
        <div style={{ display: "flex", alignItems: "center", gap: 28, justifyContent: "center", marginTop: 36, flexWrap: "wrap", position: "relative" }} className="rv">
          {["Free to start","30-Day Guarantee","No Credit Card Needed","SOC 2 Compliant","Bilingual EN/ES"].map(item=>(
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }} key={item}><span style={{ color: "var(--green)" }}>✓</span>{item}</div>
          ))}
        </div>
        <div style={{ position: "relative", marginTop: 64, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Trusted by 500+ businesses</div>
          <div style={{ color: "var(--purple-light)", fontSize: 18, letterSpacing: 3 }}>★★★★★</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", marginTop: 6 }}>5,000+ jobs posted · 94% interview success · $850 avg cost per hire</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="p360-footer">
        <div className="p360-footer-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <a href="#" className="p360-footer-brand-logo">MO<span>I</span>L</a>
            <p className="p360-footer-tagline">The AI Co-Founder for small businesses. Market research, business planning, content marketing, AI visuals, smart hiring, and 24/7 coaching — one platform.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <span className="p360-f-badge fb-g">SOC 2 Compliant</span>
              <span className="p360-f-badge fb-p">Bilingual EN/ES</span>
              <span className="p360-f-badge fb-o">500+ Businesses</span>
            </div>
          </div>
          <div>
            <div className="p360-footer-col-title">Platform</div>
            <div className="p360-footer-links">
              <a href="#p360-capabilities">Features</a>
              <a href="#p360-journey">How It Works</a>
              <a href="#p360-hiring">Smart Hiring</a>
              <a href="#p360-pricing">Pricing</a>
              <a href="https://business.moilapp.com/register" target="_blank" rel="noopener noreferrer">Post a Job</a>
            </div>
          </div>
          <div>
            <div className="p360-footer-col-title">Resources</div>
            <div className="p360-footer-links">
              <a href="https://blog.moilapp.com" target="_blank" rel="noopener noreferrer">Blog</a>
              <a href="https://moilapp.com/business" target="_blank" rel="noopener noreferrer">About Us</a>
              <a href="https://moilapp.com/business" target="_blank" rel="noopener noreferrer">Contact</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/candidate">For Job Seekers</a>
            </div>
          </div>
          <div>
            <div className="p360-footer-col-title">Get Started</div>
            <div className="p360-footer-links">
              <a href="https://business.moilapp.com/register" target="_blank" rel="noopener noreferrer">Free Consultation</a>
              <a href="https://moilapp.com/business" target="_blank" rel="noopener noreferrer">Login</a>
              <a href="#p360-pricing">Starter — $15/mo</a>
              <a href="#p360-pricing">Professional — $25/mo</a>
              <a href="#p360-pricing">Market Pro — $75/mo</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
          <span className="p360-footer-copy">© 2026 MOIL. ALL RIGHTS RESERVED. · TEXAS-BORN. AI-POWERED.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Theme</span>
            <button className="p360-theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
              <div className="p360-toggle-knob">{isDark ? "🌙" : "☀️"}</div>
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="p360-f-badge fb-g">SOC 2</span>
            <span className="p360-f-badge fb-p">EN/ES</span>
            <span className="p360-f-badge fb-o">30-Day Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
