import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { siTryhackme } from "simple-icons";
import { ModalFrame } from "../../components/ui/dialogs/ModalFrame";
import { ImageLightbox } from "../../components/ui/dialogs/ImageLightbox";
import { useImageGallery } from "../../components/ui/dialogs/useImageGallery";
import SectionHeader from "../../components/ui/SectionHeader";
import { StackLine } from "../../components/ui/StackLine";
import TopicIcon from "../../components/ui/TopicIcon";
import { averageGrade, credentials, inProgress } from "../../content/certifications";
import { dialogUi, credentialKindLabels, credentialLevelLabels, gradeLabels } from "../../content/ui";
import { tracksFromSearch } from "../../lib/projects";
import { onCore } from "../../lib/coreBus";
import IBM_LOGO from "../../assets/Logos/ibm.svg"; // IBM 8-bar logo (Wikimedia Commons, public domain), thickened for the dark cards

// Cards shown before « Voir les N autres » (same as Projets).
const FIRST_CARDS = 8;

// Tabs, coloured like the project jobs (« Tous » first, as in Projets); a credential shows in every tab
// one of its tracks belongs to, so the workshop on AI pentesting counts in both Cybersécurité and IA.
const TABS = [
  { id: "all", label: "Tous", color: "#e4e4e7", tracks: null },
  { id: "cyber", label: "Cybersécurité", color: "#f43f5e", tracks: ["cyber"] },
  { id: "ia-dev", label: "IA", color: "#38bdf8", tracks: ["ia", "data", "dev"] },
];

const LEVEL_STYLE = {
  1: { text: "text-green-300", bg: "bg-green-300/90" },
  2: { text: "text-green-500", bg: "bg-green-500/90" },
  3: { text: "text-yellow-300", bg: "bg-yellow-300/90" },
  4: { text: "text-orange-400", bg: "bg-orange-400/90" },
  5: { text: "text-red-500", bg: "bg-red-500/90" },
};

const ONGOING_BADGE = "text-sky-300 border-sky-500/40 bg-sky-500/10";
const KIND_BADGE = "text-zinc-300 border-white/15 bg-white/5";

// Paths in progress sit with the others as cards marked « En cours », dated by their measurement.
const ENTRIES = [...inProgress.map((i) => ({ ...i, ongoing: true, date: i.measuredAt })), ...credentials];

const inTab = (c, tab) => !tab.tracks || c.tracks.some((t) => tab.tracks.includes(t));
/** « 10/2026 » on cards; « 07/10/2026 » in the modal when the day is known. */
const monthOf = (date) => date.split("-").slice(0, 2).reverse().join("/");
const fullDate = (date) => date.split("-").reverse().join("/");
const percent = (c) => `${Math.round(c.progress * 100)} % au ${fullDate(c.measuredAt)}`;
const duration = (c) => (c.hours ? `${c.hours} h` : c.examHours ? `Examen ${c.examHours} h` : null);
/** A course shows its grade in the modal; a professional certificate shows the mean of its courses, on its card too. */
const gradeLine = (c) => {
  const average = averageGrade(c);
  return average !== undefined ? gradeLabels.average(average, c.includes.length) : c.grade !== undefined ? gradeLabels.grade(c.grade) : null;
};

/** In progress first, then most recent or hardest first; among the same level a PRO comes first (Pro Medium > Medium). */
const sortEntries = (list, sort) =>
  [...list].sort((a, b) => {
    if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;
    const byDate = b.date.localeCompare(a.date);
    const byLevel = (b.level ?? 0) - (a.level ?? 0);
    return sort === "level" ? byLevel || Number(Boolean(b.pro)) - Number(Boolean(a.pro)) || byDate : byDate || byLevel;
  });

const credentialFromSearch = (search) => new URLSearchParams(search).get("certificat");

const Certifications = () => {
  // « Tous » by default; a link with ?metier= opens on the matching tab (ia, data, dev → IA).
  const [tab, setTab] = useState(() => {
    const first = tracksFromSearch(window.location.search)[0];
    return TABS.find((t) => t.tracks?.includes(first))?.id ?? "all";
  });
  // Hardest first by default, most recent first among equals.
  const [sort, setSort] = useState("level");
  const [expanded, setExpanded] = useState(false);
  // A link with ?certificat=<id> opens on that certificate's modal (used from the GitHub profile).
  const [selected, setSelected] = useState(() => ENTRIES.find((c) => c.id === credentialFromSearch(window.location.search)) ?? null);
  const images = selected?.images ?? [];
  const { imageIndex, zoomed, reset: resetGallery, openZoom, closeZoom, step: stepImage } = useImageGallery(images.length);
  const shouldRestoreFocus = useRef(true);
  const close = (reason = "dismiss") => {
    shouldRestoreFocus.current = reason !== "navigate";
    setSelected(null);
  };
  // The certificate a course was opened from (IBM AI Developer → one of its courses), for the way back.
  const [parent, setParent] = useState(null);

  const activeTab = TABS.find((t) => t.id === tab);
  const visible = useMemo(() => sortEntries(ENTRIES.filter((c) => inTab(c, activeTab)), sort), [activeTab, sort]);
  const obtained = visible.filter((c) => !c.ongoing).length;
  const ongoing = visible.length - obtained;
  const shown = expanded ? visible : visible.slice(0, FIRST_CARDS);
  const rest = visible.length - FIRST_CARDS;

  const open = useCallback((c, from = null) => {
    setSelected(c);
    setParent(from);
    shouldRestoreFocus.current = true;
    resetGallery();
  }, [resetGallery]);

  // Previous / next certification from the modal, in page order (folded cards included), wrapping around.
  const at = selected ? visible.findIndex((c) => c.id === selected.id) : -1;
  const neighbour = (delta) => (at < 0 ? null : visible[(at + delta + visible.length) % visible.length]);
  const prev = neighbour(-1);
  const next = neighbour(1);


  // Closing a modal opened from a link leaves the visitor on this section, not on the Hero.
  useEffect(() => {
    if (credentialFromSearch(window.location.search)) document.getElementById("certifications")?.scrollIntoView({ behavior: "instant" });
  }, []);

  // The hero assistant opens a certification it cites, wherever the visitor is on the page.
  useEffect(
    () =>
      onCore("openCredential", ({ id }) => {
        const c = ENTRIES.find((x) => x.id === id);
        if (c) open(c);
      }),
    [open],
  );

  const select =
    "appearance-none rounded-md border border-white/10 bg-zinc-950/70 py-1.5 pr-8 pl-3 text-sm text-zinc-200 transition-colors hover:border-white/25 focus-visible:border-cyber/60 focus-visible:outline-none [&>option]:bg-zinc-900";

  return (
    <section id="certifications" className="relative overflow-hidden border-y border-cyber/10 bg-black/45 py-24 text-white">
      <div className="relative z-10 mx-auto px-2">
        <SectionHeader index="05" title="Certifications" />

        {/* FILTERS: one line — domain tabs on the left, sort menu and count on the right (as in Projets). */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pb-2">
          <div role="group" aria-label="Filtrer par domaine" className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {TABS.map((t) => {
              const on = t.id === tab;
              const count = credentials.filter((c) => inTab(c, t)).length;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setTab(t.id);
                    setExpanded(false);
                  }}
                  className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg"
                >
                  <span
                    className={on ? "font-semibold" : "text-zinc-400 transition-colors group-hover:text-zinc-200"}
                    style={on ? { backgroundImage: `linear-gradient(90deg, ${t.color} 10%, #fff 115%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : undefined}
                  >
                    {t.label}
                  </span>
                  <span className="rounded px-1.5 text-xs tabular-nums transition-colors" style={{ color: on ? "#fff" : t.color, background: on ? `${t.color}40` : `${t.color}14` }}>
                    {count}
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300" style={{ width: on ? "100%" : "0%", background: t.color }} />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="relative">
              <span className="sr-only">Trier</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={select}>
                <option value="level">Plus difficiles</option>
                <option value="date">Plus récentes</option>
              </select>
              <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-500" />
            </label>
            <span className="text-sm text-zinc-500 tabular-nums">
              {obtained} certification{obtained > 1 ? "s" : ""}
              {ongoing > 0 && ` · ${ongoing} en cours`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((c) => (
            <CertCard key={c.id} c={c} onClick={() => open(c)} />
          ))}
        </div>
        {rest > 0 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-zinc-300 transition-colors hover:border-white/35 hover:text-white"
            >
              {expanded ? "Réduire" : `Voir les ${rest} autres`}
            </button>
          </div>
        )}
      </div>

      {selected && (
        <ModalFrame label={selected.title} panelClassName="max-h-[90vh]"
          onClose={() => close()}
          onPrevious={prev ? () => open(prev) : undefined}
          onNext={next ? () => open(next) : undefined}
          restoreFocus={() => shouldRestoreFocus.current}
          fallbackFocus={() => document.querySelector('#certifications h2')}
          outside={
            <>
              {zoomed && images.length > 0 && (
                <ImageLightbox src={images[imageIndex]} alt={`Certificat ${selected.title}`}
                  label={`${selected.title}, image ${imageIndex + 1} sur ${images.length}`}
                  onClose={closeZoom}
                  onPrevious={images.length > 1 ? () => stepImage(-1) : undefined}
                  onNext={images.length > 1 ? () => stepImage(1) : undefined}
                  labels={{ previous: dialogUi.previousImage.fr, next: dialogUi.nextImage.fr }}
                />
              )}
              {/* Previous / next certification, outside the modal (also ← →). Hidden on phones, where the modal fills the width. */}
              {[
                { c: prev, side: "left-2 lg:left-[3vw]", Icon: ChevronLeft, label: "Certification précédente" },
                { c: next, side: "right-2 lg:right-[3vw]", Icon: ChevronRight, label: "Certification suivante" },
              ].map(({ c, side, Icon, label }) =>
                c && c.id !== selected.id ? (
                  <button
                    key={label}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      open(c);
                    }}
                    aria-label={`${label} : ${c.title}`}
                    title={c.title}
                    className={`group absolute top-1/2 hidden -translate-y-1/2 cursor-pointer flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-cyber md:flex ${side}`}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-black/60 transition-colors group-hover:border-cyber/60">
                      <Icon size={26} aria-hidden="true" />
                    </span>
                    <span className="hidden max-w-[9vw] text-center text-xs leading-tight text-zinc-400 uppercase lg:block">{c.cardTitle ?? c.title}</span>
                  </button>
                ) : null,
              )}
            </>
          }
        >
          <div className="relative p-6 pt-14 text-center md:pt-6">
            <p className="mb-3 text-base uppercase tracking-[0.3em] text-cyber opacity-80">{selected.issuer}</p>
            <h3 className="pb-5 text-xl font-bold uppercase text-white md:text-3xl">{selected.title}</h3>
            <button type="button" onClick={() => close()} data-dialog-initial-focus className="absolute top-4 right-4 text-base text-zinc-500 transition-colors hover:text-white md:top-6 md:right-6 md:text-xl">
              [ESC_EXIT]
            </button>
            {/* Back to the certificate this course was opened from, top left like a browser's back button. */}
            {parent && (
              <button
                type="button"
                onClick={() => open(parent)}
                className="absolute top-4 left-4 flex max-w-[30%] cursor-pointer items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white md:top-6 md:left-6 md:h-7 md:text-base"
              >
                <ArrowLeft size={18} aria-hidden="true" className="shrink-0" />
                <span className="truncate">Retour à {parent.cardTitle ?? parent.title}</span>
              </button>
            )}
            {/* One short line: type and date on the left, duration (or progress) centred, difficulty on the right. */}
            <div className="grid grid-cols-1 items-center justify-items-center gap-y-3 border-y border-white/10 bg-white/5 p-3 text-sm text-zinc-300 md:grid-cols-[1fr_auto_1fr]">
              <span className="flex flex-wrap items-center gap-2 md:justify-self-start">
                {selected.ongoing ? (
                  <span className={`border px-2.5 py-1 ${ONGOING_BADGE}`}>En cours</span>
                ) : (
                  <>
                    <span className={`border px-2.5 py-1 ${KIND_BADGE}`}>{credentialKindLabels[selected.kind].fr}</span>
                    <span>Obtenu le {selected.date.length > 7 ? fullDate(selected.date) : monthOf(selected.date)}</span>
                  </>
                )}
              </span>
              {selected.ongoing ? <Progress c={selected} wide /> : <span className="tabular-nums">{duration(selected)}</span>}
              <span className="md:justify-self-end">{selected.level && <Level level={selected.level} pro={selected.pro} />}</span>
            </div>
          </div>

          <div className="flex min-h-0 flex-grow flex-col overflow-y-auto md:flex-row md:overflow-hidden">
            {images.length > 0 && (
              <div className="relative flex w-full items-center justify-center border-r border-white/5 bg-black/40 p-3 md:w-1/2">
                <div className="absolute inset-0 bg-cyber opacity-10 blur-3xl" />
                <div className="relative z-10 flex w-full items-center justify-center">
                  {images.length > 1 && (
                    <button type="button" onClick={() => stepImage(-1)} aria-label={dialogUi.previousImage.fr} className="absolute left-0 z-20 cursor-pointer bg-black/55 px-3 py-2 text-4xl leading-none text-cyber/60 backdrop-blur-sm transition-colors hover:text-cyber">
                      ‹
                    </button>
                  )}
                  <button type="button" onClick={openZoom} aria-label="Agrandir le certificat" className="cursor-zoom-in">
                    <img loading="lazy" decoding="async" src={images[imageIndex]} alt={`Certificat ${selected.title}`} className="max-h-[58vh] max-w-full border border-white/10 object-contain shadow-2xl" />
                  </button>
                  {images.length > 1 && (
                    <button type="button" onClick={() => stepImage(1)} aria-label={dialogUi.nextImage.fr} className="absolute right-0 z-20 cursor-pointer bg-black/55 px-3 py-2 text-4xl leading-none text-cyber/60 backdrop-blur-sm transition-colors hover:text-cyber">
                      ›
                    </button>
                  )}
                  {images.length > 1 && (
                    <span className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] tracking-[0.2em] text-zinc-300 tabular-nums">
                      {imageIndex + 1}/{images.length}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div key={selected.id} className={`flex w-full flex-col gap-8 bg-zinc-900/20 p-8 md:overflow-y-auto ${images.length ? "md:w-1/2" : ""}`}>
              <div className="flex flex-col gap-4">
                <h4 className="flex items-center gap-3 text-lg uppercase tracking-[0.2em] text-zinc-100">
                  <span className="text-cyber">⬢</span> Contenu
                </h4>
                <p className="border-l-2 border-cyber/30 pl-4 text-base leading-relaxed text-zinc-200">{selected.note.fr}</p>
                {selected.result && (
                  <p className="flex items-start gap-2 pl-4 text-[15px] text-cyber">
                    <BadgeCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0" /> {selected.result.fr}
                  </p>
                )}
                {gradeLine(selected) && (
                  <p className="flex items-start gap-2 pl-4 text-[15px] text-cyber">
                    <BadgeCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0" /> {gradeLine(selected)}
                  </p>
                )}
                {selected.goal && (
                  <p className="pl-4 text-[15px] leading-relaxed text-zinc-300">
                    <span className="font-semibold text-zinc-100">Objectif</span> : {selected.goal.fr}
                  </p>
                )}
                {selected.points && (
                  <ul className="space-y-2 pl-4 text-[15px] leading-relaxed text-zinc-300">
                    {selected.points.map((pt) => (
                      <li key={pt.text.fr} className="flex gap-2">
                        <span aria-hidden="true" className="text-cyber/70">▸</span>
                        <span>
                          {pt.label && <span className="font-semibold text-zinc-100">{pt.label.fr} : </span>}
                          {pt.text.fr}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {selected.previous && <p className="pl-4 text-sm text-zinc-400">{selected.previous.fr}</p>}
              </div>

              {selected.includes && (
                <div className="flex flex-col gap-3">
                  <h4 className="flex items-center gap-3 text-base uppercase tracking-[0.2em] text-zinc-100">
                    <span className="text-cyber">▸</span> {selected.includes.length} cours
                  </h4>
                  <ol className="list-inside list-decimal space-y-1 text-[15px] text-zinc-300 marker:text-zinc-500">
                    {selected.includes.map(({ title, grade }) => {
                      // A course with its own card opens it in place; the others stay plain text.
                      const own = ENTRIES.find((c) => c.title === title);
                      const shown = grade ?? own?.grade;
                      return (
                        <li key={title}>
                          {own ? (
                            <button type="button" onClick={() => open(own, selected)} className="cursor-pointer text-left text-zinc-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-cyber hover:decoration-cyber/60">
                              {title}
                            </button>
                          ) : (
                            title
                          )}
                          {shown !== undefined && <span className="ml-2 text-zinc-400 tabular-nums">{shown.toLocaleString("fr-FR")}&nbsp;%</span>}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              <div className="border border-white/5 bg-black/40 p-4">
                <h4 className="mb-3 text-base uppercase text-zinc-100">Outils et notions</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.stack.map((t) => (
                    <span key={t} className="inline-flex items-center gap-2 border border-cyber/20 bg-cyber/5 px-3 py-1.5 text-base text-cyber">
                      <TopicIcon name={t} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {selected.credentialId && <p className="text-xs tracking-wide text-zinc-500">Identifiant : {selected.credentialId}</p>}
            </div>
          </div>

          {selected.verifyUrl && (
            <a
              href={selected.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center border-t border-cyber/20 bg-cyber/5 px-4 py-4 transition-colors duration-300 hover:bg-cyber/10"
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyber">
                [ {selected.ongoing ? "VOIR_MA_PROGRESSION" : "VÉRIFIER_LE_CERTIFICAT"} ]
              </span>
            </a>
          )}
        </ModalFrame>
      )}
    </section>
  );
};

/**
 * Card in the family of the project cards (border, dark panel, one line of stack, date bottom right),
 * with the certificate as a thumbnail, the platform and the difficulty bars (« PRO » when earned); the type (Parcours,
 * Cours…) is only said in the modal. A path in progress shows « En cours » and its progress instead.
 */
function CertCard({ c, onClick }) {
  const image = c.images?.[0];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-full min-h-[20rem] cursor-crosshair flex-col overflow-hidden border border-white/15 bg-zinc-950/80 text-left transition-all duration-500 hover:border-cyber/40 focus-visible:outline-2 focus-visible:outline-cyber"
    >
      <div className="relative aspect-[5/2] overflow-hidden border-b border-white/10 bg-black">
        {image ? (
          <img src={image} alt="" loading="lazy" decoding="async" style={{ objectPosition: c.thumbPosition }} className="size-full object-cover opacity-60 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90" />
        ) : (
          <div
            className="size-full"
            style={{ background: "repeating-linear-gradient(135deg, rgba(56,189,248,0.07) 0 2px, transparent 2px 14px), radial-gradient(circle at 30% 20%, rgba(56,189,248,0.16), transparent 60%)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        {/* Platform on the left, at the height of the difficulty (or « En cours ») on the right, as in the legacy cards. */}
        <div className="mb-3 flex min-h-[1.75rem] items-start justify-between gap-2">
          <Issuer name={c.issuer} />
          {c.ongoing ? (
            <span className={`border px-1.5 py-0.5 text-[10px] tracking-widest whitespace-nowrap uppercase ${ONGOING_BADGE}`}>En cours</span>
          ) : (
            c.level && <Level level={c.level} pro={c.pro} small />
          )}
        </div>

        <h3 className="mb-4 line-clamp-2 text-lg leading-tight font-bold text-zinc-100 uppercase transition-colors group-hover:text-cyber">{c.cardTitle ?? c.title}</h3>

        <StackLine tags={c.stack} />

        {c.ongoing ? (
          <Progress c={c} />
        ) : (
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-zinc-300 tabular-nums">
              {duration(c)}
              {averageGrade(c) !== undefined && <span className="text-zinc-400"> · {gradeLabels.card(averageGrade(c))}</span>}
            </span>
            <span className="tracking-wide text-zinc-400 transition-colors group-hover:text-cyber/80">{monthOf(c.date)}</span>
          </div>
        )}
      </div>
    </button>
  );
}

/** Simple Icons (CC0) mark, drawn in one colour. */
const Mark = ({ icon, color }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0">
    <path d={icon.path} fill={color} />
  </svg>
);

/** Platform of a card: its logo, then its name (IBM · Coursera: the IBM logo is enough). */
function Issuer({ name }) {
  if (name === "IBM · Coursera")
    return (
      <span className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <img src={IBM_LOGO} alt="IBM" loading="lazy" decoding="async" className="h-4 w-auto" />
        <span aria-hidden="true" className="text-zinc-500">·</span>
        Coursera
      </span>
    );
  return (
    <span className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
      {name === "TryHackMe" && <Mark icon={siTryhackme} color="#f43f5e" />}
      {name}
    </span>
  );
}

/** « PRO » mark of the legacy site: exam-based certifications and the IBM professional certificate. */
function ProBadge({ className = "" }) {
  return (
    <span className={`bg-gradient-to-b from-white from-50% to-zinc-400 to-50% bg-clip-text font-black tracking-widest text-transparent uppercase drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)] select-none ${className}`}>
      PRO
    </span>
  );
}

/** Difficulty word and five bars, with « PRO » before the word when earned (as in the legacy cards). */
function Level({ level, pro, small }) {
  const style = LEVEL_STYLE[level];
  return (
    <span className="flex flex-col items-end gap-1.5" title={`Difficulté ${level}/5`}>
      <span className="flex items-center gap-2.5">
        {pro && <ProBadge className={small ? "text-[11px]" : "text-xs"} />}
        <span className={`${small ? "text-[11px]" : "text-xs"} font-bold tracking-widest ${style.text}`}>
          <span className="sr-only">Difficulté : </span>
          {credentialLevelLabels[level]}
        </span>
      </span>
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <span key={step} className={`${small ? "h-1 w-4" : "h-1.5 w-5"} ${step <= level ? style.bg : "bg-zinc-800"}`} />
        ))}
      </span>
    </span>
  );
}

/** Progress of a path in progress, always dated. */
function Progress({ c, wide }) {
  return (
    <span className={`flex flex-col gap-1.5 text-xs text-sky-300 ${wide ? "w-56" : "w-full"}`}>
      <span
        role="progressbar"
        aria-label={`${c.title} : progression`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(c.progress * 100)}
        className="h-1 w-full bg-white/10"
      >
        <span className="block h-full bg-sky-400" style={{ width: `${c.progress * 100}%` }} />
      </span>
      <span className="tabular-nums">{percent(c)}</span>
    </span>
  );
}

export default Certifications;
