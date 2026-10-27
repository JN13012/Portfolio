import { useEffect, useRef, useState, type RefObject } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../../content/profile'
import { introCopy as copy, introJourney as journey } from '../../content/intro'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { createGlobeScene, type GlobeControls } from './globeScene'
import { DIVE_DURATION } from './journeyGeometry'
import fr from 'flag-icons/flags/4x3/fr.svg'
import lb from 'flag-icons/flags/4x3/lb.svg'
import sa from 'flag-icons/flags/4x3/sa.svg'
import qa from 'flag-icons/flags/4x3/qa.svg'
import ca from 'flag-icons/flags/4x3/ca.svg'
import pe from 'flag-icons/flags/4x3/pe.svg'
import './globeGate.css'

type GlobeGateProps = { onClose: () => void; portfolioRef?: RefObject<HTMLDivElement | null> }
const flags: Record<string, string> = { FR: fr, LB: lb, SA: sa, QA: qa, CA: ca, PE: pe }
const inspectionTimes: Record<string, number> = { approach: 600, fracture: 1600, passage: 2400 }

export default function GlobeGate({ onClose, portfolioRef }: GlobeGateProps) {
  const cover = useRef<HTMLDivElement>(null)
  const sceneHost = useRef<HTMLDivElement>(null)
  const annotation = useRef<HTMLDivElement>(null)
  const enterButton = useRef<HTMLButtonElement>(null)
  const closeRef = useRef(onClose)
  const controls = useRef<GlobeControls>({
    time: 0, leaving: false, reduced: false,
    // Dev-only slow motion lets the transition be inspected without changing production timing.
    transitionScale: import.meta.env.DEV && new URLSearchParams(window.location.search).get('transition') === 'slow' ? 0.2 : 1,
    inspectionTime: import.meta.env.DEV && new URLSearchParams(window.location.search).get('transition') === 'inspect'
      ? inspectionTimes[new URLSearchParams(window.location.search).get('phase') ?? 'fracture'] ?? 1600 : null,
  })
  const [active, setActive] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const reduced = useReducedMotion()
  const stop = journey[active]!

  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => { controls.current.reduced = reduced; controls.current.invalidate?.() }, [reduced])

  useEffect(() => {
    const el = sceneHost.current
    if (!el) return
    const controller = new AbortController()
    let dispose = () => {}
    let cancelled = false
    createGlobeScene({
      host: el, cover: cover.current, portfolio: portfolioRef?.current ?? null, controls: controls.current, annotation: annotation.current,
      signal: controller.signal,
      onStep: setActive, onClose: () => closeRef.current(),
    }).then((cleanup) => {
      if (cancelled) cleanup()
      else dispose = cleanup
    }).catch(() => { if (!cancelled) setUnavailable(true) })
    return () => { cancelled = true; controller.abort(); dispose() }
  }, [portfolioRef])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    enterButton.current?.focus({ preventScroll: true })
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
      if (event.key === 'Tab') {
        const buttons = enterButton.current?.closest('[role="dialog"]')?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        const first = buttons?.[0]
        const last = buttons?.[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', key)
      requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>('main h1, main, nav a')
        if (target && !target.closest('[inert]')) {
          if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1')
            target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
          }
          target.focus({ preventScroll: true })
        }
      })
    }
  }, [])

  // A bounded fallback also closes the intro if WebGL is lost during the dive.
  useEffect(() => {
    if (!exiting || controls.current.inspectionTime !== null) return
    const timer = window.setTimeout(() => closeRef.current(), reduced || unavailable ? 0 : (DIVE_DURATION + 200) / controls.current.transitionScale)
    return () => window.clearTimeout(timer)
  }, [exiting, reduced, unavailable])

  const enter = () => {
    if (controls.current.leaving) return
    controls.current.leaving = true
    controls.current.invalidate?.()
    setExiting(true)
  }

  return (
    <div ref={cover} className={`globe-gate${exiting ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-labelledby="intro-name" aria-describedby="intro-description">
      <div className="gate-backdrop" aria-hidden="true" />
      <p id="intro-description" className="sr-only">{copy.accessible.fr}</p>
      <header className="gate-header gate-chrome">
        <div className="gate-signature">
          <span className="gate-monogram" aria-hidden="true">JN<span>.</span></span>
          <div><p id="intro-name">{profile.firstName} {profile.lastName}</p><span>{copy.portfolio.fr}</span></div>
        </div>
        <button className="gate-skip" type="button" onClick={() => closeRef.current()}>{copy.skip.fr}<span aria-hidden="true">↗</span></button>
      </header>

      <div ref={sceneHost} className="gate-scene" aria-hidden="true" />
      {unavailable && <div className="gate-fallback" aria-hidden="true"><div className="gate-fallback-sphere" /><span>{copy.fallback.fr}</span></div>}
      <div className="gate-map-note gate-chrome" aria-hidden="true"><span className="gate-status-dot" />{copy.base.fr}</div>

      <section className="gate-editorial gate-chrome" aria-hidden={exiting || undefined}>
        <h1>{copy.title.fr}<br /><span>{copy.titleAccent.fr}</span></h1>
        <p className="gate-description">{copy.description.fr}</p>
        <div className="gate-facts"><span><strong>{new Set(journey.map((item) => item.code)).size.toString().padStart(2, '0')}</strong>{copy.countries.fr}</span><i /><span><strong>{profile.languages.length.toString().padStart(2, '0')}</strong>{copy.languages.fr}</span></div>
      </section>

      <div className="gate-entry gate-chrome">
        <button ref={enterButton} type="button" className="gate-enter" onClick={enter} disabled={exiting}>{copy.enter.fr}<ArrowUpRight size={19} aria-hidden="true" /></button>
      </div>

      <div ref={annotation} className="gate-annotation" aria-hidden="true">
        <span className="gate-annotation-line" /><div><span className="gate-annotation-index">{String(active + 1).padStart(2, '0')} / 07</span><strong><img className="gate-flag" src={flags[stop.code]} alt="" />{stop.country.fr}</strong>{(active === 0 || active === 6) && <span>{active === 0 ? copy.start.fr : copy.return.fr}</span>}</div>
      </div>

      <div className="gate-dive-label" aria-hidden="true"><span />{copy.destination.fr}</div>
    </div>
  )
}
