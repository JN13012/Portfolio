import React from "react";

// Compact project card: context and production mention, title and job, two lines of summary,
// one line of stack (then « +N »), complexity dots and date.
const ProjectCard = ({ titre, description, tags, image, categorie, date, onClick, theme, inProduction, ongoing, complexity, context }) => {
  // Whole tags only, as many as fit on one line (≈ 26 characters), then « +N ».
  const visibleTags = [];
  let used = 0;
  for (const tag of tags) {
    if (visibleTags.length && used + tag.length > 26) break;
    visibleTags.push(tag);
    used += tag.length + 3;
  }
  const more = tags.length - visibleTags.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex h-full min-h-[15rem] cursor-crosshair flex-col overflow-hidden border border-white/15 bg-black/40 text-left transition-all duration-500 focus-visible:outline-2 focus-visible:outline-cyber ${theme.card}`}
      // Background image (or a fine pattern when the project has no visual yet).
      style={{
        backgroundImage: image
          ? `url(${image})`
          : "repeating-linear-gradient(135deg, rgba(74,222,128,0.06) 0 2px, transparent 2px 14px), radial-gradient(circle at 30% 20%, rgba(74,222,128,0.14), transparent 60%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/92 transition-all duration-500 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/70" />

      <div className="relative z-10 flex h-full flex-col p-5">
        <div className="mb-3 flex min-h-[1.375rem] flex-wrap gap-1.5">
          {context && <span className="border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] tracking-widest text-zinc-300 uppercase">{context}</span>}
          {inProduction && (
            <span className="inline-flex items-center gap-1.5 border border-cyber/50 bg-cyber/10 px-1.5 py-0.5 text-[10px] tracking-widest text-cyber uppercase">
              {/* "Live" light: pulses softly, still under reduced motion. */}
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-cyber motion-safe:animate-ping" />
                <span className="relative size-1.5 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)]" />
              </span>
              {inProduction}
            </span>
          )}
        </div>

        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg leading-tight font-bold text-zinc-100 uppercase transition-colors group-hover:text-cyber">{titre}</h3>
          <span className={`shrink-0 border px-1.5 py-0.5 text-[11px] uppercase ${theme.badge}`}>{categorie}</span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-300">{description}</p>

        <div className="mt-auto mb-3 flex flex-nowrap gap-1.5 overflow-hidden">
          {visibleTags.map((tag) => (
            <span key={tag} className="shrink-0 whitespace-nowrap border border-cyber/20 bg-black/50 px-2 py-0.5 text-xs text-zinc-400 transition-colors group-hover:border-cyber/60 group-hover:text-cyber/80">
              {tag}
            </span>
          ))}
          {more > 0 && <span className="shrink-0 border border-cyber/20 bg-black/50 px-2 py-0.5 text-xs text-cyber/80">+{more}</span>}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span title={`Complexité ${complexity}/5`} className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} aria-hidden="true" className={`size-1.5 rounded-full ${n <= complexity ? "bg-cyber shadow-[0_0_6px_var(--color-cyber)]" : "bg-white/15"}`} />
            ))}
            <span className="sr-only">Complexité {complexity} sur 5</span>
          </span>
          <span className={`tracking-wide transition-colors ${ongoing ? "text-sky-300" : "text-zinc-400 group-hover:text-cyber/80"}`}>{date}</span>
        </div>
      </div>
    </button>
  );
};

export default ProjectCard;
