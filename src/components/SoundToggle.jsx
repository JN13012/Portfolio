import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import darkCodingSong from "../assets/DarkCodingSong.mp4";

export default function SoundToggle() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.2;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      audio?.pause();
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={darkCodingSong} loop preload="none" />

      <button
        type="button"
        onClick={toggleSound}
        aria-label={isPlaying ? "Désactiver la musique" : "Activer la musique"}
        aria-pressed={isPlaying}
className={`group fixed bottom-6 right-6 z-[1001] flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-300 ${
  isPlaying
    ? "border-cyber/50 bg-cyber/10 text-cyber shadow-[0_0_22px_rgba(74,222,128,0.14)]"
    : "border-white/15 bg-black/70 text-zinc-400 hover:border-cyber/35 hover:text-cyber"
}`}
      >
        <span className="absolute inset-y-0 left-0 w-0 bg-cyber/15 transition-all duration-500 group-hover:w-full" />
        <span className="relative z-10">
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </span>
      </button>
    </>
  );
}
