// Dev-only (/?placer): drag the dashed frame to move the network's drawing area, drag its edges or
// corners to resize it, then « Copier » gives the values for HERO_PLACEMENT (core/placement.ts).
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { placementStyle, WIDE_FROM, type Placement } from './placement'

const WIDE = `${WIDE_FROM} px`
const LABELS = { top: 'Haut', right: 'Droite', bottom: 'Bas', left: 'Gauche' }

type Edge = 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const HANDLES: Array<{ edge: Edge; className: string }> = [
  { edge: 'n', className: '-top-1.5 left-4 right-4 h-3 cursor-ns-resize' },
  { edge: 's', className: '-bottom-1.5 left-4 right-4 h-3 cursor-ns-resize' },
  { edge: 'w', className: '-left-1.5 top-4 bottom-4 w-3 cursor-ew-resize' },
  { edge: 'e', className: '-right-1.5 top-4 bottom-4 w-3 cursor-ew-resize' },
  { edge: 'nw', className: '-top-2 -left-2 size-4 cursor-nwse-resize rounded-full bg-amber-400' },
  { edge: 'ne', className: '-top-2 -right-2 size-4 cursor-nesw-resize rounded-full bg-amber-400' },
  { edge: 'sw', className: '-bottom-2 -left-2 size-4 cursor-nesw-resize rounded-full bg-amber-400' },
  { edge: 'se', className: '-bottom-2 -right-2 size-4 cursor-nwse-resize rounded-full bg-amber-400' },
]

type PlacementToolProps = {
  value: Placement
  onChange: (p: Placement) => void
  /** Which set is being tuned (it depends on the window width). */
  set: 'normal' | 'wide'
  onReset: () => void
}

export function PlacementTool({ value, onChange, set, onReset }: PlacementToolProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const start = (edge: Edge) => (e: ReactPointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const box = frame.current?.parentElement?.getBoundingClientRect()
    if (!box) return
    const from = { x: e.clientX, y: e.clientY, p: value }
    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - from.x) / box.width) * 100
      const dy = ((ev.clientY - from.y) / box.height) * 100
      const p = { ...from.p }
      if (edge === 'move' || edge.includes('n')) p.top = from.p.top + dy
      if (edge === 'move' || edge.includes('s')) p.bottom = from.p.bottom - dy
      if (edge === 'move' || edge.includes('w')) p.left = from.p.left + dx
      if (edge === 'move' || edge.includes('e')) p.right = from.p.right - dx
      onChange({ top: Math.round(p.top), right: Math.round(p.right), bottom: Math.round(p.bottom), left: Math.round(p.left) })
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const copy = async () => {
    const text = `${set}: ${JSON.stringify(value)}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      window.prompt('Copie ces valeurs :', text)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={frame} style={placementStyle(value)} className="absolute z-[60] border-2 border-dashed border-amber-400/80 bg-amber-400/5">
      <div onPointerDown={start('move')} className="absolute inset-4 cursor-move" title="Glisser pour déplacer" />
      {HANDLES.map((h) => (
        <div key={h.edge} onPointerDown={start(h.edge)} className={`absolute ${h.className}`} />
      ))}
      {/* Fixed panel: the frame can reach off-screen (up under the menu, right past the edge). */}
      <div onPointerDown={(e) => e.stopPropagation()} className="fixed bottom-4 left-4 z-[70] flex flex-col gap-2 rounded-sm border border-amber-400/60 bg-black/95 p-3 text-xs text-amber-200 shadow-xl">
        <p className="font-semibold">Placement du réseau · {set === 'wide' ? `écran large (≥ ${WIDE})` : `écran normal (< ${WIDE})`}</p>
        <p className="text-amber-200/70">Glisser le cadre pour déplacer, ses bords ou coins pour redimensionner.</p>
        <div className="grid grid-cols-4 gap-2">
          {(['top', 'right', 'bottom', 'left'] as const).map((k) => (
            <label key={k} className="flex flex-col gap-1">
              {LABELS[k]} (%)
              <input type="number" value={value[k]} onChange={(e) => onChange({ ...value, [k]: Number(e.target.value) })} className="w-16 rounded-sm border border-amber-400/40 bg-zinc-900 px-1.5 py-1 text-amber-100" />
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={copy} className="rounded-sm bg-amber-400 px-2.5 py-1 font-semibold text-black">
            {copied ? 'Copié ✓' : 'Copier les valeurs'}
          </button>
          <button type="button" onClick={onReset} className="rounded-sm border border-amber-400/60 px-2.5 py-1">
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}
