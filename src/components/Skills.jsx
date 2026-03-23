import React from "react";

const SkillBadge = ({ nom, niveau }) => (
  <div className="group relative bg-zinc-950 border border-cyber/10 p-4 transition-all duration-300 hover:border-cyber hover:bg-cyber/5">
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] font-mono text-cyber/80 uppercase tracking-tighter group-hover:text-cyber">
        {nom}
      </span>
      <span className="text-[9px] font-mono text-gray-600">{niveau}</span>
    </div>

    {/* Conteneur de la barre */}
    <div className="h-[2px] bg-white/5 w-full">
      <div
        className="h-full bg-cyber/30 group-hover:bg-cyber group-hover:shadow-[0_0_8px_#4ade80] transition-all duration-700 ease-out"
        style={{ width: niveau }}
      ></div>
    </div>
  </div>
);

const Skills = () => {
  const competences = [
    { nom: "Linux Admin", niveau: "90%" },
    { nom: "Docker / Ops", niveau: "85%" },
    { nom: "Réseaux TCP-IP", niveau: "80%" },
    { nom: "Pentest / Nmap", niveau: "75%" },
    { nom: "Python Script", niveau: "70%" },
    { nom: "CI/CD Jenkins", niveau: "65%" },
  ];

  return (
    <section id="skills" className="py-24">
      <h2 className="text-xl md:text-2xl font-bold mb-16 flex items-center gap-6">
        <span className="text-cyber opacity-40 font-mono text-sm">05.</span>
        <span className="text-zinc-100 tracking-widest uppercase">Skills</span>
        <div className="h-px bg-cyber/10 flex-1"></div>
      </h2>

      {/* Grille ultra-adaptable */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
        {competences.map((skill, index) => (
          <SkillBadge key={index} nom={skill.nom} niveau={skill.niveau} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
