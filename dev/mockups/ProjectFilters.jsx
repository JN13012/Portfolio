// Dev-only: four styles for the job filter of the Projects section (mockups.html?view=filters).
import { useState } from "react";
import { BrainCircuit, Code, Crosshair, LayoutGrid } from "lucide-react";
import { NetworkBackground } from "../../src/components/layout/NetworkBackground";

const JOBS = [
  { id: "all", label: "Tous", color: "#e4e4e7", icon: LayoutGrid, count: 23 },
  { id: "ia", label: "IA", color: "#38bdf8", icon: BrainCircuit, count: 8 },
  { id: "cyber", label: "Cyber", color: "#f43f5e", icon: Crosshair, count: 7 },
  { id: "dev", label: "Dev", color: "#34d399", icon: Code, count: 15 },
];

function Row({ letter, title, children }) {
  return (
    <div className="border-b border-white/10 py-10">
      <p className="mb-5 text-sm text-zinc-400">
        <span className="mr-3 rounded bg-white/10 px-2 py-1 font-bold text-white">{letter}</span>
        {title}
      </p>
      {children}
    </div>
  );
}

/** A — underline tabs, like the Expertise list: a coloured line grows under the active job. */
function Underline() {
  const [a, setA] = useState("all");
  return (
    <div className="flex gap-8">
      {JOBS.map((j) => {
        const on = a === j.id;
        return (
          <button key={j.id} onClick={() => setA(j.id)} className="group relative pb-2 text-lg">
            <span className={on ? "font-semibold" : "text-zinc-400 group-hover:text-zinc-200"} style={on ? { backgroundImage: `linear-gradient(90deg, ${j.color} 10%, #fff 115%)`, WebkitBackgroundClip: "text", color: "transparent" } : undefined}>
              {j.label}
            </span>
            <span className="ml-1.5 align-top text-xs text-zinc-500">{j.count}</span>
            <span className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300" style={{ width: on ? "100%" : "0%", background: j.color }} />
          </button>
        );
      })}
    </div>
  );
}

/** B — segmented control: one bar, a tinted glass pill slides under the active job. */
function Segmented() {
  const [a, setA] = useState("all");
  const i = JOBS.findIndex((j) => j.id === a);
  const c = JOBS[i].color;
  return (
    <div className="relative inline-grid grid-cols-4 rounded-full border border-white/10 bg-zinc-950/70 p-1 backdrop-blur-md">
      <span className="absolute inset-y-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ left: `calc(${i * 25}% + 4px)`, width: "calc(25% - 8px)", background: `${c}22`, boxShadow: `inset 0 0 0 1px ${c}66` }} />
      {JOBS.map((j) => (
        <button key={j.id} onClick={() => setA(j.id)} className={`relative z-10 inline-flex items-center justify-center gap-2 px-6 py-2 text-[15px] ${a === j.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}>
          <j.icon size={16} style={{ color: a === j.id ? j.color : undefined }} />
          {j.label}
        </button>
      ))}
    </div>
  );
}

/** C — tag chips: the active one fills with its colour, the others are outlined. */
function Chips() {
  const [a, setA] = useState("all");
  return (
    <div className="flex flex-wrap gap-2.5">
      {JOBS.map((j) => {
        const on = a === j.id;
        return (
          <button
            key={j.id}
            onClick={() => setA(j.id)}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-[15px] font-medium transition-all duration-300"
            style={{ borderColor: on ? j.color : `${j.color}40`, background: on ? `${j.color}26` : "transparent", color: on ? "#fff" : j.color }}
          >
            <j.icon size={16} />
            {j.label}
            <span className="rounded px-1.5 text-xs" style={{ background: on ? `${j.color}40` : `${j.color}14` }}>{j.count}</span>
          </button>
        );
      })}
    </div>
  );
}

/** D — terminal: the filter reads as a command, the active value is highlighted. */
function Terminal() {
  const [a, setA] = useState("all");
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/60 px-4 py-2.5 font-mono text-[15px]">
      <span className="mr-2 text-cyber">❯</span>
      <span className="mr-3 text-zinc-500">ls projets --metier</span>
      {JOBS.map((j, k) => (
        <span key={j.id} className="flex items-center">
          {k > 0 && <span className="mx-1 text-zinc-700">|</span>}
          <button onClick={() => setA(j.id)} className="rounded px-1.5 py-0.5 transition-colors" style={{ color: a === j.id ? "#0b0f14" : j.color, background: a === j.id ? j.color : "transparent" }}>
            {j.id === "all" ? "*" : j.id}
          </button>
        </span>
      ))}
    </div>
  );
}

/** A + C — underline tabs with the count in a small coloured badge (C's count, A's style). */
function UnderlineCount() {
  const [a, setA] = useState("all");
  return (
    <div className="flex gap-8">
      {JOBS.map((j) => {
        const on = a === j.id;
        return (
          <button key={j.id} onClick={() => setA(j.id)} className="group relative inline-flex items-center gap-2 pb-2.5 text-lg">
            <span className={on ? "font-semibold" : "text-zinc-400 group-hover:text-zinc-200"} style={on ? { backgroundImage: `linear-gradient(90deg, ${j.color} 10%, #fff 115%)`, WebkitBackgroundClip: "text", color: "transparent" } : undefined}>
              {j.label}
            </span>
            <span className="rounded px-1.5 text-xs tabular-nums transition-colors" style={{ color: on ? "#fff" : j.color, background: on ? `${j.color}40` : `${j.color}14` }}>{j.count}</span>
            <span className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300" style={{ width: on ? "100%" : "0%", background: j.color }} />
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectFilters() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}>
      <NetworkBackground />
      <div className="relative z-10 mx-auto w-[90%] max-w-[1400px] py-10">
        <Row letter="A+C" title="Mélange : onglets soulignés de A, nombre de projets en badge coloré de C"><UnderlineCount /></Row>
        <Row letter="A" title="Onglets soulignés, dans le style de la liste Expertise (texte en dégradé, trait de couleur)"><Underline /></Row>
        <Row letter="B" title="Barre segmentée : une pastille vitrée teintée glisse sous le métier choisi, avec icône"><Segmented /></Row>
        <Row letter="C" title="Étiquettes colorées : chaque métier garde sa couleur, l’actif se remplit, avec le nombre de projets"><Chips /></Row>
        <Row letter="D" title="Terminal : le filtre se lit comme une commande"><Terminal /></Row>
      </div>
    </div>
  );
}
