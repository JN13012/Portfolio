// Dev-only: tooltip styles proposed for « + N autres » in Expertise (mockups.html?view=infobulles).
// All open for comparison; the button at the top switches to the real hover, with its delay and animation.
import { useState } from "react";
import { ToolLogo } from "../../src/components/ui/ToolLogo/ToolLogo";

const ACCENT = "#22c55e";
const PERSO = ["BlockTrader", "Argos", "CyberPong", "Unit Converter"];
const FORMATION = ["Hackathon Citiz", "Bookworm", "RAG PDF Chatbot", "Meeting Companion", "Career Coach", "Assistant Translator", "AI Voice Assistant", "LLM Context Wrapper"];
const VISIBLE = ["BlockTrader", "Argos", "Hackathon Citiz", "Bookworm"];
const REST = [...PERSO, ...FORMATION].filter((name) => !VISIBLE.includes(name));

const NEIGHBOURS = {
  TypeScript: "BlockTrader · Maria Agent · Générateur OTP · Time Manager",
  JavaScript: "Code Executor · CTF du portfolio · ZeroDay",
  Java: "Vaultborn",
  "C++": "Chronox",
};

const ARROW_BELOW = "absolute left-1/2 top-full size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45";
const CENTERED = "absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2";
const GLASS = "border border-white/10 bg-zinc-900/90 shadow-[0_2px_4px_rgba(0,0,0,0.4),0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl";

const Heading = ({ children }) => <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">{children}</p>;

const Group = ({ title, names }) => (
  <div>
    <p className="mb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: ACCENT }}>{title}</p>
    <ul className="space-y-1 text-zinc-200">{names.map((name) => <li key={name} className="whitespace-nowrap">{name}</li>)}</ul>
  </div>
);

const STYLES = [
  {
    id: "1",
    name: "Ligne actuelle",
    seen: "Référence, ce qui est en place",
    covers: "Rien, si elle tient sur une ligne",
    limit: "Longue bande à lire, sans hiérarchie. Fait « bandeau » plutôt qu’infobulle.",
    panel: () => (
      <div className="absolute top-full left-1/2 z-20 mt-2 w-max -translate-x-1/2 rounded-sm border bg-zinc-950/95 px-3 py-1.5 text-xs text-zinc-300 shadow-lg" style={{ borderColor: `${ACCENT}80` }}>
        {REST.join(" · ")}
      </div>
    ),
  },
  {
    id: "2",
    name: "Verre discret",
    seen: "Esprit Apple, Linear, Vercel : surface neutre, ombre douce, flèche fine",
    covers: "Sa tuile et le bord des voisines, le temps de la lecture",
    limit: "Très sobre, mais reste une simple liste.",
    panel: () => (
      <div className={`${CENTERED} z-20 w-max rounded-lg px-3.5 py-3 text-xs ${GLASS}`}>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-left text-zinc-200">{REST.map((name) => <li key={name} className="whitespace-nowrap">{name}</li>)}</ul>
        <span className={`${ARROW_BELOW} border-r border-b border-white/10 bg-zinc-900`} />
      </div>
    ),
  },
  {
    id: "3",
    name: "Carte riche",
    seen: "Esprit des cartes au survol de GitHub et des « rich tooltips » de Material",
    covers: "Sa tuile et une partie des voisines",
    limit: "La plus complète, mais la plus massive pour une simple liste.",
    panel: () => (
      <div className={`${CENTERED} z-20 w-72 overflow-hidden rounded-lg text-left text-xs ${GLASS}`}>
        <div className="flex items-center gap-2.5 border-b border-white/10 px-3.5 py-2.5">
          <ToolLogo name="Python" size={22} tone={ACCENT} />
          <span className="text-sm font-semibold text-zinc-100">Python</span>
          <span className="ml-auto text-zinc-400">12 projets</span>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-3.5 py-3 text-zinc-200">{[...VISIBLE, ...REST].map((name) => <li key={name} className="whitespace-nowrap">{name}</li>)}</ul>
        <span className={`${ARROW_BELOW} border-r border-b border-white/10 bg-zinc-900`} />
      </div>
    ),
  },
  {
    id: "4",
    name: "Groupée par origine",
    seen: "Verre discret, plus une information utile",
    covers: "Sa tuile et le bord des voisines, le temps de la lecture",
    limit: "Ma recommandation : le recruteur distingue d’un coup d’œil les projets personnels et les projets de formation.",
    recommended: true,
    panel: () => (
      <div className={`${CENTERED} z-20 w-max rounded-lg px-4 py-3 text-left text-xs ${GLASS}`}>
        <div className="flex gap-6">
          <Group title="Perso & pro · 4" names={PERSO} />
          <Group title="Formation · 8" names={FORMATION} />
        </div>
        <span className={`${ARROW_BELOW} border-r border-b border-white/10 bg-zinc-900`} />
      </div>
    ),
  },
  {
    id: "5",
    name: "Puces",
    seen: "Esprit des étiquettes de tableaux de bord",
    covers: "Sa tuile et le bord des voisines",
    limit: "Compact et moderne, mais répète le style des badges de projets.",
    panel: () => (
      <div className={`${CENTERED} z-20 flex w-80 flex-wrap justify-center gap-1.5 rounded-lg p-3 text-[11px] ${GLASS}`}>
        {REST.map((name) => <span key={name} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 whitespace-nowrap text-zinc-200">{name}</span>)}
        <span className={`${ARROW_BELOW} border-r border-b border-white/10 bg-zinc-900`} />
      </div>
    ),
  },
  {
    id: "6",
    name: "Révélation dans la tuile",
    seen: "Pas de surface flottante : la tuile elle-même change de contenu",
    covers: "Aucune autre tuile",
    limit: "Le logo s’efface pendant la lecture, et il faut rester sur la tuile. Sur téléphone, le texte est très serré.",
    inTile: true,
    panel: () => (
      <div className="absolute inset-0 z-20 flex flex-col justify-center rounded-xl border bg-zinc-950 px-3 py-3 text-center text-xs leading-relaxed text-zinc-300" style={{ borderColor: `${ACCENT}80` }}>
        <p className="mb-1.5 text-sm font-semibold text-zinc-100">Python · 12 projets</p>
        <p>{[...VISIBLE, ...REST].join(" · ")}</p>
      </div>
    ),
  },
  {
    id: "7",
    name: "Panneau cyber",
    seen: "Reprend les coins verts des panneaux du site",
    covers: "Sa tuile et le bord des voisines",
    limit: "Le plus proche de l’identité du portfolio, mais le plus décoratif.",
    panel: () => (
      <div className={`${CENTERED} z-20 w-max bg-zinc-950/95 px-4 py-3 text-left text-xs shadow-[0_16px_40px_rgba(0,0,0,0.65)]`}>
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((corner) => (
          <span key={corner} className={`absolute size-2.5 ${corner}`} style={{ borderColor: ACCENT }} />
        ))}
        <Heading>Aussi utilisé dans</Heading>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-zinc-200">{REST.map((name) => <li key={name} className="whitespace-nowrap">{name}</li>)}</ul>
      </div>
    ),
  },
];

function Tile({ name, note, children }) {
  return (
    <div className="relative flex min-h-52 flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-zinc-950/45 px-3 pt-5 pb-4 text-center">
      <span className="grid h-[76px] place-items-center"><ToolLogo name={name} size={76} tone={ACCENT} /></span>
      <span className="text-sm font-semibold text-zinc-100">{name}</span>
      <span className="text-xs leading-snug text-zinc-400">{note}</span>
      {children}
    </div>
  );
}

function Proposal({ style, live }) {
  const panel = (
    <div className={live ? "pointer-events-none opacity-0 transition-all delay-150 duration-150 group-hover/more:pointer-events-auto group-hover/more:opacity-100 motion-reduce:transition-none" : ""}>
      {style.panel()}
    </div>
  );
  return (
    <section className="border-t border-white/10 pt-6 pb-10">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">{style.id}. {style.name}</h2>
        {style.recommended && <span className="rounded-full border px-2 py-0.5 text-xs" style={{ color: ACCENT, borderColor: `${ACCENT}80` }}>Recommandée</span>}
      </div>
      <p className="text-sm text-zinc-400">{style.seen}</p>
      <p className="mt-1 text-sm text-zinc-400"><span className="text-zinc-200">Recouvre :</span> {style.covers}</p>
      <p className="mt-1 text-sm text-zinc-400"><span className="text-zinc-200">Avis :</span> {style.limit}</p>
      <div className="mt-48 grid grid-cols-5 gap-3">
        <Tile name="TypeScript" note={NEIGHBOURS.TypeScript} />
        <Tile name="JavaScript" note={NEIGHBOURS.JavaScript} />
        <div className={style.inTile ? "group/more relative" : ""}>
          <Tile name="Python" note={VISIBLE.join(" · ")}>
            <span className={style.inTile ? "text-xs text-zinc-300" : "group/more relative text-xs text-zinc-300"}>
              <button type="button" className="cursor-pointer">+ <span className="underline decoration-dotted underline-offset-2">8 autres</span></button>
              {!style.inTile && panel}
            </span>
          </Tile>
          {style.inTile && panel}
        </div>
        <Tile name="Java" note={NEIGHBOURS.Java} />
        <Tile name="C++" note={NEIGHBOURS["C++"]} />
      </div>
    </section>
  );
}

export default function TooltipStyles() {
  const [live, setLive] = useState(false);
  return (
    <main className="mx-auto max-w-[1040px] bg-black px-6 py-10 font-sans text-zinc-100">
      <h1 className="text-2xl font-bold">Infobulles de « + N autres »</h1>
      <p className="mt-2 text-sm text-zinc-400">Exemple avec Python, 12 projets. Vraies tuiles et vrais noms de projets.</p>
      <button type="button" onClick={() => setLive((on) => !on)} className="mt-4 mb-8 cursor-pointer rounded-md border border-white/20 px-3 py-1.5 text-sm text-zinc-100 hover:bg-white/10">
        {live ? "Tout afficher pour comparer" : "Tester au survol, avec délai et animation"}
      </button>
      {STYLES.map((style) => <Proposal key={style.id} style={style} live={live} />)}
    </main>
  );
}
