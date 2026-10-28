// Dev-only: the real Parcours section with the neon entry effects on (mockups.html?view=parcours-fx).
// Select an entry (click or ← →): each one plays its effect again.
import { Parcours } from "../../src/sections/Parcours/Parcours";

export default function ParcoursEffects() {
  return (
    <div className="min-h-screen px-4 font-sans" style={{ background: "radial-gradient(ellipse at 70% 0%, #0f1720 0%, #080b10 55%, #05070a 100%)" }}>
      <div className="mx-auto w-[90%] max-w-[1400px]">
        <Parcours effects />
      </div>
    </div>
  );
}
