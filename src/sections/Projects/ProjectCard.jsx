import React from "react";
import { StackLine } from "../../components/ui/StackLine";

// Compact project card on a dark panel inset from the image edges: context and production mention,
// domain badges (a project can have several: Argos is Cyber and IA), title, two lines of summary,
// one line of stack and date.
const ProjectCard = ({ titre, description, tags, image, emblem, categories, date, onClick, theme, inProduction, ongoing, context, silver }) => {
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
        // A project emblem (its height in the card) is shown whole, rather than cropped like a screenshot.
        backgroundSize: emblem ? `auto ${emblem}` : "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/20" />

      {/* Readable panel behind the text, inset from the card edges so the image frames it. */}
      <div className="relative z-10 m-2 flex h-[calc(100%-1rem)] flex-col rounded-sm border border-white/10 bg-black/75 p-4 backdrop-blur-[2px] transition-colors duration-500 group-hover:bg-black/65">
        {/* Top row: context and production mention on the left, domain badges on the right. */}
        <div className="mb-3 flex min-h-[1.375rem] flex-wrap items-start gap-1.5">
          {context &&
            (silver ? (
              <SilverBadge className="px-1.5 py-0.5 text-[10px]">{context}</SilverBadge>
            ) : (
              <span className="border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] tracking-widest text-zinc-300 uppercase">{context}</span>
            ))}
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
          <span className="ml-auto flex flex-wrap justify-end gap-1.5">
            {categories.map((c) => (
              <span key={c.label} className={`border px-1.5 py-0.5 text-[11px] uppercase ${c.badge}`}>
                {c.label}
              </span>
            ))}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg leading-tight font-bold text-zinc-100 uppercase transition-colors group-hover:text-cyber">{titre}</h3>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-300">{description}</p>

        <StackLine tags={tags} />

        <div className="flex justify-end text-xs">
          <span className={`tracking-wide transition-colors ${ongoing ? "text-sky-300" : "text-zinc-400 group-hover:text-cyber/80"}`}>{date}</span>
        </div>
      </div>
    </button>
  );
};

/** Silver badge for hackathons. */
function SilverBadge({ children, className = "" }) {
  return (
    <span className={`border border-zinc-300/45 bg-gradient-to-b from-white/15 to-zinc-500/10 tracking-widest uppercase shadow-[0_0_10px_rgba(255,255,255,0.18)] ${className}`}>
      <span className="bg-gradient-to-b from-white from-50% to-zinc-400 to-50% bg-clip-text font-bold text-transparent drop-shadow-[0_1px_4px_rgba(255,255,255,0.35)]">{children}</span>
    </span>
  );
}

export default ProjectCard;
