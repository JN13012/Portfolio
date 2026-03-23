import React, { useState, useEffect, useRef } from "react";

/* ─── CONFIG ─── */
const SCAN_DURATION = 3200;   // durée du scan laser (ms)
const REVEAL_DELAY  = 600;    // délai avant texte final

/* ─── POINTS DE RECONNAISSANCE FACIALE ─── */
const FACE_POINTS = [
  // Contour visage
  { x: 200, y: 115, label: null },
  { x: 230, y: 95,  label: null },
  { x: 270, y: 88,  label: null },
  { x: 310, y: 90,  label: null },
  { x: 345, y: 105, label: null },
  { x: 365, y: 130, label: null },
  { x: 370, y: 165, label: null },
  { x: 360, y: 200, label: null },
  { x: 340, y: 228, label: null },
  { x: 310, y: 245, label: null },
  { x: 275, y: 250, label: null },
  { x: 240, y: 245, label: null },
  { x: 212, y: 228, label: null },
  { x: 195, y: 200, label: null },
  { x: 190, y: 165, label: null },
  { x: 192, y: 130, label: null },
  // Yeux
  { x: 228, y: 148, label: "L.EYE" },
  { x: 244, y: 142, label: null },
  { x: 260, y: 145, label: null },
  { x: 244, y: 155, label: null },
  { x: 312, y: 148, label: "R.EYE" },
  { x: 326, y: 142, label: null },
  { x: 340, y: 145, label: null },
  { x: 326, y: 155, label: null },
  // Nez
  { x: 275, y: 180, label: null },
  { x: 268, y: 202, label: null },
  { x: 282, y: 208, label: "NOSE" },
  // Bouche
  { x: 248, y: 218, label: null },
  { x: 265, y: 213, label: null },
  { x: 282, y: 215, label: null },
  { x: 298, y: 213, label: null },
  { x: 314, y: 218, label: null },
  { x: 298, y: 228, label: null },
  { x: 282, y: 231, label: "MOUTH" },
  { x: 265, y: 228, label: null },
  // Sourcils
  { x: 220, y: 133, label: null },
  { x: 240, y: 128, label: null },
  { x: 258, y: 130, label: null },
  { x: 305, y: 128, label: null },
  { x: 322, y: 132, label: null },
  { x: 345, y: 135, label: null },
  // Mâchoire
  { x: 210, y: 248, label: null },
  { x: 248, y: 265, label: null },
  { x: 282, y: 270, label: null },
  { x: 316, y: 265, label: null },
  { x: 354, y: 248, label: null },
];

const SCAN_LINES = [
  { x1: 160, y1: 82,  x2: 220, y2: 82  },
  { x1: 160, y1: 82,  x2: 160, y2: 142 },
  { x1: 400, y1: 82,  x2: 340, y2: 82  },
  { x1: 400, y1: 82,  x2: 400, y2: 142 },
  { x1: 160, y1: 278, x2: 220, y2: 278 },
  { x1: 160, y1: 278, x2: 160, y2: 218 },
  { x1: 400, y1: 278, x2: 340, y2: 278 },
  { x1: 400, y1: 278, x2: 400, y2: 218 },
];

const DATA_TAGS = [
  { x: 430, y: 120, label: "SUBJECT_ID",   value: "YS-2026-CM" },
  { x: 430, y: 152, label: "THREAT_LEVEL", value: "HIGH" },
  { x: 430, y: 184, label: "CLEARANCE",    value: "MSc CYBER" },
  { x: 430, y: 216, label: "STATUS",       value: "ALTERNANT" },
  { x: 430, y: 248, label: "LOCATION",     value: "MARSEILLE FR" },
  { x:  28, y: 120, label: "IRIS_MATCH",   value: "99.7%" },
  { x:  28, y: 152, label: "LIVENESS",     value: "CONFIRMED" },
  { x:  28, y: 184, label: "DEPTH_MAP",    value: "LOADED" },
  { x:  28, y: 216, label: "MESH_PTS",     value: "468 / 468" },
  { x:  28, y: 248, label: "FACE_CONF",    value: "██████ 98%" },
];

/* ─── WAVEFORM BAR ─── */
const WaveBar = ({ delay }) => (
  <div
    style={{
      width: 2,
      background: "#4ade80",
      borderRadius: 1,
      animation: `waveAnim 0.8s ease-in-out infinite alternate`,
      animationDelay: `${delay}ms`,
    }}
  />
);

/* ─── MAIN COMPONENT ─── */
const IntroScan = ({ onAccessGranted }) => {
  const [phase, setPhase] = useState("idle"); // idle | scanning | matched | done
  const [scanY, setScanY] = useState(82);
  const [visiblePoints, setVisiblePoints] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);
  const [matchText, setMatchText] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const matchFull = "IDENTITY CONFIRMED — ACCESS GRANTED";

  /* Lance le scan au clic/touche */
  const startScan = () => {
    if (phase !== "idle") return;
    setPhase("scanning");
    startRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / SCAN_DURATION, 1);

      // Laser Y : de 82 à 278
      const newY = 82 + progress * 196;
      setScanY(newY);

      // Points visibles proportionnellement au scan
      const threshold = (newY - 82) / 196;
      const pts = FACE_POINTS.filter((p) => (p.y - 82) / (270 - 82) <= threshold + 0.05);
      setVisiblePoints(pts);

      // Tags visibles progressivement
      const tagCount = Math.floor(progress * DATA_TAGS.length);
      setVisibleTags(DATA_TAGS.slice(0, tagCount));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Phase matched
        setTimeout(() => {
          setPhase("matched");
          let i = 0;
          const interval = setInterval(() => {
            setMatchText(matchFull.slice(0, i + 1));
            i++;
            if (i >= matchFull.length) clearInterval(interval);
          }, 45);
        }, REVEAL_DELAY);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleEnter = () => {
    if (phase !== "matched") return;
    setIsTransitioning(true);
    setTimeout(() => onAccessGranted(), 1000);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (phase === "idle") startScan();
      else if (phase === "matched") handleEnter();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        .intro-scan-root {
          position: fixed; inset: 0; z-index: 50;
          background: #020202;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
          overflow: hidden;
          transition: opacity 1s ease, filter 1s ease;
        }
        .intro-scan-root.leaving {
          opacity: 0;
          filter: brightness(4) blur(12px);
        }

        /* Grid de fond */
        .scan-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Vignette */
        .scan-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, #020202 100%);
          pointer-events: none;
        }

        /* Scanlines CRT */
        .scan-crt {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(0,0,0,0.18) 3px,
            rgba(0,0,0,0.18) 4px
          );
          pointer-events: none;
        }

        /* Header / Footer */
        .scan-header, .scan-footer {
          position: absolute; left: 0; right: 0;
          display: flex; align-items: center;
          padding: 0 32px;
          color: rgba(74,222,128,0.5);
          font-size: 10px; letter-spacing: 0.2em;
        }
        .scan-header { top: 24px; justify-content: space-between; }
        .scan-footer { bottom: 24px; justify-content: center; gap: 40px; }

        .blink { animation: blinkAnim 1s step-end infinite; }
        @keyframes blinkAnim { 50% { opacity: 0; } }

        /* SVG face */
        .face-svg { position: relative; z-index: 2; }

        /* Point facial */
        .face-dot {
          fill: none; stroke: #4ade80; stroke-width: 1;
          animation: dotReveal 0.2s ease forwards;
        }
        @keyframes dotReveal {
          from { opacity: 0; r: 0; }
          to   { opacity: 1; }
        }

        /* Laser */
        .scan-laser {
          stroke: #4ade80; stroke-width: 1.5;
          filter: drop-shadow(0 0 4px #4ade80);
          opacity: 0.85;
        }

        /* Coins du cadre */
        .frame-corner { stroke: #4ade80; stroke-width: 1.5; fill: none; }

        /* Tags data */
        .data-tag { font-family: 'Share Tech Mono', monospace; }

        /* Waveform */
        @keyframes waveAnim {
          from { height: 4px; }
          to   { height: 28px; }
        }

        /* Texte match */
        .match-line {
          color: #4ade80;
          font-size: 13px;
          letter-spacing: 0.25em;
          text-align: center;
          min-height: 20px;
          text-shadow: 0 0 12px rgba(74,222,128,0.6);
        }

        /* Bouton enter */
        .enter-btn {
          margin-top: 20px;
          padding: 10px 32px;
          border: 1px solid rgba(74,222,128,0.5);
          background: transparent;
          color: #4ade80;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, box-shadow 0.3s;
          animation: fadeInUp 0.6s ease forwards;
        }
        .enter-btn:hover {
          background: rgba(74,222,128,0.08);
          box-shadow: 0 0 20px rgba(74,222,128,0.2);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Progress bar */
        .progress-track {
          width: 280px; height: 1px;
          background: rgba(74,222,128,0.15);
          margin: 8px auto 0;
          position: relative; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          transition: width 0.05s linear;
        }

        /* Idle prompt */
        .idle-prompt {
          color: rgba(74,222,128,0.6);
          font-size: 11px; letter-spacing: 0.3em;
          text-align: center;
          animation: fadeInUp 1s ease 0.8s both;
        }

        /* Bypass */
        .bypass-btn {
          position: absolute; bottom: 60px;
          background: none; border: none;
          color: rgba(255,255,255,0.15);
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          cursor: pointer;
          transition: color 0.2s;
        }
        .bypass-btn:hover { color: rgba(255,255,255,0.4); }

        .logo-text {
          font-size: 11px; letter-spacing: 0.35em;
          color: rgba(74,222,128,0.7);
          text-transform: uppercase;
        }
      `}</style>

      <div className={`intro-scan-root${isTransitioning ? " leaving" : ""}`}>
        <div className="scan-grid" />
        <div className="scan-vignette" />
        <div className="scan-crt" />

        {/* Header */}
        <div className="scan-header">
          <span className="logo-text">SYS_BIOMETRIC_v4.2</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ color: "#ef4444", fontSize: 10, letterSpacing: "0.2em" }}>REC</span>
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(74,222,128,0.4)" }}>
            {new Date().toISOString().replace("T", " ").slice(0, 19)}
          </span>
        </div>

        {/* SVG Zone centrale */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <svg
            width="560"
            height="360"
            viewBox="0 0 560 360"
            className="face-svg"
            onClick={phase === "idle" ? startScan : phase === "matched" ? handleEnter : undefined}
            style={{ cursor: phase === "idle" || phase === "matched" ? "pointer" : "default" }}
          >
            {/* Coins du cadre */}
            {SCAN_LINES.map((l, i) => (
              <line key={i} className="frame-corner" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
            ))}

            {/* Silhouette / ovale du visage */}
            <ellipse
              cx="280" cy="178"
              rx="100" ry="122"
              fill="none"
              stroke="rgba(74,222,128,0.08)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Points faciaux */}
            {visiblePoints.map((p, i) => (
              <g key={i}>
                <circle
                  className="face-dot"
                  cx={p.x} cy={p.y} r="2.5"
                />
                {p.label && (
                  <text
                    x={p.x + 8} y={p.y - 6}
                    fill="rgba(74,222,128,0.55)"
                    fontSize="7"
                    fontFamily="'Share Tech Mono', monospace"
                    letterSpacing="0.1em"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            ))}

            {/* Lignes de triangulation entre points proches */}
            {phase === "scanning" && visiblePoints.length > 10 && visiblePoints.slice(0, -1).map((p, i) => {
              if (i % 3 !== 0) return null;
              const next = visiblePoints[i + 2];
              if (!next) return null;
              return (
                <line
                  key={`tri-${i}`}
                  x1={p.x} y1={p.y} x2={next.x} y2={next.y}
                  stroke="rgba(74,222,128,0.12)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Laser de scan */}
            {phase === "scanning" && (
              <>
                <line
                  className="scan-laser"
                  x1="160" y1={scanY} x2="400" y2={scanY}
                />
                {/* Glow sous le laser */}
                <rect
                  x="160" y={scanY - 8}
                  width="240" height="16"
                  fill="rgba(74,222,128,0.04)"
                />
              </>
            )}

            {/* Tags data gauche */}
            {visibleTags.filter(t => t.x < 100).map((tag, i) => (
              <g key={`tag-l-${i}`} className="data-tag">
                <line
                  x1={tag.x + 90} y1={tag.y}
                  x2={160} y2={tag.y}
                  stroke="rgba(74,222,128,0.2)" strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
                <text x={tag.x} y={tag.y - 6}
                  fill="rgba(74,222,128,0.4)" fontSize="7" letterSpacing="0.15em"
                  fontFamily="'Share Tech Mono', monospace"
                >
                  {tag.label}
                </text>
                <text x={tag.x} y={tag.y + 5}
                  fill="rgba(74,222,128,0.85)" fontSize="8" letterSpacing="0.1em"
                  fontFamily="'Share Tech Mono', monospace"
                >
                  {tag.value}
                </text>
              </g>
            ))}

            {/* Tags data droite */}
            {visibleTags.filter(t => t.x > 400).map((tag, i) => (
              <g key={`tag-r-${i}`} className="data-tag">
                <line
                  x1={400} y1={tag.y}
                  x2={tag.x - 4} y2={tag.y}
                  stroke="rgba(74,222,128,0.2)" strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
                <text x={tag.x} y={tag.y - 6}
                  fill="rgba(74,222,128,0.4)" fontSize="7" letterSpacing="0.15em"
                  fontFamily="'Share Tech Mono', monospace"
                >
                  {tag.label}
                </text>
                <text x={tag.x} y={tag.y + 5}
                  fill="rgba(74,222,128,0.85)" fontSize="8" letterSpacing="0.1em"
                  fontFamily="'Share Tech Mono', monospace"
                >
                  {tag.value}
                </text>
              </g>
            ))}

            {/* Croix centrale (idle) */}
            {phase === "idle" && (
              <g opacity="0.3">
                <line x1="275" y1="175" x2="285" y2="175" stroke="#4ade80" strokeWidth="1" />
                <line x1="280" y1="170" x2="280" y2="180" stroke="#4ade80" strokeWidth="1" />
                <circle cx="280" cy="178" r="18" fill="none" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 4" />
              </g>
            )}

            {/* Checkmark match */}
            {phase === "matched" && (
              <g>
                <circle cx="280" cy="178" r="28" fill="rgba(74,222,128,0.06)" stroke="#4ade80" strokeWidth="1" />
                <path
                  d="M265 178 L275 190 L298 165"
                  fill="none" stroke="#4ade80" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </g>
            )}
          </svg>

          {/* Zone basse : progress / waveform / texte */}
          <div style={{ textAlign: "center", marginTop: -8 }}>
            {phase === "idle" && (
              <p className="idle-prompt">
                [ CLIQUER POUR INITIER LE SCAN ]
              </p>
            )}

            {phase === "scanning" && (
              <>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${((scanY - 82) / 196) * 100}%` }}
                  />
                </div>
                <p style={{ color: "rgba(74,222,128,0.5)", fontSize: 9, letterSpacing: "0.3em", marginTop: 8 }}>
                  FACIAL MAPPING IN PROGRESS...
                </p>
              </>
            )}

            {(phase === "scanning" || phase === "matched") && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 36, marginTop: 8 }}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <WaveBar key={i} delay={(i * 40) % 800} />
                ))}
              </div>
            )}

            {phase === "matched" && (
              <>
                <p className="match-line" style={{ marginTop: 8 }}>{matchText}</p>
                {matchText.length === matchFull.length && (
                  <button className="enter-btn" onClick={handleEnter}>
                    ENTER PORTFOLIO
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="scan-footer">
          {["NEURAL_LINK_OK", "FIREWALL_BYPASS", "DEPTH_SCAN_ACTIVE", "ENCRYPT_AES256"].map((s) => (
            <span key={s} style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(74,222,128,0.3)" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Bypass discret */}
        <button className="bypass-btn" onClick={() => { setIsTransitioning(true); setTimeout(() => onAccessGranted(), 800); }}>
          [ BYPASS AUTHENTICATION ]
        </button>
      </div>
    </>
  );
};

export default IntroScan;
