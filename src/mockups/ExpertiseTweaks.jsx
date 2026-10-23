// Dev-only: gradient variants for the active domain name, and the new Pentest icons
// against the old monograms (mockups.html?view=tweaks).
import { expertise } from "../content/expertise";
import { Logo } from "../sections/Expertise/Expertise";
import { NetworkBackground2 } from "../components/NetworkBackground2";

// Same tints as the site (Expertise.tsx, HUE.text).
const TEXT = { ia: "#a5b4fc", offensive: "#f87171", defensive: "#60a5fa", devops: "#fbbf24", dev: "#4ade80" };
const ACCENT = { ia: "#818cf8", offensive: "#ef4444", defensive: "#2563eb", devops: "#f59e0b", dev: "#22c55e" };

const VARIANTS = [
  ["1", "Blanc atteint à 100 % du mot", (c) => `linear-gradient(90deg, ${c}, #fff 100%)`],
  ["2", "Blanc atteint à 75 %", (c) => `linear-gradient(90deg, ${c}, #fff 75%)`],
  ["3", "Blanc atteint à 60 %", (c) => `linear-gradient(90deg, ${c}, #fff 60%)`],
  ["4", "Actuel : couleur jusqu’à 10 %, blanc à 115 % (≈ 86 % en fin de mot)", (c) => `linear-gradient(90deg, ${c} 10%, #fff 115%)`],
  ["5", "Couleur tenue jusqu’à 40 %, puis blanc à 100 %", (c) => `linear-gradient(90deg, ${c} 40%, #fff 100%)`],
  ["6", "Doux : ne va pas jusqu’au blanc (≈ 60 % du chemin)", (c) => `linear-gradient(90deg, ${c}, #fff 165%)`],
  ["7", "Reflet : couleur, éclat blanc au centre, couleur", (c) => `linear-gradient(90deg, ${c} 5%, #fff 50%, ${c} 95%)`],
  ["8", "Inversé : blanc puis couleur", (c) => `linear-gradient(90deg, #fff 10%, ${c} 100%)`],
];

const PENTEST_NEW = ["NetExec", "Impacket", "Responder", "Mimikatz", "pypykatz"];

function Monogram({ name, tone }) {
  const w = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean);
  const m = (w.length > 1 ? w[0][0] + w[1][0] : name.slice(0, 2)).toUpperCase();
  return (
    <span className="grid size-[74px] place-items-center rounded-2xl border text-[26px] font-semibold" style={{ color: tone, borderColor: `${tone}55`, background: `linear-gradient(160deg, ${tone}22, ${tone}08)` }}>
      {m}
    </span>
  );
}

export default function ExpertiseTweaks() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}>
      <NetworkBackground2 />
      <div className="relative z-10 mx-auto w-[90%] max-w-[1600px] py-14">
        <h2 className="text-2xl font-semibold">Dégradé du domaine sélectionné</h2>
        <p className="mt-1 text-sm text-zinc-400">Les 5 domaines sont affichés « sélectionnés » pour comparer mots courts et longs.</p>
        <div data-board="gradients" className="mt-8 grid grid-cols-4 gap-x-10 gap-y-10">
          {VARIANTS.map(([n, label, grad]) => (
            <div key={n}>
              <p className="mb-3 text-sm text-zinc-400">
                <span className="mr-2 rounded bg-white/10 px-2 py-0.5 font-bold text-white">{n}</span>
                {label}
              </p>
              <ul className="space-y-1">
                {expertise.map((d, i) => (
                  <li key={d.id} className="flex items-center gap-3.5 py-2">
                    <span className="text-xs text-zinc-300 tabular-nums">0{i + 1}</span>
                    <span className="h-0.5 w-8 rounded-full" style={{ background: ACCENT[d.id] }} />
                    <span className="text-[17px] font-semibold" style={{ backgroundImage: grad(TEXT[d.id]), WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                      {d.label.fr}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-20 text-2xl font-semibold">Icônes Pentest et IA sans logo</h2>
        <p className="mt-1 text-sm text-zinc-400">En haut : les initiales actuelles. En bas : les nouvelles icônes (logo officiel d’Impacket, emblèmes dessinés pour les autres).</p>
        <div data-board="icons" className="mt-8 grid grid-cols-6 gap-6">
          {[...PENTEST_NEW.map((n) => [n, ACCENT.offensive]), ["FAISS", ACCENT.ia]].map(([name, tone]) => (
            <div key={name} className="flex flex-col items-center gap-5 rounded-xl border border-white/10 bg-zinc-950/50 py-6">
              <Monogram name={name} tone={tone} />
              <span className="grid h-[90px] place-items-center">
                <Logo name={name} size={96} tone={tone} />
              </span>
              <span className="text-sm text-zinc-300">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
