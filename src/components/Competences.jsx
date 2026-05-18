import React, { useState, useEffect, useCallback, useRef } from "react";
import SectionHeader from "./SectionHeader";
import { DOMAINS, TOOL_DESCRIPTIONS, TOOL_ICONS } from "./CompetencesData";

const ALL = DOMAINS.flatMap((d) =>
  d.items.map((it) => ({
    ...it,
    domain: d,
  })),
);

const CAROUSEL_PERSPECTIVE = 2400;
const FIRST_CARD_SPACING = 390;
const BACKGROUND_CARD_SPACING = 335;
const CARD_DEPTH = 260;
const CARD_SCALE_STEP = 0.1;
const MIN_CARD_SCALE = 0.72;
const ACTIVE_CARD_SIZE = { width: 380, height: 120 };
const INACTIVE_CARD_SIZE = { width: 260, height: 110 };
const HITBOX_PADDING = 22;

const LevelBadge = () => (
  <div className="absolute right-6 top-0 z-20 -translate-y-1/2">
    <div className="absolute -left-3 -right-3 top-1/2 h-[3px] -translate-y-1/2 bg-[#080808]" />
    <div className="relative inline-flex items-center rounded-sm border border-cyber/30 bg-black/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-cyber/80 shadow-[0_10px_24px_rgba(0,0,0,0.42)]">
      Niveau : Junior
    </div>
  </div>
);

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

  const selectSkill = useCallback(
    (idx) => {
      if (idx === activeIdx) return;

      setPanelVis(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setActiveIdx(idx);
        setPanelVis(true);
      }, 180);
    },
    [activeIdx],
  );

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

  const getCardOffset = (i) => {
    const offset = i - activeIdx;
    const total = ALL.length;

    let normalizedOffset = offset;

    if (offset > total / 2) normalizedOffset -= total;
    if (offset < -total / 2) normalizedOffset += total;

    return normalizedOffset;
  };

  const getCardX = (normalizedOffset) => {
    const direction = Math.sign(normalizedOffset);
    const abs = Math.abs(normalizedOffset);

    if (abs === 0) return 0;

    return direction * (FIRST_CARD_SPACING + (abs - 1) * BACKGROUND_CARD_SPACING);
  };

  const getCardTransform = (i) => {
    const normalizedOffset = getCardOffset(i);
    const abs = Math.abs(normalizedOffset);
    const x = getCardX(normalizedOffset);
    const z = -abs * CARD_DEPTH;
    const rotateY = normalizedOffset * -24;
    const scale = Math.max(1 - abs * CARD_SCALE_STEP, MIN_CARD_SCALE);
    const opacity = 1;

    return {
      transform: `
        translate(-50%,-50%)
        translate3d(${x}px,0,${z}px)
        rotateY(${rotateY}deg)
        rotateX(4deg)
        scale(${scale})
      `,
      opacity,
      zIndex: 100 - abs,
      filter: "none",
      transition:
        "transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease",
      willChange: "transform",
    };
  };

  const getCardHitboxStyle = (i) => {
    const normalizedOffset = getCardOffset(i);
    const abs = Math.abs(normalizedOffset);
    const z = -abs * CARD_DEPTH;
    const perspectiveScale = CAROUSEL_PERSPECTIVE / (CAROUSEL_PERSPECTIVE - z);
    const scale = Math.max(1 - abs * CARD_SCALE_STEP, MIN_CARD_SCALE);
    const projectedScale = scale * perspectiveScale;

    return {
      width: `${INACTIVE_CARD_SIZE.width * projectedScale + HITBOX_PADDING}px`,
      height: `${INACTIVE_CARD_SIZE.height * projectedScale + HITBOX_PADDING}px`,
      transform: `translate(-50%, -50%) translateX(${
        getCardX(normalizedOffset) * perspectiveScale
      }px)`,
      zIndex: 100 - abs,
    };
  };

  /* ───────────────────────────────────────────── */
  /* DISPLAY DATA */
  /* ───────────────────────────────────────────── */

  const domainStart = DOMAINS.slice(0, DOMAINS.indexOf(dom)).reduce(
    (a, d) => a + d.items.length,
    0,
  );

  const skillIndexInDomain = activeIdx - domainStart;
  const visibleIconCount =
    active.tools.filter((tool) => TOOL_ICONS?.[tool]).length ||
    active.tools.length;
  const iconGlowColor = active.accent ?? dom.hue;
  const iconGlowWidthMultiplier =
    active.name === "Red Team" || active.name === "Blue Team"
      ? 1.2
      : active.name === "Full Stack"
        ? 1.08
      : active.name === "DevOps"
        ? 0.72
        : 1;
  const iconGlowCoreWidth = `${Math.min(
    86,
    Math.max(28, (24 + visibleIconCount * 5.5) * iconGlowWidthMultiplier),
  )}%`;
  const iconGlowCoreHeight = `${Math.min(195, Math.max(92, 72 + visibleIconCount * 11))}px`;

  /* ───────────────────────────────────────────── */
  /* RENDER */
  /* ───────────────────────────────────────────── */

  return (
    <div
      id="competences"
      className="py-24 bg-black/45 text-white relative overflow-hidden border-y border-cyber/10"
    >
      <div className="mx-auto px-2 relative z-10">
        <SectionHeader index="02" title="Expertise Technique" />

        {/* Carousel */}
        <div
          className="relative -mt-6 flex h-[175px] items-center justify-center"
          style={{ perspective: `${CAROUSEL_PERSPECTIVE}px` }}
        >
          {/* Track */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {ALL.map((skill, i) => {
              const d = skill.domain;
              const skillAccent = skill.accent ?? d.hue;
              const isActiveCard = i === activeIdx;
              const cardSize = isActiveCard
                ? ACTIVE_CARD_SIZE
                : INACTIVE_CARD_SIZE;

              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 cursor-crosshair"
                  style={{
                    cursor: "crosshair",
                    width: `${cardSize.width}px`,
                    height: `${cardSize.height}px`,
                    pointerEvents: "none",
                    transformStyle: "preserve-3d",
                    ...getCardTransform(i),
                  }}
                  aria-hidden="true"
                >
                  {/* Card */}
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-md border bg-[#080808] transition ${
                      isActiveCard
                        ? "shadow-[0_0_34px_rgba(255,255,255,0.08),0_26px_70px_rgba(0,0,0,0.62)]"
                        : "shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                    }`}
                    style={{
                      cursor: "crosshair",
                      borderColor: isActiveCard
                        ? `${skillAccent}77`
                        : "rgba(255,255,255,0.25)",
                      transformStyle: "preserve-3d",
                      boxShadow: isActiveCard
                        ? `0 0 14px ${skillAccent}44, 0 0 36px ${skillAccent}24, 0 28px 70px rgba(0,0,0,0.62)`
                        : undefined,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] to-transparent" />

                    <div
                      className={`relative z-10 flex h-full flex-col ${isActiveCard ? "px-7 pb-8 pt-5" : "px-4 pb-7 pt-4"}`}
                    >
                      <div
                        className={`min-h-[1.2em] max-w-full truncate uppercase leading-none tracking-[0.2em] ${
                          isActiveCard ? "text-[14px]" : "text-[11px]"
                        }`}
                        style={{ color: d.hue }}
                      >
                        {d.label}
                      </div>

                      <div
                        className={`flex flex-1 items-center font-medium text-white ${
                          isActiveCard
                            ? "mt-2 text-[24px] leading-[1.08]"
                            : "mt-1 text-[17px] leading-[1.12]"
                        }`}
                      >
                        <span className="line-clamp-2">{skill.name}</span>
                      </div>
                    </div>

                    {/* Accent bar */}
                    <div className="absolute bottom-4 left-5 right-5 h-[3px] bg-white/25">
                      <div
                        className="h-full rounded-full"
                        style={{ width: "60%", background: skillAccent }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pointer-events-none absolute inset-0 z-[200]">
              {ALL.map((skill, i) => {
                if (i === activeIdx) return null;

                return (
                  <button
                    type="button"
                    key={skill.name}
                    onClick={() => selectSkill(i)}
                    className="pointer-events-auto absolute left-1/2 top-1/2 cursor-crosshair bg-transparent"
                    style={getCardHitboxStyle(i)}
                    aria-label={`Afficher la compétence ${skill.name}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative -mt-2 px-20">
          <button
            onClick={() => go(-1)}
            className="
              absolute left-0 top-1/2 z-20
              h-14 w-14 -translate-y-1/2 rounded-full
              border border-white/25
              bg-black/85
              cursor-pointer
              text-[36px] text-white
              transition-all duration-300
              hover:border-white/45
              hover:bg-white/15
            "
          >
            ‹
          </button>

          <button
            onClick={() => go(1)}
            className="
              absolute right-0 top-1/2 z-20
              h-14 w-14 -translate-y-1/2 rounded-full
              border border-white/25
              bg-black/85
              cursor-pointer
              text-[36px] text-white
              transition-all duration-300
              hover:border-white/45
              hover:bg-white/15
            "
          >
            ›
          </button>

          {/* Icons */}
          <div className="relative mt-16 min-h-[16rem]">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl transition-all duration-500"
              style={{
                width: iconGlowCoreWidth,
                height: iconGlowCoreHeight,
                background: `linear-gradient(180deg, transparent 0%, ${iconGlowColor}26 24%, ${iconGlowColor}cc 50%, ${iconGlowColor}26 76%, transparent 100%)`,
              }}
            />
            <div className="relative z-10 flex min-h-[16rem] flex-wrap content-center items-center justify-center gap-x-6 gap-y-2">
              {active.tools.map((tool) => {
                const iconUrl = TOOL_ICONS?.[tool];
                const toolDescription = TOOL_DESCRIPTIONS?.[tool];

                return (
                  <div
                    key={tool}
                    className="group relative flex h-32 w-32 items-center justify-center"
                  >
                    <div
                      className="pointer-events-none absolute -top-16 left-1/2 z-20 flex -translate-x-1/2 translate-y-2 flex-col items-center whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-105 group-hover:opacity-100"
                      style={{
                        color: iconGlowColor,
                      }}
                    >
                      <span
                        className="font-mono text-[23px] font-semibold uppercase tracking-[0.2em]"
                        style={{
                          textShadow: `0 0 8px ${iconGlowColor}, 0 0 22px ${iconGlowColor}99, 0 0 36px ${iconGlowColor}40`,
                        }}
                      >
                        {tool}
                      </span>
                      {toolDescription && (
                        <span
                          className="mt-0.5 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-white/85"
                          style={{
                            textShadow: `0 0 10px ${iconGlowColor}80`,
                          }}
                        >
                          {toolDescription}
                        </span>
                      )}
                    </div>
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt={tool}
                        className="h-28 w-28 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-110"
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
          </div>

          {/* Detail panel */}
          <div
            className={`
    min-h-[205px]
    grid grid-cols-[1.01fr_1px_2.35fr]
    relative overflow-visible rounded-md
    border border-white/15
    bg-[#080808]
    shadow-[0_22px_70px_rgba(0,0,0,0.46)]
    transition-all duration-500
    ${panelVis ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}
  `}
          >
            {/* Identity */}
            <div className="flex flex-col justify-center p-6">
              <div className="max-w-[92%]">
                <div
                  className="mb-4 h-px w-7 rounded-full"
                  style={{ background: active.accent ?? dom.hue }}
                />

                <div className="text-2xl md:text-3xl leading-[1.04] text-white">
                  {active.name}
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <div className="mb-3 text-base uppercase leading-[1.7] tracking-[0.16em] text-zinc-300">
                    {active.tag}
                  </div>

                  <div className="relative h-px bg-white/20">
                    <div
                      className="absolute inset-0"
                      style={{
                        width: `${((skillIndexInDomain + 1) / dom.items.length) * 100}%`,
                        background: active.accent ?? dom.hue,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="bg-white/15" />

            {/* Description */}
            <div className="p-6">
              <LevelBadge />
              <div className="mb-3 text-sm md:text-base uppercase tracking-[0.26em] text-white/90">
                Description
              </div>

              <p className="text-base leading-[1.72] text-white/82">
                {active.details}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
