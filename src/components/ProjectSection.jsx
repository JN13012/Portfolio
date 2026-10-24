import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Lock } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";
import { projects } from "../content/projects";
import { statusLabels } from "../content/ui";
import { complexityOf, filterProjects, groupOf, sortProjects, tracksFromSearch } from "../lib/projects";
import Smartfridge from "../assets/Projets/Smartfridge.png";
import Cyberpong from "../assets/Projets/Cyberpong.png";
import My_marvin from "../assets/Projets/My_marvin.png";
import Popeye from "../assets/Projets/Popeye.png";
import Vaultborn from "../assets/Projets/Vaultborn.webp";
import Vocal_assistant_AI from "../assets/Projets/Vocal_assistant_AI.png";
import LLM_Context_Wrapper from "../assets/Projets/LLM-Context-Wrapper.png";
import Unit_converter from "../assets/Projets/Unit_converter.png";
import Business_AI_Meeting from "../assets/Projets/Business_AI_Meeting_Companion_STT.webp";
import RAG_pdf_Chatbot from "../assets/Projets/RAG_PDF_Chatbot.webp";
import AI_Assistant_Translator from "../assets/Projets/AI_Assistant_Translator.jpg";
import AI_Career_Coach from "../assets/Projets/AI-Career-Coach-Conseils.webp";
import Tor from "../assets/Projets/Tor.webp";
import Chatflow from "../assets/Projets/Chatflow.webp";
import CTF_Metasploit from "../assets/Projets/CTF_Metasploit.webp";
import CTF_John from "../assets/Projets/CTF_John.webp";
import CTF_Snort from "../assets/Projets/CTF_Snort.webp";
import CTF_Hashcat from "../assets/Projets/CTF_Hashcat.webp";
import CTF_Forensic from "../assets/Projets/CTF_Forensic.png";
import OTP_RCS from "../assets/Projets/OTP_RCS.webp";
import Salesforce from "../assets/Experiences/Salesforce_dev.webp";
import Obsidian from "../assets/Obsidian.webp";
import Obsidian0 from "../assets/Obsidian0.png";
import Obsidian1 from "../assets/obsidian1.png";

// Cards shown per group before « Voir les N autres ».
const FIRST_CARDS = 8;

const GROUPS = [
  { id: "perso-pro", title: "Projets perso & pro" },
  { id: "formation", title: "Projets de formation" },
];

// Short context pill on the card.
const CONTEXT_PILL = { personal: "Perso", work: "ULIT", epitech: "Epitech", ibm: "IBM", hackathon: "Hackathon" };

/** Visuals per project slug (first image = card background). Projects without one get a pattern. */
const IMAGES = {
  pentest: [Tor],
  "rag-pdf-chatbot": [RAG_pdf_Chatbot],
  "meeting-companion": [Business_AI_Meeting],
  "career-coach": [AI_Career_Coach],
  "assistant-translator": [AI_Assistant_Translator],
  "generateur-otp-rcs": [OTP_RCS],
  chatflow: [Chatflow],
  "salesforce-executor": [Salesforce],
  "base-de-connaissance": [Obsidian, Obsidian0, Obsidian1],
  "ctf-du-site": [CTF_John, CTF_Hashcat, CTF_Metasploit, CTF_Forensic, CTF_Snort],
  "smart-fridge": [Smartfridge],
  popeye: [Popeye],
  "my-marvin": [My_marvin],
  vaultborn: [Vaultborn],
  cyberpong: [Cyberpong],
  "unit-converter": [Unit_converter],
  "ai-voice-assistant": [Vocal_assistant_AI],
  "llm-context-wrapper": [LLM_Context_Wrapper],
};

const TRACK_LABEL = { ia: "IA", cyber: "Cyber", dev: "Dev" };
const TRACK_COLOR = { ia: "#38bdf8", cyber: "#f43f5e", dev: "#34d399" };

const trackThemes = {
  ia: { card: "hover:border-cyber/40", badge: "text-blue-300 border-blue-500/30 bg-blue-500/10" },
  cyber: { card: "hover:border-cyber/40", badge: "text-red-400 border-red-500/30 bg-red-500/10" },
  dev: { card: "hover:border-cyber/40", badge: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
  Default: { card: "hover:border-cyber/40", badge: "text-zinc-400 border-white/10 bg-white/5" },
};

const statusStyles = {
  delivered: "text-zinc-200 border-white/25 bg-white/5",
  development: "text-sky-300 border-sky-500/40 bg-sky-500/10",
};

const CONTEXT_LABEL = {
  personal: "Projet personnel",
  epitech: "Epitech",
  ibm: "Certificat IBM",
  hackathon: "Hackathon",
  work: "Entreprise",
};

const formatPeriod = (period) => {
  const f = (ym) => ym.split("-").reverse().join("/");
  return period.end ? (period.end === period.start ? f(period.start) : `${f(period.start)} – ${f(period.end)}`) : f(period.start);
};
// On the card: just when it was finished, or « En cours ». The modal keeps the full period.
const cardDate = (period) => (period.end ? period.end.split("-").reverse().join("/") : "En cours");


const ProjectSection = () => {
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [tracks, setTracks] = useState(() => tracksFromSearch(window.location.search));
  const [sort, setSort] = useState("selection");
  const [expanded, setExpanded] = useState({});

  // Keep ?metier= in the URL so a filtered view can be linked in an application.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (tracks.length) url.searchParams.set("metier", tracks.join(","));
    else url.searchParams.delete("metier");
    window.history.replaceState(null, "", url);
  }, [tracks]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const visible = useMemo(() => sortProjects(filterProjects(projects, { tracks }), sort), [tracks, sort]);
  const ordered = visible;
  const groups = GROUPS.map((g) => ({ ...g, items: ordered.filter((p) => groupOf(p) === g.id) })).filter((g) => g.items.length);
  const card = (p) => (
    <ProjectCard
      key={p.slug}
      titre={p.title}
      description={p.summary.fr}
      tags={p.stack}
      image={IMAGES[p.slug]?.[0]}
      categorie={TRACK_LABEL[p.tracks[0]] ?? p.stack[0] ?? "Projet"}
      date={cardDate(p.period)}
      ongoing={!p.period.end}
      context={CONTEXT_PILL[p.context]}
      inProduction={p.inProduction?.fr}
      theme={trackThemes[p.tracks[0]] || trackThemes.Default}
      onClick={() => open(p)}
    />
  );

  const updateTracks = (next) => {
    setTracks(next);
  };

  const open = (p) => {
    setSelected(p);
    setImageIndex(0);
  };

  const images = selected ? IMAGES[selected.slug] ?? [] : [];

  const select =
    "appearance-none rounded-md border border-white/10 bg-zinc-950/70 py-1.5 pr-8 pl-3 text-sm text-zinc-200 transition-colors hover:border-white/25 focus-visible:border-cyber/60 focus-visible:outline-none [&>option]:bg-zinc-900";

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 text-white">
      <div className="relative z-10">
        <SectionHeader index="03" title="Projets" />

        {/* FILTERS: one line — job pills on the left, status and sort menus on the right. */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pb-2">
          {/* Job tabs: underlined like the Expertise list, with the number of projects in a coloured badge. */}
          <div role="group" aria-label="Filtrer par métier" className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[null, "ia", "cyber", "dev"].map((t) => {
              const on = t ? tracks.length === 1 && tracks[0] === t : tracks.length === 0;
              const color = t ? TRACK_COLOR[t] : "#e4e4e7";
              const count = filterProjects(projects, { tracks: t ? [t] : [] }).length;
              return (
                <button key={t ?? "all"} type="button" aria-pressed={on} onClick={() => updateTracks(t ? [t] : [])} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
                  <span
                    className={on ? "font-semibold" : "text-zinc-400 transition-colors group-hover:text-zinc-200"}
                    style={on ? { backgroundImage: `linear-gradient(90deg, ${color} 10%, #fff 115%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : undefined}
                  >
                    {t ? TRACK_LABEL[t] : "Tous"}
                  </span>
                  <span className="rounded px-1.5 text-xs tabular-nums transition-colors" style={{ color: on ? "#fff" : color, background: on ? `${color}40` : `${color}14` }}>
                    {count}
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300" style={{ width: on ? "100%" : "0%", background: color }} />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="relative">
              <span className="sr-only">Trier</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
                className={select}
              >
                <option value="selection">Sélection</option>
                <option value="date">Plus récents</option>
                <option value="complexity">Plus complexes</option>
              </select>
              <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500" />
            </label>
            <span className="text-sm text-zinc-500 tabular-nums">{visible.length} projets</span>
          </div>
        </div>

        {/* GROUPS: personal & work, then course projects, each under a titled line. */}
        {visible.length === 0 ? (
          <p className="text-zinc-400">Aucun projet ne correspond à ce filtre.</p>
        ) : (
          <div className="space-y-14">
            {groups.map((g) => {
              const open = expanded[g.id];
              const shown = open ? g.items : g.items.slice(0, FIRST_CARDS);
              const rest = g.items.length - FIRST_CARDS;
              return (
                <section key={g.id} aria-labelledby={`projects-${g.id}`}>
                  <h3 id={`projects-${g.id}`} className="mb-8 flex items-center gap-5 text-xs tracking-[0.3em] text-zinc-400 uppercase">
                    <span className="h-px flex-1 bg-white/10" />
                    {g.title} <span className="text-zinc-600 tabular-nums">{g.items.length}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </h3>
                  <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{shown.map(card)}</div>
                  {rest > 0 && (
                    <div className="mt-8 text-center">
                      <button
                        type="button"
                        aria-expanded={!!open}
                        onClick={() => setExpanded((e) => ({ ...e, [g.id]: !open }))}
                        className="rounded-full border border-white/15 px-5 py-2 text-sm text-zinc-300 transition-colors hover:border-white/35 hover:text-white"
                      >
                        {open ? "Réduire" : `Voir les ${rest} autres`}
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL (portal: above the fixed navbar) */}
      {selected && createPortal(
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[90vh] w-[95vw] flex-col overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.5)] md:w-[85vw] lg:w-[75vw]"
          >
            <div className="relative p-6 text-center">
              <p className="mb-3 text-base uppercase tracking-[0.3em] text-cyber opacity-80">
                {selected.tier === "dossier" ? "DOSSIER" : "PROJECT_OVERVIEW"}
              </p>
              <h3 className="pb-5 text-xl font-bold uppercase text-white md:text-3xl">{selected.title}</h3>
              <button type="button" onClick={() => setSelected(null)} className="absolute top-6 right-6 text-xl text-zinc-500 transition-colors hover:text-white">
                [ESC_EXIT]
              </button>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-white/10 bg-white/5 p-4 text-sm uppercase md:justify-between">
                <span><span className="text-cyber">Période :</span> <span className="text-white">{formatPeriod(selected.period)}</span></span>
                <span><span className="text-cyber">Équipe :</span> <span className="text-white">{selected.team.size > 1 ? (selected.team.label?.fr ?? `${selected.team.size} personnes`) : "Solo"}</span></span>
                <span><span className="text-cyber">Contexte :</span> <span className="text-white">{CONTEXT_LABEL[selected.context]}</span></span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-cyber">Complexité :</span>
                  <span aria-hidden="true" className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={`size-2 rounded-full ${n <= complexityOf(selected) ? "bg-cyber shadow-[0_0_6px_var(--color-cyber)]" : "bg-white/15"}`} />
                    ))}
                  </span>
                  <span className="text-white">{complexityOf(selected)}/5</span>
                </span>
                <span className={`border px-2.5 py-1 ${statusStyles[selected.status]}`}>{statusLabels[selected.status].fr}</span>
                {selected.inProduction && <span className="border border-cyber/50 bg-cyber/10 px-2.5 py-1 text-cyber">{selected.inProduction.fr}</span>}
              </div>
            </div>

            <div className="flex flex-grow flex-col overflow-hidden md:flex-row">
              {images.length > 0 && (
                <div className="relative flex w-full items-center justify-center border-r border-white/5 bg-black/40 p-3 md:w-1/2">
                  <div className="absolute inset-0 bg-cyber opacity-10 blur-3xl" />
                  <div className="relative z-10 flex w-full items-center justify-center">
                    {images.length > 1 && (
                      <button type="button" onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Image précédente" className="absolute left-0 z-20 cursor-pointer bg-black/55 px-3 py-2 text-4xl leading-none text-cyber/60 backdrop-blur-sm transition-colors hover:text-cyber">
                        ‹
                      </button>
                    )}
                    <img loading="lazy" decoding="async" src={images[imageIndex]} alt={selected.title} className="max-h-[62vh] max-w-full border border-white/10 object-contain shadow-2xl" />
                    {images.length > 1 && (
                      <button type="button" onClick={() => setImageIndex((i) => (i + 1) % images.length)} aria-label="Image suivante" className="absolute right-0 z-20 cursor-pointer bg-black/55 px-3 py-2 text-4xl leading-none text-cyber/60 backdrop-blur-sm transition-colors hover:text-cyber">
                        ›
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className={`flex w-full flex-col gap-8 overflow-y-auto bg-zinc-900/20 p-8 ${images.length ? "md:w-1/2" : ""}`}>
                <div className="flex flex-col gap-4">
                  <h4 className="flex items-center gap-3 text-lg uppercase tracking-[0.2em] text-zinc-100">
                    <span className="text-cyber">⬢</span> Résumé
                  </h4>
                  <p className="border-l-2 border-cyber/30 pl-4 text-base leading-relaxed text-zinc-200">{selected.summary.fr}</p>
                </div>

                {selected.facts.length > 0 && (
                  <dl className="flex flex-wrap gap-x-10 gap-y-4">
                    {selected.facts.map((f) => (
                      <div key={f.label.fr} className="border-t border-cyber/30 pt-2">
                        <dt className="sr-only">{f.label.fr}</dt>
                        <dd>
                          <span className="block text-3xl font-bold text-cyber">{f.value}</span>
                          <span className="text-xs uppercase tracking-widest text-zinc-400">{f.label.fr}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {selected.sections?.map((s) => (
                  <div key={s.kind} className="flex flex-col gap-3">
                    <h4 className="flex items-center gap-3 text-base uppercase tracking-[0.2em] text-zinc-100">
                      <span className="text-cyber">▸</span> {s.title.fr}
                    </h4>
                    <p className="text-[15px] leading-relaxed text-zinc-300">{s.body.fr}</p>
                  </div>
                ))}

                <div className="border border-white/5 bg-black/40 p-4">
                  <h4 className="mb-3 text-base uppercase text-zinc-100">Expertise technique</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.stack.map((t) => (
                      <span key={t} className="border border-cyber/20 bg-cyber/5 px-3 py-1.5 text-base text-cyber">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <ProjectLinks project={selected} onInternal={() => setSelected(null)} />
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
};

function ProjectLinks({ project, onInternal }) {
  const links = [
    project.links.github && { url: project.links.github, label: "VOIR_LE_CODE_SUR_GITHUB" },
    project.links.writeup && { url: project.links.writeup, label: "LIRE_LES_WRITE-UPS_SUR_GITHUB" },
    project.links.demo && { url: project.links.demo, label: "OUVRIR", internal: true },
    ...(project.links.repos ?? []).map((r) => ({ url: r.url, label: r.label })),
  ].filter(Boolean);

  if (links.length === 0) {
    return (
      <p className="flex items-center justify-center gap-2 border-t border-white/10 py-4 text-sm text-zinc-400">
        <Lock size={15} aria-hidden="true" /> Code privé
      </p>
    );
  }
  return (
    <div className="flex flex-wrap border-t border-cyber/20">
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target={l.internal ? undefined : "_blank"}
          rel={l.internal ? undefined : "noopener noreferrer"}
          onClick={l.internal ? onInternal : undefined}
          className="group relative flex flex-1 items-center justify-center overflow-hidden border-r border-cyber/20 bg-cyber/5 px-4 py-4 transition-all duration-300 last:border-r-0 hover:bg-cyber/10"
        >
          <span className="relative text-sm font-bold uppercase tracking-[0.2em] text-cyber">[ {l.label} ]</span>
        </a>
      ))}
    </div>
  );
}

export default ProjectSection;
