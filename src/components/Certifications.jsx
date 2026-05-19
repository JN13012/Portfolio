import React, { useState, useMemo, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import THM_BG from "../assets/THM.jpg";
import COURSERA_BG from "../assets/COURSERA.png";
import CYBERSECYRITY_101 from "../assets/THM/Cybersecurity_101.jpg";
import THM_SEC0 from "../assets/THM/THM - SEC0.png";
import RESULT_SEC0 from "../assets/THM/Result - SEC0.png";
import Introduction_to_AI from "../assets/Coursera/Introduction_to_Artificial_Intelligence.jpg";
import Generative_AI_Introduction from "../assets/Coursera/Generative_AI_Introduction_and_Applications.jpg";
import Prompt_Engineering from "../assets/Coursera/Generative_AI_Prompt_Engineering_Basics.jpg";
import Software_Engineering from "../assets/Coursera/Introduction_to_Software_Engineering.jpg";
import Intro_HTML_CSS_JavaScript from "../assets/Coursera/Introduction_to_HTML_CSS_JavaScript.jpg";
import Python_Data_Science from "../assets/Coursera/Python_for_Data_Science_AI_Development.jpg";
import Developing_AI_With_Python_Flask from "../assets/Coursera/Developing_AI_Applications_with_Python_and_Flask.jpg";
import Building_Generative_AI_Powered_Applications_with_Python from "../assets/Coursera/Building_Generative_AI_Powered_Applications_with_Python.jpg";
import IBM_AI_Developer from "../assets/Coursera/IBM_AI_Developer.jpg";
import Generative_AI_Elevate_Career from "../assets/Coursera/Generative_AI_Elevate_Career.jpg";
import Software_Career_Guide from "../assets/Coursera/Software_Career_Guide.jpg";
import THM_PreSecurity1 from "../assets/THM/THM_PreSecurity1.png";

const CERTIFICATIONS_PER_PAGE = 8;

const DIFFICULTY_CONFIG = {
  1: { text: "text-green-300", bg: "bg-green-300/90", label: "INTRO" },
  2: { text: "text-green-600", bg: "bg-green-600/90", label: "EASY" },
  3: { text: "text-yellow-300", bg: "bg-yellow-300/90", label: "MEDIUM" },
  4: { text: "text-yellow-600", bg: "bg-yellow-600/90", label: "HARD" },
  5: { text: "text-red-500", bg: "bg-red-500/90", label: "INSANE" },
};

const certifs = [
  {
    titre: "Pre-Security",
    plateforme: "TryHackMe",
    cat: "TryHackMe",
    date: "04/2026",
    image: THM_PreSecurity1,
    url: "https://tryhackme.com/certificate/THM-RHPS6ZUQ2H",
    description:
      "Introduction aux fondamentaux de la cybersécurité : réseaux, systèmes Linux/Windows, architecture web et principes de sécurité offensive/défensive.",
    difficulte: 1,
    stack: [
      "Réseaux",
      "Linux",
      "Windows",
      "Architecture Web",
      "Sécurité Offensive",
      "Sécurité Défensive",
    ],
    duration: "19 Hours",
  },
  {
    titre: "SEC0",
    plateforme: "TryHackMe",
    cat: "TryHackMe",
    date: "05/2026",
    image: THM_SEC0,
    resultImage: RESULT_SEC0,
    url: "https://assets.tryhackme.com/certification-certificate/6a0cbce9a1880079284577a7.pdf",
    description:
      "Examen validant les bases techniques d’entrée en cybersécurité : systèmes, réseaux, web et concepts de sécurité. Elle confirme une compréhension solide des prérequis avant une poursuite du cursus.",
    difficulte: 1,
    isPro: true,
    stack: [
      "Computer Fundamentals",
      "OS Basics",
      "Networking",
      "Web Fundamentals",
      "Security Concepts",
    ],
    duration: "2 Hours",
  },
  {
    titre: "Cyber Security 101",
    plateforme: "TryHackMe",
    cat: "TryHackMe",
    date: "10/2025",
    image: CYBERSECYRITY_101,
    url: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-VEMPGXQSXD.pdf",
    description:
      "Administration Linux/Windows, analyse réseau, cryptographie et exploitation de vulnérabilités web et systèmes, ainsi que principes de réponse à incident, d’analyse forensique et de configuration de firewall et IDS/IPS.",
    difficulte: 3,
    stack: [
      "Nmap",
      "Wireshark",
      "Burp Suite",
      "OWASP Top 10",
      "Metasploit",
      "JohnTheRipper",
      "Hashcat",
      "Hydra",
      "Firewall",
      "IDS/IPS",
      "Forensic",
      "TCP/IP",
      "Linux",
      "Active Directory",
    ],
    duration: "46 Hours",
  },
  {
    titre: "Introduction to AI",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "12/2025",
    image: Introduction_to_AI,
    url: "https://coursera.org/share/466abca0568c44dd7e3d3258a47e99ee",
    description:
      "Introduction des fondamentaux de l’IA générative incluant les notions de machine learning, deep learning, réseaux de neurones, ainsi que ses application à des cas métiers et aux enjeux de gouvernance.",
    difficulte: 1,
    stack: ["GenAI", "Architecture IA", "Gouvernance IA"],
    duration: "12 Hours",
  },
  {
    titre: "Introduction to GenAI",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "12/2025",
    image: Generative_AI_Introduction,
    url: "https://coursera.org/share/7a06aa71ef5a258e81ad1af7c66a6f80",
    description:
      "Introduction aux concepts fondammentaux de l’IA générative. Modèles, outils et cas d’usage dans différents secteurs.",
    difficulte: 1,
    stack: ["GenAI", "LLM", "Prompt Engineering"],
    duration: "8 Hours",
  },
  {
    titre: "Prompt Engineering",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "12/2025",
    image: Prompt_Engineering,
    url: "https://coursera.org/share/3ce0e969ef13867efe203fe6f1bdbf0d",
    description:
      "Introduction aux techniques de prompt engineering pour l’IA générative : structuration de prompts, gestion du contexte et optimisation des réponses.",
    difficulte: 1,
    stack: ["Prompt Patterns", "Gestion du Context", "Workflows IA"],
    duration: "9 Hours",
  },
  {
    titre: "Software Engineering",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "12/2025",
    image: Software_Engineering,
    url: "https://coursera.org/share/1f4b38f67dfcdb136733cd9ec6d77da7",
    description:
      "Introduction aux principes de l'ingénierie logicielle : cycle de vie (SDLC), les architectures et les bases du développement en Python.",
    difficulte: 1,
    stack: ["Python", "SDLC", "Design Patterns", "Git"],
    duration: "14 Hours",
  },
  {
    titre: "Frontend Basics",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "12/2025",
    image: Intro_HTML_CSS_JavaScript,
    url: "https://coursera.org/share/19c6fb4f7b7534c8d92b934ad11dc2f4",
    description:
      "Introduction au développement web : création de pages avec HTML et CSS, développement interactif avec JavaScript.",
    difficulte: 1,
    stack: ["HTML", "CSS", "JavaScript", "DOM", "Responsive"],
    duration: "14 Hours",
  },
  {
    titre: "Python for AI & Data Science",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "12/2025",
    image: Python_Data_Science,
    url: "https://coursera.org/share/12ef6d1161ebabe8bd0bc270f208d8f3",
    description:
      "Développement en Python pour la Data Science : manipulation et traitement de datasets et DataFrames (filtrage, nettoyage, transformation de données). Web scraping, parsing HTML et extraction automatisée de données.",
    difficulte: 3,
    stack: [
      "Python",
      "Pandas",
      "NumPy",
      "Jupyter Notebooks",
      "BeautifulSoup",
      "Requests",
    ],
    duration: "25 Hours",
  },
  {
    titre: "AI Apps with Flask",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "01/2026",
    image: Developing_AI_With_Python_Flask,
    url: "https://coursera.org/share/9e097eac39d7c42bdb4fa1826f485bc5",
    description:
      "Développement d’applications IA, incluant un chatbot conversationnel avec gestion de contexte. Mise en place de pipelines NLP et orchestration backend des modèles IA.",
    difficulte: 3,
    stack: ["Python", "Flask", "REST API", "NLP"],
    duration: "11 Hours",
  },
  {
    titre: "AI Powered Apps",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "03/2026",
    image: Building_Generative_AI_Powered_Applications_with_Python,
    url: "https://www.coursera.org/account/accomplishments/verify/OM4ZXGM73HG4",
    description:
      "Conception d’applications d’IA : assistants IA, transcription STT/TTS, traduction contextuelle, parsing documentaire et analyse sémantique. Mise en place de pipelines RAG et orchestration de modèles d’IA générative.",
    difficulte: 3,
    stack: [
      "Python",
      "Flask",
      "PyTorch",
      "LangChain",
      "LLM",
      "RAG",
      "NLP",
      "STT/TTS",
      "Prompt Engineering",
    ],
    duration: "14 Hours",
  },
  {
    titre: "AI for Developers",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "04/2026",
    image: Generative_AI_Elevate_Career,
    url: "https://www.coursera.org/account/accomplishments/verify/KGTVEZVG1XYB",
    description:
      "Utilisation d’outils d’IA générative pour le développement logiciel : assistance au code, debugging, refactoring tests et automatisation de workflows.",
    difficulte: 1,
    stack: [
      "IA Générative",
      "Agents IA",
      "Architecture Logicielle",
      "Debugging",
      "Tests Unitaires",
      "CI/CD",
    ],
    duration: "25 Hours",
  },
  // {
  //   titre: "Software Developer Career Guide and Interview Preparation",
  //   plateforme: "Coursera (IBM)",
  //   cat: "COURSERA",
  //   date: "04/2026",
  //   image: Software_Career_Guide,
  //   url: "https://www.coursera.org/account/accomplishments/verify/WGEQM8VRU3ER",
  //   description:
  //     "Validation des soft-skills et préparation avancée aux processus de recrutement en ingénierie logicielle. Maîtrise des stratégies de recherche ciblée, préparation aux défis techniques (Live Coding), résolution de problèmes complexes et communication professionnelle pour le déploiement de solutions applicatives.",
  //   difficulte: 1,
  //   stack: [
  //     "Professional Development",
  //     "Software Engineering",
  //     "Technical Interviewing",
  //     "Problem Solving",
  //     "Communication",
  //     "Career Strategy",
  //     "Technical Networking",
  //     "Application Development",
  //   ],
  //   duration: "11 Hours",
  // },
  {
    titre: "AI Developer Professional",
    plateforme: "Coursera (IBM)",
    cat: "COURSERA",
    date: "04/2026",
    image: IBM_AI_Developer,
    url: "https://www.coursera.org/account/accomplishments/professional-cert/NLPNAKCP7EFK",
    description:
      "Cursus orienté développement d’applications IA avec Python, Data Science et IA générative : intégration de LLM et orchestration de modèles IA, pipelines NLP/RAG et manipulation de données.",
    difficulte: 3,
    stack: [
      "AI Engineering",
      "Data Science",
      "Python",
      "Flask",
      "Pandas",
      "NumPy",
      "PyTorch",
      "LangChain",
      "LLM",
      "RAG",
      "NLP",
      "Prompt Engineering",
      "SDLC",
      "Unit Testing",
    ],
    duration: "160 Hours",
    isPro: true,
  },
];

const nodes = [
  {
    id: "TryHackMe",
    label: "Cybersécurité",
    image: THM_BG,
    theme: {
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500/30",
      activeBg: "bg-red-500/10",
      sort: {
        active: "bg-black border-red-500/40 text-red-400",
        indicator: "text-red-400",
        hover: "hover:text-red-300 hover:border-red-400/60",
      },
    },
  },

  {
    id: "COURSERA",
    label: "Intelligence Artificielle",
    image: COURSERA_BG,
    theme: {
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500/30",
      activeBg: "bg-blue-500/10",
      sort: {
        active: "bg-black border-blue-500/40 text-blue-400",
        indicator: "text-blue-400",
        hover: "hover:text-blue-300 hover:border-blue-400/60",
      },
    },
  },
];

const getMonthKey = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return -Infinity;
  const [m, y] = dateStr.split("/").map(Number);
  if (!Number.isFinite(m) || !Number.isFinite(y)) return -Infinity;
  return y * 12 + m;
};

const Certifications = () => {
  const [activeNode, setActiveNode] = useState("TryHackMe");
  const [selectedCert, setSelectedCert] = useState(null);
  const [certImageIndex, setCertImageIndex] = useState(0);
  const [sortBy, setSortBy] = useState("difficulte");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCertImageIndex(0);
  }, [selectedCert]);

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(type);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const sortedCertifs = useMemo(() => {
    let filtered = certifs.filter((c) => c.cat === activeNode);

    const modifier = sortOrder === "desc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      let result = 0;
      if (sortBy === "difficulte") {
        result = b.difficulte - a.difficulte;
        if (result === 0) {
          result = Number(Boolean(b.isPro)) - Number(Boolean(a.isPro));
          if (result === 0) {
            result = getMonthKey(b.date) - getMonthKey(a.date);
          }
        }
      } else if (sortBy === "duration") {
        const getHours = (s) => parseInt(s) || 0;
        result = getHours(b.duration) - getHours(a.duration);
      } else {
        result = getMonthKey(b.date) - getMonthKey(a.date);
      }

      return result * modifier;
    });
  }, [activeNode, sortBy, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedCertifs.length / CERTIFICATIONS_PER_PAGE),
  );
  const paginatedCertifs = sortedCertifs.slice(
    (currentPage - 1) * CERTIFICATIONS_PER_PAGE,
    currentPage * CERTIFICATIONS_PER_PAGE,
  );

  const activeConfig = nodes.find((n) => n.id === activeNode);

  return (
    <section
      id="certifications"
      className="py-24 bg-black/45 text-white relative overflow-hidden border-y border-cyber/10"
    >
      <div className="mx-auto px-2 relative z-10">
        <SectionHeader index="04" title="Certifications" />
        {/* SELECTEUR DE PLATEFORME DE FORMATION */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-start items-start md:items-center">
          <span className="text-base text-zinc-500 font-mono tracking-widest uppercase">
            {">"} Select_Database :
          </span>
          <div className="flex gap-4 w-full md:w-auto">
            {nodes.map((node) => {
              const isActive = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setActiveNode(node.id);
                    setCurrentPage(1);
                  }}
                  className={`relative cursor-pointer px-6 py-3 font-mono text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden flex-1 md:flex-none text-left md:text-center border ${
                    isActive
                      ? `${node.theme.border} ${node.theme.activeBg} text-white`
                      : "border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300 bg-black/50"
                  }`}
                >
                  {isActive && (
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${node.theme.bg} shadow-[0_0_10px_currentColor] ${node.theme.text}`}
                    ></div>
                  )}
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GRILLE */}
        <div className="bg-black/40 border border-white/5 p-6 md:p-10 backdrop-blur-sm min-h-[400px] relative">
          {/* BG Image */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.45]"
            style={{ backgroundImage: `url(${activeConfig.image})` }}
          ></div>

          {/* HEADER DE LA GRILLE */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6 gap-4">
            <h3
              className={`font-mono text-xl md:text-2xl tracking-[0.22em] uppercase ${activeConfig.theme.text}`}
            >
              QUERY_RESULTS: {activeConfig.id}
            </h3>

            {/* CONTROLES DE TRI */}
            <div className="flex items-center gap-5 text-sm font-mono tracking-tight">
              <div className="flex items-center gap-3">
                {["date", "diff", "duration"].map((type) => {
                  const internalKey = type === "diff" ? "difficulte" : type;
                  const isActive = sortBy === internalKey;

                  return (
                    <button
                      key={type}
                      onClick={() => handleSort(internalKey)}
                      className={`group relative cursor-pointer overflow-hidden h-8 min-w-[150px] font-mono text-sm uppercase tracking-tighter transition-all duration-300 border ${
                        isActive
                          ? `bg-black ${activeConfig.theme.sort.active} scale-105`
                          : `bg-black text-zinc-200 border-white/10 hover:text-zinc-300 hover:border-white/30 hover:scale-105`
                      }`}
                    >
                      {/* Halo derrière */}
                      {isActive && (
                        <div
                          className={`absolute -inset-1 blur-xl opacity-40 ${activeConfig.theme.bg} z-0`}
                        />
                      )}

                      {/* Aura de survol interne */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_90%)] transition-opacity" />

                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {/* Indicateur dynamique */}
                        <span
                          className={`mb-1 font-bold transition-all ${
                            isActive
                              ? activeConfig.theme.sort.indicator
                              : "text-zinc-400"
                          }`}
                        >
                          {isActive ? ">" : "::"}
                        </span>

                        <span className="leading-none">
                          {isActive &&
                          (type === "date" ||
                            type === "diff" ||
                            type === "duration")
                            ? `[ ${type} ]`
                            : type}
                        </span>

                        {/* Flèche de tri stable */}
                        <div className="w-2 flex justify-center text-xs">
                          {isActive && (
                            <span className="animate-pulse">
                              {sortOrder === "desc" ? "▼" : "▲"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1 border border-white/5 italic">
                <span className={activeConfig.theme.text}>●</span>
                <span className="text-zinc-400">FOUND:</span>
                <span className="text-white font-mono">
                  {`{ ${sortedCertifs.length} ${sortedCertifs.length > 1 ? "Records" : "Record"} }`}
                </span>
              </div>
            </div>
          </div>

          {/* RENDU DE LA GRILLE */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCertifs.map((c, i) => (
              <div
                key={`${activeNode}-${c.titre}`}
                onClick={() => setSelectedCert(c)}
              >
                <CertifCard
                  {...c}
                  themeColor={activeConfig.theme}
                  index={(currentPage - 1) * CERTIFICATIONS_PER_PAGE + i}
                />
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-6 font-mono uppercase tracking-[0.18em]">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="
        text-cyber/60 hover:text-cyber
        transition-all duration-300
        cursor-pointer
        disabled:opacity-20
        disabled:cursor-not-allowed
      "
            >
              [ PREV ]
            </button>

            <div className="flex items-center gap-4">
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
              relative transition-all duration-300
              cursor-pointer
              ${
                isActive
                  ? "text-cyber text-xl scale-125"
                  : "text-white/25 hover:text-white/70 text-sm"
              }
            `}
                  >
                    {String(page).padStart(2, "0")}

                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-full h-px bg-cyber shadow-[0_0_10px_#4ade80]" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="
        text-cyber/60 hover:text-cyber
        transition-all duration-300
        cursor-pointer
        disabled:opacity-20
        disabled:cursor-not-allowed
      "
            >
              [ NEXT ]
            </button>
          </div>
        )}

        {/* --- MODALE --- */}
        {selectedCert &&
          (() => {
            const Difficulty_Level = DIFFICULTY_CONFIG[
              selectedCert.difficulte
            ] || {
              text: "text-zinc-400",
              bg: "bg-zinc-800",
              label: "N/A",
            };

            return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 bg-black/95 backdrop-blur-xl">
                <div
                  className={`bg-zinc-950 border ${activeConfig.theme.border} w-[95vw] md:w-[85vw] lg:w-[75vw] max-h-[90vh] relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
                >
                  {/* HEADER */}
                  <div className="p-6 text-center relative">
                    <p
                      className={`text-base font-mono tracking-[0.3em] uppercase mb-3 ${activeConfig.theme.text}`}
                    >
                      {selectedCert.plateforme}
                    </p>
                    <h3 className="text-xl md:text-3xl font-bold text-white uppercase font-mono pb-5">
                      {selectedCert.titre}
                    </h3>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="absolute top-6 right-6 text-zinc-300 hover:text-white font-mono text-xl"
                    >
                      [ESC_EXIT]
                    </button>

                    <div className="mt-auto p-4 border-b border-t border-white/10 flex justify-between items-center">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-green-400 font-mono text-base uppercase">
                          Date:
                        </span>
                        <span className="text-white font-mono text-base">
                          {selectedCert.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-mono text-base uppercase">
                          Duration:
                        </span>
                        <span className="text-white font-mono text-base uppercase">
                          {selectedCert.duration || "12 Hours"}
                        </span>
                      </div>

                      {/* --- SECTION DIFFICULTÉ --- */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                          {selectedCert.isPro && (
                            <span className="text-xs font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white from-50% to-zinc-400 to-50% uppercase drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)] select-none">
                              PRO
                            </span>
                          )}

                          <h4
                            className={`font-mono text-sm font-black tracking-widest uppercase ${Difficulty_Level.text} ${
                              selectedCert.difficulte === 5
                                ? "animate-pulse"
                                : ""
                            }`}
                          >
                            {Difficulty_Level.label}
                          </h4>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-5 h-2 ${level <= selectedCert.difficulte ? Difficulty_Level.bg : "bg-zinc-800"}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BODY : 2 COLONNES */}
                  <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                    {/* COLONNE GAUCHE : VISUEL */}
                    <div className="w-full md:w-1/2 bg-transparent flex items-center justify-center p-6 border-r border-white/5">
                      {(() => {
                        const selectedCertImages = selectedCert
                          ? selectedCert.images?.length > 0
                            ? selectedCert.images
                            : [
                                selectedCert.image,
                                ...(selectedCert.resultImage
                                  ? [selectedCert.resultImage]
                                  : []),
                              ]
                          : [];

                        const selectedCertImage =
                          selectedCertImages[certImageIndex] ||
                          selectedCert?.image;

                        return (
                          <div className="relative w-full max-w-[48rem]">
                            {selectedCertImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setCertImageIndex(
                                    (index) =>
                                      (index - 1 + selectedCertImages.length) %
                                      selectedCertImages.length,
                                  )
                                }
                                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-black/55 px-3 py-2 font-mono text-4xl leading-none text-cyber/60 backdrop-blur-sm transition-colors hover:text-cyber"
                                aria-label="Image précédente"
                              >
                                ‹
                              </button>
                            )}

                            <div
                              className="relative group cursor-zoom-in"
                              onClick={() =>
                                window.open(selectedCertImage, "_blank")
                              }
                            >
                              <div
                                className={`absolute inset-0 ${activeConfig.theme.bg} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}
                              ></div>
                              <img
                                src={selectedCertImage}
                                alt={`${selectedCert.titre} screenshot`}
                                className="relative z-10 w-full max-h-[80vh] object-contain shadow-2xl border border-white/10"
                              />
                              <p className="absolute bottom-2 right-2 text-[8px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                CLICK_TO_ENLARGE
                              </p>
                            </div>

                            {selectedCertImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setCertImageIndex(
                                    (index) =>
                                      (index + 1) % selectedCertImages.length,
                                  )
                                }
                                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-black/55 px-3 py-2 font-mono text-4xl leading-none text-cyber/60 backdrop-blur-sm transition-colors hover:text-cyber"
                                aria-label="Image suivante"
                              >
                                ›
                              </button>
                            )}

                            {selectedCertImages.length > 1 && (
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300 border border-white/10">
                                {`${certImageIndex + 1}/${selectedCertImages.length}`}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* COLONNE DROITE : DATA & DETAILS */}
                    <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-zinc-900/20 flex flex-col gap-8">
                      {/* SECTION 1 : DESCRIPTION */}
                      <div>
                        <h4 className="text-zinc-500 font-mono text-lg uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                          <span className={activeConfig.theme.text}>⬢</span>{" "}
                          Certification_Details
                        </h4>
                        <p className="text-zinc-300 text-base font-mono leading-relaxed border-l border-white/20 pl-4">
                          {selectedCert.description}
                        </p>
                      </div>

                      {/* SECTION 2 : TECH STACK */}
                      <div className="p-4 bg-black/40 border border-white/5 mt-15">
                        <h4 className="text-zinc-100 font-mono text-base uppercase mb-3">
                          Technical_Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCert.stack ? (
                            selectedCert.stack.map((tech) => (
                              <span
                                key={tech}
                                className="text-base font-mono text-cyber bg-cyber/5 border border-cyber/20 px-3 py-1.5"
                              >
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-lg font-mono text-zinc-600 italic">
                              Not_Specified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* SECTION 3 : DIFFICULTY & STATUS */}
                    </div>
                  </div>

                  {/* FOOTER : ACTION */}
                  <div className="p-4 bg-black/60 border-t border-white/5">
                    <a
                      href={selectedCert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex items-center justify-center w-full py-4 overflow-hidden transition-all border ${activeConfig.theme.border}`}
                    >
                      <div
                        className={`absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ${activeConfig.theme.bg} opacity-10`}
                      ></div>
                      <span
                        className={`relative font-mono text-base font-bold uppercase tracking-[0.3em] ${activeConfig.theme.text}`}
                      >
                        [ ACCEDER_AU_DIPLOME ]
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

const CertifCard = ({
  titre,
  plateforme,
  date,
  themeColor,
  index,
  difficulte,
  duration,
  isPro,
  stack = [],
}) => {
  const Difficulty_Level = DIFFICULTY_CONFIG[difficulte] || {
    text: "text-zinc-400",
    bg: "bg-zinc-800",
    label: "N/A",
  };
  const visibleStacks = stack.slice(0, 5);
  const hasMoreStacks = stack.length > visibleStacks.length;

  return (
    <div
      className="relative group h-full min-h-[260px] bg-zinc-950/80 border border-white/5 p-5 transition-all duration-500 hover:bg-black overflow-hidden flex flex-col animate-[fadeIn_0.5s_ease-out_forwards] cursor-crosshair hover:shadow-[0_0_5px_rgba(34,211,238,0.6)] transition hover:-translate-y-2 hover:scale-[1.03]"
      style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
    >
      {/* Barre de thème en haut */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${themeColor.bg} opacity-50 group-hover:opacity-100 transition-opacity group-hover:shadow-[0_0_15px_currentColor] ${themeColor.text}`}
      ></div>

      <div className="flex justify-between items-start mb-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 border border-white/40 group-hover:border-white/80 rotate-45 transition-colors"></div>
          <span
            className={`text-sm font-mono tracking-[0.2em] uppercase ${themeColor.text}`}
          >
            {plateforme}{" "}
          </span>
        </div>

        {/* DIFFICULTY LEVEL */}
        <div className="relative flex flex-col items-end gap-2">
          <div className="flex items-center gap-2.5">
            {isPro && (
              <span className="text-[12px] font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white from-50% to-zinc-400 to-50% uppercase drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)] select-none">
                PRO
              </span>
            )}

            <span
              className={`text-[12px] font-mono font-black tracking-widest ${Difficulty_Level.text} ${
                difficulte === 5 ? "animate-pulse" : ""
              }`}
            >
              {Difficulty_Level.label}
            </span>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-4 h-1 ${
                  step <= difficulte ? Difficulty_Level.bg : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <h3 className="min-h-[3.35rem] text-xl md:text-2xl text-zinc-300 font-bold leading-snug group-hover:text-white transition-colors z-10">
        {titre}
      </h3>

      <div className="z-10 mt-5 flex min-h-[4.95rem] max-h-[4.95rem] flex-wrap content-start items-start gap-1.5 overflow-hidden pb-0.5">
        {visibleStacks.map((tech) => (
          <span
            key={tech}
            className="text-base font-mono px-2.5 py-1 bg-black/50 border border-cyber/20 text-zinc-400 group-hover:border-cyber/80 group-hover:text-cyber/80 transition-all"
          >
            {tech}
          </span>
        ))}
        {hasMoreStacks && (
          <span className="border border-cyber/20 bg-black/70 px-2.5 py-1 font-mono text-base text-cyber/80 transition-all group-hover:border-cyber/80">
            ...
          </span>
        )}
      </div>

      <div className="mt-auto flex justify-between items-baseline border-t border-white/5 pt-3 z-10 group-hover:border-white/20 transition-colors">
        {/* LEFT BLOCK */}
        <div className="flex items-center gap-3 font-mono uppercase">
          <span className="bg-cyber/5 px-2.5 py-1 text-sm font-semibold tracking-[0.12em] text-cyber/80 transition-all group-hover:bg-cyber/10 group-hover:text-cyber">
            {duration || "12 Hours"}
          </span>
        </div>

        {/* RIGHT BLOCK */}
        <div className="text-base font-mono font-bold text-white/50 group-hover:text-white/90 transition-colors">
          {date}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
