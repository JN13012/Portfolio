      {/* ========================================================= */}
      {/* GRID BACKGROUND */}
      {/* ========================================================= */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />













      



// CAROUSEL

      import React, { useMemo, useState } from "react";
      import { hardSkills } from "../components/CompetencesData";
      
      const Competences = () => {
        const [activeIndex, setActiveIndex] = useState(0);
        const [selectedSkill, setSelectedSkill] = useState(null);
      
        // =========================================================
        // FLATTEN
        // =========================================================
        const allSkills = useMemo(
          () =>
            hardSkills.flatMap((domain) =>
              domain.items.map((skill) => ({
                ...skill,
                domain: domain.category,
                theme: domain.theme,
                iconDomain: domain.icon,
              }))
            ),
          []
        );
      
        // =========================================================
        // CONFIG
        // =========================================================
        const spacing = 340;
      
        const prev = () => {
          setActiveIndex((i) =>
            i === 0 ? allSkills.length - 1 : i - 1
          );
        };
      
        const next = () => {
          setActiveIndex((i) =>
            i === allSkills.length - 1 ? 0 : i + 1
          );
        };
      
        // =========================================================
        // COVERFLOW STYLE
        // =========================================================
        const getStyle = (index) => {
          const offset = index - activeIndex;
      
          // LOOP
          const total = allSkills.length;
      
          let normalizedOffset = offset;
      
          if (offset > total / 2) {
            normalizedOffset -= total;
          }
      
          if (offset < -total / 2) {
            normalizedOffset += total;
          }
      
          const abs = Math.abs(normalizedOffset);
      
          const scale = Math.max(1 - abs * 0.12, 0.65);
      
          const rotateY = normalizedOffset * -28;
      
          const x = normalizedOffset * spacing;
      
          const z = -abs * 180;
      
          const opacity = Math.max(1 - abs * 0.18, 0.18);
      
          return {
            transform: `
              translateX(${x}px)
              translateZ(${z}px)
              rotateY(${rotateY}deg)
              scale(${scale})
            `,
            zIndex: 100 - abs,
            opacity,
            filter: `blur(${abs * 0.6}px)`,
          };
        };
      
        return (
          <section
            id="competences"
            className="relative py-40 bg-[#020202] overflow-hidden text-white"
          >
      
            {/* ========================================================= */}
            {/* BACKGROUND */}
            {/* ========================================================= */}
      
            {/* GRID */}
            <div className="absolute inset-0 overflow-hidden">
      
              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]
                  bg-[size:48px_48px]
                "
              />
      
              {/* LIGHT */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      
              {/* VIGNETTE */}
              <div className="absolute inset-0 bg-black/40" />
      
            </div>
      
            {/* ========================================================= */}
            {/* CONTENT */}
            {/* ========================================================= */}
      
            <div className="container mx-auto px-6 relative z-10">
      
              {/* ========================================================= */}
              {/* HEADER */}
              {/* ========================================================= */}
      
              <div className="mb-28">
      
                <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-6">
      
                  <span className="text-blue-500 font-mono text-base opacity-60">
                    04.
                  </span>
      
                  <span className="uppercase tracking-[0.25em] font-mono italic text-zinc-100">
                    Technical Expertise
                  </span>
      
                  <div className="h-px bg-white/10 flex-1"></div>
      
                </h2>
      
                <p className="mt-8 max-w-3xl text-sm leading-relaxed text-zinc-500 font-mono">
                  Cybersécurité offensive et défensive, systèmes IA génératifs,
                  architectures backend modernes et pipelines DevSecOps.
                </p>
      
              </div>
      
              {/* ========================================================= */}
              {/* CAROUSEL */}
              {/* ========================================================= */}
      
              <div className="relative h-[700px] flex items-center justify-center perspective-[2400px]">
      
                {/* LEFT */}
                <button
                  onClick={prev}
                  className="
                    absolute
                    left-0
                    z-[999]
                    w-14
                    h-14
                    rounded-full
                    border
                    border-white/10
                    bg-black/40
                    backdrop-blur-xl
                    flex
                    items-center
                    justify-center
                    text-3xl
                    text-white/60
                    hover:text-white
                    hover:border-white/30
                    transition-all
                  "
                >
                  ‹
                </button>
      
                {/* TRACK */}
                <div
                  className="
                    relative
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    [transform-style:preserve-3d]
                  "
                >
      
                  {allSkills.map((skill, i) => (
      
                    <div
                      key={i}
                      onClick={() => {
                        setActiveIndex(i);
                        setSelectedSkill(skill);
                      }}
                      className="
                        absolute
                        transition-all
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        cursor-pointer
                        group
                      "
                      style={{
                        ...getStyle(i),
                        width: "320px",
                        height: "420px",
                      }}
                    >
      
                      {/* CARD */}
                      <div
                        className={`
                          relative
                          h-full
                          w-full
                          overflow-hidden
                          rounded-[32px]
                          border
                          ${skill.theme}
                          bg-[#090909]/90
                          backdrop-blur-2xl
                          p-7
                          shadow-[0_20px_80px_rgba(0,0,0,0.65)]
                          transition-all
                          duration-500
                          group-hover:-translate-y-3
                        `}
                      >
      
                        {/* TOP GLOW */}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%)]"></div>
      
                        {/* NUMBER */}
                        <div className="absolute top-6 right-6 text-[10px] font-mono text-white/20 tracking-[0.3em]">
                          0{i + 1}
                        </div>
      
                        {/* DOMAIN */}
                        <div className="relative z-10 flex items-center justify-between mb-10">
      
                          <div className="text-[10px] uppercase tracking-[0.35em] font-mono opacity-50">
                            {skill.domain}
                          </div>
      
                          <div className="text-3xl opacity-80">
                            {skill.iconDomain}
                          </div>
      
                        </div>
      
                        {/* TITLE */}
                        <h3 className="relative z-10 text-2xl uppercase tracking-wide font-mono text-white mb-6 leading-tight">
                          {skill.name}
                        </h3>
      
                        {/* DESCRIPTION */}
                        <p className="relative z-10 text-sm text-zinc-400 leading-relaxed mb-10">
                          {skill.details}
                        </p>
      
                        {/* TOOLS */}
                        <div className="relative z-10 flex flex-wrap gap-2">
      
                          {skill.tools
                            .split(", ")
                            .slice(0, 5)
                            .map((tool, idx) => (
                              <span
                                key={idx}
                                className="
                                  px-3
                                  py-1.5
                                  text-[10px]
                                  uppercase
                                  tracking-widest
                                  border
                                  border-white/10
                                  bg-white/[0.03]
                                  text-zinc-300
                                  font-mono
                                "
                              >
                                {tool}
                              </span>
                            ))}
      
                        </div>
      
                        {/* BOTTOM LINE */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
                          <div
                            className={`
                              h-full
                              w-1/2
                              ${skill.theme.replace("text", "bg").split(" ")[1]}
                            `}
                          ></div>
                        </div>
      
                      </div>
      
                    </div>
                  ))}
      
                </div>
      
                {/* RIGHT */}
                <button
                  onClick={next}
                  className="
                    absolute
                    right-0
                    z-[999]
                    w-14
                    h-14
                    rounded-full
                    border
                    border-white/10
                    bg-black/40
                    backdrop-blur-xl
                    flex
                    items-center
                    justify-center
                    text-3xl
                    text-white/60
                    hover:text-white
                    hover:border-white/30
                    transition-all
                  "
                >
                  ›
                </button>
      
              </div>
      
              {/* ========================================================= */}
              {/* INDICATORS */}
              {/* ========================================================= */}
      
              <div className="mt-12 flex justify-center gap-3">
      
                {allSkills.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`
                      transition-all
                      duration-500
                      rounded-full
                      ${
                        i === activeIndex
                          ? "w-10 h-2 bg-white"
                          : "w-2 h-2 bg-white/20 hover:bg-white/40"
                      }
                    `}
                  />
                ))}
      
              </div>
      
              {/* ========================================================= */}
              {/* MODAL */}
              {/* ========================================================= */}
      
              {selectedSkill && (
      
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-16">
      
                  <div
                    className={`
                      relative
                      w-full
                      max-w-6xl
                      rounded-[40px]
                      overflow-hidden
                      border
                      ${selectedSkill.theme}
                      bg-[#050505]
                      shadow-[0_40px_120px_rgba(0,0,0,0.8)]
                    `}
                  >
      
                    {/* GRID */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      
                    {/* HEADER */}
                    <div className="relative z-10 p-8 border-b border-white/5 flex justify-between items-center">
      
                      <div>
      
                        <div className="text-[10px] uppercase tracking-[0.4em] font-mono opacity-50 mb-3">
                          {selectedSkill.domain}
                        </div>
      
                        <h3 className="text-4xl font-mono uppercase tracking-wide text-white">
                          {selectedSkill.name}
                        </h3>
      
                      </div>
      
                      <button
                        onClick={() => setSelectedSkill(null)}
                        className="
                          px-5
                          py-3
                          border
                          border-white/10
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          font-mono
                          text-zinc-400
                          hover:text-white
                          hover:border-white/30
                          transition-all
                        "
                      >
                        Close
                      </button>
      
                    </div>
      
                    {/* BODY */}
                    <div className="relative z-10 grid md:grid-cols-2">
      
                      {/* LEFT */}
                      <div className="relative min-h-[500px] border-r border-white/5 flex items-center justify-center overflow-hidden">
      
                        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.03] blur-3xl"></div>
      
                        <div className="text-[180px] opacity-90">
                          {selectedSkill.iconDomain}
                        </div>
      
                      </div>
      
                      {/* RIGHT */}
                      <div className="p-12 md:p-16">
      
                        <p className="text-zinc-300 leading-relaxed text-lg mb-12">
                          {selectedSkill.details}
                        </p>
      
                        {/* STACK */}
                        <div>
      
                          <div className="text-[10px] uppercase tracking-[0.4em] font-mono opacity-50 mb-6">
                            Technologies
                          </div>
      
                          <div className="flex flex-wrap gap-3">
      
                            {selectedSkill.tools
                              .split(", ")
                              .map((tool, idx) => (
                                <span
                                  key={idx}
                                  className="
                                    px-4
                                    py-2
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    font-mono
                                    text-zinc-300
                                  "
                                >
                                  {tool}
                                </span>
                              ))}
      
                          </div>
      
                        </div>
      
                      </div>
      
                    </div>
      
                  </div>
      
                </div>
              )}
      
            </div>
          </section>
        );
      };
      
      export default Competences;