import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// Composants
import NavBar from "./components/NavBar";
import Presentation from "./components/Presentation";
import Profile from "./components/Profile";
import Formations from "./components/Formations";
import Experiences from "./components/Experiences";
import ProjectSection from "./components/ProjectSection";
import Certifications from "./components/Certifications";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-black min-h-screen font-mono">
      <NavBar />
      <div className="w-[95%] max-w-[1800px] mx-auto px-6 py-10">
        <Presentation />
        <Profile />
        <Formations />
        <Certifications />
        <Experiences />
        <ProjectSection />
      </div>

      <section id="center" className="py-10 border-t border-cyber/10">
        <div className="hero flex justify-center gap-4 mb-8">
          <img
            src={heroImg}
            className="base"
            width="100"
            height="100"
            alt="Hero"
          />
          <img src={reactLogo} className="framework w-10" alt="React logo" />
          <img src={viteLogo} className="vite w-10" alt="Vite logo" />
        </div>

        <div className="text-center">
          <h2 className="text-xl mb-4">Initialisation du terminal...</h2>
          <button
            className="border border-cyber px-4 py-2 hover:bg-cyber hover:text-black transition"
            onClick={() => setCount((count) => count + 1)}
          >
            Niveau d'accès : {count}
          </button>
        </div>
      </section>

      {/* Reste de ton code (Next Steps, etc.) si tu veux le garder pour le moment */}
      <section id="next-steps" className="max-w-4xl mx-auto p-10 opacity-50">
        {/* ... Ton code existant ... */}
      </section>
    </div>
  );
}

export default App;
