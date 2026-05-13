import React, { useState, useEffect, useCallback, useRef } from "react";
import { DOMAINS, TOOL_ICONS } from "./CompetencesData";

const ALL = DOMAINS.flatMap((d) =>
  d.items.map((it) => ({
    ...it,
    domain: d,
  })),
);

const LEVEL_COLORS = {
  Expert: {
    bg: "rgba(250,204,21,0.12)",
    border: "rgba(250,204,21,0.35)",
    text: "#facc15",
  },
  Avancé: {
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.30)",
    text: "#22c55e",
  },
  Intermédiaire: {
    bg: "rgba(148,163,184,0.10)",
    border: "rgba(148,163,184,0.25)",
    text: "#94a3b8",
  },
};

export default function Competences() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [panelVis, setPanelVis] = useState(true);

  const timeoutRef = useRef(null);

  const active = ALL[activeIdx];
  const dom = active.domain;

  /* ───────────────────────────────────────────── */
  /* NAVIGATION */
  /* ───────────────────────────────────────────── */

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

  /* ───────────────────────────────────────────── */
  /* COVERFLOW */
  /* ───────────────────────────────────────────── */

  const getCardTransform = (i) => {
    const offset = i - activeIdx;
    const total = ALL.length;

    let normalizedOffset = offset;

    if (offset > total / 2) normalizedOffset -= total;
    if (offset < -total / 2) normalizedOffset += total;

    const abs = Math.abs(normalizedOffset);
    const spacing = 270;
    const x = normalizedOffset * spacing;
    const z = -abs * 220;
    const rotateY = normalizedOffset * -30;
    const scale = Math.max(1 - abs * 0.12, 0.68);
    const opacity = Math.max(1 - abs * 0.18, 0.15);

    return {
      transform: `
        translate3d(${x}px,0,${z}px)
        rotateY(${rotateY}deg)
        rotateX(4deg)
        scale(${scale})
      `,
      opacity,
      zIndex: 100 - abs,
      filter: `blur(${abs * 0.7}px)`,
      transition:
        "transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease, filter 700ms ease",
      willChange: "transform",
    };
  };

  /* ───────────────────────────────────────────── */
  /* PROGRESS */
  /* ───────────────────────────────────────────── */

  const domainStart = DOMAINS.slice(0, DOMAINS.indexOf(dom)).reduce(
    (a, d) => a + d.items.length,
    0,
  );

  const skillIndexInDomain = activeIdx - domainStart;

  /* ───────────────────────────────────────────── */
  /* RENDER */
  /* ───────────────────────────────────────────── */

  return (
    <div className="py-32 bg-[#020202] text-white relative overflow-hidden border-y border-cyber/10">
      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <h2 className="text-2xl md:text-3xl font-bold mb-20 flex items-center gap-6">
          <span className="text-cyber font-mono text-base opacity-60">06.</span>
          <span className="text-zinc-100 tracking-[0.2em] uppercase font-mono">
            Technical Expertise
          </span>
          <div className="h-px bg-cyber/20 flex-1" />
        </h2>

        {/* DOMAIN NAV */}
        <div className="mb-3">
          <div className="mt-5 flex flex-col gap-3">
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
                  className={`flex items-center gap-3 border-none bg-transparent transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.25em]"
                    style={{
                      color: isActive ? d.hue : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {d.index} {d.label}
                  </span>

                  <div
                    className="h-px w-6"
                    style={{
                      background: isActive ? d.hue : "rgba(255,255,255,0.2)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* CAROUSEL */}
        <div
          className="relative flex h-[300px] items-center justify-center"
          style={{ perspective: "2400px" }}
        >
          {/* LEFT */}
          <button
            onClick={() => go(-1)}
            className="
              absolute left-0 z-[999]
              h-14 w-14 rounded-full
              border border-white/10
              bg-black/40
              text-[30px] text-white/60
              backdrop-blur-xl
              transition-all duration-300
              hover:border-white/20
              hover:bg-white/10
              hover:text-white
            "
          >
            ‹
          </button>

          {/* RIGHT */}
          <button
            onClick={() => go(1)}
            className="
              absolute right-0 z-[999]
              h-14 w-14 rounded-full
              border border-white/10
              bg-black/40
              text-[30px] text-white/60
              backdrop-blur-xl
              transition-all duration-300
              hover:border-white/20
              hover:bg-white/10
              hover:text-white
            "
          >
            ›
          </button>

          {/* TRACK */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
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
                  className="absolute h-[320px] w-[240px] cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    ...getCardTransform(i),
                  }}
                >
                  {/* CARD */}
                  <div
                    className="relative h-[90px] w-[220px] cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition hover:border-white/30"
                    style={{
                      transformStyle: "preserve-3d",
                      ...getCardTransform(i),
                    }}
                  >
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent" />

                    <div className="relative z-10 flex h-full flex-col justify-center px-4">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {d.label}
                      </div>

                      <div className="text-[14px] font-medium text-white">
                        {skill.name}
                      </div>
                    </div>

                    {/* accent bar */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/10">
                      <div
                        className="h-full"
                        style={{ width: "60%", background: d.hue }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOOLS STRIP (entre cards et panel) */}
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          {active.tools.map((tool) => {
            const iconUrl = TOOL_ICONS?.[tool];

            return (
              <div
                key={tool}
                className="group flex items-center justify-center"
                title={tool}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={tool}
                    className="h-7 w-7 object-contain opacity-60 transition hover:opacity-100 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                )}
              </div>
            );
          })}
        </div>

        {/* DETAIL PANEL */}
        <div
          className={`
            mt-[60px]
            grid overflow-hidden rounded-[24px]
            border border-white/5
            bg-[#080808]/70
            backdrop-blur-xl
            transition-all duration-500
            ${panelVis ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}
          `}
          style={{ gridTemplateColumns: "1fr 1px 2fr 1px 1fr" }}
        >
          {/* COL 1 — Identité */}
          <div className="p-[34px]">
            <div
              className="mb-[14px] text-base uppercase tracking-[0.35em]"
              style={{ color: dom.hue }}
            >
              {dom.index} — {dom.label}
            </div>

            <div className="mb-[10px] text-[30px] leading-[1.2] text-white">
              {active.name}
            </div>

            <div className="text-[10px] tracking-[0.18em] text-white/25">
              {dom.tag}
            </div>

            {/* PROGRESS */}
            <div className="mt-6">
              <div className="mb-2 text-base tracking-[0.2em] text-white">
                {dom.label} · {String(skillIndexInDomain + 1).padStart(2, "0")}/
                {String(dom.items.length).padStart(2, "0")}
              </div>

              <div className="relative h-px bg-white/10">
                <div
                  className="absolute inset-0"
                  style={{
                    width: `${((skillIndexInDomain + 1) / dom.items.length) * 100}%`,
                    background: dom.hue,
                  }}
                />
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="bg-white/5" />

          {/* COL 2 — Description */}
          <div className="p-[34px]">
            <div className="mb-[18px] text-base uppercase tracking-[0.35em] text-white">
              Description
            </div>

            <p className="text-[13px] leading-[2] text-white/60">
              {active.details}
            </p>
          </div>

          {/* DIVIDER */}
          <div className="bg-white/5" />

          {/* COL 3 — Stack & Tools */}
          <div className="flex flex-col p-[34px]">
            {/* HEADER + NIVEAU */}
            <div className="mb-5 flex items-center justify-between">
              <div className="text-base uppercase tracking-[0.35em] text-white">
                Stack & Tools
              </div>

              {active.level &&
                (() => {
                  const lc =
                    LEVEL_COLORS[active.level] ?? LEVEL_COLORS["Intermédiaire"];
                  return (
                    <span
                      className="rounded-sm px-2.5 py-1 text-[9px] uppercase tracking-[0.18em]"
                      style={{
                        background: lc.bg,
                        border: `1px solid ${lc.border}`,
                        color: lc.text,
                      }}
                    >
                      {active.level}
                    </span>
                  );
                })()}
            </div>

            {/* TOOLS avec icônes devicon */}
            <div className="flex flex-1 flex-wrap gap-2">
              {active.tools.map((tool) => {
                const iconUrl = TOOL_ICONS?.[tool];
                return (
                  <div
                    key={tool}
                    className="flex items-center gap-1.5 border border-white/10 bg-white/[0.03] px-2.5 py-1.5"
                  >
                    {iconUrl && (
                      <img
                        src={iconUrl}
                        alt={tool}
                        className="h-3.5 w-3.5 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <span className="text-[9px] uppercase tracking-[0.08em] text-white/60">
                      {tool}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INDICATORS */}
        <div className="mt-5 flex justify-center gap-2.5">
          {ALL.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: i === activeIdx ? 42 : 8,
                background:
                  i === activeIdx ? dom.hue : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
