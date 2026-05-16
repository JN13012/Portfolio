import React from "react";
import SectionHeader from "./SectionHeader";
import Epitech from "../assets/Formations/Epitech.png";
import EcoleDeLaPerformance from "../assets/Formations/ECOLE-PERFORMANCE-10.jpg";
//import bts from "../assets/Formations/Bts.png";

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
  <div className="relative pl-14 md:pl-16 pb-12 md:pb-16 group">
    {/* Ligne verticale */}
    <div className="absolute left-5 top-10 h-full w-px -translate-x-1/2 bg-zinc-800 group-last:bg-transparent">
      <div
        className={`absolute left-0 top-0 h-full w-full bg-gradient-to-b from-cyber via-cyber/40 to-transparent transition-opacity duration-500 ${
          status === "current"
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>

    {/* Losange index haute visibilité */}
    <div className="absolute left-5 top-10 z-20 -translate-x-1/2 -translate-y-1/2">
      <div
        className={`relative flex h-10 w-10 rotate-45 items-center justify-center border-2 bg-zinc-900 transition-all duration-700 ease-in-out group-hover:rotate-[225deg] ${
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
      className="block font-mono cursor-pointer group/item p-4 md:p-6 -m-4 md:-m-6 transition-all duration-500"
    >
      {/* Grid : texte 9/12 + image 3/12 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-stretch border border-white/10 bg-black/35 p-5 md:p-6 backdrop-blur-sm transition-all duration-500 hover:border-cyber/30 hover:bg-black/45 hover:shadow-[0_0_24px_rgba(74,222,128,0.07)]">
        {/* ── Colonne texte (9/12) ── */}
        <div className="md:col-span-9">
          {/* Diplôme & date */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 mb-2">
            <h3
              className={`text-2xl md:text-3xl font-bold uppercase tracking-wide leading-tight transition-colors duration-300 ${
                status === "current"
                  ? "text-cyber"
                  : "text-zinc-100 group-hover/item:text-cyber"
              }`}
            >
              {diplome}
            </h3>
            <span className="text-zinc-400 text-xs md:text-sm font-medium whitespace-nowrap shrink-0">
              // {date}
            </span>
          </div>

          {/* École */}
          <div className="mb-5 inline-flex items-center bg-cyber/5 px-3 py-1.5 text-base md:text-lg font-semibold uppercase tracking-[0.18em] text-zinc-100 transition-all duration-300 group-hover/item:border-cyber group-hover/item:bg-cyber/10">
            <span className="pr-2 text-cyber/80">▶</span> {ecole}
          </div>

          {/* Barre de progression */}

          {/* Bloc objectifs */}
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyber/40 group-hover/item:border-cyber transition-colors" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyber/40 group-hover/item:border-cyber transition-colors" />
            <div className="bg-zinc-950/70 border border-white/10 p-4 md:p-5 shadow-inner group-hover/item:bg-zinc-950/90 transition-colors">
              <div className="flex items-center mb-2 border-b border-white/5 pb-2">
                <span className="text-sm md:text-base text-emerald-500 uppercase tracking-tighter">
                  OBJECTIFS DE FORMATION
                </span>
                <div className="ml-auto flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                  <div className="w-2 h-2 rounded-full bg-cyber/50" />
                </div>
              </div>
              <div className="text-sm md:text-base font-mono text-zinc-300 leading-relaxed italic">
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
        <div className="md:col-span-3 hidden sm:flex items-stretch justify-center">
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
        "Architecture systèmes et réseaux",
        "Ingénierie logicielle",
        "DevSecOps et cloud",
        "Sécurité réseau : firewall, segmentation, VPN, IDS/IPS",
        "Audits et tests d'intrusion (Pentest)",
        "Analyse et gestion des risques, conformité ISO 2700x et RGPD",
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
        "Formation Bac+2 préparant aux métiers de technicien motoriste dans le sport automobile.",
      status: "completed",
      imgSrc: EcoleDeLaPerformance,
    },
    // {
    //   id: "03",
    //   diplome: "BTS Moteurs à Combustion Interne",
    //   url: "https://claveille.org/bts/",
    //   ecole: "Lycée Albert Claveille — Périgueux (24)",
    //   date: "2011 – 2013",
    //   percent: 100,
    //   details:
    //     "Enseignements en développement moteur, dépollution thermodynamique et construction mécanique.",
    //   status: "completed",
    //   imgSrc: bts,
    // },
  ];

  return (
    <section
      id="formations"
      className="py-24 bg-black/45 text-white relative overflow-hidden border-y border-cyber/10"
    >
      <div className="mx-auto px-2 relative z-10">
        <SectionHeader index="03" title="Formation" />

        <div className="max-w-screen-2xl mx-auto">
          {etudes.map((item, index) => (
            <FormationStep key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Formations;
