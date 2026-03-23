import React, { memo } from "react";
import ProfilImg from "../assets/Profil.png";
import ProfileConsole from "./ProfileConsole";
import CV from "../assets/CV.pdf";
import {
  Plane,
  Dumbbell,
  Globe,
  Landmark,
  Terminal,
  User,
  Cpu,
  MessageSquare,
  Shield,
  Database,
} from "lucide-react";

/* ===================== SUB-COMPONENTS ===================== */

const SectionTitle = ({
  icon: Icon,
  title,
  duration = 700,
  Animate = true,
}) => (
  <div
    className={`relative inline-block overflow-hidden mb-5 border border-cyber/20 ${Animate ? "group/title cursor-help" : ""}`}
  >
    {Animate && (
      <div
        className="absolute inset-y-0 left-0 w-0 bg-cyber group-hover/title:w-full transition-all ease-in-out z-0"
        style={{ transitionDuration: `${duration}ms` }}
      />
    )}
    <div className="relative z-10 flex items-center gap-3 px-4 py-2">
      <Icon
        size={18} // Augmenté
        className={`transition-colors duration-300 ${Animate ? "text-cyber group-hover/title:text-black" : "text-cyber"}`}
      />
      <h3
        className={`text-base font-mono uppercase tracking-[0.25em] transition-colors duration-300 ${Animate ? "text-cyber group-hover/title:text-black" : "text-cyber"}`}
      >
        {title}
      </h3>
    </div>
  </div>
);

const SkillBar = memo(({ label, progress }) => (
  <div className="space-y-2 group cursor-default">
    <div className="flex justify-between text-sm font-mono text-zinc-400 uppercase group-hover:text-zinc-200 transition-colors">
      <span>{label}</span>
      <span className="text-cyber/80">{progress}%</span>
    </div>
    <div className="h-[3px] w-full bg-white/5 relative overflow-hidden">
      <div
        className="h-full bg-cyber shadow-[0_0_10px_#4ade80] transition-all duration-1000 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
));

const InterestCell = memo(({ icon: Icon, label }) => (
  <div className="group p-3 border border-white/5 bg-zinc-900/10 flex flex-col items-center justify-center gap-1 hover:border-cyber/40 hover:bg-cyber/5 transition-all duration-500 relative overflow-hidden">
    <Icon
      size={27}
      className="text-zinc-500 group-hover:text-cyber transition-all group-hover:scale-110"
    />
    <div className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 uppercase text-center">
      {label}
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
  </div>
));

/* ===================== DATA ===================== */

const personalData = [
  {
    id: "loc",
    label: "Localisation",
    value: "Marseille, FR",
    color: "text-white",
  },
  {
    id: "status",
    label: "Statut",
    value: "Alternance Recherche",
    color: "text-white",
  },
  {
    id: "spec",
    label: "Spécialité",
    value: "Cybersécurité",
    color: "text-cyber",
  },
  {
    id: "level",
    label: "Niveau",
    value: "Master of Science",
    color: "text-white",
  },
];

const languages = [
  { id: "en", lang: "Anglais", level: "Courant", code: "C1", progress: 90 },
  { id: "es", lang: "Espagnol", level: "Courant", code: "C1", progress: 85 },
  { id: "ar", lang: "Arabe", level: "Courant", code: "C1", progress: 95 },
  { id: "de", lang: "Allemand", level: "Basique", code: "A1", progress: 25 },
];

const socTools = [
  { name: "GITHUB", url: "https://github.com/JN13012" },
  { name: "LINKEDIN", url: "https://www.linkedin.com/in/jn13012" },
  { name: "TryHackMe", url: "https://tryhackme.com/p/JN13" },
  {
    name: "Coursera",
    url: "https://www.coursera.org/user/e4a10664a5b2f8c1c89a72345402e8b1",
  },
  {
    name: "Salesforce",
    url: "https://www.salesforce.com/trailblazer/yfqjerhp8yqpaobh7v",
  },
];

const interests = [
  { id: "travel", icon: Plane, label: "Voyages" },
  { id: "sport", icon: Dumbbell, label: "Sport" },
  { id: "geo", icon: Globe, label: "Géopolitique" },
  { id: "finance", icon: Landmark, label: "Finance" },
];

/* ===================== MAIN COMPONENT ===================== */

const Profile = () => {
  return (
    <section className="py-32 bg-[#020202] text-white relative overflow-hidden border-y border-cyber/10">
      <div className="mx-auto px-2">
        {/* TITRE */}
        <h2 className="text-2xl md:text-3xl font-bold mb-20 flex items-center gap-6">
          <span className="text-cyber opacity-40 font-mono text-base">01.</span>
          <span className="text-zinc-100 tracking-[0.2em] uppercase font-mono">
            Profile_Analysis
          </span>
          <div className="h-px bg-cyber/10 flex-1"></div>
          <div className="hidden sm:flex items-center gap-3 border border-red-500/30 px-4 py-1.5 bg-red-500/5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-red-500 font-mono text-xs uppercase tracking-tighter">
              Threat: High
            </span>
          </div>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-20 gap-12">
          {/* COL 1 */}
          <div className="lg:col-span-6 space-y-7">
            {/* TOOLKIT */}
            <div className="flex items-center gap-3 mb-5">
              <Shield size={20} className="text-cyber/60" />
              <p className="text-base text-zinc-400 font-mono uppercase tracking-widest">
                SOC_Toolkit_v2.0
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {socTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono border border-cyber/20 px-3 py-2 text-zinc-400 hover:border-cyber hover:text-cyber hover:bg-cyber/5 transition-all cursor-crosshair"
                >
                  {tool.name}
                </a>
              ))}
            </div>

            {/* PHOTO */}
            <div className="relative group mx-auto lg:mx-0 w-full max-w-[320px] lg:max-w-none">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-cyber z-20"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyber z-20"></div>
              <div className="absolute inset-0 w-full h-[3px] bg-cyber/60 z-30 shadow-[0_0_15px_#4ade80] animate-scan opacity-0 group-hover:opacity-100"></div>
              <div className="relative border border-cyber/20 p-2.5 bg-zinc-900/50 overflow-hidden">
                <img
                  src={ProfilImg}
                  alt="Profile"
                  className="w-full grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                <div className="absolute bottom-5 left-5 right-5 bg-black/80 backdrop-blur-md border border-cyber/20 p-3 z-20 text-center">
                  <p className="text-[11px] font-mono text-cyber animate-pulse tracking-[0.2em] uppercase">
                    Biometric_Match: Stable
                  </p>
                </div>
              </div>
            </div>

            {/* CENTRE INTERET */}
            <div>
              <div className="flex items-center gap-3 mb-5 group/title cursor-crosshair">
                <User
                  size={20}
                  className="text-cyber/60 group-hover/title:text-cyber transition-colors"
                />
                <p className="text-base text-zinc-400 font-mono uppercase tracking-widest group-hover/title:text-zinc-200 transition-colors">
                  Interest_Nodes_v1.0
                </p>
                <div className="h-[1px] flex-1 bg-white/5 group-hover/title:bg-cyber/20 transition-colors"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interests.map((item) => (
                  <InterestCell key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>

          {/* COL 2 */}
          <div className="lg:col-span-6 space-y-8">
            {/* PERSONNAL DATA */}
            <div>
              <SectionTitle
                icon={Database}
                title="Personnel_Data"
                duration={1800}
              />
              <ul className="space-y-2 font-mono px-2">
                {personalData.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-white/5 pb-3 group/item relative z-10"
                  >
                    <span className="text-sm text-white/40 uppercase group-hover/item:text-cyber transition-colors">
                      {item.label}
                    </span>
                    <span
                      className={`text-sm uppercase font-semibold ${item.color}`}
                    >
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SOFT SKILL */}
            <div>
              <SectionTitle
                icon={Cpu}
                title="Soft_Skills_Processing"
                duration={1000}
              />
              <div className="space-y-2 px-2">
                <SkillBar label="Esprit critique" progress={90} />
                <SkillBar label="Curiosité technique" progress={85} />
                <SkillBar label="Polyvalence" progress={80} />
                <SkillBar label="Communication" progress={70} />
              </div>
            </div>

            {/* LANGUAGE */}
            <div>
              <SectionTitle
                icon={MessageSquare}
                title="Language_Protocols"
                duration={500}
              />
              <div className="grid grid-cols-2 gap-5 px-2">
                {languages.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 border border-white/5 bg-zinc-900/10 hover:border-cyber/40 transition-all group"
                  >
                    <div className="flex justify-between text-sm font-mono mb-3">
                      <span className="text-zinc-400 group-hover:text-white">
                        {l.lang}
                      </span>
                      <span className="text-cyber font-bold">{l.code}</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5">
                      <div
                        className="h-full bg-cyber/40 group-hover:bg-cyber transition-all duration-1000"
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COL 3 */}
          <div className="lg:col-span-8 space-y-10">
            <ProfileConsole />
            <a
              href={CV}
              download="CV_Jérémie_Nagi.pdf"
              className="w-full relative px-8 py-5 bg-black text-cyber border border-cyber font-mono text-xs uppercase tracking-[0.4em] hover:bg-cyber/10 hover:shadow-[0_0_20px_#4ade8033] hover:animate-flicker transition-all text-center flex items-center justify-center overflow-hidden font-bold"
            >
              Download_CV.exe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
