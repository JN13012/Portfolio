import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  siExpress,
  siGithubactions,
  siGradio,
  siHuggingface,
  siJest,
  siKubernetes,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siPytest,
  siRedis,
  siSalesforce,
  siSpacy,
  siTypescript,
  siVitest,
  type SimpleIcon,
} from 'simple-icons'
import SectionHeader from '../../components/SectionHeader'
import { TOOL_ICONS } from './toolIcons'
import { expertise, type ExpertiseDomain } from '../../content/expertise'
import { emblem } from './emblems'
import { cx } from '../../lib/cx'
import { useReducedMotion } from '../../lib/useReducedMotion'

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

// Logos: the colour icons first, then Simple Icons (CC0), then drawn emblems, else a monogram.
const PNG: Record<string, string> = Object.fromEntries(Object.entries(TOOL_ICONS).map(([k, v]) => [key(k), v]))
const SVG: Record<string, SimpleIcon> = {
  huggingfacetransformers: siHuggingface,
  gradio: siGradio,
  spacy: siSpacy,
  kubernetes: siKubernetes,
  githubactions: siGithubactions,
  vitest: siVitest,
  jest: siJest,
  pytest: siPytest,
  typescript: siTypescript,
  apex: siSalesforce,
  nextjs: siNextdotjs,
  nestjs: siNestjs,
  express: siExpress,
  prisma: siPrisma,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  redis: siRedis,
}

/** accent: lines, glows; text: a brighter shade of the accent, readable as text on the dark page. */
const HUE: Record<ExpertiseDomain['id'], { accent: string; text: string }> = {
  ia: { accent: '#818cf8', text: '#a5b4fc' },
  offensive: { accent: '#ef4444', text: '#f87171' },
  defensive: { accent: '#2563eb', text: '#60a5fa' },
  devops: { accent: '#f59e0b', text: '#fbbf24' },
  dev: { accent: '#22c55e', text: '#4ade80' },
}

const PERSPECTIVE = 1100

/** Brand colours too dark for a dark card are drawn light instead. */
const readable = (hex: string) => {
  const n = parseInt(hex, 16)
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return l < 0.32 ? '#e4e4e7' : `#${hex}`
}

export function Logo({ name, size, className, tone = '#a1a1aa' }: { name: string; size: number; className?: string; tone?: string }) {
  const k = key(name)
  if (PNG[k]) return <img src={PNG[k]} alt="" loading="lazy" draggable={false} className={cx('object-contain', className)} style={{ width: size, height: size }} />
  const icon = SVG[k]
  if (icon)
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={{ width: size * 0.82, height: size * 0.82 }}>
        <path d={icon.path} fill={readable(icon.hex)} />
      </svg>
    )
  const drawn = emblem(name, size, tone, className)
  if (drawn) return drawn
  const letters = name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean)
  const mono = (letters.length > 1 ? letters[0]![0]! + letters[1]![0]! : name.slice(0, 2)).toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={cx('grid place-items-center rounded-2xl border font-semibold tracking-wide', className)}
      style={{ width: size * 0.74, height: size * 0.74, fontSize: size * 0.26, color: tone, borderColor: `${tone}55`, background: `linear-gradient(160deg, ${tone}22, ${tone}08)` }}
    >
      {mono}
    </span>
  )
}

/**
 * Expertise: the domain list on the left chooses the domain; its tools sit on a carousel on the
 * right, turned by hand. Nothing moves by itself.
 */
export function Expertise() {
  const [active, setActive] = useState(0)
  const domain = expertise[active]!
  return (
    <section id="competences" className="scroll-mt-24 py-24">
      <SectionHeader index="02" title="Expertise" />
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:items-center">
        <RailHeaders active={active} onSelect={setActive} />
        <div className="min-w-0">
          <ToolCarousel key={domain.id} domain={domain} />
        </div>
      </div>
    </section>
  )
}

type HeaderProps = { active: number; onSelect: (i: number) => void }

/**
 * Rail: a vertical list on the left, the logos on the right. The active domain is tinted in its
 * colour: a coloured line, and the name in a gradient from a light tint of the colour to white.
 */
function RailHeaders({ active, onSelect }: HeaderProps) {
  return (
    <div role="group" aria-label="Domaines" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {expertise.map((d, i) => {
        const on = i === active
        const { accent, text } = HUE[d.id]
        return (
          <button
            key={d.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(i)}
            className="group relative flex shrink-0 items-center gap-3.5 rounded-lg py-3.5 pr-4 pl-4 text-left"
          >
            <span className={cx('relative text-xs tabular-nums transition-colors', on ? 'text-zinc-300' : 'text-zinc-600')}>{String(i + 1).padStart(2, '0')}</span>
            <span
              aria-hidden="true"
              className={cx('relative h-0.5 shrink-0 rounded-full transition-all duration-500', on ? 'w-8' : 'w-3 bg-zinc-600 group-hover:w-5 group-hover:bg-zinc-400')}
              style={on ? { background: accent } : undefined}
            />
            <span
              className={cx('relative mr-auto text-[17px] whitespace-nowrap transition-all duration-300', on ? 'font-semibold' : 'font-medium text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-200')}
              // Sized to the word, so short and long names get the same gradient (colour, then towards white).
              style={on ? { backgroundImage: `linear-gradient(90deg, ${text} 10%, #ffffff 115%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : undefined}
            >
              {d.label.fr}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Tool carousel: one tool is selected in the centre, larger, with its name and use above it.
 * The arrows, the mouse wheel (captured over the carousel), the keyboard, a drag or a click on a
 * neighbour move the selection one tool at a time, in a loop. Neighbours carry on
 * round a cylinder, smaller, turned away and fading.
 */
function ToolCarousel({ domain }: { domain: ExpertiseDomain }) {
  const reduced = useReducedMotion()
  const lane = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  // The selected tool, and the one before the last move (to spot tools jumping across the loop).
  const [pos, setPos] = useState({ active: 0, prev: 0 })
  const active = pos.active
  const { accent } = HUE[domain.id]
  const tools = domain.tools
  const n = tools.length
  const tool = tools[active]!

  const phone = width > 0 && width < 520
  // Logos on each side of the selected one before they fade out.
  const reach = phone ? 1 : 3
  // Spread the neighbours so the outermost one ends just inside the arrows: its centre sits at
  // reach (1 - 0.8^reach) / 0.2 + 0.28 steps from the middle (see the layout below).
  const arrowRoom = phone ? 56 : 72
  const outer = (1 - 0.8 ** reach) / 0.2 + 0.28
  const step = width ? Math.max(70, (width / 2 - arrowRoom - (phone ? 26 : 36)) / outer) : 110
  const base = Math.min(phone ? 64 : 96, step * 0.78)

  // The carousel loops: past the last tool comes the first again.
  const wrap = (i: number) => ((i % n) + n) % n
  const setActive = (next: (i: number) => number) => setPos((p) => ({ active: wrap(next(p.active)), prev: p.active }))
  const go = (i: number) => setActive(() => i)
  // Offset of a tool from the selected one on the loop, in -n/2..n/2.
  const offset = (i: number, from: number) => {
    const o = wrap(i - from)
    return o > n / 2 ? o - n : o
  }

  useEffect(() => {
    const el = lane.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => e && setWidth(e.contentRect.width))
    ro.observe(el)
    // One wheel notch = one tool; small trackpad deltas add up first. The page never scrolls from here.
    let acc = 0
    let last = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      acc += delta
      const now = performance.now()
      if (Math.abs(acc) < 40 || now - last < 90) return
      last = now
      // Read the direction now: the updater may run later, after acc is reset.
      const dir = Math.sign(acc)
      setPos((p) => ({ active: (((p.active + dir) % n) + n) % n, prev: p.active }))
      acc = 0
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      ro.disconnect()
      el.removeEventListener('wheel', onWheel)
    }
  }, [n])

  // Drag: every 60 px moves one tool (vertical swipes still scroll the page on touch screens).
  const drag = useRef<{ x: number; from: number } | null>(null)
  const onDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, from: active }
  }
  const onMove = (e: PointerEvent) => {
    if (drag.current) go(drag.current.from - Math.round((e.clientX - drag.current.x) / 60))
  }
  const onUp = () => {
    drag.current = null
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(active + 1)
    else if (e.key === 'ArrowLeft') go(active - 1)
    else return
    e.preventDefault()
  }

  const arrow = 'absolute top-1/2 z-[200] grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/85 text-white transition-all duration-300 hover:border-white/45 hover:bg-white/15 disabled:cursor-default disabled:opacity-25 sm:size-14'
  const ease = reduced ? 'none' : 'transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 420ms ease'

  return (
    <div className="relative mt-4">
      <button type="button" onClick={() => go(active - 1)} aria-label="Outil précédent" className={cx(arrow, 'left-0')}>
        <ChevronLeft size={26} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => go(active + 1)} aria-label="Outil suivant" className={cx(arrow, 'right-0')}>
        <ChevronRight size={26} aria-hidden="true" />
      </button>

      <div className="relative animate-[fadeIn_400ms_ease-out_both]">
        {/* Glow behind the selected tool. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[62%] left-1/2 h-48 w-[64%] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{ background: `radial-gradient(closest-side, ${accent}cc, ${accent}26 60%, transparent)` }}
        />

        {/* Name and use of the selected tool, always shown. */}
        <div aria-live="polite" className="relative z-10 flex h-16 flex-col items-center justify-end text-center">
          <p key={tool.name} className="motion-safe:animate-[fadeIn_300ms_ease-out_both]">
            <span className="block text-lg font-semibold tracking-[0.16em] uppercase sm:text-[20px]" style={{ color: accent, textShadow: `0 0 8px ${accent}, 0 0 22px ${accent}99` }}>
              {tool.name}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.14em] text-white/85 uppercase sm:text-[12px]">{tool.note.fr}</span>
          </p>
        </div>

        <div
          ref={lane}
          role="region"
          aria-roledescription="carrousel"
          aria-label={`Outils · ${domain.label.fr}`}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
          className="relative z-10 cursor-grab touch-pan-y select-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-cyber/60 active:cursor-grabbing"
          style={{ height: base * 1.45 + 40 }}
        >
          <ul className="absolute inset-0" style={{ perspective: PERSPECTIVE }}>
            {tools.map((t, i) => {
              const o = offset(i, active)
              // A tool jumping from one end of the loop to the other moves without animation (out of sight).
              const jumped = Math.abs(o - offset(i, pos.prev)) > 1
              const a = Math.abs(o)
              // Only the visible logos (and one more each side, to fade in) are in the page.
              if (a > reach + 1) return null
              const side = Math.sign(o)
              // Each step out sits a little closer than the previous one, shrinks, turns away and fades.
              const decay = 0.8
              const z = -a * step * 0.35
              // Pushed back, a logo also drifts towards the middle (perspective): widen x to compensate.
              const x = (side * ((step * (1 - decay ** a)) / (1 - decay)) + (a ? side * step * 0.28 : 0)) * ((PERSPECTIVE - z) / PERSPECTIVE)
              const scale = a === 0 ? 1.45 : decay ** (a - 1)
              const shown = a <= reach + 1
              return (
                <li
                  key={t.name}
                  className="absolute top-1/2 left-1/2 flex items-center justify-center"
                  style={{
                    width: base,
                    height: base,
                    transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-side * Math.min(60, a * 24)}deg) scale(${scale})`,
                    opacity: a > reach ? 0 : a === 0 ? 1 : Math.max(0.25, 1 - a * 0.24),
                    zIndex: 100 - a,
                    pointerEvents: shown && a <= reach ? 'auto' : 'none',
                    transition: jumped ? 'none' : ease,
                  }}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    // Mouse shortcut only: screen readers get the list below, keyboards the arrow keys.
                    aria-hidden="true"
                    onClick={() => go(i)}
                    className="grid size-full cursor-pointer place-items-center"
                  >
                    <Logo name={t.name} size={base} tone={accent} className="drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Position in the list. */}
      <div aria-hidden="true" className="relative mx-auto mt-2 h-0.5 w-40 rounded-full bg-white/10">
        <span
          className="absolute inset-y-0 rounded-full"
          style={{ width: `${100 / n}%`, left: `${(active / n) * 100}%`, background: accent, transition: reduced ? 'none' : 'left 400ms ease' }}
        />
      </div>
      {/* The full list, for screen readers. */}
      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.name}>
            {t.name} : {t.note.fr}
          </li>
        ))}
      </ul>
    </div>
  )
}
