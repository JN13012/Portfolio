import React from "react";

const BlocExperience = ({ date, titre, entreprise, details }) => (
  <div className="relative pl-10 pb-16 group">
    {/* La ligne verticale */}
    <div className="absolute left-0 top-0 h-full w-px bg-cyber/20 group-last:bg-transparent"></div>

    {/* Le voyant lumineux */}
    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-cyber bg-black shadow-[0_0_10px_#4ade80] group-hover:scale-125 transition-transform duration-300"></div>

    <div className="font-mono">
      <div className="flex flex-wrap items-center gap-x-4 mb-2">
        <h3 className="text-white text-base md:text-xl font-bold uppercase tracking-tighter">
          {titre}
        </h3>
        <span className="text-[10px] md:text-xs bg-cyber/5 text-cyber/60 border border-cyber/10 px-2 py-0.5">
          [{date}]
        </span>
      </div>

      <div className="text-cyber text-xs mb-4 font-bold uppercase tracking-widest">
        // {entreprise}
      </div>

      <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-3xl border-l-2 border-white/5 pl-4 py-1 italic">
        {details}
      </p>
    </div>
  </div>
);

const Experiences = () => {
  const experiences = [
    {
      date: "2025 - PRÉSENT",
      titre: "Cybersecurity Training",
      entreprise: "EPITECH MARSEILLE",
      details:
        "Apprentissage intensif par projets : Pentest, sécurité réseau, cryptographie et administration système Unix.",
    },
    {
      date: "2017 - 2018",
      titre: "Mécanicien Compétition (Tire Man)",
      entreprise: "G-DRIVE RACING (WEC)",
      details:
        "Championnat du monde d'endurance. Gestion du stress extrême, rigueur absolue et travail d'équipe millimétré lors des arrêts aux stands.",
    },
    {
      date: "2 ANS",
      titre: "Combattant de l'Infanterie",
      entreprise: "2ÈME RIMA",
      details:
        "Discipline militaire, sens des responsabilités, autonomie en milieu hostile et gestion de crises.",
    },
  ];

  return (
    <section id="experiences" className="py-24">
      <div className="w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-16 flex items-center gap-6">
          <span className="text-cyber opacity-40 font-mono text-sm">03.</span>
          <span className="text-zinc-100 tracking-widest uppercase">
            Experiences
          </span>
          <div className="h-px bg-cyber/10 flex-1"></div>
        </h2>

        <div className="mt-8">
          {experiences.map((exp, index) => (
            <BlocExperience key={index} {...exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
