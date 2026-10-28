// Dev-only tuning page for the hero network (mockups.html?view=reseau, 2026-10-27).
// Drag to turn the network, wheel to zoom, sliders for everything else; « Copier les réglages »
// gives the JSON to apply to the hero (HERO_NETWORK in sections/Hero/core/network.ts). The network
// itself is the hero's own component, so what is tuned here is what the hero shows.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { assistantNetworkNodes } from '../../src/sections/Hero/core/assistantNodes'
import { HERO_NETWORK, NETWORK_DEFAULTS, type NetworkGuards, type NetworkMotion, type NetworkSettings } from '../../src/sections/Hero/core/network'
import NeuralNet from '../../src/sections/Hero/core/NeuralNet'

type Settings = NetworkSettings
type Guards = NetworkGuards
type Motion = NetworkMotion
const DEFAULTS = NETWORK_DEFAULTS
const RECOMMENDED = HERO_NETWORK

const STORE = 'network-tuner'
function loadSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null') as Partial<Settings> | null
    return { ...DEFAULTS, ...saved }
  } catch {
    return DEFAULTS
  }
}

export default function NetworkTuner() {
  const [s, setS] = useState<Settings>(loadSettings)
  const [big, setBig] = useState(false)
  const [copied, setCopied] = useState(false)
  const attackNow = useRef<() => void>(() => {})

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(s))
    } catch {
      // Private mode: the settings just are not remembered.
    }
  }, [s])

  const set = <K extends keyof Settings>(k: K, value: Settings[K]) => setS((p) => ({ ...p, [k]: value }))
  const copy = async () => {
    const json = JSON.stringify(s)
    try {
      await navigator.clipboard.writeText(json)
    } catch {
      window.prompt('Copie ces réglages :', json)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f14] font-sans text-zinc-200">
      <main className="relative flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <p className="text-xs text-zinc-500">Glisser pour tourner · molette pour zoomer · les curseurs à droite pour le reste</p>
        <div className={`relative ${big ? 'h-[calc(100vh-6rem)] w-full' : 'aspect-[6/5] w-[min(44rem,100%)] outline outline-1 outline-dashed outline-white/15'}`}>
          <NeuralNet settings={s} outputs={assistantNetworkNodes} onView={(view) => setS((p) => ({ ...p, ...view }))} attackRef={attackNow} />
        </div>
      </main>

      <aside className="h-screen w-[23rem] shrink-0 overflow-x-hidden overflow-y-auto border-l border-white/10 bg-zinc-950/80 p-4 text-sm">
        <div className="sticky -top-4 -mx-4 mb-3 flex flex-wrap gap-2 border-b border-white/10 bg-zinc-950 px-4 py-3">
          <button type="button" onClick={copy} className="rounded-sm bg-cyber px-3 py-1.5 font-semibold text-black">
            {copied ? 'Copié ✓' : 'Copier les réglages'}
          </button>
          <button type="button" onClick={() => setS(RECOMMENDED)} className="rounded-sm border border-cyber/60 px-3 py-1.5 text-cyber">
            Réglage conseillé
          </button>
          <button type="button" onClick={() => setS(DEFAULTS)} className="rounded-sm border border-white/20 px-3 py-1.5">
            Réinitialiser
          </button>
          <button type="button" onClick={() => attackNow.current()} className="rounded-sm border border-rose-500/60 px-3 py-1.5 text-rose-400">
            Attaque
          </button>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input type="checkbox" checked={big} onChange={(e) => setBig(e.target.checked)} /> Agrandir
          </label>
        </div>

        <Section title="Structure">
          <Range label="Entrées" k="inputs" min={2} max={6} step={1} s={s} set={set} />
          <Range label="Couches du modèle" k="hiddenLayers" min={1} max={4} step={1} s={s} set={set} />
          <Range label="Modèle : hauteur" k="rows" min={2} max={6} step={1} s={s} set={set} />
          <Range label="Modèle : profondeur" k="depth" min={1} max={5} step={1} s={s} set={set} />
          <label className="mb-2 flex items-center justify-between gap-2">
            <span className="text-zinc-400">Garde-fous</span>
            <select value={s.guards} onChange={(e) => set('guards', e.target.value as Guards)} className="min-w-0 max-w-[13rem] rounded-sm border border-white/15 bg-zinc-900 px-2 py-1">
              <option value="one">1 paroi (avant les sorties)</option>
              <option value="two">2 parois fines (entrée et sortie)</option>
            </select>
          </label>
          <Range label="Garde-fous : hauteur" k="guardRows" min={1} max={6} step={1} s={s} set={set} />
          <Range label="Garde-fous : profondeur" k="guardDepth" min={1} max={4} step={1} s={s} set={set} />
          <Check label="Couche Embedding" k="embedding" s={s} set={set} />
          <Range label="Embedding : taille du vecteur" k="embedSize" min={4} max={24} step={1} s={s} set={set} />
          <Range label="Embedding : vecteurs en profondeur" k="embedDepth" min={1} max={6} step={1} s={s} set={set} />
          <Check label="Plaque derrière l’embedding" k="embedPlate" s={s} set={set} />
          <Check label="Valeurs du vecteur au-dessus" k="embedNumbers" s={s} set={set} />
          <Range label="Densité des liens" k="linkDensity" min={0.1} max={1} step={0.05} s={s} set={set} />
          <Range label="Tirage aléatoire" k="seed" min={1} max={50} step={1} s={s} set={set} />
        </Section>
        <Section title="Espacement">
          <Range label="Entre les couches (x)" k="gapX" min={0.8} max={2.6} step={0.05} s={s} set={set} />
          <Range label="En hauteur (y)" k="gapY" min={0.4} max={1.8} step={0.05} s={s} set={set} />
          <Range label="En profondeur (z)" k="gapZ" min={0.2} max={2} step={0.05} s={s} set={set} />
          <Range label="Hauteur des entrées" k="inputSpread" min={0.5} max={5} step={0.1} s={s} set={set} />
          <Range label="Hauteur de l’embedding" k="embedSpread" min={0.5} max={6} step={0.1} s={s} set={set} />
          <Range label="Hauteur des sorties" k="outputSpread" min={2} max={6} step={0.1} s={s} set={set} />
          <Range label="Décalage horizontal" k="offsetX" min={-2} max={2} step={0.05} s={s} set={set} />
        </Section>
        <Section title="Vue (ou glisser / molette)">
          <Range label="Rotation (°)" k="yaw" min={-80} max={80} step={1} s={s} set={set} />
          <Range label="Inclinaison (°)" k="pitch" min={-45} max={45} step={1} s={s} set={set} />
          <Range label="Distance" k="distance" min={6} max={26} step={0.1} s={s} set={set} />
          <Range label="Objectif (fov)" k="fov" min={15} max={70} step={1} s={s} set={set} />
        </Section>
        <Section title="Rendu">
          <Range label="Taille des neurones" k="pointSize" min={0.1} max={0.8} step={0.01} s={s} set={set} />
          <Range label="Taille des sorties" k="outputSize" min={0.18} max={0.4} step={0.01} s={s} set={set} />
          <Range label="Opacité des liens" k="linkOpacity" min={0.05} max={1} step={0.01} s={s} set={set} />
          <Range label="Brouillard de profondeur" k="fog" min={0} max={0.9} step={0.01} s={s} set={set} />
          <ColorField label="Couleur devant" k="colorFront" s={s} set={set} />
          <ColorField label="Couleur au fond" k="colorBack" s={s} set={set} />
        </Section>
        <Section title="Plaques">
          <Check label="Afficher les plaques" k="plates" s={s} set={set} />
          <Range label="Points par colonne" k="plateDots" min={3} max={20} step={1} s={s} set={set} />
          <Range label="Taille des points" k="plateDotSize" min={0.02} max={0.2} step={0.005} s={s} set={set} />
          <Range label="Opacité" k="plateOpacity" min={0} max={1} step={0.01} s={s} set={set} />
          <Range label="Marge" k="plateMargin" min={0} max={1} step={0.05} s={s} set={set} />
        </Section>
        <Section title="Mouvement et trafic">
          <label className="mb-2 flex items-center justify-between gap-2">
            <span className="text-zinc-400">Mouvement</span>
            <select value={s.motion} onChange={(e) => set('motion', e.target.value as Motion)} className="min-w-0 max-w-[13rem] rounded-sm border border-white/15 bg-zinc-900 px-2 py-1">
              <option value="fixed">Fixe</option>
              <option value="drift">Dérive lente</option>
              <option value="pointer">Suit la souris</option>
            </select>
          </label>
          <Range label="Amplitude" k="motionAmount" min={0} max={1} step={0.01} s={s} set={set} />
          <Range label="Une requête toutes les (s)" k="requestEvery" min={0.2} max={4} step={0.1} s={s} set={set} />
          <Range label="Une attaque toutes les (s)" k="attackEvery" min={3} max={40} step={1} s={s} set={set} />
          <Check label="Montrer la paroi (aperçu)" k="showWall" s={s} set={set} />
        </Section>
      </aside>
    </div>
  )
}

type Setter = <K extends keyof Settings>(k: K, value: Settings[K]) => void
type NumberKey = { [K in keyof Settings]: Settings[K] extends number ? K : never }[keyof Settings]
type BoolKey = { [K in keyof Settings]: Settings[K] extends boolean ? K : never }[keyof Settings]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mb-4 border-t border-white/10 pt-3">
      <legend className="mb-2 pr-2 text-[11px] tracking-[0.18em] text-zinc-500 uppercase">{title}</legend>
      {children}
    </fieldset>
  )
}

function Range({ label, k, min, max, step, s, set }: { label: string; k: NumberKey; min: number; max: number; step: number; s: Settings; set: Setter }) {
  return (
    <label className="mb-2 block">
      <span className="flex justify-between text-zinc-400">
        {label} <span className="text-zinc-200 tabular-nums">{s[k]}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={s[k]} onChange={(e) => set(k, Number(e.target.value))} className="w-full accent-[var(--color-cyber)]" />
    </label>
  )
}

function Check({ label, k, s, set }: { label: string; k: BoolKey; s: Settings; set: Setter }) {
  return (
    <label className="mb-2 flex items-center gap-2 text-zinc-400">
      <input type="checkbox" checked={s[k]} onChange={(e) => set(k, e.target.checked)} /> {label}
    </label>
  )
}

function ColorField({ label, k, s, set }: { label: string; k: 'colorFront' | 'colorBack'; s: Settings; set: Setter }) {
  return (
    <label className="mb-2 flex items-center justify-between text-zinc-400">
      {label} <input type="color" value={s[k]} onChange={(e) => set(k, e.target.value)} className="h-7 w-12 bg-transparent" />
    </label>
  )
}

