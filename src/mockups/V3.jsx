// Dev-only mockup of a calmer style (mockups.html?view=v3&palette=green|blue): one accent on
// deep navy, a sans-serif for headings and text (mono kept for labels), more whitespace,
// a simpler hero and the Expertise section as cards. Lessons from mathieulc.fr and others.
import { useLayoutEffect } from "react";
import { AudioLines, BrainCircuit, Code, Crosshair, Database, Download, FlaskConical, KeyRound, Mail, Network, Server, Shield } from "lucide-react";
import { hero } from "../content/hero";
import { profile } from "../content/profile";
import { skills } from "../content/skills";
import { NeuralHero } from "../sections/Hero/core/NeuralHero";
import { NetworkBackground2 } from "../components/NetworkBackground2";

const PALETTES = {
  green: { accent: "#34d399", accentText: "#03140d", glow: "52, 211, 153" },
  blue: { accent: "#4c7dff", accentText: "#ffffff", glow: "76, 125, 255" },
};

const NAV = ["Profil", "Expertise", "Projets", "Lab", "Parcours", "Contact"];

// Eight cards, like a short list of what can be done on day one.
const CARDS = [
  { track: "IA", icon: BrainCircuit, group: skills.ia[0] },
  { track: "IA", icon: AudioLines, group: skills.ia[1] },
  { track: "IA", icon: Database, group: skills.ia[2] },
  { track: "Cyber", icon: Crosshair, group: skills.cyber[0] },
  { track: "Cyber", icon: Network, group: skills.cyber[1] },
  { track: "Cyber", icon: KeyRound, group: skills.cyber[2] },
  { track: "Cyber", icon: Shield, group: skills.cyber[3] },
  { track: "Dev", icon: Server, group: skills.dev[1] },
];
const TOOLS = [...skills.ia, ...skills.cyber, ...skills.dev].flatMap((g) => g.items);

const display = { fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif' };

export default function V3({ palette = "green" }) {
  const p = PALETTES[palette] ?? PALETTES.green;

  // The neural network reads its colour from :root.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-ai", p.accent);
    root.style.setProperty("--color-cyber", p.accent);
  }, [p.accent]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-[#e2e8f0]"
      style={{
        fontFamily: '"Inter", system-ui, sans-serif',
        "--color-cyber": p.accent,
        background: `radial-gradient(ellipse 60% 50% at 10% 0%, rgba(${p.glow}, 0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(30, 64, 175, 0.12), transparent 70%), #050b16`,
      }}
    >
      <style>{`@keyframes v3-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      <div className="opacity-60">
        <NetworkBackground2 density={0.5} />
      </div>

      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050b16]/75 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-8">
          <a href="#" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border text-sm font-bold" style={{ ...display, borderColor: `rgba(${p.glow}, 0.5)`, color: p.accent }}>
              JN
            </span>
            <span className="text-[15px] font-semibold" style={display}>
              Jérémie Nagi
            </span>
          </a>
          <ul className="flex items-center gap-1 text-[15px]">
            {NAV.map((n, i) => (
              <li key={n}>
                <a
                  href="#"
                  className="rounded-lg px-3.5 py-2 transition-colors hover:text-white"
                  style={i === 0 ? { color: p.accent, background: `rgba(${p.glow}, 0.1)` } : { color: "#94a3b8" }}
                >
                  {n}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#64748b]">
              <span className="text-[#e2e8f0]">FR</span> / EN
            </span>
            <a href="#" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:border-white/30">
              CV
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid min-h-screen max-w-[1320px] grid-cols-[1.05fr_1fr] items-center gap-12 px-8 pt-16">
        <div>
          <p
            className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-[13px]"
            style={{ borderColor: `rgba(${p.glow}, 0.3)`, background: `rgba(${p.glow}, 0.08)`, color: p.accent }}
          >
            <span className="size-1.5 animate-pulse rounded-full" style={{ background: p.accent }} />
            {profile.availability.fr} · Alternance MSc Epitech
          </p>
          <h1 className="mt-8 text-[88px] leading-[0.95] font-semibold tracking-[-0.03em] text-white" style={display}>
            Jérémie
            <br />
            Nagi
          </h1>
          <p className="mt-6 text-[26px] text-[#cbd5e1]" style={display}>
            Développeur <span style={{ color: p.accent }}>IA</span> <span className="text-[#475569]">·</span> Pentester junior
          </p>
          <p className="mt-6 text-[15px] font-semibold text-white">LLM · RAG · Agents · Pentest web · Active Directory</p>
          <p className="mt-2 max-w-xl text-[17px] leading-relaxed text-[#94a3b8]">{hero.pitch.fr}</p>
          <div className="mt-9 flex gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-lg px-6 py-3.5 text-[15px] font-semibold"
              style={{ background: p.accent, color: p.accentText, boxShadow: `0 8px 30px -8px rgba(${p.glow}, 0.6)` }}
            >
              <Download size={17} /> Télécharger le CV
            </a>
            <a href="#" className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 px-6 py-3.5 text-[15px] font-semibold text-white hover:border-white/30">
              <Mail size={17} /> Me contacter
            </a>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {[
              ["95 h", "Parcours pentest · TryHackMe"],
              ["IBM", "AI Developer · certifié"],
              ["5", "Langues · 6 pays"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-mono text-[28px] font-bold text-white">{v}</dt>
                <dd className="mt-1 font-mono text-[11px] tracking-[0.12em] text-[#64748b] uppercase">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <NeuralHero className="mx-auto w-full max-w-[min(38rem,78vh)]" />
      </section>

      {/* Expertise */}
      <section className="relative z-10 pb-32">
        <div className="overflow-hidden border-y border-white/5 bg-white/[0.015] py-4">
          <ul className="flex w-max animate-[v3-marquee_60s_linear_infinite] gap-10 font-mono text-[13px] tracking-[0.12em] text-[#64748b] uppercase">
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <li key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap">
                <span className="size-1 rounded-full" style={{ background: p.accent }} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto max-w-[1320px] px-8 pt-28">
          <p className="flex items-center gap-4 font-mono text-xs tracking-[0.25em] uppercase" style={{ color: p.accent }}>
            <span className="h-px w-10" style={{ background: p.accent }} /> Expertise
          </p>
          <h2 className="mt-5 text-[52px] leading-tight font-semibold tracking-[-0.02em] text-white" style={display}>
            Ce que je sais faire
          </h2>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#94a3b8]">
            Développeur <strong className="text-white">IA</strong> et <strong className="text-white">pentester junior</strong>, en MSc cybersécurité à Epitech Marseille. Mon fil rouge :{" "}
            <strong className="text-white">construire des systèmes d’IA</strong> et <strong className="text-white">savoir comment on les attaque</strong>.
          </p>

          <ul className="mt-14 grid grid-cols-4 gap-5">
            {CARDS.map(({ track, icon: Icon, group }) => (
              <li key={group.title.fr} className="rounded-xl border border-white/[0.07] bg-[#0a1424]/70 p-6 transition-colors hover:border-white/15">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-lg" style={{ background: `rgba(${p.glow}, 0.1)`, color: p.accent }}>
                    <Icon size={20} />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#64748b] uppercase">{track}</span>
                </div>
                <h3 className="mt-6 text-[21px] leading-snug font-semibold text-white" style={display}>
                  {group.title.fr}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#94a3b8]">
                  {group.items.map((it, i) => (
                    <span key={it}>
                      {i > 0 && ", "}
                      {i < 3 ? <strong className="font-semibold text-[#e2e8f0]">{it}</strong> : it}
                    </span>
                  ))}
                  .
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-10 flex items-center gap-2 font-mono text-[13px] text-[#64748b]">
            <FlaskConical size={15} style={{ color: p.accent }} /> Chaque compétence renvoie à un projet, un write-up ou un certificat.
            <Code size={15} className="ml-4" style={{ color: p.accent }} /> Voir le Lab →
          </p>
        </div>
      </section>

      <span className="fixed right-6 bottom-6 z-50 rounded-md bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-widest text-[#cbd5e1] uppercase">
        Maquette v3 · {palette === "blue" ? "bleu nuit + bleu" : "bleu nuit + vert"}
      </span>
    </div>
  );
}
