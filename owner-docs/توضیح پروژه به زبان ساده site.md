# fullKONK_> — توضیح پروژه به زبان ساده

یک ابزار AI هست که روی konkred.xyz زندگی می‌کنه. ورودیش یه ایده‌ست، خروجیش یه محصول کامل.

تفاوتش با همه ابزارهای مشابه اینه که نه فقط فرانت می‌سازه مثل v0 و AI Studio، نه فقط بکند مثل ابزارهای قدیمی — بلکه هر دو رو با هم، یکپارچه، بی‌باگ، و با طراحی cutting-edge تحویل می‌ده. سه مرحله داره: اول معماری کل سیستم رو طراحی می‌کنه، بعد فرانت و بکند رو موازی می‌سازه با بهترین مدل برای هر کدوم، آخر همه چیز رو یکپارچه می‌کنه و بررسی می‌کنه.

قدرتش از دو چیز میاد: اول دوازده پروایدر رایگان که با هوشمندی بین‌شون مسیریابی می‌کنه و وقتی یکی rate limit خورد خودکار می‌ره سراغ بعدی. دوم سیستم template های تخصصی که نقش system prompt های enterprise-level رو دارن و خروجی رو از کد معمولی به محصول واقعی ارتقا می‌دن.

حالا HTML:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>fullKONK_> — konkred.xyz</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --black:  #000000;
    --white:  #FFFFFF;
    --yellow: #FFE500;
    --red:    #FF2D00;
    --blue:   #0055FF;
    --green:  #00FF88;
    --purple: #9B00FF;
    --orange: #FF6B00;
    --cyan:   #00DDFF;
    --border: 3px solid #000;
    --border-thick: 5px solid #000;
    --shadow: 6px 6px 0px #000;
    --shadow-lg: 10px 10px 0px #000;
    --font-main: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-main); background: var(--white); color: var(--black); overflow-x: hidden; cursor: crosshair; }
  ::selection { background: var(--yellow); color: var(--black); }

  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: var(--white); border-left: 2px solid var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--black); }
  ::-webkit-scrollbar-thumb:hover { background: var(--yellow); }

  /* NOISE */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.35;
  }

  /* CURSOR */
  #cur-dot {
    position: fixed; width: 12px; height: 12px;
    background: var(--yellow); border: 2px solid var(--black); border-radius: 50%;
    pointer-events: none; z-index: 99999;
    transform: translate(-50%,-50%);
    transition: width .2s, height .2s, background .2s;
    mix-blend-mode: multiply;
  }
  #cur-ring {
    position: fixed; width: 36px; height: 36px;
    border: 2px solid var(--black); border-radius: 50%;
    pointer-events: none; z-index: 99998;
    transform: translate(-50%,-50%);
    transition: width .3s, height .3s;
  }

  /* LOADER */
  #loader {
    position: fixed; inset: 0; background: var(--black); z-index: 99997;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
    transition: opacity .6s, visibility .6s;
  }
  #loader.gone { opacity: 0; visibility: hidden; }
  .ld-logo { font-family: var(--font-mono); font-size: clamp(24px,5vw,52px); color: var(--yellow); letter-spacing: 6px; animation: blink .8s step-end infinite; }
  .ld-sub  { font-family: var(--font-mono); font-size: 11px; color: #444; letter-spacing: 4px; }
  .ld-bar-wrap { width: min(360px,80vw); height: 6px; border: 2px solid #333; overflow: hidden; }
  .ld-bar { height: 100%; background: var(--yellow); width: 0%; animation: ldBar 1.8s cubic-bezier(.4,0,.2,1) forwards; }
  @keyframes ldBar { to { width: 100%; } }
  @keyframes blink  { 50% { opacity: 0; } }

  /* SCROLL PROGRESS */
  #scroll-prog {
    position: fixed; top: 60px; left: 0; height: 3px;
    background: var(--yellow); z-index: 998; width: 0%; transition: width .1s;
  }

  /* BACK TO TOP */
  #btt {
    position: fixed; bottom: 28px; left: 28px;
    width: 48px; height: 48px; background: var(--black); border: var(--border);
    color: var(--white); font-size: 20px; font-family: var(--font-mono);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; opacity: 0; pointer-events: none; z-index: 200;
  }
  #btt.show { opacity: 1; pointer-events: all; }
  #btt:hover { background: var(--yellow); color: var(--black); transform: translate(-3px,-3px); box-shadow: var(--shadow); }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: var(--black); border-bottom: var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 60px;
  }
  .nav-logo {
    font-family: var(--font-mono); font-size: 18px; font-weight: 700;
    color: var(--yellow); letter-spacing: 3px; text-decoration: none;
    display: flex; align-items: center; gap: 10px;
  }
  .nav-logo-dot { width: 10px; height: 10px; background: var(--yellow); border-radius: 50%; animation: pulse-dot 1.5s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.9); opacity: .5; } }
  .nav-sub { font-size: 10px; color: #555; letter-spacing: 2px; }
  .nav-links { display: flex; list-style: none; }
  .nav-links a {
    display: block; padding: 0 18px; height: 60px; line-height: 60px;
    font-family: var(--font-mono); font-size: 11px; font-weight: 700;
    color: var(--white); text-decoration: none; letter-spacing: 2px; text-transform: uppercase;
    border-right: 1px solid #222; transition: background .15s, color .15s;
  }
  .nav-links a:hover { background: var(--yellow); color: var(--black); }

  /* HERO */
  .hero {
    min-height: 100vh; padding-top: 60px;
    background: var(--black);
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: var(--border-thick); overflow: hidden; position: relative;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 64px 64px; pointer-events: none;
  }
  .hero-left {
    padding: 64px 48px; display: flex; flex-direction: column;
    justify-content: center; gap: 28px;
    border-right: 1px solid #1a1a1a; position: relative; z-index: 1;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--yellow); color: var(--black);
    padding: 6px 16px; border: var(--border);
    font-family: var(--font-mono); font-size: 10px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase; width: fit-content;
    animation: sil .6s ease 1.8s both;
  }
  .hero-badge-dot { width: 7px; height: 7px; background: var(--black); border-radius: 50%; animation: pulse-dot 1.2s infinite; }
  .hero-title {
    font-size: clamp(44px, 6vw, 92px); font-weight: 700; line-height: .9;
    color: var(--white); letter-spacing: -3px;
    animation: sil .6s ease 2s both;
  }
  .hero-title .acc  { color: var(--yellow); }
  .hero-title .acc2 { color: var(--cyan); }
  .hero-title .sub  { display: block; font-family: var(--font-mono); font-size: clamp(11px,1.4vw,18px); letter-spacing: 5px; color: var(--green); margin-top: 14px; font-weight: 400; }
  .hero-desc { font-size: 17px; line-height: 1.75; color: #999; max-width: 460px; animation: sil .6s ease 2.2s both; }
  .hero-desc strong { color: var(--white); }
  .hero-cta { display: flex; gap: 14px; animation: sil .6s ease 2.4s both; }

  .btn {
    padding: 13px 30px; font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; text-decoration: none;
    border: var(--border); cursor: pointer; transition: all .15s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-y { background: var(--yellow); color: var(--black); border-color: var(--black); }
  .btn-y:hover { transform: translate(-3px,-3px); box-shadow: var(--shadow); }
  .btn-g { background: transparent; color: var(--white); border-color: #444; }
  .btn-g:hover { background: var(--white); color: var(--black); transform: translate(-3px,-3px); box-shadow: 6px 6px 0 var(--white); }

  .hero-right {
    position: relative; display: flex; align-items: center;
    justify-content: center; padding: 60px 32px; overflow: hidden;
  }

  /* HERO STATS */
  .hero-stats {
    position: absolute; bottom: 0; left: 0; right: 0;
    border-top: 1px solid #1a1a1a; display: grid; grid-template-columns: repeat(3,1fr);
  }
  .stat-item { padding: 22px 28px; border-right: 1px solid #1a1a1a; animation: sil .5s ease calc(2.6s + var(--i)*.1s) both; }
  .stat-item:last-child { border-right: none; }
  .stat-num { font-family: var(--font-mono); font-size: 30px; font-weight: 700; color: var(--yellow); display: block; }
  .stat-label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 2px; font-family: var(--font-mono); }

  /* MOCKUP WINDOW */
  .mock-window {
    width: 100%; max-width: 540px; background: #111;
    border: 2px solid #333; box-shadow: var(--shadow-lg);
    font-family: var(--font-mono); font-size: 12px;
    animation: sir .7s ease 2s both; position: relative; z-index: 2;
  }
  .win-bar { background: #1a1a1a; border-bottom: 1px solid #333; padding: 10px 14px; display: flex; align-items: center; gap: 7px; }
  .win-dot { width: 10px; height: 10px; border-radius: 50%; }
  .win-title { margin: 0 auto; color: #555; font-size: 10px; letter-spacing: 2px; }
  .mock-toolbar { background: #161616; border-bottom: 1px solid #2a2a2a; padding: 9px 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .mock-sel { background: #0d0d0d; border: 1px solid #333; color: var(--white); padding: 5px 9px; font-family: var(--font-mono); font-size: 10px; flex: 1; min-width: 90px; cursor: pointer; }
  .mock-badge-free { background: var(--green); color: var(--black); padding: 3px 8px; font-size: 9px; font-weight: 700; letter-spacing: 1px; white-space: nowrap; }
  .mock-mode-tabs { display: flex; border-bottom: 1px solid #2a2a2a; }
  .mock-tab { flex: 1; padding: 8px; text-align: center; font-size: 9px; color: #555; cursor: pointer; border-right: 1px solid #2a2a2a; transition: all .15s; letter-spacing: 1px; text-transform: uppercase; }
  .mock-tab:last-child { border-right: none; }
  .mock-tab.on { background: #1a1a1a; color: var(--yellow); }
  .mock-tab:hover:not(.on) { color: #999; background: #111; }
  .mock-sliders { padding: 10px 14px; background: #0d0d0d; border-bottom: 1px solid #1a1a1a; display: flex; flex-direction: column; gap: 7px; }
  .sl-row { display: flex; align-items: center; gap: 9px; }
  .sl-label { color: #555; font-size: 9px; width: 80px; flex-shrink: 0; }
  .mock-slider { flex: 1; -webkit-appearance: none; height: 2px; background: #2a2a2a; outline: none; cursor: pointer; }
  .mock-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: var(--yellow); border: 2px solid var(--black); cursor: pointer; transition: transform .15s; }
  .mock-slider::-webkit-slider-thumb:hover { transform: scale(1.4); }
  .sl-val { color: var(--yellow); font-size: 9px; width: 28px; text-align: right; }
  .mock-sysprompt { padding: 10px 14px; background: #080810; border-bottom: 1px solid #1a1a1a; }
  .sp-lbl { color: var(--purple); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
  .sp-lbl::before { content: '▶'; font-size: 7px; }
  .sp-text { color: #666; font-size: 10px; line-height: 1.55; border-right: 2px solid var(--purple); padding-right: 9px; }
  .mock-chat { padding: 14px; display: flex; flex-direction: column; gap: 10px; min-height: 160px; background: #070707; }
  .mock-msg { padding: 9px 13px; font-size: 10px; line-height: 1.6; max-width: 86%; animation: msgIn .35s ease both; }
  .mock-msg.user { background: #1a1a1a; border: 1px solid #2a2a2a; align-self: flex-end; color: var(--white); }
  .mock-msg.ai { background: #060f06; border: 1px solid #162416; align-self: flex-start; color: var(--green); position: relative; }
  .mock-msg.ai::before { content: attr(data-m); position: absolute; top: -8px; right: 8px; background: var(--green); color: var(--black); font-size: 7px; padding: 1px 5px; font-weight: 700; letter-spacing: 1px; }
  .mock-msg.frontend-out { background: #0a060f; border: 1px solid #1e1028; color: var(--purple); }
  .mock-msg.frontend-out::before { background: var(--purple); color: var(--white); }
  .typcur { display: inline-block; width: 5px; height: 11px; background: var(--green); margin-right: 1px; vertical-align: middle; animation: blink .7s step-end infinite; }
  .mock-input-row { background: #0d0d0d; border-top: 1px solid #1a1a1a; padding: 9px 14px; display: flex; gap: 7px; }
  .mock-input { flex: 1; background: #161616; border: 1px solid #2a2a2a; color: var(--white); padding: 7px 11px; font-family: var(--font-mono); font-size: 10px; outline: none; }
  .mock-send { background: var(--yellow); border: 1px solid var(--black); color: var(--black); padding: 7px 14px; font-family: var(--font-mono); font-size: 10px; font-weight: 700; cursor: pointer; transition: all .15s; letter-spacing: 1px; }
  .mock-send:hover { background: var(--white); transform: translate(-1px,-1px); box-shadow: 2px 2px 0 var(--black); }

  @keyframes sil { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
  @keyframes sir { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
  @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  /* MARQUEE */
  .marquee-wrap { overflow: hidden; background: var(--yellow); border-top: var(--border); border-bottom: var(--border); padding: 9px 0; }
  .marquee-track { display: flex; gap: 48px; animation: marquee 22s linear infinite; white-space: nowrap; }
  .m-item { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--black); flex-shrink: 0; display: flex; align-items: center; gap: 14px; }
  .m-item::before { content: '◆'; font-size: 7px; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* SECTION BASE */
  section { border-bottom: var(--border-thick); position: relative; overflow: hidden; }
  .sec-header { padding: 48px 64px 32px; display: flex; align-items: flex-start; gap: 28px; border-bottom: var(--border); }
  .sec-num { font-family: var(--font-mono); font-size: 72px; font-weight: 700; color: #f0f0f0; line-height: 1; flex-shrink: 0; letter-spacing: -4px; }
  .sec-meta { flex: 1; padding-top: 6px; }
  .sec-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #999; margin-bottom: 8px; }
  .sec-title { font-size: clamp(26px,3.5vw,44px); font-weight: 700; letter-spacing: -1px; line-height: 1.1; }
  .sec-body { padding: 56px 64px; }

  .reveal { opacity: 0; transform: translateY(36px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.vis { opacity: 1; transform: none; }

  /* ─── SECTION 1: PHILOSOPHY ─── */
  #philosophy { background: var(--black); }
  #philosophy .sec-num { color: #111; }
  #philosophy .sec-title { color: var(--white); }
  #philosophy .sec-label { color: #444; }
  #philosophy .sec-header { border-bottom-color: #1a1a1a; }

  .phil-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border: 2px solid #1a1a1a; }
  .phil-card { padding: 40px 32px; border-right: 1px solid #1a1a1a; position: relative; overflow: hidden; transition: background .25s; cursor: default; }
  .phil-card:last-child { border-right: none; }
  .phil-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--pc, var(--yellow)); transform: scaleX(0); transition: transform .35s ease; transform-origin: left; }
  .phil-card:hover::after { transform: scaleX(1); }
  .phil-card:hover { background: #0d0d0d; }
  .phil-num { font-family: var(--font-mono); font-size: 56px; font-weight: 700; color: #1a1a1a; line-height: 1; margin-bottom: 20px; transition: color .25s; }
  .phil-card:hover .phil-num { color: var(--pc, var(--yellow)); }
  .phil-icon { font-size: 32px; margin-bottom: 16px; display: block; }
  .phil-title { font-family: var(--font-mono); font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--white); margin-bottom: 12px; }
  .phil-desc { font-size: 13px; color: #666; line-height: 1.7; }
  .phil-desc strong { color: var(--pc, var(--yellow)); }

  /* ─── SECTION 2: FULLSTACK POWER ─── */
  #fullstack { background: var(--white); }

  .fs-grid { display: grid; grid-template-columns: 1fr auto 1fr; border: var(--border-thick); }
  .fs-col { padding: 40px; }
  .fs-col.left { background: #fff8f8; }
  .fs-col.right { background: #f0fff8; }
  .fs-mid { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; border-left: var(--border); border-right: var(--border); background: var(--black); color: var(--white); }
  .fs-mid-icon { font-size: 32px; margin-bottom: 16px; }
  .fs-mid-text { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; color: var(--yellow); writing-mode: vertical-rl; text-transform: uppercase; }
  .fs-col-title { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; padding: 8px 14px; margin-bottom: 24px; display: inline-block; }
  .fs-col.left .fs-col-title { background: var(--blue); color: var(--white); }
  .fs-col.right .fs-col-title { background: var(--green); color: var(--black); }
  .fs-item { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 14px; padding: 11px 14px; border: 2px solid transparent; transition: all .2s; cursor: default; }
  .fs-item:hover { border-color: var(--black); transform: translateX(-3px); }
  .fs-item-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .fs-item-text strong { font-weight: 700; display: block; font-size: 14px; margin-bottom: 2px; }
  .fs-item-text span { color: #666; font-size: 12px; line-height: 1.5; }

  /* ─── SECTION 3: HOW IT WORKS ─── */
  #howitworks { background: #f8f8f4; }

  .pipeline { display: grid; grid-template-columns: 1fr; gap: 0; border: var(--border-thick); }
  .pipeline-step { display: grid; grid-template-columns: 100px 1fr auto; align-items: stretch; border-bottom: var(--border); cursor: default; transition: background .2s; overflow: hidden; }
  .pipeline-step:last-child { border-bottom: none; }
  .pipeline-step:hover { background: var(--white); }
  .ps-num { display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 32px; font-weight: 700; border-right: var(--border); background: var(--ps-bg, #f5f5f5); color: var(--ps-col, var(--black)); transition: all .2s; flex-shrink: 0; min-height: 100px; }
  .pipeline-step:hover .ps-num { background: var(--black); color: var(--yellow); }
  .ps-body { padding: 28px 36px; }
  .ps-tag { font-family: var(--font-mono); font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--ps-col, #999); margin-bottom: 8px; font-weight: 700; }
  .ps-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; letter-spacing: -.3px; }
  .ps-desc { font-size: 13px; color: #555; line-height: 1.65; }
  .ps-nodes { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .ps-node { padding: 4px 12px; border: 2px solid var(--black); font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 1px; transition: all .15s; }
  .ps-node:hover { background: var(--black); color: var(--white); transform: translate(-2px,-2px); box-shadow: var(--shadow); }
  .ps-model { padding: 28px 24px; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 8px; border-left: var(--border); min-width: 160px; }
  .ps-model-badge { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 1px; padding: 4px 10px; background: var(--ps-col, var(--black)); color: var(--ps-bg, var(--white)); white-space: nowrap; }
  .ps-model-sub { font-family: var(--font-mono); font-size: 9px; color: #aaa; text-align: right; }

  /* ─── SECTION 4: PROVIDERS ─── */
  #providers { background: var(--black); }
  #providers .sec-num { color: #111; }
  #providers .sec-title { color: var(--white); }
  #providers .sec-label { color: #444; }
  #providers .sec-header { border-bottom-color: #1a1a1a; }

  .prov-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 0; border: 2px solid #1a1a1a; }
  .prov-card { padding: 28px; border: 1px solid #111; cursor: pointer; transition: all .2s; position: relative; overflow: hidden; }
  .prov-card::before { content: ''; position: absolute; inset: 0; background: var(--pa, var(--yellow)); transform: translateY(100%); transition: transform .3s cubic-bezier(.4,0,.2,1); z-index: 0; }
  .prov-card:hover::before { transform: translateY(0); }
  .prov-card > * { position: relative; z-index: 1; }
  .prov-card:hover .prov-name, .prov-card:hover .prov-desc, .prov-card:hover .prov-models { color: var(--black) !important; }
  .prov-card:hover .prov-tag { background: rgba(0,0,0,.12); color: var(--black); border-color: transparent; }
  .prov-card:hover .prov-icon { border-color: var(--black); background: rgba(0,0,0,.1); }
  .prov-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .prov-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 2px solid #2a2a2a; background: #111; transition: all .2s; flex-shrink: 0; }
  .prov-free-badge { font-family: var(--font-mono); font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 3px 7px; background: var(--green); color: var(--black); }
  .prov-name { font-family: var(--font-mono); font-size: 16px; font-weight: 700; margin-bottom: 5px; color: var(--white); transition: color .2s; }
  .prov-desc { font-size: 11px; color: #666; line-height: 1.5; margin-bottom: 12px; transition: color .2s; }
  .prov-models { font-family: var(--font-mono); font-size: 9px; color: #444; margin-bottom: 10px; transition: color .2s; }
  .prov-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .prov-tag { font-family: var(--font-mono); font-size: 8px; padding: 3px 7px; border: 1px solid #2a2a2a; color: #555; letter-spacing: 1px; text-transform: uppercase; transition: all .2s; }
  .prov-speed { margin-top: 10px; height: 2px; background: #1a1a1a; overflow: hidden; }
  .prov-speed-bar { height: 100%; background: var(--green); width: 0%; transition: width 1.2s ease; }

  /* OPENAI COMPAT BOX */
  .compat-box { margin-top: 40px; padding: 28px 32px; background: #080808; border: 2px solid #1a1a1a; color: var(--white); }
  .compat-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 3px; color: var(--yellow); margin-bottom: 14px; text-transform: uppercase; }
  .compat-text { font-size: 15px; line-height: 1.75; color: #bbb; margin-bottom: 18px; }
  .compat-code { font-family: var(--font-mono); font-size: 11px; color: #555; background: #050505; padding: 18px; border-right: 3px solid var(--yellow); line-height: 2; }
  .code-green { color: var(--green); }
  .code-blue  { color: #7aa2f7; }
  .code-yellow{ color: var(--yellow); }
  .code-comment{color: #333; }

  /* ─── SECTION 5: TEMPLATES ─── */
  #templates { background: var(--white); }

  .tpl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: var(--border-thick); }
  .tpl-card { padding: 44px; border: 1px solid #e8e8e8; position: relative; cursor: pointer; transition: all .2s; overflow: hidden; }
  .tpl-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: var(--tc, var(--black)); transform: scaleX(0); transition: transform .3s ease; transform-origin: right; }
  .tpl-card:hover::before { transform: scaleX(1); }
  .tpl-card:hover { background: #fafafa; transform: translate(-2px,-2px); box-shadow: var(--shadow); z-index: 1; }
  .tpl-icon-wrap { width: 52px; height: 52px; border: var(--border); display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; background: var(--tib,#fff); transition: all .2s; }
  .tpl-card:hover .tpl-icon-wrap { background: var(--tc,var(--black)); color: var(--white); transform: rotate(6deg); }
  .tpl-tag { font-family: var(--font-mono); font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--tc,#999); margin-bottom: 10px; font-weight: 700; }
  .tpl-title { font-size: 20px; font-weight: 700; letter-spacing: -.3px; margin-bottom: 10px; line-height: 1.2; }
  .tpl-desc { font-size: 13px; color: #555; line-height: 1.7; margin-bottom: 18px; }
  .tpl-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .tpl-list li { font-size: 12px; color: #333; display: flex; align-items: center; gap: 8px; padding: 5px 9px; border-right: 3px solid var(--tc,var(--black)); background: #f5f5f5; transition: all .15s; }
  .tpl-list li:hover { background: var(--tc,var(--black)); color: var(--white); transform: translateX(-3px); }
  .tpl-list li::before { content: '→'; font-family: var(--font-mono); font-size: 10px; flex-shrink: 0; }

  /* ─── SECTION 6: FAILOVER ─── */
  #failover { background: var(--black); }
  #failover .sec-num { color: #0d0d0d; }
  #failover .sec-title { color: var(--white); }
  #failover .sec-label { color: #333; }
  #failover .sec-header { border-bottom-color: #111; }

  .fo-track { border: 1px solid #1a1a1a; }
  .fo-step { display: grid; grid-template-columns: 76px 1fr auto; align-items: center; border-bottom: 1px solid #0d0d0d; opacity: .4; transition: all .4s; cursor: pointer; }
  .fo-step:last-child { border-bottom: none; }
  .fo-step.active { opacity: 1; background: #080808; }
  .fo-step.done { opacity: .2; }
  .fo-step.blown { opacity: 1; background: #130000; }
  .fo-snum { width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 24px; font-weight: 700; border-right: 1px solid #111; flex-shrink: 0; transition: all .3s; }
  .fo-step.active .fo-snum { background: var(--green); color: var(--black); }
  .fo-step.blown  .fo-snum { background: var(--red); color: var(--white); }
  .fo-info { padding: 18px 24px; }
  .fo-name { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 3px; }
  .fo-sub  { font-size: 11px; color: #444; }
  .fo-step.active .fo-sub { color: #777; }
  .fo-status { padding: 18px 24px; text-align: right; min-width: 130px; }
  .fo-stag { display: inline-block; padding: 4px 11px; font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
  .st-active   { background: var(--green); color: var(--black); }
  .st-standby  { background: #111; color: #444; border: 1px solid #222; }
  .st-limit    { background: var(--red); color: var(--white); }
  .st-fallback { background: var(--yellow); color: var(--black); }
  .fo-pbar { height: 3px; background: #080808; overflow: hidden; }
  .fo-pfill { height: 100%; background: var(--green); width: 0%; transition: width 2.5s linear; }
  .fo-pfill.drain { background: var(--red); }
  .fo-log { background: #030303; border: 1px solid #111; border-top: none; padding: 18px 24px; font-family: var(--font-mono); font-size: 10px; color: var(--green); line-height: 2.2; min-height: 130px; }
  .log-line { opacity: 0; animation: logIn .3s ease forwards; }
  .log-err { color: var(--red); }
  .log-warn{ color: var(--yellow); }
  .log-info{ color: var(--cyan); }
  @keyframes logIn { to { opacity: 1; } }
  .fo-ctrl { display: flex; border: 1px solid #111; border-top: none; }
  .fo-btn { flex: 1; padding: 15px; background: #0d0d0d; border: none; border-right: 1px solid #111; color: var(--white); font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all .15s; }
  .fo-btn:last-child { border-right: none; }
  .fo-btn:hover { background: var(--yellow); color: var(--black); }

  /* ─── SECTION 7: SIMULATION ─── */
  #simulation { background: #0f0f1a; }
  #simulation .sec-num { color: #141420; }
  #simulation .sec-title { color: var(--white); }
  #simulation .sec-label { color: #333; }
  #simulation .sec-header { border-bottom-color: #1a1a2a; }

  .obs-wrap {
    border: var(--border); border-color: #2a2a3a;
    display: grid; grid-template-columns: 240px 1fr;
    grid-template-rows: 46px 1fr; height: 620px;
    font-family: var(--font-mono); font-size: 12px;
    box-shadow: var(--shadow-lg); background: #13131f;
  }
  .obs-titlebar { grid-column: 1/-1; background: #0d0d18; border-bottom: 1px solid #2a2a3a; display: flex; align-items: center; padding: 0 14px; gap: 7px; }
  .obs-dot { width: 10px; height: 10px; border-radius: 50%; }
  .obs-titlebar-label { margin: 0 auto; font-size: 10px; color: #333; letter-spacing: 2px; }
  .obs-sidebar { background: #0d0d18; border-right: 1px solid #1a1a2a; overflow-y: auto; padding: 6px 0; }
  .obs-sec-lbl { padding: 14px 14px 5px; font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: #333; }
  .obs-item { padding: 7px 14px; color: #666; font-size: 10px; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: all .15s; border-right: 3px solid transparent; }
  .obs-item:hover { background: #13131f; color: var(--white); }
  .obs-item.on { background: #13131f; color: var(--white); border-right-color: var(--purple); }
  .obs-item-ic { font-size: 13px; }
  .obs-main { overflow: hidden; display: flex; flex-direction: column; }
  .obs-tabbar { background: #0d0d18; border-bottom: 1px solid #1a1a2a; display: flex; align-items: center; padding: 0 10px; height: 34px; overflow-x: auto; }
  .obs-tab { padding: 0 14px; height: 34px; line-height: 34px; font-size: 10px; color: #555; cursor: pointer; white-space: nowrap; border-right: 1px solid #1a1a2a; transition: all .15s; }
  .obs-tab.on { background: #13131f; color: var(--white); }
  .obs-plugin { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #13131f; }
  .plugin-hdr { background: #1a1a28; border-bottom: 1px solid #2a2a3a; padding: 9px 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .plugin-sel { background: #13131f; border: 1px solid #2a2a3a; color: var(--white); padding: 5px 9px; font-family: var(--font-mono); font-size: 10px; cursor: pointer; }
  .plugin-sel option { background: #13131f; }
  .plugin-mode-pill { padding: 4px 10px; font-family: var(--font-mono); font-size: 9px; font-weight: 700; letter-spacing: 1px; background: var(--purple); color: var(--white); }
  .plugin-status { font-size: 10px; color: #333; margin-right: auto; letter-spacing: 1px; }
  .plugin-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .plugin-sysp { background: #0d0d18; border-bottom: 1px solid #1a1a2a; padding: 9px 14px; }
  .plugin-sysp-lbl { font-size: 8px; color: var(--purple); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .plugin-sysp-ta { width: 100%; background: transparent; border: none; outline: none; color: #777; font-family: var(--font-mono); font-size: 9px; line-height: 1.6; resize: none; height: 38px; }
  .plugin-chat { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .pchat-msg { padding: 9px 13px; font-size: 10px; line-height: 1.6; max-width: 82%; animation: msgIn .3s ease; }
  .pchat-msg.user { background: #1a1a28; color: var(--white); align-self: flex-end; border: 1px solid #2a2a3a; }
  .pchat-msg.ai { background: #060f06; color: var(--green); align-self: flex-start; border: 1px solid #122012; position: relative; }
  .pchat-msg.ai::before { content: attr(data-model); position: absolute; top: -8px; right: 8px; background: var(--green); color: var(--black); font-size: 7px; padding: 1px 5px; font-weight: 700; letter-spacing: 1px; }
  .pchat-msg.fe { background: #0a0615; color: var(--purple); align-self: flex-start; border: 1px solid #1a0a2a; }
  .pchat-msg.fe::before { background: var(--purple); color: var(--white); }
  .plugin-input-bar { background: #1a1a28; border-top: 1px solid #2a2a3a; padding: 9px 14px; display: flex; gap: 7px; }
  .plugin-inp { flex: 1; background: #13131f; border: 1px solid #2a2a3a; color: var(--white); padding: 7px 11px; font-family: var(--font-mono); font-size: 10px; outline: none; }
  .plugin-send { background: var(--purple); border: none; color: var(--white); padding: 7px 14px; font-family: var(--font-mono); font-size: 10px; font-weight: 700; cursor: pointer; letter-spacing: 1px; transition: all .15s; }
  .plugin-send:hover { background: var(--blue); }

  /* ─── SECTION 8: COMPARE ─── */
  #compare { background: var(--white); }

  .cmp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .cmp-table th { background: var(--black); color: var(--white); padding: 14px 18px; text-align: right; font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; border: var(--border); }
  .cmp-table th.hl { background: var(--yellow); color: var(--black); }
  .cmp-table td { padding: 12px 18px; border: 1px solid #e0e0e0; transition: background .15s; vertical-align: middle; }
  .cmp-table tr:hover td { background: #f8f8f8; }
  .cmp-table td.hl { background: #fff9cc; border-color: var(--yellow); border-width: 2px; }
  .cmp-table tr:hover td.hl { background: #fff3a0; }
  .ck { color: var(--green); font-size: 15px; font-weight: 700; }
  .cx { color: var(--red); font-size: 15px; }
  .cp { color: var(--orange); font-size: 13px; }

  /* ─── SECTION 9: USAGE DASHBOARD ─── */
  #dashboard { background: #f8f8f4; }

  .usage-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 0; border: var(--border-thick); }
  .uc { padding: 26px; border: 1px solid #ddd; transition: all .2s; cursor: default; }
  .uc:hover { background: var(--white); transform: translate(-2px,-2px); box-shadow: var(--shadow); position: relative; z-index: 1; }
  .uc-prov { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
  .ud { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .ud-g { background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse-dot 1.5s infinite; }
  .ud-y { background: var(--yellow); }
  .ud-r { background: var(--red); box-shadow: 0 0 6px var(--red); animation: pulse-dot .8s infinite; }
  .uc-nums { display: flex; justify-content: space-between; margin-bottom: 6px; font-family: var(--font-mono); font-size: 9px; color: #999; }
  .uc-val { font-size: 10px; font-weight: 700; color: var(--black); }
  .uc-bar-bg { height: 6px; background: #e0e0e0; overflow: hidden; margin-bottom: 10px; }
  .uc-bar-fill { height: 100%; transition: width 1.6s cubic-bezier(.4,0,.2,1); width: 0%; }
  .uc-reset { font-family: var(--font-mono); font-size: 8px; color: #aaa; letter-spacing: 1px; }
  .uc-reset span { color: var(--black); font-weight: 700; }

  /* ─── SECTION 10: ROADMAP ─── */
  #roadmap { background: var(--white); }

  .timeline { border: var(--border-thick); }
  .tl-phase { display: grid; grid-template-columns: 180px 1fr; border-bottom: var(--border); transition: all .2s; cursor: pointer; overflow: hidden; }
  .tl-phase:last-child { border-bottom: none; }
  .tl-left { padding: 36px 28px; border-right: var(--border); display: flex; flex-direction: column; gap: 10px; transition: background .2s; }
  .tl-phase:hover .tl-left { background: var(--black); }
  .tl-num { font-family: var(--font-mono); font-size: 36px; font-weight: 700; letter-spacing: -2px; transition: color .2s; }
  .tl-phase:hover .tl-num { color: var(--yellow); }
  .tl-week { font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #999; transition: color .2s; }
  .tl-phase:hover .tl-week { color: #555; }
  .tl-status { display: inline-block; padding: 3px 9px; font-family: var(--font-mono); font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; width: fit-content; }
  .tl-right { padding: 36px 44px; transition: background .2s; }
  .tl-phase:hover .tl-right { background: #fafafa; }
  .tl-title { font-size: 20px; font-weight: 700; letter-spacing: -.3px; margin-bottom: 10px; }
  .tl-tasks { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .tl-tasks li { font-size: 12px; color: #444; display: flex; align-items: center; gap: 7px; padding: 7px 11px; background: #f5f5f5; border-right: 3px solid transparent; transition: all .15s; }
  .tl-tasks li:hover { border-right-color: var(--black); background: var(--black); color: var(--white); transform: translateX(-2px); }
  .tl-tasks li::before { content: '▸'; font-size: 9px; flex-shrink: 0; }

  /* ─── FOOTER ─── */
  footer { background: var(--black); color: var(--white); padding: 56px 64px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 44px; border-top: var(--border-thick); }
  .ft-logo { font-family: var(--font-mono); font-size: 28px; font-weight: 700; color: var(--yellow); letter-spacing: -1px; margin-bottom: 14px; display: block; }
  .ft-desc { font-size: 13px; color: #555; line-height: 1.7; max-width: 260px; }
  .ft-stack-title { font-family: var(--font-mono); font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #333; padding-bottom: 14px; border-bottom: 1px solid #111; margin-bottom: 6px; }
  .ft-stack-item { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid #080808; font-size: 12px; }
  .ft-stack-item:hover { color: var(--yellow); cursor: default; }
  .ft-stack-val { font-family: var(--font-mono); font-size: 9px; color: #333; }
  .ft-bottom { grid-column: 1/-1; border-top: 1px solid #111; padding-top: 28px; display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; color: #333; letter-spacing: 2px; }
  .ft-bottom strong { color: var(--white); }

  /* RESPONSIVE */
  @media(max-width:900px){
    .hero { grid-template-columns: 1fr; }
    .hero-right { display: none; }
    .hero-stats { position: static; }
    .fs-grid { grid-template-columns: 1fr; }
    .fs-mid { display: none; }
    .phil-grid { grid-template-columns: 1fr; }
    .tpl-grid { grid-template-columns: 1fr; }
    .tl-phase { grid-template-columns: 1fr; }
    .tl-left { border-right: none; border-bottom: var(--border); }
    footer { grid-template-columns: 1fr; }
    .obs-wrap { grid-template-columns: 1fr; height: auto; }
    .obs-sidebar { display: none; }
    .sec-header { padding: 32px; }
    .sec-body { padding: 32px; }
    nav { padding: 0 16px; }
    .nav-links { display: none; }
    .pipeline-step { grid-template-columns: 76px 1fr; }
    .ps-model { display: none; }
    .cmp-table { font-size: 11px; }
  }
</style>
</head>
<body>

<div id="cur-dot"></div>
<div id="cur-ring"></div>
<div id="scroll-prog"></div>
<div id="btt">↑</div>

<!-- LOADER -->
<div id="loader">
  <div class="ld-logo">fullKONK_&gt;</div>
  <div class="ld-bar-wrap"><div class="ld-bar"></div></div>
  <div class="ld-sub">LOADING · KONKRED.XYZ</div>
</div>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo">
    <div class="nav-logo-dot"></div>
    fullKONK_&gt;
    <span class="nav-sub">konkred.xyz</span>
  </a>
  <ul class="nav-links">
    <li><a href="#philosophy">فلسفه</a></li>
    <li><a href="#fullstack">Full-Stack</a></li>
    <li><a href="#howitworks">نحوه کار</a></li>
    <li><a href="#providers">پروایدرها</a></li>
    <li><a href="#templates">Templates</a></li>
    <li><a href="#failover">Failover</a></li>
    <li><a href="#simulation">دمو</a></li>
  </ul>
</nav>

<!-- ═══════════════════════════════════════════
     HERO
═══════════════════════════════════════════ -->
<section class="hero" id="home">
  <div class="hero-left">
    <div class="hero-badge"><div class="hero-badge-dot"></div>konkred.xyz · Public Beta</div>
    <h1 class="hero-title">
      full<span class="acc">KONK</span><span class="acc2">_&gt;</span>
      <span class="sub">// FULL-STACK AI PRODUCT BUILDER</span>
    </h1>
    <p class="hero-desc">
      ایده‌ات رو بگو. یه <strong>محصول کامل</strong> تحویل بگیر — فرانت <strong>زیبا و cutting-edge</strong> + بکند <strong>محکم و بی‌باگ</strong>، یکپارچه، آماده دیپلوی.
    </p>
    <div class="hero-cta">
      <a href="#simulation" class="btn btn-y">▶ دمو زنده</a>
      <a href="#howitworks" class="btn btn-g">چطور کار می‌کنه؟</a>
    </div>
  </div>

  <div class="hero-right">
    <div class="mock-window">
      <div class="win-bar">
        <div class="win-dot" style="background:var(--red)"></div>
        <div class="win-dot" style="background:var(--yellow)"></div>
        <div class="win-dot" style="background:var(--green)"></div>
        <div class="win-title">fullKONK_&gt; · konkred.xyz</div>
      </div>
      <div class="mock-toolbar">
        <select class="mock-sel" id="h-prov" onchange="heroProvChange()">
          <option>DeepSeek V3.2</option>
          <option>Groq · Llama-4</option>
          <option>Cerebras · 120B</option>
          <option>Gemini 2.5 Flash</option>
          <option>OpenRouter · Auto</option>
        </select>
        <select class="mock-sel" id="h-mode">
          <option>🏗️ Full-Stack Build</option>
          <option>🎨 Frontend Only</option>
          <option>⚙️ Backend Only</option>
          <option>🔍 Code Review</option>
        </select>
        <span class="mock-badge-free">FREE</span>
      </div>
      <div class="mock-mode-tabs">
        <div class="mock-tab on" onclick="setHeroTab(this,'ARCHITECT')">ARCHITECT</div>
        <div class="mock-tab" onclick="setHeroTab(this,'BUILD')">BUILD</div>
        <div class="mock-tab" onclick="setHeroTab(this,'REVIEW')">REVIEW</div>
      </div>
      <div class="mock-sliders">
        <div class="sl-row"><span class="sl-label">Temperature</span><input type="range" class="mock-slider" min="0" max="100" value="65" oninput="this.nextElementSibling.textContent=(this.value/100).toFixed(2)"><span class="sl-val">0.65</span></div>
        <div class="sl-row"><span class="sl-label">Max Tokens</span><input type="range" class="mock-slider" min="10" max="100" value="75" oninput="this.nextElementSibling.textContent=Math.round(this.value*163.84)+'K'"><span class="sl-val">12K</span></div>
        <div class="sl-row"><span class="sl-label">Top-P</span><input type="range" class="mock-slider" min="0" max="100" value="92" oninput="this.nextElementSibling.textContent=(this.value/100).toFixed(2)"><span class="sl-val">0.92</span></div>
      </div>
      <div class="mock-sysprompt">
        <div class="sp-lbl">System Prompt</div>
        <div class="sp-text" id="h-sysp">شما یک Product Architect هستید. فرانت cutting-edge + بکند production-ready یکپارچه تولید کنید...</div>
      </div>
      <div class="mock-chat" id="h-chat">
        <div class="mock-msg user">یه SaaS dashboard برای invoice management بساز</div>
        <div class="mock-msg ai" data-m="DEEPSEEK"><span class="typcur"></span></div>
      </div>
      <div class="mock-input-row">
        <input class="mock-input" id="h-input" type="text" placeholder="ایده‌ات رو بنویس..." onkeydown="if(event.key==='Enter')heroSend()">
        <button class="mock-send" onclick="heroSend()">BUILD →</button>
      </div>
    </div>
  </div>

  <div class="hero-stats">
    <div class="stat-item" style="--i:0"><span class="stat-num" id="cnt1">0</span><span class="stat-label">پروایدر رایگان</span></div>
    <div class="stat-item" style="--i:1"><span class="stat-num" id="cnt2">0</span><span class="stat-label">مدل قابل دسترس</span></div>
    <div class="stat-item" style="--i:2"><span class="stat-num" id="cnt3">0</span><span class="stat-label">خط کد / تولید</span></div>
  </div>
</section>

<!-- MARQUEE -->
<div class="marquee-wrap">
  <div class="marquee-track">
    <span class="m-item">Full-Stack Build</span><span class="m-item">DeepSeek V3.2</span><span class="m-item">Groq LPU 500tok/s</span><span class="m-item">Cerebras 1M/day</span><span class="m-item">Gemini 2.5 Flash</span><span class="m-item">SambaNova Qwen3</span><span class="m-item">OpenRouter Gateway</span><span class="m-item">Auto Failover</span><span class="m-item">Smart Router</span><span class="m-item">Cutting-Edge UI</span><span class="m-item">Production Backend</span><span class="m-item">Zero Bugs</span>
    <span class="m-item">Full-Stack Build</span><span class="m-item">DeepSeek V3.2</span><span class="m-item">Groq LPU 500tok/s</span><span class="m-item">Cerebras 1M/day</span><span class="m-item">Gemini 2.5 Flash</span><span class="m-item">SambaNova Qwen3</span><span class="m-item">OpenRouter Gateway</span><span class="m-item">Auto Failover</span><span class="m-item">Smart Router</span><span class="m-item">Cutting-Edge UI</span><span class="m-item">Production Backend</span><span class="m-item">Zero Bugs</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     SECTION 1: PHILOSOPHY
═══════════════════════════════════════════ -->
<section id="philosophy">
  <div class="sec-header reveal">
    <div class="sec-num" style="color:#111">01</div>
    <div class="sec-meta">
      <div class="sec-label" style="color:#444">// فلسفه</div>
      <h2 class="sec-title" style="color:var(--white)">نه فقط فرانت.<br><span style="color:var(--yellow)">نه فقط بکند.</span><br><span style="color:var(--cyan)">محصول کامل.</span></h2>
    </div>
  </div>
  <div class="sec-body">
    <div class="phil-grid reveal">
      <div class="phil-card" style="--pc:var(--yellow)">
        <div class="phil-num">01</div>
        <span class="phil-icon">🎨</span>
        <div class="phil-title">Frontend — زیبا و Cutting-Edge</div>
        <div class="phil-desc">UI ای که کاربر <strong>عاشقش بشه</strong>. طراحی مدرن، انیمیشن‌های روان، responsive کامل. با Next.js، Tailwind، shadcn، Framer Motion.</div>
      </div>
      <div class="phil-card" style="--pc:var(--green)">
        <div class="phil-num">02</div>
        <span class="phil-icon">⚙️</span>
        <div class="phil-title">Backend — محکم و بی‌باگ</div>
        <div class="phil-desc">API هایی که <strong>شکست نخورن</strong>. Type-safe، validated، error-handled. Prisma + Zod + Middleware کامل.</div>
      </div>
      <div class="phil-card" style="--pc:var(--cyan)">
        <div class="phil-num">03</div>
        <span class="phil-icon">🔗</span>
        <div class="phil-title">یکپارچه — آماده Deploy</div>
        <div class="phil-desc">فرانت و بکند با هم <strong>کار می‌کنن</strong>. Type consistency، API contract، Auth flow — همه align شده‌ان.</div>
      </div>
    </div>

    <div style="margin-top:40px;padding:32px;background:#111;border:2px solid #1a1a1a;color:var(--white);" class="reveal">
      <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:var(--yellow);margin-bottom:16px;text-transform:uppercase;">// تفاوت اصلی با رقبا</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;">
        <div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--red);margin-bottom:8px;">❌ ابزارهای قبلی</div>
          <div style="font-size:12px;color:#555;line-height:2;">v0 → فقط UI<br>Bolt.new → buggy و شکننده<br>AI Studio → فقط فرانت<br>Copilot → autocomplete، نه architect</div>
        </div>
        <div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--green);margin-bottom:8px;">✅ fullKONK_&gt;</div>
          <div style="font-size:12px;color:#888;line-height:2;">هم فرانت زیبا هم بکند محکم<br>یکپارچه با هم کار می‌کنن<br>Production-ready از اول<br>۳ مدل تخصصی برای ۳ لایه</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 2: FULLSTACK
═══════════════════════════════════════════ -->
<section id="fullstack">
  <div class="sec-header reveal">
    <div class="sec-num">02</div>
    <div class="sec-meta">
      <div class="sec-label">// Full-Stack</div>
      <h2 class="sec-title">هر دو لایه.<br><span style="color:var(--red)">با هم. بدون타협.</span></h2>
    </div>
  </div>
  <div class="sec-body">
    <div class="fs-grid reveal">
      <div class="fs-col left">
        <div class="fs-col-title">🎨 Frontend Layer</div>
        <div class="fs-item"><div class="fs-item-icon">✨</div><div class="fs-item-text"><strong>UI Cutting-Edge</strong><span>shadcn/ui + Tailwind + Framer Motion — انیمیشن و زیبایی واقعی</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">📱</div><div class="fs-item-text"><strong>Responsive & Accessible</strong><span>روی هر دستگاهی perfect. WCAG 2.1 رعایت شده.</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">⚡</div><div class="fs-item-text"><strong>Performance First</strong><span>SSR، lazy loading، code splitting — Core Web Vitals سبز</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">🔄</div><div class="fs-item-text"><strong>State Management</strong><span>Zustand + React Query — داده‌های real-time و cache</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">🎯</div><div class="fs-item-text"><strong>Component Architecture</strong><span>Atomic design، reusable، testable، documented</span></div></div>
      </div>
      <div class="fs-mid">
        <div class="fs-mid-icon">⟺</div>
        <div class="fs-mid-text">Fully Integrated</div>
      </div>
      <div class="fs-col right">
        <div class="fs-col-title">⚙️ Backend Layer</div>
        <div class="fs-item"><div class="fs-item-icon">🔌</div><div class="fs-item-text"><strong>API Design</strong><span>REST + OpenAPI spec. Type-safe end-to-end با Zod</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">🗃️</div><div class="fs-item-text"><strong>Database Schema</strong><span>Prisma + PostgreSQL. Relations، indexes، migrations</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">🔐</div><div class="fs-item-text"><strong>Auth & Security</strong><span>JWT + OAuth + RBAC. Rate limiting، input sanitization</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">🐳</div><div class="fs-item-text"><strong>Deploy Ready</strong><span>Dockerfile، docker-compose، GitHub Actions CI/CD</span></div></div>
        <div class="fs-item"><div class="fs-item-icon">🧪</div><div class="fs-item-text"><strong>Tests Included</strong><span>Unit + Integration + E2E. Coverage report از همان اول</span></div></div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 3: HOW IT WORKS
═══════════════════════════════════════════ -->
<section id="howitworks">
  <div class="sec-header reveal">
    <div class="sec-num">03</div>
    <div class="sec-meta">
      <div class="sec-label">// نحوه کار</div>
      <h2 class="sec-title">Pipeline سه‌مرحله‌ای<br><span style="color:var(--blue)">هر مرحله یه متخصص</span></h2>
    </div>
  </div>
  <div class="sec-body" style="padding-top:0;padding-bottom:0">
    <div class="pipeline reveal">

      <div class="pipeline-step" style="--ps-bg:var(--yellow);--ps-col:var(--black)">
        <div class="ps-num">01</div>
        <div class="ps-body">
          <div class="ps-tag" style="color:var(--yellow)">مرحله اول · Architect</div>
          <div class="ps-title">طراحی معماری کامل</div>
          <div class="ps-desc">قبل از یه خط کد، کل سیستم طراحی می‌شه. Component tree، API contract، DB schema، tech stack، project structure — همه تأیید می‌شه.</div>
          <div class="ps-nodes">
            <div class="ps-node">Component Tree</div>
            <div class="ps-node">API Contract</div>
            <div class="ps-node">DB Schema</div>
            <div class="ps-node">Tech Stack</div>
          </div>
        </div>
        <div class="ps-model">
          <div class="ps-model-badge" style="background:var(--yellow);color:var(--black)">DeepSeek V3.2</div>
          <div class="ps-model-sub">بهترین برای<br>system design</div>
        </div>
      </div>

      <div class="pipeline-step" style="--ps-bg:var(--blue);--ps-col:var(--white)">
        <div class="ps-num" style="color:var(--white)">02</div>
        <div class="ps-body">
          <div class="ps-tag" style="color:var(--blue)">مرحله دوم · Build (موازی)</div>
          <div class="ps-title">ساخت فرانت + بکند همزمان</div>
          <div class="ps-desc">دو مدل تخصصی موازی کار می‌کنن. یکی فرانت زیبا، دیگری بکند محکم. هر کدوم در کاری که بهترینن.</div>
          <div class="ps-nodes">
            <div class="ps-node">Next.js + Tailwind</div>
            <div class="ps-node">Framer Motion</div>
            <div class="ps-node">Prisma + Zod</div>
            <div class="ps-node">API Routes</div>
          </div>
        </div>
        <div class="ps-model">
          <div class="ps-model-badge" style="background:var(--blue);color:var(--white)">Kimi K3 + DeepSeek</div>
          <div class="ps-model-sub">Frontend ← Kimi<br>Backend ← DeepSeek</div>
        </div>
      </div>

      <div class="pipeline-step" style="--ps-bg:var(--green);--ps-col:var(--black)">
        <div class="ps-num">03</div>
        <div class="ps-body">
          <div class="ps-tag" style="color:var(--green)">مرحله سوم · Integrate & Verify</div>
          <div class="ps-title">یکپارچه‌سازی و تأیید نهایی</div>
          <div class="ps-desc">فرانت و بکند کنار هم قرار می‌گیرن. Type consistency، import/export، API calls — همه چک می‌شه. خروجی آماده deploy.</div>
          <div class="ps-nodes">
            <div class="ps-node">Type Check</div>
            <div class="ps-node">API Alignment</div>
            <div class="ps-node">Auth Flow</div>
            <div class="ps-node">Final ZIP</div>
          </div>
        </div>
        <div class="ps-model">
          <div class="ps-model-badge" style="background:var(--green);color:var(--black)">Claude Fable 5</div>
          <div class="ps-model-sub">بهترین برای<br>code review</div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 4: PROVIDERS
═══════════════════════════════════════════ -->
<section id="providers">
  <div class="sec-header reveal">
    <div class="sec-num" style="color:#0d0d0d">04</div>
    <div class="sec-meta">
      <div class="sec-label" style="color:#333">// پروایدرها</div>
      <h2 class="sec-title" style="color:var(--white)">۱۲+ پروایدر رایگان<br><span style="color:var(--yellow)">Smart Routing</span></h2>
    </div>
  </div>
  <div class="sec-body" style="padding-top:36px">
    <div class="prov-grid reveal">

      <div class="prov-card" style="--pa:var(--yellow)" data-sp="95">
        <div class="prov-header"><div class="prov-icon">⚡</div><span class="prov-free-badge">FREE · NO CC</span></div>
        <div class="prov-name">Groq</div>
        <div class="prov-desc">سریع‌ترین. LPU چیپ اختصاصی. ۵۰۰-۳۰۰۰ توکن/ثانیه. ایده‌آل برای تسک‌های سریع.</div>
        <div class="prov-models">llama-3.3-70b · llama-4-scout · qwen-qwq-32b</div>
        <div class="prov-tags"><span class="prov-tag">500+ tok/s</span><span class="prov-tag">OpenAI compat</span><span class="prov-tag">LPU chip</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:95%"></div></div>
      </div>

      <div class="prov-card" style="--pa:var(--cyan)" data-sp="90">
        <div class="prov-header"><div class="prov-icon">🧠</div><span class="prov-free-badge">1M/DAY FREE</span></div>
        <div class="prov-name">Cerebras</div>
        <div class="prov-desc">یک میلیون توکن رایگان در روز. WSE chip. ریست روزانه. بهترین برای حجم بالا.</div>
        <div class="prov-models">gpt-oss-120b · llama3.1-8b · GLM-4-32B</div>
        <div class="prov-tags"><span class="prov-tag">1M tok/day</span><span class="prov-tag">WSE chip</span><span class="prov-tag">Daily reset</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:90%"></div></div>
      </div>

      <div class="prov-card" style="--pa:var(--blue)" data-sp="78">
        <div class="prov-header"><div class="prov-icon">🔬</div><span class="prov-free-badge">FREE TIER</span></div>
        <div class="prov-name">DeepSeek</div>
        <div class="prov-desc">بهترین برای کد. V3.2 و R1 رهبر بنچمارک‌های coding هستن. پایه Backend Pipeline.</div>
        <div class="prov-models">deepseek-chat (V3.2) · deepseek-reasoner (R1)</div>
        <div class="prov-tags"><span class="prov-tag">Best coding</span><span class="prov-tag">Reasoning</span><span class="prov-tag">Backend core</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:78%"></div></div>
      </div>

      <div class="prov-card" style="--pa:var(--orange)" data-sp="86">
        <div class="prov-header"><div class="prov-icon">🏔️</div><span class="prov-free-badge">$5 FREE</span></div>
        <div class="prov-name">SambaNova</div>
        <div class="prov-desc">مدل‌های بزرگ با سرعت بالا. Llama 4 Maverick، Qwen3-235B، DeepSeek-V3.1.</div>
        <div class="prov-models">Llama-4-Maverick · DeepSeek-V3.1 · Qwen3-235B</div>
        <div class="prov-tags"><span class="prov-tag">Large models</span><span class="prov-tag">Fast API</span><span class="prov-tag">$5 credit</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:86%"></div></div>
      </div>

      <div class="prov-card" style="--pa:var(--green)" data-sp="84">
        <div class="prov-header"><div class="prov-icon">💎</div><span class="prov-free-badge">FREE · NO CC</span></div>
        <div class="prov-name">Google AI Studio</div>
        <div class="prov-desc">Gemini 2.5 Flash با ۱ میلیون توکن context. Multimodal. برای تحلیل کدبیس بزرگ.</div>
        <div class="prov-models">gemini-2.5-flash · gemini-2.5-flash-lite</div>
        <div class="prov-tags"><span class="prov-tag">1M context</span><span class="prov-tag">Multimodal</span><span class="prov-tag">Frontend expert</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:84%"></div></div>
      </div>

      <div class="prov-card" style="--pa:var(--purple)" data-sp="72">
        <div class="prov-header"><div class="prov-icon">🌐</div><span class="prov-free-badge">FREE · NO CC</span></div>
        <div class="prov-name">OpenRouter</div>
        <div class="prov-desc">یک API — ۲۰+ مدل رایگان. Gateway جامع. ایده‌آل برای fallback و مقایسه.</div>
        <div class="prov-models">+20 free models · auto routing</div>
        <div class="prov-tags"><span class="prov-tag">20+ free</span><span class="prov-tag">Fallback</span><span class="prov-tag">Gateway</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:72%"></div></div>
      </div>

      <div class="prov-card" style="--pa:#ff69b4" data-sp="65">
        <div class="prov-header"><div class="prov-icon">🤗</div><span class="prov-free-badge">FREE · NO CC</span></div>
        <div class="prov-name">HuggingFace</div>
        <div class="prov-desc">Gateway به ۱۵+ پروایدر. صدها مدل اپن‌سورس. Serverless inference رایگان.</div>
        <div class="prov-models">Serverless · Endpoints · Providers</div>
        <div class="prov-tags"><span class="prov-tag">100+ models</span><span class="prov-tag">Open source</span><span class="prov-tag">Hub gateway</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:65%"></div></div>
      </div>

      <div class="prov-card" style="--pa:#00d4aa" data-sp="76">
        <div class="prov-header"><div class="prov-icon">🐙</div><span class="prov-free-badge">FREE · NO CC</span></div>
        <div class="prov-name">GitHub Models</div>
        <div class="prov-desc">رایگان برای کاربران GitHub. Azure backend. GPT-4o-mini، Llama، Mistral.</div>
        <div class="prov-models">gpt-4o-mini · Llama-3.1-70B · Mistral</div>
        <div class="prov-tags"><span class="prov-tag">GitHub account</span><span class="prov-tag">Azure backend</span><span class="prov-tag">Prototyping</span></div>
        <div class="prov-speed"><div class="prov-speed-bar" style="width:76%"></div></div>
      </div>

    </div>

    <div class="compat-box reveal">
      <div class="compat-label">// نکته کلیدی — OpenAI Compatible</div>
      <div class="compat-text">بیشتر پروایدرها <strong style="color:var(--green)">OpenAI-compatible</strong> هستن. یعنی یک <code style="color:var(--yellow);font-family:var(--font-mono)">BaseProvider</code> می‌نویسیم، همه ازش ارث می‌برن. فقط <code style="color:var(--yellow);font-family:var(--font-mono)">baseUrl</code> فرق می‌کنه.</div>
      <div class="compat-code">
        <span class="code-green">const</span> groq  = <span class="code-blue">new</span> Provider(<span class="code-yellow">'Groq'</span>,     key, <span class="code-yellow">'https://api.groq.com/openai/v1'</span>);<br>
        <span class="code-green">const</span> deep  = <span class="code-blue">new</span> Provider(<span class="code-yellow">'DeepSeek'</span>, key, <span class="code-yellow">'https://api.deepseek.com/v1'</span>);<br>
        <span class="code-green">const</span> samba = <span class="code-blue">new</span> Provider(<span class="code-yellow">'SambaNova'</span>,key, <span class="code-yellow">'https://api.sambanova.ai/v1'</span>);<br>
        <span class="code-comment">// ← همه یکسانن. فقط URL و key فرق دارن.</span>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 5: TEMPLATES
═══════════════════════════════════════════ -->
<section id="templates">
  <div class="sec-header reveal">
    <div class="sec-num">05</div>
    <div class="sec-meta">
      <div class="sec-label">// Templates</div>
      <h2 class="sec-title">Full-Stack Templates<br><span style="color:var(--red)">فرانت + بکند با هم</span></h2>
    </div>
  </div>
  <div class="sec-body" style="padding-top:36px">
    <div class="tpl-grid reveal">

      <div class="tpl-card" style="--tc:var(--blue);--tib:#eef3ff">
        <div class="tpl-icon-wrap">🚀</div>
        <div class="tpl-tag">Full-Stack Template #1</div>
        <h3 class="tpl-title">SaaS Starter</h3>
        <p class="tpl-desc">کامل‌ترین template. Landing page زیبا + Dashboard + Auth + Billing + DB. از صفر تا production-ready.</p>
        <ul class="tpl-list">
          <li>Landing page با Framer Motion</li>
          <li>Auth system (Clerk/NextAuth)</li>
          <li>Dashboard UI + Dark mode</li>
          <li>Stripe billing integration</li>
          <li>Prisma + PostgreSQL schema</li>
          <li>Vercel deployment config</li>
        </ul>
      </div>

      <div class="tpl-card" style="--tc:var(--green);--tib:#eeffee">
        <div class="tpl-icon-wrap">📊</div>
        <div class="tpl-tag">Full-Stack Template #2</div>
        <h3 class="tpl-title">Admin Dashboard</h3>
        <p class="tpl-desc">داشبورد مدیریتی با UI کامل. جداول، چارت، فیلتر، جستجو + API CRUD کامل + Auth.</p>
        <ul class="tpl-list">
          <li>Data tables + sorting/filtering</li>
          <li>Charts (Recharts/Tremor)</li>
          <li>CRUD REST API کامل</li>
          <li>Role-based access (Admin/User)</li>
          <li>Real-time notifications</li>
          <li>Export to CSV/PDF</li>
        </ul>
      </div>

      <div class="tpl-card" style="--tc:var(--orange);--tib:#fff5ee">
        <div class="tpl-icon-wrap">🛒</div>
        <div class="tpl-tag">Full-Stack Template #3</div>
        <h3 class="tpl-title">E-Commerce</h3>
        <p class="tpl-desc">فروشگاه آنلاین کامل. Product catalog زیبا + Cart + Checkout + Order management + Admin.</p>
        <ul class="tpl-list">
          <li>Product catalog + Search</li>
          <li>Cart + Wishlist UI</li>
          <li>Stripe checkout flow</li>
          <li>Order management API</li>
          <li>Inventory tracking DB</li>
          <li>Admin product manager</li>
        </ul>
      </div>

      <div class="tpl-card" style="--tc:var(--red);--tib:#fff0f0">
        <div class="tpl-icon-wrap">💬</div>
        <div class="tpl-tag">Full-Stack Template #4</div>
        <h3 class="tpl-title">Real-time Chat App</h3>
        <p class="tpl-desc">اپ چت مدرن. UI شبیه Slack + WebSocket backend + Message history + Rooms/Channels.</p>
        <ul class="tpl-list">
          <li>Chat UI با Framer Motion</li>
          <li>WebSocket (Pusher/Ably)</li>
          <li>Message history + Search</li>
          <li>Rooms + Direct messages</li>
          <li>File upload (Cloudflare R2)</li>
          <li>Online status indicator</li>
        </ul>
      </div>

      <div class="tpl-card" style="--tc:var(--purple);--tib:#f5eeff">
        <div class="tpl-icon-wrap">📝</div>
        <div class="tpl-tag">Full-Stack Template #5</div>
        <h3 class="tpl-title">Content Platform</h3>
        <p class="tpl-desc">پلتفرم محتوا مثل Medium. Editor زیبا + پروفایل نویسنده + Comment + Like + Subscription.</p>
        <ul class="tpl-list">
          <li>Rich text editor (Tiptap)</li>
          <li>Author profiles + Follow</li>
          <li>Comment system با نستینگ</li>
          <li>Like + Bookmark API</li>
          <li>Newsletter subscription</li>
          <li>SEO optimization built-in</li>
        </ul>
      </div>

      <div class="tpl-card" style="--tc:var(--yellow);--tib:#fffde8">
        <div class="tpl-icon-wrap">🔌</div>
        <div class="tpl-tag">Full-Stack Template #6</div>
        <h3 class="tpl-title">API + Developer Portal</h3>
        <p class="tpl-desc">سرویس API با پورتال developer. Docs زیبا + API key management + Rate limiting + Analytics.</p>
        <ul class="tpl-list">
          <li>Interactive API docs (Swagger)</li>
          <li>API key generation + management</li>
          <li>Rate limiting per key</li>
          <li>Usage analytics dashboard</li>
          <li>Webhook management UI</li>
          <li>OpenAPI 3.1 spec auto-gen</li>
        </ul>
      </div>

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 6: FAILOVER
═══════════════════════════════════════════ -->
<section id="failover">
  <div class="sec-header reveal">
    <div class="sec-num" style="color:#080808">06</div>
    <div class="sec-meta">
      <div class="sec-label" style="color:#333">// Failover System</div>
      <h2 class="sec-title" style="color:var(--white)">Auto Failover<br><span style="color:var(--green)">هیچوقت متوقف نمی‌شه</span></h2>
    </div>
  </div>
  <div class="sec-body">
    <div style="font-size:14px;color:#666;line-height:1.7;margin-bottom:28px;" class="reveal">
      وقتی یه پروایدر rate limit می‌خوره یا خطا می‌ده، <strong style="color:var(--white)">خودکار</strong> به بعدی می‌ره. شبیه‌سازی رو اجرا کن:
    </div>
    <div class="reveal">
      <div class="fo-track" id="fo-track">
        <div class="fo-step active" id="fs0">
          <div class="fo-snum">01</div>
          <div class="fo-info"><div class="fo-name">DeepSeek V3.2</div><div class="fo-sub">اولین انتخاب — بهترین برای کدنویسی</div></div>
          <div class="fo-status"><span class="fo-stag st-active" id="ft0">ACTIVE</span></div>
        </div>
        <div class="fo-pbar"><div class="fo-pfill" id="fp0" style="width:65%"></div></div>
        <div class="fo-step" id="fs1">
          <div class="fo-snum">02</div>
          <div class="fo-info"><div class="fo-name">Groq · Llama-3.3-70B</div><div class="fo-sub">سریع‌ترین fallback — LPU chip</div></div>
          <div class="fo-status"><span class="fo-stag st-standby" id="ft1">STANDBY</span></div>
        </div>
        <div class="fo-pbar"><div class="fo-pfill" id="fp1" style="width:0%"></div></div>
        <div class="fo-step" id="fs2">
          <div class="fo-snum">03</div>
          <div class="fo-info"><div class="fo-name">Cerebras · 120B</div><div class="fo-sub">۱M توکن/روز رایگان</div></div>
          <div class="fo-status"><span class="fo-stag st-standby" id="ft2">STANDBY</span></div>
        </div>
        <div class="fo-pbar"><div class="fo-pfill" id="fp2" style="width:0%"></div></div>
        <div class="fo-step" id="fs3">
          <div class="fo-snum">04</div>
          <div class="fo-info"><div class="fo-name">OpenRouter · Auto</div><div class="fo-sub">پشتیبان نهایی — ۲۰+ مدل رایگان</div></div>
          <div class="fo-status"><span class="fo-stag st-fallback" id="ft3">FALLBACK</span></div>
        </div>
        <div class="fo-pbar"><div class="fo-pfill" id="fp3" style="width:0%"></div></div>
      </div>
      <div class="fo-log" id="fo-log"><span style="color:#1a1a1a">// لاگ سیستم — شبیه‌سازی را شروع کن</span></div>
      <div class="fo-ctrl">
        <button class="fo-btn" onclick="foRateLimit()">⚡ Rate Limit</button>
        <button class="fo-btn" onclick="foError()">❌ Connection Error</button>
        <button class="fo-btn" onclick="foReset()">↺ Reset</button>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 7: LIVE SIMULATION
═══════════════════════════════════════════ -->
<section id="simulation">
  <div class="sec-header reveal">
    <div class="sec-num" style="color:#141420">07</div>
    <div class="sec-meta">
      <div class="sec-label" style="color:#333">// دمو زنده</div>
      <h2 class="sec-title" style="color:var(--white)">fullKONK_&gt; در عمل<br><span style="color:var(--purple)">تجربه واقعی</span></h2>
    </div>
  </div>
  <div class="sec-body">
    <div style="font-size:13px;color:#666;margin-bottom:20px;" class="reveal">یک template انتخاب کن، پروایدر بزن، و ببین چطور یه محصول full-stack می‌سازه:</div>
    <div class="obs-wrap reveal">
      <div class="obs-titlebar">
        <div class="obs-dot" style="background:var(--red)"></div>
        <div class="obs-dot" style="background:var(--yellow)"></div>
        <div class="obs-dot" style="background:var(--green)"></div>
        <span class="obs-titlebar-label">konkred.xyz — fullKONK_&gt; Workspace</span>
      </div>
      <div class="obs-sidebar">
        <div class="obs-sec-lbl">workspace</div>
        <div class="obs-item on"><span class="obs-item-ic">⚡</span>fullKONK_&gt;</div>
        <div class="obs-item"><span class="obs-item-ic">📁</span>my-saas-app</div>
        <div class="obs-item"><span class="obs-item-ic">📁</span>ecommerce-v2</div>
        <div class="obs-item"><span class="obs-item-ic">📄</span>schema.prisma</div>
        <div class="obs-sec-lbl" style="margin-top:8px">templates</div>
        <div class="obs-item" onclick="simSetTpl('saas')"><span class="obs-item-ic">🚀</span>SaaS Starter</div>
        <div class="obs-item" onclick="simSetTpl('dashboard')"><span class="obs-item-ic">📊</span>Admin Dashboard</div>
        <div class="obs-item" onclick="simSetTpl('ecom')"><span class="obs-item-ic">🛒</span>E-Commerce</div>
        <div class="obs-item" onclick="simSetTpl('chat')"><span class="obs-item-ic">💬</span>Chat App</div>
        <div class="obs-item" onclick="simSetTpl('api')"><span class="obs-item-ic">🔌</span>API Portal</div>
        <div class="obs-sec-lbl" style="margin-top:8px">history</div>
        <div class="obs-item" style="font-size:9px;opacity:.4">2026-08-07 · invoice-app</div>
        <div class="obs-item" style="font-size:9px;opacity:.4">2026-08-06 · auth-system</div>
      </div>
      <div class="obs-main">
        <div class="obs-tabbar">
          <div class="obs-tab on">⚡ fullKONK_&gt;</div>
          <div class="obs-tab">📄 page.tsx</div>
          <div class="obs-tab">📄 api/route.ts</div>
          <div class="obs-tab">📄 schema.prisma</div>
        </div>
        <div class="obs-plugin">
          <div class="plugin-hdr">
            <select class="plugin-sel" id="sim-prov" onchange="simProvChange()">
              <option value="deepseek">🔬 DeepSeek V3.2</option>
              <option value="groq">⚡ Groq · Llama-4</option>
              <option value="cerebras">🧠 Cerebras · 120B</option>
              <option value="gemini">💎 Gemini 2.5 Flash</option>
              <option value="sambanova">🏔️ SambaNova</option>
              <option value="openrouter">🌐 OpenRouter</option>
            </select>
            <select class="plugin-sel" id="sim-mode" onchange="simModeChange()">
              <option value="fullstack">🏗️ Full-Stack Build</option>
              <option value="frontend">🎨 Frontend Only</option>
              <option value="backend">⚙️ Backend Only</option>
              <option value="review">🔍 Code Review</option>
            </select>
            <select class="plugin-sel" id="sim-tpl" onchange="simApplyTpl()">
              <option value="">── Template ──</option>
              <option value="saas">🚀 SaaS Starter</option>
              <option value="dashboard">📊 Admin Dashboard</option>
              <option value="ecom">🛒 E-Commerce</option>
              <option value="chat">💬 Chat App</option>
              <option value="api">🔌 API Portal</option>
            </select>
            <span class="plugin-mode-pill" id="sim-mpill">FULL-STACK</span>
            <span class="plugin-status" id="sim-stat">READY</span>
          </div>
          <div class="plugin-body">
            <div class="plugin-sysp">
              <div class="plugin-sysp-lbl">System Prompt</div>
              <textarea class="plugin-sysp-ta" id="sim-sysp">شما یک Full-Stack Product Architect هستید. فرانت cutting-edge + بکند production-ready یکپارچه تولید کنید. هیچ باگی قابل قبول نیست.</textarea>
            </div>
            <div class="plugin-chat" id="sim-chat">
              <div style="text-align:center;color:#222;font-size:10px;padding:20px;opacity:.5">── یک Template انتخاب کن یا مستقیم بنویس ──</div>
            </div>
            <div class="plugin-input-bar">
              <input class="plugin-inp" id="sim-inp" type="text" placeholder="مثلاً: یه invoice management SaaS با dashboard زیبا..." onkeydown="if(event.key==='Enter')simSend()">
              <button class="plugin-send" onclick="simSend()">BUILD ⏎</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 8: COMPARE
═══════════════════════════════════════════ -->
<section id="compare">
  <div class="sec-header reveal">
    <div class="sec-num">08</div>
    <div class="sec-meta">
      <div class="sec-label">// مقایسه</div>
      <h2 class="sec-title">fullKONK_&gt; در برابر<br><span style="color:var(--red)">همه رقبا</span></h2>
    </div>
  </div>
  <div class="sec-body">
    <div class="reveal" style="overflow-x:auto">
      <table class="cmp-table">
        <thead>
          <tr>
            <th>قابلیت</th>
            <th>v0 (Vercel)</th>
            <th>Bolt.new</th>
            <th>AI Studio</th>
            <th>Cursor</th>
            <th class="hl">🔥 fullKONK_&gt;</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>فرانت زیبا</td><td><span class="ck">✓</span> خوب</td><td><span class="cp">◈</span> متوسط</td><td><span class="ck">✓</span> خوب</td><td><span class="cp">◈</span> snippet</td><td class="hl"><span class="ck">✓✓</span> Cutting-Edge</td></tr>
          <tr><td>بکند محکم</td><td><span class="cx">✗</span></td><td><span class="cp">◈</span> buggy</td><td><span class="cp">◈</span> ضعیف</td><td><span class="cp">◈</span> autocomplete</td><td class="hl"><span class="ck">✓✓</span> Production-Ready</td></tr>
          <tr><td>یکپارچگی F+B</td><td><span class="cx">✗</span></td><td><span class="cp">◈</span> شکننده</td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td class="hl"><span class="ck">✓</span> کامل</td></tr>
          <tr><td>چند پروایدر</td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td><span class="cx">✗</span> فقط Gemini</td><td><span class="cx">✗</span></td><td class="hl"><span class="ck">✓</span> ۱۲+ پروایدر</td></tr>
          <tr><td>Auto Failover</td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td class="hl"><span class="ck">✓</span> خودکار</td></tr>
          <tr><td>DB Schema + Migration</td><td><span class="cx">✗</span></td><td><span class="cp">◈</span> محدود</td><td><span class="cx">✗</span></td><td><span class="cp">◈</span></td><td class="hl"><span class="ck">✓</span> Prisma کامل</td></tr>
          <tr><td>Auth System</td><td><span class="cx">✗</span></td><td><span class="cp">◈</span></td><td><span class="cx">✗</span></td><td><span class="cp">◈</span></td><td class="hl"><span class="ck">✓</span> JWT + OAuth</td></tr>
          <tr><td>Deploy Config</td><td><span class="cp">◈</span> Vercel only</td><td><span class="cp">◈</span></td><td><span class="cp">◈</span> Cloud Run</td><td><span class="cx">✗</span></td><td class="hl"><span class="ck">✓</span> Docker + CI/CD</td></tr>
          <tr><td>هزینه inference</td><td>$$$</td><td>$$$</td><td>Free (محدود)</td><td>$</td><td class="hl"><span class="ck">✓</span> نزدیک صفر</td></tr>
          <tr><td>Tests همراه کد</td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td><span class="cx">✗</span></td><td><span class="cp">◈</span></td><td class="hl"><span class="ck">✓</span> Unit + E2E</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 9: USAGE DASHBOARD
═══════════════════════════════════════════ -->
<section id="dashboard">
  <div class="sec-header reveal">
    <div class="sec-num">09</div>
    <div class="sec-meta">
      <div class="sec-label">// داشبورد</div>
      <h2 class="sec-title">مصرف پروایدرها<br>در یک نگاه</h2>
    </div>
  </div>
  <div class="sec-body">
    <div class="usage-grid reveal">
      <div class="uc"><div class="uc-prov"><div class="ud ud-g"></div>Groq</div><div class="uc-nums"><span>توکن امروز</span><span class="uc-val">8,420 / 14,400</span></div><div class="uc-bar-bg"><div class="uc-bar-fill" style="background:var(--green);width:58%"></div></div><div class="uc-reset">ریست: <span>در ۱۶ ساعت</span></div></div>
      <div class="uc"><div class="uc-prov"><div class="ud ud-g"></div>Cerebras</div><div class="uc-nums"><span>توکن امروز</span><span class="uc-val">280K / 1M</span></div><div class="uc-bar-bg"><div class="uc-bar-fill" style="background:var(--cyan);width:28%"></div></div><div class="uc-reset">ریست: <span>در ۲۲ ساعت</span></div></div>
      <div class="uc"><div class="uc-prov"><div class="ud ud-y"></div>DeepSeek</div><div class="uc-nums"><span>وضعیت</span><span class="uc-val">فعال</span></div><div class="uc-bar-bg"><div class="uc-bar-fill" style="background:var(--blue);width:45%"></div></div><div class="uc-reset">ریست: <span>روزانه</span></div></div>
      <div class="uc"><div class="uc-prov"><div class="ud ud-r"></div>SambaNova</div><div class="uc-nums"><span>کردیت باقی</span><span class="uc-val">$3.21 / $5.00</span></div><div class="uc-bar-bg"><div class="uc-bar-fill" style="background:var(--orange);width:64%"></div></div><div class="uc-reset">کردیت یک‌بار مصرف</div></div>
      <div class="uc"><div class="uc-prov"><div class="ud ud-g"></div>OpenRouter</div><div class="uc-nums"><span>درخواست امروز</span><span class="uc-val">12 / 50</span></div><div class="uc-bar-bg"><div class="uc-bar-fill" style="background:var(--purple);width:24%"></div></div><div class="uc-reset">ریست: <span>فردا</span></div></div>
      <div class="uc"><div class="uc-prov"><div class="ud ud-g"></div>Google AI Studio</div><div class="uc-nums"><span>درخواست امروز</span><span class="uc-val">450 / 1500</span></div><div class="uc-bar-bg"><div class="uc-bar-fill" style="background:var(--red);width:30%"></div></div><div class="uc-reset">ریست: <span>فردا</span></div></div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 10: ROADMAP
═══════════════════════════════════════════ -->
<section id="roadmap">
  <div class="sec-header reveal">
    <div class="sec-num">10</div>
    <div class="sec-meta">
      <div class="sec-label">// نقشه راه</div>
      <h2 class="sec-title">از Landing Page<br>تا اولین دلار</h2>
    </div>
  </div>
  <div class="sec-body" style="padding:0">
    <div class="timeline reveal">
      <div class="tl-phase">
        <div class="tl-left"><div class="tl-num">01</div><div class="tl-week">هفته ۱</div><div class="tl-status" style="background:var(--yellow);color:#000">VALIDATION</div></div>
        <div class="tl-right"><h3 class="tl-title">Landing Page + Waitlist</h3><ul class="tl-tasks"><li>Landing page زیبا با دمو</li><li>Waitlist form (اسم + ایمیل)</li><li>۶۰ ثانیه ویدیو demo</li><li>پست در Reddit + Twitter</li><li>هدف: ۱۰۰ ایمیل</li><li>۱۰ DM با potential users</li></ul></div>
      </div>
      <div class="tl-phase">
        <div class="tl-left"><div class="tl-num">02</div><div class="tl-week">هفته ۲-۳</div><div class="tl-status" style="background:var(--blue);color:#fff">MVP BUILD</div></div>
        <div class="tl-right"><h3 class="tl-title">Core Engine — اگه Validation OK</h3><ul class="tl-tasks"><li>Next.js 14 + Clerk auth</li><li>Chat UI با streaming</li><li>Groq + DeepSeek provider</li><li>۳ Full-Stack template</li><li>Download ZIP output</li><li>Stripe Free + Pro ($29)</li></ul></div>
      </div>
      <div class="tl-phase">
        <div class="tl-left"><div class="tl-num">03</div><div class="tl-week">هفته ۴</div><div class="tl-status" style="background:var(--green);color:#000">LAUNCH</div></div>
        <div class="tl-right"><h3 class="tl-title">Launch + اولین درآمد</h3><ul class="tl-tasks"><li>Deploy روی Vercel</li><li>Product Hunt launch</li><li>Hacker News "Show HN"</li><li>ایمیل به waitlist</li><li>هدف: ۱۰ paying customer</li><li>هدف: $290 اولین MRR</li></ul></div>
      </div>
      <div class="tl-phase">
        <div class="tl-left"><div class="tl-num">04</div><div class="tl-week">ماه ۲-۳</div><div class="tl-status" style="background:var(--purple);color:#fff">GROWTH</div></div>
        <div class="tl-right"><h3 class="tl-title">رشد + قابلیت‌های بیشتر</h3><ul class="tl-tasks"><li>همه ۱۲ پروایدر</li><li>Auto Failover system</li><li>GitHub export (auto-push)</li><li>Team workspaces</li><li>هدف: ۵۰ Pro = $1,450/mo</li><li>هدف: $3,000 MRR</li></ul></div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div>
    <span class="ft-logo">fullKONK_&gt;</span>
    <p class="ft-desc">ساخته شده روی konkred.xyz. ابزار AI برای ساخت محصولات full-stack زیبا و بی‌باگ. فرانت cutting-edge + بکند production-ready.</p>
  </div>
  <div>
    <div class="ft-stack-title">Tech Stack</div>
    <div class="ft-stack-item"><span>Framework</span><span class="ft-stack-val">Next.js 14</span></div>
    <div class="ft-stack-item"><span>Styling</span><span class="ft-stack-val">Tailwind + shadcn</span></div>
    <div class="ft-stack-item"><span>Animation</span><span class="ft-stack-val">Framer Motion</span></div>
    <div class="ft-stack-item"><span>ORM</span><span class="ft-stack-val">Prisma</span></div>
    <div class="ft-stack-item"><span>Auth</span><span class="ft-stack-val">Clerk</span></div>
    <div class="ft-stack-item"><span>DB</span><span class="ft-stack-val">Neon Postgres</span></div>
    <div class="ft-stack-item"><span>Payments</span><span class="ft-stack-val">Stripe</span></div>
  </div>
  <div>
    <div class="ft-stack-title">پروایدرهای رایگان</div>
    <div class="ft-stack-item"><span>🟢 Groq</span><span class="ft-stack-val">console.groq.com</span></div>
    <div class="ft-stack-item"><span>🟢 Cerebras</span><span class="ft-stack-val">cloud.cerebras.ai</span></div>
    <div class="ft-stack-item"><span>🟢 DeepSeek</span><span class="ft-stack-val">platform.deepseek.com</span></div>
    <div class="ft-stack-item"><span>🟢 OpenRouter</span><span class="ft-stack-val">openrouter.ai</span></div>
    <div class="ft-stack-item"><span>🟢 SambaNova</span><span class="ft-stack-val">cloud.sambanova.ai</span></div>
    <div class="ft-stack-item"><span>🟢 Google</span><span class="ft-stack-val">aistudio.google.com</span></div>
  </div>
  <div class="ft-bottom">
    <span>fullKONK_&gt; · konkred.xyz</span>
    <span>ساخته شده با <strong>Claude Fable 5</strong></span>
    <span style="color:#111">// FULL-STACK AI PRODUCT BUILDER</span>
  </div>
</footer>

<script>
// ═══════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('gone'), 2000));

// ═══════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════
const curDot = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function animCur(){
  rx += (mx-rx)*.13; ry += (my-ry)*.13;
  curDot.style.left=mx+'px'; curDot.style.top=my+'px';
  curRing.style.left=rx+'px'; curRing.style.top=ry+'px';
  requestAnimationFrame(animCur);
})();
document.querySelectorAll('a,button,select,input,textarea,[class*=card],[class*=item],[class*=btn],[class*=step],[class*=phase]').forEach(el => {
  el.addEventListener('mouseenter',()=>{curDot.style.width='20px';curDot.style.height='20px';curRing.style.width='56px';curRing.style.height='56px';});
  el.addEventListener('mouseleave',()=>{curDot.style.width='12px';curDot.style.height='12px';curRing.style.width='36px';curRing.style.height='36px';});
});

// ═══════════════════════════════════════════
// SCROLL PROGRESS + BTT
// ═══════════════════════════════════════════
const sp = document.getElementById('scroll-prog');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  sp.style.width = pct + '%';
  btt.classList.toggle('show', window.scrollY > 400);
});
btt.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// ═══════════════════════════════════════════
// REVEAL ON SCROLL
// ═══════════════════════════════════════════
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('vis'), i*80); });
}, {threshold:.1});
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ═══════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════
function animCount(el,target,suffix,dur=2000){
  let s=0; const step=target/(dur/16);
  const t=setInterval(()=>{ s+=step; if(s>=target){s=target;clearInterval(t);} el.textContent=Math.floor(s)+suffix; },16);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animCount(document.getElementById('cnt1'),12,'+');
      animCount(document.getElementById('cnt2'),80,'+');
      animCount(document.getElementById('cnt3'),2400,'+');
      cntObs.disconnect();
    }
  });
},{threshold:.5});
cntObs.observe(document.getElementById('cnt1'));

// ═══════════════════════════════════════════
// PROVIDER SPEED BARS ON HOVER (providers section)
// ═══════════════════════════════════════════
document.querySelectorAll('.prov-card').forEach(card => {
  const bar = card.querySelector('.prov-speed-bar');
  const sp = card.dataset.sp + '%';
  bar.style.width = sp;
});

// ═══════════════════════════════════════════
// USAGE BARS ANIMATION
// ═══════════════════════════════════════════
const usageObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      document.querySelectorAll('.uc-bar-fill').forEach(b => {
        const w = b.style.width; b.style.width='0%';
        setTimeout(()=>b.style.width=w, 200);
      });
      usageObs.disconnect();
    }
  });
},{threshold:.3});
const dashEl = document.getElementById('dashboard');
if(dashEl) usageObs.observe(dashEl);

// ═══════════════════════════════════════════
// HERO MOCKUP
// ═══════════════════════════════════════════
const heroTabs = { ARCHITECT: 'شما یک معمار سیستم هستید. معماری کامل محصول را طراحی کنید...', BUILD: 'شما یک Full-Stack Developer هستید. فرانت cutting-edge + بکند محکم تولید کنید...', REVIEW: 'شما یک Senior Engineer هستید. کد را بررسی، باگ‌ها را پیدا، و بهبودها را پیشنهاد دهید...' };
function setHeroTab(el, mode){ document.querySelectorAll('.mock-tab').forEach(t=>t.classList.remove('on')); el.classList.add('on'); document.getElementById('h-sysp').textContent=heroTabs[mode]; }

const heroProvModels = {
  'DeepSeek V3.2': ['deepseek-chat (V3.2)', 'deepseek-reasoner (R1)'],
  'Groq · Llama-4': ['llama-4-scout-17b', 'llama-3.3-70b-versatile', 'qwen-qwq-32b'],
  'Cerebras · 120B': ['gpt-oss-120b', 'llama3.1-8b'],
  'Gemini 2.5 Flash': ['gemini-2.5-flash', 'gemini-2.5-flash-lite'],
  'OpenRouter · Auto': ['auto (best free)', 'meta/llama-3.3-70b', 'qwen/qwen3-235b'],
};
function heroProvChange(){
  const p = document.getElementById('h-prov').value;
  const m = document.getElementById('h-model');
  if(!m) return;
  const models = heroProvModels[p]||['default'];
}

const heroAIResps = [
  '✅ معماری طراحی شد:\n\n🎨 Frontend:\n• Next.js 14 + Tailwind\n• shadcn/ui components\n• Framer Motion animations\n• Dark mode support\n\n⚙️ Backend:\n• Prisma + PostgreSQL\n• JWT auth middleware\n• Zod validation\n\n📁 project ذخیره شد.',
  '✅ Full-Stack Invoice App:\n\n```tsx\n// Dashboard.tsx\nexport default function Dashboard() {\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      className="grid gap-6 p-8"\n    >\n      <InvoiceTable />\n      <StatsCards />\n    </motion.div>\n  );\n}\n```\n\n✅ API routes + Prisma schema آماده',
  '⚙️ Prisma Schema:\n\n```prisma\nmodel Invoice {\n  id       String @id @default(cuid())\n  amount   Float\n  status   Status @default(PENDING)\n  userId   String\n  user     User   @relation(...)\n  dueDate  DateTime\n  @@index([userId, status])\n}\n```\n\n🎨 UI components هم آماده‌ان.',
];
let heroIdx = 0;
function heroSend(){
  const inp = document.getElementById('h-input');
  const chat = document.getElementById('h-chat');
  const msg = inp.value.trim();
  if(!msg) return;
  inp.value = '';
  const ud = document.createElement('div');
  ud.className = 'mock-msg user';
  ud.textContent = msg;
  chat.appendChild(ud);
  const ad = document.createElement('div');
  ad.className = 'mock-msg ai';
  ad.setAttribute('data-m', document.getElementById('h-prov').value.split(' ')[0].toUpperCase());
  ad.innerHTML = '<span class="typcur"></span>';
  chat.appendChild(ad);
  chat.scrollTop = 9999;
  const resp = heroAIResps[heroIdx % heroAIResps.length]; heroIdx++;
  typeOut(ad, resp, 20);
}
document.getElementById('h-input').addEventListener('keydown', e => { if(e.key==='Enter') heroSend(); });

function typeOut(el, text, speed=20){
  const chars = text.split('');
  let i=0; el.textContent='';
  const cur = document.createElement('span'); cur.className='typcur'; el.appendChild(cur);
  const t = setInterval(()=>{
    if(i<chars.length){ el.insertBefore(document.createTextNode(chars[i++]),cur); const ch=document.getElementById('h-chat'); if(ch) ch.scrollTop=9999; }
    else{ cur.remove(); clearInterval(t); }
  },speed);
}

// auto demo
setTimeout(()=>{
  const ad = document.querySelector('.mock-chat .ai');
  if(!ad) return;
  const r = '✅ Invoice Management Full-Stack:\n\n🎨 Frontend: Dashboard zibá + Tailwind\n⚙️ Backend: Prisma + JWT + Zod\n🔗 Integrated + Deploy ready\n\n📁 فایل‌ها آماده دانلود.';
  typeOut(ad, r, 22);
}, 2600);

// ═══════════════════════════════════════════
// FAILOVER SIMULATION
// ═══════════════════════════════════════════
function foSetActive(idx){
  [0,1,2,3].forEach(i=>{
    const el = document.getElementById('fs'+i);
    el.classList.remove('active','done','blown');
    if(i<idx) el.classList.add('done');
    else if(i===idx) el.classList.add('active');
  });
}
function addLog(html, delay=0){
  setTimeout(()=>{
    const log = document.getElementById('fo-log');
    const d = document.createElement('div'); d.className='log-line'; d.innerHTML=html;
    log.appendChild(d); log.scrollTop=9999;
  },delay);
}
function foRateLimit(){
  foReset();
  document.getElementById('fo-log').innerHTML='';
  addLog('<span class="log-info">[INFO]</span> درخواست → DeepSeek V3.2...',0);
  addLog('<span class="log-info">[INFO]</span> پردازش در جریان...',600);
  addLog('<span class="log-err">[429]</span> Rate limit exceeded — DeepSeek خسته شد!',1300);
  addLog('<span class="log-warn">[WARN]</span> در حال سوئیچ به Groq...',1700);
  setTimeout(()=>{
    document.getElementById('ft0').textContent='RATE LIMITED';
    document.getElementById('ft0').className='fo-stag st-limit';
    document.getElementById('fp0').classList.add('drain');
    document.getElementById('fp0').style.width='100%';
    foSetActive(1);
    document.getElementById('ft1').textContent='ACTIVE';
    document.getElementById('ft1').className='fo-stag st-active';
    document.getElementById('fp1').style.width='40%';
  },1900);
  addLog('<span class="log-info">[INFO]</span> درخواست → Groq Llama-3.3-70B...',2300);
  addLog('<span class="log-info">[OK]</span> streaming شروع شد ⚡ 847 tok/s',2900);
  addLog('<span class="log-info">[SUCCESS]</span> ✓ پاسخ دریافت شد — ۳,۴۱۲ توکن در ۱.۲s',3600);
}
function foError(){
  foReset();
  document.getElementById('fo-log').innerHTML='';
  addLog('<span class="log-info">[INFO]</span> درخواست → DeepSeek...',0);
  addLog('<span class="log-err">[TIMEOUT]</span> سرور پاسخ نداد — connection timeout',900);
  addLog('<span class="log-warn">[WARN]</span> DeepSeek → Groq...',1300);
  setTimeout(()=>{ document.getElementById('ft0').textContent='ERROR'; document.getElementById('ft0').className='fo-stag st-limit'; foSetActive(1); document.getElementById('ft1').textContent='ACTIVE'; document.getElementById('ft1').className='fo-stag st-active'; },1400);
  addLog('<span class="log-info">[INFO]</span> درخواست → Groq...',1700);
  addLog('<span class="log-err">[429]</span> Groq هم rate limit خورد!',2500);
  addLog('<span class="log-warn">[WARN]</span> Groq → Cerebras 120B...',2900);
  setTimeout(()=>{ document.getElementById('ft1').textContent='RATE LIMITED'; document.getElementById('ft1').className='fo-stag st-limit'; foSetActive(2); document.getElementById('ft2').textContent='ACTIVE'; document.getElementById('ft2').className='fo-stag st-active'; document.getElementById('fp2').style.width='35%'; },3100);
  addLog('<span class="log-info">[INFO]</span> درخواست → Cerebras 120B...',3300);
  addLog('<span class="log-info">[SUCCESS]</span> ✓ Cerebras پاسخ داد! ۱M توکن/روز باقی داره',4100);
}
function foReset(){
  [0,1,2,3].forEach(i=>{
    document.getElementById('fs'+i).classList.remove('active','done','blown');
    document.getElementById('fp'+i).style.width='0%';
    document.getElementById('fp'+i).classList.remove('drain');
  });
  document.getElementById('fs0').classList.add('active');
  document.getElementById('fp0').style.width='65%';
  document.getElementById('ft0').textContent='ACTIVE';   document.getElementById('ft0').className='fo-stag st-active';
  document.getElementById('ft1').textContent='STANDBY';  document.getElementById('ft1').className='fo-stag st-standby';
  document.getElementById('ft2').textContent='STANDBY';  document.getElementById('ft2').className='fo-stag st-standby';
  document.getElementById('ft3').textContent='FALLBACK'; document.getElementById('ft3').className='fo-stag st-fallback';
  document.getElementById('fo-log').innerHTML='<span style="color:#111">// لاگ سیستم — شبیه‌سازی را شروع کن</span>';
}

// ═══════════════════════════════════════════
// SIMULATION (konkred.xyz workspace)
// ═══════════════════════════════════════════
const simProvData = {
  deepseek:  { badge:'FREE', models:['deepseek-chat (V3.2)','deepseek-reasoner (R1)'] },
  groq:      { badge:'FREE', models:['llama-4-scout-17b','llama-3.3-70b-versatile'] },
  cerebras:  { badge:'1M/DAY', models:['gpt-oss-120b','llama3.1-8b'] },
  gemini:    { badge:'FREE', models:['gemini-2.5-flash','gemini-2.5-flash-lite'] },
  sambanova: { badge:'$5 FREE', models:['Llama-4-Maverick','Qwen3-235B'] },
  openrouter:{ badge:'FREE', models:['auto (best free)','meta/llama-3.3-70b'] },
};
const simModeData = {
  fullstack:{ label:'FULL-STACK', color:'var(--purple)', sysp:'شما Full-Stack Product Architect هستید. فرانت cutting-edge + بکند production-ready یکپارچه تولید کنید.' },
  frontend: { label:'FRONTEND',  color:'var(--blue)',   sysp:'شما UI/UX Expert هستید. کامپوننت‌های زیبا، accessible، انیمیشن‌دار با Next.js + Tailwind بسازید.' },
  backend:  { label:'BACKEND',   color:'var(--green)',  sysp:'شما Backend Architect هستید. API محکم، type-safe، production-ready بسازید.' },
  review:   { label:'REVIEW',    color:'var(--orange)', sysp:'شما Senior Code Reviewer هستید. باگ‌ها را پیدا، performance را بهبود، security را چک کنید.' },
};
const simTplData = {
  saas:      { sysp:'SaaS Starter: Landing page زیبا + Dashboard + Auth + Billing + DB.', ph:'مثلاً: یه invoice management SaaS با dashboard و stripe billing' },
  dashboard: { sysp:'Admin Dashboard: جداول، چارت، CRUD API، RBAC auth.', ph:'مثلاً: dashboard مدیریت کاربران با analytics' },
  ecom:      { sysp:'E-Commerce: Product catalog + Cart + Checkout + Order API.', ph:'مثلاً: فروشگاه آنلاین با inventory و پرداخت' },
  chat:      { sysp:'Chat App: UI مدرن + WebSocket backend + Message history.', ph:'مثلاً: یه chat app گروهی مثل Slack' },
  api:       { sysp:'API Portal: Docs زیبا + API key management + Rate limiting.', ph:'مثلاً: پورتال developer برای سرویس AI' },
};

function simProvChange(){
  const p = document.getElementById('sim-prov').value;
  const d = simProvData[p]||simProvData.deepseek;
  document.getElementById('sim-mpill').textContent = d.badge;
}
function simModeChange(){
  const m = document.getElementById('sim-mode').value;
  const d = simModeData[m]||simModeData.fullstack;
  const pill = document.getElementById('sim-mpill');
  pill.textContent = d.label;
  pill.style.background = d.color;
  document.getElementById('sim-sysp').value = d.sysp;
}
function simSetTpl(tpl){ document.getElementById('sim-tpl').value=tpl; simApplyTpl(); }
function simApplyTpl(){
  const t = document.getElementById('sim-tpl').value;
  if(!t) return;
  const d = simTplData[t];
  document.getElementById('sim-sysp').value = d.sysp;
  document.getElementById('sim-inp').placeholder = d.ph;
  const chat = document.getElementById('sim-chat');
  chat.innerHTML = `<div style="text-align:center;padding:10px;font-size:10px;color:var(--purple);border:1px solid #2a2a3a;background:#0a0a1a;font-family:var(--font-mono);">✓ Template "${t}" بارگذاری شد</div>`;
}

const simAIResps = {
  saas: (msg) => `✅ SaaS Full-Stack آماده:\n\n🎨 Frontend:\n\`\`\`tsx\nexport default function Dashboard() {\n  return (\n    <motion.div initial={{opacity:0}} animate={{opacity:1}}\n      className="min-h-screen bg-background">\n      <Sidebar />\n      <main className="flex-1 p-8">\n        <StatsGrid />\n        <RecentActivity />\n      </main>\n    </motion.div>\n  );\n}\n\`\`\`\n\n⚙️ Backend:\n\`\`\`typescript\n// api/invoices/route.ts\nexport async function GET(req: Request) {\n  const invoices = await prisma.invoice.findMany({\n    where: { userId: session.user.id },\n    orderBy: { createdAt: 'desc' }\n  });\n  return Response.json({ data: invoices });\n}\n\`\`\`\n\n📁 schema.prisma + Stripe config ذخیره شد.`,
  dashboard: (msg) => `✅ Admin Dashboard:\n\n🎨 Data Table Component:\n\`\`\`tsx\n<DataTable\n  columns={columns}\n  data={users}\n  filterKey="email"\n  onSort={handleSort}\n/>\n\`\`\`\n\n⚙️ CRUD API:\n\`\`\`typescript\nrouter.get('/users', auth(['admin']), async (req, res) => {\n  const { page=1, limit=20, search } = req.query;\n  const users = await prisma.user.findMany({ skip: (page-1)*limit, take: limit });\n  res.json({ data: users, total: count });\n});\n\`\`\`\n\n📊 Charts + Export CSV آماده.`,
  ecom: (msg) => `✅ E-Commerce Full-Stack:\n\n🎨 Product Card:\n\`\`\`tsx\n<motion.div whileHover={{y:-4}} className="group relative">\n  <Image src={product.image} className="group-hover:scale-105 transition" />\n  <AddToCart productId={product.id} />\n</motion.div>\n\`\`\`\n\n⚙️ Cart API:\n\`\`\`typescript\nexport async function POST(req: Request) {\n  const { productId, quantity } = await req.json();\n  const cart = await prisma.cartItem.upsert({...});\n  return Response.json(cart);\n}\n\`\`\`\n\n💳 Stripe checkout + Inventory tracking آماده.`,
  chat: (msg) => `✅ Chat App Full-Stack:\n\n🎨 Message UI:\n\`\`\`tsx\n<AnimatePresence>\n  {messages.map(msg => (\n    <motion.div key={msg.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}>\n      <Avatar src={msg.user.image} />\n      <p className="bg-muted rounded-2xl px-4 py-2">{msg.content}</p>\n    </motion.div>\n  ))}\n</AnimatePresence>\n\`\`\`\n\n⚙️ WebSocket:\n\`\`\`typescript\npusher.trigger(\`room-\${roomId}\`, 'message', { content, userId, createdAt: new Date() });\n\`\`\`\n\n📨 Real-time + Message history آماده.`,
  api: (msg) => `✅ API Portal Full-Stack:\n\n🎨 Docs UI:\n\`\`\`tsx\n<APIEndpoint\n  method="POST"\n  path="/v1/generate"\n  description="Generate full-stack product"\n  auth="bearer"\n/>\n\`\`\`\n\n⚙️ Rate Limiting:\n\`\`\`typescript\nexport const rateLimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(100, '1m'),\n  prefix: '@upstash/ratelimit',\n});\n\`\`\`\n\n🔑 API key management + Analytics آماده.`,
};

function simSend(){
  const inp = document.getElementById('sim-inp');
  const chat = document.getElementById('sim-chat');
  const msg = inp.value.trim(); if(!msg) return; inp.value='';
  const prov = document.getElementById('sim-prov').value;
  const tpl = document.getElementById('sim-tpl').value||'saas';
  const stat = document.getElementById('sim-stat');
  const ud = document.createElement('div'); ud.className='pchat-msg user'; ud.textContent=msg; chat.appendChild(ud);
  stat.textContent = `▶ ${prov.toUpperCase()} PROCESSING...`; stat.style.color='var(--yellow)';
  const ad = document.createElement('div');
  const mode = document.getElementById('sim-mode').value;
  ad.className = 'pchat-msg ' + (mode==='frontend'?'fe':'ai');
  const modelName = simProvData[prov]?.models[0]||prov;
  ad.setAttribute('data-model', modelName);
  ad.innerHTML='<span class="typcur"></span>';
  chat.appendChild(ad); chat.scrollTop=9999;
  const resp = (simAIResps[tpl]||simAIResps.saas)(msg);
  const chars=resp.split(''); let i=0;
  ad.textContent='';
  const cur=document.createElement('span'); cur.className='typcur'; ad.appendChild(cur);
  const t=setInterval(()=>{
    if(i<chars.length){ const chunk=chars.slice(i,i+4).join(''); ad.insertBefore(document.createTextNode(chunk),cur); i+=4; chat.scrollTop=9999; }
    else{ cur.remove(); clearInterval(t); stat.textContent=`✓ DONE — ${modelName}`; stat.style.color='var(--green)'; }
  },18);
}
document.getElementById('sim-inp').addEventListener('keydown', e => { if(e.key==='Enter') simSend(); });
</script>
</body>
</html>
```