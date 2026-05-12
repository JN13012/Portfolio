import React, { useState, useEffect, useCallback, useRef } from "react";
import { DOMAINS } from "./CompetencesData";



const ALL = DOMAINS.flatMap((d) => d.items.map((it) => ({ ...it, domain: d })));

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */
export default function Competences() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [panelVis, setPanelVis] = useState(true);
  const timeoutRef = useRef(null);

  const active = ALL[activeIdx];
  const dom = active.domain;

  const go = useCallback((dir) => {
    setPanelVis(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIdx((i) => (i + dir + ALL.length) % ALL.length);
      setPanelVis(true);
    }, 180);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [go]);

  const getCardTransform = (i) => {
    const total = ALL.length;
    const angle  = (i / total) * Math.PI * 2;
    const offset = (activeIdx / total) * Math.PI * 2;
    const fin    = angle - offset;
    const x = Math.cos(fin) * 370;
    const y = Math.sin(fin) * 148;
    const z = Math.sin(fin) * 95;
    const depth = (z + 95) / 190;
    return {
      transform: `translate3d(${x}px,${y}px,${z}px) scale(${0.46 + depth * 0.58})`,
      opacity: 0.1 + depth * 0.9,
      zIndex: Math.floor(depth * 100),
      transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
    };
  };


  // Domain progress across all skills
  const domainStart = DOMAINS.slice(0, DOMAINS.indexOf(dom)).reduce((a, d) => a + d.items.length, 0);
  const skillIndexInDomain = activeIdx - domainStart;

  return (
    <div style={{ backgroundColor:"#080808", minHeight:"100vh", color:"#e8e4df", position:"relative", overflow:"hidden", fontFamily:"sans-code" }}>

      {/* Subtle noise texture via CSS */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", opacity:0.025,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"200px 200px",
      }} />

      {/* Ambient radial glow — very subtle */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 60% 50% at 50% 45%, rgba(${domToRgb(dom.hue)},0.06) 0%, transparent 68%)`,
        transition:"background 1s ease",
      }} />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"60px 40px", boxSizing:"border-box" }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:56 }}>

          <div>
            <div className="code" style={{ fontSize:10, letterSpacing:"0.35em", color:"rgba(232,228,223,0.3)", marginBottom:14, textTransform:"uppercase" }}>
              04 — Compétences techniques
            </div>
            <h2 className="code" style={{ margin:0, fontSize:38, fontWeight:300, color:"#e8e4df", letterSpacing:"0.02em", lineHeight:1 }}>
              Hard Skills
            </h2>
          </div>

          {/* Domain pills */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
            {DOMAINS.map((d, di) => {
              const isA = dom.category === d.category;
              const startIdx = DOMAINS.slice(0, di).reduce((a, x) => a + x.items.length, 0);
              return (
                <button key={d.category} onClick={() => { setPanelVis(false); setTimeout(()=>{ setActiveIdx(startIdx); setPanelVis(true); }, 180); }}
                  className="code nav-btn"
                  style={{ display:"flex", alignItems:"center", gap:10, opacity: isA ? 1 : 0.35, padding:0 }}>
                  <span style={{ fontSize:9, letterSpacing:"0.3em", color: isA ? d.hue : "inherit", textTransform:"uppercase" }}>
                    {d.index} {d.label}
                  </span>
                  <div style={{ width:24, height:1, background: isA ? d.hue : "rgba(232,228,223,0.2)", transition:"all 0.3s" }} />
                </button>
              );
            })}
          </div>

        </div>

        {/* ── CAROUSEL SCENE ── */}
        <div style={{ position:"relative", height:500, display:"flex", alignItems:"center", justifyContent:"center", perspective:"1800px" }}>

          {/* Big ghost domain label — behind everything */}
          <div className="code domain-enter" key={dom.category} style={{
            position:"absolute", zIndex:0, pointerEvents:"none",
            fontSize:130, fontWeight:300, fontStyle:"italic",
            color:"rgba(232,228,223,0.018)",
            letterSpacing:"-0.02em",
            whiteSpace:"nowrap",
            userSelect:"none",
            top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
          }}>
            {dom.label}
          </div>

          {/* Domain orb — center */}
          <div style={{ position:"absolute", zIndex:40, pointerEvents:"none", display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div key={`orb-${dom.category}`} style={{
              width:96, height:96,
              borderRadius:"50%",
              border:`1px solid ${dom.border}`,
              background:`radial-gradient(circle at 40% 38%, ${dom.muted} 0%, rgba(8,8,8,0.9) 65%)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              flexDirection:"column",
              boxShadow:`0 0 40px rgba(${domToRgb(dom.hue)},0.12), 0 0 1px ${dom.border}`,
              animation:"fadeIn 0.5s ease",
            }}>
              <span style={{ fontSize:30, lineHeight:1 }}>{dom.icon}</span>
              <div className="code" style={{ fontSize:7, letterSpacing:"0.2em", color:dom.hue, marginTop:5, opacity:0.7 }}>
                {dom.index}
              </div>
            </div>
            <div className="code domain-enter" key={`label-${dom.category}-${activeIdx}`} style={{ marginTop:10, fontSize:8, letterSpacing:"0.35em", color:dom.hue, textTransform:"uppercase", opacity:0.8 }}>
              {dom.label}
            </div>
            <div className="code" style={{ marginTop:4, fontSize:8, color:"rgba(232,228,223,0.2)", letterSpacing:"0.2em" }}>
              {String(activeIdx + 1).padStart(2,"0")} / {String(ALL.length).padStart(2,"0")}
            </div>
          </div>

          {/* Nav */}
          <button onClick={() => go(-1)} className="nav-btn" style={{ position:"absolute", left:0, zIndex:60, opacity:0.3, fontSize:28, color:"#e8e4df" }}>
            ←
          </button>
          <button onClick={() => go(1)} className="nav-btn" style={{ position:"absolute", right:0, zIndex:60, opacity:0.3, fontSize:28, color:"#e8e4df" }}>
            →
          </button>

          {/* Cards */}
          <div style={{ position:"relative", width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", transformStyle:"preserve-3d" }}>
            {ALL.map((skill, i) => {
              const isActive = i === activeIdx;
              const d = skill.domain;
              const st = getCardTransform(i);
              return (
                <div key={i} className="card-item" onClick={() => { setPanelVis(false); setTimeout(()=>{ setActiveIdx(i); setPanelVis(true); }, 180); }}
                  style={{
                    position:"absolute", transformStyle:"preserve-3d",
                    width:196, height:240,
                    ...st,
                    border:`1px solid ${isActive ? d.border : "rgba(232,228,223,0.06)"}`,
                    background: isActive
                      ? `linear-gradient(150deg, ${d.muted} 0%, rgba(10,10,10,0.95) 60%)`
                      : "rgba(10,10,10,0.7)",
                    backdropFilter:"blur(4px)",
                    padding:"22px 20px",
                    boxSizing:"border-box",
                    boxShadow: isActive ? `0 0 60px rgba(${domToRgb(d.hue)},0.14)` : "none",
                  }}>

                  {/* Thin top accent */}
                  {isActive && (
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(to right, transparent, ${d.hue} 30%, ${d.hue} 70%, transparent)`, opacity:0.7 }} />
                  )}

                  {/* Domain index */}
                  <div className="code" style={{ fontSize:8, letterSpacing:"0.28em", color:d.hue, opacity:isActive?0.65:0.3, marginBottom:14, textTransform:"uppercase" }}>
                    {d.index} · {d.label}
                  </div>

                  {/* Skill name */}
                  <div className="code" style={{ fontSize:16, fontWeight:400, color:"#e8e4df", lineHeight:1.35, marginBottom:14, opacity:isActive?1:0.6 }}>
                    {skill.name}
                  </div>

                  {/* Separator */}
                  <div style={{ width:18, height:1, background:d.hue, opacity:0.4, marginBottom:14 }} />

                  {/* Details snippet */}
                  <div className="code" style={{ fontSize:9, color:"rgba(232,228,223,0.4)", lineHeight:1.75, flex:1 }}>
                    {skill.details.slice(0, 82)}…
                  </div>

                  {/* Tools footer */}
                  <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(232,228,223,0.05)" }}>
                    <div className="code" style={{ fontSize:7.5, color:"rgba(232,228,223,0.18)", letterSpacing:"0.08em", lineHeight:1.7 }}>
                      {skill.tools.slice(0,2).join(" · ")}
                      {skill.tools.length > 2 ? ` +${skill.tools.length-2}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PROGRESS DOTS ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:8 }}>
          {/* Domain separators */}
          {ALL.map((sk, i) => {
            const isA = i === activeIdx;
            const isDomainBoundary = i > 0 && ALL[i].domain !== ALL[i-1].domain;
            return (
              <React.Fragment key={i}>
                {isDomainBoundary && <div style={{ width:1, height:6, background:"rgba(232,228,223,0.08)", alignSelf:"center" }} />}
                <div onClick={() => { setPanelVis(false); setTimeout(()=>{ setActiveIdx(i); setPanelVis(true); }, 180); }} style={{
                  width: isA ? 20 : 4, height: 4, borderRadius: 2,
                  background: isA ? sk.domain.hue : "rgba(232,228,223,0.08)",
                  cursor:"pointer",
                  transition:"all 0.38s cubic-bezier(0.34,1.56,0.64,1)",
                }} />
              </React.Fragment>
            );
          })}
        </div>

        {/* ── DETAIL PANEL ── */}
        <div className={panelVis ? "panel-enter" : "panel-exit"} style={{
          marginTop:40,
          display:"grid", gridTemplateColumns:"1fr 1px 1fr 1px 1fr",
          gap:0,
          border:"1px solid rgba(232,228,223,0.07)",
          borderLeft:`3px solid ${dom.hue}`,
          background:"rgba(10,10,10,0.6)",
          backdropFilter:"blur(8px)",
        }}>

          {/* COL 1 — Domain + Skill identity */}
          <div style={{ padding:"30px 32px" }}>
            <div className="code" style={{ fontSize:8, letterSpacing:"0.35em", color:dom.hue, marginBottom:10, textTransform:"uppercase" }}>
              {dom.index} — {dom.label}
            </div>
            <div className="code" style={{ fontSize:26, fontWeight:300, color:"#e8e4df", lineHeight:1.2, marginBottom:6 }}>
              {active.name}
            </div>
            <div className="code" style={{ fontSize:9, color:"rgba(232,228,223,0.25)", letterSpacing:"0.15em" }}>
              {dom.tag}
            </div>

            {/* Domain progress bar */}
            <div style={{ marginTop:22 }}>
              <div className="code" style={{ fontSize:7.5, color:"rgba(232,228,223,0.2)", letterSpacing:"0.2em", marginBottom:6 }}>
                {dom.label} · {String(skillIndexInDomain+1).padStart(2,"0")}/{String(dom.items.length).padStart(2,"0")}
              </div>
              <div style={{ height:1, background:"rgba(232,228,223,0.07)", position:"relative" }}>
                <div style={{
                  position:"absolute", top:0, left:0, height:"100%",
                  width:`${((skillIndexInDomain+1)/dom.items.length)*100}%`,
                  background:dom.hue,
                  transition:"width 0.5s ease",
                }} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ background:"rgba(232,228,223,0.06)" }} />

          {/* COL 2 — Description */}
          <div style={{ padding:"30px 32px" }}>
            <div className="code" style={{ fontSize:8, letterSpacing:"0.3em", color:"rgba(232,228,223,0.2)", marginBottom:14, textTransform:"uppercase" }}>
              Description
            </div>
            <p className="code" style={{ fontSize:10.5, color:"rgba(232,228,223,0.65)", lineHeight:1.95, margin:0 }}>
              {active.details}
            </p>
          </div>

          {/* Divider */}
          <div style={{ background:"rgba(232,228,223,0.06)" }} />

          {/* COL 3 — Tools + nav */}
          <div style={{ padding:"30px 32px", display:"flex", flexDirection:"column" }}>
            <div className="code" style={{ fontSize:8, letterSpacing:"0.3em", color:"rgba(232,228,223,0.2)", marginBottom:14, textTransform:"uppercase" }}>
              Stack & Outils
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:6, flex:1 }}>
              {active.tools.map((t) => (
                <span key={t} className="code tool-pill" style={{
                  fontSize:8.5, padding:"5px 10px",
                  border:"1px solid rgba(232,228,223,0.1)",
                  background:"rgba(232,228,223,0.03)",
                  color:"rgba(232,228,223,0.5)",
                  letterSpacing:"0.06em",
                  "--hue": dom.hue,
                  "--hue-muted": dom.muted,
                }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Footer nav hints */}
            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(232,228,223,0.05)", display:"flex", justifyContent:"space-between" }}>
              <div className="code" style={{ fontSize:7.5, color:"rgba(232,228,223,0.15)", letterSpacing:"0.2em" }}>← → NAVIGUER</div>
              <div className="code" style={{ fontSize:7.5, color:"rgba(232,228,223,0.15)", letterSpacing:"0.2em" }}>
                {String(activeIdx+1).padStart(2,"0")} / {String(ALL.length).padStart(2,"0")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Helper: hex → "r,g,b" for rgba() */
function domToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
