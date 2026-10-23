import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SectionHeader from '../../components/SectionHeader'
import { timeline } from '../../content/timeline'
import type { Period, TimelineEntry } from '../../content/types'
import { cx } from '../../lib/cx'
import { useReducedMotion } from '../../lib/useReducedMotion'
import Epitech from '../../assets/Formations/Epitech.webp'
import EcolePerformance from '../../assets/Formations/ECOLE-PERFORMANCE-10.webp'
import Rima from '../../assets/Formations/RIMA.webp'
import Ulit from '../../assets/Experiences/ULIT-removebg-preview.png'
import MiningRig from '../../assets/Experiences/Mining_rig.webp'
import Wec2017Photo from '../../assets/Experiences/wec2017_1.jpg'
import SalesforceDev from '../../assets/Experiences/Salesforce_dev.webp'
import HiveOs from '../../assets/Experiences/HiveOs_monitoring.webp'
import Wec2017 from '../../assets/Experiences/Wec2017.webp'

/**
 * Picture in the timeline node, framed per image, and an optional picture shown with the details.
 * fit: 'cover' crops to the circle around `focus` (CSS object-position, with an optional zoom);
 * 'banner' keeps a wide photo whole over a blurred copy of itself; 'logo' sits on white.
 */
type Frame = { src: string; fit: 'cover' | 'banner' | 'logo'; focus?: string; zoom?: number }
const MEDIA: Record<string, { node: Frame; picture?: string }> = {
  'epitech-msc': { node: { src: Epitech, fit: 'banner' } },
  ulit: { node: { src: Ulit, fit: 'logo' }, picture: SalesforceDev },
  blockchain: { node: { src: MiningRig, fit: 'cover', focus: '50% 30%', zoom: 1.15 }, picture: HiveOs },
  motorsport: { node: { src: Wec2017Photo, fit: 'cover', focus: '38% 62%', zoom: 1.45 }, picture: Wec2017 },
  'ecole-performance': { node: { src: EcolePerformance, fit: 'cover', focus: '55% 65%', zoom: 1.2 } },
  rima: { node: { src: Rima, fit: 'cover', focus: '26% 68%', zoom: 1.5 } },
}

const KIND = { experience: 'Expérience', education: 'Formation' }

const formatPeriod = (p: Period) => {
  if ('approx' in p) return p.approx.fr
  const f = (ym: string) => ym.split('-').reverse().join('/')
  return p.end ? `${f(p.start)} – ${f(p.end)}` : `Depuis ${f(p.start)}`
}

/** True once the element has come into view (stays true). */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

/** Parcours: experiences and education on one vertical timeline, most recent first, alternating sides on wide screens. */
export function Parcours() {
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  // The green part of the line follows the reading position.
  useEffect(() => {
    const el = list.current
    const bar = fill.current
    if (!el || !bar) return
    if (reduced) {
      bar.style.transform = 'scaleY(1)'
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const k = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height))
      bar.style.transform = `scaleY(${k})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <section id="parcours" className="scroll-mt-24 py-24">
      <SectionHeader index="05" title="Parcours" />
      <ol ref={list} className="relative">
        {/* The line (left on small screens, centred on wide ones) and its green progress. */}
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-10 w-px -translate-x-1/2 bg-white/10 lg:left-1/2" />
        <span
          ref={fill}
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-10 w-0.5 origin-top -translate-x-1/2 bg-gradient-to-b from-cyber via-cyber/80 to-cyber/20 shadow-[0_0_12px_var(--color-cyber)] lg:left-1/2"
          style={{ transform: 'scaleY(0)' }}
        />
        {timeline.map((entry, i) => (
          <Row key={entry.id} entry={entry} right={i % 2 === 0} />
        ))}
      </ol>
    </section>
  )
}

function Node({ frame, current }: { frame: Frame; current?: boolean }) {
  return (
    <span className="group/node relative block">
      {current && <span aria-hidden="true" className="absolute inset-0 rounded-full border border-cyber/50 motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]" />}
      <span
        className={cx(
          'relative block size-20 overflow-hidden rounded-full ring-2 ring-offset-4 ring-offset-[#080b10] transition-transform duration-300 group-hover/node:scale-105 lg:size-28',
          current ? 'shadow-[0_0_28px_-4px_var(--color-cyber)] ring-cyber' : 'ring-white/25',
          frame.fit === 'logo' ? 'bg-white' : 'bg-zinc-900',
        )}
      >
        {frame.fit === 'banner' && <img src={frame.src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 size-full scale-125 object-cover opacity-60 blur-md" />}
        <img
          src={frame.src}
          alt=""
          loading="lazy"
          className={cx('relative size-full', frame.fit === 'cover' ? 'object-cover' : 'object-contain', frame.fit === 'logo' && 'p-3 lg:p-4')}
          style={frame.fit === 'cover' ? { objectPosition: frame.focus, transform: frame.zoom ? `scale(${frame.zoom})` : undefined, transformOrigin: frame.focus } : undefined}
        />
      </span>
    </span>
  )
}

function Row({ entry, right }: { entry: TimelineEntry; right: boolean }) {
  const media = MEDIA[entry.id]
  const [ref, seen] = useSeen<HTMLLIElement>()
  return (
    <li ref={ref} className="relative grid grid-cols-[5rem_1fr] gap-5 pb-14 last:pb-0 lg:grid-cols-[1fr_7rem_1fr] lg:gap-12">
      <div
        className={cx(
          'col-start-1 row-start-1 flex justify-center pt-2 motion-safe:transition-[opacity,transform] motion-safe:duration-700 lg:col-start-2',
          seen ? 'scale-100 opacity-100' : 'motion-safe:scale-75 motion-safe:opacity-0',
        )}
      >
        {media && <Node frame={media.node} current={entry.current} />}
      </div>
      <div
        className={cx(
          'relative col-start-2 row-start-1 motion-safe:transition-[opacity,transform] motion-safe:delay-100 motion-safe:duration-700 motion-safe:ease-out',
          right ? 'lg:col-start-3' : 'lg:col-start-1',
          seen ? 'translate-x-0 opacity-100' : cx('motion-safe:opacity-0', right ? 'motion-safe:translate-x-10' : 'motion-safe:translate-x-10 lg:motion-safe:-translate-x-10'),
        )}
      >
        {/* Tick joining the card to the line. */}
        <span aria-hidden="true" className={cx('absolute top-12 hidden h-px w-12 bg-gradient-to-r lg:block', right ? '-left-12 from-cyber/50 to-white/10' : '-right-12 from-white/10 to-cyber/50')} />
        <Card entry={entry} picture={media?.picture} />
      </div>
    </li>
  )
}

function Card({ entry, picture }: { entry: TimelineEntry; picture?: string }) {
  const [open, setOpen] = useState(false)
  const hasDetails = Boolean(entry.highlights?.length || picture)
  const panelId = `parcours-${entry.id}`
  return (
    <article className="rounded-xl border border-white/10 bg-zinc-950/55 p-5 text-left backdrop-blur-sm transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-medium text-cyber">{formatPeriod(entry.period)}</span>
        {entry.current && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyber/10 px-2 py-0.5 text-xs text-cyber">
            <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-cyber" />
            En cours
          </span>
        )}
        <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-xs text-zinc-400">{KIND[entry.kind]}</span>
      </div>
      <h3 className="mt-3 text-lg leading-snug font-semibold text-white lg:text-xl">{entry.title.fr}</h3>
      <p className="mt-1 text-sm text-zinc-400">
        {entry.organisation} · {entry.place.fr}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">{entry.summary.fr}</p>

      {hasDetails && (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            {open ? 'Réduire' : 'Détails'}
            <ChevronDown size={15} aria-hidden="true" className={cx('transition-transform', open && 'rotate-180')} />
          </button>
          {open && (
            <div id={panelId} className="mt-4 space-y-4">
              {entry.highlights && (
                <ul className="space-y-2 text-sm leading-relaxed text-zinc-300">
                  {entry.highlights.map((h) => (
                    <li key={h.fr} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyber" />
                      {h.fr}
                    </li>
                  ))}
                </ul>
              )}
              {picture && <img src={picture} alt="" loading="lazy" className="w-full rounded-lg border border-white/10" />}
            </div>
          )}
        </>
      )}
    </article>
  )
}
