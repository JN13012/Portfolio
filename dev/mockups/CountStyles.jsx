// Dev-only: ways of showing the totals in the Hero's proofs (mockups.html?view=compteurs).
import { useEffect, useState } from "react";
import Coursera from "../../src/assets/COURSERA.webp";
import THM from "../../src/assets/THM.jpg";
import Argos from "../../src/assets/Logos/Argos_Emblem_sm.webp";
import BlockTrader from "../../src/assets/Logos/BlockTrader_Emblem_sm.webp";

const GREEN = "#4ade80";
const label = "text-[11px] tracking-[0.2em] text-zinc-500 uppercase";

const STYLES = [
  { id: "1", name: "Actuel : blanc, plus grand", spec: "Blanc · semi-gras · 16 px", note: "Lisible, mais le blanc se confond avec les titres en dessous.", count: (n) => <span className="ml-2 align-[-1px] text-base font-semibold tracking-normal text-zinc-100">{n}</span> },
  { id: "2", name: "Vert du site", spec: "Vert · semi-gras · 16 px", note: "Ressort sans alourdir, et reprend l’accent du portfolio.", recommended: true, count: (n) => <span className="ml-2 align-[-1px] text-base font-semibold tracking-normal" style={{ color: GREEN }}>{n}</span> },
  { id: "3", name: "Même taille que le titre", spec: "Blanc · semi-gras · 11 px", note: "Le plus sobre, mais il n’appuie pas assez sur le chiffre.", count: (n) => <span className="ml-2 font-semibold tracking-normal text-zinc-100">{n}</span> },
  { id: "4", name: "Entre parenthèses", spec: "Gris clair · normal · 11 px", note: "Se lit comme un compteur de filtre : le chiffre devient une note secondaire.", count: (n) => <span className="ml-1.5 tracking-normal text-zinc-300">({n})</span> },
  { id: "5", name: "Pastille", spec: "Gris clair sur fond gris · 11 px", note: "Identique aux compteurs « Tous 30 » de Projets, cohérent mais discret.", count: (n) => <span className="ml-2 rounded-[3px] bg-white/10 px-1.5 py-0.5 tracking-normal text-zinc-200 tabular-nums">{n}</span> },
  { id: "6", name: "Pastille verte", spec: "Vert sur fond vert léger · 11 px", note: "Bien visible, mais ressemble à un statut ou à une notification.", count: (n) => <span className="ml-2 rounded-[3px] border px-1.5 py-0.5 font-semibold tracking-normal" style={{ color: GREEN, borderColor: `${GREEN}55`, background: `${GREEN}14` }}>{n}</span> },
  { id: "7", name: "Séparé par un point", spec: "Blanc · semi-gras · 12 px", note: "Reprend le « · » déjà utilisé partout dans le Hero, très discret.", count: (n) => <span className="tracking-normal"><span className="mx-1.5 text-zinc-600">·</span><span className="text-xs font-semibold text-zinc-100">{n}</span></span> },
  { id: "8", name: "Grand chiffre", spec: "Vert · gras · 20 px", note: "Le plus fort, mais il prend le pas sur le nom et le titre du Hero.", count: (n) => <span className="ml-2 align-[-2px] text-xl font-bold tracking-normal" style={{ color: GREEN }}>{n}</span> },
  { id: "9", name: "Lueur douce", spec: "Vert · semi-gras · 16 px · halo", note: "Rappelle l’ambiance terminal du Lab, mais le halo fatigue s’il est répété.", count: (n) => <span className="ml-2 align-[-1px] text-base font-semibold tracking-normal [text-shadow:0_0_10px_rgba(74,222,128,0.6)]" style={{ color: GREEN }}>{n}</span> },
];

/** Counts up once when the page opens, or when the replay button is pressed. */
function CountUp({ to, run }) {
  const [value, setValue] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const progress = Math.min(1, (now - start) / 900);
      setValue(Math.round(to * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [to, run]);
  return <span className="ml-2 align-[-1px] text-base font-semibold tracking-normal tabular-nums" style={{ color: GREEN }}>{value}</span>;
}

const Item = ({ src, title, sub }) => (
  <div className="flex min-w-0 items-center gap-2.5">
    <img src={src} alt="" className="size-9 shrink-0 rounded-md object-cover" />
    <span className="min-w-0"><span className="block truncate text-sm text-zinc-100">{title}</span><span className="block truncate text-[11px] text-zinc-400">{sub}</span></span>
  </div>
);

function Row({ title, count, children }) {
  return (
    <div className="border-t border-white/10 py-2">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className={label}>{title}{count}</span>
        <span className="text-xs text-zinc-400 underline decoration-dotted underline-offset-2">Tout voir</span>
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

const Rows = ({ count }) => (
  <>
    <Row title="Certificats" count={count(18)}>
      <Item src={Coursera} title="IBM AI Developer" sub="Professional Certificate" />
      <Item src={THM} title="Jr Penetration Tester" sub="TryHackMe · 89 labs" />
    </Row>
    <Row title="Projets" count={count(30)}>
      <Item src={Argos} title="Argos" sub="Agents IA cyber" />
      <Item src={BlockTrader} title="BlockTrader" sub="Bot de trading · en test" />
    </Row>
  </>
);

const Card = ({ id, name, spec, note, recommended, children }) => (
  <section className="rounded-lg border border-white/10 bg-zinc-950/60 p-4">
    <div className="flex items-center gap-2">
      <h2 className="text-base font-semibold text-zinc-100">{id}. {name}</h2>
      {recommended && <span className="rounded-full border px-2 py-0.5 text-[11px]" style={{ color: GREEN, borderColor: `${GREEN}80` }}>Recommandée</span>}
    </div>
    <p className="mt-0.5 mb-3 text-xs text-zinc-400">{spec}</p>
    {children}
    <p className="mt-2 border-t border-white/10 pt-2 text-sm text-zinc-300">{note}</p>
  </section>
);

export default function CountStyles() {
  const [run, setRun] = useState(0);
  return (
    <main className="mx-auto max-w-[1040px] bg-black px-6 py-10 font-sans text-zinc-100">
      <h1 className="text-2xl font-bold">Totaux du Hero</h1>
      <p className="mt-2 mb-6 text-sm text-zinc-400">Vraie police et vraie largeur de colonne.</p>
      <div className="grid grid-cols-2 gap-5">
        {STYLES.map((style) => <Card key={style.id} {...style}><Rows count={style.count} /></Card>)}
        <Card id="10" name="Décompte à l’arrivée" spec="Vert · semi-gras · 16 px · animation unique de 0,9 s" note="Vivant et mémorable, mais une animation de plus dans un Hero déjà animé.">
          <Rows count={(n) => <CountUp to={n} run={run} />} />
          <button type="button" onClick={() => setRun((value) => value + 1)} className="mt-2 cursor-pointer rounded-md border border-white/20 px-2.5 py-1 text-xs text-zinc-100 hover:bg-white/10">Rejouer</button>
        </Card>
      </div>
    </main>
  );
}
