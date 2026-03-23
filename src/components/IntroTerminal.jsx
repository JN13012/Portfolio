import React, { useState, useEffect } from "react";

const IntroIntrusion = ({ onAccessGranted }) => {
  const [logs, setLogs] = useState([]);
  const [phase, setPhase] = useState("intrusion");

  const intrusionSequence = [
    "[SCAN] Target detected: portfolio.local",
    "[INFO] Attempting connection...",
    "[WARN] Firewall detected",
    "[ATTACK] Injecting payload...",
    "[FAIL] Access denied",
    "[RETRY] Escalating privileges...",
    "[BYPASS] Exploiting vulnerability CVE-2026-1337",
    "[SUCCESS] Root access acquired",
  ];

  const revealSequence = [
    "Decrypting profile...",
    "Loading identity...",
    ">> USER: CYBER ANALYST",
    ">> STATUS: AVAILABLE FOR WORK",
    ">> CLEARANCE LEVEL: AUTHORIZED",
  ];

  useEffect(() => {
    let delay = 0;

    intrusionSequence.forEach((line, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, line]);

        if (index === intrusionSequence.length - 1) {
          setTimeout(() => setPhase("reveal"), 800);
        }
      }, delay);

      delay += 350;
    });

    delay += 500;

    revealSequence.forEach((line, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, line]);

        if (index === revealSequence.length - 1) {
          setTimeout(onAccessGranted, 1200);
        }
      }, delay);

      delay += 300;
    });
  }, []);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden relative">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.08),transparent_70%)]" />

      {/* TERMINAL */}
      <div className="w-full max-w-2xl bg-black/80 border border-cyber/20 shadow-[0_0_60px_rgba(74,222,128,0.15)] backdrop-blur-md">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-cyber/20 bg-cyber/5">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-cyber rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] text-cyber/60 font-mono tracking-[0.3em]">
            INTRUSION_SIM
          </span>
        </div>

        {/* LOGS */}
        <div className="p-6 font-mono text-[12px] space-y-2 h-[300px] overflow-hidden">

          {logs.map((log, i) => {
            let color = "text-zinc-400";

            if (log.includes("FAIL")) color = "text-red-500";
            if (log.includes("SUCCESS")) color = "text-cyber";
            if (log.includes("WARN")) color = "text-yellow-500";
            if (log.includes("USER")) color = "text-white font-bold";

            return (
              <div
                key={i}
                className={`flex gap-2 animate-fadeIn ${color}`}
              >
                <span className="opacity-50">$</span>
                <span className="tracking-wide">{log}</span>
              </div>
            );
          })}

          {/* CURSOR */}
          <div className="flex items-center gap-2">
            <span className="opacity-50">$</span>
            <div className="w-2 h-4 bg-cyber animate-pulse" />
          </div>
        </div>
      </div>

      {/* GLITCH OVERLAY */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_2px]" />

    </div>
  );
};

export default IntroIntrusion;