import React from "react";

const FormationStep = ({
  id,
  diplome,
  ecole,
  date,
  details,
  status,
  percent,
  url,
}) => (
  <div className="relative pl-10 md:pl-16 pb-12 md:pb-16 group">
    {/* Ligne verticale */}
    <div className="absolute left-[19px] md:left-[23px] top-0 h-full w-[2px] md:w-[3px] bg-gradient-to-b from-cyber/60 via-cyber/10 to-transparent group-last:bg-transparent"></div>

    {/* Indicateur d'index */}
    <div className="absolute left-0 top-1 z-10">
      <div
        className={`relative w-10 h-10 flex items-center justify-center border ${
          status === "current"
            ? "border-cyber animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            : "border-zinc-700 opacity-60"
        } bg-black rotate-45 group-hover:rotate-180 transition-all duration-700`}
      >
        <span
          className={`-rotate-45 group-hover:-rotate-180 transition-all duration-700 font-mono text-[10px] md:text-xs font-bold ${
            status === "current" ? "text-cyber" : "text-zinc-500"
          }`}
        >
          {id}
        </span>
      </div>
    </div>

    <div className="font-mono">
      {/* Header */}
      <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-crosshair">
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 mb-2 ml-4 md:ml-6">
          <h3
            className={`text-sm md:text-xl font-bold uppercase tracking-wide transition-colors duration-300 ${
              status === "current"
                ? "text-cyber"
                : "text-zinc-100 group-hover:text-cyber"
            }`}
          >
            {diplome}
          </h3>
          <span className="text-zinc-500 text-[10px] md:text-xl font-medium whitespace-nowrap">
            // {date}
          </span>
        </div>

        <div className="text-zinc-400 text-[10px] md:text-base mb-4 uppercase tracking-[0.2em] ml-4 md:ml-6 font-semibold">
          <span className="opacity-50 text-cyber pr-2">▶</span> {ecole}
        </div>
      </a>

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

      {/* Objectifs de formation */}
      <div className="ml-4 md:ml-6 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyber/40 group-hover:border-cyber transition-colors"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyber/40 group-hover:border-cyber transition-colors"></div>
        <div className="bg-zinc-900/80 border border-white/5 p-4 md:p-6 shadow-inner relative">
          <div className="flex items-center mb-3 border-b border-white/5 pb-2">
            <span className="text-sm md:text-xl text-zinc-600 uppercase tracking-tighter">
              OBJECTIFS DE FORMATION : {status}
            </span>
            <div className="ml-auto flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-cyber/50"></div>
            </div>
          </div>

          <div className="text-xs md:text-base font-mono text-zinc-300 leading-relaxed italic">
            {Array.isArray(details) ? (
              <ul className="space-y-2">
                {details.map((ligne, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-cyber mr-3 font-bold opacity-70">
                      #
                    </span>
                    <span>{ligne}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start">
                <span className="text-cyber mr-3 font-bold opacity-70">#</span>
                <span>{details}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Formations = () => {
  const etudes = [
    {
      id: "01",
      diplome:
        "Master of Science - Architecte Systèmes d'Information (Spé. Cybersécurité) + FAIRE LIEN CLIQUABLE PARTOUT PAS JUSTE DIPLOME",
      url: "https://www.epitech.eu/formation-alternance/master-of-science-cybersecurite/",
      ecole: "EPITECH - MARSEILLE (13)",
      date: "2025 - 2028",
      percent: 20,
      details: [
        "Analyse et gestion des risques, conformité ISO 2700x et RGP",
        "Gestion des accès et infrastructures Cloud sécurisées",
        "Sécurité réseaux et systèmes",
        "Développement sécurisé (DevSecOps)",
        "Opérer des audits et tests d’intrusion (Pentest)",
      ],
      status: "current",
    },
    {
      id: "02",
      diplome: "Préparateur et Développeur de Véhicules de Compétition",
      url: "https://www.ecoleperformance.com/",
      ecole: "École de la Performance - NOGARO (32)",
      date: "2016 - 2017",
      percent: 100,
      details:
        "Formation Bac+2 préparant aux métiers de technicien dans le sport automobile.",
      status: "completed",
    },
    {
      id: "03",
      diplome: "BTS Moteurs à Combustion Interne",
      url: "https://claveille.org/bts/",
      ecole: "Lycée Albert Claveille - Périgueux (24)",
      date: "2011 - 2013",
      percent: 100,
      details:
        "Enseignements en développement moteur, thermodynamique et construction mécanique.",
      status: "completed",
    },
  ];

  return (
    <section id="formations" className="py-20 relative px-4 md:px-0">
      <div className="w-full mb-20">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-6">
          <span className="text-cyber font-mono text-base opacity-60">02.</span>
          <span className="text-zinc-100 tracking-widest uppercase font-mono">
            Formations
          </span>
          <div className="h-px bg-cyber/20 flex-1"></div>
        </h2>
      </div>

      <div className="max-w-screen-xl mx-auto">
        {etudes.map((item, index) => (
          <FormationStep key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default Formations;
