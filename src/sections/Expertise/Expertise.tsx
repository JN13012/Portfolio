import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SectionHeader from '../../components/ui/SectionHeader'
import { ToolLogo } from '../../components/ui/ToolLogo/ToolLogo'
import { normalizeToolName } from '../../components/ui/ToolLogo/logoRegistry'
import { orderedDomains, projectCount, projectsByOrigin, type ExpertiseDomain } from '../../content/expertise'
import { tracksFromSearch } from '../../lib/projects'
import { cx } from '../../lib/cx'

/** Logos drawn small inside their image (wide wordmarks, padding) are scaled up to match the others. */
const ICON_SCALE: Record<string, number> = {
  // Wide wordmarks fill the width before the height.
  splunk: 1.3,
  snort: 1.25,
  remnux: 1.25,
  sqlmap: 1.15,
  spacy: 1.3,
  scikitlearn: 1.3,
  ffuf: 1.35,
  evilwinrm: 1.45,
  // Thin drawn emblems.
  faiss: 1.2,
  shapely: 1.35,
  responder: 1.15,
}

/** Height kept free under the fixed navigation when placing a card, and the wait before a hover opens it. */
const NAV_CLEARANCE = 80
const HOVER_DELAY = 150

/** accent: lines, glows; text: a brighter shade of the accent, readable as text on the dark page. */
const HUE: Record<ExpertiseDomain['id'], { accent: string; text: string }> = {
  ia: { accent: '#818cf8', text: '#a5b4fc' },
  data: { accent: '#eab308', text: '#fde047' },
  offensive: { accent: '#ef4444', text: '#f87171' },
  defensive: { accent: '#2563eb', text: '#60a5fa' },
  devops: { accent: '#f97316', text: '#fb923c' },
  dev: { accent: '#22c55e', text: '#4ade80' },
}

/**
 * Expertise: the domain list on the left chooses the domain; all its tools show in a grid on the right.
 */
export function Expertise() {
  // A targeted link (?metier=cyber…) puts that job's domains first and opens the first one.
  const [domains] = useState(() => orderedDomains(tracksFromSearch(window.location.search)))
  const [active, setActive] = useState(0)
  const domain = domains[active]!
  return (
    <section id="competences" className="py-24">
      <SectionHeader index="02" title="Expertise" />
      {/* The rail stays at the top of the section, without following the scroll; -mt-3.5 cancels the
          buttons' top padding so the first domain lines up with the grid, 56 px under the title like every section. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_1fr] lg:items-start">
        <div className="-mt-3.5">
          <RailHeaders domains={domains} active={active} onSelect={setActive} />
        </div>
        <div className="min-w-0">
          <ToolGrid key={domain.id} domain={domain} />
        </div>
      </div>
    </section>
  )
}

type HeaderProps = { domains: ExpertiseDomain[]; active: number; onSelect: (i: number) => void }

/**
 * Rail: a vertical list on the left, the logos on the right. The active domain is tinted in its
 * colour: a coloured line, and the name in a gradient from a light tint of the colour to white.
 */
function RailHeaders({ domains, active, onSelect }: HeaderProps) {
  return (
    <div role="group" aria-label="Domaines" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {domains.map((d, i) => {
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
 * Tool grid: every tool of the domain at once, each tile with its logo, name and its projects or what it does; on hover the tile lifts and lights up in the domain colour. Incomplete rows are centred.
 */
function ToolGrid({ domain }: { domain: ExpertiseDomain }) {
  const { accent } = HUE[domain.id]
  return (
    <ul aria-label={`Outils · ${domain.label.fr}`} className="flex animate-[fadeIn_400ms_ease-out_both] flex-wrap justify-center gap-3">
      {domain.tools.map((t) => (
        <li
          key={t.name}
          className="group relative flex w-[calc((100%-1.5rem)/3)] flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-zinc-950/45 px-3 pt-5 pb-4 text-center transition-all duration-300 outline-none hover:z-10 focus-within:z-10 has-[[aria-expanded=true]]:z-10 hover:-translate-y-1.5 hover:scale-[1.04] hover:border-[color:var(--accent)] hover:bg-zinc-900/70 hover:shadow-[0_18px_40px_-18px_var(--accent)] focus-visible:border-[color:var(--accent)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 sm:w-[calc((100%-3rem)/5)]"
          style={{ ['--accent' as string]: `${accent}80` }}
        >
          <span className="grid h-[76px] place-items-center">
            <ToolLogo name={t.name} size={Math.round(76 * (ICON_SCALE[normalizeToolName(t.name)] ?? 1))} tone={accent} />
          </span>
          <span className="text-sm font-semibold text-zinc-100">{t.name}</span>
          {t.projects ? <ToolProjects tool={t.name} slugs={t.projects} tone={HUE[domain.id].text} /> : (
            <span className="text-xs leading-snug text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">{t.note?.fr}</span>
          )}
          <span aria-hidden="true" className="mt-auto h-0.5 w-6 rounded-full opacity-40 transition-all duration-300 group-hover:w-10 group-hover:opacity-100" style={{ background: accent }} />
        </li>
      ))}
    </ul>
  )
}

/**
 * The number of projects using a tool, and a card listing them by origin. It opens above the button, or below it
 * when the navigation leaves too little room, and stays inside the grid. Opens after a short delay on hover,
 * and on keyboard focus or tap, until Escape or a tap elsewhere.
 */
function ToolProjects({ tool, slugs, tone }: { tool: string; slugs: string[]; tone: string }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || focused || pinned
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const arrow = useRef<HTMLSpanElement>(null)
  const delay = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(delay.current), [])
  useLayoutEffect(() => {
    const anchor = root.current?.getBoundingClientRect()
    const grid = root.current?.closest('ul')?.getBoundingClientRect()
    if (!open || !anchor || !grid || !panel.current || !arrow.current) return
    panel.current.style.maxWidth = `${grid.width}px`
    const center = anchor.left + anchor.width / 2
    const left = Math.max(grid.left, Math.min(center - panel.current.offsetWidth / 2, grid.right - panel.current.offsetWidth))
    panel.current.style.left = `${left - anchor.left}px`
    arrow.current.style.left = `${center - left}px`
    panel.current.dataset.side = anchor.top - panel.current.offsetHeight < NAV_CLEARANCE ? 'below' : 'above'
  }, [open])
  useEffect(() => {
    if (!pinned) return
    const close = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setPinned(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [pinned])
  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') delay.current = window.setTimeout(() => setHovered(true), HOVER_DELAY)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        window.clearTimeout(delay.current)
        setHovered(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${tool} : ${projectCount(slugs.length)}`}
        onClick={() => { if (!window.matchMedia('(hover: hover)').matches) setPinned((on) => !on) }}
        onFocus={(e) => setFocused(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => { if (e.key === 'Escape') { setFocused(false); setPinned(false) } }}
        className="cursor-pointer text-xs text-zinc-300 underline decoration-dotted underline-offset-2 hover:text-white"
      >
        {projectCount(slugs.length)}
      </button>
      {open && (
        // The padding bridges the gap, so the pointer can reach the card.
        <div ref={panel} className="group/card absolute z-20 w-max animate-[fadeIn_150ms_ease-out_both] text-left data-[side=above]:bottom-full data-[side=above]:pb-2.5 data-[side=below]:top-full data-[side=below]:pt-2.5">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900 text-xs shadow-[0_2px_4px_rgba(0,0,0,0.4),0_16px_40px_rgba(0,0,0,0.65)]">
            <div className="flex items-center gap-2.5 border-b border-white/10 px-3.5 py-2.5">
              <ToolLogo name={tool} size={22} tone={tone} />
              <span className="text-sm font-semibold text-zinc-100">{tool}</span>
              <span className="ml-auto pl-4 whitespace-nowrap text-zinc-400">{projectCount(slugs.length)}</span>
            </div>
            <div className="flex gap-6 px-3.5 py-3">
              {projectsByOrigin(slugs).map((group) => (
                <div key={group.title} className="min-w-0">
                  <p className="mb-1.5 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase" style={{ color: tone }}>{group.title} · {group.names.length}</p>
                  <ul className="space-y-1 text-zinc-200">{group.names.map((name) => <li key={name}>{name}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <span ref={arrow} aria-hidden="true" className="absolute size-2.5 -translate-x-1/2 rotate-45 border-white/10 bg-zinc-900 group-data-[side=above]/card:bottom-[5px] group-data-[side=above]/card:border-r group-data-[side=above]/card:border-b group-data-[side=below]/card:top-[5px] group-data-[side=below]/card:border-t group-data-[side=below]/card:border-l" />
        </div>
      )}
    </div>
  )
}
