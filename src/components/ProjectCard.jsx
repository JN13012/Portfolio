import React from "react";

const ProjectCard = ({
  titre,
  description,
  tags,
  image,
  categorie,
  date,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-black/40 border border-white/20 px-6 py-[18px] transition-all duration-500 hover:border-cyber/70 overflow-hidden cursor-pointer h-full flex flex-col"
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
      <div
        className="absolute inset-0 z-0 
    bg-black/70 backdrop-blur-[2px] 
    group-hover:bg-black/40 group-hover:backdrop-blur-none 
    transition-all duration-500 shadow-inner"
      ></div>

      {/* Ton effet de brillance (Glow) existant - On le garde car il apporte du relief */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber/10 rounded-full blur-3xl group-hover:bg-cyber/40 transition-all duration-5000 z-0"></div>

      {/* CARD CONTENT */}
      <div className="relative z-10 flex flex-col h-full flex-grow">
        {/* CARD HEADER */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-zinc-100 font-mono font-bold tracking-tighter group-hover:text-cyber transition-colors uppercase text-sm md:text-base mb-2">
            {titre}
          </h3>
          <div className="text-cyber/40 group-hover:text-cyber transition-colors -mr-2">
            <span className="text-xs font-mono border border-cyber/30 px-2 py-0.5 text-cyber/80 uppercase bg-cyber/5">
              {categorie}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex-grow overflow-hidden mb-4">
          <p className="text-zinc-300 text-[10px] md:text-xs leading-relaxed font-mono uppercase tracking-tight line-clamp-3">
            {description}
          </p>
        </div>

        {/* Liste des Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.slice(0, 10).map((tag, index) => (
            <span
              key={index}
              className="text-sm font-mono px-2 py-0.5 bg-black/50 border border-cyber/20 text-zinc-400 group-hover:border-cyber/80 group-hover:text-cyber/80 transition-all"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* BLOC DATE */}
        <div className="flex justify-end">
          <span className="text-xs font-mono text-zinc-400 group-hover:text-cyber/80 transition-colors uppercase tracking-widest">
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
