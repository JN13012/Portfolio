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

function App() {
  return (
    <div className="bg-black min-h-screen font-mono">
      <NavBar />
      <div className="w-[95%] max-w-[1800px] mx-auto px-6 py-10">
        <Presentation />
        <Profile />
        <Formations />
        <Certifications />
        <Competences />
        <ProjectSection />
        <Experiences />
      </div>
    </div>
  );
}

export default App;
