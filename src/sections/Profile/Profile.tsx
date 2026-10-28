import { ArrowUpRight, Bot, Briefcase, GraduationCap, Dumbbell, Github, Globe2, Landmark, Linkedin, MapPin, Plane, RotateCcw, X, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { siCoursera, siSalesforce, siTryhackme, type SimpleIcon } from 'simple-icons'
import SectionHeader from '../../components/ui/SectionHeader'
import { brainNodes } from '../../content/assistant'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import type { Localized } from '../../content/types'
import { assistant } from '../../lib/assistantStore'
import { emitCore } from '../../lib/coreBus'
import Portrait from '../../assets/portrait-holographique-bleu.webp'
import fr from 'flag-icons/flags/4x3/fr.svg'
import lb from 'flag-icons/flags/4x3/lb.svg'
import sa from 'flag-icons/flags/4x3/sa.svg'
import qa from 'flag-icons/flags/4x3/qa.svg'
import ca from 'flag-icons/flags/4x3/ca.svg'
import pe from 'flag-icons/flags/4x3/pe.svg'

/** Simple Icons mark (CC0), in the current text colour. */
const Mark = ({ icon }: { icon: SimpleIcon }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]">
    <path d={icon.path} fill="currentColor" />
  </svg>
)

// Use GitHub's inverse white mark on the dark background.
// TryHackMe red is sampled from https://tryhackme.com/favicon-96x96.png.
// Trailblazer is Salesforce's profile.
const SOCIALS = [
  { label: 'GitHub', url: profile.links.github, color: '#ffffff', icon: <Github size={18} aria-hidden="true" /> },
  { label: 'LinkedIn', url: profile.links.linkedin, color: '#0a66c2', icon: <Linkedin size={18} aria-hidden="true" /> },
  { label: 'TryHackMe', url: profile.links.tryhackme, color: '#c11111', icon: <Mark icon={siTryhackme} /> },
  { label: 'Coursera', url: profile.links.coursera, color: `#${siCoursera.hex}`, icon: <Mark icon={siCoursera} /> },
  { label: 'Salesforce Trailblazer', url: profile.links.trailblazer, color: `#${siSalesforce.hex}`, icon: <Mark icon={siSalesforce} /> },
]

const profileNode = brainNodes.find((n) => n.id === 'profile')!
const SENTRY_QUESTIONS = profile.sentryQuestions.flatMap((id) => profileNode.questions.filter((q) => q.id === id))

const COUNTRY_NAMES: Record<string, Localized> = profile.international.countryNames
const STAYS: Record<string, Localized> = profile.international.stays
const FLAGS: Record<string, string> = { FR: fr, LB: lb, SA: sa, QA: qa, CA: ca, PE: pe }

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Approximate country centres, as on the intro globe (GlobeGate); label offsets in map units. Arcs end in France.
const PLACES: Record<string, { lat: number; lon: number; dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  CA: { lat: 54, lon: -100, dx: 0, dy: -10, anchor: 'middle' },
  PE: { lat: -9.2, lon: -75, dx: 8, dy: 4, anchor: 'start' },
  FR: { lat: 46.6, lon: 2.2, dx: -8, dy: -10, anchor: 'end' },
  LB: { lat: 33.9, lon: 35.9, dx: 7, dy: -5, anchor: 'start' },
  SA: { lat: 23.9, lon: 45.1, dx: -6, dy: 12, anchor: 'end' },
  QA: { lat: 25.3, lon: 51.2, dx: 7, dy: 4, anchor: 'start' },
}

// Rotate the longitude view eastward while preserving its 205° span and scale.
// France stays at 63.5% of the width; newly exposed land is drawn on the right.
const LONGITUDE_SPAN = 205
const W0 = PLACES.FR!.lon - LONGITUDE_SPAN * 0.635, W1 = W0 + LONGITUDE_SPAN, N0 = 72, S0 = -40, K = 3
const px = (lon: number) => (lon - W0) * K
const py = (lat: number) => (N0 - lat) * K

function arc(lat: number, lon: number) {
  const x1 = px(lon), y1 = py(lat), x2 = px(PLACES.FR!.lon), y2 = py(PLACES.FR!.lat)
  const lift = Math.min(90, Math.hypot(x2 - x1, y2 - y1) * 0.3)
  return `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 - lift} ${x2},${y2}`
}

/** Land dots of the intro globe, in the crop, as one path of round dots (loaded apart, shared with the globe). */
function useLandPath() {
  const [d, setD] = useState('')
  useEffect(() => {
    let live = true
    void import('../Gate/landDots.json').then(({ default: dots }) => {
      const parts: string[] = []
      for (let i = 0; i < dots.length; i += 2) {
        const lat = dots[i]! / 10, lon = dots[i + 1]! / 10
        if (lat <= N0 && lat >= S0 && lon >= W0 && lon <= W1) parts.push(`M${px(lon).toFixed(1)} ${py(lat).toFixed(1)}h0`)
      }
      if (live) setD(parts.join(''))
    })
    return () => {
      live = false
    }
  }, [])
  return d
}

const MAP_W = (W1 - W0) * K
const MAP_H = (N0 - S0) * K

/**
 * Static flat map: the countries lived in, arcs to France (the intro globe's route, without animation).
 * Hovering or tapping a country shows how long Jérémie lived there; screen readers get it all in the label.
 */
function WorldRoute() {
  const land = useLandPath()
  const [hover, setHover] = useState<string | null>(null)
  const tip = hover ? PLACES[hover] : undefined
  return (
    <div className="relative" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full" role="img" aria-label={profile.international.mapLabel.fr}>
        <path d={land} stroke="#64748b" strokeOpacity="0.45" strokeWidth="3.2" strokeLinecap="round" />
        <g fill="none" stroke="var(--color-cyber)" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.7">
          {profile.countries
            .filter((c) => c !== 'FR')
            .map((c) => (
              <path key={c} d={arc(PLACES[c]!.lat, PLACES[c]!.lon)} />
            ))}
        </g>
        {profile.countries.map((c) => {
          const p = PLACES[c]!
          const on = c === hover
          return (
            <g key={c} className="cursor-pointer" onMouseEnter={() => setHover(c)} onClick={() => setHover(on ? null : c)}>
              {/* Wider invisible target, easier to hit with a finger. */}
              <circle cx={px(p.lon)} cy={py(p.lat)} r={16} fill="transparent" />
              <circle cx={px(p.lon)} cy={py(p.lat)} r={on ? 10 : 7} fill="var(--color-cyber)" opacity={on ? 0.35 : 0.18} />
              <circle cx={px(p.lon)} cy={py(p.lat)} r={3} fill="var(--color-cyber)" />
              <text x={px(p.lon) + p.dx} y={py(p.lat) + p.dy} textAnchor={p.anchor} className={`text-[15px] ${on ? 'fill-cyber' : 'fill-zinc-200'}`}>
                {COUNTRY_NAMES[c]?.fr}
              </text>
            </g>
          )
        })}
      </svg>
      {hover && tip && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 inline-flex -translate-x-1/2 -translate-y-[calc(100%+12px)] items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-zinc-300 shadow-lg"
          style={{ left: `${(px(tip.lon) / MAP_W) * 100}%`, top: `${(py(tip.lat) / MAP_H) * 100}%` }}
        >
          <img src={FLAGS[hover]} alt="" className="h-3 w-4 shrink-0 rounded-[1px]" />
          {COUNTRY_NAMES[hover]?.fr} · {STAYS[hover]?.fr}
        </span>
      )}
    </div>
  )
}

/** CEFR level as six steps; native fills them all. */
function LevelBar({ level }: { level: string }) {
  const n = level === 'native' ? LEVELS.length : LEVELS.indexOf(level) + 1
  return (
    <span className="flex gap-1" aria-hidden="true">
      {LEVELS.map((l, i) => (
        <span key={l} className={`h-1.5 w-4 rounded-full ${i < n ? 'bg-cyber' : 'bg-white/10'}`} />
      ))}
    </span>
  )
}

const WORK_ICONS: Record<string, LucideIcon> = { master: GraduationCap, work: Briefcase }

const INTEREST_ICONS: Record<string, LucideIcon> = { finance: Landmark, geopolitics: Globe2, travel: Plane, sport: Dumbbell }

/** Interests: a compact horizontal panel above and right of the pointer, with an icon anchor for keyboard/touch. */
function Interests() {
  const [active, setActive] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const panelId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null)
  const [placement, setPlacement] = useState({ left: 0, top: 0 })
  const current = profile.interests.find((i) => i.id === active)
  const project = current?.project ? projects.find((p) => p.slug === current.project) : undefined

  useLayoutEffect(() => {
    if (!active) return
    const place = () => {
      if (!box.current || !panel.current || !opener.current) return
      const row = box.current.getBoundingClientRect()
      const button = opener.current.getBoundingClientRect()
      const width = panel.current.offsetWidth
      const height = panel.current.offsetHeight
      const x = pointer ? pointer.x + 16 : button.left + button.width / 2 - width / 2
      const y = pointer?.y ?? button.top
      const left = Math.max(16, Math.min(x, window.innerWidth - width - 16))
      // Above the pointer by default; flip below if the navigation leaves too little room.
      const top = y - height < 80 ? (pointer?.y ?? button.bottom) + 12 : y - height
      setPlacement({ left: left - row.left, top: Math.max(80, Math.min(top, window.innerHeight - height - 16)) - row.top })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [active, pointer])

  useEffect(() => {
    if (!active) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !box.current?.contains(event.target)) setActive(null)
    }
    // A hover-opened panel may have no focus inside it: Escape must also work from the page.
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      opener.current?.focus({ preventScroll: true })
      setActive(null)
    }
    window.addEventListener('pointerdown', outside)
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('pointerdown', outside)
      window.removeEventListener('keydown', escape)
    }
  }, [active])

  const close = () => {
    opener.current?.focus({ preventScroll: true })
    setActive(null)
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-normal text-zinc-400 italic">{profile.ui.interests!.fr}</h3>
      <div
        ref={box}
        className="relative"
        onMouseLeave={() => {
          if (!box.current?.contains(document.activeElement)) setActive(null)
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setActive(null)
        }}
      >
        <ul className="grid grid-cols-4 divide-x divide-white/10">
          {profile.interests.map((i) => {
            const Icon = INTEREST_ICONS[i.id] ?? Globe2
            const on = i.id === active
            return (
              <li key={i.id}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={on}
                  aria-controls={on ? panelId : undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'mouse') return
                    opener.current = event.currentTarget
                    if (active !== i.id) setPointer({ x: event.clientX, y: event.clientY })
                    setActive(i.id)
                  }}
                  onFocus={(event) => {
                    opener.current = event.currentTarget
                    if (event.currentTarget.matches(':focus-visible')) setPointer(null)
                    setActive(i.id)
                  }}
                  onClick={(event) => {
                    opener.current = event.currentTarget
                    if (active !== i.id) setPointer(event.detail > 0 && window.matchMedia('(hover: hover)').matches ? { x: event.clientX, y: event.clientY } : null)
                    setActive(i.id)
                  }}
                  className={`flex w-full cursor-pointer flex-col items-center gap-2.5 rounded-sm py-2 transition-colors focus-visible:outline-none focus-visible:shadow-focus ${on ? 'text-cyber' : 'text-zinc-500 hover:text-cyber'}`}
                >
                  <Icon size={30} strokeWidth={1.25} aria-hidden="true" />
                  <span className={`text-[11px] tracking-widest uppercase sm:text-xs ${on ? 'text-cyber' : 'text-zinc-200'}`}>{i.label.fr}</span>
                </button>
              </li>
            )
          })}
        </ul>
        {current && (
          // The padding bridges the gap, so the pointer can reach the panel and its project link.
          <div
            ref={panel}
            className="absolute z-30 w-max max-w-[min(52rem,calc(100vw-2rem))] pb-3"
            style={{ left: placement.left, top: placement.top }}
          >
            <div
              id={panelId}
              role="dialog"
              aria-label={current.label.fr}
              className="flex items-center gap-3 rounded-sm border border-cyber/30 bg-zinc-950/95 px-4 py-3 text-sm leading-snug text-zinc-300 shadow-[0_18px_48px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <p className="min-w-0">{current.text.fr}</p>
              {project && (
                <button type="button" className={`${pill} shrink-0`} onClick={() => { setActive(null); emitCore('openProject', { slug: project.slug }) }}>
                  {project.title} <ArrowUpRight size={12} aria-hidden="true" />
                </button>
              )}
              <button type="button" aria-label={profile.ui.closeInterest.fr} onClick={close} className="-mr-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:shadow-focus">
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** S-shaped jog between the two rail levels (0 and 24px), like a docs « On this page » outline. */
function Jog({ down, className }: { down: boolean; className: string }) {
  return (
    <svg aria-hidden="true" width="25" height={down ? 18 : 8} viewBox="0 0 25 18" preserveAspectRatio="none" className={`block transition-colors ${className}`}>
      <path d={down ? 'M0.5 0 C0.5 9 24.5 9 24.5 18' : 'M24.5 0 C24.5 9 0.5 9 0.5 18'} fill="none" stroke="currentColor" />
    </svg>
  )
}

/**
 * « Avant l'informatique », drawn like a docs « On this page » outline: years left of the rail; each step's
 * title sits one level in (a hollow), its text on the outer level (a bump), joined by S-shaped jogs. Hovering a
 * step lights its segments green.
 */
function StrengthsTimeline() {
  const idle = 'text-white/15 group-hover:text-cyber'
  const line = 'border-white/15 group-hover:border-cyber'
  return (
    <ol>
        {profile.strengths.map((s, i) => (
          <li key={s.id} className="group grid grid-cols-[3rem_1fr] gap-x-3 sm:grid-cols-[3.5rem_1fr]">
            <span className={`text-right text-xs leading-tight text-zinc-500 tabular-nums ${i > 0 ? 'pt-[18px]' : ''}`}>
              <span className="block text-sm text-zinc-300 transition-colors group-hover:text-cyber">{s.period.start}</span>
              {s.period.end}
            </span>
            <div>
              {i > 0 && <Jog down className={idle} />}
              <div className={`ml-6 border-l pl-4 transition-colors ${line}`}>
                <p className="text-[15px] font-semibold text-zinc-200 transition-colors group-hover:text-cyber">
                  {s.title.fr} <span className="ml-1 text-xs font-normal text-zinc-400">{s.context.fr}</span>
                </p>
              </div>
              <Jog down={false} className={idle} />
              {/* More room under the text than above it, so each step reads as one block. */}
              <div className={`border-l pl-4 transition-colors ${line} ${i < profile.strengths.length - 1 ? 'pb-6' : 'pb-1'}`}>
                <p className="text-[15px] leading-[1.6] text-zinc-300">{s.text.fr}</p>
              </div>
            </div>
          </li>
        ))}
    </ol>
  )
}

/** The globe intro only runs on wide screens without reduced motion (App.shouldOpenGate). */
const canReplayGlobe = () => window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pill = 'inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-zinc-300 transition-colors hover:border-cyber/50 hover:text-cyber'

/**
 * Profil: who Jérémie is, beyond what the hero and Contact already say. Portrait and profile links; an
 * introduction and what each past life brought (a timeline); interests; International: the countries lived in on a static map and the languages with their CEFR level.
 */
export function Profile() {
  const { ui, international } = profile
  const [replay] = useState(canReplayGlobe)
  return (
    <section id="profile" className="py-24">
      <SectionHeader index="01" title="Profil" />
      <div className="grid gap-12 lg:grid-cols-[15rem_1fr] xl:grid-cols-[15rem_1fr_minmax(0,26rem)]">
        <div className="space-y-5">
          <div className="group/portrait relative mx-auto max-w-60 overflow-hidden">
            <img loading="lazy" decoding="async" src={Portrait} width={800} height={1087} alt={`${profile.firstName} ${profile.lastName}`} className="block w-full translate-y-[3%] origin-bottom motion-safe:scale-105 motion-safe:transition-transform motion-safe:duration-600 motion-safe:ease-out motion-safe:group-hover/portrait:scale-100" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-cyber/30 motion-safe:transition-colors motion-safe:duration-600 group-hover/portrait:border-cyber/50" />
            <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 size-5 border-t-2 border-l-2 border-cyber" />
            <div aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-cyber" />
          </div>
          <ul className="flex justify-center gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label} className="group relative">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{ '--social-color': s.color } as CSSProperties}
                  className="grid size-10 place-items-center rounded-md border border-white/10 bg-zinc-950/60 text-zinc-300 transition-colors hover:border-cyber/50 hover:text-[var(--social-color)] focus-visible:border-cyber/50 focus-visible:text-[var(--social-color)]"
                >
                  {s.icon}
                </a>
                {/* Small tooltip on hover and keyboard focus (the link is named by aria-label). */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-zinc-300 opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-3.5 border-t border-white/10 pt-6 text-sm text-zinc-300">
            <p className="inline-flex items-center gap-2 text-xs tracking-widest text-cyber uppercase">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-cyber motion-safe:animate-ping" />
                <span className="relative size-1.5 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)]" />
              </span>
              {profile.availability.fr}
            </p>
            <ul className="space-y-2.5">
              {profile.workStudy.map((w) => {
                const Icon = WORK_ICONS[w.id]
                return (
                  <li key={w.id} className="flex items-start gap-2.5">
                    {Icon ? <Icon size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-cyber" /> : <span aria-hidden="true" className="w-[15px] shrink-0" />}
                    {w.text.fr}
                  </li>
                )
              })}
              <li className="flex items-start gap-2.5">
                <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-cyber" /> {profile.location.fr}
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className="mb-5 h-px w-16 bg-cyber" />
          <p className="text-[18px] leading-relaxed text-zinc-100">{profile.about.fr}</p>

          <h3 className="mt-10 mb-5 text-base font-normal text-zinc-400 italic">{ui.strengthsTitle!.fr}</h3>
          <StrengthsTimeline />

          <div className="mt-10 w-full">
            <Interests />
          </div>

          {SENTRY_QUESTIONS.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-2 text-sm text-zinc-400">
                <Bot size={16} aria-hidden="true" className="text-cyber" /> {ui.askSentry!.fr}
              </span>
              {SENTRY_QUESTIONS.map((q) => (
                <button key={q.id} type="button" className={pill} onClick={() => assistant.ask(q, 'profile')}>
                  {q.question.fr}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2 xl:col-span-1">
          <div>
            <h3 className="mb-1 flex items-center gap-2 text-base font-semibold text-zinc-100">
              <Globe2 size={17} aria-hidden="true" className="text-cyber" /> {international.title.fr}
            </h3>
            <p className="text-sm text-zinc-400">{international.summary.fr}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">{international.lead.fr}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1">
            <div className="space-y-3">
              <WorldRoute />
              {replay && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => emitCore('replayGate', {})} className="inline-flex cursor-pointer items-center gap-1 text-xs text-zinc-300 transition-colors hover:text-cyber">
                    <RotateCcw size={12} aria-hidden="true" /> {ui.replayGlobe!.fr}
                  </button>
                </div>
              )}
            </div>
            <ul className="space-y-2.5">
              {profile.languages.map((l) => (
                <li key={l.code} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2.5 last:border-0">
                  <span className="text-[15px] text-zinc-200">
                    {l.name.fr}
                    {l.note && <span className="text-xs text-zinc-400"> · {l.note.fr}</span>}
                  </span>
                  <span className="flex items-center gap-3">
                    <LevelBar level={l.level} />
                    <span className="w-10 text-right text-xs text-cyber">{l.level === 'native' ? ui.native!.fr : l.level}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
