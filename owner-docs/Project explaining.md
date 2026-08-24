<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI FORGE — Obsidian Plugin</title>
<style>
  /* ============================================================
     BRUTALIST HIGH-CONTRAST DESIGN SYSTEM
  ============================================================ */
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --black:   #000000;
    --white:   #FFFFFF;
    --yellow:  #FFE500;
    --red:     #FF2D00;
    --blue:    #0066FF;
    --green:   #00FF88;
    --purple:  #9B00FF;
    --orange:  #FF6B00;
    --border:  3px solid #000;
    --border-thick: 5px solid #000;
    --shadow:  6px 6px 0px #000;
    --shadow-lg: 10px 10px 0px #000;
    --radius:  0px;
    --font-main: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-main);
    background: var(--white);
    color: var(--black);
    overflow-x: hidden;
    cursor: crosshair;
  }

  ::selection { background: var(--yellow); color: var(--black); }

  /* ============================================================
     SCROLLBAR
  ============================================================ */
  ::-webkit-scrollbar { width: 12px; }
  ::-webkit-scrollbar-track { background: var(--white); border-left: 3px solid var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--black); }
  ::-webkit-scrollbar-thumb:hover { background: var(--yellow); }

  /* ============================================================
     NOISE TEXTURE OVERLAY
  ============================================================ */
  body::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* ============================================================
     CURSOR FOLLOWER
  ============================================================ */
  #cursor-dot {
    position: fixed;
    width: 12px; height: 12px;
    background: var(--yellow);
    border: 2px solid var(--black);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: multiply;
  }
  #cursor-ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 2px solid var(--black);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: transform 0.12s ease, width 0.3s, height 0.3s;
  }

  /* ============================================================
     LOADER
  ============================================================ */
  #loader {
    position: fixed;
    inset: 0;
    background: var(--black);
    z-index: 99997;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  #loader.hidden { opacity: 0; visibility: hidden; }
  .loader-text {
    font-family: var(--font-mono);
    font-size: clamp(20px, 4vw, 40px);
    color: var(--yellow);
    letter-spacing: 8px;
    text-transform: uppercase;
    animation: blink 0.8s step-end infinite;
  }
  .loader-bar-wrap {
    width: min(400px, 80vw);
    height: 8px;
    border: 2px solid var(--white);
    overflow: hidden;
  }
  .loader-bar {
    height: 100%;
    background: var(--yellow);
    width: 0%;
    animation: loadBar 1.8s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  @keyframes loadBar { to { width: 100%; } }
  @keyframes blink { 50% { opacity: 0; } }

  /* ============================================================
     NAV
  ============================================================ */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    background: var(--black);
    border-bottom: var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 60px;
  }
  .nav-logo {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
    color: var(--yellow);
    letter-spacing: 4px;
    text-transform: uppercase;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .nav-logo span {
    display: inline-block;
    width: 10px; height: 10px;
    background: var(--yellow);
    animation: pulse-dot 1.5s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.8); opacity: 0.6; }
  }
  .nav-links {
    display: flex;
    gap: 0;
    list-style: none;
  }
  .nav-links a {
    display: block;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--white);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-right: 1px solid #333;
    transition: background 0.15s, color 0.15s;
  }
  .nav-links a:hover { background: var(--yellow); color: var(--black); }

  /* ============================================================
     HERO SECTION
  ============================================================ */
  .hero {
    min-height: 100vh;
    padding-top: 60px;
    background: var(--black);
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: var(--border-thick);
    overflow: hidden;
    position: relative;
  }

  /* Grid lines */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .hero-left {
    padding: 60px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    border-right: var(--border);
    position: relative;
    z-index: 1;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--yellow);
    color: var(--black);
    padding: 6px 16px;
    border: var(--border);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    width: fit-content;
    animation: slideInLeft 0.6s ease 1.8s both;
  }
  .hero-badge::before {
    content: '';
    width: 8px; height: 8px;
    background: var(--black);
    border-radius: 50%;
    animation: pulse-dot 1.2s ease-in-out infinite;
  }

  .hero-title {
    font-size: clamp(48px, 6vw, 96px);
    font-weight: 700;
    line-height: 0.9;
    color: var(--white);
    letter-spacing: -3px;
    animation: slideInLeft 0.6s ease 2s both;
  }
  .hero-title .accent { color: var(--yellow); }
  .hero-title .line2 {
    display: block;
    font-family: var(--font-mono);
    font-size: clamp(14px, 1.8vw, 24px);
    letter-spacing: 6px;
    color: var(--green);
    margin-top: 12px;
    font-weight: 400;
  }

  .hero-desc {
    font-size: 18px;
    line-height: 1.7;
    color: #aaa;
    max-width: 480px;
    animation: slideInLeft 0.6s ease 2.2s both;
  }
  .hero-desc strong { color: var(--white); }

  .hero-cta {
    display: flex;
    gap: 16px;
    animation: slideInLeft 0.6s ease 2.4s both;
  }

  .btn {
    padding: 14px 32px;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    border: var(--border);
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .btn-primary { background: var(--yellow); color: var(--black); }
  .btn-primary:hover { transform: translate(-3px,-3px); box-shadow: var(--shadow); }
  .btn-ghost { background: transparent; color: var(--white); border-color: var(--white); }
  .btn-ghost:hover { background: var(--white); color: var(--black); transform: translate(-3px,-3px); box-shadow: 6px 6px 0px var(--white); }

  .hero-right {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 32px;
    overflow: hidden;
  }

  /* FLOATING STATS */
  .hero-stats {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    border-top: var(--border);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: var(--black);
  }
  .stat-item {
    padding: 24px 32px;
    border-right: 1px solid #333;
    animation: slideInLeft 0.5s ease calc(2.6s + var(--i) * 0.1s) both;
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: var(--font-mono);
    font-size: 32px;
    font-weight: 700;
    color: var(--yellow);
    display: block;
  }
  .stat-label {
    font-size: 11px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: var(--font-mono);
  }

  /* ============================================================
     MOCKUP CHAT INTERFACE
  ============================================================ */
  .mockup-window {
    width: 100%;
    max-width: 560px;
    background: #111;
    border: var(--border);
    border-color: #444;
    box-shadow: var(--shadow-lg);
    font-family: var(--font-mono);
    font-size: 12px;
    animation: slideInRight 0.7s ease 2s both;
    position: relative;
    z-index: 2;
  }

  .window-bar {
    background: #222;
    border-bottom: 1px solid #444;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .win-dot { width: 10px; height: 10px; border-radius: 50%; }
  .win-dot.red { background: var(--red); }
  .win-dot.yellow { background: var(--yellow); }
  .win-dot.green { background: var(--green); }
  .win-title {
    margin-right: auto;
    margin-left: auto;
    color: #666;
    font-size: 11px;
    letter-spacing: 2px;
  }

  .mock-toolbar {
    background: #1a1a1a;
    border-bottom: 1px solid #333;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .mock-select {
    background: #111;
    border: 1px solid #444;
    color: var(--white);
    padding: 5px 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
    flex: 1;
    min-width: 100px;
  }
  .mock-model-badge {
    background: var(--green);
    color: var(--black);
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .mock-sliders {
    padding: 12px 16px;
    background: #111;
    border-bottom: 1px solid #333;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .slider-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .slider-label { color: #666; font-size: 10px; width: 90px; flex-shrink: 0; }
  .mock-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 3px;
    background: #333;
    outline: none;
    cursor: pointer;
  }
  .mock-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px; height: 14px;
    background: var(--yellow);
    border: 2px solid var(--black);
    cursor: pointer;
    transition: transform 0.15s;
  }
  .mock-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }
  .slider-val { color: var(--yellow); font-size: 10px; width: 30px; text-align: right; }

  .mock-sysprompt {
    padding: 12px 16px;
    background: #0d0d0d;
    border-bottom: 1px solid #333;
  }
  .sysprompt-label {
    color: var(--purple);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sysprompt-label::before { content: '▶'; font-size: 8px; }
  .sysprompt-text {
    color: #888;
    font-size: 11px;
    line-height: 1.5;
    border-right: 2px solid var(--purple);
    padding-right: 10px;
  }

  .mock-chat {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 180px;
    background: #0a0a0a;
  }
  .mock-msg {
    padding: 10px 14px;
    font-size: 11px;
    line-height: 1.6;
    max-width: 85%;
    animation: msgSlideIn 0.4s ease both;
  }
  .mock-msg.user {
    background: #1a1a1a;
    border: 1px solid #333;
    align-self: flex-end;
    color: var(--white);
  }
  .mock-msg.ai {
    background: #0f1a0f;
    border: 1px solid #1a3a1a;
    align-self: flex-start;
    color: var(--green);
    position: relative;
  }
  .mock-msg.ai::before {
    content: 'AI';
    position: absolute;
    top: -8px; right: 8px;
    background: var(--green);
    color: var(--black);
    font-size: 8px;
    padding: 1px 5px;
    font-weight: 700;
    letter-spacing: 1px;
  }
  .typing-cursor {
    display: inline-block;
    width: 6px; height: 12px;
    background: var(--green);
    margin-right: 2px;
    vertical-align: middle;
    animation: blink 0.7s step-end infinite;
  }

  .mock-input-row {
    background: #111;
    border-top: 1px solid #333;
    padding: 10px 16px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .mock-input {
    flex: 1;
    background: #1a1a1a;
    border: 1px solid #333;
    color: var(--white);
    padding: 8px 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    outline: none;
  }
  .mock-send {
    background: var(--yellow);
    border: 1px solid var(--black);
    color: var(--black);
    padding: 8px 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 1px;
  }
  .mock-send:hover { background: var(--white); transform: translate(-1px,-1px); box-shadow: 2px 2px 0 var(--black); }

  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
  @keyframes msgSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

  /* ============================================================
     SECTION BASE
  ============================================================ */
  section {
    border-bottom: var(--border-thick);
    position: relative;
    overflow: hidden;
  }

  .section-header {
    padding: 48px 64px 0;
    display: flex;
    align-items: flex-start;
    gap: 32px;
    border-bottom: var(--border);
    padding-bottom: 32px;
  }
  .section-num {
    font-family: var(--font-mono);
    font-size: 80px;
    font-weight: 700;
    color: #f0f0f0;
    line-height: 1;
    flex-shrink: 0;
    letter-spacing: -4px;
  }
  .section-meta { flex: 1; padding-top: 8px; }
  .section-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 8px;
  }
  .section-title {
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.1;
  }

  .section-body { padding: 64px; }

  /* ============================================================
     SECTION 1: PROBLEM — VS COMPARISON
  ============================================================ */
  #problem { background: var(--white); }

  .vs-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
    border: var(--border-thick);
  }
  .vs-col {
    padding: 40px;
  }
  .vs-col.bad { background: #fff5f5; }
  .vs-col.good { background: #f0fff8; }
  .vs-divider {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    border-right: var(--border);
    border-left: var(--border);
    background: var(--black);
    color: var(--white);
  }
  .vs-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: #999;
  }
  .vs-divider-text {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    color: var(--yellow);
    writing-mode: vertical-rl;
    letter-spacing: 4px;
    text-transform: uppercase;
  }
  .vs-title {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 10px 16px;
    margin-bottom: 24px;
    display: inline-block;
  }
  .vs-col.bad .vs-title { background: var(--red); color: var(--white); }
  .vs-col.good .vs-title { background: var(--green); color: var(--black); }

  .vs-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px 16px;
    border: 2px solid transparent;
    transition: all 0.2s;
    cursor: default;
  }
  .vs-item:hover { border-color: var(--black); transform: translateX(4px); }
  .vs-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .vs-text { font-size: 14px; line-height: 1.5; }
  .vs-text strong { font-weight: 700; display: block; margin-bottom: 2px; }
  .vs-text span { color: #666; font-size: 12px; }

  /* ============================================================
     SECTION 2: PROVIDERS MAP
  ============================================================ */
  #providers { background: var(--black); color: var(--white); }
  #providers .section-num { color: #222; }
  #providers .section-title { color: var(--white); }
  #providers .section-label { color: #555; }
  #providers .section-header { border-bottom-color: #333; }

  .providers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0;
    border: var(--border);
    border-color: #333;
  }

  .provider-card {
    padding: 32px;
    border: 1px solid #222;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .provider-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent, var(--yellow));
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .provider-card:hover::before { transform: translateY(0); }
  .provider-card:hover { color: var(--black); }
  .provider-card:hover .provider-name,
  .provider-card:hover .provider-desc,
  .provider-card:hover .provider-models,
  .provider-card:hover .provider-badge { color: var(--black) !important; filter: none !important; }
  .provider-card:hover .prov-tag { background: rgba(0,0,0,0.1); color: var(--black); }

  .provider-card > * { position: relative; z-index: 1; }

  .provider-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .provider-icon {
    width: 48px; height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border: 2px solid #333;
    background: #111;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .provider-card:hover .provider-icon { border-color: var(--black); background: rgba(0,0,0,0.1); }
  .provider-badge {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 8px;
    background: var(--green);
    color: var(--black);
  }
  .provider-name {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--white);
  }
  .provider-desc {
    font-size: 12px;
    color: #777;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  .provider-models {
    font-family: var(--font-mono);
    font-size: 10px;
    color: #555;
    margin-bottom: 12px;
  }
  .provider-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .prov-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    padding: 3px 8px;
    border: 1px solid #333;
    color: #666;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .provider-speed {
    margin-top: 12px;
    height: 3px;
    background: #222;
    position: relative;
    overflow: hidden;
  }
  .provider-speed-bar {
    height: 100%;
    background: var(--green);
    transition: width 1s ease;
    width: 0%;
  }
  .provider-card:hover .provider-speed-bar { width: var(--speed, 70%) !important; }

  /* ============================================================
     SECTION 3: ARCHITECTURE DIAGRAM
  ============================================================ */
  #architecture { background: #f5f5f0; }

  .arch-diagram {
    display: grid;
    grid-template-rows: auto auto auto auto;
    gap: 0;
    border: var(--border-thick);
  }

  .arch-layer {
    padding: 32px 40px;
    border-bottom: var(--border);
    display: flex;
    align-items: center;
    gap: 24px;
    cursor: default;
    transition: background 0.2s;
    position: relative;
    overflow: hidden;
  }
  .arch-layer:last-child { border-bottom: none; }
  .arch-layer::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 4px;
    background: var(--layer-color, var(--black));
    transform: scaleY(0);
    transition: transform 0.3s ease;
    transform-origin: bottom;
  }
  .arch-layer:hover::after { transform: scaleY(1); }
  .arch-layer:hover { background: var(--layer-bg, #fff); }

  .arch-layer-num {
    font-family: var(--font-mono);
    font-size: 48px;
    font-weight: 700;
    color: #e0e0e0;
    line-height: 1;
    min-width: 60px;
    flex-shrink: 0;
  }
  .arch-layer-content { flex: 1; }
  .arch-layer-title {
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .arch-layer-desc { font-size: 14px; color: #555; line-height: 1.6; }
  .arch-layer-nodes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .arch-node {
    padding: 6px 14px;
    border: var(--border);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    transition: all 0.15s;
    cursor: default;
  }
  .arch-node:hover { background: var(--black); color: var(--white); transform: translate(-2px,-2px); box-shadow: var(--shadow); }

  .arch-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: var(--black);
    color: var(--white);
    font-family: var(--font-mono);
    font-size: 20px;
    letter-spacing: 8px;
  }

  /* ============================================================
     SECTION 4: FEATURES / BACKEND TEMPLATES
  ============================================================ */
  #features { background: var(--white); }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: var(--border-thick);
  }

  .feature-card {
    padding: 48px;
    border: 1px solid #e0e0e0;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 4px;
    background: var(--fc, var(--black));
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }
  .feature-card:hover::before { transform: scaleX(1); }
  .feature-card:hover { background: #fafafa; transform: translate(-2px,-2px); box-shadow: var(--shadow); z-index: 1; }

  .feature-icon-wrap {
    width: 56px; height: 56px;
    border: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 20px;
    background: var(--fib, #fff);
    transition: all 0.2s;
  }
  .feature-card:hover .feature-icon-wrap { background: var(--fc, var(--black)); color: var(--white); transform: rotate(5deg); }
  .feature-tag {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--fc, #999);
    margin-bottom: 12px;
    font-weight: 700;
  }
  .feature-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 12px;
    line-height: 1.2;
  }
  .feature-desc {
    font-size: 14px;
    color: #555;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .feature-list li {
    font-size: 13px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-right: 3px solid var(--fc, var(--black));
    background: #f8f8f8;
    transition: all 0.15s;
  }
  .feature-list li:hover { background: var(--fc, var(--black)); color: var(--white); transform: translateX(-4px); }
  .feature-list li::before { content: '→'; font-family: var(--font-mono); font-size: 11px; flex-shrink: 0; }

  /* ============================================================
     SECTION 5: FAILOVER ANIMATION
  ============================================================ */
  #failover { background: var(--black); color: var(--white); }
  #failover .section-num { color: #1a1a1a; }
  #failover .section-title { color: var(--white); }
  #failover .section-label { color: #444; }
  #failover .section-header { border-bottom-color: #222; }

  .failover-diagram {
    position: relative;
  }

  .failover-track {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: var(--border);
    border-color: #333;
  }

  .fo-step {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    align-items: center;
    gap: 0;
    border-bottom: 1px solid #1a1a1a;
    padding: 0;
    opacity: 0.4;
    transition: all 0.4s ease;
    cursor: pointer;
  }
  .fo-step.active {
    opacity: 1;
    background: #0f0f0f;
  }
  .fo-step.done { opacity: 0.3; }
  .fo-step.exhausted { opacity: 1; background: #1a0000; }

  .fo-step-num {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    border-right: 1px solid #222;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .fo-step.active .fo-step-num { background: var(--green); color: var(--black); }
  .fo-step.exhausted .fo-step-num { background: var(--red); }

  .fo-step-info {
    padding: 20px 28px;
  }
  .fo-step-title {
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    letter-spacing: 1px;
    color: var(--white);
  }
  .fo-step-sub {
    font-size: 12px;
    color: #555;
  }
  .fo-step.active .fo-step-sub { color: #888; }

  .fo-step-status {
    padding: 20px 28px;
    font-family: var(--font-mono);
    font-size: 11px;
    text-align: right;
    min-width: 140px;
  }
  .fo-status-tag {
    display: inline-block;
    padding: 4px 12px;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .status-active { background: var(--green); color: var(--black); }
  .status-limit { background: var(--red); color: var(--white); }
  .status-standby { background: #222; color: #555; border: 1px solid #333; }
  .status-fallback { background: var(--yellow); color: var(--black); }

  .fo-progress-bar {
    height: 4px;
    background: #111;
    overflow: hidden;
  }
  .fo-progress-fill {
    height: 100%;
    background: var(--green);
    width: 0%;
    transition: width 2s linear;
  }
  .fo-progress-fill.draining { background: var(--red); }

  .failover-log {
    background: #050505;
    border: 1px solid #222;
    border-top: none;
    padding: 20px 28px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--green);
    line-height: 2;
    min-height: 140px;
  }
  .log-line { opacity: 0; animation: logFadeIn 0.3s ease forwards; }
  .log-error { color: var(--red); }
  .log-warn { color: var(--yellow); }
  .log-info { color: var(--blue); }
  @keyframes logFadeIn { to { opacity: 1; } }

  .failover-controls {
    display: flex;
    gap: 0;
    border: 1px solid #222;
    border-top: none;
  }
  .fo-btn {
    flex: 1;
    padding: 16px;
    background: #111;
    border: none;
    border-right: 1px solid #222;
    color: var(--white);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
  }
  .fo-btn:last-child { border-right: none; }
  .fo-btn:hover { background: var(--yellow); color: var(--black); }

  /* ============================================================
     SECTION 6: USAGE DASHBOARD
  ============================================================ */
  #dashboard { background: #f5f5f0; }

  .usage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0;
    border: var(--border-thick);
    margin-bottom: 48px;
  }

  .usage-card {
    padding: 28px;
    border: 1px solid #ddd;
    transition: all 0.2s;
    cursor: default;
  }
  .usage-card:hover { background: var(--white); transform: translate(-2px,-2px); box-shadow: var(--shadow); z-index: 1; position: relative; }

  .usage-provider {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .usage-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot-green { background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse-dot 1.5s infinite; }
  .dot-yellow { background: var(--yellow); }
  .dot-red { background: var(--red); box-shadow: 0 0 6px var(--red); animation: pulse-dot 0.8s infinite; }

  .usage-nums {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: #999;
  }
  .usage-num-val { font-size: 11px; font-weight: 700; color: var(--black); }
  .usage-bar-bg {
    height: 8px;
    background: #e0e0e0;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .usage-bar-fill {
    height: 100%;
    transition: width 1.5s cubic-bezier(0.4,0,0.2,1);
    width: 0%;
  }
  .usage-reset {
    font-family: var(--font-mono);
    font-size: 9px;
    color: #aaa;
    letter-spacing: 1px;
  }
  .usage-reset span { color: var(--black); font-weight: 700; }

  /* ============================================================
     SECTION 7: ROADMAP TIMELINE
  ============================================================ */
  #roadmap { background: var(--white); }

  .timeline {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    position: relative;
    border: var(--border-thick);
  }

  .timeline-phase {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0;
    border-bottom: var(--border);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
  }
  .timeline-phase:last-child { border-bottom: none; }
  .timeline-phase:hover .phase-right { background: #fafafa; }

  .phase-left {
    padding: 40px 32px;
    border-right: var(--border);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    transition: background 0.2s;
  }
  .timeline-phase:hover .phase-left { background: var(--black); }

  .phase-num {
    font-family: var(--font-mono);
    font-size: 40px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -2px;
    color: var(--black);
    transition: color 0.2s;
  }
  .timeline-phase:hover .phase-num { color: var(--yellow); }
  .phase-week {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #999;
    transition: color 0.2s;
  }
  .timeline-phase:hover .phase-week { color: #555; }
  .phase-status {
    display: inline-block;
    padding: 3px 10px;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    width: fit-content;
    transition: all 0.2s;
  }

  .phase-right { padding: 40px 48px; transition: background 0.2s; }
  .phase-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 12px;
    line-height: 1.2;
  }
  .phase-tasks {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .phase-tasks li {
    font-size: 13px;
    color: #444;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f5f5f5;
    border-right: 3px solid transparent;
    transition: all 0.15s;
  }
  .phase-tasks li:hover { border-right-color: var(--black); background: var(--black); color: var(--white); transform: translateX(-3px); }
  .phase-tasks li::before { content: '▸'; font-size: 10px; flex-shrink: 0; }

  /* ============================================================
     SECTION 8: OBSIDIAN SIMULATION
  ============================================================ */
  #simulation { background: #1a1a2e; }
  #simulation .section-num { color: #1f1f3a; }
  #simulation .section-title { color: var(--white); }
  #simulation .section-label { color: #444; }
  #simulation .section-header { border-bottom-color: #2a2a4a; }

  .obsidian-mockup {
    border: var(--border);
    border-color: #333;
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-template-rows: 48px 1fr;
    height: 600px;
    font-family: var(--font-mono);
    font-size: 12px;
    box-shadow: var(--shadow-lg);
    background: #1e1e2e;
  }

  .obsidian-titlebar {
    grid-column: 1 / -1;
    background: #161626;
    border-bottom: 1px solid #333;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 8px;
  }
  .obs-dot { width: 10px; height: 10px; border-radius: 50%; }

  .obsidian-sidebar {
    background: #161626;
    border-right: 1px solid #2a2a4a;
    overflow-y: auto;
    padding: 8px 0;
  }
  .sidebar-section-label {
    padding: 16px 16px 6px;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #444;
  }
  .sidebar-item {
    padding: 8px 16px;
    color: #888;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.15s;
    border-right: 3px solid transparent;
  }
  .sidebar-item:hover { background: #1e1e2e; color: var(--white); }
  .sidebar-item.active { background: #1e1e2e; color: var(--white); border-right-color: var(--purple); }
  .sidebar-item-icon { font-size: 14px; }

  .obsidian-main { overflow: hidden; display: flex; flex-direction: column; }

  .obs-tab-bar {
    background: #161626;
    border-bottom: 1px solid #2a2a4a;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 0;
    height: 36px;
    overflow-x: auto;
  }
  .obs-tab {
    padding: 0 16px;
    height: 36px;
    line-height: 36px;
    font-size: 11px;
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    border-right: 1px solid #2a2a4a;
    transition: all 0.15s;
  }
  .obs-tab.active { background: #1e1e2e; color: var(--white); }

  .obs-plugin-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #1e1e2e;
  }

  .plugin-header {
    background: #252535;
    border-bottom: 1px solid #333;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .plugin-select {
    background: #1e1e2e;
    border: 1px solid #444;
    color: var(--white);
    padding: 5px 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
  }
  .plugin-select option { background: #1e1e2e; }

  .plugin-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .plugin-sysprompt {
    background: #141424;
    border-bottom: 1px solid #2a2a4a;
    padding: 10px 16px;
  }
  .sysp-label { font-size: 9px; color: var(--purple); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .sysp-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #888;
    font-family: var(--font-mono);
    font-size: 10px;
    line-height: 1.6;
    resize: none;
    height: 44px;
  }

  .plugin-chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #1e1e2e;
  }
  .chat-msg {
    padding: 10px 14px;
    font-size: 11px;
    line-height: 1.6;
    max-width: 80%;
    animation: msgSlideIn 0.3s ease;
  }
  .chat-msg.user { background: #252535; color: var(--white); align-self: flex-end; border: 1px solid #444; }
  .chat-msg.ai { background: #0f1f0f; color: var(--green); align-self: flex-start; border: 1px solid #1a3a1a; position: relative; }
  .chat-msg.ai::before { content: attr(data-model); position: absolute; top: -9px; right: 8px; background: var(--green); color: var(--black); font-size: 8px; padding: 1px 5px; font-weight: 700; letter-spacing: 1px; }

  .plugin-input-bar {
    background: #252535;
    border-top: 1px solid #333;
    padding: 10px 16px;
    display: flex;
    gap: 8px;
  }
  .plugin-input {
    flex: 1;
    background: #1e1e2e;
    border: 1px solid #444;
    color: var(--white);
    padding: 8px 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    outline: none;
  }
  .plugin-send {
    background: var(--purple);
    border: none;
    color: var(--white);
    padding: 8px 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.15s;
  }
  .plugin-send:hover { background: var(--blue); }

  /* ============================================================
     FOOTER
  ============================================================ */
  footer {
    background: var(--black);
    color: var(--white);
    padding: 64px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 48px;
    border-top: var(--border-thick);
  }
  .footer-brand {
    grid-column: 1;
  }
  .footer-logo {
    font-family: var(--font-mono);
    font-size: 32px;
    font-weight: 700;
    color: var(--yellow);
    letter-spacing: -1px;
    margin-bottom: 16px;
    display: block;
  }
  .footer-desc {
    font-size: 13px;
    color: #555;
    line-height: 1.7;
    max-width: 280px;
  }
  .footer-stack {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .footer-stack-title {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #444;
    padding: 0 0 16px;
    border-bottom: 1px solid #222;
    margin-bottom: 8px;
  }
  .footer-stack-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #111;
    font-size: 13px;
  }
  .footer-stack-item:hover { color: var(--yellow); cursor: default; }
  .footer-stack-val {
    font-family: var(--font-mono);
    font-size: 10px;
    color: #444;
  }

  .footer-bottom {
    grid-column: 1 / -1;
    border-top: 1px solid #222;
    padding-top: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #444;
    letter-spacing: 2px;
  }
  .footer-bottom strong { color: var(--white); }

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: none;
  }

  /* ============================================================
     RESPONSIVE
  ============================================================ */
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .hero-right { display: none; }
    .hero-stats { position: static; }
    .vs-grid { grid-template-columns: 1fr; }
    .vs-divider { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .timeline-phase { grid-template-columns: 1fr; }
    .phase-left { border-right: none; border-bottom: var(--border); }
    footer { grid-template-columns: 1fr; }
    .obsidian-mockup { grid-template-columns: 1fr; grid-template-rows: 48px 36px 1fr; height: auto; }
    .obsidian-sidebar { display: none; }
    .section-header { padding: 32px; }
    .section-body { padding: 32px; }
    nav { padding: 0 16px; }
    .nav-links { display: none; }
  }

  /* ============================================================
     MARQUEE
  ============================================================ */
  .marquee-wrap {
    overflow: hidden;
    background: var(--yellow);
    border-top: var(--border);
    border-bottom: var(--border);
    padding: 10px 0;
  }
  .marquee-track {
    display: flex;
    gap: 48px;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
  }
  .marquee-item {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--black);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .marquee-item::before { content: '◆'; font-size: 8px; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ============================================================
     COMPARISON TABLE
  ============================================================ */
  .compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .compare-table th {
    background: var(--black);
    color: var(--white);
    padding: 16px 20px;
    text-align: right;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: var(--border);
  }
  .compare-table th.highlight { background: var(--yellow); color: var(--black); }
  .compare-table td {
    padding: 14px 20px;
    border: 1px solid #e0e0e0;
    transition: background 0.15s;
    vertical-align: middle;
  }
  .compare-table tr:hover td { background: #f5f5f5; }
  .compare-table td.highlight { background: #fff9cc; border-color: var(--yellow); border-width: 2px; }
  .compare-table tr:hover td.highlight { background: #fff3a0; }
  .check { color: var(--green); font-size: 16px; font-weight: 700; }
  .cross { color: var(--red); font-size: 16px; }
  .partial { color: var(--orange); font-size: 14px; }

  /* ============================================================
     SCROLL PROGRESS
  ============================================================ */
  #scroll-progress {
    position: fixed;
    top: 60px;
    left: 0;
    height: 3px;
    background: var(--yellow);
    z-index: 999;
    transition: width 0.1s;
    width: 0%;
  }

  /* ============================================================
     BACK TO TOP
  ============================================================ */
  #back-top {
    position: fixed;
    bottom: 32px;
    left: 32px;
    width: 48px; height: 48px;
    background: var(--black);
    border: var(--border);
    color: var(--white);
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0;
    pointer-events: none;
    font-family: var(--font-mono);
    z-index: 100;
  }
  #back-top.visible { opacity: 1; pointer-events: all; }
  #back-top:hover { background: var(--yellow); color: var(--black); transform: translate(-3px,-3px); box-shadow: var(--shadow); }

</style>
</head>
<body>

<!-- CURSOR -->
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>

<!-- SCROLL PROGRESS -->
<div id="scroll-progress"></div>

<!-- BACK TO TOP -->
<div id="back-top" title="بازگشت به بالا">↑</div>

<!-- LOADER -->
<div id="loader">
  <div class="loader-text">AI FORGE</div>
  <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
  <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#444;letter-spacing:3px;">INITIALIZING...</div>
</div>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo"><span></span>AI FORGE</a>
  <ul class="nav-links">
    <li><a href="#problem">مشکل</a></li>
    <li><a href="#providers">پروایدرها</a></li>
    <li><a href="#architecture">معماری</a></li>
    <li><a href="#features">قابلیت‌ها</a></li>
    <li><a href="#failover">فیلوور</a></li>
    <li><a href="#simulation">شبیه‌سازی</a></li>
    <li><a href="#roadmap">نقشه‌راه</a></li>
  </ul>
</nav>

<!-- ============================================================
     HERO
============================================================ -->
<section class="hero" id="home">
  <div class="hero-left">
    <div class="hero-badge">Obsidian Plugin · v1.0</div>
    <h1 class="hero-title">
      AI<br>
      <span class="accent">FORGE</span>
      <span class="line2">// BACKEND POWERHOUSE</span>
    </h1>
    <p class="hero-desc">
      یک <strong>محیط AI Studio</strong> درون Obsidian — با دسترسی به <strong>۱۲+ پروایدر رایگان</strong>، مسیریابی هوشمند مدل‌ها، و تمرکز ویژه روی <strong>ساخت بکند حرفه‌ای</strong>.
    </p>
    <div class="hero-cta">
      <a href="#simulation" class="btn btn-primary">▶ مشاهده دمو</a>
      <a href="#architecture" class="btn btn-ghost">معماری</a>
    </div>
  </div>
  <div class="hero-right">
    <!-- LIVE MOCKUP -->
    <div class="mockup-window">
      <div class="window-bar">
        <div class="win-dot red"></div>
        <div class="win-dot yellow"></div>
        <div class="win-dot green"></div>
        <div class="win-title">AI Forge · Chat</div>
      </div>
      <div class="mock-toolbar">
        <select class="mock-select" id="hero-provider">
          <option>Groq</option>
          <option>DeepSeek</option>
          <option>Cerebras</option>
          <option>SambaNova</option>
          <option>OpenRouter</option>
        </select>
        <select class="mock-select" id="hero-model">
          <option>llama-3.3-70b-versatile</option>
          <option>llama-4-scout</option>
          <option>qwen-qwq-32b</option>
        </select>
        <span class="mock-model-badge" id="hero-badge">FREE</span>
      </div>
      <div class="mock-sliders">
        <div class="slider-row">
          <span class="slider-label">Temperature</span>
          <input type="range" class="mock-slider" min="0" max="100" value="70" oninput="this.nextElementSibling.textContent=this.value/100">
          <span class="slider-val">0.7</span>
        </div>
        <div class="slider-row">
          <span class="slider-label">Max Tokens</span>
          <input type="range" class="mock-slider" min="10" max="100" value="80" oninput="this.nextElementSibling.textContent=Math.round(this.value*81.92)+'K'">
          <span class="slider-val">8192</span>
        </div>
        <div class="slider-row">
          <span class="slider-label">Top-P</span>
          <input type="range" class="mock-slider" min="0" max="100" value="90" oninput="this.nextElementSibling.textContent=this.value/100">
          <span class="slider-val">0.9</span>
        </div>
      </div>
      <div class="mock-sysprompt">
        <div class="sysprompt-label">System Prompt</div>
        <div class="sysprompt-text" id="hero-sysprompt">You are a senior backend architect. Design robust, scalable APIs...</div>
      </div>
      <div class="mock-chat" id="hero-chat">
        <div class="mock-msg user">یک REST API برای سیستم احراز هویت با JWT طراحی کن</div>
        <div class="mock-msg ai"><span class="typing-cursor"></span></div>
      </div>
      <div class="mock-input-row">
        <input class="mock-input" type="text" placeholder="پیام بنویس..." id="hero-input">
        <button class="mock-send" onclick="sendHeroMsg()">SEND →</button>
      </div>
    </div>
  </div>

  <div class="hero-stats">
    <div class="stat-item" style="--i:0">
      <span class="stat-num" id="cnt-providers">0</span>
      <span class="stat-label">پروایدر رایگان</span>
    </div>
    <div class="stat-item" style="--i:1">
      <span class="stat-num" id="cnt-models">0</span>
      <span class="stat-label">مدل قابل دسترس</span>
    </div>
    <div class="stat-item" style="--i:2">
      <span class="stat-num" id="cnt-tokens">0</span>
      <span class="stat-label">توکن رایگان/روز</span>
    </div>
  </div>
</section>

<!-- MARQUEE -->
<div class="marquee-wrap">
  <div class="marquee-track">
    <span class="marquee-item">Groq LPU</span>
    <span class="marquee-item">DeepSeek V3.2</span>
    <span class="marquee-item">Cerebras 1M/day</span>
    <span class="marquee-item">Llama 4 Scout</span>
    <span class="marquee-item">SambaNova Cloud</span>
    <span class="marquee-item">OpenRouter</span>
    <span class="marquee-item">Gemini 2.5 Flash</span>
    <span class="marquee-item">HuggingFace</span>
    <span class="marquee-item">GitHub Models</span>
    <span class="marquee-item">NVIDIA NIM</span>
    <span class="marquee-item">Qwen3 235B</span>
    <span class="marquee-item">Fireworks AI</span>
    <!-- duplicate for seamless loop -->
    <span class="marquee-item">Groq LPU</span>
    <span class="marquee-item">DeepSeek V3.2</span>
    <span class="marquee-item">Cerebras 1M/day</span>
    <span class="marquee-item">Llama 4 Scout</span>
    <span class="marquee-item">SambaNova Cloud</span>
    <span class="marquee-item">OpenRouter</span>
    <span class="marquee-item">Gemini 2.5 Flash</span>
    <span class="marquee-item">HuggingFace</span>
    <span class="marquee-item">GitHub Models</span>
    <span class="marquee-item">NVIDIA NIM</span>
    <span class="marquee-item">Qwen3 235B</span>
    <span class="marquee-item">Fireworks AI</span>
  </div>
</div>

<!-- ============================================================
     SECTION 1: PROBLEM
============================================================ -->
<section id="problem">
  <div class="section-header reveal">
    <div class="section-num">01</div>
    <div class="section-meta">
      <div class="section-label">// مشکل</div>
      <h2 class="section-title">چرا Google AI Studio<br>برای بکند کافی نیست؟</h2>
    </div>
  </div>
  <div class="section-body">
    <div class="vs-grid reveal">
      <div class="vs-col bad">
        <div class="vs-label">محدودیت‌ها</div>
        <div class="vs-title">❌ Google AI Studio</div>
        <div class="vs-item">
          <div class="vs-icon">🎨</div>
          <div class="vs-text"><strong>فرانت‌اند محور</strong><span>تمرکز اصلی روی UI و HTML/CSS/JS — بکند در اولویت نیست</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🔒</div>
          <div class="vs-text"><strong>فقط Gemini</strong><span>هیچ دسترسی به مدل‌های دیگه مثل DeepSeek یا Llama نداری</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🗄️</div>
          <div class="vs-text"><strong>بدون دیتابیس واقعی</strong><span>PostgreSQL، MongoDB، Redis؟ — نمی‌شه</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🐳</div>
          <div class="vs-text"><strong>بدون DevOps</strong><span>Dockerfile، CI/CD، Kubernetes — پشتیبانی نمی‌کنه</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🔐</div>
          <div class="vs-text"><strong>Auth محدود</strong><span>JWT، OAuth، RBAC حرفه‌ای — ممکن نیست</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🚀</div>
          <div class="vs-text"><strong>فقط ۲ دیپلوی</strong><span>Starter tier: ۲ سرویس محدود در Cloud Run</span></div>
        </div>
      </div>

      <div class="vs-divider">
        <div class="vs-divider-text">VS</div>
      </div>

      <div class="vs-col good">
        <div class="vs-label">راه‌حل ما</div>
        <div class="vs-title">✅ AI Forge Plugin</div>
        <div class="vs-item">
          <div class="vs-icon">⚡</div>
          <div class="vs-text"><strong>بکند محور</strong><span>Template های تخصصی: API Design، DB، Auth، DevOps، Testing</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🌐</div>
          <div class="vs-text"><strong>۱۲+ پروایدر</strong><span>Groq، DeepSeek، Cerebras، SambaNova و بیشتر — همه رایگان</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🗃️</div>
          <div class="vs-text"><strong>طراحی دیتابیس کامل</strong><span>Prisma Schema، SQL Migration، Index Strategy، Redis Cache</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🏗️</div>
          <div class="vs-text"><strong>DevOps کامل</strong><span>Dockerfile، docker-compose، GitHub Actions، Kubernetes</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">🔑</div>
          <div class="vs-text"><strong>Auth System Builder</strong><span>JWT + OAuth + RBAC + 2FA — پیاده‌سازی کامل</span></div>
        </div>
        <div class="vs-item">
          <div class="vs-icon">♾️</div>
          <div class="vs-text"><strong>بدون محدودیت دیپلوی</strong><span>کد آماده تولید می‌کنه — تو هر کجا دیپلوی می‌کنی</span></div>
        </div>
      </div>
    </div>

    <!-- COMPARISON TABLE -->
    <div style="margin-top:48px;" class="reveal">
      <table class="compare-table">
        <thead>
          <tr>
            <th>قابلیت</th>
            <th>Google AI Studio</th>
            <th class="highlight">🔥 AI Forge</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>ساخت فرانت‌اند</td><td><span class="check">✓</span> عالی</td><td class="highlight"><span class="partial">◈</span> کد تولید می‌کنه</td></tr>
          <tr><td>طراحی REST API</td><td><span class="partial">◈</span> محدود</td><td class="highlight"><span class="check">✓✓</span> کامل + OpenAPI</td></tr>
          <tr><td>دیتابیس Schema</td><td><span class="cross">✗</span></td><td class="highlight"><span class="check">✓</span> Prisma + SQL</td></tr>
          <tr><td>Docker + CI/CD</td><td><span class="cross">✗</span></td><td class="highlight"><span class="check">✓</span> Multi-stage</td></tr>
          <tr><td>سیستم احراز هویت</td><td><span class="cross">✗</span></td><td class="highlight"><span class="check">✓</span> JWT + OAuth</td></tr>
          <tr><td>تست‌نویسی</td><td><span class="cross">✗</span></td><td class="highlight"><span class="check">✓</span> Unit + E2E</td></tr>
          <tr><td>انتخاب مدل</td><td><span class="cross">✗</span> فقط Gemini</td><td class="highlight"><span class="check">✓</span> ۱۲+ پروایدر</td></tr>
          <tr><td>Failover خودکار</td><td><span class="cross">✗</span></td><td class="highlight"><span class="check">✓</span> Auto-routing</td></tr>
          <tr><td>یکپارچگی با فایل‌سیستم</td><td><span class="cross">✗</span></td><td class="highlight"><span class="check">✓</span> Vault integration</td></tr>
          <tr><td>هزینه</td><td>رایگان (محدود)</td><td class="highlight"><span class="check">✓</span> رایگان (stack)</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 2: PROVIDERS
============================================================ -->
<section id="providers">
  <div class="section-header reveal">
    <div class="section-num" style="color:#1a1a1a">02</div>
    <div class="section-meta">
      <div class="section-label" style="color:#555">// پروایدرها</div>
      <h2 class="section-title" style="color:#fff">پروایدرهای رایگان<br><span style="color:var(--yellow)">نسل ۲۰۲۶</span></h2>
    </div>
  </div>
  <div class="section-body" style="padding-top:40px">
    <div class="providers-grid reveal">

      <div class="provider-card" style="--accent:var(--yellow)" data-speed="95">
        <div class="provider-header">
          <div class="provider-icon">⚡</div>
          <span class="provider-badge">FREE · NO CC</span>
        </div>
        <div class="provider-name">Groq</div>
        <div class="provider-desc">سریع‌ترین inference موجود با چیپ‌های LPU اختصاصی. ۵۰۰-۳۰۰۰ توکن/ثانیه.</div>
        <div class="provider-models">llama-3.3-70b · llama-4-scout · qwen-qwq-32b</div>
        <div class="provider-tags">
          <span class="prov-tag">500+ tok/s</span>
          <span class="prov-tag">OpenAI compat</span>
          <span class="prov-tag">LPU chip</span>
        </div>
        <div class="provider-speed" title="سرعت نسبی"><div class="provider-speed-bar" style="--speed:95%;width:95%"></div></div>
      </div>

      <div class="provider-card" style="--accent:var(--green)" data-speed="90">
        <div class="provider-header">
          <div class="provider-icon">🧠</div>
          <span class="provider-badge">FREE · NO CC</span>
        </div>
        <div class="provider-name">Cerebras</div>
        <div class="provider-desc">یک میلیون توکن رایگان در روز با سخت‌افزار Wafer Scale Engine اختصاصی.</div>
        <div class="provider-models">llama3.1-8b · gpt-oss-120b · GLM-4</div>
        <div class="provider-tags">
          <span class="prov-tag">1M tok/day</span>
          <span class="prov-tag">WSE chip</span>
          <span class="prov-tag">Daily reset</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:90%;width:90%"></div></div>
      </div>

      <div class="provider-card" style="--accent:var(--blue)" data-speed="75">
        <div class="provider-header">
          <div class="provider-icon">🔬</div>
          <span class="provider-badge">FREE TIER</span>
        </div>
        <div class="provider-name">DeepSeek</div>
        <div class="provider-desc">بهترین مدل برای کدنویسی و استدلال. V3.2 و R1 بنچمارک‌های کدنویسی رو رهبری می‌کنن.</div>
        <div class="provider-models">deepseek-chat (V3.2) · deepseek-reasoner (R1)</div>
        <div class="provider-tags">
          <span class="prov-tag">Best coding</span>
          <span class="prov-tag">Reasoning</span>
          <span class="prov-tag">OpenAI compat</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:75%;width:75%"></div></div>
      </div>

      <div class="provider-card" style="--accent:var(--orange)" data-speed="88">
        <div class="provider-header">
          <div class="provider-icon">🏔️</div>
          <span class="provider-badge">$5 FREE</span>
        </div>
        <div class="provider-name">SambaNova</div>
        <div class="provider-desc">دسترسی به مدل‌های بزرگ مثل Llama 4 Maverick و Qwen3-235B با سرعت بالا.</div>
        <div class="provider-models">Llama-4-Maverick · DeepSeek-V3.1 · Qwen3-235B</div>
        <div class="provider-tags">
          <span class="prov-tag">Large models</span>
          <span class="prov-tag">Fast API</span>
          <span class="prov-tag">$5 credit</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:88%;width:88%"></div></div>
      </div>

      <div class="provider-card" style="--accent:var(--purple)" data-speed="70">
        <div class="provider-header">
          <div class="provider-icon">🌐</div>
          <span class="provider-badge">FREE · NO CC</span>
        </div>
        <div class="provider-name">OpenRouter</div>
        <div class="provider-desc">یک API — دسترسی به ۲۰+ مدل رایگان. ایده‌آل برای fallback و مقایسه مدل‌ها.</div>
        <div class="provider-models">+20 free models · auto routing</div>
        <div class="provider-tags">
          <span class="prov-tag">20+ free</span>
          <span class="prov-tag">Fallback</span>
          <span class="prov-tag">Gateway</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:70%;width:70%"></div></div>
      </div>

      <div class="provider-card" style="--accent:var(--red)" data-speed="82">
        <div class="provider-header">
          <div class="provider-icon">💎</div>
          <span class="provider-badge">FREE · NO CC</span>
        </div>
        <div class="provider-name">Google AI Studio</div>
        <div class="provider-desc">Gemini 2.5 Flash با پنجره ۱ میلیون توکن. بهترین برای تحلیل کدبیس‌های بزرگ.</div>
        <div class="provider-models">gemini-2.5-flash · gemini-2.5-flash-lite</div>
        <div class="provider-tags">
          <span class="prov-tag">1M context</span>
          <span class="prov-tag">Multimodal</span>
          <span class="prov-tag">Google API</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:82%;width:82%"></div></div>
      </div>

      <div class="provider-card" style="--accent:#ff69b4" data-speed="65">
        <div class="provider-header">
          <div class="provider-icon">🤗</div>
          <span class="provider-badge">FREE · NO CC</span>
        </div>
        <div class="provider-name">HuggingFace</div>
        <div class="provider-desc">Gateway به ۱۵+ پروایدر. دسترسی به صدها مدل اپن‌سورس با یک API واحد.</div>
        <div class="provider-models">Serverless · Endpoints · Providers</div>
        <div class="provider-tags">
          <span class="prov-tag">100+ models</span>
          <span class="prov-tag">Open source</span>
          <span class="prov-tag">Hub gateway</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:65%;width:65%"></div></div>
      </div>

      <div class="provider-card" style="--accent:#00d4aa" data-speed="78">
        <div class="provider-header">
          <div class="provider-icon">🐙</div>
          <span class="provider-badge">FREE · NO CC</span>
        </div>
        <div class="provider-name">GitHub Models</div>
        <div class="provider-desc">رایگان برای کاربران GitHub. دسترسی به GPT-4o-mini، Llama، Mistral و بیشتر.</div>
        <div class="provider-models">gpt-4o-mini · Llama-3.1-70B · Mistral</div>
        <div class="provider-tags">
          <span class="prov-tag">GitHub account</span>
          <span class="prov-tag">Azure backend</span>
          <span class="prov-tag">Prototyping</span>
        </div>
        <div class="provider-speed"><div class="provider-speed-bar" style="--speed:78%;width:78%"></div></div>
      </div>

    </div>

    <!-- KEY INSIGHT -->
    <div style="margin-top:48px;padding:32px;background:#111;border:var(--border);border-color:#333;color:var(--white);" class="reveal">
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:3px;color:var(--yellow);margin-bottom:16px;text-transform:uppercase;">// نکته طلایی</div>
      <div style="font-size:18px;line-height:1.7;color:#ccc;">
        بیشتر این پروایدرها <span style="color:var(--green);font-weight:700;">OpenAI-compatible</span> هستن. یعنی کافیه <span style="color:var(--yellow);font-family:var(--font-mono);">base_url</span> رو عوض کنی — بقیه کد یکسانه. یک <span style="color:var(--yellow);font-weight:700;">Provider Abstraction Layer</span> بنویس، همه رو پشتیبانی کن.
      </div>
      <div style="margin-top:20px;font-family:var(--font-mono);font-size:12px;color:#444;background:#0a0a0a;padding:20px;border-right:3px solid var(--yellow);">
        <span style="color:var(--green)">const</span> groq = <span style="color:var(--blue)">new</span> OpenAICompatibleProvider(<span style="color:var(--yellow)">'Groq'</span>, key, <span style="color:var(--yellow)">'https://api.groq.com/openai/v1'</span>);<br>
        <span style="color:var(--green)">const</span> deep = <span style="color:var(--blue)">new</span> OpenAICompatibleProvider(<span style="color:var(--yellow)">'DeepSeek'</span>, key, <span style="color:var(--yellow)">'https://api.deepseek.com/v1'</span>);<br>
        <span style="color:var(--green)">const</span> samba= <span style="color:var(--blue)">new</span> OpenAICompatibleProvider(<span style="color:var(--yellow)">'SambaNova'</span>, key, <span style="color:var(--yellow)">'https://api.sambanova.ai/v1'</span>);<br>
        <span style="color:#555">// ← همه یکسانن. فقط URL فرق داره!</span>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 3: ARCHITECTURE
============================================================ -->
<section id="architecture">
  <div class="section-header reveal">
    <div class="section-num">03</div>
    <div class="section-meta">
      <div class="section-label">// معماری</div>
      <h2 class="section-title">چطور ساخته<br>می‌شه؟</h2>
    </div>
  </div>
  <div class="section-body">
    <div class="arch-diagram reveal">

      <div class="arch-layer" style="--layer-color:var(--yellow);--layer-bg:#fffdf0">
        <div class="arch-layer-num">L1</div>
        <div class="arch-layer-content">
          <div class="arch-layer-title" style="color:var(--yellow)">لایه رابط کاربری (UI Layer)</div>
          <div class="arch-layer-desc">تمام چیزی که کاربر می‌بینه و باهاش تعامل داره. Obsidian LeafView API برای پنل‌ها، CSS استاندارد برای استایل، و رابط کاربری responsive برای Android.</div>
          <div class="arch-layer-nodes">
            <div class="arch-node">ChatView.ts</div>
            <div class="arch-node">SystemPromptEditor.ts</div>
            <div class="arch-node">ModelSelector.ts</div>
            <div class="arch-node">SettingsTab.ts</div>
            <div class="arch-node">StreamRenderer.ts</div>
            <div class="arch-node">UsageDashboard.ts</div>
          </div>
        </div>
      </div>

      <div class="arch-arrow">↓ ↓ ↓</div>

      <div class="arch-layer" style="--layer-color:var(--blue);--layer-bg:#f0f5ff">
        <div class="arch-layer-num">L2</div>
        <div class="arch-layer-content">
          <div class="arch-layer-title" style="color:var(--blue)">لایه انتزاعی (Abstraction Layer)</div>
          <div class="arch-layer-desc">قلب پلاگین. یک interface یکپارچه برای همه پروایدرها تعریف می‌کنه. Smart Router تسمیم می‌گیره کدوم مدل برای کدوم تسک مناسب‌تره. Failover Manager وقتی rate limit می‌خوره جابجا می‌کنه.</div>
          <div class="arch-layer-nodes">
            <div class="arch-node">LLMProvider interface</div>
            <div class="arch-node">SmartRouter</div>
            <div class="arch-node">FailoverManager</div>
            <div class="arch-node">RateLimitTracker</div>
            <div class="arch-node">StreamingHandler</div>
          </div>
        </div>
      </div>

      <div class="arch-arrow">↓ ↓ ↓</div>

      <div class="arch-layer" style="--layer-color:var(--green);--layer-bg:#f0fff8">
        <div class="arch-layer-num">L3</div>
        <div class="arch-layer-content">
          <div class="arch-layer-title" style="color:var(--green)">لایه پروایدرها (Provider Layer)</div>
          <div class="arch-layer-desc">پیاده‌سازی هر پروایدر جداگانه. چون بیشتر OpenAI-compatible هستن، یک BaseProvider نوشته می‌شه و بقیه ازش ارث می‌برن. فقط Gemini API فرمت متفاوتی داره و نیاز به Adapter داره.</div>
          <div class="arch-layer-nodes">
            <div class="arch-node">GroqProvider</div>
            <div class="arch-node">DeepSeekProvider</div>
            <div class="arch-node">CerebrasProvider</div>
            <div class="arch-node">SambanovaProvider</div>
            <div class="arch-node">OpenRouterProvider</div>
            <div class="arch-node">GeminiAdapter</div>
          </div>
        </div>
      </div>

      <div class="arch-arrow">↓ ↓ ↓</div>

      <div class="arch-layer" style="--layer-color:var(--purple);--layer-bg:#fdf0ff">
        <div class="arch-layer-num">L4</div>
        <div class="arch-layer-content">
          <div class="arch-layer-title" style="color:var(--purple)">لایه ذخیره‌سازی (Storage Layer)</div>
          <div class="arch-layer-desc">همه داده‌ها به صورت ساختاریافته در vault Obsidian ذخیره می‌شن. تاریخچه چت، template ها، تنظیمات و خروجی workflow ها همه به صورت Markdown فایل قابل جستجو و لینک‌دهی هستن.</div>
          <div class="arch-layer-nodes">
            <div class="arch-node">VaultIntegration.ts</div>
            <div class="arch-node">ChatHistory (MD)</div>
            <div class="arch-node">ProjectContext</div>
            <div class="arch-node">PromptTemplates</div>
            <div class="arch-node">Settings (JSON)</div>
          </div>
        </div>
      </div>

    </div>

    <!-- MOBILE NOTE -->
    <div style="margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:0;border:var(--border-thick);" class="reveal">
      <div style="padding:32px;border-right:var(--border);background:#fff9cc">
        <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:3px;color:var(--orange);margin-bottom:12px;text-transform:uppercase;">✅ سازگار با Android</div>
        <div style="font-size:14px;line-height:1.7;color:#333;">
          با تنظیم <code style="background:#f0f0f0;padding:2px 6px;font-family:var(--font-mono)">"isDesktopOnly": false</code> در manifest و استفاده از <code style="background:#f0f0f0;padding:2px 6px;font-family:var(--font-mono)">requestUrl</code> به جای Node.js APIs، پلاگین روی موبایل هم کار می‌کنه.
        </div>
      </div>
      <div style="padding:32px;background:#f0fff8">
        <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:3px;color:var(--green);margin-bottom:12px;text-transform:uppercase;">⚡ Streaming کامل</div>
        <div style="font-size:14px;line-height:1.7;color:#333;">
          از SSE (Server-Sent Events) با <code style="background:#f0f0f0;padding:2px 6px;font-family:var(--font-mono)">fetch + ReadableStream</code> برای streaming واقعی استفاده می‌کنه — جواب کلمه به کلمه نمایش داده می‌شه.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 4: FEATURES / BACKEND TEMPLATES
============================================================ -->
<section id="features">
  <div class="section-header reveal">
    <div class="section-num">04</div>
    <div class="section-meta">
      <div class="section-label">// قابلیت‌ها</div>
      <h2 class="section-title">Template های بکند<br><span style="color:var(--red)">ابزارهایی که AI Studio نداره</span></h2>
    </div>
  </div>
  <div class="section-body" style="padding-top:40px">
    <div class="features-grid reveal">

      <div class="feature-card" style="--fc:var(--blue);--fib:#e8f0ff">
        <div class="feature-icon-wrap">🔌</div>
        <div class="feature-tag">Backend Template #1</div>
        <h3 class="feature-title">REST API Designer</h3>
        <p class="feature-desc">یک فیچر رو توضیح بده، یه API کامل تحویل بگیر. از OpenAPI spec تا validation و error handling.</p>
        <ul class="feature-list">
          <li>OpenAPI 3.1 YAML spec</li>
          <li>Prisma / SQL Schema</li>
          <li>Route Handlers (Express/FastAPI)</li>
          <li>Zod / Pydantic validation</li>
          <li>Error handling middleware</li>
          <li>Authentication middleware</li>
        </ul>
      </div>

      <div class="feature-card" style="--fc:var(--green);--fib:#e8fff2">
        <div class="feature-icon-wrap">🗃️</div>
        <div class="feature-tag">Backend Template #2</div>
        <h3 class="feature-title">Database Architect</h3>
        <p class="feature-desc">طراحی اسکیما با نرمال‌سازی درست، ایندکس‌های بهینه، و استراتژی کش Redis.</p>
        <ul class="feature-list">
          <li>Prisma Schema + Migrations</li>
          <li>Index strategy برای query patterns</li>
          <li>Redis caching design</li>
          <li>Relations (1:1, 1:N, N:N)</li>
          <li>Partitioning برای scale</li>
          <li>Query optimization</li>
        </ul>
      </div>

      <div class="feature-card" style="--fc:var(--orange);--fib:#fff3e8">
        <div class="feature-icon-wrap">🐳</div>
        <div class="feature-tag">Backend Template #3</div>
        <h3 class="feature-title">DevOps Engineer</h3>
        <p class="feature-desc">از Dockerfile تا Kubernetes. تنظیمات آماده برای production با امنیت hardening.</p>
        <ul class="feature-list">
          <li>Multi-stage Dockerfile</li>
          <li>docker-compose (app+db+redis)</li>
          <li>GitHub Actions CI/CD</li>
          <li>Kubernetes manifests (K8s)</li>
          <li>Nginx / Caddy reverse proxy</li>
          <li>Monitoring (Prometheus+Grafana)</li>
        </ul>
      </div>

      <div class="feature-card" style="--fc:var(--red);--fib:#fff0f0">
        <div class="feature-icon-wrap">🔐</div>
        <div class="feature-tag">Backend Template #4</div>
        <h3 class="feature-title">Auth System Builder</h3>
        <p class="feature-desc">سیستم احراز هویت کامل و امن. از JWT ساده تا OAuth2 پیچیده و RBAC.</p>
        <ul class="feature-list">
          <li>JWT access + refresh token</li>
          <li>OAuth2 (Google, GitHub, Discord)</li>
          <li>RBAC / ABAC permissions</li>
          <li>bcrypt / argon2 hashing</li>
          <li>Rate limiting + brute-force</li>
          <li>2FA / TOTP implementation</li>
        </ul>
      </div>

      <div class="feature-card" style="--fc:var(--purple);--fib:#f5e8ff">
        <div class="feature-icon-wrap">🏗️</div>
        <div class="feature-tag">Backend Template #5</div>
        <h3 class="feature-title">Microservices Architect</h3>
        <p class="feature-desc">طراحی معماری میکروسرویس با DDD. الگوهای مقاوم در برابر خرابی و distributed transactions.</p>
        <ul class="feature-list">
          <li>Service boundaries + DDD</li>
          <li>gRPC + message queues</li>
          <li>API Gateway patterns</li>
          <li>Saga + CQRS patterns</li>
          <li>Circuit breaker + retry</li>
          <li>Service discovery</li>
        </ul>
      </div>

      <div class="feature-card" style="--fc:var(--yellow);--fib:#fffde8">
        <div class="feature-icon-wrap">🧪</div>
        <div class="feature-tag">Backend Template #6</div>
        <h3 class="feature-title">Test Engineer</h3>
        <p class="feature-desc">تست‌های جامع برای هر کدی. از unit tests تا load testing با ابزارهای مدرن.</p>
        <ul class="feature-list">
          <li>Unit tests (Jest/Pytest)</li>
          <li>Integration tests + test DB</li>
          <li>API tests (supertest/httpx)</li>
          <li>E2E test scenarios</li>
          <li>Load testing (k6/Artillery)</li>
          <li>Coverage analysis</li>
        </ul>
      </div>

    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 5: FAILOVER ANIMATION
============================================================ -->
<section id="failover">
  <div class="section-header reveal">
    <div class="section-num" style="color:#1a1a1a">05</div>
    <div class="section-meta">
      <div class="section-label" style="color:#444">// Failover</div>
      <h2 class="section-title" style="color:#fff">سیستم Failover<br><span style="color:var(--green)">خودکار</span></h2>
    </div>
  </div>
  <div class="section-body">
    <div style="margin-bottom:32px;font-size:16px;color:#888;line-height:1.7;" class="reveal">
      وقتی یه پروایدر rate limit می‌خوره یا خطا می‌ده، پلاگین <strong style="color:var(--white)">خودکار و بدون وقفه</strong> به پروایدر بعدی می‌ره. شبیه‌سازی رو شروع کن:
    </div>

    <div class="failover-diagram reveal">
      <div class="failover-track" id="fo-track">

        <div class="fo-step active" id="fo-0">
          <div class="fo-step-num">01</div>
          <div class="fo-step-info">
            <div class="fo-step-title">DeepSeek V3.2</div>
            <div class="fo-step-sub">بهترین برای کدنویسی — اولین انتخاب</div>
          </div>
          <div class="fo-step-status"><span class="fo-status-tag status-active" id="fo-status-0">ACTIVE</span></div>
        </div>
        <div class="fo-progress-bar"><div class="fo-progress-fill" id="fo-bar-0" style="width:70%"></div></div>

        <div class="fo-step" id="fo-1">
          <div class="fo-step-num">02</div>
          <div class="fo-step-info">
            <div class="fo-step-title">Groq · Llama-3.3-70B</div>
            <div class="fo-step-sub">سریع‌ترین fallback — LPU چیپ</div>
          </div>
          <div class="fo-step-status"><span class="fo-status-tag status-standby" id="fo-status-1">STANDBY</span></div>
        </div>
        <div class="fo-progress-bar"><div class="fo-progress-fill" id="fo-bar-1" style="width:0%"></div></div>

        <div class="fo-step" id="fo-2">
          <div class="fo-step-num">03</div>
          <div class="fo-step-info">
            <div class="fo-step-title">Cerebras · gpt-oss-120B</div>
            <div class="fo-step-sub">یک میلیون توکن/روز رایگان</div>
          </div>
          <div class="fo-step-status"><span class="fo-status-tag status-standby" id="fo-status-2">STANDBY</span></div>
        </div>
        <div class="fo-progress-bar"><div class="fo-progress-fill" id="fo-bar-2" style="width:0%"></div></div>

        <div class="fo-step" id="fo-3">
          <div class="fo-step-num">04</div>
          <div class="fo-step-info">
            <div class="fo-step-title">OpenRouter · Auto</div>
            <div class="fo-step-sub">پشتیبان نهایی — ۲۰+ مدل رایگان</div>
          </div>
          <div class="fo-step-status"><span class="fo-status-tag status-fallback" id="fo-status-3">FALLBACK</span></div>
        </div>
        <div class="fo-progress-bar"><div class="fo-progress-fill" id="fo-bar-3" style="width:0%"></div></div>

      </div>

      <div class="failover-log" id="fo-log">
        <div style="color:#333;">// لاگ سیستم — شبیه‌سازی را شروع کن</div>
      </div>

      <div class="failover-controls">
        <button class="fo-btn" onclick="simulateRateLimit()">⚡ شبیه‌سازی Rate Limit</button>
        <button class="fo-btn" onclick="simulateError()">❌ شبیه‌سازی خطا</button>
        <button class="fo-btn" onclick="resetFailover()">↺ ریست</button>
      </div>
    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 6: USAGE DASHBOARD
============================================================ -->
<section id="dashboard" style="border-bottom:5px solid #000">
  <div class="section-header reveal">
    <div class="section-num">06</div>
    <div class="section-meta">
      <div class="section-label">// داشبورد</div>
      <h2 class="section-title">مصرف پروایدرها<br>در نگاه اول</h2>
    </div>
  </div>
  <div class="section-body">
    <div class="usage-grid reveal">

      <div class="usage-card">
        <div class="usage-provider"><div class="usage-dot dot-green"></div>Groq</div>
        <div class="usage-nums"><span>توکن مصرفی</span><span class="usage-num-val">8,420 / 14,400</span></div>
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="background:var(--green);width:58%"></div></div>
        <div class="usage-reset">ریست: <span>در ۱۶ ساعت</span></div>
      </div>

      <div class="usage-card">
        <div class="usage-provider"><div class="usage-dot dot-green"></div>Cerebras</div>
        <div class="usage-nums"><span>توکن مصرفی</span><span class="usage-num-val">280K / 1M</span></div>
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="background:var(--blue);width:28%"></div></div>
        <div class="usage-reset">ریست: <span>در ۲۲ ساعت</span></div>
      </div>

      <div class="usage-card">
        <div class="usage-provider"><div class="usage-dot dot-yellow"></div>DeepSeek</div>
        <div class="usage-nums"><span>توکن مصرفی</span><span class="usage-num-val">ناشناخته</span></div>
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="background:var(--yellow);width:45%"></div></div>
        <div class="usage-reset">ریست: <span>روزانه</span></div>
      </div>

      <div class="usage-card">
        <div class="usage-provider"><div class="usage-dot dot-red"></div>SambaNova</div>
        <div class="usage-nums"><span>کردیت باقی‌مانده</span><span class="usage-num-val">$3.21 / $5.00</span></div>
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="background:var(--orange);width:64%"></div></div>
        <div class="usage-reset">کردیت یک‌بار مصرف</div>
      </div>

      <div class="usage-card">
        <div class="usage-provider"><div class="usage-dot dot-green"></div>OpenRouter</div>
        <div class="usage-nums"><span>درخواست امروز</span><span class="usage-num-val">12 / 50</span></div>
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="background:var(--purple);width:24%"></div></div>
        <div class="usage-reset">ریست: <span>در ۱۸ ساعت</span></div>
      </div>

      <div class="usage-card">
        <div class="usage-provider"><div class="usage-dot dot-green"></div>Google AI Studio</div>
        <div class="usage-nums"><span>درخواست امروز</span><span class="usage-num-val">450 / 1500</span></div>
        <div class="usage-bar-bg"><div class="usage-bar-fill" style="background:var(--red);width:30%"></div></div>
        <div class="usage-reset">ریست: <span>فردا</span></div>
      </div>

    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 7: OBSIDIAN SIMULATION
============================================================ -->
<section id="simulation">
  <div class="section-header reveal">
    <div class="section-num" style="color:#1f1f3a">07</div>
    <div class="section-meta">
      <div class="section-label" style="color:#444">// شبیه‌سازی</div>
      <h2 class="section-title" style="color:var(--white)">پلاگین در عمل<br><span style="color:var(--purple)">تجربه واقعی</span></h2>
    </div>
  </div>
  <div class="section-body">
    <div style="margin-bottom:24px;font-size:14px;color:#888;" class="reveal">
      یک درخواست بنویس و ببین پلاگین چطور جواب می‌ده. Provider و Template رو انتخاب کن، بعد Send بزن.
    </div>
    <div class="obsidian-mockup reveal" id="obs-mockup">

      <!-- TITLEBAR -->
      <div class="obsidian-titlebar">
        <div class="obs-dot" style="background:var(--red)"></div>
        <div class="obs-dot" style="background:var(--yellow)"></div>
        <div class="obs-dot" style="background:var(--green)"></div>
        <span style="margin-right:auto;margin-left:auto;font-size:11px;color:#444;letter-spacing:2px;">Obsidian — AI Forge Plugin</span>
      </div>

      <!-- SIDEBAR -->
      <div class="obsidian-sidebar">
        <div class="sidebar-section-label">workspace</div>
        <div class="sidebar-item active"><span class="sidebar-item-icon">🤖</span>AI Forge</div>
        <div class="sidebar-item"><span class="sidebar-item-icon">📝</span>Projects/backend-api</div>
        <div class="sidebar-item"><span class="sidebar-item-icon">📁</span>Projects/auth-system</div>
        <div class="sidebar-item"><span class="sidebar-item-icon">🗃️</span>DB Schemas</div>

        <div class="sidebar-section-label" style="margin-top:8px">templates</div>
        <div class="sidebar-item" onclick="setTemplate('rest')"><span class="sidebar-item-icon">🔌</span>REST API</div>
        <div class="sidebar-item" onclick="setTemplate('db')"><span class="sidebar-item-icon">🗄️</span>Database</div>
        <div class="sidebar-item" onclick="setTemplate('auth')"><span class="sidebar-item-icon">🔐</span>Auth System</div>
        <div class="sidebar-item" onclick="setTemplate('devops')"><span class="sidebar-item-icon">🐳</span>DevOps</div>
        <div class="sidebar-item" onclick="setTemplate('test')"><span class="sidebar-item-icon">🧪</span>Tests</div>

        <div class="sidebar-section-label" style="margin-top:8px">history</div>
        <div class="sidebar-item" style="font-size:10px;opacity:0.5">2025-01-08 — Auth design</div>
        <div class="sidebar-item" style="font-size:10px;opacity:0.5">2025-01-07 — DB schema</div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="obsidian-main">
        <!-- TAB BAR -->
        <div class="obs-tab-bar">
          <div class="obs-tab active">🤖 AI Forge</div>
          <div class="obs-tab">📝 schema.prisma</div>
          <div class="obs-tab">📄 auth-routes.ts</div>
        </div>

        <!-- PLUGIN AREA -->
        <div class="obs-plugin-area">
          <!-- HEADER / CONTROLS -->
          <div class="plugin-header">
            <select class="plugin-select" id="sim-provider" onchange="updateSimModel()">
              <option value="groq">⚡ Groq</option>
              <option value="deepseek">🔬 DeepSeek</option>
              <option value="cerebras">🧠 Cerebras</option>
              <option value="sambanova">🏔️ SambaNova</option>
              <option value="openrouter">🌐 OpenRouter</option>
              <option value="gemini">💎 Gemini</option>
            </select>
            <select class="plugin-select" id="sim-model">
              <option>llama-3.3-70b-versatile</option>
              <option>llama-4-scout-17b</option>
              <option>qwen-qwq-32b</option>
            </select>
            <span id="sim-free-badge" style="background:var(--green);color:#000;padding:3px 8px;font-size:9px;font-weight:700;letter-spacing:1px;">FREE</span>
            <select class="plugin-select" id="sim-template" onchange="applyTemplate()" style="background:#1a0a3a;border-color:#6a35aa;color:var(--purple)">
              <option value="">── Template انتخاب کن ──</option>
              <option value="rest">🔌 REST API Designer</option>
              <option value="db">🗃️ Database Architect</option>
              <option value="auth">🔐 Auth System Builder</option>
              <option value="devops">🐳 DevOps Engineer</option>
              <option value="test">🧪 Test Engineer</option>
            </select>
            <span id="sim-status" style="font-size:10px;color:#444;margin-right:auto;font-family:var(--font-mono);letter-spacing:1px;">READY</span>
          </div>

          <div class="plugin-content">
            <!-- SYSTEM PROMPT -->
            <div class="plugin-sysprompt">
              <div class="sysp-label">System Prompt</div>
              <textarea class="sysp-textarea" id="sim-sysprompt" rows="3">یک پلاگین Obsidian هستم که به توسعه‌دهندگان بکند کمک می‌کنم. کد کامل، production-ready و قابل استفاده فوری تولید می‌کنم.</textarea>
            </div>

            <!-- CHAT AREA -->
            <div class="plugin-chat-area" id="sim-chat">
              <div style="text-align:center;color:#333;font-size:11px;padding:20px 0;opacity:0.5">
                ── یک Template انتخاب کن یا مستقیم بنویس ──
              </div>
            </div>

            <!-- INPUT -->
            <div class="plugin-input-bar">
              <input class="plugin-input" type="text" id="sim-input" placeholder="بنویس... مثلاً: یه API برای مدیریت کاربران طراحی کن" onkeydown="if(event.key==='Enter')sendSimMsg()">
              <button class="plugin-send" onclick="sendSimMsg()">SEND ⏎</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ============================================================
     SECTION 8: ROADMAP
============================================================ -->
<section id="roadmap">
  <div class="section-header reveal">
    <div class="section-num">08</div>
    <div class="section-meta">
      <div class="section-label">// نقشه راه</div>
      <h2 class="section-title">مراحل ساخت<br>از صفر تا انتشار</h2>
    </div>
  </div>
  <div class="section-body" style="padding:0">
    <div class="timeline reveal">

      <div class="timeline-phase">
        <div class="phase-left">
          <div class="phase-num">01</div>
          <div class="phase-week">هفته ۱-۲</div>
          <div class="phase-status" style="background:var(--green);color:#000">MVP</div>
        </div>
        <div class="phase-right">
          <h3 class="phase-title">Core Engine — هسته اصلی</h3>
          <ul class="phase-tasks">
            <li>Provider base class (OpenAI-compat)</li>
            <li>ثبت Groq و DeepSeek</li>
            <li>Chat view با streaming</li>
            <li>System prompt editor</li>
            <li>Settings tab (API keys)</li>
            <li>manifest.json برای Android</li>
          </ul>
        </div>
      </div>

      <div class="timeline-phase">
        <div class="phase-left">
          <div class="phase-num">02</div>
          <div class="phase-week">هفته ۳-۴</div>
          <div class="phase-status" style="background:var(--blue);color:#fff">Multi-Provider</div>
        </div>
        <div class="phase-right">
          <h3 class="phase-title">Multi-Provider + Backend Templates</h3>
          <ul class="phase-tasks">
            <li>Cerebras + SambaNova + OpenRouter</li>
            <li>Gemini Adapter (non-OpenAI)</li>
            <li>Backend template library (6 template)</li>
            <li>Model selector dropdown</li>
            <li>Smart router (task → model)</li>
            <li>Context injection از vault</li>
          </ul>
        </div>
      </div>

      <div class="timeline-phase">
        <div class="phase-left">
          <div class="phase-num">03</div>
          <div class="phase-week">هفته ۵-۶</div>
          <div class="phase-status" style="background:var(--orange);color:#000">Failover</div>
        </div>
        <div class="phase-right">
          <h3 class="phase-title">Failover + Dashboard + Android Opt</h3>
          <ul class="phase-tasks">
            <li>Provider stacking + auto-failover</li>
            <li>Rate limit tracker per provider</li>
            <li>Usage dashboard UI</li>
            <li>HuggingFace + GitHub + NVIDIA</li>
            <li>بهینه‌سازی UI برای صفحات کوچک</li>
            <li>ذخیره خروجی ساختاریافته در vault</li>
          </ul>
        </div>
      </div>

      <div class="timeline-phase">
        <div class="phase-left">
          <div class="phase-num">04</div>
          <div class="phase-week">هفته ۷+</div>
          <div class="phase-status" style="background:var(--purple);color:#fff">Advanced</div>
        </div>
        <div class="phase-right">
          <h3 class="phase-title">قابلیت‌های پیشرفته + انتشار</h3>
          <ul class="phase-tasks">
            <li>Backend Workflow Builder (multi-step)</li>
            <li>RAG با یادداشت‌های vault</li>
            <li>Model comparison (split view)</li>
            <li>Prompt gallery + community sharing</li>
            <li>Function calling support</li>
            <li>انتشار Community Plugin</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ============================================================
     FOOTER
============================================================ -->
<footer>
  <div class="footer-brand">
    <span class="footer-logo">AI FORGE</span>
    <p class="footer-desc">یک پلاگین Obsidian برای توسعه‌دهندگان بکند. ساخته شده با TypeScript، با دسترسی به بهترین مدل‌های هوش مصنوعی رایگان جهان.</p>
  </div>

  <div class="footer-stack">
    <div class="footer-stack-title">Stack</div>
    <div class="footer-stack-item"><span>زبان</span><span class="footer-stack-val">TypeScript</span></div>
    <div class="footer-stack-item"><span>پلتفرم</span><span class="footer-stack-val">Obsidian Plugin API</span></div>
    <div class="footer-stack-item"><span>Streaming</span><span class="footer-stack-val">SSE / fetch API</span></div>
    <div class="footer-stack-item"><span>UI</span><span class="footer-stack-val">Obsidian ItemView</span></div>
    <div class="footer-stack-item"><span>ذخیره‌سازی</span><span class="footer-stack-val">Vault Markdown</span></div>
    <div class="footer-stack-item"><span>موبایل</span><span class="footer-stack-val">Android + iOS</span></div>
  </div>

  <div class="footer-stack">
    <div class="footer-stack-title">پروایدرهای رایگان</div>
    <div class="footer-stack-item"><span>🟢 Groq</span><span class="footer-stack-val">console.groq.com</span></div>
    <div class="footer-stack-item"><span>🟢 Cerebras</span><span class="footer-stack-val">cloud.cerebras.ai</span></div>
    <div class="footer-stack-item"><span>🟢 DeepSeek</span><span class="footer-stack-val">platform.deepseek.com</span></div>
    <div class="footer-stack-item"><span>🟢 OpenRouter</span><span class="footer-stack-val">openrouter.ai</span></div>
    <div class="footer-stack-item"><span>🟢 SambaNova</span><span class="footer-stack-val">cloud.sambanova.ai</span></div>
    <div class="footer-stack-item"><span>🟢 Google</span><span class="footer-stack-val">aistudio.google.com</span></div>
  </div>

  <div class="footer-bottom">
    <span>AI FORGE · Obsidian Plugin</span>
    <span>ساخته شده با <strong>Claude Opus 5</strong></span>
    <span style="color:#333">// BACKEND POWERHOUSE</span>
  </div>
</footer>

<!-- ============================================================
     JAVASCRIPT
============================================================ -->
<script>
// ============================================================
// LOADER
// ============================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

// ============================================================
// CURSOR
// ============================================================
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor(){
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,select,input,textarea,[class*="card"],[class*="item"],[class*="btn"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width = '20px'; dot.style.height = '20px';
    ring.style.width = '60px'; ring.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width = '12px'; dot.style.height = '12px';
    ring.style.width = '36px'; ring.style.height = '36px';
  });
});

// ============================================================
// SCROLL PROGRESS + BACK TO TOP
// ============================================================
const scrollProg = document.getElementById('scroll-progress');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollProg.style.width = pct + '%';
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animCount(el, target, suffix='', duration=2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + suffix;
  }, 16);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(document.getElementById('cnt-providers'), 12, '+');
      animCount(document.getElementById('cnt-models'), 80, '+');
      animCount(document.getElementById('cnt-tokens'), 1, 'M+');
      counterObs.disconnect();
    }
  });
}, {threshold: 0.5});
counterObs.observe(document.getElementById('cnt-providers'));

// ============================================================
// HERO CHAT SIMULATION
// ============================================================
const heroResponses = {
  'Groq': [
    'در حال طراحی JWT Auth API...\n\n```typescript\n// POST /auth/login\nconst login = async (req, res) => {\n  const { email, password } = req.body;\n  const user = await User.findOne({email});\n  const token = jwt.sign({id: user.id}, SECRET);\n  res.json({ accessToken: token });\n}\n```',
    'روت‌های API آماده شد:\n• POST /auth/register\n• POST /auth/login\n• POST /auth/refresh\n• GET /auth/me ✅',
  ],
  'DeepSeek': [
    'بهترین طراحی برای JWT:\n\n```prisma\nmodel User {\n  id       String @id @default(cuid())\n  email    String @unique\n  password String\n  tokens   Token[]\n}\n```',
    'Prisma Schema + Migration فایل آماده است. همچنین rate limiting و brute-force protection اضافه شد. ✅',
  ],
  'Cerebras': [
    'با ۱M توکن/روز رایگان، کل سیستم Auth رو می‌سازیم:\n• JWT access token (15min)\n• Refresh token (7 days)\n• argon2 password hashing\n• Redis session store',
    'تمام فایل‌ها ذخیره شد در vault:\n📁 Projects/auth-system/\n  ├── routes.ts ✓\n  ├── middleware.ts ✓\n  └── schema.prisma ✓',
  ],
};

const providerEl = document.getElementById('hero-provider');
const modelEl = document.getElementById('hero-model');

const providerModels = {
  'Groq': ['llama-3.3-70b-versatile', 'llama-4-scout-17b', 'qwen-qwq-32b'],
  'DeepSeek': ['deepseek-chat (V3.2)', 'deepseek-reasoner (R1)'],
  'Cerebras': ['gpt-oss-120b', 'llama3.1-8b', 'GLM-4-32B'],
  'SambaNova': ['Llama-4-Maverick', 'DeepSeek-V3.1', 'Qwen3-235B'],
  'OpenRouter': ['auto', 'meta/llama-3.3-70b', 'qwen/qwen3-235b'],
};

providerEl.addEventListener('change', () => {
  const p = providerEl.value;
  const models = providerModels[p] || ['default-model'];
  modelEl.innerHTML = models.map(m => `<option>${m}</option>`).join('');
});

let heroMsgCount = 0;
function sendHeroMsg() {
  const input = document.getElementById('hero-input');
  const chat = document.getElementById('hero-chat');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const userDiv = document.createElement('div');
  userDiv.className = 'mock-msg user';
  userDiv.textContent = msg;
  chat.appendChild(userDiv);

  const aiDiv = document.createElement('div');
  aiDiv.className = 'mock-msg ai';
  aiDiv.innerHTML = '<span class="typing-cursor"></span>';
  chat.appendChild(aiDiv);
  chat.scrollTop = chat.scrollHeight;

  const provider = providerEl.value;
  const responses = heroResponses[provider] || heroResponses['Groq'];
  const resp = responses[heroMsgCount % responses.length];
  heroMsgCount++;

  let i = 0;
  const chars = resp.split('');
  aiDiv.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  aiDiv.appendChild(cursor);

  const typeInterval = setInterval(() => {
    if (i < chars.length) {
      aiDiv.insertBefore(document.createTextNode(chars[i]), cursor);
      i++;
      chat.scrollTop = chat.scrollHeight;
    } else {
      cursor.remove();
      clearInterval(typeInterval);
    }
  }, 18);
}

document.getElementById('hero-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendHeroMsg();
});

// Auto demo chat in hero
setTimeout(() => {
  const aiDiv = document.querySelector('.mock-chat .ai');
  if (!aiDiv) return;
  const resp = '```typescript\n// JWT Auth Service\nexport const generateToken = (userId: string) => {\n  return jwt.sign(\n    { id: userId },\n    process.env.JWT_SECRET!,\n    { expiresIn: "15m" }\n  );\n};\n```\n✅ Prisma schema + middleware آماده است';
  let i = 0;
  aiDiv.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  aiDiv.appendChild(cursor);
  const t = setInterval(() => {
    if (i < resp.length) {
      aiDiv.insertBefore(document.createTextNode(resp[i++]), cursor);
    } else {
      cursor.remove();
      clearInterval(t);
    }
  }, 25);
}, 2500);

// ============================================================
// FAILOVER SIMULATION
// ============================================================
let foState = 0;
const foSteps = ['fo-0','fo-1','fo-2','fo-3'];
const foLogs = [
  ['<span class="log-info">[INFO]</span> درخواست ارسال شد → DeepSeek V3.2', 0],
  ['<span class="log-info">[INFO]</span> status: 200 OK — توکن‌های مصرفی: 2,841', 300],
];

function addLog(html, delay=0) {
  setTimeout(() => {
    const log = document.getElementById('fo-log');
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = html;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }, delay);
}

function setFoActive(idx) {
  foSteps.forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active','done','exhausted');
    if (i < idx) el.classList.add('done');
    else if (i === idx) el.classList.add('active');
  });
}

function simulateRateLimit() {
  resetFailover();
  const log = document.getElementById('fo-log');
  log.innerHTML = '';
  const current = foState;

  addLog('<span class="log-info">[INFO]</span> درخواست ارسال شد → DeepSeek V3.2', 0);
  addLog('<span class="log-info">[INFO]</span> وضعیت: پردازش...', 500);
  addLog('<span class="log-error">[ERROR]</span> HTTP 429: Rate limit exceeded — DeepSeek', 1200);
  addLog('<span class="log-warn">[WARN]</span> DeepSeek exhausted → switching to Groq...', 1600);

  setTimeout(() => {
    document.getElementById('fo-status-0').textContent = 'RATE LIMITED';
    document.getElementById('fo-status-0').className = 'fo-status-tag status-limit';
    document.getElementById('fo-bar-0').style.width = '100%';
    document.getElementById('fo-bar-0').classList.add('draining');
    setFoActive(1);
    document.getElementById('fo-status-1').textContent = 'ACTIVE';
    document.getElementById('fo-status-1').className = 'fo-status-tag status-active';
    document.getElementById('fo-bar-1').style.width = '40%';
  }, 1800);

  addLog('<span class="log-info">[INFO]</span> درخواست ارسال شد → Groq llama-3.3-70b', 2200);
  addLog('<span class="log-info">[INFO]</span> status: 200 OK — streaming started ⚡', 2800);
  addLog('<span class="log-info">[SUCCESS]</span> ✓ جواب دریافت شد — ۳,۴۱۲ توکن در ۱.۲s', 3500);
}

function simulateError() {
  resetFailover();
  const log = document.getElementById('fo-log');
  log.innerHTML = '';

  addLog('<span class="log-info">[INFO]</span> درخواست ارسال شد → DeepSeek V3.2', 0);
  addLog('<span class="log-error">[ERROR]</span> Connection timeout — سرور پاسخ نداد', 800);
  addLog('<span class="log-warn">[WARN]</span> DeepSeek failed → Groq...', 1200);

  setTimeout(() => {
    document.getElementById('fo-status-0').textContent = 'ERROR';
    document.getElementById('fo-status-0').className = 'fo-status-tag status-limit';
    setFoActive(1);
    document.getElementById('fo-status-1').textContent = 'ACTIVE';
    document.getElementById('fo-status-1').className = 'fo-status-tag status-active';
  }, 1300);

  addLog('<span class="log-info">[INFO]</span> درخواست ارسال شد → Groq', 1600);
  addLog('<span class="log-error">[ERROR]</span> HTTP 429: Groq هم rate limit خورد!', 2400);
  addLog('<span class="log-warn">[WARN]</span> Groq failed → Cerebras...', 2800);

  setTimeout(() => {
    document.getElementById('fo-status-1').textContent = 'RATE LIMITED';
    document.getElementById('fo-status-1').className = 'fo-status-tag status-limit';
    setFoActive(2);
    document.getElementById('fo-status-2').textContent = 'ACTIVE';
    document.getElementById('fo-status-2').className = 'fo-status-tag status-active';
  }, 3000);

  addLog('<span class="log-info">[INFO]</span> درخواست ارسال شد → Cerebras 120B', 3200);
  addLog('<span class="log-info">[SUCCESS]</span> ✓ Cerebras پاسخ داد! ۱M توکن/روز باقی دارد', 4000);
}

function resetFailover() {
  foSteps.forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active','done','exhausted');
    if (i === 0) el.classList.add('active');
  });
  document.getElementById('fo-status-0').textContent = 'ACTIVE';
  document.getElementById('fo-status-0').className = 'fo-status-tag status-active';
  document.getElementById('fo-status-1').textContent = 'STANDBY';
  document.getElementById('fo-status-1').className = 'fo-status-tag status-standby';
  document.getElementById('fo-status-2').textContent = 'STANDBY';
  document.getElementById('fo-status-2').className = 'fo-status-tag status-standby';
  document.getElementById('fo-status-3').textContent = 'FALLBACK';
  document.getElementById('fo-status-3').className = 'fo-status-tag status-fallback';
  document.getElementById('fo-bar-0').style.width = '70%';
  document.getElementById('fo-bar-0').classList.remove('draining');
  document.getElementById('fo-bar-1').style.width = '0%';
  document.getElementById('fo-bar-2').style.width = '0%';
  document.getElementById('fo-log').innerHTML = '<div style="color:#333">// لاگ سیستم — شبیه‌سازی را شروع کن</div>';
}

// ============================================================
// OBSIDIAN SIMULATION
// ============================================================
const simModels = {
  groq: { models: ['llama-3.3-70b-versatile', 'llama-4-scout-17b', 'qwen-qwq-32b'], free: 'FREE' },
  deepseek: { models: ['deepseek-chat (V3.2)', 'deepseek-reasoner (R1)'], free: 'FREE' },
  cerebras: { models: ['gpt-oss-120b', 'llama3.1-8b'], free: '1M/DAY' },
  sambanova: { models: ['Llama-4-Maverick', 'DeepSeek-V3.1', 'Qwen3-235B'], free: '$5 FREE' },
  openrouter: { models: ['auto (best free)', 'meta/llama-3.3-70b'], free: 'FREE' },
  gemini: { models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'], free: 'FREE' },
};

function updateSimModel() {
  const p = document.getElementById('sim-provider').value;
  const m = document.getElementById('sim-model');
  const b = document.getElementById('sim-free-badge');
  const data = simModels[p];
  m.innerHTML = data.models.map(x => `<option>${x}</option>`).join('');
  b.textContent = data.free;
}

const templates = {
  rest: {
    sysprompt: 'شما یک معمار REST API هستید. به ازای هر درخواست: OpenAPI spec، Prisma schema، route handlers، validation با Zod، و error handling کامل تولید کنید.',
    placeholder: 'مثلاً: API برای سیستم مدیریت محصولات e-commerce با inventory tracking',
  },
  db: {
    sysprompt: 'شما یک معمار دیتابیس هستید. طراحی schema با نرمال‌سازی درست، ایندکس‌های بهینه، و استراتژی cache انجام دهید.',
    placeholder: 'مثلاً: Schema برای پلتفرم social media با post، comment، like، follow',
  },
  auth: {
    sysprompt: 'شما متخصص authentication/authorization هستید. سیستم کامل JWT، OAuth2، RBAC و حفاظت در برابر حملات طراحی کنید.',
    placeholder: 'مثلاً: سیستم auth با Google OAuth، role-based permissions، و 2FA',
  },
  devops: {
    sysprompt: 'شما یک DevOps/SRE متخصص هستید. Dockerfile بهینه، docker-compose، CI/CD pipeline و monitoring کامل تولید کنید.',
    placeholder: 'مثلاً: Docker setup برای یک Node.js + PostgreSQL + Redis + Nginx',
  },
  test: {
    sysprompt: 'شما یک مهندس تست هستید. Unit test، integration test، API test و load test برای هر کدی که می‌بینید بنویسید.',
    placeholder: 'مثلاً: تست‌های جامع برای auth middleware با Jest و supertest',
  },
};

function setTemplate(t) {
  document.getElementById('sim-template').value = t;
  applyTemplate();
}

function applyTemplate() {
  const t = document.getElementById('sim-template').value;
  if (!t) return;
  const data = templates[t];
  document.getElementById('sim-sysprompt').value = data.sysprompt;
  document.getElementById('sim-input').placeholder = data.placeholder;

  const chat = document.getElementById('sim-chat');
  chat.innerHTML = `<div style="text-align:center;padding:12px;font-size:11px;color:var(--purple);border:1px solid #2a2a4a;background:#0a0a1a;font-family:var(--font-mono);">✓ Template بارگذاری شد — حالا بنویس!</div>`;
}

const aiSimResponses = {
  rest: (msg) => `✅ REST API طراحی شد:\n\n\`\`\`yaml\n# OpenAPI 3.1\npaths:\n  /api/v1/users:\n    get:\n      summary: لیست کاربران\n      security: [bearerAuth: []]\n    post:\n      summary: ایجاد کاربر\n\`\`\`\n\n\`\`\`typescript\n// routes/users.ts\nrouter.get('/', auth, async (req, res) => {\n  const users = await prisma.user.findMany({\n    where: { active: true },\n    select: { id, email, createdAt }\n  });\n  res.json({ data: users });\n});\n\`\`\`\n\n📁 فایل‌ها در vault ذخیره شد.`,
  db: (msg) => `✅ Database Schema طراحی شد:\n\n\`\`\`prisma\nmodel User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  posts     Post[]\n  createdAt DateTime @default(now())\n  @@index([email, createdAt])\n}\n\nmodel Post {\n  id       String @id @default(cuid())\n  userId   String\n  user     User   @relation(fields: [userId], references: [id])\n  @@index([userId])\n}\n\`\`\`\n\n🗃️ Migration فایل آماده است.`,
  auth: (msg) => `✅ Auth System کامل:\n\n\`\`\`typescript\n// middleware/auth.ts\nexport const auth = async (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET!);\n    req.user = decoded;\n    next();\n  } catch {\n    res.status(403).json({ error: 'Invalid token' });\n  }\n};\n\`\`\`\n\n🔐 JWT + Refresh Token + argon2 پیاده‌سازی شد.`,
  devops: (msg) => `✅ Docker Setup آماده:\n\n\`\`\`dockerfile\n# Multi-stage Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nFROM node:20-alpine AS runner\nCOPY --from=builder /app/node_modules ./\nEXPOSE 3000\nCMD ["node", "dist/main.js"]\n\`\`\`\n\n🐳 docker-compose + GitHub Actions CI/CD ذخیره شد.`,
  test: (msg) => `✅ تست‌های جامع:\n\n\`\`\`typescript\n// auth.test.ts\ndescribe('Auth API', () => {\n  it('should login with valid credentials', async () => {\n    const res = await request(app)\n      .post('/auth/login')\n      .send({ email: 'test@test.com', password: 'pass' });\n    expect(res.status).toBe(200);\n    expect(res.body).toHaveProperty('accessToken');\n  });\n});\n\`\`\`\n\n🧪 Unit + Integration + Load tests آماده شد.`,
};

function addSimMsg(html, cls, model='') {
  const chat = document.getElementById('sim-chat');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + cls;
  if (model) div.setAttribute('data-model', model);
  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function sendSimMsg() {
  const input = document.getElementById('sim-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const provider = document.getElementById('sim-provider').value;
  const model = document.getElementById('sim-model').value;
  const template = document.getElementById('sim-template').value || 'rest';
  const status = document.getElementById('sim-status');

  addSimMsg(msg, 'user');

  status.textContent = `▶ ${provider.toUpperCase()} PROCESSING...`;
  status.style.color = 'var(--yellow)';

  const aiDiv = addSimMsg('<span class="typing-cursor"></span>', 'ai', model);

  const resp = (aiSimResponses[template] || aiSimResponses.rest)(msg);
  let i = 0;
  const chars = resp.split('');
  aiDiv.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  aiDiv.appendChild(cursor);
  aiDiv.setAttribute('data-model', model);

  const t = setInterval(() => {
    if (i < chars.length) {
      const chunk = chars.slice(i, i+3).join('');
      aiDiv.insertBefore(document.createTextNode(chunk), cursor);
      i += 3;
      document.getElementById('sim-chat').scrollTop = 9999;
    } else {
      cursor.remove();
      clearInterval(t);
      status.textContent = `✓ DONE — ${model}`;
      status.style.color = 'var(--green)';
    }
  }, 20);
}

document.getElementById('sim-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendSimMsg();
});

// ============================================================
// USAGE BARS ANIMATION ON SCROLL
// ============================================================
const usageObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.usage-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = w, 200);
      });
      usageObs.disconnect();
    }
  });
}, {threshold: 0.3});
const usageSection = document.getElementById('dashboard');
if (usageSection) usageObs.observe(usageSection);

</script>
</body>
</html>