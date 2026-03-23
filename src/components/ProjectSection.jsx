import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectSection = () => {
const projets = [
  {
    titre: "Smart-Fridge",
    description: "Application de gestion intelligente de stocks alimentaires et suivi des dates de péremption. Projet de chefferie d'équipe.",
    tags: ["React", "Node.js", "Management"],
    lien: "https://github.com/ton-username/Smart-Fridge", // Remplace par tes vrais liens
  },
  {
    titre: "My_Marvin",
    description: "Automatisation complète d'une instance Jenkins via Configuration as Code (JCasC) et Job DSL pour un environnement CI/CD reproductible.",
    tags: ["Groovy", "Jenkins", "DevOps"],
    lien: "https://github.com/ton-username/My_Marvin",
  },
  {
    titre: "POPEYE",
    description: "Orchestration d'une application web distribuée en micro-services isolés utilisant Docker et Docker Compose.",
    tags: ["Docker", "Compose", "Networking"],
    lien: "https://github.com/ton-username/POPEYE",
  },
  {
    titre: "Vaultborn",
    description: "Action-RPG 2D complet avec système de classes, progression de personnage et exploration de mondes interconnectés.",
    tags: ["Java", "GameDev", "OOP"],
    lien: "https://github.com/ton-username/Vaultborn",
  },
  {
    titre: "AI-Voice-Assistant",
    description: "Assistant vocal exploitant Llama 3 (Groq) pour l'intelligence et IBM Watson pour la reconnaissance (STT) et synthèse vocale (TTS).",
    tags: ["Llama 3", "IBM Watson", "AI"],
    lien: "https://github.com/ton-username/AI-Voice-Assistant",
  },
  {
    titre: "LLM-Context-Wrapper",
    description: "Wrapper Python pour Transformers (Hugging Face) avec gestion d'historique d'états et pipeline NLP conversationnel (Blenderbot).",
    tags: ["Python", "HuggingFace", "NLP"],
    lien: "https://github.com/ton-username/LLM-Context-Wrapper",
  },
  {
    titre: "CyberPong",
    description: "Jeu de Pong futuriste intégrant des mécaniques de virus numériques modifiant les effets de jeu en temps réel.",
    tags: ["Python", "Pygame", "GameDesign"],
    lien: "https://github.com/ton-username/CyberPong",
  },
  {
    titre: "Salesforce-Executor",
    description: "Outil d'exécution de scripts et de traçage de logs pour l'écosystème Salesforce.",
    tags: ["JavaScript", "Salesforce", "Automation"],
    lien: "#", // Privé
  },
];

  return (
    <section id="projects" className="py-24 container mx-auto px-6">
      <h2 className="text-xl md:text-2xl font-bold mb-16 flex items-center gap-6 group">
        <span className="text-cyber opacity-40 font-mono text-sm group-hover:opacity-100 transition-opacity">04.</span>
        <span className="text-zinc-100 tracking-widest uppercase font-mono">Repositories_&_Code</span>
        <div className="h-px bg-white/10 flex-1 relative overflow-hidden">
           <div className="absolute inset-0 bg-cyber/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projets.map((p, i) => (
          <ProjectCard key={i} {...p} />
        ))}

        {/* Placeholder futuriste */}
        <div className="border border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center p-8 transition-all duration-300 hover:border-cyber/20 hover:bg-cyber/[0.02] group cursor-help min-h-[220px]">
          <div className="relative">
            <span className="text-white/10 text-4xl font-light group-hover:text-cyber/40 transition-colors">+</span>
            <div className="absolute inset-0 bg-cyber blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20 group-hover:text-cyber/60 mt-4 text-center">
            Awaiting_Data_Stream...
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;