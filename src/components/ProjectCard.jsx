import React from "react";

const ProjectCard = ({ titre, description, tags, lien }) => {
  return (
    <div className="group relative bg-black/40 border border-white/5 p-6 transition-all duration-500 hover:border-cyber/50 overflow-hidden">
      
      {/* Effet de brillance au survol (Glow) */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber/5 rounded-full blur-3xl group-hover:bg-cyber/10 transition-all duration-500"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* En-tête de la carte */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-zinc-100 font-mono font-bold tracking-tighter group-hover:text-cyber transition-colors uppercase">
            {titre}
          </h3>
          <div className="text-cyber opacity-20 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-grow font-mono uppercase tracking-tight">
          {description}
        </p>

        {/* Liste des Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-[9px] font-mono px-2 py-0.5 border border-white/10 text-white/40 group-hover:border-cyber/30 group-hover:text-cyber/80 transition-all"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Barre de progression décorative (Style Cyber) */}
        <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full bg-cyber -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;