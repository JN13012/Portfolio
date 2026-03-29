import React, { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import Smartfridge from "../assets/Projets/Smartfridge.png";
import Cyberpong from "../assets/Projets/Cyberpong.png";
import My_marvin from "../assets/Projets/My_marvin.png";
import Popeye from "../assets/Projets/Popeye.png";
import Vaultborn from "../assets/Projets/Vaultborn.png";
import Vocal_assistant_AI from "../assets/Projets/Vocal_assistant_AI.png";
import LLM_Context_Wrapper from "../assets/Projets/LLM-Context-Wrapper.png";
import Unit_converter from "../assets/Projets/Unit_converter.png";
import Business_AI_Meeting from "../assets/Projets/Business_AI_Meeting_Companion_STT.jpg";
import RAG_pdf_Chatbot from "../assets/Projets/RAG_PDF_Chatbot.jpg";
import AI_Assistant_Translator from "../assets/Projets/AI_Assistant_Translator.jpg";

const categoryColors = {
  IA: "text-purple-400 border-purple-500/30 bg-purple-500/5",
  DevOps: "text-blue-400 border-blue-500/30 bg-blue-500/5",
  "Software Engineering":
    "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  "Gestion de Projet": "text-amber-400 border-amber-500/30 bg-amber-500/5",
};

const projets = [
  {
    titre: "AI_Assistant_Translator",
    description:
      "Solution de traduction vocale universelle pilotée par l'architecture LPU de Groq. Le système orchestre Llama 3.3 pour le raffinement contextuel des traductions, couplé aux services IBM Watson pour la transcription (STT) et la synthèse vocale (TTS).",
    tags: [
      "Python",
      "Flask",
      "Groq",
      "Llama 3.3",
      "IBM Watson",
      "NLP",
      "STT/TTS",
      "JavaScript",
    ],
    lien: "https://github.com/JN13012/AI-Assistant-Translator",
    image: AI_Assistant_Translator,
    date: "03/2026",
    categorie: "IA",
    complexity: 3,
  },
  {
    titre: "RAG_pdf_Chatbot",
    description:
      "Assistant IA d'analyse de CV exploitant l'architecture RAG (Retrieval-Augmented Generation). Le système segmente les PDF, génère des embeddings sémantiques stockés via FAISS et interroge Llama 3 pour identifier les avantages et axes d'amélioration de chaque profil.",
    tags: [
      "Python",
      "Flask",
      "LLM",
      "NLP",
      "LangChain",
      "RAG",
      "FAISS",
      "Llama 3",
      "IBM Watsonx",
    ],
    lien: "https://github.com/JN13012/RAG-pdf-Chatbot",
    image: RAG_pdf_Chatbot,
    date: "03/2026",
    categorie: "IA",
    complexity: 3,
  },

  {
    titre: "Business_AI_Companion_STT",
    description:
      "Application de transcription STT et d'analyse IA exploitant Whisper (OpenAI) et Granite (IBM) via un pipeline LangChain. L'outil segmente l'audio pour un traitement GPU par lots (CUDA) afin de générer des  résumés, des plans d'action et une analyse de la tonalité.",
    tags: [
      "Python",
      "PyTorch",
      "LLM",
      "NLP",
      "LangChain",
      "IBM WatsonX",
      "Whisper",
      "CUDA",
    ],
    lien: "https://github.com/JN13012/Business_AI_Meeting_Companion_STT",
    image: Business_AI_Meeting,
    date: "03/2026",
    categorie: "IA",
    complexity: 3,
  },
  {
    titre: "Smart_Fridge",
    description:
      "Pilotage complet d'une phase de conception : de l'analyse de marché (SWOT/PESTEL) à la planification opérationnelle. Inclut la définition des personas (Client/Équipe), la cartographie des risques (RiskMap/KPI) et la structuration budgétaire via diagrammes de Gantt.",
    tags: [
      "Management",
      "Stratégie",
      "Gestion de Budget",
      "Analyse de Risques",
      "Gantt",
      "KPI",
    ],
    lien: "https://github.com/ton-username/Smart-Fridge",
    image: Smartfridge,
    date: "12/2025",
    categorie: "Gestion de Projet",
    complexity: 3,
  },
  {
    titre: "My_Marvin",
    description:
      "Déploiement d'une instance Jenkins conteneurisée (Docker) et configurée entièrement par code (JCasC). Utilisation de scripts Groovy et Job DSL pour automatiser la génération de pipelines CI/CD reproductibles.",
    tags: ["Docker", "Jenkins", "Groovy", "JCasC"],
    lien: "https://github.com/ton-username/My_Marvin",
    image: My_marvin,
    date: "11/2025",
    categorie: "DevOps",
    complexity: 3,
  },
  {
    titre: "POPEYE",
    description:
      "Orchestration d'une application web distribuée en micro-services isolés utilisant Docker et Docker Compose.",
    tags: ["Docker", "Compose"],
    lien: "https://github.com/ton-username/POPEYE",
    image: Popeye,
    date: "11/2025",
    categorie: "DevOps",
    complexity: 3,
  },
  {
    titre: "Vaultborn",
    description:
      "Jeux Action-RPG 2D en Java mettant en œuvre les piliers de la POO (Héritage, Polymorphisme) et des Design Patterns (Factory). Système de combat en temps réel, gestion d'inventaire/équipements lootables, progression d'expérience dans différents univers.",
    tags: ["Java", "LibGDX", "POO"],
    lien: "https://github.com/ton-username/Vaultborn",
    image: Vaultborn,
    date: "10/2025",
    categorie: "Software Engineering",
    complexity: 3,
  },
  {
    titre: "AI_Voice_Assistant",
    description:
      "Pipeline complet d'assistant vocal orchestrant Llama 3 (via Groq) pour le raisonnement, couplé aux services IBM Watson pour la reconnaissance (STT) et synthèse vocale (TTS). Interface de gestion développée sous Flask.",
    tags: ["Python", "Flask", "NLP", "LLM", "Llama 3", "IBM Watson"],
    lien: "https://github.com/ton-username/AI-Voice-Assistant",
    image: Vocal_assistant_AI,
    date: "03/2026",
    categorie: "IA",
    complexity: 3,
  },
  {
    titre: "LLM_Context_Wrapper",
    description:
      "Interface Python (Wrapper) optimisant l'usage de la bibliothèque Transformers (Hugging Face). Développement d'un système de gestion d'historique d'états pour maintenir le contexte conversationnel du modèle Blenderbot.",
    tags: ["Python", "PyTorch", "Transformers", "NLP", "LLM", "Hugging_Face"],
    lien: "https://github.com/ton-username/LLM-Context-Wrapper",
    image: LLM_Context_Wrapper,
    date: "03/2026",
    categorie: "IA",
    complexity: 3,
  },
  {
    titre: "CyberPong",
    description:
      "Action-Game en Python simulant une intrusion système via des mécaniques de jeu. Inclut une gestion dynamique de 'virus' (debuffs) modifiant la physique en temps réel (trajectoires, obstacles, effets visuels) avec une introduction scénarisée en piratage informatique.",
    tags: ["Python", "Pygame", "Turtle"],
    lien: "https://github.com/ton-username/CyberPong",
    image: Cyberpong,
    date: "09/2025",
    categorie: "Software Engineering",
    complexity: 3,
  },
  {
    titre: "Salesforce_Executor",
    description:
      "Outil d'exécution de scripts et de traçage de logs pour l'écosystème Salesforce.",
    tags: [
      "JavaScript",
      "Java",
      "Apex",
      "HTML",
      "XML",
      "Testing",
      "Salesforce",
    ],
    lien: "#",
    date: "2024",
    categorie: "Software Engineering",
    complexity: 3,
  },
  {
    titre: "Unit_Converter",
    description:
      "Convertisseur universel d'unités : Masses, Longeurs, Temps, Volumes, Surfaces, Vitesses, Stockage",
    tags: ["Python", "Algorithmie", "GUI"],
    lien: "https://github.com/JN13012/Unit_converter",
    image: Unit_converter,
    date: "08/2025",
    categorie: "Software Engineering",
    complexity: 3,
  },
];

const ProjectSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("desc");

  const ordrePriorite = [
    "Tous",
    "DevOps",
    "IA",
    "Software Engineering",
    "Gestion de Projet",
  ];

  const categoriesExistantes = [...new Set(projets.map((p) => p.categorie))];

  const categories = [
    "Tous",
    ...categoriesExistantes.sort((a, b) => {
      return ordrePriorite.indexOf(a) - ordrePriorite.indexOf(b);
    }),
  ];

  const filteredAndSorted = useMemo(() => {
    let result =
      activeFilter === "Tous"
        ? [...projets]
        : projets.filter((p) => p.categorie === activeFilter);

    return result.sort((a, b) => {
      const parseDate = (d) => {
        const parts = d.split("/");
        return parts.length === 2
          ? new Date(parts[1], parts[0] - 1)
          : new Date(parts[0], 0);
      };
      const diff = parseDate(b.date) - parseDate(a.date);
      return sortOrder === "desc" ? diff : -diff;
    });
  }, [activeFilter, sortOrder]);

  return (
    <section
      id="projects"
      className="py-32 bg-[#020202] text-white relative overflow-hidden border-y border-cyber/10"
    >
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

      {/* --- 1. BARRE DE FILTRES ET TRI --- */}
      <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-all border ${
                activeFilter === cat
                  ? "bg-cyber text-black border-cyber shadow-[0_0_15px_rgba(var(--cyber-rgb),0.4)]"
                  : "text-cyber/90 border-white/10 hover:border-cyber/50 hover:text-white"
              }`}
            >
              {`[ ${cat} ]`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="font-mono text-xs text-cyber/90 hover:text-cyber transition-colors flex items-center gap-2 uppercase"
        >
          <span>
            {sortOrder === "desc" ? "SORT: Plus récent" : "SORT: Plus ancien"}
          </span>
          <span className="text-sm">{sortOrder === "desc" ? "▼" : "▲"}</span>
        </button>
      </div>

      {/* 2. GRILLE DE PROJETS */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSorted.map((p) => (
            <ProjectCard
              key={p.titre}
              {...p}
              onClick={() => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>

      {/* MODALE */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-zinc-950 border border-white/10 w-[95vw] md:w-[85vw] lg:w-[75vw] h-[90vh] relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* HEADER MODALE */}
            <div className="p-6 text-center relative">
              <p className="text-base font-mono tracking-[0.3em] uppercase mb-3 text-cyber opacity-80">
                PROJECT_OVERVIEW
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
                  <span className="text-cyber font-mono text-base uppercase">
                    DATE:
                  </span>
                  <span className="text-white font-mono text-base uppercase">
                    {selectedProject.date}
                  </span>
                </div>
                {/* CATEGORIE */}
                <div className="flex items-center gap-2">
                  <span className="text-cyber font-mono text-base uppercase">
                    Catégorie:
                  </span>
                  <span className="text-zinc-100 font-mono text-base uppercase tracking-widest">
                    {selectedProject.categorie}
                  </span>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
              {/* VISUEL */}
              <div className="w-full md:w-1/2 bg-black/40 flex items-center justify-center p-6 border-r border-white/5 relative">
                <div className="absolute inset-0 bg-cyber opacity-10 blur-3xl"></div>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.titre}
                  className="relative z-10 max-w-full max-h-[45vh] object-contain shadow-2xl border border-white/10"
                />
              </div>

              {/* DÉTAILS */}
              <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-zinc-900/20 flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h4 className="text-zinc-100 font-mono text-lg uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="text-cyber">⬢</span> DESCRIPTION
                  </h4>
                  <p className="text-zinc-200 text-base font-mono leading-relaxed border-l-2 border-cyber/30 pl-4">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 mt-15">
                  <h4 className="text-zinc-100 font-mono text-base uppercase mb-3">
                    Expertise Technique
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="text-base font-mono text-cyber bg-cyber/5 border border-cyber/20 px-3 py-1.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LINK FOOTER */}
            <a
              href={selectedProject.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-full py-4 overflow-hidden border border-cyber/20 bg-cyber/5 hover:border-cyber transition-all duration-300"
            >
              {/* Barre de scan */}
              <div className="absolute inset-0 w-[20%] h-full bg-cyber/20 skew-x-[45deg] -translate-x-[150%] group-hover:translate-x-[600%] transition-transform duration-1000 ease-in-out"></div>

              <span className="relative font-mono text-base font-bold uppercase tracking-[0.2em] text-cyber flex items-center gap-3">
                <span className="opacity-50">--</span>[
                VOIR_LE_PROJET_SUR_GITHUB ]
                <span className="opacity-50">--</span>
              </span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectSection;
