import React from "react";

// 1. On ajoute 'image' aux props reçues
const ProjectCard = ({ titre, description, tags, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-black/40 border border-white/20 p-6 transition-all duration-500 hover:border-cyber/70 overflow-hidden cursor-pointer h-full flex flex-col"
      // 2. APPLICATION DE L'IMAGE EN ARRIÈRE-PLAN
      // On utilise un style en ligne pour injecter dynamiquement l'URL
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover", // L'image couvre toute la carte ou mettre contain
        backgroundPosition: "center", // L'image est centrée
        backgroundRepeat: "no-repeat",
        backgroundClip: "padding-box",
      }}
    >
      {/* 3. L'OVERLAY (COUCHE DE PROTECTION POUR LA LISIBILITÉ) */}
      {/* Cette div est positionnée en 'absolute' pour couvrir toute la carte. */}
      {/* Elle applique un fond noir transparent et un flou léger (backdrop-blur) pour styliser. */}
      {/* 'z-0' assure qu'elle reste derrière le contenu textuel. */}
      <div
        className="absolute inset-0 z-0 
    bg-black/70 backdrop-blur-[2px] 
    group-hover:bg-black/40 group-hover:backdrop-blur-none 
    transition-all duration-500 shadow-inner"
      ></div>

      {/* Ton effet de brillance (Glow) existant - On le garde car il apporte du relief */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyber/5 rounded-full blur-3xl group-hover:bg-cyber/10 transition-all duration-500 z-0"></div>

      {/* LE CONTENU DE LA CARTE - AJOUT DE 'relative z-10' */}
      {/* Il est CRUCIAL que ce conteneur soit en 'relative z-10' pour passer DEVANT l'overlay. */}
      <div className="relative z-10 flex flex-col h-full flex-grow">
        {/* En-tête de la carte */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-zinc-100 font-mono font-bold tracking-tighter group-hover:text-cyber transition-colors uppercase text-sm md:text-base">
            {titre}
          </h3>
          <div className="text-cyber/40 group-hover:text-cyber transition-colors">
            {/* J'ai remplacé l'SVG par un petit label pour changer un peu */}
            <span className="text-[10px] font-mono border border-cyber/20 px-1.5 py-0.5">
              VIEW_DETAILS
            </span>
          </div>
        </div>

        {/* Description - Avec line-clamp pour garder les cartes alignées */}
        <p className="text-zinc-300 text-[10px] md:text-xs leading-relaxed mb-6 flex-grow font-mono uppercase tracking-tight line-clamp-3">
          {description}
        </p>

        {/* Liste des Tags - Limité à 3 pour ne pas surcharger */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-[8px] font-mono px-2 py-0.5 bg-black/50 border border-white/5 text-zinc-400 group-hover:border-cyber/30 group-hover:text-cyber/80 transition-all"
            >
              {tag}
            </span>
          ))}
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
