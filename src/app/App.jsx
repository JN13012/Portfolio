import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Clock3 } from "lucide-react";
import "./App.css";

import NavBar from "../components/layout/NavBar";
import { VisitCounter } from "../components/layout/VisitCounter";
import { PresentationAudioLifecycle } from "../components/Sentry/PresentationAudioLifecycle";
import Projects from "../sections/Projects/Projects";
import Certifications from "../sections/Certifications/Certifications";
import { NetworkBackground } from "../components/layout/NetworkBackground";
import { Hero } from "../sections/Hero/Hero";
import { SentryChat } from "../components/Sentry/SentryChat";
import { Profile } from "../sections/Profile/Profile";
import { Lab } from "../sections/Lab/Lab";
import { Expertise } from "../sections/Expertise/Expertise";
import { Parcours } from "../sections/Parcours/Parcours";
import { Contact } from "../sections/Contact/Contact";
import { profile } from "../content/profile";
import { footerUi } from "../content/ui";
import { onCore } from "../lib/coreBus";
import { sentryWelcome } from "../lib/sentryWelcome";

// three.js intro, loaded only when it is shown.
const GlobeGate = lazy(() => import("../sections/Gate/GlobeGate"));

const GATE_KEY = "gate-seen";

/**
 * The globe intro opens once per session, on wide screens only (a 3D scene is
 * too heavy for a phone's first seconds), never under reduced motion or Save-Data.
 */
function shouldOpenGate(replay = false) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  if (navigator.connection?.saveData) return false;
  if (replay) return true;
  try {
    return sessionStorage.getItem(GATE_KEY) !== "1";
  } catch {
    return true;
  }
}

function App() {
  const [gateOpen, setGateOpen] = useState(shouldOpenGate);
  const portfolioRef = useRef(null);

  // « Revoir le globe » in Profil plays the intro again.
  useEffect(() => onCore("replayGate", () => {
    if (!shouldOpenGate(true)) return;
    sentryWelcome.dismiss();
    // The destination window always opens on the Hero, including a replay from Profil.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setGateOpen(true);
  }), []);

  const closeGate = () => {
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch {
      // Private mode: the intro may show again, which is harmless.
    }
    setGateOpen(false);
  };

  const updated = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(profile.updatedAt));

  return (
    <>
      <PresentationAudioLifecycle />
      {gateOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-[2000] bg-black" />}>
          <GlobeGate onClose={closeGate} onPortfolioVisible={sentryWelcome.reveal} portfolioRef={portfolioRef} />
        </Suspense>
      )}
      {/* The real page is the intro's destination window; it stays mounted throughout the dive. */}
      <div ref={portfolioRef} className={`portfolio-window${gateOpen ? " is-intro-window" : ""}`} inert={gateOpen || undefined}>
        <div
          className="relative min-h-screen overflow-x-clip font-sans"
          style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}
        >
          <NetworkBackground suspended={gateOpen} />

          <div className="relative z-[1000]" inert={gateOpen || undefined}>
            <NavBar />
          </div>

          <main className="relative z-10 mx-auto w-[90%] max-w-[2400px]" inert={gateOpen || undefined}>
            <Hero />
            <Profile />
            <Expertise />
            <Projects />
            <Lab />
            <Parcours effects />
            <Certifications />
            <Contact />
            {/* Sentry, the assistant, docked at the bottom right of every page. */}
            <SentryChat introComplete={!gateOpen} />
          </main>

          <footer className="relative mx-auto flex w-[90%] max-w-[2400px] flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-8 pr-24 pb-[calc(max(1.25rem,var(--presentation-footer-space,0px))+env(safe-area-inset-bottom,0px))] text-xs text-zinc-400 sm:pr-36" inert={gateOpen || undefined}>
            <span className="whitespace-nowrap">
              © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
            </span>
            <span className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-3 w-px bg-zinc-700" aria-hidden="true" />
              <VisitCounter />
            </span>
            <span className="flex basis-full items-center gap-3 whitespace-nowrap sm:basis-auto" aria-label={`${footerUi.lastUpdateLabel.fr} : ${updated}`}>
              <span className="hidden h-3 w-px bg-zinc-700 sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={13} className="shrink-0" aria-hidden="true" />
                <span>{footerUi.lastUpdate.fr} · <time dateTime={profile.updatedAt}>{updated}</time></span>
              </span>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
