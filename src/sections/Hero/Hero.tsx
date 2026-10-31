import { useMemo, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { FileClock, Mail, MapPin } from 'lucide-react'
import { hero } from '../../content/hero'
import { profile } from '../../content/profile'
import { currentRun, useAssistant } from '../../lib/assistantStore'
import { assistantNetworkNodes, networkRun } from './core/assistantNodes'
import { NeuralHero } from './core/NeuralHero'
import { HERO_NETWORK } from './core/network'
import { HERO_PLACEMENT, placementStyle, WIDE_FROM, type Placement } from './core/placement'
import { PlacementTool } from './core/PlacementTool'
import { HeroProofs } from './HeroProofs'

// Dev-only placement mode: /?placer shows a frame to move and resize the network with the mouse.
const PLACER = import.meta.env.DEV && new URLSearchParams(window.location.search).has('placer')
const PLACER_STORE = 'hero-placement'

const TONE: Record<string, string> = { ai: 'text-sky-400', threat: 'text-rose-500' }
/** The third column, for Sentry's window (fixed, 360 px wide, 24 px from the edge, plus a 24 px gap):
 * as wide as the window reaches into the main column (the page margin is 5vw); 0 while it is folded. */
const CHAT_ROOM = 'max(0px, calc(408px - 5vw))'

const onResize = (cb: () => void) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

/**
 * Hero (2026-10-27): who, which jobs, proof, availability and CTAs on the left; the assistant's network
 * on the right. The chat with Sentry is docked at the bottom right of every page (SentryChat); its
 * answers are played by the network, toward the sections they cite. Three columns: text and network
 * share the room equally, the third is empty while the chat is folded and takes the window's width when
 * it opens, so both others shrink alike (the name scales with its column).
 */
export function Hero() {
  const chat = useAssistant()
  const run = useMemo(() => networkRun(currentRun(chat)), [chat])
  const wide = useSyncExternalStore(onResize, () => window.innerWidth >= WIDE_FROM, () => true)
  const set = wide ? 'wide' : 'normal'
  const [tuned, setTuned] = useState<Partial<Record<'normal' | 'wide', Placement>>>(() => {
    if (!PLACER) return {}
    try {
      return JSON.parse(localStorage.getItem(PLACER_STORE) ?? '{}')
    } catch {
      return {}
    }
  })
  const placement = tuned[set] ?? HERO_PLACEMENT[set]
  // Chat open: the drawing area stops at its column, never under the window (wide screens reach past it).
  const box = placementStyle(chat.open ? { ...placement, right: Math.max(0, placement.right) } : placement)
  const tune = (p: Partial<Record<'normal' | 'wide', Placement>>) => {
    setTuned(p)
    try {
      localStorage.setItem(PLACER_STORE, JSON.stringify(p))
    } catch {
      // Private mode: the frame is just not remembered.
    }
  }

  return (
    <section id="acceuil" aria-labelledby="hero-title" className="relative flex min-h-screen flex-col justify-center gap-10 py-24 lg:pt-20 lg:pb-6">
      <div
        className="grid w-full grid-cols-1 items-center gap-y-10 transition-[grid-template-columns] duration-500 motion-reduce:transition-none lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)_var(--chat-room)]"
        style={{ '--chat-room': chat.open ? CHAT_ROOM : '0px' } as CSSProperties}
      >
        {/* The text column scales with its width (A, 2026-10-27): its base size is a share of the column
            (cqi), every size inside is in em, and the name has its own share so it always fits on one line.
            Folded chat: it fills its half; open: it shrinks as much as the network. On a short screen the
            base size also follows the height (vh), so the column keeps to about the screen's height. */}
        <div className="@container min-w-0 lg:pr-10">
          {/* Three blocks, well apart: who (name, jobs, pitch), the proofs, then what to do (availability
              right above the buttons). */}
          <div className="flex flex-col gap-[min(4.25em,5vh)] lg:text-[clamp(12px,min(2.6cqi,1.7vh),20px)]">
            <div className="flex flex-col gap-[1.1em]">
              <div className="flex flex-col gap-[0.6em]">
                <h1 id="hero-title" className="outline-none text-[min(14cqi,3.75rem)] leading-none font-bold tracking-tight whitespace-nowrap text-white uppercase lg:text-[clamp(2.75rem,min(14cqi,9vh),8rem)]">
                  {profile.lastName} <span className="text-cyber">{profile.firstName}</span>
                </h1>
                {/* Narrow phones: one job per line, without the separator. */}
                <p className="flex flex-col text-2xl font-bold tracking-tight uppercase min-[480px]:block md:text-3xl lg:text-[min(1.875em,4.4cqi)]">
                  {hero.title.map((part, i) => (
                    <span key={part.text.fr} className="whitespace-nowrap">
                      {i > 0 && <span className="hidden text-zinc-600 min-[480px]:inline"> · </span>}
                      <span className={TONE[part.tone]}>{part.text.fr}</span>
                    </span>
                  ))}
                </p>
              </div>
              <p className="max-w-[34em] border-l-2 border-cyber/80 py-[0.2em] pl-[0.9em] text-lg leading-[1.55] text-zinc-200 lg:text-[1.1em]">{hero.pitch.fr}</p>
            </div>

            <HeroProofs />

            {/* Availability on two lines (the location alone on the second), then the contact button and the CV's status. */}
            <div className="flex flex-col gap-[1.1em]">
              <ul className="flex flex-wrap items-center gap-x-[1.25em] gap-y-[0.45em] text-[0.9375em] text-zinc-300">
                <li className="inline-flex items-center gap-[0.5em] text-zinc-100">
                  <span aria-hidden="true" className="size-[0.625em] animate-pulse rounded-full bg-cyber shadow-[0_0_12px_var(--color-cyber)]" />
                  {hero.available.fr} · {profile.seeking[0]!.fr}
                </li>
                {profile.seeking.slice(1).map((s) => (
                  <li key={s.fr}>{s.fr}</li>
                ))}
                <li className="inline-flex basis-full items-center gap-[0.375em]">
                  <MapPin aria-hidden="true" className="size-[1em]" /> {profile.location.fr}
                </li>
              </ul>

              <div className="flex flex-col items-start gap-[0.9em]">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-[0.75em] border border-cyber/60 bg-cyber/10 px-[1.6em] py-[0.85em] tracking-[0.2em] text-cyber uppercase transition-colors hover:bg-cyber/20"
                >
                  <Mail aria-hidden="true" className="size-[1.125em]" /> {hero.ctaContact.fr}
                </a>
                <span className="inline-flex cursor-not-allowed items-center gap-[0.6em] py-[0.2em] text-[0.875em] text-zinc-400">
                  <FileClock aria-hidden="true" className="size-[1.125em]" /> {hero.cvPending.fr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The network (desktop only). Its drawing area can reach past its box (HERO_PLACEMENT); it lets
            clicks through. The empty third column is the chat's room. */}
        <div className="relative hidden min-w-0 lg:block lg:h-[min(44rem,calc(100vh-8rem))]">
          <div className="absolute" style={box}>
            <NeuralHero nodes={assistantNetworkNodes} settings={HERO_NETWORK} run={run} className="aspect-auto absolute inset-0" />
          </div>
          {/* The vector and filters drawn by the network must not read as a model running. */}
          <p className="absolute top-0 right-0 text-xs text-zinc-400">{hero.networkNote.fr}</p>
          {PLACER && !chat.open && <PlacementTool value={placement} set={set} onChange={(p) => tune({ ...tuned, [set]: p })} onReset={() => tune({ ...tuned, [set]: undefined })} />}
        </div>
      </div>
    </section>
  )
}
