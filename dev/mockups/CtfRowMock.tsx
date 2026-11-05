// Dev-only: /mockups.html?view=ctf-hero. The hero's proof list with its CTF row, whose three items can be
// dragged sideways to try a layout. Guides show the columns of the rows above; presets and a readout help
// pick one, and « Copier » gives the positions to report.
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { Terminal } from 'lucide-react'
import { Sentry } from '../../src/components/Sentry'
import { EthereumCrystal } from '../../src/components/ui/EthereumCrystal'
import Coursera from '../../src/assets/COURSERA.webp'
import THM from '../../src/assets/THM.jpg'
import Argos from '../../src/assets/Logos/Argos_Emblem_sm.webp'
import BlockTrader from '../../src/assets/Logos/BlockTrader_Emblem_sm.webp'
import CodeExecutor from '../../src/assets/Logos/ULIT_Heart_sm.webp'
import ZeroDay from '../../src/assets/Projets/ZeroDay.webp'

const GAP = 20 // the hero's 1.25em column gap at 16px
type Ctf = 'cyber' | 'ia' | 'blockchain'
type Positions = Record<Ctf, number>

const thumbBox = 'grid size-[44px] shrink-0 place-items-center'
const frame = (child: ReactNode) => <span className="grid h-[30px] w-full place-items-center rounded-md border border-white/10 bg-black/60">{child}</span>
const img = (src: string, cover = false) => <img src={src} alt="" className={cover ? 'size-full rounded-md border border-white/10 object-cover' : 'size-full object-contain'} />

function Item({ thumb, title, sub }: { thumb: ReactNode; title: string; sub: string }) {
  return (
    <span className="flex min-w-0 items-center gap-[13px]">
      <span className={thumbBox}>{thumb}</span>
      <span className="min-w-0">
        <span className="block truncate text-[17px] leading-tight text-zinc-100">{title}</span>
        <span className="mt-[3px] block truncate text-[13px] text-zinc-400">{sub}</span>
      </span>
    </span>
  )
}

function Label({ total, children }: { total?: number; children: string }) {
  return (
    <p className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
      {total !== undefined && <span className="mr-1 align-[-0.1em] text-[16px] font-semibold tracking-normal text-cyber">{total}</span>}
      {children}
    </p>
  )
}

const CTFS: Array<{ id: Ctf; node: ReactNode }> = [
  { id: 'cyber', node: <Item thumb={frame(<Terminal className="size-[18px] text-cyber" />)} title="Cyber" sub="9 niveaux" /> },
  { id: 'ia', node: <Item thumb={<Sentry size={38} />} title="IA" sub="10 niveaux" /> },
  { id: 'blockchain', node: <Item thumb={<EthereumCrystal className="h-[32px] w-auto" />} title="Blockchain" sub="3 niveaux" /> },
]

export default function CtfRowMock() {
  const [width, setWidth] = useState(466)
  const [snap, setSnap] = useState(true)
  const right = (width - GAP) / 2 + GAP // where the right-hand column of the rows above starts
  const presets: Record<string, (w: number, widths: Positions) => Positions> = {
    'Actuel : Blockchain sous la 2e colonne': (w) => ({ cyber: 0, ia: (w - GAP) / 4 + GAP / 2, blockchain: (w - GAP) / 2 + GAP }),
    'Trois colonnes égales': (w) => ({ cyber: 0, ia: (w + GAP) / 3, blockchain: (2 * (w + GAP)) / 3 }),
    'Réparti : début, centre, fin': (w, s) => ({ cyber: 0, ia: (w - s.ia) / 2, blockchain: w - s.blockchain }),
    'Serré à gauche': (_, s) => ({ cyber: 0, ia: s.cyber + 28, blockchain: s.cyber + 28 + s.ia + 28 }),
  }
  const sizes = useRef<Positions>({ cyber: 130, ia: 130, blockchain: 140 })
  const [pos, setPos] = useState<Positions>(() => presets['Actuel : Blockchain sous la 2e colonne']!(466, { cyber: 130, ia: 130, blockchain: 140 }))
  const [copied, setCopied] = useState(false)
  const guides = [0, right, width / 2]

  const drag = (id: Ctf) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    const startX = event.clientX
    const start = pos[id]
    const move = (e: PointerEvent) => {
      let x = Math.max(0, Math.min(width - sizes.current[id], start + e.clientX - startX))
      if (snap) {
        const near = [...guides, width - sizes.current[id]].find((g) => Math.abs(g - x) < 8)
        if (near !== undefined) x = near
      }
      setPos((p) => ({ ...p, [id]: Math.round(x) }))
    }
    const up = () => { target.removeEventListener('pointermove', move); target.removeEventListener('pointerup', up) }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', up)
  }
  const measure = (id: Ctf) => (el: HTMLDivElement | null) => { if (el) sizes.current[id] = Math.round(el.getBoundingClientRect().width) }
  const readout = (Object.keys(pos) as Ctf[]).map((id) => `${id} ${Math.round(pos[id])} px (${((pos[id] / width) * 100).toFixed(1)} %)`).join(' · ')

  return (
    <main className="min-h-screen bg-[#0b0f14] px-6 py-10 font-sans text-zinc-200">
      <h1 className="text-xl font-semibold text-white">Ligne CTF du Hero : disposition</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-400">
        Faites glisser Cyber, IA et Blockchain. Les lignes pointillées montrent le début de chaque colonne des lignes au-dessus ; avec l’aimant, un CTF s’y accroche.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        {Object.entries(presets).map(([name, f]) => (
          <button key={name} type="button" onClick={() => setPos(f(width, sizes.current))} className="rounded border border-white/15 px-3 py-1.5 hover:border-cyber/60">{name}</button>
        ))}
        <label className="ml-2 inline-flex items-center gap-2"><input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} /> Aimant</label>
        <label className="inline-flex items-center gap-2">Largeur du Hero <input type="range" min={360} max={640} value={width} onChange={(e) => setWidth(Number(e.target.value))} /> {width} px</label>
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-black/30 p-6" style={{ width: width + 48 }}>
        <dl className="divide-y divide-white/8 border-y border-white/8">
          <div className="space-y-2 py-3">
            <Label total={18}>Certificats</Label>
            <div className="grid grid-cols-2 gap-x-5">
              <Item thumb={img(Coursera, true)} title="IBM AI Developer" sub="Professional Certificate" />
              <Item thumb={img(THM, true)} title="Jr Penetration Tester" sub="TryHackMe · 89 labs" />
            </div>
          </div>
          <div className="space-y-2 py-3">
            <Label total={33}>Projets</Label>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <Item thumb={img(Argos)} title="Argos" sub="Agents IA cyber · en développement" />
              <Item thumb={img(BlockTrader)} title="BlockTrader" sub="Bot de trading · paper trading" />
              <Item thumb={img(CodeExecutor)} title="Code Executor" sub="En production chez ULIT" />
              <Item thumb={img(ZeroDay, true)} title="ZeroDay" sub="Jeu mobile · en conception" />
            </div>
          </div>
          <div className="space-y-2 py-3">
            <Label total={3}>CTF</Label>
            <div className="relative h-[52px]">
              {guides.map((g) => <span key={g} aria-hidden="true" className="absolute -top-[220px] bottom-0 border-l border-dashed border-cyber/30" style={{ left: g }} />)}
              {CTFS.map(({ id, node }) => (
                <div key={id} ref={measure(id)} onPointerDown={drag(id)} className="absolute top-1 cursor-grab touch-none rounded-md outline-1 outline-transparent select-none hover:outline-cyber/40 active:cursor-grabbing" style={{ left: pos[id] }}>
                  {node}
                </div>
              ))}
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <code className="rounded bg-white/5 px-2 py-1 text-zinc-300">{readout}</code>
        <button type="button" onClick={() => { void navigator.clipboard.writeText(`Largeur ${width} px · ${readout}`); setCopied(true) }} className="rounded border border-cyber/50 px-3 py-1.5 text-cyber">
          {copied ? 'Copié' : 'Copier'}
        </button>
      </div>
    </main>
  )
}
