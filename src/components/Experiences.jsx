import React from "react";
import Salesforce_dev from "../assets/Experiences/Salesforce_dev.png";
import Wec2017 from "../assets/Experiences/wec2017_1.jpg";
import Mining from "../assets/Experiences/HiveOs_monitoring.png";
import Artisan from "../assets/Experiences/artisan1.jpg";
import RIMA from "../assets/Formations/RIMA.png";

const BlocExperience = ({
  date,
  titre,
  entreprises,
  softSkills,
  details,
  isCurrent,
  // imgSrc,
  //imgAlt,
  //imgCaption,
}) => (
  <div className="relative pl-12 pb-24 group max-w-[85%] mx-auto transition-all duration-500">
    {/* Timeline Line & Node */}
    <div className="absolute left-0 top-3 h-full w-[1px] bg-zinc-800 group-hover:bg-cyber/30 transition-colors duration-500"></div>
    <div
      className={`absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full border transition-all duration-500 ${
        isCurrent
          ? "bg-cyber shadow-[0_0_15px_#4ade80] border-cyber"
          : "bg-zinc-950 border-zinc-700 group-hover:border-cyber"
      }`}
    ></div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-35 items-start p-2">
      {/* COLONNE TEXTE */}
      <div className="md:col-span-12 space-y-5">
        <div>
          <span className="text-cyber/75 font-mono text-base tracking-widest uppercase mb-2 block">
            {date}
          </span>
          <h3 className="text-zinc-100 text-2xl font-bold group-hover:text-cyber transition-colors uppercase tracking-tighter italic">
            {titre}
          </h3>

          {/* ENTREPRISES */}
          <div className="text-zinc-500 text-base font-mono mt-2 flex flex-wrap items-center gap-2">
            <span className="text-cyber/60 font-bold">@</span>
            {entreprises &&
              entreprises.map((ent, index) => (
                <React.Fragment key={index}>
                  <span className="uppercase tracking-widest">{ent}</span>
                  {index < entreprises.length - 1 && (
                    <span className="text-zinc-800 mx-1">|</span>
                  )}
                </React.Fragment>
              ))}
          </div>

          {/* SOFT SKILLS BADGES */}
          <div className="flex flex-wrap gap-2 mt-4">
            {softSkills &&
              softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="text-sm font-mono pl-2 pr-[11px] py-0.5 border border-zinc-800 text-zinc-500 rounded-sm uppercase tracking-tighter group-hover:border-cyber/30 group-hover:text-zinc-300 transition-all"
                >
                  + {skill}
                </span>
              ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="border-l-2 border-zinc-800 group-hover:border-cyber/20 pl-6 py-2 transition-colors">
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light whitespace-pre-line italic">
            {details}
          </p>
        </div>
      </div>

      {/* COLONNE IMAGE
      <div className="md:col-span-6">
        <div className="relative max-w-[450px] mx-auto md:ml-auto">
          <div className="overflow-hidden rounded-sm border border-zinc-800 group-hover:border-cyber/40 transition-all duration-500 shadow-xl">
            <img
              src={imgSrc || "/api/placeholder/400/250"}
              alt={imgAlt}
              className="w-full h-auto object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
          </div>
          <div className="mt-2 text-sm font-mono text-zinc-600 text-right uppercase tracking-tighter transition-all duration-500 group-hover:text-zinc-300">
            <span className="text-cyber/40 group-hover:text-cyber transition-colors duration-500">
              #
            </span>{" "}
            {imgCaption}
          </div>
        </div>
      </div>*/}
    </div>
  </div>
);

const Experiences = () => {
  const experiences = [
    {
      date: "2025 - PRÉSENT",
      titre: "Alternant Développeur Salesforce",
      entreprises: ["ULIT"],
      softSkills: ["Autonomie", "Communication", "Rigueur"],
      isCurrent: true,
      // imgSrc: Salesforce_dev,
      imgAlt: "Salesforce Developer",
      imgCaption: "Salesforce Developer",
      details: `> Conception et déploiement de solutions Full-Stack (Apex & LWC) pour l'automatisation de processus métier.
      > Administration technique pour le monitoring des logs et la gestion des niveaux de debug.
      > Mise en place de standards de qualité logicielle avec tests unitaires systématiques pour sécuriser les déploiements.`,
    },
    {
      date: "2018 - 2022",
      titre: "Sécurisation Blockchain (Minage Crypto)",
      entreprises: ["Indépendant"],
      softSkills: ["Architecture Systèmes", "Sécurité", "Gestion de stratégie"],
      isCurrent: false,
      // imgSrc: Mining,
      imgAlt: "HiveOS RIG Monitoring",
      imgCaption: "Monitoring de fermes GPU (HiveOS)",
      details: `> Conception et assemblage de fermes de minage.
      > Optimisation hardware/software : gestion des performances (overclocking), consommation et refroidissement.
      > Monitoring distant et automatisation des processus de maintenance (Reboot, MAJ...) sur HiveOS.`,
    },
    {
      date: "2018 - 2023",
      titre: "Artisan du bâtiment",
      entreprises: ["Auto-entrepreneur"],
      softSkills: ["Gestion de projet", "Organisation", "Polyvalence"],
      isCurrent: false,
      // imgSrc: Artisan,
      imgAlt: "Maçonnerie",
      imgCaption: "Chantier de rénovation",
      details: `> Gestion de chantiers et relation client/fournisseurs.
      > Travaux de maçonnerie générale (gros oeuvre & second oeuvre).
      > Travaux de terrassement et paysagisme.`,
    },
    {
      date: "2012 - 2017",
      titre: "Technicien Mécanicien",
      entreprises: ["Renault", "G-DRIVE RACING (WEC 2017)", "Wärtsilä"],
      softSkills: ["Réactivité", "Fiabilité", "Travail d'équipe"],
      isCurrent: false,
      // // imgSrc: Wec2017,
      imgAlt: "WEC 2017",
      imgCaption: "G-Drive LMP2 #26 - Monza (ITA) - WEC 2017",
      details: `> Opérateur ravitaillement/pneumatiques en Championnat du Monde d'Endurance (WEC 2017). Gestion de la performance, accuité et de la fatigue en milieu de competition de haut niveau. (G-Drive)
      > Diagnostic, entretiens et réparation automobile. (Renault)
      > Entretiens, contrôles et remise en service de pieces moteurs de bateau et generateur electriques. (Wärtsilä)`,
    },
    {
      date: "2010 - 2012",
      titre: "Combattant de l'Infanterie",
      entreprises: ["2ÈME RIMa"],
      softSkills: ["Résilience", "Discipline", "Capacité de décision"],
      isCurrent: false,
      // // imgSrc: RIMA,
      imgAlt: "2ᵉ RIMa",
      imgCaption: "2ᵉ Régiment d'Infanterie de Marine",
      details: `> Développement d'une rigueur et d'une résilience face au stress et à la fatigue.
      > ravail d'équipe en conditions exigeantes et esprit de cohésion.
      > Stage Commando (CNEC Mont-Louis) : dépassement de soi et autonomie.`,
    },
  ];

  return (
    <section
      id="experiences"
      className="py-32 bg-[#020202] text-white relative overflow-hidden border-y border-cyber/10"
    >
      <div className="mx-auto px-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-20 flex items-center gap-6">
          <span className="text-cyber font-mono text-base opacity-60">03.</span>
          <span className="text-zinc-100 tracking-[0.2em] uppercase font-mono">
            Parcours & Expériences
          </span>
          <div className="h-px bg-cyber/20 flex-1 relative"></div>
        </h2>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <BlocExperience key={index} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default Experiences;
