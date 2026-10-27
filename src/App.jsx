import { lazy, Suspense, useRef, useState } from "react";
import "./App.css";

import NavBar from "./components/NavBar";
import ProjectSection from "./components/ProjectSection";
import Certifications from "./components/Certifications";
import { NetworkBackground2 } from "./components/NetworkBackground2";
import { Hero } from "./sections/Hero/Hero";
import { AssistantDock } from "./sections/Assistant/AssistantDock";
import { Profile } from "./sections/Profile/Profile";
import { Lab } from "./sections/Lab/Lab";
import { Expertise } from "./sections/Expertise/Expertise";
import { Parcours } from "./sections/Parcours/Parcours";
import { Contact } from "./sections/Contact/Contact";
import { profile } from "./content/profile";

// three.js intro, loaded only when it is shown.
const GlobeGate = lazy(() => import("./sections/Gate/GlobeGate"));

const GATE_KEY = "gate-seen";

/**
 * The globe intro opens once per session, on wide screens only (a 3D scene is
 * too heavy for a phone's first seconds), never under reduced motion or Save-Data.
 */
function shouldOpenGate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  if (navigator.connection?.saveData) return false;
  try {
    return sessionStorage.getItem(GATE_KEY) !== "1";
  } catch {
    return true;
  }
}

function App() {
  const [gateOpen, setGateOpen] = useState(shouldOpenGate);
  const portfolioRef = useRef(null);

  const closeGate = () => {
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch {
      // Private mode: the intro may show again, which is harmless.
    }
    setGateOpen(false);
  };

  const [, month, ] = profile.updatedAt.split("-");
  const updated = `${month}/${profile.updatedAt.slice(0, 4)}`;

  return (
    <>
      {gateOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-[2000] bg-black" />}>
          <GlobeGate onClose={closeGate} portfolioRef={portfolioRef} />
        </Suspense>
      )}
      {/* The real page is the intro's destination window; it stays mounted throughout the dive. */}
      <div ref={portfolioRef} className={`portfolio-window${gateOpen ? " is-intro-window" : ""}`} inert={gateOpen || undefined}>
        <div
          className="relative min-h-screen overflow-x-clip font-sans"
          style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}
        >
          <NetworkBackground2 />

          <div className="relative z-[1000]" inert={gateOpen || undefined}>
            <NavBar />
          </div>

          <main className="relative z-10 mx-auto w-[90%] max-w-[2400px]" inert={gateOpen || undefined}>
            <Hero />
            <Profile />
            <Expertise />
            <ProjectSection />
            <Lab />
            <Parcours effects />
            <Certifications />
            <Contact />
            {/* Sentry, the assistant, docked at the bottom right of every page. */}
            <AssistantDock introComplete={!gateOpen} />
          </main>

          <footer className="relative z-10 mx-auto flex w-[90%] max-w-[2400px] flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 pb-36 text-sm sm:pb-44 text-zinc-500" inert={gateOpen || undefined}>
            <span>
              © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
            </span>
            <span className="tracking-widest">
              LAST_UPDATE: <span className="text-zinc-300">{updated}</span>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
