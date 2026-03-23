import React, { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";

const ProfileConsole = () => {
  // État pour l'historique : on commence avec un message de bienvenue
  const [history, setHistory] = useState([
    { id: Date.now(), msg: "SYSTEM READY. ACCESS GRANTED.", level: "SYS", color: "text-cyber" },
  ]);

  // État pour ce que l'utilisateur écrit
  const [inputValue, setInputValue] = useState("");

  // Référence pour le scroll automatique
  const scrollRef = useRef(null);

  // Effet pour scroller vers le bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const command = inputValue.toLowerCase().trim();
      
      // 1. Ajouter la commande tapée par l'utilisateur à l'historique
      const userEntry = {
        id: Date.now(),
        msg: `> ${inputValue}`,
        level: "IN",
        color: "text-zinc-500"
      };

      // 2. Déterminer la réponse du système
      let systemResponse = {
        id: Date.now() + 1,
        msg: "COMMAND NOT RECOGNIZED. TYPE 'HELP'.",
        level: "ERR",
        color: "text-red-500"
      };

      if (command === "help") {
        systemResponse = { id: Date.now() + 1, msg: "AVAILABLE: WHOAMI, PWD, CLEAR, HELP", level: "SYS", color: "text-blue-400" };
      } else if (command === "whoami") {
        systemResponse = { id: Date.now() + 1, msg: "VISITOR_SESSION // ACCESS_LEVEL: GUEST", level: "USR", color: "text-white" };
      } else if (command === "pwd") {
        systemResponse = { id: Date.now() + 1, msg: "/home/portfolio/profile", level: "DIR", color: "text-cyber" };
      } else if (command === "clear") {
        setHistory([]);
        setInputValue("");
        return; // On sort pour ne pas ajouter le message de "clear" à l'historique
      }

      // Mettre à jour l'historique avec la commande ET la réponse
      setHistory((prev) => [...prev, userEntry, systemResponse]);
      setInputValue(""); // Vider le champ
    }
  };

  return (
    <div className="bg-black border border-cyber/30 rounded-sm overflow-hidden flex flex-col h-[50%] shadow-2xl shadow-cyber/5">
      {/* Header */}
      <div className="bg-cyber/10 px-3 py-2 flex justify-between items-center border-b border-cyber/20">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-cyber" />
          <span className="text-[9px] font-mono text-cyber uppercase font-bold tracking-wider">Live_Ops_Console</span>
        </div>
        <div className="text-[8px] text-red-500 animate-pulse font-bold">REC ●</div>
      </div>

      {/* Zone de logs (Scrollable) */}
      <div 
        ref={scrollRef}
        className="p-4 flex-1 overflow-y-auto space-y-2 font-mono text-[9px] scrollbar-hide"
      >
        {history.map((log) => (
          <div key={log.id} className="flex justify-between border-l border-white/10 pl-3 py-0.5 hover:bg-white/5 transition-colors">
            <span className="text-zinc-400 uppercase">{log.msg}</span>
            <span className={`${log.color} font-bold`}>{log.level}</span>
          </div>
        ))}
      </div>

      {/* Input de commande */}
      <div className="p-2 bg-zinc-900/30 border-t border-white/5 flex gap-2 items-center">
        <span className="text-cyber text-[9px] ml-1 font-mono">{">"}</span>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ENTER COMMAND..."
          className="bg-transparent border-none outline-none text-white font-mono text-[9px] w-full placeholder:text-zinc-700"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default ProfileConsole;