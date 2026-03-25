import React from "react";
import Epitech from "../assets/Formations/Epitech.png";
import EcoleDeLaPerformance from "../assets/Formations/ECOLE-PERFORMANCE-10.jpg";
import bts from "../assets/Formations/Bts.png";

const FormationStep = ({
  id,
  diplome,
  ecole,
  date,
  details,
  status,
  percent,
  url,
  imgSrc,
}) => (
  <div className="relative pl-10 md:pl-16 pb-10 md:pb-14 group">
    {/* Ligne verticale */}
    <div className="absolute left-[19px] md:left-[23px] top-0 h-full w-[2px] bg-zinc-800 group-last:bg-transparent">
      <div
        className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyber via-cyber/40 to-transparent transition-opacity duration-500 ${
          status === "current"
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>

    {/* Losange index haute visibilité */}
    <div className="absolute left-0 top-1 z-20">
      <div
        className={`relative w-10 h-10 flex items-center justify-center border-2 transition-all duration-700 ease-in-out bg-zinc-900 rotate-45 group-hover:rotate-[225deg] ${
          status === "current"
            ? "border-cyber shadow-[0_0_20px_rgba(74,222,128,0.4)]"
            : "border-zinc-500 group-hover:border-cyber group-hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]"
        }`}
      >
        <span
          className={`-rotate-45 group-hover:-rotate-[225deg] transition-all duration-700 font-mono text-xs md:text-sm font-black ${
            status === "current"
              ? "text-cyber"
              : "text-white group-hover:text-cyber"
          }`}
        >
          {id}
        </span>
      </div>
    </div>

    {/* Bloc cliquable */}
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block font-mono cursor-crosshair group/item p-4 md:p-6 -m-4 md:-m-6 rounded-xl transition-all duration-500 hover:bg-zinc-900/30 border border-transparent hover:border-white/5"
    >
      {/* Grid : texte 9/12 + image 3/12 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ── Colonne texte (9/12) ── */}
        <div className="md:col-span-9">
          {/* Diplôme & date */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 mb-1 ml-4 md:ml-6">
            <h3
              className={`text-sm md:text-lg font-bold uppercase tracking-wide leading-tight transition-colors duration-300 ${
                status === "current"
                  ? "text-cyber"
                  : "text-zinc-100 group-hover/item:text-cyber"
              }`}
            >
              {diplome}
            </h3>
            <span className="text-zinc-500 text-[10px] md:text-sm font-medium whitespace-nowrap shrink-0">
              // {date}
            </span>
          </div>

          {/* École */}
        <div className="text-zinc-400 text-[10px] md:text-base mb-4 uppercase tracking-[0.2em] ml-4 md:ml-6 font-semibold">
          <span className="opacity-50 text-cyber pr-2">▶</span> {ecole}
        </div>

          {/* Barre de progression */}
      <div className="md:ml-6 mb-6 max-w-xl">
        <div className="flex justify-between items-end mb-1 text-xs md:text-lg font-bold uppercase tracking-widest">
          <span
            className={
              status === "current"
                ? "text-cyber animate-pulse"
                : "text-zinc-600"
            }
          >
            {status === "current" ? "Loading ..." : "Archive_Loaded"}
          </span>
          <span className="text-zinc-400">{percent}%</span>
        </div>

        <div className="h-[4px] w-full bg-zinc-900 border border-white/5 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-[2000ms] ease-out ${
              status === "current"
                ? "bg-cyber shadow-[0_0_10px_#4ade80]"
                : "bg-zinc-600"
            }`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

          {/* Bloc objectifs */}
          <div className="ml-4 md:ml-6 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyber/40 group-hover/item:border-cyber transition-colors" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyber/40 group-hover/item:border-cyber transition-colors" />
            <div className="bg-zinc-900/80 border border-white/5 p-3 md:p-4 shadow-inner group-hover/item:bg-zinc-900 transition-colors">
              <div className="flex items-center mb-2 border-b border-white/5 pb-2">
                <span className="text-sm md:text-lg text-emerald-500 uppercase tracking-tighter">
                  OBJECTIFS DE FORMATION : {status}
                </span>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                  <div className="w-2 h-2 rounded-full bg-cyber/50" />
                </div>
              </div>
              <div className="text-[11px] md:text-sm font-mono text-zinc-300 leading-relaxed italic">
                {Array.isArray(details) ? (
                  <ul className="space-y-1.5">
                    {details.map((ligne, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-cyber mr-2 font-bold opacity-70 shrink-0">
                          #
                        </span>
                        <span>{ligne}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-start">
                    <span className="text-cyber mr-2 font-bold opacity-70 shrink-0">
                      #
                    </span>
                    <span>{details}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Colonne image  ── */}
        <div className="md:col-span-3 hidden sm:flex items-start justify-center pt-1">
          <div
            className="relative w-full group/photo overflow-hidden border border-zinc-800 group-hover/item:border-cyber/40 transition-all duration-500 shadow-xl"
            style={{ aspectRatio: "1/1" }}
          >
            <img
              src={imgSrc || "/api/placeholder/300/300"}
              alt={diplome}
              className="w-full h-full object-cover grayscale opacity-35 group-hover/item:grayscale-0 group-hover/item:opacity-90 group-hover/item:scale-105 transition-all duration-700"
            />

            {/* Overlay cyber */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badge status en bas de l'image */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between">
              <span
                className={`text-[8px] font-mono uppercase tracking-widest ${
                  status === "current" ? "text-cyber" : "text-zinc-500"
                }`}
              >
                {status === "current" ? "● ACTUEL" : "✓ TERMINÉ"}
              </span>
              <span className="text-[8px] font-mono text-zinc-600 tracking-wider">
                {date}
              </span>
            </div>

            {/* Coin décoratif */}
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-cyber/40 group-hover/item:border-cyber transition-colors" />
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-cyber/40 group-hover/item:border-cyber transition-colors" />
          </div>
        </div>
      </div>
    </a>
  </div>
);

const Formations = () => {
  const etudes = [
    {
      id: "01",
      diplome:
        "Master of Science — Architecte Systèmes d'Information (Spé. Cybersécurité)",
      url: "https://www.epitech.eu/formation-alternance/master-of-science-cybersecurite/",
      ecole: "EPITECH — MARSEILLE (13)",
      date: "2025 – 2028",
      percent: 20,
      details: [
        "Analyse et gestion des risques, conformité ISO 2700x et RGPD",
        "Gestion des accès et infrastructures Cloud sécurisées",
        "Sécurité réseaux et systèmes",
        "Développement sécurisé (DevSecOps)",
        "Audits et tests d'intrusion (Pentest)",
      ],
      status: "current",
      imgSrc: Epitech,
    },
    {
      id: "02",
      diplome: "Préparateur et Développeur de Véhicules de Compétition",
      url: "https://www.ecoleperformance.com/",
      ecole: "École de la Performance — NOGARO (32)",
      date: "2016 – 2017",
      percent: 100,
      details:
        "Formation Bac+2 préparant aux métiers de technicien dans le sport automobile.",
      status: "completed",
      imgSrc: EcoleDeLaPerformance,
    },
    {
      id: "03",
      diplome: "BTS Moteurs à Combustion Interne",
      url: "https://claveille.org/bts/",
      ecole: "Lycée Albert Claveille — Périgueux (24)",
      date: "2011 – 2013",
      percent: 100,
      details:
        "Enseignements en développement moteur, dépollution thermodynamique et construction mécanique.",
      status: "completed",
      imgSrc: bts,
    },
  ];

  return (
    <section id="formations" className="py-32 bg-[#020202] text-white relative overflow-hidden border-y border-cyber/10">
      <div className="mx-auto px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-20 flex items-center gap-6">
          <span className="text-cyber font-mono text-base opacity-60">02.</span>
          <span className="text-zinc-100 tracking-[0.2em] uppercase font-mono">
            Formations
          </span>
          <div className="h-px bg-cyber/20 flex-1" />
        </h2>
      </div>

      <div className="max-w-screen-2xl mx-auto">
        {etudes.map((item, index) => (
          <FormationStep key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default Formations;
