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
import BgVideo from "./assets/Bg_video.mp4";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-mono">
      <video
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover opacity-45"
        src={BgVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-black/38"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.82)_100%)]"
        aria-hidden="true"
      />

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
