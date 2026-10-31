// The hero's proofs (2026-10-27): one row per kind, its label on the left and two items side by side,
// each a thumbnail with a title and a short line, aligned from row to row. A certificate or a project
// opens its modal; the master and the cyber lab open a small panel in place, whose button is the only
// way down to their section (the visitor never jumps without asking).
import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { ArrowRight, Terminal, X } from 'lucide-react'
import { hero } from '../../content/hero'
import { projects } from '../../content/projects'
import { timeline } from '../../content/timeline'
import writeups from '../../content/writeups.json'
import Coursera from '../../assets/COURSERA.webp'
import THM from '../../assets/THM.jpg'
import Epitech from '../../assets/Formations/Epitech.webp'
import CodeExecutor from '../../assets/Logos/ULIT_Heart_sm.webp'
import BlockTrader from '../../assets/Logos/BlockTrader_Emblem_sm.webp'
import Argos from '../../assets/Logos/Argos_Emblem_sm.webp'
import ZeroDay from '../../assets/Projets/ZeroDay.webp'
import { emitCore } from '../../lib/coreBus'
import { cx } from '../../lib/cx'
import { Sentry } from '../../components/Sentry'

const LOGOS: Record<string, string> = { ibm: Coursera, thm: THM }
/** Project thumbnails: an emblem shown whole, or a screenshot cropped. */
const PROJECT_IMAGES: Record<string, { src: string; fit: 'contain' | 'cover' }> = {
  'salesforce-executor': { src: CodeExecutor, fit: 'contain' },
  blocktrader: { src: BlockTrader, fit: 'contain' },
  argos: { src: Argos, fit: 'contain' },
  zeroday: { src: ZeroDay, fit: 'cover' },
}
const master = timeline.find((t) => t.id === hero.formation.timeline)!
const count = (source: string) => writeups.writeups.filter((w) => w.source === source).length
const fill = (text: string) =>
  text
    .replace('{n}', String(writeups.writeups.length))
    .replace('{epitech}', String(count('epitech')))
    .replace('{thm}', String(count('tryhackme')))

type PanelId = 'master' | 'lab'
/** Where each panel opens on desktop: right of the pointer, growing down (master) or up (lab, low in the list). */
const GROWS: Record<PanelId, 'down' | 'up'> = { master: 'down', lab: 'up' }
/** The panel's anchor in the list's box (px): the click point, or the opener's right edge from the keyboard. */
type Anchor = { x: number; y: number; height: number }
const DESKTOP = '(min-width: 1024px)'

/** A thumbnail slot, sized with the text column; its content is a framed image, or an emblem floating free. */
function Thumb({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('grid size-[2.75em] shrink-0 place-items-center', className)}>{children}</span>
}

/** A logo or a screenshot crop, with rounded corners; an emblem (contain) floats without a frame. */
const img = (src: string, fit: 'contain' | 'cover' = 'cover') => (
  <img src={src} alt="" className={cx('size-full', fit === 'contain' ? 'object-contain' : 'rounded-md border border-white/10 object-cover')} />
)

type ItemProps = { thumb: ReactNode; title: string; sub: string; extra?: ReactNode } & (
  | { onClick: (e: MouseEvent<HTMLButtonElement>) => void; panel?: boolean; expanded?: boolean }
  | { onClick?: never; panel?: never; expanded?: never }
)

/** One proof: its thumbnail, then its title and a short line under it. Without onClick it is not clickable. */
function Item({ thumb, title, sub, extra, onClick, panel, expanded }: ItemProps) {
  const body = (
    <>
      {thumb}
      <span className="min-w-0 flex-1">
        <span className={cx('flex items-center gap-[0.5em] text-[1.0625em] leading-tight', onClick ? 'text-zinc-100' : 'text-zinc-400')}>
          <span className="truncate underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-cyber">{title}</span>
          {extra}
        </span>
        <span className="mt-[0.2em] block truncate text-[max(11px,0.8125em)] text-zinc-400">{sub}</span>
      </span>
    </>
  )
  if (!onClick) return <div className="flex w-full min-w-0 items-center gap-[0.8em]">{body}</div>
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={panel ? expanded : undefined}
      data-panel-opener={panel || undefined}
      className="group flex w-full min-w-0 items-center gap-[0.8em] rounded-md text-left focus-visible:shadow-focus focus-visible:outline-none"
    >
      {body}
    </button>
  )
}

/**
 * A row: its label on the left, level with the first items' titles, then its items on the two columns
 * shared by every row (2026-10-27, saves height). Medium column: the label above; narrow: everything stacked.
 */
function Row({ label, rows = 1, children }: { label: string; rows?: number; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-x-[1.25em] gap-y-[0.45em] py-[0.55em] @[24rem]:grid-cols-2 @[32rem]:grid-cols-[5.25em_minmax(0,1fr)_minmax(0,1fr)]">
      <dt
        className={cx(
          'text-[max(10px,0.6875em)] tracking-[0.2em] text-zinc-500 uppercase @[24rem]:col-span-2 @[32rem]:col-span-1 @[32rem]:mt-[0.95em] @[32rem]:self-start',
          rows === 2 && '@[32rem]:row-span-2',
        )}
      >
        {label}
      </dt>
      {children}
    </div>
  )
}

export function HeroProofs() {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [anchor, setAnchor] = useState<Anchor | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const open = (id: PanelId) => (e: MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget
    const list = box.current!.getBoundingClientRect()
    const b = e.currentTarget.getBoundingClientRect()
    // A keyboard click has no pointer position (detail 0): the opener's text end, mid-height.
    const pointer = e.detail > 0
    setAnchor({
      x: (pointer ? e.clientX : b.right) - list.left,
      y: (pointer ? e.clientY : b.top + b.height / 2) - list.top,
      height: list.height,
    })
    setPanel((p) => (p === id ? null : id))
  }
  // Desktop: the panel sits right of the pointer; mobile: under the list, full width.
  const place = (id: PanelId): CSSProperties | undefined => {
    if (!anchor || !window.matchMedia(DESKTOP).matches) return undefined
    const left = anchor.x + 16
    return GROWS[id] === 'down' ? { left, top: anchor.y - 12 } : { left, top: 'auto', bottom: anchor.height - anchor.y - 12 }
  }
  const close = () => {
    setPanel(null)
    opener.current?.focus({ preventScroll: true })
  }

  return (
    <div ref={box} className="relative">
      <dl className="divide-y divide-white/8 border-y border-white/8">
        <Row label={hero.proofTitles.formation.fr}>
          <dd className="@[24rem]:col-span-2">
            <Item thumb={<Thumb>{img(Epitech)}</Thumb>} title={hero.formation.title.fr} sub={hero.formation.detail.fr} onClick={open('master')} panel expanded={panel === 'master'} />
          </dd>
        </Row>
        <Row label={hero.proofTitles.certified.fr}>
          {hero.certificates.map((c) => (
            <dd key={c.id} className="min-w-0">
              <Item thumb={<Thumb>{img(LOGOS[c.id]!)}</Thumb>} title={c.title} sub={c.detail.fr} onClick={() => emitCore('openCredential', { id: c.credential })} />
            </dd>
          ))}
        </Row>
        <Row label={hero.proofTitles.projects.fr} rows={2}>
          {hero.projects.map((x) => {
            const image = PROJECT_IMAGES[x.slug]!
            return (
              <dd key={x.slug} className="min-w-0">
                <Item
                  thumb={<Thumb>{img(image.src, image.fit)}</Thumb>}
                  title={projects.find((p) => p.slug === x.slug)!.title}
                  sub={x.detail.fr}
                  onClick={() => emitCore('openProject', { slug: x.slug })}
                />
              </dd>
            )
          })}
        </Row>
        <Row label={hero.proofTitles.labs.fr}>
          {hero.labs.map((l) => (
            <dd key={l.id} className="min-w-0">
              {l.id === 'ia' ? (
                // The agent to red-team; played from the Lab section.
                <Item
                  thumb={
                    <Thumb>
                      <Sentry size={46} />
                    </Thumb>
                  }
                  title={l.label.fr}
                  sub={l.detail.fr}
                />
              ) : (
                <Item
                  thumb={
                    <Thumb>
                      {/* A small terminal window: wider than tall. */}
                      <span className="grid h-[1.9em] w-full place-items-center rounded-md border border-white/10 bg-black/60">
                        <Terminal aria-hidden="true" className="size-[1.15em] text-cyber" />
                      </span>
                    </Thumb>
                  }
                  title={l.label.fr}
                  sub={fill(l.detail.fr)}
                  onClick={open('lab')}
                  panel
                  expanded={panel === 'lab'}
                />
              )}
            </dd>
          ))}
        </Row>
      </dl>

      {panel === 'master' && (
        <Panel style={place('master')} title={master.title.fr} onClose={close} cta={hero.formation.cta.fr} target={hero.formation.target}>
          <p className="text-zinc-400">
            {master.periodLabel?.fr} · {master.badge?.fr}
          </p>
          <p>{master.summary.fr}</p>
          <ul className="list-disc space-y-[0.3em] pl-[1.1em] marker:text-cyber">
            {master.highlights?.slice(0, 3).map((h) => <li key={h.fr}>{h.fr}</li>)}
          </ul>
        </Panel>
      )}
      {panel === 'lab' && (
        <Panel style={place('lab')} title={hero.labPanel.title.fr} onClose={close} cta={hero.labPanel.cta.fr} target={hero.labPanel.target}>
          <p>{hero.labPanel.intro.fr}</p>
          <ul className="space-y-[0.3em]">
            {hero.labPanel.phases.map((x) => (
              <li key={x.title.fr}>
                <span className="text-cyber-light">{x.title.fr}</span> · {x.text.fr}
              </li>
            ))}
          </ul>
          <p className="text-zinc-400">{fill(hero.labPanel.writeups.fr)}</p>
        </Panel>
      )}
    </div>
  )
}

/** A small panel over the hero, right of the pointer on desktop (placed by `style`), under the list on mobile: Escape, a click outside or ✕ close it. */
function Panel({ title, cta, target, style, onClose, children }: { title: string; cta: string; target: string; style?: CSSProperties; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  // The latest onClose, so the listeners are set once while the panel is open.
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
    const onClose = () => closeRef.current()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      if (!ref.current?.contains(t) && !t.closest('[data-panel-opener]')) onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])
  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      style={style}
      className="absolute top-full left-0 z-30 mt-[0.5em] w-full max-w-[34em] lg:mt-0 lg:w-[30em] rounded-sm border border-cyber/30 bg-zinc-950/95 p-[1em] text-[0.875em] leading-relaxed text-zinc-200 shadow-[0_18px_48px_rgba(0,0,0,0.6)] backdrop-blur-md focus:outline-none"
    >
      <div className="mb-[0.5em] flex items-start justify-between gap-[1em]">
        <p id={titleId} className="font-semibold text-zinc-100">
          {title}
        </p>
        <button type="button" onClick={onClose} aria-label={hero.close.fr} className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-sm text-zinc-400 hover:text-zinc-100 focus-visible:shadow-focus focus-visible:outline-none">
          <X size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-[0.6em]">{children}</div>
      <a href={target} onClick={onClose} className={cx('mt-[0.9em] inline-flex items-center gap-[0.4em] text-cyber hover:text-cyber-light focus-visible:shadow-focus focus-visible:outline-none')}>
        {cta} <ArrowRight aria-hidden="true" className="size-[1em]" />
      </a>
    </div>
  )
}
