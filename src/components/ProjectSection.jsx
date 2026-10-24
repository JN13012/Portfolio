import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";
import { projects } from "../content/projects";
import { statusLabels } from "../content/ui";
import { envergure, filterProjects, sortProjects, tracksFromSearch } from "../lib/projects";
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

const PROJECTS_PER_PAGE = 6;

/** Visuals per project slug (first image = card background). Projects without one get a pattern. */
const IMAGES = {
  pentest: [Tor],
  "applications-llm": [RAG_pdf_Chatbot, Business_AI_Meeting, AI_Career_Coach, AI_Assistant_Translator],
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

const STATUS_FILTERS = ["development", "delivered"];

const ProjectSection = () => {
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [tracks, setTracks] = useState(() => tracksFromSearch(window.location.search));
  const [statuses, setStatuses] = useState([]);
  const [sort, setSort] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);

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

  const visible = useMemo(() => sortProjects(filterProjects(projects, { tracks, statuses }), sort), [tracks, statuses, sort]);
  // Featured projects (full case study) come first; every card has the same size.
  const ordered = [...visible.filter((p) => p.tier === "dossier"), ...visible.filter((p) => p.tier !== "dossier")];
  const totalPages = Math.max(1, Math.ceil(ordered.length / PROJECTS_PER_PAGE));
  const page = ordered.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE);
  const card = (p) => (
    <ProjectCard
      key={p.slug}
      titre={p.title}
      description={p.summary.fr}
      tags={p.stack}
      image={IMAGES[p.slug]?.[0]}
      categorie={TRACK_LABEL[p.tracks[0]] ?? "Projet"}
      date={cardDate(p.period)}
      ongoing={!p.period.end}
      status={statusLabels[p.status].fr}
      inProduction={p.inProduction?.fr}
      statusClass={statusStyles[p.status]}
      isDossier={p.tier === "dossier"}
      theme={trackThemes[p.tracks[0]] || trackThemes.Default}
      onClick={() => open(p)}
    />
  );

  const updateTracks = (next) => {
    setTracks(next);
    setCurrentPage(1);
  };
  const updateStatuses = (next) => {
    setStatuses(next);
    setCurrentPage(1);
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
        <div className="mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-white/10 pb-5">
          {/* Job tabs: underlined like the Expertise list, with the number of projects in a coloured badge. */}
          <div role="group" aria-label="Filtrer par métier" className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[null, "ia", "cyber", "dev"].map((t) => {
              const on = t ? tracks.length === 1 && tracks[0] === t : tracks.length === 0;
              const color = t ? TRACK_COLOR[t] : "#e4e4e7";
              const count = filterProjects(projects, { tracks: t ? [t] : [], statuses }).length;
              return (
                <button key={t ?? "all"} type="button" aria-pressed={on} onClick={() => updateTracks(t ? [t] : [])} className="group relative inline-flex items-center gap-2 pb-2.5 text-lg">
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
              <span className="sr-only">Statut</span>
              <select value={statuses[0] ?? ""} onChange={(e) => updateStatuses(e.target.value ? [e.target.value] : [])} className={select}>
                <option value="">Tous les statuts</option>
                {STATUS_FILTERS.map((st) => (
                  <option key={st} value={st}>
                    {statusLabels[st].fr}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500" />
            </label>
            <label className="relative">
              <span className="sr-only">Trier</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className={select}
              >
                <option value="date">Plus récents</option>
                <option value="envergure">Envergure</option>
              </select>
              <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500" />
            </label>
            <span className="text-sm text-zinc-500 tabular-nums">{visible.length} projets</span>
          </div>
          {sort === "envergure" && (
            <p className="w-full text-xs text-zinc-500">
              Envergure = durée (mois, plafonnée à 12) + taille de l’équipe (plafonnée à 7) + tests (échelle logarithmique).
            </p>
          )}
        </div>

        {/* GRID */}
        {visible.length === 0 ? (
          <p className="text-zinc-400">Aucun projet ne correspond à ces filtres.</p>
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{page.map(card)}</div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pages des projets" className="mt-12 flex items-center justify-center gap-2 text-sm">
            <button type="button" onClick={() => setCurrentPage((n) => Math.max(1, n - 1))} disabled={currentPage === 1} className="rounded-md px-3 py-1.5 text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30">
              ← Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={currentPage === n ? "page" : undefined}
                onClick={() => setCurrentPage(n)}
                className={`size-8 rounded-md tabular-nums transition-colors ${currentPage === n ? "bg-white/10 text-white ring-1 ring-white/20" : "text-zinc-500 hover:text-white"}`}
              >
                {n}
              </button>
            ))}
            <button type="button" onClick={() => setCurrentPage((n) => Math.min(totalPages, n + 1))} disabled={currentPage === totalPages} className="rounded-md px-3 py-1.5 text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30">
              Suivant →
            </button>
          </nav>
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

                {sort === "envergure" && (
                  <p className="text-xs text-zinc-500">Envergure : {envergure(selected)}</p>
                )}
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
    return project.links.privateRepo ? (
      <p className="border-t border-white/10 py-4 text-center text-sm uppercase tracking-[0.2em] text-zinc-500">Dépôt privé · code non public</p>
    ) : null;
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
