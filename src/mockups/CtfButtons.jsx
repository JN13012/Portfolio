// Dev-only: the styles proposed for the CTF start button (mockups.html?view=ctfbuttons).
import { StartButton } from "../sections/Lab/CtfIntro";

const STYLES = [
  ["hud", "A · Viseur : coins qui se resserrent au survol"],
  ["solid", "B · Plein : bouton vert, le plus évident"],
  ["prompt", "C · Invite de commande : root@lab:~$ ./commencer, curseur qui clignote"],
  ["key", "D · Touche Entrée : comme une touche de clavier"],
  ["arrow", "E · Pastille et flèche : la flèche avance au survol"],
];

export default function CtfButtons() {
  return (
    <div className="min-h-screen bg-black p-12 font-mono text-white">
      <div className="mx-auto grid max-w-4xl gap-6">
        {STYLES.map(([style, label]) => (
          <div key={style} className="flex items-center justify-between gap-6 border border-white/10 p-8" style={{ backgroundImage: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(74,222,128,0.10), transparent 70%)" }}>
            <p className="text-sm text-zinc-400">{label}</p>
            <StartButton style={style} onClick={() => {}}>
              Commencer
            </StartButton>
          </div>
        ))}
      </div>
    </div>
  );
}
