// The hero's proofs (2026-10-27): one row per kind, its label on the left and two items side by side,
// each a thumbnail with a title and a short line, aligned from row to row. A certificate or a project
// opens its modal; the master and the cyber lab open a small panel in place, whose button is the only
// way down to their section (the visitor never jumps without asking).
import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { ArrowRight, Terminal, X } from 'lucide-react'
import { credentials } from '../../content/certifications'
import { hero } from '../../content/hero'
import { projects } from '../../content/projects'
import { timeline } from '../../content/timeline'
import writeups from '../../content/writeups.json'
import { emitCore } from '../../lib/coreBus'
import { cx } from '../../lib/cx'
import { Sentry } from '../../components/Sentry'
import { EthereumCrystal } from '../../components/ui/EthereumCrystal'

const master = timeline.find((t) => t.id === hero.formation.timeline)!
const count = (source: string) => writeups.writeups.filter((w) => w.source === source).length
const fill = (text: string) =>
  text
    .replace('{n}', String(writeups.writeups.length))
    .replace('{epitech}', String(count('epitech')))
    .replace('{thm}', String(count('tryhackme')))

type PanelId = 'master' | 'lab' | 'labIa' | 'labChain'
/** Where each panel opens on desktop: right of the pointer, growing down (master) or up (lab, low in the list). */
const GROWS: Record<PanelId, 'down' | 'up'> = { master: 'down', lab: 'up', labIa: 'up', labChain: 'up' }
/** The panel's anchor in the list's box (px): the click point, or the opener's right edge from the keyboard. */
type Anchor = { x: number; y: number; height: number }
const DESKTOP = '(min-width: 1024px)'

/** The CTF row's thumbnails: a little narrower, three items share the width of two. */
const CTF_THUMB = 'size-[2.35em]'

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
          {/* Room under the title: truncate clips its overflow, and the underline sits below the line box. */}
          <span className="-mb-[0.35em] truncate pb-[0.35em] underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-cyber">{title}</span>
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
function Row({ label, total, rows = 1, columns = 2, children }: { label: string; total?: number; rows?: number; columns?: 2 | 3; children: ReactNode }) {
  return (
    <div className={cx('grid grid-cols-1 items-center gap-y-[0.45em] py-[0.55em]', columns === 3
      // Three equal columns, each CTF at the start of its own (Jérémie, 2026-11-05).
      ? 'gap-x-[1.25em] @[24rem]:grid-cols-3 @[32rem]:grid-cols-[5.25em_repeat(3,minmax(0,1fr))]'
      : 'gap-x-[1.25em] @[24rem]:grid-cols-2 @[32rem]:grid-cols-[5.25em_minmax(0,1fr)_minmax(0,1fr)]')}>
      <dt
        className={cx(
          'text-[max(10px,0.6875em)] tracking-[0.2em] text-zinc-500 uppercase @[32rem]:col-span-1 @[32rem]:mt-[0.95em] @[32rem]:self-start',
          columns === 3 ? '@[24rem]:col-span-3' : '@[24rem]:col-span-2',
          rows === 2 && '@[32rem]:row-span-2',
        )}
      >
        {total !== undefined && <span className="mr-[0.2em] align-[-0.1em] text-[1.45em] font-semibold tracking-normal text-cyber">{total} </span>}
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
            <Item thumb={<Thumb>{img(hero.formation.thumb)}</Thumb>} title={hero.formation.title.fr} sub={hero.formation.detail.fr} onClick={open('master')} panel expanded={panel === 'master'} />
          </dd>
        </Row>
        <Row label={hero.proofTitles.certified.fr} total={credentials.length}>
          {hero.certificates.map((c) => (
            <dd key={c.id} className="min-w-0">
              <Item thumb={<Thumb>{img(c.thumb)}</Thumb>} title={c.title} sub={c.detail.fr} onClick={() => emitCore('openCredential', { id: c.credential })} />
            </dd>
          ))}
        </Row>
        <Row label={hero.proofTitles.projects.fr} total={projects.length} rows={2}>
          {hero.projects.map((x) => {
            return (
              <dd key={x.slug} className="min-w-0">
                <Item
                  thumb={<Thumb>{img(x.thumb.src, x.thumb.fit)}</Thumb>}
                  title={projects.find((p) => p.slug === x.slug)!.title}
                  sub={x.detail.fr}
                  onClick={() => emitCore('openProject', { slug: x.slug })}
                />
              </dd>
            )
          })}
        </Row>
        <Row label={hero.proofTitles.labs.fr} total={hero.labs.length} columns={3}>
          {hero.labs.map((l) => (
            <dd key={l.id} className="min-w-0">
              {l.id === 'ia' ? (
                // The agent to red-team: its panel leads to the AI side of the Lab.
                <Item thumb={<Thumb className={CTF_THUMB}><Sentry size={40} /></Thumb>} title={l.label.fr} sub={l.detail.fr} onClick={open('labIa')} panel expanded={panel === 'labIa'} />
              ) : l.id === 'blockchain' ? (
                <Item
                  thumb={
                    <Thumb className={CTF_THUMB}>
                      {/* Ethereum's crystal, floating free (no frame, no glow): the smart contracts run on its virtual machine. */}
                      <EthereumCrystal className="h-[2.2em] w-auto" />
                    </Thumb>
                  }
                  title={l.label.fr}
                  sub={l.detail.fr}
                  onClick={open('labChain')}
                  panel
                  expanded={panel === 'labChain'}
                />
              ) : (
                <Item
                  thumb={
                    <Thumb className={CTF_THUMB}>
                      {/* A small terminal window: wider than tall. */}
                      <span className="grid h-[1.9em] w-full place-items-center rounded-md border border-white/10 bg-black/60">
                        <Terminal aria-hidden="true" className="size-[1.15em] text-cyber" />
                      </span>
                    </Thumb>
                  }
                  title={l.label.fr}
                  sub={l.detail.fr}
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
      {panel === 'labChain' && (
        <Panel tone="violet" style={place('labChain')} title={hero.labChainPanel.title.fr} onClose={close} cta={hero.labChainPanel.cta.fr} target={hero.labChainPanel.target}>
          <p>{hero.labChainPanel.intro.fr}</p>
          <ul className="space-y-[0.3em]">
            {hero.labChainPanel.phases.map((x) => (
              <li key={x.title.fr}>
                <span className={PHASE_TONES.violet}>{x.title.fr}</span> · {x.text.fr}
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {panel === 'labIa' && (
        <Panel tone="blue" style={place('labIa')} title={hero.labIaPanel.title.fr} onClose={close} cta={hero.labIaPanel.cta.fr} target={hero.labIaPanel.target}>
          <p>{hero.labIaPanel.intro.fr}</p>
          <ul className="space-y-[0.3em]">
            {hero.labIaPanel.phases.map((x) => (
              <li key={x.title.fr}>
                <span className={PHASE_TONES.blue}>{x.title.fr}</span> · {x.text.fr}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}

/** A small panel over the hero, right of the pointer on desktop (placed by `style`), under the list on mobile: Escape, a click outside or ✕ close it. */
/** Each CTF panel takes its domain's colour (green, blue, violet), like its tab in the CTF section. */
const PANEL_TONES = {
  green: { border: 'border-cyber/30', link: 'text-cyber hover:text-cyber-light' },
  blue: { border: 'border-sky-400/30', link: 'text-sky-400 hover:text-sky-300' },
  violet: { border: 'border-violet-400/30', link: 'text-violet-400 hover:text-violet-300' },
} as const
const PHASE_TONES = { green: 'text-cyber-light', blue: 'text-sky-300', violet: 'text-violet-300' } as const

function Panel({ title, cta, target, style, onClose, children, tone = 'green' }: { title: string; cta: string; target: string; style?: CSSProperties; onClose: () => void; children: ReactNode; tone?: keyof typeof PANEL_TONES }) {
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
      className={cx('absolute top-full left-0 z-30 mt-[0.5em] w-full max-w-[34em] lg:mt-0 lg:w-[30em] rounded-sm border bg-zinc-950/95', PANEL_TONES[tone].border, ' p-[1em] text-[0.875em] leading-relaxed text-zinc-200 shadow-[0_18px_48px_rgba(0,0,0,0.6)] backdrop-blur-md focus:outline-none')}
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
      <a href={target} onClick={onClose} className={cx('mt-[0.9em] inline-flex items-center gap-[0.4em] focus-visible:shadow-focus focus-visible:outline-none', PANEL_TONES[tone].link)}>
        {cta} <ArrowRight aria-hidden="true" className="size-[1em]" />
      </a>
    </div>
  )
}
