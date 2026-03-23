import React from "react";

const Presentation = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-20">
      {/* Badge de Statut */}
      <div className="mb-8 flex items-center gap-3 border border-cyber/30 bg-cyber/5 px-4 py-1.5 self-center">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute h-full w-full rounded-full bg-cyber opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber"></span>
        </span>
        <span className="text-[10px] uppercase tracking-widest font-mono text-cyber">
          System_Status: Operational
        </span>
      </div>

      {/* Hero Title */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          Nagi <span className="text-white">Jérémie</span>
        </h1>
        <h2 className="text-lg md:text-2xl font-mono">
          <span className="opacity-50">&gt;</span> Architecte Systèmes
          <span className="bg-cyber text-black px-2 ml-2 font-bold italic">
            Cybersecurity_Spec
          </span>
        </h2>
      </div>

      {/* Description : On enlève le max-w trop petit pour laisser respirer le texte */}
      <p className="max-w-3xl text-center text-gray-400 text-sm md:text-lg leading-relaxed mb-12 font-mono">
        Ancien militaire et mécanicien de compétition.
        <br className="hidden md:block" />


        AVEC TOUTE LES COMPETENCES QUI DEFILES !!!!!!!!!!!!
      </p>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-6">
        <a
          href="#projects"
          className="bg-cyber text-black font-bold px-10 py-4 hover:bg-white transition-all duration-300 text-center tracking-tighter"
        >
          [ EXPLORER_PROJETS ]
        </a>
        <a
          href="#contact"
          className="border border-white/20 text-white font-bold px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 text-center tracking-tighter"
        >
          ME_CONTACTER_
        </a>
      </div>
    </section>
  );
};

export default Presentation;
