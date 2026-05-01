import React from "react";
import ProfileConsole from "./ProfileConsole/ProfileConsole";
import { Terminal, ShieldAlert, Binary } from "lucide-react";

const Presentation = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-transparent overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1600px] gap-12 px-6 lg:px-12 items-center">
        {/* --- PARTIE GAUCHE : TEXTE & MISSION --- */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-white">
              NAGI <span className="text-cyber">JÉRÉMIE</span>
            </h1>
            <div className="inline-flex items-center gap-2 border-l-2 border-cyber pl-4 py-1">
              <span className="font-mono text-xl text-zinc-400 uppercase tracking-tight">
                Architecte Systèmes <span className="text-cyber">&</span>{" "}
                Cyber_Spec Welcome_User / grep_is_magic / 1 2 3 4 / Nice / 1 2 3
                4
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 p-6 space-y-4 rounded-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-cyber">
              <ShieldAlert size={18} />
              <span className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
                Mission_Briefing
              </span>
            </div>

            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
              test test test test
            </p>

            <ul className="space-y-2 font-mono text-[12px] text-zinc-500">
              <li className="flex gap-2">
                <span className="text-cyber">[01]</span> Explorez les
                répertoires pour trouver le Flag_01.
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[02]</span> Décryptez les hashs de
                sécurité niveau 2.
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[03]</span> Élevez vos privilèges
                en accès ROOT.
              </li>
            </ul>

            <div className="pt-4 flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-600 uppercase">
                  Status
                </span>
                <span className="text-xs text-cyber font-mono animate-pulse uppercase">
                  Waiting for breach...
                </span>
              </div>
              <div className="flex flex-col border-l border-zinc-800 pl-4">
                <span className="text-[10px] text-zinc-600 uppercase">
                  Difficulty
                </span>
                <span className="text-xs text-white font-mono uppercase">
                  Junior Pentester
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- PARTIE DROITE : TERMINAL CTF --- */}
        <div className="order-1 lg:order-2 flex flex-col justify-center w-full">
          <div className="relative group w-full">
            {/* Effet de lueur derrière la console */}
            <div className="absolute -inset-2 bg-cyber/10 rounded-lg blur-2xl group-hover:bg-cyber/20 transition-all duration-700"></div>

            {/* Label flottant */}
            <div className="absolute -top-4 right-8 bg-cyber text-black text-[10px] font-bold px-3 py-1 z-30 uppercase tracking-tighter">
              CTF v1.0
            </div>

            {/* HAUTEUR AUGMENTÉE : h-[500px] sur mobile, 75vh sur desktop */}
            <div className="relative z-20 shadow-2xl h-[500px] lg:h-[75vh] w-full">
              <ProfileConsole />
            </div>

            {/* Décoration d'angle */}
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-cyber/30"></div>
          </div>
        </div>
      </div>

      {/* Binary Rain Background Decor (Subtil) */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03] pointer-events-none font-mono text-[10px] overflow-hidden leading-none break-all select-none">
        {Array(50).fill("01101110 01100001 01100111 01101001 ").join("")}
      </div>
    </section>
  );
};

export default Presentation;
