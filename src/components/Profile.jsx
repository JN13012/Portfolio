import React, { memo } from "react";
import ProfilImg from "../assets/Profil.png";
import ProfileConsole from "./ProfileConsole/ProfileConsole";
import SectionHeader from "./SectionHeader";
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
  Download,
} from "lucide-react";

/* ===================== SUB-COMPONENTS ===================== */

const SectionTitle = ({
  icon: Icon,
  title,
  duration = 700,
  Animate = false,
}) => (
  <div className="group/title relative mb-5 inline-block">
    <div className="absolute inset-0 translate-x-[5px] translate-y-[5px] border border-black/80 bg-zinc-950" />
    {Animate && (
      <div
        className="absolute inset-y-0 left-0 z-0 w-0 bg-cyber transition-all ease-in-out group-hover/title:w-full"
        style={{ transitionDuration: `${duration}ms` }}
      />
    )}
    <div className="relative z-10 flex items-center gap-3 border border-zinc-600/70 bg-gradient-to-br from-zinc-700/70 via-zinc-850 to-zinc-950 px-4 py-2 shadow-[inset_2px_2px_0_rgba(255,255,255,0.08),inset_-2px_-2px_0_rgba(0,0,0,0.55),0_10px_0_rgba(0,0,0,0.28)] transition-all duration-300 group-hover/title:-translate-y-0.5 group-hover/title:border-cyber/45 group-hover/title:shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),inset_-2px_-2px_0_rgba(0,0,0,0.5),0_12px_0_rgba(0,0,0,0.28),0_0_20px_rgba(74,222,128,0.08)] group-hover/profile-block:-translate-y-0.5 group-hover/profile-block:border-cyber/45 group-hover/profile-block:shadow-[inset_2px_2px_0_rgba(255,255,255,0.1),inset_-2px_-2px_0_rgba(0,0,0,0.5),0_12px_0_rgba(0,0,0,0.28),0_0_20px_rgba(74,222,128,0.08)]">
      <div className="absolute inset-x-1 top-0 h-px bg-white/15" />
      <Icon
        size={18}
        className={`relative drop-shadow-[0_2px_0_rgba(0,0,0,0.45)] transition-colors duration-300 ${Animate ? "text-cyber group-hover/title:text-black" : "text-cyber"}`}
      />
      <h3
        className={`relative text-sm md:text-base font-mono uppercase tracking-[0.25em] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)] transition-colors duration-300 ${Animate ? "text-cyber group-hover/title:text-black" : "text-cyber"}`}
      >
        {title}
      </h3>
    </div>
  </div>
);

const SkillBar = memo(({ label, progress }) => (
  <div className="space-y-2 group cursor-default">
    <div className="flex justify-between text-base font-mono text-zinc-300 uppercase group-hover:text-zinc-100 transition-colors">
      <span>{label}</span>
      <span className="text-cyber">{progress}%</span>
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
      className="text-zinc-400 group-hover:text-cyber transition-all group-hover:scale-110"
    />
    <div className="text-base font-mono text-zinc-200 group-hover:text-zinc-100 uppercase text-center">
      {label}
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
  </div>
));

/* ===================== DATA ===================== */

const contentPanelClass =
  "rounded-sm border border-white/10 bg-zinc-950/60 px-2 py-1 backdrop-blur-sm shadow-[0_14px_36px_rgba(0,0,0,0.26)] transition-all duration-500 group-hover/profile-block:border-cyber/20 group-hover/profile-block:bg-zinc-950/70";

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
    value: "RNCP Niveau 7",
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
  { name: "Github", url: "https://github.com/JN13012" },
  { name: "Linkedin", url: "https://www.linkedin.com/in/jn13012" },
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
    <section
      id="profile"
      className="py-22 bg-transparent text-white relative overflow-hidden border-y border-cyber/10"
    >
      <div className="mx-auto px-2 relative z-10">
        <SectionHeader index="01" title="Profil" />

        <div className="grid grid-cols-1 lg:grid-cols-20 gap-12">
          {/* COL 1 */}
          <div className="lg:col-span-4 flex flex-col justify-start space-y-14 min-h-full">
            {/* PHOTO */}
            <div className="relative group mx-auto w-full max-w-[220px] lg:max-w-[420px]">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-cyber z-20"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyber z-20"></div>
              <div className="absolute inset-0 w-full h-[3px] bg-cyber/60 z-30 shadow-[0_0_15px_#4ade80] animate-scan opacity-0 group-hover:opacity-100"></div>
              <div className="relative border border-cyber/20 p-2.5 bg-zinc-900/50 overflow-hidden">
                <img
                  src={ProfilImg}
                  alt="Profile"
                  className="w-full grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
              </div>
            </div>
            {/* CV  */}
            <a
              href={CV}
              download="CV_Jérémie_Nagi.pdf"
              className="group/cv relative flex w-full items-center justify-between overflow-hidden border border-cyber/25 bg-black/65 px-5 py-3 font-mono uppercase tracking-[0.18em] text-cyber transition-all duration-300 hover:border-cyber/60 hover:bg-cyber/10 hover:shadow-[0_0_22px_rgba(74,222,128,0.12)]"
            >
              <div className="absolute inset-y-0 left-0 z-0 w-1 bg-cyber/70 transition-all duration-500 group-hover/cv:w-full group-hover/cv:bg-cyber/20" />
              <span className="relative z-10 flex items-center gap-3">
                <Download size={18} className="text-cyber" />
                <span className="text-base">Download_CV</span>
              </span>
              <span className="relative z-10 text-base italic text-cyber/70">
                (.pdf)
              </span>
            </a>
          </div>

          {/* COL 2 */}
          <div className="lg:col-span-10 space-y-10">
            {/* TOOLKIT */}
            <div className="group/profile-block">
              <SectionTitle icon={Shield} title="Liens professionnels" />
              <div className="flex flex-wrap justify-center gap-4 xl:flex-nowrap">
                {socTools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link relative inline-flex cursor-pointer items-center gap-2 overflow-hidden border border-white/10 bg-zinc-950/70 px-4 py-2.5 font-mono text-base uppercase tracking-[0.12em] text-zinc-200/85 shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyber/50 hover:bg-cyber/5 hover:text-cyber hover:shadow-[0_0_22px_rgba(74,222,128,0.09),0_12px_26px_rgba(0,0,0,0.32)]"
                  >
                    <span className="absolute inset-y-0 left-0 w-px bg-cyber/50 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100" />
                    <span>{tool.name}</span>
                    <span className="text-base text-cyber/70 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
            {/* ORIENTATION PROFESSIONNELLE */}
            <div className="group/profile-block">
              <SectionTitle
                icon={Terminal}
                title="Orientation professionnelle"
              />

              <div
                className={`${contentPanelClass} space-y-3 text-base font-mono text-zinc-100 leading-relaxed`}
              >
                <p>
                  Étudiant en reconversion professionnelle, passionné par les
                  systèmes informatiques, la Cybersécurité et l’intelligence
                  artificielle.
                </p>

                <p className="text-zinc-150">
                  Je m’investis intensivement dans ma montée
                  en compétences à travers l’apprentissage continu, les
                  projets personnels et les certifications complémentaires.
                </p>

                <p className="text-zinc-200">
                  Actuellement en recherche d’une alternance en cybersécurité,
                  DevSecOps ou IA appliquée.
                </p>

                <p className="text-zinc-250">Disponible immédiatement.</p>
              </div>
            </div>
            {/* PERSONNAL DATA */}
            <div className="group/profile-block">
              <SectionTitle icon={Database} title="Informations personnelles" />
              <ul className={`${contentPanelClass} space-y-2 font-mono`}>
                {personalData.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-white/5 pb-3 group/item relative z-10"
                  >
                    <span className="text-base text-zinc-100 uppercase group-hover/item:text-cyber transition-colors">
                      {item.label}
                    </span>
                    <span
                      className={`text-base uppercase font-semibold ${item.color}`}
                    >
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COL 3 */}
          <div className="lg:col-span-6 space-y-14">
            {/* SOFT SKILL */}
            <div className="group/profile-block">
              <SectionTitle icon={Cpu} title="Soft skills" />
              <div className={`${contentPanelClass} space-y-2`}>
                <SkillBar label="Esprit critique" progress={90} />
                <SkillBar label="Rigueur" progress={85} />
                <SkillBar label="Autonomie" progress={80} />
                <SkillBar label="Communication" progress={75} />
              </div>
            </div>
            {/* LANGUAGE */}
            <div className="group/profile-block">
              <SectionTitle
                icon={MessageSquare}
                title="Langues"
                duration={500}
              />
              <div className={`${contentPanelClass} grid grid-cols-2 gap-5`}>
                {languages.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 border border-white/5 bg-zinc-900/10 hover:border-cyber/40 transition-all group"
                  >
                    <div className="flex justify-between text-base font-mono mb-3">
                      <span className="text-zinc-100 group-hover:text-white">
                        {l.lang}
                      </span>
                      <span className="text-zinc-100 font-bold">{l.code}</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5">
                      <div
                        className="h-full bg-cyber group-hover:bg-cyber transition-all duration-1000"
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTRE INTERET */}
            <div className="group/profile-block">
              <div>
                <SectionTitle icon={User} title="Centres d'intérêts" />

                <div
                  className={`${contentPanelClass} grid grid-cols-2 sm:grid-cols-4 gap-3`}
                >
                  {interests.map((item) => (
                    <InterestCell key={item.id} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
