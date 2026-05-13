import React, { useState, useEffect, useCallback, useRef } from "react";
import { DOMAINS } from "./CompetencesData";

const ALL = DOMAINS.flatMap((d) =>
  d.items.map((it) => ({
    ...it,
    domain: d,
  })),
);

/* ───────────────────────────────────────────────────────────── */
/* COMPONENT */
/* ───────────────────────────────────────────────────────────── */

export default function Competences() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [panelVis, setPanelVis] = useState(true);

  const timeoutRef = useRef(null);

  const active = ALL[activeIdx];
  const dom = active.domain;

  /* ───────────────────────────────────────────────────────────── */
  /* NAVIGATION */
  /* ───────────────────────────────────────────────────────────── */

  const go = useCallback((dir) => {
    setPanelVis(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

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

  /* ───────────────────────────────────────────────────────────── */
  /* COVERFLOW TRANSFORM */
  /* ───────────────────────────────────────────────────────────── */

  const getCardTransform = (i) => {
    const total = ALL.length;
    const angle  = (i / total) * Math.PI * 2;
    const offset = (activeIdx / total) * Math.PI * 2;
    const fin    = angle - offset;
    const x = Math.cos(fin) * 500;
    const y = Math.sin(fin) * 125;
    const z = Math.sin(fin) * 95;
    const depth = (z + 95) / 190;
    return {
      transform: `translate3d(${x}px,${y}px,${z}px) scale(${0.46 + depth * 0.5})`,
      opacity: 0.1 + depth * 0.9,
      zIndex: Math.floor(depth * 100),
      transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
    };
  };

  /* ───────────────────────────────────────────────────────────── */
  /* DOMAIN PROGRESS */
  /* ───────────────────────────────────────────────────────────── */

  const domainStart = DOMAINS.slice(0, DOMAINS.indexOf(dom)).reduce(
    (a, d) => a + d.items.length,
    0,
  );

  const skillIndexInDomain = activeIdx - domainStart;

  /* ───────────────────────────────────────────────────────────── */
  /* RENDER */
  /* ───────────────────────────────────────────────────────────── */

  return (
    <div
      style={{
        backgroundColor: "#020202",
        minHeight: "100vh",
        color: "#e8e4df",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-code",
      }}
    >
      {/* GRID BACKGROUND */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* RADIAL LIGHT */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(
              circle at center,
              rgba(${domToRgb(dom.hue)},0.08),
              transparent 60%
            )
          `,
          transition: "background 1s ease",
        }}
      />

      {/* VIGNETTE */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />

      {/* CONTENT */}

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "70px 40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* ───────────────────────────────────────────────────── */}
        {/* HEADER */}
        {/* ───────────────────────────────────────────────────── */}
        <div
          style={{
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <span
              style={{
                color: dom.hue,
                fontSize: 12,
                opacity: 0.6,
                letterSpacing: "0.3em",
              }}
            >
              04.
            </span>

            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 42,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              Technical Expertise
            </h2>

            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.08)",
              }}
            />
          </div>


          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 20,
            }}
          >
            {DOMAINS.map((d, di) => {
              const isActive = dom.category === d.category;

              const startIdx = DOMAINS.slice(0, di).reduce(
                (a, x) => a + x.items.length,
                0,
              );

              return (
                <button
                  key={d.category}
                  onClick={() => {
                    setPanelVis(false);

                    setTimeout(() => {
                      setActiveIdx(startIdx);
                      setPanelVis(true);
                    }, 180);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: isActive ? 1 : 0.35,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: isActive ? d.hue : "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                    }}
                  >
                    {d.index} {d.label}
                  </span>

                  <div
                    style={{
                      width: 24,
                      height: 1,
                      background: isActive ? d.hue : "rgba(255,255,255,0.2)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
        {/* ───────────────────────────────────────────────────── */}
        {/* CAROUSEL */}
        {/* ───────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            height: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "2400px",
          }}
        >
          {/* LEFT */}

          <button
            onClick={() => go(-1)}
            style={{
              position: "absolute",
              left: 0,
              zIndex: 999,
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(18px)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 30,
              cursor: "pointer",
              transition: "all .3s ease",
            }}
          >
            ‹
          </button>

          {/* RIGHT */}

          <button
            onClick={() => go(1)}
            style={{
              position: "absolute",
              right: 0,
              zIndex: 999,
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(18px)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 30,
              cursor: "pointer",
              transition: "all .3s ease",
            }}
          >
            ›
          </button>

          {/* TRACK */}

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
            }}
          >
            {ALL.map((skill, i) => {
              const d = skill.domain;

              return (
                <div
                  key={i}
                  onClick={() => {
                    setPanelVis(false);

                    setTimeout(() => {
                      setActiveIdx(i);
                      setPanelVis(true);
                    }, 180);
                  }}
                  style={{
                    position: "absolute",
                    width: 240,
                    height: 320,
                    cursor: "pointer",
                    transformStyle: "preserve-3d",
                    ...getCardTransform(i),
                  }}
                >
                  {/* CARD */}

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: 32,
                      border: `1px solid ${d.border}`,
                      background: "rgba(9,9,9,0.88)",
                      backdropFilter: "blur(24px)",
                      padding: 28,
                      boxSizing: "border-box",
                      boxShadow: `
                        0 20px 80px rgba(0,0,0,0.65),
                        0 0 40px rgba(${domToRgb(d.hue)},0.08)
                      `,
                    }}
                  >
                    {/* TOP LIGHT */}

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 30%)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* NUMBER */}

                    <div
                      style={{
                        position: "absolute",
                        top: 24,
                        right: 24,
                        fontSize: 10,
                        letterSpacing: "0.35em",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* TOP */}

                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 48,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.35em",
                          textTransform: "uppercase",
                          opacity: 0.5,
                          color: "#fff",
                        }}
                      >
                        {d.label}
                      </div>

                      <div
                        style={{
                          fontSize: 34,
                          opacity: 0.85,
                        }}
                      >
                        {d.icon}
                      </div>
                    </div>

                    {/* TITLE */}

                    <h3
                      style={{
                        position: "relative",
                        zIndex: 2,
                        fontSize: 28,
                        lineHeight: 1.2,
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 22,
                        fontWeight: 400,
                      }}
                    >
                      {skill.name}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      style={{
                        position: "relative",
                        zIndex: 2,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.8,
                        fontSize: 13,
                        marginBottom: 34,
                      }}
                    >
                      {skill.details}
                    </p>

                    {/* TOOLS */}

                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {skill.tools.slice(0, 5).map((tool, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "8px 12px",
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* BOTTOM LINE */}

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: 2,
                        background: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          height: "100%",
                          background: d.hue,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ───────────────────────────────────────────────────── */}
        {/* INDICATORS */}
        {/* ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          {ALL.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: i === activeIdx ? 42 : 8,
                height: 8,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background:
                  i === activeIdx ? dom.hue : "rgba(255,255,255,0.18)",
                transition: "all .45s ease",
              }}
            />
          ))}
        </div>
        {/* ───────────────────────────────────────────────────── */}
        {/* DETAIL PANEL */}
        {/* ───────────────────────────────────────────────────── */}
        <div
          className={panelVis ? "panel-enter" : "panel-exit"}
          style={{
            marginTop: 60,
            display: "grid",
            gridTemplateColumns: "1fr 1px 2fr 1px 1fr",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(8,8,8,0.7)",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
            borderRadius: 24,
          }}
        >
          {/* COL 1 */}

          <div style={{ padding: "34px" }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.35em",
                color: dom.hue,
                marginBottom: 14,
                textTransform: "uppercase",
              }}
            >
              {dom.index} — {dom.label}
            </div>

            <div
              style={{
                fontSize: 30,
                lineHeight: 1.2,
                color: "#fff",
                marginBottom: 10,
              }}
            >
              {active.name}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.18em",
              }}
            >
              {dom.tag}
            </div>

            {/* PROGRESS */}

            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.2em",
                  marginBottom: 8,
                }}
              >
                {dom.label} · {String(skillIndexInDomain + 1).padStart(2, "0")}/
                {String(dom.items.length).padStart(2, "0")}
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.08)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${((skillIndexInDomain + 1) / dom.items.length) * 100}%`,
                    background: dom.hue,
                  }}
                />
              </div>
            </div>
          </div>

          {/* DIVIDER */}

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
            }}
          />

          {/* COL 2 */}

          <div style={{ padding: "34px" }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 18,
                textTransform: "uppercase",
              }}
            >
              Description
            </div>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 2,
                fontSize: 13,
              }}
            >
              {active.details}
            </p>
          </div>

          {/* DIVIDER */}

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
            }}
          />

          {/* COL 3 */}

          <div
            style={{
              padding: "34px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 18,
                textTransform: "uppercase",
              }}
            >
              Stack & Tools
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                flex: 1,
              }}
            >
              {active.tools.map((tool) => (
                <span
                  key={tool}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* FOOTER */}

            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.18)",
                  letterSpacing: "0.2em",
                }}
              >
                ← → NAVIGUER
              </div>

              <div
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.18)",
                  letterSpacing: "0.2em",
                }}
              >
                {String(activeIdx + 1).padStart(2, "0")} /{" "}
                {String(ALL.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
/* HELPER */
/* ───────────────────────────────────────────────────────────── */

function domToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `${r},${g},${b}`;
}
