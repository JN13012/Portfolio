import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import Smartfridge from "../assets/Projets/Smartfridge.png";
import Cyberpong from "../assets/Projets/Cyberpong.png";
import My_marvin from "../assets/Projets/My_marvin.png";
import Popeye from "../assets/Projets/Popeye.png";
import Vaultborn from "../assets/Projets/Vaultborn.png";
import Vocal_assistant_AI from "../assets/Projets/Vocal_assistant_AI.png"; 
import LLM_Context_Wrapper from "../assets/Projets/LLM-Context-Wrapper.png";
import Unit_converter from "../assets/Projets/Unit_converter.png";

const ProjectSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projets = [
    {
      titre: "Smart-Fridge",
      description: "Pilotage complet d'une phase de conception : de l'analyse de marché (SWOT/PESTEL) à la planification opérationnelle. Inclut la définition des personas (Client/Équipe), la cartographie des risques (RiskMap/KPI) et la structuration budgétaire via diagrammes de Gantt.",
      tags: ["Management", "Stratégie", "Gestion de Budget", "Analyse_Risques", "Gantt", "KPI"],
      lien: "https://github.com/ton-username/Smart-Fridge",
      image: Smartfridge,
      date: "12/2025",
      categorie: "Gestion_de_Projet"
    },
    {
      titre: "My_Marvin",
      description: "Déploiement d'une instance Jenkins conteneurisée (Docker) et configurée entièrement par code (JCasC). Utilisation de scripts Groovy et Job DSL pour automatiser la génération de pipelines CI/CD reproductibles.",
      tags: ["Docker", "Jenkins", "Groovy", "JCasC"],
      lien: "https://github.com/ton-username/My_Marvin",
      image: My_marvin,
      date: "11/2025",
      categorie: "DevOps"
    },
    {
      titre: "POPEYE",
      description: "Orchestration d'une application web distribuée en micro-services isolés utilisant Docker et Docker Compose.",
      tags: ["Docker", "Compose"],
      lien: "https://github.com/ton-username/POPEYE",
      image: Popeye,
      date: "11/2025",
      categorie: "DevOps"
    },
    {
      titre: "Vaultborn",
      description: "Jeux Action-RPG 2D en Java mettant en œuvre les piliers de la POO (Héritage, Polymorphisme) et des Design Patterns (Factory). Système de combat en temps réel, gestion d'inventaire/équipements lootables, progression d'expérience dans différents univers.",
      tags: ["Java", "LibGDX", "POO"],
      lien: "https://github.com/ton-username/Vaultborn",
      image: Vaultborn,
      date: "10/2025",
      categorie: "Software Engineering"
    },
    {
      titre: "AI-Voice-Assistant",
      description: "Pipeline complet d'assistant vocal orchestrant Llama 3 (via Groq) pour le raisonnement, couplé aux services IBM Watson pour la reconnaissance (STT) et synthèse vocale (TTS). Interface de gestion développée sous Flask.",
      tags: ["Python", "Flask", "NLP", "Llama 3", "IBM Watson"],
      lien: "https://github.com/ton-username/AI-Voice-Assistant",
      image: Vocal_assistant_AI,
      date: "03/2026",
      categorie: "IA"
    },
    {
      titre: "LLM-Context-Wrapper",
      description: "Interface Python (Wrapper) optimisant l'usage de la bibliothèque Transformers (Hugging Face). Développement d'un système de gestion d'historique d'états pour maintenir le contexte conversationnel du modèle Blenderbot.",
      tags: ["Python", "PyTorch", "Transformers", "NLP", "Hugging_Face"],
      lien: "https://github.com/ton-username/LLM-Context-Wrapper",
      image: LLM_Context_Wrapper,
      date: "03/2026",
      categorie: "IA"
    },
    {
      titre: "CyberPong",
      description: "Action-Game en Python simulant une intrusion système via des mécaniques de jeu. Inclut une gestion dynamique de 'virus' (debuffs) modifiant la physique en temps réel (trajectoires, obstacles, effets visuels) avec une introduction scénarisée en piratage informatique.",
      tags: ["Python", "Pygame", "Turtle"],
      lien: "https://github.com/ton-username/CyberPong",
      image: Cyberpong,
      date: "09/2025",
      categorie: "Software Engineering"
    },
        {
      titre: "Salesforce-Executor",
      description:
        "Outil d'exécution de scripts et de traçage de logs pour l'écosystème Salesforce.",
      tags: ["JavaScript", "Salesforce"],
      lien: "#",
      date: "2024",
      categorie: "Software Engineering",
    },
    {
      titre: "Unit Converter",
      description: "Convertisseur universel d'unités : Masses, Longeurs, Temps, Volumes, Surfaces, Vitesses, Stockage",
      tags: ["Python", "Algorithmie", "GUI"],
      lien: "https://github.com/JN13012/Unit_converter",
      image: Unit_converter,
      date: "08/2025",
      categorie: "Software Engineering"
    },
  ];

  return (
    <section id="projects" className="py-32 bg-[#020202] text-white relative overflow-hidden border-y border-cyber/10">
      
      {/* 1. SECTION TITRE */}
      <div className="mx-auto px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-20 flex items-center gap-6">
          <span className="text-cyber font-mono text-base opacity-60">05.</span>
          <span className="text-zinc-100 tracking-[0.2em] uppercase font-mono">
            Projets_Réalisés
          </span>
          <div className="h-px bg-cyber/20 flex-1"></div>
        </h2>
      </div>

      {/* 2. GRILLE DE PROJETS */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projets.map((p, i) => (
            <ProjectCard 
              key={i} 
              {...p} 
              onClick={() => setSelectedProject(p)} 
            />
          ))}
        </div>
      </div>

      {/* 3. MODALE MISE À JOUR : CATÉGORIE EN HAUT */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-zinc-950 border border-white/10 w-[95vw] md:w-[85vw] lg:w-[75vw] max-h-[90vh] relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* HEADER MODALE */}
            <div className="p-6 text-center relative">
              <p className="text-sm font-mono tracking-[0.3em] uppercase mb-3 text-cyber opacity-80">
                PROJECT_DATABASE_RECORD
              </p>
              <h3 className="text-xl md:text-3xl font-bold text-white uppercase font-mono pb-5">
                {selectedProject.titre}
              </h3>
              
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white font-mono text-xl transition-colors"
              >
                [ESC_EXIT]
              </button>

              <div className="mt-auto p-4 border-b border-t border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-cyber font-mono text-xs uppercase opacity-60">Année_Création:</span>
                  <span className="text-white font-mono text-xs uppercase">{selectedProject.date}</span>
                </div>
                {/* REMPLACEMENT DU STATUT PAR LA CATÉGORIE */}
                <div className="flex items-center gap-2">
                  <span className="text-cyber font-mono text-xs uppercase opacity-60">Catégorie:</span>
                  <span className="text-zinc-100 font-mono text-xs uppercase tracking-widest">{selectedProject.categorie}</span>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
              
              {/* VISUEL */}
              <div className="w-full md:w-1/2 bg-black/40 flex items-center justify-center p-6 border-r border-white/5 relative">
                <div className="absolute inset-0 bg-cyber opacity-5 blur-3xl"></div>
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.titre} 
                  className="relative z-10 max-w-full max-h-[45vh] object-contain shadow-2xl border border-white/10" 
                />
              </div>

              {/* DÉTAILS */}
              <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-zinc-900/20 flex flex-col gap-8">
                
                <div>
                  <h4 className="text-zinc-500 font-mono text-lg uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                    <span className="text-cyber">⬢</span> Mission_Log
                  </h4>
                  <p className="text-zinc-300 text-base font-mono leading-relaxed border-l-2 border-cyber/30 pl-4">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="p-4 bg-black/40 border border-white/5">
                  <h4 className="text-zinc-500 font-mono text-sm uppercase mb-3 opacity-60">
                    Compétences_Clés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(t => (
                      <span 
                        key={t} 
                        className="text-xs font-mono text-cyber bg-cyber/5 border border-cyber/20 px-3 py-1.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BLOC INFOS COMPLÉMENTAIRES ÉPURÉ */}
                <div className="mt-auto">
                   <div className="border border-white/5 p-4 bg-white/5 text-center">
                    <p className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Système_ID</p>
                    <p className="text-xs text-white font-mono opacity-40 italic">#PRJ-{selectedProject.date}-00{Math.floor(Math.random() * 10)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 bg-black/60 border-t border-white/5">
              <a 
                href={selectedProject.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-full py-4 overflow-hidden transition-all border border-cyber/30 hover:border-cyber"
              >
                <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 bg-cyber opacity-10"></div>
                <span className="relative font-mono text-xs font-bold uppercase tracking-[0.3em] text-cyber">
                  [ Accéder_Au_Dossier_Source ]
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectSection;