import { BrainCircuit, Code, Crosshair, Mail, Route, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { CoreNodeId } from '../../../src/content/hero'
import { hero } from '../../../src/content/hero'
import type { Locale } from '../../../src/content/types'
import { onCore } from '../../../src/lib/coreBus'
import { cx } from '../../../src/lib/cx'
import { useReducedMotion } from '../../../src/lib/useReducedMotion'
import { CoreHeart } from './CoreHeart'
import {
  APERTURE,
  IRIS_BLADES,
  NODE_ANGLES,
  RADIUS,
  SHIELD_SEGMENTS,
  arcPath,
  bladeNormal,
  bladePath,
  deg,
  polar,
  shieldSegmentAt,
} from './geometry'
import './astrolabe.css'

const icons: Record<CoreNodeId, LucideIcon> = {
  ia: BrainCircuit,
  cyber: Crosshair,
  dev: Code,
  parcours: Route,
  contact: Mail,
}

const nodeColor: Record<CoreNodeId, string> = {
  ia: 'var(--color-ai)',
  cyber: 'var(--color-threat)',
  dev: 'var(--color-ink)',
  parcours: 'var(--color-ink-muted)',
  contact: 'var(--color-ink-muted)',
}

const nodeTone: Record<CoreNodeId, string> = {
  ia: 'text-ai',
  cyber: 'text-threat',
  dev: 'text-ink',
  parcours: 'text-ink-muted',
  contact: 'text-ink-muted',
}

const VIEWBOX = '-500 -500 1000 1000'
const ORBIT_PATH = `M ${-RADIUS.orbit} 0 A ${RADIUS.orbit} 110 0 1 0 ${RADIUS.orbit} 0 A ${RADIUS.orbit} 110 0 1 0 ${-RADIUS.orbit} 0`
const TICKS = Array.from({ length: 120 }, (_, i) => i)
const DEGREE_LABELS = Array.from({ length: 12 }, (_, i) => i * 30)

type AstrolabeProps = {
  /** `gate`: no navigation nodes, assembling animation, iris driven by `iris`. */
  mode?: 'live' | 'gate'
  /** Forces the iris state (gate). */
  iris?: 'open' | 'closed'
  locale?: Locale
  className?: string
}

/**
 * The control core: an SVG astrolabe whose outer ring is the site navigation,
 * a guardrail shell that lights up on impact, an armoured iris and a particle heart.
 * Reacts to `attack` and `flag` events from the core bus.
 */
export function Astrolabe({ mode = 'live', iris, locale = 'fr', className }: AstrolabeProps) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const blades = useRef<Array<SVGPathElement | null>>([])
  const segments = useRef<Array<SVGPathElement | null>>([])
  const impact = useRef<SVGGElement>(null)
  const shockwave = useRef<SVGCircleElement>(null)
  const echo = useRef<SVGCircleElement>(null)
  const ringB = useRef<SVGSVGElement>(null)
  const closedUntil = useRef(0)
  const forced = useRef(iris)
  const [active, setActive] = useState<CoreNodeId | null>(null)
  const [level, setLevel] = useState(0)

  useEffect(() => {
    forced.current = iris
  }, [iris])

  // Iris: eased aperture, updated on the DOM directly (no React render per frame).
  useEffect(() => {
    const draw = (aperture: number) => {
      blades.current.forEach((el, i) => el?.setAttribute('d', bladePath(RADIUS.iris, aperture, bladeNormal(i, aperture))))
    }
    const targetAt = (t: number) => {
      if (forced.current === 'closed') return APERTURE.closed
      if (forced.current === 'open') return APERTURE.open
      if (closedUntil.current > t) return APERTURE.attack
      return APERTURE.open - RADIUS.iris * 0.035 * (0.5 + 0.5 * Math.sin(t / 1700))
    }
    if (reduced) {
      draw(targetAt(0))
      return
    }
    let aperture = targetAt(performance.now())
    let raf = 0
    const loop = (t: number) => {
      const target = targetAt(t)
      // Close fast, reopen slowly.
      aperture += (target - aperture) * (target < aperture ? 0.25 : 0.05)
      if (!document.hidden) draw(aperture)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  // Reactions to the outside world.
  useEffect(() => {
    const restart = (el: Element | null, cls: string) => {
      if (!el) return
      el.classList.remove(cls)
      void (el as SVGGraphicsElement).getBoundingClientRect()
      el.classList.add(cls)
    }
    const offAttack = onCore('attack', ({ angle }) => {
      closedUntil.current = performance.now() + 1300
      const hit = shieldSegmentAt(angle)
      // The hit segment flares, its neighbours take part of the load.
      const flares: Array<[number, string]> = [
        [hit, 'is-hit'],
        [(hit + 1) % SHIELD_SEGMENTS, 'is-hit-near'],
        [(hit + SHIELD_SEGMENTS - 1) % SHIELD_SEGMENTS, 'is-hit-near'],
      ]
      for (const [i, cls] of flares) {
        const seg = segments.current[i]
        if (!seg) continue
        seg.classList.add(cls)
        window.setTimeout(() => seg.classList.remove(cls), 1400)
      }
      impact.current?.setAttribute('transform', `rotate(${(angle * 180) / Math.PI})`)
      restart(impact.current, 'is-active')
      restart(shockwave.current, 'is-active')
      restart(echo.current, 'is-active')
    })
    const offFlag = onCore('flag', ({ level: l }) => {
      setLevel(l)
      restart(ringB.current, 'is-pulsing')
    })
    return () => {
      offAttack()
      offFlag()
    }
  }, [])

  const activeIndex = active ? hero.nodes.findIndex((n) => n.id === active) : -1
  const beamAngle = activeIndex >= 0 ? deg(NODE_ANGLES[activeIndex]!) : 0
  const [bx1, by1] = polar(RADIUS.shield + 12, beamAngle)
  const [bx2, by2] = polar(RADIUS.nav - 36, beamAngle)

  const draw = (delay: number) => ({ '--d': `${delay}s` }) as CSSProperties

  return (
    <div
      ref={root}
      data-core
      className={cx('astrolabe relative aspect-square select-none', mode === 'gate' && 'is-assembling', className)}
    >
      {mode === 'live' && (
        <CoreHeart still={reduced} className="absolute top-1/2 left-1/2 size-[44%] -translate-x-1/2 -translate-y-1/2" />
      )}

      {/* Static layer: crosshair, rings, shield, impacts, beam. Repaints only on events. */}
      <svg viewBox={VIEWBOX} aria-hidden="true" className="astro-layer">
        <defs>
          <linearGradient id="astro-blade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#16201a" />
            <stop offset="1" stopColor="#09100b" />
          </linearGradient>
          <radialGradient id="astro-flash">
            <stop offset="0" stopColor="var(--color-threat)" stopOpacity="0.85" />
            <stop offset="0.35" stopColor="var(--color-threat)" stopOpacity="0.3" />
            <stop offset="1" stopColor="var(--color-threat)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="astro-beam" gradientUnits="userSpaceOnUse" x1={bx1} y1={by1} x2={bx2} y2={by2}>
            <stop offset="0" stopColor={active ? nodeColor[active] : 'var(--color-ai)'} stopOpacity="0" />
            <stop offset="1" stopColor={active ? nodeColor[active] : 'var(--color-ai)'} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <g className="astro-faint">
          <line x1="0" y1={-RADIUS.outer} x2="0" y2={RADIUS.outer} className="draw" pathLength={1} style={draw(0)} />
          <line x1={-RADIUS.outer} y1="0" x2={RADIUS.outer} y2="0" className="draw" pathLength={1} style={draw(0.1)} />
          <circle r={RADIUS.outer} strokeDasharray="1 9" className="fade" style={draw(0.2)} />
        </g>
        <circle r={RADIUS.nav} className="astro-line draw" pathLength={1} style={draw(0.15)} />
        <g>
          {Array.from({ length: SHIELD_SEGMENTS }, (_, i) => {
            const step = (Math.PI * 2) / SHIELD_SEGMENTS
            return (
              <path
                key={i}
                ref={(el) => {
                  segments.current[i] = el
                }}
                d={arcPath(RADIUS.shield, i * step + 0.05, (i + 1) * step - 0.05)}
                className="astro-shield draw"
                pathLength={1}
                style={draw(0.7 + i * 0.04)}
              />
            )
          })}
          <circle ref={shockwave} r={RADIUS.shield} className="astro-shockwave" />
          <circle ref={echo} r={RADIUS.shield} className="astro-shockwave astro-shockwave--echo" />
          <g ref={impact} className="astro-impact">
            <circle cx={RADIUS.shield} cy="0" r="90" fill="url(#astro-flash)" className="astro-impact-flash" />
            <circle cx={RADIUS.shield} cy="0" r="10" className="astro-impact-core" />
            <circle cx={RADIUS.shield} cy="0" r="34" className="astro-impact-ring" />
          </g>
        </g>
        {mode === 'live' && (
          <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke="url(#astro-beam)" className={cx('astro-beam', active && 'is-on')} />
        )}
        {level > 0 && (
          <text x="0" y={-RADIUS.ringB + 30} className="astro-label astro-label--accent">
            {`FLAG ${level}`}
          </text>
        )}
      </svg>

      {/* Rotors: each ring is its own layer, rotated by the compositor (no repaint). */}
      <svg viewBox={VIEWBOX} aria-hidden="true" className="astro-layer astro-rotor astro-rotor--ticks">
        <g className="fade" style={draw(0.35)}>
          {TICKS.map((i) => {
            const a = deg(i * 3)
            const long = i % 5 === 0
            const [x1, y1] = polar(RADIUS.ticks - (long ? 16 : 7), a)
            const [x2, y2] = polar(RADIUS.ticks, a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={long ? 'astro-tick astro-tick--long' : 'astro-tick'} />
          })}
          {DEGREE_LABELS.map((d) => {
            const [x, y] = polar(RADIUS.ticks - 34, deg(d))
            return (
              <text key={d} x={x} y={y} transform={`rotate(${d + 90} ${x} ${y})`} className="astro-label">
                {String(d).padStart(3, '0')}
              </text>
            )
          })}
        </g>
        <circle r={RADIUS.ticks} className="astro-line draw" pathLength={1} style={draw(0.3)} />
      </svg>

      <svg
        ref={ringB}
        viewBox={VIEWBOX}
        aria-hidden="true"
        className={cx('astro-layer astro-rotor astro-rotor--ringb astro-ringb', level > 0 && 'is-unlocked')}
      >
        <circle r={RADIUS.ringB} strokeDasharray="2 7" className="astro-faint-stroke fade" style={draw(0.5)} />
        {[0, 120, 240].map((d, i) => {
          const [x, y] = polar(RADIUS.ringB + 18, deg(d + 19))
          return (
            <g key={d}>
              <path d={arcPath(RADIUS.ringB, deg(d), deg(d + 38))} className="astro-arc draw" pathLength={1} style={draw(0.55 + i * 0.1)} />
              <text x={x} y={y} transform={`rotate(${d + 19 + 90} ${x} ${y})`} className="astro-label astro-label--accent">
                {`GRD-0${i + 1}`}
              </text>
            </g>
          )
        })}
      </svg>

      <svg viewBox={VIEWBOX} aria-hidden="true" className="astro-layer astro-rotor astro-rotor--orbits fade" style={draw(0.6)}>
        {[-28, 62].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path d={ORBIT_PATH} className="astro-faint-stroke" />
            <circle r="4" className="astro-marker">
              {!reduced && <animateMotion dur={r < 0 ? '22s' : '31s'} repeatCount="indefinite" path={ORBIT_PATH} />}
            </circle>
          </g>
        ))}
      </svg>

      {/* Iris: its own small layer, the only one repainted every frame. */}
      <svg viewBox={VIEWBOX} aria-hidden="true" className="astro-layer fade" style={draw(0.9)}>
        {Array.from({ length: IRIS_BLADES }, (_, i) => (
          <path
            key={i}
            ref={(el) => {
              blades.current[i] = el
            }}
            d={bladePath(RADIUS.iris, APERTURE.open, bladeNormal(i, APERTURE.open))}
            className="astro-blade"
          />
        ))}
        <circle r={RADIUS.iris} className="astro-line" />
      </svg>

      {mode === 'live' && (
        <nav aria-label={hero.coreLabel[locale]}>
          <ul>
            {hero.nodes.map((node, i) => {
              const Icon = icons[node.id]
              const [x, y] = polar(RADIUS.nav, deg(NODE_ANGLES[i]!))
              const isActive = active === node.id
              return (
                <li
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + x / 10}%`, top: `${50 + y / 10}%` }}
                >
                  <a
                    href={node.target}
                    aria-label={`${node.label[locale]} : ${node.hint[locale]}`}
                    onMouseEnter={() => setActive(node.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(node.id)}
                    onBlur={() => setActive(null)}
                    className="group flex flex-col items-center gap-1.5 rounded-sm focus-visible:outline-none"
                  >
                    <span
                      className={cx(
                        'astro-node grid size-11 place-items-center rounded-md border bg-canvas/80 backdrop-blur-sm transition-[border-color,box-shadow] duration-(--duration-base) sm:size-13',
                        nodeTone[node.id],
                        isActive ? 'border-current shadow-[0_0_24px_-4px_currentColor]' : 'border-line-strong',
                        'group-focus-visible:shadow-focus',
                      )}
                    >
                      <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 sm:size-6" />
                    </span>
                    <span className="text-[0.6875rem] tracking-[0.12em] text-ink uppercase">{node.label[locale]}</span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        'pointer-events-none absolute top-full mt-0.5 text-[0.625rem] whitespace-nowrap text-ink-muted transition-opacity duration-(--duration-base)',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      {node.hint[locale]}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
