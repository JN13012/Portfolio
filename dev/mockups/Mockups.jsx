// Dev-only mockups (mockups.html): hero and profile proposals on top of the legacy site style.
// ?palette=green|cyan  ?view=hero-a|hero-b|hero-c|profile|parcours|parcours-fx|reseau|sentry
import { AudioLines, BadgeCheck, BrainCircuit, Crosshair, Download, Dumbbell, Globe, Landmark, Mail, MapPin, Plane, ShieldCheck, Terminal } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import LegacyNetworkBackground from "./components/LegacyNetworkBackground";
import { Astrolabe } from "./astrolabe/Astrolabe";
import { NeuralCore } from "../../src/sections/Hero/core/NeuralCore";
import { NeuralHero } from "../../src/sections/Hero/core/NeuralHero";
import { CircuitBackground } from "./components/CircuitBackground";
import { NetworkBackground } from "../../src/components/layout/NetworkBackground";
const GlobeGate = lazy(() => import("../../src/sections/Gate/GlobeGate"));
const ArgosGate = lazy(() => import("./intro/ArgosGate"));
const GlobeStill = lazy(() => import("./GlobeStill"));
const V3 = lazy(() => import("./V3"));
const ExpertiseTweaks = lazy(() => import("./ExpertiseTweaks"));
const ExpertiseGrid = lazy(() => import("./ExpertiseGrid"));
const ProjectFilters = lazy(() => import("./ProjectFilters"));
const CtfButtons = lazy(() => import("./CtfButtons"));
const TooltipStyles = lazy(() => import("./TooltipStyles"));
const ParcoursMock = lazy(() => import("./ParcoursMock"));
const ParcoursEffects = lazy(() => import("./ParcoursEffects"));
const NetworkTuner = lazy(() => import("./NetworkTuner"));
const SentryPreview = lazy(() => import("./SentryPreview"));
import { emitCore } from "../../src/lib/coreBus";
import Profil from "../assets/Profil.webp";
import THM from "../../src/assets/THM.jpg";
import Coursera from "../../src/assets/COURSERA.webp";
import Epitech from "../../src/assets/Formations/Epitech.webp";
import Python from "../../src/assets/Icon/Python.webp";
import Langchain from "../../src/assets/Icon/Langchain.webp";
import Burp from "../../src/assets/Icon/Burpsuite.webp";
import Nmap from "../../src/assets/Icon/Nmap.webp";
import Metasploit from "../../src/assets/Icon/Metasploit.webp";
import ReactIcon from "../../src/assets/Icon/React.webp";
import Docker from "../../src/assets/Icon/Docker.webp";
import Splunk from "../../src/assets/Icon/Splunk.webp";

const PALETTES = {
  green: { "--color-cyber": "#4ade80", "--color-cyber-dark": "#166534", "--color-cyber-light": "#86efac", "--acc-ia": "#22d3ee", "--acc-cy": "#f43f5e" },
  cyan: { "--color-cyber": "#3fd8f2", "--color-cyber-dark": "#0e7490", "--color-cyber-light": "#84e7f8", "--acc-ia": "#3fd8f2", "--acc-cy": "#ff6a2b" },
};

const panel = "rounded-sm border border-white/10 bg-zinc-950/60 backdrop-blur-sm shadow-[0_14px_36px_rgba(0,0,0,0.26)]";
const label = "font-mono text-sm uppercase tracking-[0.3em] text-cyber";

const facts = [
  { icon: Globe, text: "5 langues · 6 pays" },
  { icon: BadgeCheck, text: "Jr Penetration Tester" },
  { icon: BrainCircuit, text: "IBM AI Developer" },
  { icon: ShieldCheck, text: "MSc Epitech cybersécurité" },
  { icon: Crosshair, text: "Ex-militaire (2e RIMa)" },
];

function Availability() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[15px] text-zinc-300">
      <span className="inline-flex items-center gap-2 text-zinc-100">
        <span className="size-2.5 animate-pulse rounded-full bg-cyber shadow-[0_0_12px_var(--color-cyber)]" /> Disponible immédiatement
      </span>
      <span>Alternance · MSc Epitech</span>
      <span>Stage possible</span>
      <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> Marseille · mobile</span>
    </div>
  );
}

function Ctas() {
  return (
    <div className="flex flex-wrap gap-4">
      <a className="inline-flex items-center gap-3 border border-cyber/60 bg-cyber/10 px-6 py-3.5 font-mono text-base uppercase tracking-[0.2em] text-cyber hover:bg-cyber/20" href="#">
        <Download size={18} /> Télécharger le CV
      </a>
      <a className="inline-flex items-center gap-3 border border-white/20 px-6 py-3.5 font-mono text-base uppercase tracking-[0.2em] text-zinc-100 hover:border-white/40" href="#">
        <Mail size={18} /> Me contacter
      </a>
    </div>
  );
}

function Proofs() {
  return (
    <div className="flex flex-wrap gap-3">
      {[
        [Coursera, "IBM AI Developer", "Professional Certificate"],
        [THM, "Jr Penetration Tester", "TryHackMe · 95 h"],
        [Epitech, "MSc Cybersécurité", "Epitech Marseille"],
      ].map(([img, title, sub]) => (
        <div key={title} className={`${panel} flex items-center gap-3 px-3 py-2.5`}>
          <img src={img} alt="" className="size-10 rounded-sm object-cover" />
          <div className="font-mono">
            <p className="text-[15px] text-zinc-100">{title}</p>
            <p className="text-xs text-zinc-400">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Hero A: profile first ─────────────────────────────────────────────── */
function HeroA() {
  return (
    <section className="relative flex min-h-[92vh] items-center">
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[auto_1fr]">
        <div className="relative mx-auto w-64 lg:w-80">
          <div className="absolute -inset-3 border border-cyber/40" />
          <div className="absolute -top-3 -left-3 size-6 border-t-2 border-l-2 border-cyber" />
          <div className="absolute -right-3 -bottom-3 size-6 border-r-2 border-b-2 border-cyber" />
          <img src={Profil} alt="Jérémie Nagi" className="relative w-full" />
        </div>
        <div className="space-y-6">
          <p className={label}>&gt; whoami</p>
          <h1 className="font-mono text-6xl font-black uppercase leading-none tracking-tighter text-white md:text-8xl">
            Nagi <span className="text-cyber">Jérémie</span>
          </h1>
          <p className="font-mono text-2xl font-bold uppercase tracking-tight md:text-3xl">
            <span style={{ color: "var(--acc-ia)" }}>Développeur IA</span>
            <span className="text-zinc-600"> · </span>
            <span style={{ color: "var(--acc-cy)" }}>Pentester junior</span>
          </p>
          <p className="max-w-2xl border-l-2 border-cyber/80 pl-4 font-mono text-xl text-zinc-200">
            Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque.
          </p>
          <Proofs />
          <Availability />
          <Ctas />
        </div>
      </div>
      <div className={`${panel} absolute right-0 bottom-6 left-0 hidden flex-wrap justify-between gap-4 px-6 py-4 lg:flex`}>
        {facts.map(({ icon: Icon, text }) => (
          <span key={text} className="inline-flex items-center gap-2.5 font-mono text-[15px] text-zinc-200">
            <Icon size={18} className="text-cyber" /> {text}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Hero A2: text left, interactive core right ─────────────────────── */
function VoiceButton() {
  return (
    <button type="button" disabled title="Présentation vocale en préparation" className="inline-flex cursor-not-allowed items-center gap-3 border border-white/10 px-4 py-2.5 font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">
      <AudioLines size={16} /> Écouter ma présentation <span className="text-[10px] text-zinc-600">· bientôt</span>
    </button>
  );
}

function HeroA2({ core }) {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center gap-10 pb-28">
      <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-6">
          <p className={label}>&gt; whoami</p>
          <h1 className="font-mono text-6xl font-black uppercase leading-none tracking-tighter text-white md:text-8xl">
            Nagi <span className="text-cyber">Jérémie</span>
          </h1>
          <p className="font-mono text-2xl font-bold uppercase tracking-tight md:text-3xl">
            <span style={{ color: "var(--acc-ia)" }}>Développeur IA</span>
            <span className="text-zinc-600"> · </span>
            <span style={{ color: "var(--acc-cy)" }}>Pentester junior</span>
          </p>
          <p className="max-w-2xl border-l-2 border-cyber/80 pl-4 font-mono text-xl text-zinc-200">
            Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque.
          </p>
          <Proofs />
          <Availability />
          <Ctas />
          <VoiceButton />
        </div>
        <div className="relative mx-auto w-full max-w-[min(40rem,80vh)]">
          {core === "neural3d" ? <NeuralHero /> : core === "neural" ? <NeuralCore /> : <Astrolabe />}
          <button type="button" onClick={() => emitCore("attack", { angle: Math.random() * Math.PI * 2 })} className="absolute -bottom-2 right-0 font-mono text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#f43f5e]">
            [ simuler une attaque ]
          </button>
        </div>
      </div>
      <div className={`${panel} absolute right-0 bottom-6 left-0 hidden flex-wrap justify-between gap-4 px-6 py-4 lg:flex`}>
        {facts.map(({ icon: Icon, text }) => (
          <span key={text} className="inline-flex items-center gap-2.5 font-mono text-[15px] text-zinc-200">
            <Icon size={18} className="text-cyber" /> {text}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Hero B: the dual skill set ────────────────────────────────────────── */
function TrackCard({ accent, icon: Icon, title, items, logos }) {
  return (
    <div className={`${panel} group relative overflow-hidden p-7`} style={{ borderColor: `color-mix(in srgb, ${accent} 35%, transparent)` }}>
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <div className="mb-5 flex items-center gap-3">
        <Icon size={28} style={{ color: accent }} />
        <h2 className="font-mono text-2xl font-bold uppercase tracking-[0.15em]" style={{ color: accent }}>{title}</h2>
      </div>
      <ul className="mb-6 space-y-2 font-mono text-[15px] text-zinc-200">
        {items.map((i) => (
          <li key={i} className="flex gap-2"><span style={{ color: accent }}>▸</span> {i}</li>
        ))}
      </ul>
      <div className="flex gap-3">
        {logos.map((l) => (
          <img key={l} src={l} alt="" className="size-11 object-contain opacity-90 transition group-hover:opacity-100" />
        ))}
      </div>
    </div>
  );
}

function HeroB() {
  return (
    <section className="flex min-h-[92vh] flex-col justify-center gap-10 py-10">
      <div className="space-y-4 text-center">
        <p className={label}>Double compétence</p>
        <h1 className="font-mono text-6xl font-black uppercase leading-none tracking-tighter text-white md:text-8xl">
          Nagi <span className="text-cyber">Jérémie</span>
        </h1>
        <p className="mx-auto max-w-3xl font-mono text-xl text-zinc-200">
          Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TrackCard
          accent="var(--acc-ia)"
          icon={BrainCircuit}
          title="Développeur IA"
          items={["IBM AI Developer Professional", "4 applications LLM : RAG, voix, agents", "Argos : moteur OSINT, couche agents IA en conception"]}
          logos={[Python, Langchain, ReactIcon, Docker]}
        />
        <TrackCard
          accent="var(--acc-cy)"
          icon={Crosshair}
          title="Pentester junior"
          items={["Jr Penetration Tester (TryHackMe, 95 h)", "25 write-ups publiés : web, AD, privesc", "SOC Level 1 en cours · audit web autorisé"]}
          logos={[Nmap, Burp, Metasploit, Splunk]}
        />
      </div>
      <div className="flex flex-col items-center gap-6">
        <Availability />
        <Ctas />
      </div>
    </section>
  );
}

/* ── Hero C: terminal whoami ───────────────────────────────────────────── */
const SCRIPT = [
  ["$ whoami", "cmd"],
  ["jeremie.nagi — Développeur IA · Pentester junior", "out"],
  ["$ cat certifications.txt", "cmd"],
  ["✔ IBM AI Developer Professional (2026)", "ok"],
  ["✔ TryHackMe Jr Penetration Tester — 95 h (2026)", "ok"],
  ["✔ TryHackMe SEC1 — Cyber Security 101", "ok"],
  ["… SOC Level 1 — 50 %", "wip"],
  ["$ ls projets/", "cmd"],
  ["argos/  blocktrader/  zeroday/  writeups/ (25)", "out"],
  ["$ cat status", "cmd"],
  ["Disponible immédiatement · alternance · Marseille, mobile", "ok"],
];

function Typed() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= SCRIPT.length) return;
    const id = setTimeout(() => setN(n + 1), n === 0 ? 400 : 260);
    return () => clearTimeout(id);
  }, [n]);
  const color = { cmd: "text-cyber", out: "text-zinc-200", ok: "text-zinc-300", wip: "text-zinc-500" };
  return (
    <div className="space-y-2 p-6 font-mono text-[15px]">
      {SCRIPT.slice(0, n).map(([t, k], i) => (
        <p key={i} className={color[k]}>{t}</p>
      ))}
      <span className="inline-block h-4 w-2 animate-pulse bg-cyber align-middle" />
    </div>
  );
}

function HeroC() {
  return (
    <section className="flex min-h-[92vh] items-center">
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-7">
          <h1 className="font-mono text-6xl font-black uppercase leading-none tracking-tighter text-white md:text-8xl">
            Nagi <span className="text-cyber">Jérémie</span>
          </h1>
          <p className="font-mono text-2xl font-bold uppercase">
            <span style={{ color: "var(--acc-ia)" }}>Développeur IA</span>
            <span className="text-zinc-600"> · </span>
            <span style={{ color: "var(--acc-cy)" }}>Pentester junior</span>
          </p>
          <p className="max-w-xl border-l-2 border-cyber/80 pl-4 font-mono text-xl text-zinc-200">
            Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque.
          </p>
          <Availability />
          <Ctas />
        </div>
        <div className={`${panel} overflow-hidden`}>
          <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900/60 px-4 py-2.5">
            <Terminal size={14} className="text-cyber" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">profil.sh</span>
          </div>
          <Typed />
        </div>
      </div>
    </section>
  );
}

/* ── Profile proposal ──────────────────────────────────────────────────── */
function Block({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={className}>
      <div className="mb-3 inline-flex items-center gap-3 border border-white/10 bg-zinc-900/60 px-4 py-2">
        <Icon size={16} className="text-cyber" />
        <span className={label}>{title}</span>
      </div>
      <div className={`${panel} p-5`}>{children}</div>
    </div>
  );
}

function ProfileProposal() {
  const langs = [["🇫🇷", "Français", "Natif"], ["🇬🇧", "Anglais", "C1"], ["🇪🇸", "Espagnol", "C1"], ["🇱🇧", "Arabe", "C1 · libanais et littéraire"], ["🇩🇪", "Allemand", "A1"]];
  return (
    <section className="py-16">
      <h2 className="mb-14 flex items-center gap-6 font-mono font-bold uppercase">
        <span className="text-lg text-cyber opacity-80">01.</span>
        <span className="text-3xl tracking-[0.2em] text-zinc-100 md:text-4xl">Profil</span>
        <div className="h-px flex-1 bg-cyber/20" />
      </h2>
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr_22rem]">
        <div className="space-y-5">
          <div className="relative">
            <div className="absolute -inset-2 border border-cyber/30" />
            <img src={Profil} alt="" className="relative w-full" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {["GitHub", "LinkedIn", "THM", "Coursera", "SF"].map((n) => (
              <a key={n} href="#" className="grid aspect-square place-items-center border border-white/10 bg-zinc-950/60 font-mono text-[10px] uppercase text-zinc-300 hover:border-cyber/50 hover:text-cyber">{n}</a>
            ))}
          </div>
          <a href="#" className="flex items-center justify-center gap-2 border border-cyber/60 bg-cyber/10 py-3 font-mono uppercase tracking-[0.2em] text-cyber">
            <Download size={16} /> CV (.pdf)
          </a>
        </div>
        <div className="space-y-8">
          <Block icon={Terminal} title="Présentation">
            <div className="space-y-3 font-mono text-[15px] leading-relaxed text-zinc-200">
              <p>Développeur IA et pentester junior, en MSc cybersécurité à Epitech Marseille. Mon fil rouge : construire des systèmes d’IA et savoir comment on les attaque.</p>
              <p>Avant l’informatique : l’infanterie (2e RIMa), la mécanique en endurance (24 Heures du Mans 2017) et l’infrastructure blockchain depuis 2018. Cinq langues, six pays.</p>
            </div>
          </Block>
          <Block icon={BadgeCheck} title="En bref">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[15px]">
              {[["Localisation", "Marseille · mobile"], ["Recherche", "Alternance (stage possible)"], ["Formation", "MSc Epitech · 2025 – 2028"], ["Disponibilité", "Immédiate"]].map(([k, v]) => (
                <div key={k} className="border-b border-white/5 pb-2">
                  <dt className="text-xs uppercase tracking-widest text-zinc-500">{k}</dt>
                  <dd className="text-zinc-100">{v}</dd>
                </div>
              ))}
            </dl>
          </Block>
        </div>
        <div className="space-y-8">
          <Block icon={Globe} title="Langues">
            <ul className="space-y-2.5 font-mono text-[15px]">
              {langs.map(([flag, name, lvl]) => (
                <li key={name} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0">
                  <span className="text-zinc-100"><span className="mr-2">{flag}</span>{name}</span>
                  <span className="text-xs text-cyber">{lvl}</span>
                </li>
              ))}
            </ul>
          </Block>
          <Block icon={Plane} title="Centres d’intérêt">
            <div className="grid grid-cols-4 gap-2">
              {[[Plane, "Voyages"], [Dumbbell, "Sport"], [Globe, "Géopolitique"], [Landmark, "Finance"]].map(([Icon, n]) => (
                <div key={n} className="flex flex-col items-center gap-1.5 border border-white/5 py-3 text-zinc-400 hover:text-cyber">
                  <Icon size={22} />
                  <span className="font-mono text-[11px] uppercase text-zinc-200">{n}</span>
                </div>
              ))}
            </div>
          </Block>
        </div>
      </div>
    </section>
  );
}

const VIEWS = { "hero-a2": HeroA2, "hero-a": HeroA, "hero-b": HeroB, "hero-c": HeroC, profile: ProfileProposal };

export default function Mockups() {
  const params = new URLSearchParams(window.location.search);
  const [gate, setGate] = useState(["globe", "argos"].includes(params.get("gate")));
  const Gate = params.get("gate") === "argos" ? ArgosGate : GlobeGate;
  if (params.get("view") === "sentry")
    return (
      <Suspense fallback={null}>
        <SentryPreview />
      </Suspense>
    );
  if (params.get("view") === "reseau")
    return (
      <Suspense fallback={null}>
        <NetworkTuner />
      </Suspense>
    );
  if (params.get("view") === "parcours")
    return (
      <Suspense fallback={null}>
        <ParcoursMock />
      </Suspense>
    );
  if (params.get("view") === "parcours-fx")
    return (
      <Suspense fallback={null}>
        <ParcoursEffects />
      </Suspense>
    );
  if (params.get("view") === "infobulles")
    return (
      <Suspense fallback={null}>
        <TooltipStyles />
      </Suspense>
    );
  if (params.get("view") === "ctfbuttons")
    return (
      <Suspense fallback={null}>
        <CtfButtons />
      </Suspense>
    );
  if (params.get("view") === "filters")
    return (
      <Suspense fallback={null}>
        <ProjectFilters />
      </Suspense>
    );
  if (params.get("view") === "grid")
    return (
      <Suspense fallback={null}>
        <ExpertiseGrid />
      </Suspense>
    );
  if (params.get("view") === "tweaks")
    return (
      <Suspense fallback={null}>
        <ExpertiseTweaks />
      </Suspense>
    );
  if (params.get("view") === "v3")
    return (
      <Suspense fallback={null}>
        <V3 palette={params.get("palette")} />
      </Suspense>
    );
  if (params.get("still"))
    return (
      <Suspense fallback={null}>
        <GlobeStill variant={params.get("still")} />
      </Suspense>
    );
  const palette = PALETTES[params.get("palette")] ? params.get("palette") : "green";
  const View = VIEWS[params.get("view")] ?? HeroA2;
  const core = ["neural", "neural3d"].includes(params.get("core")) ? params.get("core") : "astrolabe";
  const bg = params.get("bg");
  const backgrounds = {
    circuit: <CircuitBackground />,
    network: <NetworkBackground />,
    mix: (
      <>
        <CircuitBackground color="#64748b" packetColor="#94a3b8" intensity={0.55} />
        <NetworkBackground density={0.45} />
      </>
    ),
    blueprint: <CircuitBackground color="#7c8ea3" packetColor="#dbe4ee" intensity={0.9} />,
  };
  const background = backgrounds[bg] ?? <LegacyNetworkBackground />;
  // New backgrounds sit on a deep blue-black instead of pure black, for depth.
  const canvasBg = backgrounds[bg] && bg !== "circuit" ? "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" : "#000";
  return (
    <div className="relative min-h-screen overflow-x-hidden font-mono" style={{ ...PALETTES[palette], background: canvasBg }}>
      {gate && (
        <Suspense fallback={<div className="fixed inset-0 z-[2000] bg-black" />}>
          <Gate onClose={() => setGate(false)} visitorTz={params.get("tz") ?? undefined} />
        </Suspense>
      )}
      {background}
      <div className="relative z-10 mx-auto w-[90%] max-w-[2400px] py-8">
        <View core={core} />
      </div>
    </div>
  );
}
