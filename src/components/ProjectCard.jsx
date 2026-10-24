import React from "react";
import { Star } from "lucide-react";

const ProjectCard = ({
  titre,
  description,
  tags,
  image,
  categorie,
  date,
  onClick,
  theme,
  isDossier,
  inProduction,
  ongoing,
}) => {
  const visibleTags = tags.slice(0, 8);
  const hasMoreTags = tags.length > visibleTags.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-[24.75rem] bg-black/40 border border-white/20 px-5 py-4 text-left transition-all duration-500 overflow-hidden cursor-crosshair h-full flex flex-col focus-visible:outline-2 focus-visible:outline-cyber ${theme.card}`}
      // BG IMAGE (or a fine pattern when the project has no visual yet)
      style={{
        backgroundImage: image
          ? `url(${image})`
          : "repeating-linear-gradient(135deg, rgba(74,222,128,0.06) 0 2px, transparent 2px 14px), radial-gradient(circle at 30% 20%, rgba(74,222,128,0.14), transparent 60%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundClip: "padding-box",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-black/75 to-black/90 backdrop-blur-[1px] transition-all duration-500 group-hover:from-black/58 group-hover:via-black/34 group-hover:to-black/62 group-hover:backdrop-blur-0 shadow-inner"></div>

      {/* EFFET BRILLANCE GLOW */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber/10 rounded-full blur-3xl group-hover:bg-cyber/40 transition-all duration-5000 z-0"></div>

      {/* Featured project: a small star in the top-right corner, explained on hover and to screen readers. */}
      {isDossier && (
        <span title="Projet phare" className="absolute top-2.5 right-2.5 z-20">
          <Star size={15} aria-hidden="true" className="fill-amber-300 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]" />
          <span className="sr-only">Projet phare</span>
        </span>
      )}

      {/* CARD CONTENT */}
      <div className="relative z-10 flex flex-col h-full flex-grow rounded-sm border border-white/10 bg-black/38 p-4 backdrop-blur-[1px] transition-colors duration-500 group-hover:bg-black/46">
        {/* STATUS */}
        {/* Only real company use is flagged here; the date says whether the project is ongoing. */}
        <div className="mb-3 flex min-h-[1.375rem] flex-wrap gap-2">
          {inProduction && (
            <span className="inline-flex items-center gap-2 border border-cyber/50 bg-cyber/10 px-2 py-0.5 text-xs uppercase tracking-widest text-cyber">
              {/* "Live" light: pulses softly, still under reduced motion. */}
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 rounded-full bg-cyber motion-safe:animate-ping" />
                <span className="relative size-2 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)]" />
              </span>
              {inProduction}
            </span>
          )}
        </div>

        {/* CARD HEADER */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl md:text-2xl text-zinc-100 font-bold tracking-normal group-hover:text-cyber transition-colors uppercase mb-2">
            {titre}
          </h3>

          <span
            className={`text-sm border px-2.5 py-1 uppercase transition-all duration-300 ${theme.badge}`}
          >
            {categorie}
          </span>
        </div>

        {/* Description */}
        <div className="flex-grow overflow-hidden mb-4">
          <p className="text-zinc-200 text-sm md:text-base leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Liste des Tags */}
        <div className="mb-3 flex max-h-[4.95rem] flex-wrap gap-1.5 overflow-hidden pb-0.5">
          {visibleTags.map((tag, index) => (
            <span
              key={index}
              className="text-base px-2.5 py-1 bg-black/50 border border-cyber/20 text-zinc-400 group-hover:border-cyber/80 group-hover:text-cyber/80 transition-all"
            >
              {tag}
            </span>
          ))}
          {hasMoreTags && (
            <span className="border border-cyber/20 bg-black/70 px-2.5 py-1 text-base text-cyber/80 transition-all group-hover:border-cyber/80">
              ...
            </span>
          )}
        </div>

        {/* BLOC DATE (and, for featured projects, the hint that a full case study opens) */}
        <div className={`flex items-center ${isDossier ? "justify-between" : "justify-end"}`}>
          {isDossier && <span className="text-sm text-amber-300/90 transition-colors group-hover:text-amber-200">Lire l’étude →</span>}
          <span className={`text-sm tracking-wide transition-colors ${ongoing ? "text-sky-300" : "text-zinc-400 group-hover:text-cyber/80"}`}>
            {date}
          </span>
        </div>

        {/* Barre de progression décorative */}
        <div className="h-[1px] w-full bg-white/5 relative overflow-hidden mt-auto">
          <div className="absolute top-0 left-0 h-full w-full bg-cyber -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        </div>
      </div>
    </button>
  );
};

export default ProjectCard;
