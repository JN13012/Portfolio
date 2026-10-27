import { lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import SectionHeader from '../../components/SectionHeader'
import { timeline } from '../../content/timeline'
import type { TimelineEntry, TimelineTone, YearMonth } from '../../content/types'
import { parcoursEffectsLabels } from '../../content/ui'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cx } from '../../lib/cx'
import { Lock, type LucideIcon } from 'lucide-react'
import CryptoLogo from '../../assets/Logos/btc-eth.svg'
import CandlesLogo from '../../assets/Logos/candles.svg'
import EpitechLogo from '../../assets/Logos/epitech.svg'
import EdpLogo from '../../assets/Logos/edp-dark.png'
import RimaLogo from '../../assets/Logos/rima.jpg'
import UlitLogo from '../../assets/Experiences/ULIT-removebg-preview.png'
import GDriveLogo from '../../assets/Logos/gdrive.webp'
import WartsilaLogo from '../../assets/Logos/wartsila.svg'
import RenaultLogo from '../../assets/Logos/renault.svg'
import HiveOs from '../../assets/Experiences/HiveOs_monitoring.webp'
import Wec2017 from '../../assets/Experiences/Wec2017.webp'

/**
 * The logo next to the title identifies the school or company (`dark` = a white logo, on a dark tile; an icon when there is none);
 * the optional wide picture beside the details shows the work. `fit: 'contain'` keeps a screenshot whole.
 */
type Thumb = { logo: string; dark?: boolean; bleed?: boolean } | { icon: LucideIcon }
const MEDIA: Record<string, { thumb: Thumb; picture?: string; fit?: 'contain' }> = {
  'epitech-msc': { thumb: { logo: EpitechLogo } },
  'epitech-pre-msc': { thumb: { logo: EpitechLogo } },
  ulit: { thumb: { logo: UlitLogo } },
  crypto: { thumb: { logo: CandlesLogo, bleed: true } },
  blockchain: { thumb: { logo: CryptoLogo, bleed: true }, picture: HiveOs, fit: 'contain' },
  motorsport: { thumb: { logo: GDriveLogo }, picture: Wec2017 },
  'ecole-performance': { thumb: { logo: EdpLogo } },
  rima: { thumb: { logo: RimaLogo } },
}
/** Small logos beside the names when one block groups several companies. */
const ORG_LOGOS: Record<string, string> = { 'G-Drive Racing': GDriveLogo, Wärtsilä: WartsilaLogo, Renault: RenaultLogo }

const LANES = [
  { kind: 'experience', label: 'Expérience' },
  { kind: 'education', label: 'Formation' },
] as const

const TONE: Record<TimelineTone, string> = {
  tech: 'border-cyber/60 bg-cyber/15 text-zinc-50 hover:bg-cyber/25',
  before: 'border-white/15 bg-white/[0.05] text-zinc-300 hover:bg-white/10',
  personal: 'border-dashed border-white/25 bg-transparent text-zinc-300 hover:bg-white/5',
}

const ROW_H = 3.5 // rem, height of one sub-row in a lane
const toYear = (ym: YearMonth) => {
  const [y, m] = ym.split('-').map(Number)
  return y! + (m! - 1) / 12
}
/** End of the given month (spans are inclusive). */
const toYearEnd = (ym: YearMonth) => toYear(ym) + 1 / 12
const today = new Date()
const NOW = today.getFullYear() + today.getMonth() / 12
const FROM = Math.min(...timeline.map((e) => Math.floor(toYear(e.span.start))))
const TO = Math.max(...timeline.map((e) => Math.ceil(toYearEnd(e.expectedEnd ?? e.span.end ?? `${today.getFullYear()}-12`))))
const YEARS = Array.from({ length: TO - FROM }, (_, i) => FROM + i)
/**
 * Width of each year on the axis: the years shrink slightly going back in time,
 * and the recent ones (the tech path, with short entries such as a 6-month internship) are much wider.
 */
const ZOOM_FROM = 2025
const yearWidth = (y: number) => (y >= ZOOM_FROM ? 2 : 0.97 ** (ZOOM_FROM - 1 - y))
const OFFSETS = YEARS.reduce<number[]>((acc, y) => [...acc, acc[acc.length - 1]! + yearWidth(y)], [0])
const pct = (y: number) => {
  const i = Math.min(Math.max(Math.floor(y) - FROM, 0), YEARS.length - 1)
  return ((OFFSETS[i]! + (y - FROM - i) * yearWidth(FROM + i)) / OFFSETS[YEARS.length]!) * 100
}
const endOf = (e: TimelineEntry) => (e.expectedEnd ? toYearEnd(e.expectedEnd) : e.span.end ? toYearEnd(e.span.end) : NOW)
/** Keyboard order: along time. */
const CHRONO = [...timeline].sort((a, b) => toYear(a.span.start) - toYear(b.span.start))

// Loaded on demand: the effects only exist on wide screens, so phones never download them.
const EntryEffect = lazy(() => import('./EntryEffect').then((m) => ({ default: m.EntryEffect })))

const EFFECTS_KEY = 'parcours-effects'
const WIDE = '(min-width: 1024px)' // Tailwind lg: where the details panel is shown
function subscribeWide(onChange: () => void) {
  const m = window.matchMedia(WIDE)
  m.addEventListener('change', onChange)
  return () => m.removeEventListener('change', onChange)
}
/** True on wide screens only, so the effects chunk is never fetched on phones. */
function useIsWide() {
  return useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false)
}

/** Effects are on unless this browser turned them off. */
function readEffectsOn() {
  try {
    return localStorage.getItem(EFFECTS_KEY) !== 'off'
  } catch {
    return true
  }
}

/**
 * Parcours. Wide screens: a details panel above a two-lane year axis (experience / education);
 * a bar selects what the panel shows. Small screens: the same entries as a vertical list.
 * `effects`: each entry plays a one-shot neon effect in the panel when selected; a button turns them off
 * (remembered in this browser). Hidden under `prefers-reduced-motion`, where the effects never play.
 */
export function Parcours({ effects = false }: { effects?: boolean }) {
  const reduced = useReducedMotion()
  const isWide = useIsWide()
  const [effectsOn, setEffectsOn] = useState(readEffectsOn)
  const toggleEffects = () => {
    const on = !effectsOn
    setEffectsOn(on)
    try {
      localStorage.setItem(EFFECTS_KEY, on ? 'on' : 'off')
    } catch {
      // Storage blocked: the choice lasts until the page is reloaded.
    }
  }
  const [selected, setSelected] = useState(timeline[0]!.id)
  // Bumped on every selection, so clicking the current entry again replays its effect.
  const [play, setPlay] = useState(0)
  const select = useCallback((id: string) => {
    setSelected(id)
    setPlay((n) => n + 1)
  }, [])
  const entry = timeline.find((e) => e.id === selected) ?? timeline[0]!
  return (
    <section id="parcours" className="scroll-mt-24 py-24">
      <SectionHeader index="05" title="Parcours" />

      <div className="hidden space-y-6 lg:block">
        {/* Fixed height: the axis must not move when the selection changes. */}
        <div role="tabpanel" id="parcours-panel" aria-live="polite" className="relative h-[24rem] overflow-hidden rounded-xl">
          <Details entry={entry} className="h-full overflow-y-auto" />
          {effects && !reduced && (
            // A small, thin switch in the card's top right corner, above the photos: its dot lights up green when on.
            <button
              type="button"
              role="switch"
              aria-checked={effectsOn}
              onClick={toggleEffects}
              className="absolute top-2 right-4 z-10 inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <span
                aria-hidden="true"
                className={cx(
                  'relative h-[11px] w-5 rounded-full border transition-colors duration-200',
                  effectsOn ? 'border-cyber/55' : 'border-white/25',
                )}
              >
                <span
                  className={cx(
                    'absolute top-[1.5px] left-[1.5px] size-1.5 rounded-full transition-all duration-200',
                    effectsOn ? 'translate-x-[9px] bg-cyber shadow-[0_0_6px_var(--color-cyber)]' : 'bg-zinc-500',
                  )}
                />
              </span>
              {parcoursEffectsLabels.label.fr}
              <span className="sr-only">{(effectsOn ? parcoursEffectsLabels.on : parcoursEffectsLabels.off).fr}</span>
            </button>
          )}
          {effects && effectsOn && isWide && (
            <Suspense fallback={null}>
              <EntryEffect key={`${entry.id}-${play}`} id={entry.id} />
            </Suspense>
          )}
        </div>
        <Axis selected={selected} onSelect={select} />
      </div>

      <ol className="relative space-y-4 border-l border-white/10 pl-5 lg:hidden">
        {timeline.map((e) => (
          <li key={e.id} className="relative">
            <span aria-hidden="true" className={cx('absolute top-7 -left-[1.6rem] size-2.5 rounded-full', e.tone === 'tech' ? 'bg-cyber' : 'bg-zinc-600')} />
            <Details entry={e} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function Axis({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})
  const root = useRef<HTMLDivElement>(null)
  // Arrows work as soon as the axis is on screen, without clicking a bar first.
  useEffect(() => {
    const el = root.current
    if (!el) return
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    const onKey = (ev: globalThis.KeyboardEvent) => {
      if (!visible || ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return
      const t = ev.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      const i = CHRONO.findIndex((e) => e.id === selected)
      const next = ev.key === 'ArrowRight' ? CHRONO[i + 1] : ev.key === 'ArrowLeft' ? CHRONO[i - 1] : undefined
      if (!next) return
      ev.preventDefault()
      onSelect(next.id)
      buttons.current[next.id]?.focus({ preventScroll: true })
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [selected, onSelect])
  return (
    <div ref={root} className="rounded-xl border border-white/10 bg-zinc-950/55 p-6 backdrop-blur-sm lg:p-8">
      <div className="grid grid-cols-[6.5rem_1fr]" role="tablist" aria-label="Frise du parcours">
        <div />
        <div className="relative mb-2 h-6 text-sm text-zinc-400">
          {YEARS.map((y) => (
            <span key={y} className={cx('absolute -translate-x-1/2 tabular-nums', yearWidth(y) < 0.7 && 'text-xs')} style={{ left: `${pct(y)}%` }}>
              {y}
            </span>
          ))}
          <span className="absolute -top-5 -translate-x-1/2 text-xs text-cyber" style={{ left: `${pct(NOW)}%` }}>
            aujourd’hui
          </span>
        </div>
        {LANES.map((lane) => {
          const entries = timeline.filter((e) => e.kind === lane.kind)
          const rows = Math.max(...entries.map((e) => e.row ?? 0)) + 1
          return (
            <div key={lane.kind} className="contents">
              <div className="flex items-center border-t border-white/10 text-base font-medium text-zinc-200">{lane.label}</div>
              <div className="relative border-t border-white/10" style={{ height: `${rows * ROW_H + 1}rem` }}>
                {YEARS.map((y) => (
                  <span key={y} aria-hidden="true" className="absolute top-0 bottom-0 w-px bg-white/[0.05]" style={{ left: `${pct(y)}%` }} />
                ))}
                <span aria-hidden="true" className="absolute top-0 bottom-0 w-px bg-cyber/50" style={{ left: `${pct(NOW)}%` }} />
                {entries.map((e) => {
                  const active = e.id === selected
                  const from = toYear(e.span.start)
                  const to = endOf(e)
                  return (
                    <button
                      key={e.id}
                      ref={(el) => {
                        buttons.current[e.id] = el
                      }}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="parcours-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => onSelect(e.id)}
                      title={`${e.title.fr} · ${e.periodLabel.fr}`}
                      className={cx(
                        'absolute flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-lg border px-1 text-center text-sm leading-tight font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber',
                        TONE[e.tone],
                        pct(to) - pct(from) < 6 && 'px-0 text-[11px] tracking-tight',
                        active && 'ring-2 ring-cyber ring-inset',
                      )}
                      // A small gap keeps bars that follow each other apart.
                      style={{ left: `calc(${pct(from)}% + 1px)`, width: `calc(${pct(to) - pct(from)}% - 2px)`, top: `${0.5 + (e.row ?? 0) * ROW_H}rem` }}
                    >
                      {/* Planned part of an ongoing course, hatched. */}
                      {e.expectedEnd && NOW < to && (
                        <span
                          aria-hidden="true"
                          className="absolute top-0 right-0 bottom-0"
                          style={{ left: `${((pct(NOW) - pct(from)) / (pct(to) - pct(from))) * 100}%`, background: 'repeating-linear-gradient(135deg, rgba(8,11,16,.7) 0 4px, transparent 4px 8px)' }}
                        />
                      )}
                      <span className={cx('relative line-clamp-2', pct(to) - pct(from) >= 6 && 'px-1')}>{e.short.fr}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 pl-[6.5rem] text-xs text-zinc-500">
        <span>
          <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm bg-cyber/60" />
          Parcours tech
        </span>
        <span>
          <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm bg-white/25" />
          Avant la reconversion
        </span>
        <span>
          <span aria-hidden="true" className="mr-1.5 inline-block size-2.5 rounded-sm border border-dashed border-white/50" />
          Activité personnelle
        </span>
        <span>Clic ou ← → pour parcourir</span>
      </p>
    </div>
  )
}

function Details({ entry: e, className }: { entry: TimelineEntry; className?: string }) {
  const media = MEDIA[e.id]
  return (
    <article className={cx('grid gap-6 rounded-xl border border-white/10 bg-zinc-950/55 p-6 backdrop-blur-sm lg:p-8', media?.picture && 'md:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_24rem]', className)}>
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          {media && <ThumbTile thumb={media.thumb} />}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-cyber">{e.periodLabel.fr}</span>
              {e.badge && <span className="rounded-full bg-cyber/10 px-2 py-0.5 text-xs text-cyber">{e.badge.fr}</span>}
              {e.datesToConfirm && <span className="text-xs text-amber-400/80">dates à confirmer</span>}
            </div>
            <h3 className="mt-1 text-xl leading-snug font-semibold text-white">{e.title.fr}</h3>
            <p className="text-sm text-zinc-400">
              {e.organisations.map((o, i) => (
                <span key={o.name}>
                  {i > 0 && ' · '}
                  {e.organisations.length > 1 && ORG_LOGOS[o.name] && (
                    <img src={ORG_LOGOS[o.name]} alt="" className="mr-1.5 inline-block h-4 w-auto rounded-[3px] bg-white p-px align-[-3px]" />
                  )}
                  {o.url ? (
                    <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-cyber hover:decoration-cyber">
                      {o.name}
                    </a>
                  ) : (
                    o.name
                  )}
                  {o.place && `, ${o.place.fr}`}
                </span>
              ))}
            </p>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-300">{e.summary.fr}</p>
        {e.highlights && (
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-300">
            {e.highlights.map((h) => (
              <li key={h.fr} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyber" />
                {h.fr}
              </li>
            ))}
          </ul>
        )}
        {e.note && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <Lock size={12} aria-hidden="true" />
            {e.note.fr}
          </p>
        )}
        {e.tags && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {e.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-zinc-300">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {media?.picture && (
        <div className={cx('group/pic hidden min-h-0 overflow-hidden md:block', media.fit !== 'contain' && 'rounded-lg border border-white/10')}>
          <img
            src={media.picture}
            alt=""
            loading="lazy"
            className={cx('size-full transition-transform duration-500 group-hover/pic:scale-110', media.fit === 'contain' ? 'object-contain' : 'object-cover')}
          />
        </div>
      )}
    </article>
  )
}

function ThumbTile({ thumb }: { thumb: Thumb }) {
  if ('icon' in thumb) {
    const Icon = thumb.icon
    return (
      <span className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-300">
        <Icon size={34} aria-hidden="true" />
      </span>
    )
  }
  return (
    <img
      src={thumb.logo}
      alt=""
      loading="lazy"
      className={cx('size-20 shrink-0 rounded-xl', thumb.bleed ? 'border border-white/10 object-cover' : 'object-contain p-1.5', !thumb.bleed && (thumb.dark ? 'border border-white/10 bg-zinc-900' : 'bg-white'))}
    />
  )
}
