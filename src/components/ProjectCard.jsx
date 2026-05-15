import React from "react";

const ProjectCard = ({
  titre,
  description,
  tags,
  image,
  categorie,
  date,
  onClick,
  theme,
}) => {
  const visibleTags = tags.slice(0, 8);
  const hasMoreTags = tags.length > visibleTags.length;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-black/40 border border-white/20 px-5 py-4 transition-all duration-500 overflow-hidden cursor-crosshair h-full flex flex-col ${theme.card}`}
      // BG IMAGE
      style={{
        backgroundImage: `url(${image})`,
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

      {/* CARD CONTENT */}
      <div className="relative z-10 flex flex-col h-full flex-grow rounded-sm border border-white/10 bg-black/38 p-4 backdrop-blur-[1px] transition-colors duration-500 group-hover:bg-black/46">
        {/* CARD HEADER */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base md:text-lg text-zinc-100 font-mono font-bold tracking-tighter group-hover:text-cyber transition-colors uppercase mb-2">
            {titre}
          </h3>

          <span
            className={`text-sm font-mono border px-2.5 py-1 uppercase transition-all duration-300 ${theme.badge}`}
          >
            {categorie}
          </span>
        </div>

        {/* Description */}
        <div className="flex-grow overflow-hidden mb-4">
          <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-mono tracking-tight line-clamp-3">
            {description}
          </p>
        </div>

        {/* Liste des Tags */}
        <div className="mb-3 flex max-h-[4.95rem] flex-wrap gap-1.5 overflow-hidden pb-0.5">
          {visibleTags.map((tag, index) => (
            <span
              key={index}
              className="text-base font-mono px-2.5 py-1 bg-black/50 border border-cyber/20 text-zinc-400 group-hover:border-cyber/80 group-hover:text-cyber/80 transition-all"
            >
              {tag}
            </span>
          ))}
          {hasMoreTags && (
            <span className="border border-cyber/20 bg-black/70 px-2.5 py-1 font-mono text-base text-cyber/80 transition-all group-hover:border-cyber/80">
              ...
            </span>
          )}
        </div>

        {/* BLOC DATE */}
        <div className="flex justify-end">
          <span className="text-sm font-mono text-zinc-400 group-hover:text-cyber/80 transition-colors uppercase tracking-widest">
            [{date}]
          </span>
        </div>

        {/* Barre de progression décorative */}
        <div className="h-[1px] w-full bg-white/5 relative overflow-hidden mt-auto">
          <div className="absolute top-0 left-0 h-full w-full bg-cyber -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
