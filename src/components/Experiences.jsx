import React from "react";
import SectionHeader from "./SectionHeader";

import Salesforce_dev from "../assets/Experiences/Salesforce_dev.png";
import Wec2017 from "../assets/Experiences/wec2017_1.jpg";
import Mining from "../assets/Experiences/HiveOs_monitoring.png";
import RIMA from "../assets/Formations/RIMA.png";

const BlocExperience = ({
  date,
  titre,
  entreprises,
  tags,
  details,
  isCurrent,
  imgSrc,
  imgAlt,
  imgCaption,
}) => (
  <div className="relative mx-auto max-w-[1500px] pb-16 pl-10 group">
    {/* TIMELINE */}
    <div className="absolute left-0 top-3 h-full w-px bg-white/10 group-hover:bg-cyber/30 transition-colors duration-500" />

    <div
      className={`absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border transition-all duration-500 ${
        isCurrent
          ? "border-cyber bg-cyber shadow-[0_0_15px_#4ade80]"
          : "border-zinc-700 bg-black group-hover:border-cyber"
      }`}
    />

    {/* CARD */}
    <div
      className="
        grid grid-cols-1 md:grid-cols-12 gap-8 items-center
        border border-white/10
        bg-black/30 backdrop-blur-sm
        p-6 md:p-8
        transition-all duration-500
        hover:border-cyber/30
        hover:bg-black/40
        hover:shadow-[0_0_25px_rgba(74,222,128,0.08)]
      "
    >
      {/* TEXTE */}
      <div className="md:col-span-7 lg:col-span-8 space-y-5">
        <div>
          {/* META */}
          <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-base uppercase tracking-[0.18em]">
            <span className="text-cyber">{date}</span>

            <span className="text-zinc-600">@</span>

            {entreprises?.map((ent, index) => (
              <React.Fragment key={ent}>
                <span className="text-white/80">{ent}</span>

                {index < entreprises.length - 1 && (
                  <span className="text-zinc-700">/</span>
                )}
              </React.Fragment>
            ))}

            {isCurrent && (
              <span className="ml-2 border border-green-400/30 bg-green-400/10 px-2 py-0.5 text-[10px] text-green-400">
                EN COURS
              </span>
            )}
          </div>

          {/* TITRE */}
          <h3 className="text-2xl md:text-3xl font-bold uppercase italic tracking-tight text-zinc-100 transition-colors group-hover:text-cyber">
            {titre}
          </h3>

          {/* TAGS */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="
                  border border-white/10 bg-white/[0.03]
                  px-3 py-1
                  font-mono text-[12px]
                  uppercase tracking-[0.14em]
                  text-zinc-400
                  transition-all duration-300
                  group-hover:border-cyber/30
                  group-hover:bg-cyber/5
                  group-hover:text-zinc-100
                "
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="border-l border-white/10 pl-5 transition-colors group-hover:border-cyber/30">
          <p className="whitespace-pre-line text-sm md:text-base leading-relaxed text-zinc-300">
            {details}
          </p>
        </div>
      </div>

      {/* IMAGE */}
      <div className="md:col-span-5 lg:col-span-4">
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
      </div>
    </div>
  </div>
);

const Experiences = () => {
  const experiences = [
    {
      date: "6 mois",
      titre: "Alternant Développeur Salesforce",
      entreprises: ["ULIT"],
      tags: ["FullStack", "Autonomie", "Adaptabilité", "Communication"],
      isCurrent: true,
      imgSrc: Salesforce_dev,
      imgAlt: "Salesforce Developer",
      imgCaption: "Salesforce Developer",
      details: `> Développement de composants Salesforce en Apex et JavaScript, incluant interfaces utilisateurs, logique métier.
       > Conception d'un éditeur de scripts interne permettant l'exécution, la planification, l'enchaînement de scripts, la gestion des logs et les sauvegardes.
> Mise en place de tests unitaires.
> Travail en autonomie sur des problématiques de tooling, d'automatisation et d'intégration dans un environnement professionnel.
       `,
       
    },

    {
      date: "2018 - Aujourd'hui",
      titre: "Entrepreneur Blockchain",
      entreprises: ["Indépendant"],
      tags: [
        "Blockchain",
        "Mining",
        "HiveOS",
        "Braiins OS",
        "Linux",
        "Hardware",
        "Monitoring",
        "Tunning",
        "MEV",
      ],
      isCurrent: true,
      imgSrc: Mining,
      imgAlt: "HiveOS RIG Monitoring",
      imgCaption: "Exploitation et monitoring blockchain",
      details: `> Conception, assemblage et exploitation de fermes de minage.
> Optimisation performances, consommation et refroidissement via overclocking, undervolting et tuning.
> Administration et monitoring des infrastructures via HiveOS, Braiins OS, Linux et Windows.
> Automatisation : gestion des erreurs, mises à jour, redémarrages.
> Maintenance matérielle : diagnostic des pannes, remplacement de composants, pads thermiques, ventilateurs...
> Analyse de rentabilité, suivi des marchés et optimisation des stratégies, incluant Maximum Extractable Value et Flashbots.
> Veille technologique et financière.`,
    },

    {
      date: "5 ans",
      titre: "Technicien Mécanique - Compétition & Maintenance",
      entreprises: ["Renault", "G-Drive Racing", "Wärtsilä"],
      tags: [
        "Sport Automobile",
        "LMP2",
        "Diagnostic",
        "Maintenance",
        "Fiabilité",
      ],
      isCurrent: false,
      imgSrc: Wec2017,
      imgAlt: "WEC 2017",
      imgCaption: "G-Drive LMP2 #26 - ENTRAÎNEMENT WEC 2017",
      details: `> Participation au Championnat du Monde d'Endurance 2017 avec G-Drive Racing, incluant les 24 Heures du Mans.
> Responsable des pneumatiques sur prototypes LMP2 : contrôle des pressions, préchauffage, préparation et acheminement des trains lors des arrêts aux stands.
> Participation aux opérations de ravitaillement en carburant et coordination avec les mécaniciens et ingénieurs pour optimiser les pit-stops.
> Diagnostic, entretien et réparation automobile chez Renault : recherche de pannes, interventions mécaniques courantes.
> Contrôle, maintenance et remise en service de pièces moteurs marins et groupes électrogènes chez Wärtsilä.`,
    },

    {
      date: "2 ans",
      titre: "Combattant de l’Infanterie",
      entreprises: ["2e RIMa"],
      tags: ["Discipline", "Résilience", "Cohésion", "Décision"],
      isCurrent: false,
      imgSrc: RIMA,
      imgAlt: "2e RIMa",
      imgCaption: "2e Régiment d’Infanterie de Marine",
      details: `
> Formation militaire initiale et développement des fondamentaux : rigueur, condition physique, et travail collectif.
> Passage au CPIS de Perpignan, avec immersion dans un environnement sélectif demandant adaptation, endurance mentale et maîtrise de soi.
> Stage au CNEC de Mont-Louis : franchissement, rusticité, autonomie, dépassement de soi.
> Renforcement de compétences transverses utiles en environnement technique : sang-froid, prise de décision, sens des responsabilités.`,
    },
  ];

  return (
    <section
      id="experiences"
      className="py-24 bg-transparent text-white relative overflow-hidden border-y border-cyber/10"
    >
      <div className="mx-auto px-2 relative z-10">
        <SectionHeader index="06" title="Expériences" />

        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <BlocExperience key={index} {...exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
