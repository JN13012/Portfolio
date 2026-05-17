import React from "react";
import ProfileConsole from "./ProfileConsole/ProfileConsole";
import { Terminal, ShieldAlert, Binary } from "lucide-react";

const Presentation = () => {
  return (
    <section id="acceuil" className="intro-content relative flex min-h-screen w-full items-center justify-center bg-transparent overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,26,26,0.34)_0%,rgba(0,0,0,0.72)_100%)]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1600px] gap-12 px-6 lg:px-12 items-center">
        {/* --- PARTIE GAUCHE : IDENTITÉ + CTF --- */}
        <div className="space-y-8 order-2 lg:order-1">
          {/* ================= IDENTITÉ ================= */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-white">
              NAGI <span className="text-cyber">JÉRÉMIE</span>
            </h1>

            <div className="items-center gap-2 border-l-2 border-cyber/90 pl-4 py-1">
              <span className="font-mono text-xl text-cyber/70 uppercase tracking-tight">
                Recherche Alternance Cybersécurité & IA
              </span>
            </div>
          </div>

          {/* ================= CTF ================= */}
          <div className="bg-zinc-900/50 border border-white/5 p-6 space-y-4 rounded-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-cyber">
              <span className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
                Portfolio interactif
              </span>
            </div>

            <p className="text-zinc-100 font-mono text-sm leading-relaxed">
              Ce portfolio représente mes aspirations professionnelles, mon parcours, mes projets et mes formations.
            </p>

            {/* SPACE / SEPARATION VISUELLE */}
            <div className="my-6 h-px w-full bg-white/10" />

            <div className="flex items-center gap-2 text-cyber">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                LABORATOIRE CTF
              </span>
            </div>

            <p className="text-zinc-100 font-mono text-sm leading-relaxed mt-2">
              Testez et améliorez vos compétences grâce à l'environnement
              d’entraînement cybersécurité intégré sur la partie droite de
              l’écran. <br />
              <br />
              Compétences développées :
            </p>
            <ul className="space-y-2 font-mono text-sm text-zinc-100/90">
              <li className="flex gap-2">
                <span className="text-cyber">[01]</span> Commandes Linux
              </li>{" "}
              <li className="flex gap-2">
                <span className="text-cyber">[02]</span> Réseaux TCP/IP
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[03]</span> Reconnaissance réseau &
                énumération de services
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[04]</span> Hashs Cracking
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[05]</span> Exploitation &
                élévation de privilèges
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[06]</span> Analyse de logs
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[07]</span> Réponse incident
              </li>
              <li className="flex gap-2">
                <span className="text-cyber">[08]</span> Durcissement
              </li>
            </ul>
          </div>
        </div>

        {/* --- PARTIE DROITE : TERMINAL CTF --- */}
        <div className="intro-console order-1 lg:order-2 flex flex-col justify-center w-full">
          <div className="relative group w-full">
            {/* Effet de lueur derrière la console */}
            <div className="absolute -inset-2 bg-cyber/10 rounded-lg blur-2xl group-hover:bg-cyber/20 transition-all duration-700"></div>

            {/* Label flottant */}
            <div className="absolute -top-4 right-8 bg-cyber text-black text-[10px] font-bold px-3 py-1 z-30 uppercase tracking-tighter">
              CTF v 2.0
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
