// Dev-only: the Expertise section as a grid instead of a carousel (mockups.html?view=grid).
import { useState } from "react";
import { expertise } from "../content/expertise";
import { Logo } from "../sections/Expertise/Expertise";
import SectionHeader from "../components/SectionHeader";
import { NetworkBackground2 } from "../components/NetworkBackground2";

const ACCENT = { ia: "#818cf8", offensive: "#ef4444", defensive: "#2563eb", devops: "#f59e0b", dev: "#22c55e" };
const TEXT = { ia: "#a5b4fc", offensive: "#f87171", defensive: "#60a5fa", devops: "#fbbf24", dev: "#4ade80" };

export default function ExpertiseGrid() {
  const [d, setD] = useState(1);
  const [t, setT] = useState(7);
  const domain = expertise[d];
  const accent = ACCENT[domain.id];
  const tool = domain.tools[Math.min(t, domain.tools.length - 1)];
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}>
      <NetworkBackground2 />
      <div className="relative z-10 mx-auto w-[90%] max-w-[2400px]">
        <section className="py-24">
          <SectionHeader index="02" title="Expertise" />
          <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:items-center">
            <div className="flex flex-col gap-1">
              {expertise.map((x, i) => {
                const on = i === d;
                return (
                  <button key={x.id} type="button" onClick={() => { setD(i); setT(0); }} className="group flex items-center gap-3.5 rounded-lg px-4 py-3.5 text-left">
                    <span className={`text-xs tabular-nums ${on ? "text-zinc-300" : "text-zinc-600"}`}>0{i + 1}</span>
                    <span className={`h-0.5 rounded-full ${on ? "w-8" : "w-3 bg-zinc-600"}`} style={on ? { background: ACCENT[x.id] } : undefined} />
                    <span className={`text-[17px] ${on ? "font-semibold" : "font-medium text-zinc-400"}`} style={on ? { backgroundImage: `linear-gradient(90deg, ${TEXT[x.id]} 10%, #fff 115%)`, WebkitBackgroundClip: "text", color: "transparent" } : undefined}>
                      {x.label.fr}
                    </span>
                  </button>
                );
              })}
            </div>
            <div>
              {/* Name and use of the selected (or hovered) tool. */}
              <div className="mb-6 h-14 text-center">
                <p className="text-[20px] font-semibold tracking-[0.16em] uppercase" style={{ color: accent, textShadow: `0 0 8px ${accent}, 0 0 22px ${accent}99` }}>{tool.name}</p>
                <p className="mt-0.5 text-[12px] font-semibold tracking-[0.14em] text-white/85 uppercase">{tool.note.fr}</p>
              </div>
              <ul className="mx-auto grid max-w-4xl grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-7">
                {domain.tools.map((x, i) => {
                  const on = x.name === tool.name;
                  return (
                    <li key={x.name}>
                      <button
                        type="button"
                        onMouseEnter={() => setT(i)}
                        onClick={() => setT(i)}
                        className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-300"
                        style={{
                          borderColor: on ? `${accent}99` : "rgba(255,255,255,0.07)",
                          background: on ? `radial-gradient(circle at 50% 40%, ${accent}33, rgba(9,9,11,0.7) 70%)` : "rgba(9,9,11,0.45)",
                          boxShadow: on ? `0 0 30px -8px ${accent}` : "none",
                          transform: on ? "translateY(-3px)" : "none",
                        }}
                      >
                        <Logo name={x.name} size={56} tone={accent} />
                        <span className={`text-[11px] ${on ? "text-white" : "text-zinc-500"}`}>{x.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
