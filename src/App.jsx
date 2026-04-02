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

      <footer className="pb-12 pt-6 flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-1000">
        <a
          href="https://hits.seeyoufarm.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://TON-SITE.netlify.app&count_bg=%234ADE80&title_bg=%233F3F46&title=TRAFFIC_LOG&edge_flat=true&color=%23FFFFFF"
            alt="System Traffic Log"
            className="h-5"
          />
        </a>
      </footer>
    </div>
  );
}

export default App;
