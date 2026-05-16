import "./App.css";

// Composants
import NavBar from "./components/NavBar";
import Presentation from "./components/Presentation";
import Profile from "./components/Profile";
import Formations from "./components/Formations";
import Experiences from "./components/Experiences";
import ProjectSection from "./components/ProjectSection";
import Certifications from "./components/Certifications";
import Competences from "./components/Competences";
import Contact from "./components/Contact";
import NetworkBackground from "./components/NetworkBackground";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-mono">
      <NetworkBackground />

      <div className="relative z-[1000]">
        <NavBar />
      </div>
      <div className="relative z-10 w-[95%] max-w-[1800px] mx-auto px-6 py-10">
        <Presentation />
        <Profile />
        <Competences />
        <Formations />
        <Certifications />
        <ProjectSection />
        <Experiences />
        <Contact />
      </div>
    </div>
  );
}

export default App;
