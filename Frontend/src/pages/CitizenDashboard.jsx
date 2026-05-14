import { useState, useEffect, useRef, useCallback } from "react";

// ─── CSS injected as a global style tag ───────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #191834;
  --surface: rgba(27,28,70,0.72);
  --surface2: rgba(37,38,88,0.65);
  --border: rgba(97,189,175,0.18);
  --accent: #61bdaf;
  --accent-glow: rgba(97,189,175,0.25);
  --accent2: #f59e0b;
  --accent3: #10b981;
  --red: #ef4444;
  --text: #e6edf3;
  --muted: #7d8590;
  --muted2: #4a5568;
  --card-shadow: 0 4px 24px rgba(0,0,0,0.4);
}

.janseva-root * { margin:0; padding:0; box-sizing:border-box; }

.janseva-root {
  font-family: 'Sora', sans-serif;
  background: #191834;
  background-image:
    radial-gradient(ellipse 80% 60% at 100% 0%, #61bdaf55 0%, transparent 55%),
    radial-gradient(ellipse 60% 70% at 0% 100%, #338aca44 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 50%, #26b7cd22 0%, transparent 60%),
    radial-gradient(ellipse 100% 80% at 100% 100%, #2b2c6855 0%, transparent 50%),
    linear-gradient(135deg, #191834 0%, #1e1f50 40%, #1a2a4a 70%, #191834 100%);
  background-attachment: fixed;
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.janseva-root::before {
  content:'';
  position:fixed; inset:0;
  background-image:
    linear-gradient(rgba(97,189,175,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(97,189,175,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events:none; z-index:0;
}

/* NAV */
.js-nav {
  position:sticky; top:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 2rem; height:60px;
  background: rgba(25,24,52,0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.js-nav-brand {
  display:flex; align-items:center; gap:.6rem;
  font-size:1.1rem; font-weight:700; color:var(--text);
  text-decoration:none; cursor:pointer;
}
.js-brand-icon {
  width:32px; height:32px;
  background: linear-gradient(135deg, #338aca, #61bdaf);
  border-radius:8px; display:grid; place-items:center;
  font-size:.8rem; overflow:hidden;
}
.js-nav-tabs {
  display:flex; gap:.25rem;
  background: var(--surface);
  padding:4px; border-radius:10px;
  border:1px solid var(--border);
}
.js-nav-tab {
  padding:.4rem 1rem; border-radius:7px;
  font-size:.82rem; font-weight:500; cursor:pointer;
  color:var(--muted); border:none; background:transparent;
  transition:all .2s; font-family:inherit;
}
.js-nav-tab.active { background:var(--accent); color:#fff; }
.js-nav-tab:hover:not(.active) { background:var(--accent); color:#fff; }
.js-nav-badge { display:flex; align-items:center; gap:.5rem; font-size:.8rem; color:var(--muted); }
.js-status-dot { width:8px; height:8px; border-radius:50%; background:var(--accent3); animation:jsPulse 2s infinite; }

@keyframes jsPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes jsFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* VIEWS */
.js-view { animation:jsFadeIn .3s ease; position:relative; z-index:1; }

/* SUBMIT LAYOUT */
.js-submit-layout {
  max-width:1100px; margin:0 auto;
  padding:2.5rem 2rem;
  display:grid; grid-template-columns:1fr 380px; gap:2rem;
}
.js-section-label {
  font-size:.7rem; font-weight:600; letter-spacing:.12em;
  text-transform:uppercase; color:var(--accent); margin-bottom:1rem;
}
.js-card {
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:16px; padding:1.5rem;
  box-shadow:var(--card-shadow);
}
.js-card-title { font-size:1.1rem; font-weight:600; margin-bottom:.3rem; }
.js-card-sub { font-size:.82rem; color:var(--muted); margin-bottom:1.5rem; }

.js-input-type-group { display:flex; gap:.5rem; margin-bottom:1.4rem; }
.js-type-btn {
  padding:.4rem .9rem; border-radius:20px;
  font-size:.82rem; font-weight:500; cursor:pointer;
  border:1px solid var(--border);
  background:transparent; color:var(--muted);
  transition:all .2s; font-family:inherit;
}
.js-type-btn.active { background:var(--accent); color:#fff; border-color:var(--accent); }

.js-form-label { font-size:.8rem; color:var(--muted); margin-bottom:.4rem; display:block; }
.js-form-select, .js-form-input, .js-form-textarea {
  width:100%; background:var(--surface2); border:1px solid var(--border);
  border-radius:10px; padding:.65rem .9rem;
  color:var(--text); font-family:inherit; font-size:.88rem;
  outline:none; transition:border .2s;
  margin-bottom:1.1rem;
}
.js-form-select:focus, .js-form-input:focus, .js-form-textarea:focus {
  border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow);
}
.js-form-textarea { resize:vertical; min-height:100px; line-height:1.6; }
.js-form-select option { background:#1e1f50; }

/* LOCATION */
.js-location-wrap { margin-bottom:1.1rem; }
.js-location-input-row { display:flex; gap:.5rem; align-items:center; }
.js-location-input-row .js-form-input { margin-bottom:0; flex:1; }
.js-locate-btn {
  flex-shrink:0; width:42px; height:42px;
  background: linear-gradient(135deg, #338aca, #61bdaf);
  border:none; border-radius:10px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 3px 10px rgba(97,189,175,0.35);
  font-size:1.15rem; transition:opacity .2s, transform .15s;
}
.js-locate-btn:hover { opacity:.88; transform:translateY(-1px); }
.js-loc-status { font-size:.75rem; color:var(--accent); margin-top:.3rem; display:flex; align-items:center; gap:.35rem; }
.js-loc-dot { width:7px; height:7px; border-radius:50%; background:var(--accent); flex-shrink:0; }

/* SUBMIT BTN */
.js-submit-btn {
  width:100%; padding:.8rem;
  background: linear-gradient(135deg, #61bdaf 0%, #338aca 60%, #26b7cd 100%);
  color:#fff;
  border:none; border-radius:12px;
  font-family:inherit; font-size:.95rem; font-weight:600;
  cursor:pointer; transition:all .2s;
  display:flex; align-items:center; justify-content:center; gap:.5rem;
  box-shadow: 0 5px 20px rgba(97,189,175,0.35);
}
.js-submit-btn:hover { opacity:0.9; transform:translateY(-1px); box-shadow:0 8px 24px rgba(97,189,175,0.45); }

/* RIGHT PANEL */
.js-panel-card { margin-bottom:1rem; }
.js-mini-stat-row { display:grid; grid-template-columns:1fr 1fr; gap:.8rem; margin-bottom:1rem; }
.js-mini-stat { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:1rem; text-align:center; }
.js-mini-stat-val { font-size:1.4rem; font-weight:700; }
.js-mini-stat-lbl { font-size:.72rem; color:var(--muted); margin-top:.2rem; }
.js-cat-row { display:flex; align-items:center; gap:.8rem; margin-bottom:.6rem; }
.js-cat-name { font-size:.82rem; min-width:90px; }
.js-cat-bar-wrap { flex:1; height:6px; background:var(--surface2); border-radius:3px; overflow:hidden; }
.js-cat-bar { height:100%; border-radius:3px; transition:width 1s ease; }
.js-cat-count { font-size:.78rem; color:var(--muted); min-width:28px; text-align:right; }

/* BADGE */
.js-badge { padding:.25rem .7rem; border-radius:20px; font-size:.72rem; font-weight:600; }
.js-badge-red { background:rgba(239,68,68,.15); color:#f87171; border:1px solid rgba(239,68,68,.3); }
.js-badge-green { background:rgba(16,185,129,.15); color:#34d399; border:1px solid rgba(16,185,129,.3); }
.js-badge-amber { background:rgba(245,158,11,.15); color:#fbbf24; border:1px solid rgba(245,158,11,.3); }
.js-badge-blue { background:rgba(97,189,175,.15); color:#61bdaf; border:1px solid rgba(97,189,175,.3); }

/* VOICE PANEL */
.js-voice-panel { display:none; flex-direction:column; gap:.8rem; margin-bottom:1rem; animation:jsFadeIn .3s; }
.js-voice-panel.active { display:flex; }
.js-voice-top { display:flex; justify-content:space-between; align-items:center; }
.js-voice-status { display:flex; align-items:center; gap:.5rem; font-size:.82rem; font-weight:500; }
.js-vrec-dot { width:10px; height:10px; border-radius:50%; background:var(--muted2); transition:background .3s; }
.js-vrec-dot.recording { background:#ef4444; animation:jsPulse 1s infinite; }
.js-vrec-dot.paused { background:var(--accent2); animation:none; }
.js-vrec-dot.done { background:var(--accent3); animation:none; }
.js-voice-timer { font-family:'JetBrains Mono',monospace; font-size:.82rem; color:var(--muted); }
.js-waveform-wrap { position:relative; height:56px; border-radius:10px; overflow:hidden; background:rgba(0,0,0,.2); }
.js-wave-bars-row { display:flex; gap:3px; align-items:center; justify-content:center; height:100%; }
.js-wave-bar-item { width:3px; background:var(--accent); border-radius:2px; height:4px; transition:height 0.1s; flex-shrink:0; }
.js-wave-bar-item.active { animation:jsWaveBar 0.6s ease-in-out infinite alternate; }
.js-wave-bar-item.done { background:var(--accent3); animation:none !important; }
@keyframes jsWaveBar { from{height:4px} to{height:44px} }
.js-wave-bar-item:nth-child(2n).active { animation-delay:0.08s; }
.js-wave-bar-item:nth-child(3n).active { animation-delay:0.18s; }
.js-wave-bar-item:nth-child(4n).active { animation-delay:0.04s; }
.js-wave-bar-item:nth-child(5n).active { animation-delay:0.14s; }
.js-wave-bar-item:nth-child(7n).active { animation-delay:0.22s; }

.js-voice-controls { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
.js-vbtn {
  display:flex; align-items:center; justify-content:center; gap:.35rem;
  padding:.45rem .9rem; border-radius:10px;
  font-size:.78rem; font-weight:600; cursor:pointer;
  border:1px solid var(--border); background:var(--surface);
  color:var(--text); font-family:inherit; transition:all .2s;
}
.js-vbtn:hover:not(:disabled) { border-color:var(--accent); color:var(--accent); }
.js-vbtn.rec { background:#ef4444; border-color:#ef4444; color:#fff; }
.js-vbtn.pause { background:var(--accent2); border-color:var(--accent2); color:#000; }
.js-vbtn.stop { background:var(--surface2); }
.js-vbtn.play { background:var(--accent3); border-color:var(--accent3); color:#fff; }
.js-vbtn.danger { color:#f87171; border-color:rgba(239,68,68,.3); }
.js-vbtn:disabled { opacity:.35; cursor:not-allowed; pointer-events:none; }

.js-audio-player {
  display:flex; align-items:center; gap:.7rem;
  background:rgba(16,185,129,.06); border:1px solid rgba(16,185,129,.2);
  border-radius:10px; padding:.6rem .9rem; animation:jsFadeIn .3s;
}
.js-ap-icon { font-size:1rem; cursor:pointer; }
.js-ap-track { flex:1; height:4px; background:var(--border); border-radius:2px; cursor:pointer; position:relative; }
.js-ap-fill { height:100%; background:var(--accent3); border-radius:2px; transition:width .1s linear; }
.js-ap-time { font-family:'JetBrains Mono',monospace; font-size:.72rem; color:var(--muted); white-space:nowrap; }
.js-voice-transcript {
  font-size:.82rem; color:var(--muted); font-style:italic;
  padding:.5rem .7rem; background:rgba(97,189,175,.06);
  border-left:3px solid var(--accent); border-radius:0 6px 6px 0;
  animation:jsFadeIn .3s;
}

/* IMAGE PANEL */
.js-image-panel { display:none; flex-direction:column; gap:.8rem; margin-bottom:1rem; animation:jsFadeIn .3s; }
.js-image-panel.active { display:flex; }
.js-img-source-row { display:flex; gap:.6rem; }
.js-img-src-btn {
  flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:.4rem; padding:.9rem; border-radius:12px;
  border:1.5px dashed var(--border); background:var(--surface2);
  cursor:pointer; font-family:inherit; color:var(--muted);
  font-size:.78rem; font-weight:500; transition:all .2s;
}
.js-img-src-btn:hover { border-color:var(--accent); color:var(--accent); background:rgba(97,189,175,.06); }
.js-ib-icon { font-size:1.5rem; }
.js-img-preview-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.6rem; }
.js-img-thumb {
  position:relative; aspect-ratio:1; border-radius:10px; overflow:hidden;
  border:1px solid var(--border); background:var(--surface2);
}
.js-img-thumb img { width:100%; height:100%; object-fit:cover; }
.js-rm-btn {
  position:absolute; top:4px; right:4px;
  width:20px; height:20px; border-radius:50%;
  background:rgba(0,0,0,.7); border:none; color:#fff;
  font-size:.65rem; cursor:pointer; display:grid; place-items:center;
}

/* TRACK VIEW */
.js-track-layout { max-width:1080px; margin:0 auto; padding:2.5rem 2rem; }
.js-track-title { font-size:1.6rem; font-weight:700; }
.js-track-sub { font-size:.88rem; color:var(--muted); margin-top:.3rem; }
.js-track-kpi-strip {
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:.85rem; margin-bottom:1.8rem;
}
.js-track-kpi {
  background:var(--surface); border:1px solid var(--border);
  border-radius:14px; padding:1rem 1.2rem;
  display:flex; align-items:center; gap:.85rem;
  transition:border-color .2s, transform .2s; cursor:default;
}
.js-track-kpi:hover { border-color:var(--accent); transform:translateY(-2px); }
.js-track-kpi-icon {
  width:40px; height:40px; border-radius:10px;
  display:grid; place-items:center; font-size:1.1rem; flex-shrink:0;
}
.js-track-kpi-icon.amber { background:rgba(245,158,11,.14); }
.js-track-kpi-icon.blue { background:rgba(97,189,175,.14); }
.js-track-kpi-icon.green { background:rgba(16,185,129,.14); }
.js-track-kpi-val { font-size:1.5rem; font-weight:700; line-height:1; }
.js-track-kpi-lbl { font-size:.71rem; color:var(--muted); margin-top:.18rem; letter-spacing:.04em; }
.js-track-toolbar { display:flex; align-items:center; gap:.6rem; margin-bottom:1.2rem; flex-wrap:wrap; }
.js-track-search-wrap { flex:1; min-width:200px; position:relative; }
.js-search-icon { position:absolute; left:.75rem; top:50%; transform:translateY(-50%); color:var(--muted); font-size:.9rem; }
.js-track-search {
  width:100%; padding:.55rem .9rem .55rem 2.2rem;
  background:var(--surface2); border:1px solid var(--border);
  border-radius:10px; color:var(--text);
  font-family:inherit; font-size:.83rem; outline:none; transition:border .2s;
}
.js-track-search:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
.js-track-filter-btn {
  padding:.55rem 1rem; border-radius:10px;
  border:1px solid var(--border); background:var(--surface2);
  color:var(--muted); font-family:inherit; font-size:.82rem;
  cursor:pointer; transition:all .2s; white-space:nowrap;
}
.js-track-filter-btn.active, .js-track-filter-btn:hover { border-color:var(--accent); color:var(--accent); background:rgba(97,189,175,.07); }
.js-track-table-wrap {
  background:var(--surface); border:1px solid var(--border);
  border-radius:16px; overflow:hidden; box-shadow:var(--card-shadow);
}
.js-track-table-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:1rem 1.4rem; border-bottom:1px solid var(--border);
  background:var(--surface2);
}
.js-track-table-title { font-size:.9rem; font-weight:600; }
.js-track-table-count { font-size:.75rem; color:var(--muted); }
.js-track-tbl { width:100%; border-collapse:collapse; min-width:700px; }
.js-track-tbl thead { background:rgba(97,189,175,.05); }
.js-track-tbl th {
  padding:.7rem 1.1rem; text-align:left; font-size:.69rem; font-weight:700;
  color:var(--muted); text-transform:uppercase; letter-spacing:.1em;
  border-bottom:1px solid var(--border); white-space:nowrap;
}
.js-track-tbl th:last-child { text-align:center; }
.js-track-tbl tbody tr { border-bottom:1px solid var(--border); transition:background .18s; cursor:pointer; }
.js-track-tbl tbody tr:last-child { border-bottom:none; }
.js-track-tbl tbody tr:hover { background:rgba(97,189,175,.05); }
.js-track-tbl td { padding:.9rem 1.1rem; font-size:.83rem; vertical-align:middle; }
.js-track-tbl td:last-child { text-align:center; }
.js-tbl-grv-id {
  font-family:'JetBrains Mono',monospace; font-size:.72rem; color:var(--accent);
  background:rgba(97,189,175,.08); padding:.25rem .55rem; border-radius:6px;
  border:1px solid rgba(97,189,175,.2); white-space:nowrap; display:inline-block;
}
.js-tbl-name { font-weight:600; color:var(--text); }
.js-tbl-cat-wrap { display:flex; align-items:center; gap:.5rem; }
.js-tbl-cat-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.js-tbl-dept { font-size:.75rem; color:var(--muted); margin-top:.15rem; }
.js-priority-pill {
  padding:.22rem .65rem; border-radius:20px; font-size:.7rem;
  font-weight:700; letter-spacing:.04em; display:inline-block;
}
.js-priority-pill.high { background:rgba(239,68,68,.14); color:#f87171; border:1px solid rgba(239,68,68,.3); }
.js-priority-pill.medium { background:rgba(245,158,11,.14); color:#fbbf24; border:1px solid rgba(245,158,11,.3); }
.js-priority-pill.low { background:rgba(16,185,129,.14); color:#34d399; border:1px solid rgba(16,185,129,.3); }
.js-status-badge { padding:.3rem .8rem; border-radius:20px; font-size:.72rem; font-weight:600; white-space:nowrap; }
.js-status-badge.progress { background:rgba(245,158,11,.15); color:#fbbf24; border:1px solid rgba(245,158,11,.3); }
.js-status-badge.assigned { background:rgba(97,189,175,.15); color:#61bdaf; border:1px solid rgba(97,189,175,.3); }
.js-status-badge.resolved { background:rgba(16,185,129,.15); color:#34d399; border:1px solid rgba(16,185,129,.3); }
.js-tbl-action-btn {
  padding:.3rem .75rem; border-radius:8px;
  border:1px solid var(--border); background:var(--surface2);
  color:var(--muted); font-family:inherit; font-size:.75rem;
  font-weight:500; cursor:pointer; transition:all .2s;
}
.js-tbl-action-btn:hover { border-color:var(--accent); color:var(--accent); }
.js-track-expand-cell {
  padding:0 1.1rem 1.1rem; background:rgba(97,189,175,.035);
  border-bottom:1px solid var(--border);
}
.js-expand-inner { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; padding:.85rem 0 .1rem; }
.js-expand-lbl { font-size:.68rem; color:var(--muted); text-transform:uppercase; letter-spacing:.09em; margin-bottom:.25rem; }
.js-expand-val { font-size:.82rem; font-weight:500; }
.js-expand-timeline {
  grid-column:1/-1; display:flex; align-items:center;
  margin-top:.6rem; padding-top:.8rem; border-top:1px solid var(--border);
}
.js-tl-step { flex:1; display:flex; flex-direction:column; align-items:center; position:relative; }
.js-tl-connector {
  position:absolute; top:10px; left:50%; width:100%; height:2px;
  background:var(--border); z-index:0;
}
.js-tl-connector.done { background:var(--accent3); }
.js-tl-dot {
  width:20px; height:20px; border-radius:50%;
  border:2px solid var(--border); background:var(--surface);
  display:grid; place-items:center; font-size:.6rem;
  position:relative; z-index:1; transition:all .2s;
}
.js-tl-step.done .js-tl-dot { background:var(--accent3); border-color:var(--accent3); color:#fff; }
.js-tl-step.active .js-tl-dot { background:var(--accent2); border-color:var(--accent2); animation:jsPulse 1.5s infinite; }
.js-tl-label { font-size:.64rem; color:var(--muted); margin-top:.35rem; text-align:center; }
.js-tl-step.done .js-tl-label, .js-tl-step.active .js-tl-label { color:var(--text); }
.js-track-empty { text-align:center; padding:3rem 1rem; color:var(--muted); font-size:.88rem; }
.js-track-empty-icon { font-size:2.5rem; margin-bottom:.6rem; }

/* ADMIN VIEW */
.js-admin-layout { max-width:1200px; margin:0 auto; padding:2.5rem 2rem; }
.js-admin-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
.js-admin-title { font-size:1.5rem; font-weight:700; }
.js-admin-sub { font-size:.85rem; color:var(--muted); margin-top:.25rem; }
.js-admin-actions { display:flex; gap:.6rem; }
.js-btn-sm {
  padding:.4rem .9rem; border-radius:8px; font-size:.8rem; font-weight:500; cursor:pointer;
  border:1px solid var(--border); background:var(--surface2);
  color:var(--text); font-family:inherit; transition:all .2s;
}
.js-btn-sm:hover { border-color:var(--accent); color:var(--accent); }
.js-btn-sm.primary { background:var(--accent); border-color:var(--accent); color:#fff; }
.js-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:2rem; }
.js-stat-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.2rem; }
.js-stat-card-label { font-size:.72rem; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.5rem; }
.js-stat-card-val { font-size:1.9rem; font-weight:700; line-height:1; }
.js-stat-card-sub { font-size:.75rem; color:var(--muted); margin-top:.3rem; }
.js-stat-trend-up { color:var(--accent3); }
.js-stat-trend-down { color:var(--red); }
.js-admin-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:1.5rem; }
.js-table-wrap { overflow:hidden; border-radius:14px; border:1px solid var(--border); background:var(--surface); }
.js-admin-tbl { width:100%; border-collapse:collapse; }
.js-admin-tbl thead { background:var(--surface2); }
.js-admin-tbl th { padding:.7rem 1rem; text-align:left; font-size:.72rem; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; }
.js-admin-tbl td { padding:.75rem 1rem; font-size:.83rem; border-top:1px solid var(--border); }
.js-admin-tbl tr:hover td { background:rgba(255,255,255,.02); }
.js-tbl-id { font-family:'JetBrains Mono',monospace; font-size:.72rem; color:var(--muted2); }
.js-priority-high { color:#f87171; }
.js-priority-medium { color:#fbbf24; }
.js-priority-low { color:#34d399; }
.js-chart-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.4rem; }
.js-chart-title { font-size:.9rem; font-weight:600; margin-bottom:1.2rem; }
.js-bar-chart { display:flex; flex-direction:column; gap:.8rem; }
.js-bar-row { display:flex; align-items:center; gap:.8rem; }
.js-bar-label { font-size:.8rem; min-width:80px; color:var(--muted); }
.js-bar-track { flex:1; height:8px; background:var(--surface2); border-radius:4px; overflow:hidden; }
.js-bar-fill { height:100%; border-radius:4px; }
.js-bar-num { font-size:.78rem; font-weight:500; min-width:28px; text-align:right; }
.js-donut-wrap { display:flex; align-items:center; justify-content:center; flex-direction:column; gap:1rem; }
.js-donut-legend { display:flex; flex-direction:column; gap:.5rem; width:100%; }
.js-legend-item { display:flex; align-items:center; gap:.5rem; font-size:.8rem; }
.js-legend-dot { width:10px; height:10px; border-radius:3px; flex-shrink:0; }
.js-legend-pct { margin-left:auto; color:var(--muted); font-size:.75rem; }

/* TOAST */
.js-toast {
  position:fixed; bottom:2rem; right:2rem; z-index:200;
  background: rgba(27,28,70,0.96);
  border:1px solid var(--border);
  border-radius:14px; padding:.9rem 1.2rem;
  display:flex; align-items:center; gap:.8rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45);
  backdrop-filter:blur(16px);
  transform:translateY(100px); opacity:0;
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .3s;
  pointer-events:none; min-width:260px;
}
.js-toast.show { transform:translateY(0); opacity:1; }
.js-toast-icon { font-size:1.3rem; }
.js-toast-title { font-size:.88rem; font-weight:600; }
.js-toast-sub { font-size:.75rem; color:var(--muted); margin-top:.1rem; }

@media(max-width:900px){
  .js-submit-layout { grid-template-columns:1fr; }
  .js-stats-row { grid-template-columns:repeat(2,1fr); }
  .js-admin-grid { grid-template-columns:1fr; }
  .js-track-kpi-strip { grid-template-columns:repeat(2,1fr); }
  .js-expand-inner { grid-template-columns:1fr 1fr; }
}
@media(max-width:640px){
  .js-nav { padding:0 1rem; }
  .js-submit-layout { padding:1.5rem 1rem; }
  .js-track-layout { padding:1.5rem 1rem; }
  .js-admin-layout { padding:1.5rem 1rem; }
  .js-track-kpi-strip { gap:.6rem; }
  .js-track-kpi { padding:.75rem .9rem; }
  .js-track-kpi-val { font-size:1.25rem; }
  .js-track-table-wrap { overflow-x:auto; }
}
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Water Supply", count: 412, color: "#61bdaf", pct: 82 },
  { name: "Roads",        count: 298, color: "#f59e0b", pct: 60 },
  { name: "Electricity",  count: 201, color: "#10b981", pct: 40 },
  { name: "Sanitation",   count: 189, color: "#8b5cf6", pct: 38 },
  { name: "Others",       count: 148, color: "#6b7280", pct: 30 },
];

const TRACK_COMPLAINTS = [
  {
    id: "GRV-2024-0841", name: "Rajesh Kumar", cat: "Water Supply",
    catColor: "#61bdaf", dept: "Jal Board", dateSubmitted: "12 Jan 2024",
    status: "progress", statusTxt: "In Progress", priority: "High", pct: 62,
    location: "Arera Colony, Bhopal", description: "No water supply for 3 days",
    timeline: ["Filed","Received","Assigned","In Progress","Resolved"], timelineActive: 3,
  },
  {
    id: "GRV-2024-0799", name: "Sunita Sharma", cat: "Road Damage",
    catColor: "#f59e0b", dept: "PWD Department", dateSubmitted: "10 Jan 2024",
    status: "assigned", statusTxt: "Assigned", priority: "Medium", pct: 30,
    location: "MP Nagar Zone-II", description: "Large pothole causing accidents",
    timeline: ["Filed","Received","Assigned","In Progress","Resolved"], timelineActive: 2,
  },
  {
    id: "GRV-2024-0750", name: "Mohan Verma", cat: "Streetlight",
    catColor: "#10b981", dept: "Electricity Dept", dateSubmitted: "08 Jan 2024",
    status: "resolved", statusTxt: "Resolved", priority: "Low", pct: 100,
    location: "Kolar Road, Sector 3", description: "Streetlight not working for 2 days",
    timeline: ["Filed","Received","Assigned","In Progress","Resolved"], timelineActive: 4,
  },
];

const TABLE_ROWS = [
  { id:"GRV-2024-0841", cat:"Water Supply", dist:"Arera Colony", priority:"High",   status:"progress", statusTxt:"In Progress" },
  { id:"GRV-2024-0840", cat:"Road Damage",  dist:"MP Nagar",     priority:"Medium", status:"assigned", statusTxt:"Assigned"    },
  { id:"GRV-2024-0839", cat:"Electricity",  dist:"Kolar Road",   priority:"Low",    status:"resolved", statusTxt:"Resolved"    },
  { id:"GRV-2024-0838", cat:"Sanitation",   dist:"Habibganj",    priority:"High",   status:"progress", statusTxt:"In Progress" },
  { id:"GRV-2024-0837", cat:"Water Supply", dist:"Tulsi Nagar",  priority:"Medium", status:"assigned", statusTxt:"Assigned"    },
];

const FAKE_TRANSCRIPTS = [
  "हमारे मोहल्ले में पिछले 3 दिनों से पानी नहीं आ रहा है।",
  "सड़क पर बड़ा गड्ढा है जिससे दुर्घटना का खतरा है।",
];

const LANG_PH = {
  hi: "हमारे मोहल्ले में पिछले 3 दिनों से पानी नहीं आ रहा है।",
  en: "There has been no water supply in our area for 3 days.",
  mr: "आमच्या परिसरात ३ दिवसांपासून पाणी नाही.",
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function WaveBars({ state }) {
  const bars = Array.from({ length: 52 }, (_, i) => i);
  return (
    <div className="js-wave-bars-row">
      {bars.map((i) => {
        const baseH = (Math.abs(Math.sin(i * 0.4 + 0.7)) * 38 + 4).toFixed(0);
        const cls = state === "recording"
          ? "js-wave-bar-item active"
          : state === "done"
          ? "js-wave-bar-item done"
          : "js-wave-bar-item";
        const h = state === "done" ? baseH : (Math.random() * 3 + 3).toFixed(1);
        return (
          <div
            key={i}
            className={cls}
            style={{ height: state === "idle" ? "4px" : undefined }}
          />
        );
      })}
    </div>
  );
}

function CategoryBarChart({ id = "catChart" }) {
  return (
    <div className="js-bar-chart">
      {CATEGORIES.map((c) => (
        <div className="js-cat-row" key={c.name}>
          <span className="js-cat-name">{c.name}</span>
          <div className="js-cat-bar-wrap">
            <div className="js-cat-bar" style={{ width: `${c.pct}%`, background: c.color }} />
          </div>
          <span className="js-cat-count">{c.count}</span>
        </div>
      ))}
    </div>
  );
}

function AdminBarChart() {
  return (
    <div className="js-bar-chart">
      {CATEGORIES.map((c) => (
        <div className="js-bar-row" key={c.name}>
          <span className="js-bar-label">{c.name}</span>
          <div className="js-bar-track">
            <div className="js-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
          </div>
          <span className="js-bar-num">{c.count}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div className="js-donut-wrap">
      <svg viewBox="0 0 120 120" width="120" height="120">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#1e2530" strokeWidth="16" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="16"
          strokeDasharray="282.7" strokeDashoffset="56.5" strokeLinecap="round"
          transform="rotate(-90 60 60)" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#61bdaf" strokeWidth="16"
          strokeDasharray="282.7" strokeDashoffset="84.8" strokeLinecap="round"
          transform="rotate(-162 60 60)" />
        <text x="60" y="63" textAnchor="middle" fill="#e6edf3" fontSize="18" fontWeight="700" fontFamily="Sora">80%</text>
      </svg>
      <div className="js-donut-legend">
        <div className="js-legend-item"><div className="js-legend-dot" style={{ background: "#10b981" }} /> Resolved <span className="js-legend-pct">80%</span></div>
        <div className="js-legend-item"><div className="js-legend-dot" style={{ background: "#61bdaf" }} /> In Progress <span className="js-legend-pct">13%</span></div>
        <div className="js-legend-item"><div className="js-legend-dot" style={{ background: "#4a5568" }} /> Pending <span className="js-legend-pct">7%</span></div>
      </div>
    </div>
  );
}

function TimelineRow({ timeline, timelineActive }) {
  return (
    <div className="js-expand-timeline">
      {timeline.map((step, si) => {
        const isDone = si < timelineActive;
        const isActive = si === timelineActive;
        const cls = `js-tl-step${isDone ? " done" : isActive ? " active" : ""}`;
        return (
          <div className={cls} key={step}>
            {si < timeline.length - 1 && (
              <div className={`js-tl-connector${isDone ? " done" : ""}`} />
            )}
            <div className="js-tl-dot">{isDone ? "✓" : isActive ? "●" : ""}</div>
            <div className="js-tl-label">{step}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <div className={`js-toast${toast.visible ? " show" : ""}`} id="js-toast">
      <div className="js-toast-icon">{toast.icon}</div>
      <div className="js-toast-text">
        <div className="js-toast-title">{toast.title}</div>
        <div className="js-toast-sub">{toast.sub}</div>
      </div>
    </div>
  );
}

// ─── SUBMIT VIEW ──────────────────────────────────────────────────────────────
function SubmitView({ showToast }) {
  const [inputType, setInputType] = useState("text");
  const [lang, setLang] = useState("hi");
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState("");
  const [locPinned, setLocPinned] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Voice state
  const [voiceState, setVoiceState] = useState("idle"); // idle | recording | paused | done
  const [recSeconds, setRecSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [audioProgress, setAudioProgress] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recIntervalRef = useRef(null);
  const playbackAudioRef = useRef(null);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const placeholder = inputType === "text"
    ? (LANG_PH[lang] || LANG_PH.en)
    : inputType === "voice"
    ? "Voice transcript will appear here after recording…"
    : "Describe your uploaded image or let it speak for itself…";

  // Voice recording
  const voiceRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setVoiceState("done");
        setTranscript(FAKE_TRANSCRIPTS[Math.floor(Math.random() * FAKE_TRANSCRIPTS.length)]);
      };
      mr.start();
      setVoiceState("recording");
      setRecSeconds(0);
      recIntervalRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      showToast("⚠️", "Mic Error", "Could not access microphone.");
    }
  };

  const voicePause = () => {
    if (!mediaRecorderRef.current) return;
    if (voiceState === "recording") {
      mediaRecorderRef.current.pause();
      clearInterval(recIntervalRef.current);
      setVoiceState("paused");
    } else if (voiceState === "paused") {
      mediaRecorderRef.current.resume();
      recIntervalRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
      setVoiceState("recording");
    }
  };

  const voiceStop = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    clearInterval(recIntervalRef.current);
  };

  const voiceDiscard = () => {
    clearInterval(recIntervalRef.current);
    setVoiceState("idle");
    setAudioBlob(null);
    setRecSeconds(0);
    setTranscript("");
    setAudioProgress(0);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImages((prev) => [...prev.slice(0, 5), ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx) => setUploadedImages((prev) => prev.filter((_, i) => i !== idx));

  const submitGrievance = () => {
    if (!complaint.trim() && !audioBlob && uploadedImages.length === 0) {
      showToast("⚠️", "Validation Error", "Please provide your complaint via text, voice, or image.");
      return;
    }
    showToast("✅", "Grievance Filed", `#GRV-2024-0${Math.floor(Math.random() * 900 + 100)} submitted`);
    setComplaint("");
    voiceDiscard();
    setUploadedImages([]);
  };

  const autoDetectLocation = () => {
    if (!navigator.geolocation) { showToast("⚠️", "Not Supported", "Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocPinned(true);
        showToast("📍", "Location Detected", "Your location has been pinned.");
      },
      () => showToast("⚠️", "Location Error", "Could not get your location."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="js-view">
      <div className="js-submit-layout">
        {/* LEFT: Form */}
        <div>
          <div className="js-section-label">✦ New Grievance</div>
          <div className="js-card">
            <div className="js-card-title">File a New Grievance</div>
            <div className="js-card-sub">Submit your complaint and it will be routed to the relevant department</div>

            {/* Input Type */}
            <label className="js-form-label">Input type</label>
            <div className="js-input-type-group">
              {["text", "voice", "image"].map((t) => (
                <button
                  key={t}
                  className={`js-type-btn${inputType === t ? " active" : ""}`}
                  onClick={() => setInputType(t)}
                >
                  {t === "text" ? "Text" : t === "voice" ? "🎙 Voice" : "📷 Image"}
                </button>
              ))}
            </div>

            {/* Voice Panel */}
            <div className={`js-voice-panel${inputType === "voice" ? " active" : ""}`}>
              <div className="js-voice-top">
                <div className="js-voice-status">
                  <div className={`js-vrec-dot ${voiceState === "recording" ? "recording" : voiceState === "paused" ? "paused" : voiceState === "done" ? "done" : ""}`} />
                  <span>
                    {voiceState === "idle" ? "Ready to record" : voiceState === "recording" ? "Recording…" : voiceState === "paused" ? "Paused" : "Recording done"}
                  </span>
                </div>
                <span className="js-voice-timer">{fmtTime(recSeconds)}</span>
              </div>
              <div className="js-waveform-wrap">
                <WaveBars state={voiceState} />
              </div>
              <div className="js-voice-controls">
                <button className="js-vbtn rec" onClick={voiceRecord} disabled={voiceState === "recording" || voiceState === "paused"}>🎙 Record</button>
                <button className="js-vbtn pause" onClick={voicePause} disabled={voiceState === "idle" || voiceState === "done"}>
                  {voiceState === "paused" ? "▶ Resume" : "⏸ Pause"}
                </button>
                <button className="js-vbtn stop" onClick={voiceStop} disabled={voiceState === "idle" || voiceState === "done"}>⏹ Stop</button>
                <button className="js-vbtn danger" onClick={voiceDiscard} disabled={voiceState === "idle"}>🗑 Discard</button>
              </div>
              {transcript && <div className="js-voice-transcript">{transcript}</div>}
            </div>

            {/* Image Panel */}
            <div className={`js-image-panel${inputType === "image" ? " active" : ""}`}>
              <div className="js-img-source-row">
                <button className="js-img-src-btn" onClick={() => fileInputRef.current?.click()}>
                  <span className="js-ib-icon">🖼️</span> Upload Photo
                </button>
                <button className="js-img-src-btn" onClick={() => showToast("📷", "Camera", "Camera requires HTTPS and device support.")}>
                  <span className="js-ib-icon">📷</span> Open Camera
                </button>
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" multiple style={{ display: "none" }} onChange={handleFileUpload} />
              {uploadedImages.length > 0 && (
                <div className="js-img-preview-grid">
                  {uploadedImages.map((src, i) => (
                    <div className="js-img-thumb" key={i}>
                      <img src={src} alt={`upload-${i}`} />
                      <button className="js-rm-btn" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Language */}
            <label className="js-form-label">Language</label>
            <select className="js-form-select" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="hi">Hindi / हिंदी</option>
              <option value="en">English</option>
              <option value="mr">Marathi / मराठी</option>
            </select>

            {/* Describe */}
            <label className="js-form-label">Describe your issue</label>
            <textarea
              className="js-form-textarea"
              placeholder={placeholder}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />

            {/* Location */}
            <label className="js-form-label">📍 Location</label>
            <div className="js-location-wrap">
              <div className="js-location-input-row">
                <input
                  className="js-form-input"
                  type="text"
                  placeholder="Search address or click 📍 to auto-detect…"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button className="js-locate-btn" onClick={autoDetectLocation} title="Auto-detect my location">📍</button>
              </div>
              {locPinned && (
                <div className="js-loc-status">
                  <span className="js-loc-dot" />
                  <span>Location pinned: {location}</span>
                </div>
              )}
            </div>

            <button className="js-submit-btn" onClick={submitGrievance}>
              Submit Grievance →
            </button>
          </div>
        </div>

        {/* RIGHT: Stats */}
        <div>
          <div className="js-section-label">✦ Zone Stats</div>
          <div className="js-mini-stat-row">
            <div className="js-mini-stat">
              <div className="js-mini-stat-val" style={{ color: "var(--accent)" }}>1,248</div>
              <div className="js-mini-stat-lbl">Total Today</div>
            </div>
            <div className="js-mini-stat">
              <div className="js-mini-stat-val" style={{ color: "var(--red)" }}>87</div>
              <div className="js-mini-stat-lbl">High Priority</div>
            </div>
          </div>
          <div className="js-mini-stat-row">
            <div className="js-mini-stat">
              <div className="js-mini-stat-val" style={{ color: "var(--accent2)" }}>5.2h</div>
              <div className="js-mini-stat-lbl">Avg. Resolution</div>
            </div>
          </div>

          <div className="js-card js-panel-card">
            <div className="js-section-label">Complaints by Category</div>
            <CategoryBarChart />
          </div>

          <div className="js-card js-panel-card" style={{ fontSize: ".82rem", color: "var(--muted)", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: ".4rem" }}>📌 Bhopal Zone Coverage</div>
            All complaints are routed to the relevant department automatically. Average response time has improved by{" "}
            <span style={{ color: "var(--accent3)" }}>38%</span> since deployment.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRACK VIEW ───────────────────────────────────────────────────────────────
function TrackView({ showToast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});

  const filtered = TRACK_COMPLAINTS.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchQ = !q || c.id.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)
      || c.dept.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const toggleExpand = (i) => setExpandedRows((prev) => ({ ...prev, [i]: !prev[i] }));

  const kpis = [
    { icon: "📋", val: "15", lbl: "Total Filed", cls: "amber", color: undefined },
    { icon: "⏳", val: "2",  lbl: "In Progress", cls: "amber", color: "var(--accent2)" },
    { icon: "🔵", val: "1",  lbl: "Assigned",    cls: "blue",  color: "var(--accent)"  },
    { icon: "✅", val: "12", lbl: "Resolved",    cls: "green", color: "var(--accent3)" },
  ];

  return (
    <div className="js-view">
      <div className="js-track-layout">
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="js-section-label">✦ My Complaints</div>
          <div className="js-track-title">Track Grievance Status</div>
          <div className="js-track-sub">
            Bhopal Zone &nbsp;·&nbsp; Citizen ID:{" "}
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--accent)", fontSize: ".82rem" }}>
              MP-BPL-20248821
            </span>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="js-track-kpi-strip">
          {kpis.map((k) => (
            <div className="js-track-kpi" key={k.lbl}>
              <div className={`js-track-kpi-icon ${k.cls}`}>{k.icon}</div>
              <div>
                <div className="js-track-kpi-val" style={k.color ? { color: k.color } : {}}>{k.val}</div>
                <div className="js-track-kpi-lbl">{k.lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="js-track-toolbar">
          <div className="js-track-search-wrap">
            <span className="js-search-icon">🔍</span>
            <input
              className="js-track-search"
              type="text"
              placeholder="Search by ID, category, department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {["all","progress","assigned","resolved"].map((s) => (
            <button
              key={s}
              className={`js-track-filter-btn${statusFilter === s ? " active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s === "progress" ? "In Progress" : s === "assigned" ? "Assigned" : "Resolved"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="js-track-table-wrap">
          <div className="js-track-table-header">
            <div className="js-track-table-title">Grievance Records</div>
            <div className="js-track-table-count">Showing {filtered.length} of {TRACK_COMPLAINTS.length} grievances</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="js-track-tbl">
              <thead>
                <tr>
                  <th>Grievance ID</th><th>Name</th><th>Category</th>
                  <th>Location</th><th>Address</th><th>Priority</th>
                  <th>Status</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <div className="js-track-empty">
                        <div className="js-track-empty-icon">📂</div>No grievances found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <>
                      <tr key={c.id} onClick={() => toggleExpand(i)}>
                        <td><span className="js-tbl-grv-id">#{c.id}</span></td>
                        <td><div className="js-tbl-name">{c.name}</div></td>
                        <td>
                          <div className="js-tbl-cat-wrap">
                            <div className="js-tbl-cat-dot" style={{ background: c.catColor }} />
                            <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>{c.cat}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: ".82rem" }}>{c.location}</td>
                        <td style={{ fontSize: ".78rem", color: "var(--muted)" }}>{c.dept}</td>
                        <td><span className={`js-priority-pill ${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                        <td><span className={`js-status-badge ${c.status}`}>{c.statusTxt}</span></td>
                        <td style={{ fontSize: ".8rem", whiteSpace: "nowrap" }}>{c.dateSubmitted}</td>
                        <td>
                          <button className="js-tbl-action-btn"
                            onClick={(e) => { e.stopPropagation(); showToast("📋", "Details", `Viewing full details for #${c.id}`); }}>
                            View ↗
                          </button>
                        </td>
                      </tr>
                      {expandedRows[i] && (
                        <tr key={`exp-${c.id}`}>
                          <td className="js-track-expand-cell" colSpan="9">
                            <div className="js-expand-inner">
                              <div>
                                <div className="js-expand-lbl">Description</div>
                                <div className="js-expand-val">{c.description}</div>
                              </div>
                              <div>
                                <div className="js-expand-lbl">Location</div>
                                <div className="js-expand-val">📍 {c.location}</div>
                              </div>
                              <div>
                                <div className="js-expand-lbl">Assigned Department</div>
                                <div className="js-expand-val">🏛 {c.dept}</div>
                              </div>
                              <TimelineRow timeline={c.timeline} timelineActive={c.timelineActive} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
function AdminView({ showToast }) {
  return (
    <div className="js-view">
      <div className="js-admin-layout">
        <div className="js-admin-header">
          <div>
            <div className="js-section-label">✦ Admin Panel</div>
            <div className="js-admin-title">Admin / Govt. Dashboard</div>
            <div className="js-admin-sub">Today — Bhopal Zone · Last updated 2 min ago</div>
          </div>
          <div className="js-admin-actions">
            <button className="js-btn-sm" onClick={() => showToast("📥", "Export Started", "CSV file will download shortly.")}>⬇ Export</button>
            <button className="js-btn-sm" onClick={() => showToast("🔔", "3 Critical Alerts", "High priority: Water Supply, Roads, Power Outage")}>
              🔔 Alerts{" "}
              <span style={{ background: "var(--red)", color: "#fff", borderRadius: "10px", padding: ".1rem .4rem", fontSize: ".65rem", marginLeft: ".2rem" }}>2</span>
            </button>
            <button className="js-btn-sm primary">+ Assign</button>
          </div>
        </div>

        {/* Stats */}
        <div className="js-stats-row">
          <div className="js-stat-card">
            <div className="js-stat-card-label">Total Today</div>
            <div className="js-stat-card-val">1,248</div>
            <div className="js-stat-card-sub js-stat-trend-up">↑ 12% vs yesterday</div>
          </div>
          <div className="js-stat-card">
            <div className="js-stat-card-label">High Priority</div>
            <div className="js-stat-card-val" style={{ color: "var(--red)" }}>87</div>
            <div className="js-stat-card-sub js-stat-trend-down">↑ 5 since morning</div>
          </div>
          <div className="js-stat-card">
            <div className="js-stat-card-label">Avg. Resolution</div>
            <div className="js-stat-card-val">5.2h</div>
            <div className="js-stat-card-sub js-stat-trend-up">↓ 38% improvement</div>
          </div>
          <div className="js-stat-card">
            <div className="js-stat-card-label">Resolved Today</div>
            <div className="js-stat-card-val" style={{ color: "var(--accent3)" }}>998</div>
            <div className="js-stat-card-sub js-stat-trend-up">↑ 80% rate</div>
          </div>
        </div>

        {/* Grid */}
        <div className="js-admin-grid">
          <div>
            <div className="js-section-label">Recent Grievances</div>
            <div className="js-table-wrap">
              <table className="js-admin-tbl">
                <thead>
                  <tr>
                    <th>ID</th><th>Category</th><th>District</th><th>Priority</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((r) => (
                    <tr key={r.id}>
                      <td><span className="js-tbl-id">#{r.id}</span></td>
                      <td style={{ fontWeight: 500 }}>{r.cat}</td>
                      <td>{r.dist}</td>
                      <td>
                        <span className={`js-priority-${r.priority.toLowerCase()}`}>{r.priority}</span>
                      </td>
                      <td><span className={`js-status-badge ${r.status}`}>{r.statusTxt}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="js-section-label">Category Breakdown</div>
            <div className="js-chart-card" style={{ marginBottom: "1rem" }}>
              <div className="js-chart-title">Volume by Department</div>
              <AdminBarChart />
            </div>
            <div className="js-chart-card">
              <div className="js-chart-title">Resolution Rate</div>
              <DonutChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function CitizenDashboard() {
  const [view, setView] = useState("submit");
  const [toast, setToast] = useState({ visible: false, icon: "", title: "", sub: "" });
  const toastTimer = useRef(null);

  // Inject CSS once
  useEffect(() => {
    const id = "janseva-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  const showToast = useCallback((icon, title, sub) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, icon, title, sub });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  return (
    <div className="janseva-root">
      {/* NAV */}
      <nav className="js-nav">
        <div className="js-nav-brand" onClick={() => setView("submit")}>
          <div className="js-brand-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="1.5" />
              <path d="M5 9h8M9 5v8" stroke="#61bdaf" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          JanSeva
        </div>
        <div className="js-nav-tabs">
          <button
            className={`js-nav-tab${view === "submit" ? " active" : ""}`}
            onClick={() => setView("submit")}
          >Submit Grievance</button>
          <button
            className={`js-nav-tab${view === "track" ? " active" : ""}`}
            onClick={() => setView("track")}
          >Track Status</button>
        </div>
        <div className="js-nav-badge">
          <div className="js-status-dot" />
          <span>Online</span>
        </div>
      </nav>

      {/* VIEWS */}
      <main style={{ position: "relative", zIndex: 1 }}>
        {view === "submit" && <SubmitView showToast={showToast} />}
        {view === "track" && <TrackView showToast={showToast} />}
        {view === "admin" && <AdminView showToast={showToast} />}
      </main>

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}
