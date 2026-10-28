// Dev-only: proposal for the Parcours section (mockups.html?view=parcours).
// Wide screens: an interactive two-lane year axis (experience / education); selecting a bar shows its details below.
// Small screens: the same entries as a vertical list. Entries with `guess` have dates still to be confirmed.
import { useRef, useState } from "react";
import Epitech from "../../src/assets/Formations/Epitech.webp";
import EcolePerformance from "../assets/Formations/ECOLE-PERFORMANCE-10.webp";
import Rima from "../assets/Formations/RIMA.webp";
import Ulit from "../../src/assets/Experiences/ULIT-removebg-preview.png";
import MiningRig from "../assets/Experiences/Mining_rig.webp";
import HiveOs from "../../src/assets/Experiences/HiveOs_monitoring.webp";
import Wec from "../assets/Experiences/wec2017_1.jpg";
import WecWide from "../../src/assets/Experiences/Wec2017.webp";
import SalesforceDev from "../../src/assets/Experiences/Salesforce_dev.webp";

const FROM = 2015;
const TO = 2029; // axis end (exclusive), leaves room for 2028
const NOW = 2026 + 9.8 / 12;
const pct = (y) => ((y - FROM) / (TO - FROM)) * 100;

// tone: main = tech path, old = before the reconversion, side = personal activity.
const ENTRIES = [
  {
    id: "msc", lane: "edu", from: 2026 + 8 / 12, to: 2028 + 8 / 12, planned: NOW, tone: "main", short: "MSc Epitech",
    img: Epitech, period: "2026 – 2028 · diplôme prévu en 2028", badge: "En cours · 1re année de master",
    title: "MSc Architecte des systèmes d’information, spécialité cybersécurité", org: "Epitech · Marseille",
    text: "Architecture systèmes et réseaux, ingénierie logicielle, DevSecOps et cloud, sécurité réseau, audits et tests d’intrusion, gestion des risques et conformité.",
    tags: ["Pentest", "DevSecOps", "Cloud", "Sécurité réseau", "ISO 2700x", "RGPD"],
  },
  {
    id: "ulit", lane: "exp", from: 2026, to: 2026.5, tone: "main", short: "ULIT",
    img: Ulit, logo: true, picture: SalesforceDev, period: "01/2026 – 06/2026", badge: "Stage · 6 mois",
    title: "Développeur full-stack Salesforce", org: "ULIT · France",
    text: "Développement sur Salesforce : applications Apex, Lightning Web Components et JavaScript, et un éditeur de scripts interne utilisé en production.",
    points: [
      "Éditeur de scripts : exécution, historique, versioning, planification, suivi des logs.",
      "Résolution de tickets : corrections, évolutions, données et processus métier.",
      "Mise en place de tests unitaires.",
    ],
    tags: ["Apex", "LWC", "JavaScript", "Salesforce", "Tests unitaires"],
  },
  {
    id: "premsc", lane: "edu", from: 2025 + 8 / 12, to: 2026 + 8 / 12, tone: "main", short: "Pré-MSc",
    img: Epitech, period: "09/2025 – 2026", title: "Pré-MSc", org: "Epitech · Marseille",
    text: "Année préparatoire au master : remise à niveau en développement, systèmes et réseaux, avec le stage chez ULIT.",
  },
  {
    id: "crypto", lane: "exp", row: 1, from: 2021, to: NOW, open: true, tone: "side", short: "Trading · staking (perso)",
    img: MiningRig, period: "Depuis 2021", badge: "Activité personnelle",
    title: "Trading et staking", org: "Personnel",
    text: "Suite du minage : je reste actif dans l’écosystème crypto, en trading et en staking, à titre personnel.",
  },
  {
    id: "mining", lane: "exp", row: 1, from: 2018, to: 2021, tone: "old", short: "Minage",
    img: MiningRig, picture: HiveOs, period: "2018 – 2021", title: "Infrastructure de minage", org: "Indépendant",
    text: "Conception, assemblage et exploitation de fermes de minage (Ethereum avant le Proof-of-Stake, Bitcoin, Raptoreum, Chia).",
    points: [
      "Administration et supervision sous HiveOS, Braiins OS, Linux et Windows ; redémarrages, mises à jour et erreurs automatisés.",
      "Optimisation des performances, de la consommation et du refroidissement.",
      "Diagnostic des pannes et maintenance du matériel.",
    ],
    tags: ["Linux", "HiveOS", "Supervision", "Automatisation", "Hardware"],
  },
  {
    id: "auto", lane: "exp", from: 2017, to: 2022, guess: true, tone: "old", short: "Sport auto · mécanique",
    img: Wec, picture: WecWide, period: "2017 – 2022", title: "Technicien mécanique, compétition et maintenance", org: "G-Drive Racing · Renault · Wärtsilä",
    text: "Championnat du monde d’endurance 2017 avec G-Drive Racing, dont les 24 Heures du Mans : responsable des pneumatiques sur prototype LMP2.",
    points: [
      "Pressions, préchauffage et préparation des trains de pneus ; ravitaillement et arrêts aux stands.",
      "Diagnostic et réparation automobile chez Renault.",
      "Contrôle et remise en service de pièces de moteurs marins chez Wärtsilä.",
    ],
  },
  {
    id: "edp", lane: "edu", from: 2017, to: 2018, guess: true, tone: "old", short: "École Perf.",
    img: EcolePerformance, period: "2017", title: "Préparateur et développeur de véhicules de compétition (Bac+2)", org: "École de la Performance · Nogaro",
    text: "Formation aux métiers de technicien motoriste en sport automobile.",
  },
  {
    id: "rima", lane: "exp", from: 2015, to: 2017, tone: "old", short: "2e RIMa",
    img: Rima, period: "2015 – 2017", title: "Combattant de l’infanterie", org: "2e Régiment d’Infanterie de Marine",
    text: "Formation militaire initiale, CPIS de Perpignan, stage au CNEC de Mont-Louis (franchissement, rusticité, autonomie).",
    points: ["Sang-froid, prise de décision et sens des responsabilités."],
  },
];

const LANES = [
  { id: "exp", label: "Expérience", rows: 2 },
  { id: "edu", label: "Formation", rows: 1 },
];
const ROW_H = 3.5; // rem

const TONE = {
  main: "border-cyber/60 bg-cyber/15 text-zinc-50 hover:bg-cyber/25",
  old: "border-white/15 bg-white/[0.05] text-zinc-300 hover:bg-white/10",
  side: "border-dashed border-white/25 bg-transparent text-zinc-300 hover:bg-white/5",
};

const Tag = ({ children }) => <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-zinc-300">{children}</span>;

function Details({ e }) {
  return (
    <article className="grid gap-6 rounded-xl border border-white/10 bg-zinc-950/55 p-6 md:grid-cols-[1fr_18rem] lg:p-8">
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <img src={e.img} alt="" className={`size-14 shrink-0 rounded-lg object-contain ${e.logo ? "bg-white p-1.5" : "bg-zinc-900"}`} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-cyber">{e.period}</span>
              {e.badge && <span className="rounded-full bg-cyber/10 px-2 py-0.5 text-xs text-cyber">{e.badge}</span>}
              {e.guess && <span className="text-xs text-amber-400/80">dates à confirmer</span>}
            </div>
            <h3 className="mt-1 text-xl leading-snug font-semibold text-white">{e.title}</h3>
            <p className="text-sm text-zinc-400">{e.org}</p>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-300">{e.text}</p>
        {e.points && (
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-300">
            {e.points.map((p) => (
              <li key={p} className="flex gap-2.5"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyber" />{p}</li>
            ))}
          </ul>
        )}
        {e.tags && <div className="mt-4 flex flex-wrap gap-1.5">{e.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
      </div>
      {e.picture && <img src={e.picture} alt="" className="hidden w-full self-center rounded-lg border border-white/10 md:block" />}
    </article>
  );
}

function Frise({ selected, onSelect }) {
  const refs = useRef({});
  const years = [];
  for (let y = FROM; y < TO; y++) years.push(y);
  // Arrow keys move along the axis in time order.
  const order = [...ENTRIES].sort((a, b) => a.from - b.from);
  const onKey = (ev) => {
    const i = order.findIndex((e) => e.id === selected);
    const next = ev.key === "ArrowRight" ? order[i + 1] : ev.key === "ArrowLeft" ? order[i - 1] : null;
    if (!next) return;
    ev.preventDefault();
    onSelect(next.id);
    refs.current[next.id]?.focus();
  };
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/55 p-6 lg:p-8">
      <div className="grid grid-cols-[7.5rem_1fr]" role="tablist" aria-label="Frise du parcours" onKeyDown={onKey}>
        <div />
        <div className="relative mb-2 h-6 text-sm text-zinc-400">
          {years.map((y) => (
            <span key={y} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${pct(y)}%` }}>{y}</span>
          ))}
          <span className="absolute -top-5 -translate-x-1/2 text-xs text-cyber" style={{ left: `${pct(NOW)}%` }}>aujourd’hui</span>
        </div>
        {LANES.map((lane) => (
          <div key={lane.id} className="contents">
            <div className="flex items-center border-t border-white/10 text-base font-medium text-zinc-200">{lane.label}</div>
            <div className="relative border-t border-white/10" style={{ height: `${lane.rows * ROW_H + 1}rem` }}>
              {years.map((y) => (
                <span key={y} aria-hidden="true" className="absolute top-0 bottom-0 w-px bg-white/[0.05]" style={{ left: `${pct(y)}%` }} />
              ))}
              <span aria-hidden="true" className="absolute top-0 bottom-0 w-px bg-cyber/50" style={{ left: `${pct(NOW)}%` }} />
              {ENTRIES.filter((e) => e.lane === lane.id).map((e) => {
                const active = e.id === selected;
                return (
                  <button
                    key={e.id}
                    ref={(el) => (refs.current[e.id] = el)}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => onSelect(e.id)}
                    title={`${e.title} · ${e.period}`}
                    className={`absolute flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border px-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber ${TONE[e.tone]} ${active ? "ring-2 ring-cyber ring-offset-2 ring-offset-[#0a0d12]" : ""} ${e.guess ? "after:absolute after:top-1 after:right-1 after:size-1.5 after:rounded-full after:bg-amber-400/80" : ""}`}
                    style={{ left: `${pct(e.from)}%`, width: `${pct(e.to) - pct(e.from)}%`, top: `${0.5 + (e.row ?? 0) * ROW_H}rem` }}
                  >
                    {e.planned && (
                      <span aria-hidden="true" className="absolute top-0 right-0 bottom-0" style={{ left: `${((e.planned - e.from) / (e.to - e.from)) * 100}%`, background: "repeating-linear-gradient(135deg, rgba(8,11,16,.7) 0 4px, transparent 4px 8px)" }} />
                    )}
                    <span className="relative truncate">{e.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 pl-[7.5rem] text-xs text-zinc-500">
        <span><span className="mr-1.5 inline-block size-2.5 rounded-sm bg-cyber/60" />Parcours tech</span>
        <span><span className="mr-1.5 inline-block size-2.5 rounded-sm bg-white/25" />Avant la reconversion</span>
        <span><span className="mr-1.5 inline-block size-2.5 rounded-sm border border-dashed border-white/50" />Activité personnelle</span>
        <span>Hachuré : prévu</span>
        <span>Clic ou ← → pour parcourir</span>
        <span className="text-amber-400/80">● dates à confirmer (maquette)</span>
      </p>
    </div>
  );
}

export default function ParcoursMock() {
  const [selected, setSelected] = useState("msc");
  const entry = ENTRIES.find((e) => e.id === selected);
  return (
    <div className="min-h-screen px-4 py-16 font-sans text-white sm:px-8" style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="mb-10">
          <p className="font-mono text-sm tracking-[0.3em] text-cyber uppercase">05 · Parcours</p>
          <h2 className="mt-2 text-3xl font-bold">De la mécanique de compétition à la cybersécurité</h2>
        </header>

        {/* Wide screens: detail panel above the axis; fixed height so the axis doesn't move when the selection changes. */}
        <div className="hidden space-y-6 lg:block">
          <div role="tabpanel" aria-live="polite" className="flex h-[24rem] flex-col justify-end [&>article]:h-full [&>article]:overflow-y-auto">
            <Details e={entry} />
          </div>
          <Frise selected={selected} onSelect={setSelected} />
        </div>

        {/* Small screens: vertical list, most recent first. */}
        <ol className="relative space-y-4 border-l border-white/10 pl-5 lg:hidden">
          {ENTRIES.map((e) => (
            <li key={e.id} className="relative">
              <span aria-hidden="true" className={`absolute top-7 -left-[1.6rem] size-2.5 rounded-full ${e.tone === "main" ? "bg-cyber" : "bg-zinc-600"}`} />
              <Details e={e} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
