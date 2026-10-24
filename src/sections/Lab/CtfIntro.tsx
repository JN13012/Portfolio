import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Play, RotateCcw } from 'lucide-react'
import { cx } from '../../lib/cx'
import { useReducedMotion } from '../../lib/useReducedMotion'

// Intro screen of the CTF terminal: what the 9 levels train, typed in once per visit, with the
// visitor's progress (kept in this browser by the console) and the button that opens the console.

const CTF_PROGRESS_KEY = 'ctf-progress'
const TYPED_KEY = 'ctf-intro-typed'

const CTF_SKILLS = [
  'Système Linux & recherche de fichiers',
  'Réseaux TCP/IP & services exposés',
  'Scan, énumération & reconnaissance',
  'Exploitation web & injection SQL',
  'Cassage de hashs & accès SSH',
  'Exploitation système & élévation de privilèges',
  'Analyse SIEM & corrélation de logs',
  'Forensique, investigation & confinement',
  'Durcissement : WAF, firewall & IDS',
]

const PHASES = [
  { title: 'Reconnaissance', levels: [1, 2, 3] },
  { title: 'Exploitation', levels: [4, 5, 6] },
  { title: 'Défense', levels: [7, 8, 9] },
]

const TITLE = 'Laboratoire cybersécurité'
const SUBTITLE = 'CTF en 9 niveaux · de la reconnaissance à la défense'
const CHARS_PER_SECOND = 170

// Where each typed piece starts, in reading order (title, subtitle, then phase titles and levels).
const PIECES = (() => {
  let offset = TITLE.length + SUBTITLE.length
  return PHASES.map((phase) => {
    const head = offset
    offset += phase.title.length
    const lines = phase.levels.map((n) => {
      const at = offset
      offset += CTF_SKILLS[n - 1]!.length + 3
      return { n, at }
    })
    return { ...phase, head, lines }
  })
})()

export type StartButtonStyle = 'hud' | 'solid' | 'prompt' | 'key' | 'arrow'

type Progress = { level: number; solved: boolean }
function readProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(CTF_PROGRESS_KEY) ?? 'null') as Progress | null
    return p && p.level >= 1 && p.level <= 9 ? p : { level: 1, solved: false }
  } catch {
    return { level: 1, solved: false }
  }
}

/** Text typed in character by character; the full text is always there for screen readers and layout. */
function Typed({ text, from, chars }: { text: string; from: number; chars: number }) {
  const n = Math.max(0, Math.min(text.length, chars - from))
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, n)}
        <span className="invisible">{text.slice(n)}</span>
      </span>
    </>
  )
}

export function CtfIntro({ onStart, button = 'hud' }: { onStart: () => void; button?: StartButtonStyle }) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const [progress] = useState(readProgress)
  const total = TITLE.length + SUBTITLE.length + PHASES.reduce((n, p) => n + p.title.length + p.levels.reduce((m, l) => m + CTF_SKILLS[l - 1]!.length + 3, 0), 0)
  // Already typed during this visit: show everything at once.
  const [alreadyTyped] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem(TYPED_KEY))
    } catch {
      return true
    }
  })
  const [typedChars, setChars] = useState(0)
  const chars = reduced || alreadyTyped ? Infinity : typedChars

  // Types the screen once, when it comes into view; instant under reduced motion.
  useEffect(() => {
    if (reduced || alreadyTyped) return
    const el = root.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (now: number) => {
          const c = ((now - t0) / 1000) * CHARS_PER_SECOND
          setChars(c)
          if (c < total) raf = requestAnimationFrame(tick)
          else
            try {
              sessionStorage.setItem(TYPED_KEY, '1')
            } catch {
              // Private mode: the screen is typed again next time.
            }
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reduced, alreadyTyped, total])

  const started = progress.level > 1 || progress.solved
  const label = progress.solved ? 'Rejouer' : started ? `Reprendre au niveau ${progress.level}` : 'Commencer'
  const done = (n: number) => progress.solved || n < progress.level
  const typing = chars < total

  const restart = () => {
    try {
      localStorage.removeItem(CTF_PROGRESS_KEY)
    } catch {
      // Nothing stored.
    }
    onStart()
  }

  return (
    <div
      ref={root}
      className="relative flex flex-1 flex-col items-center overflow-y-auto px-6 py-8 text-center font-mono"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(74,222,128,0.13), transparent 70%), linear-gradient(rgba(74,222,128,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.045) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 28px 28px, 28px 28px',
      }}
    >
      {/* Scanlines, like an old CRT screen: they crawl down, and a faint refresh band sweeps by every few seconds. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 motion-safe:animate-[scan-crawl_0.35s_linear_infinite]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 3px)' }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <span
          className="absolute inset-x-0 top-0 block h-1/4 motion-safe:animate-[scan-sweep_6s_linear_infinite] motion-reduce:hidden"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(74,222,128,0.06) 50%, transparent)' }}
        />
      </span>

      <p className="text-2xl font-bold tracking-[0.25em] text-cyber uppercase [text-shadow:0_0_18px_rgba(74,222,128,0.45)] motion-safe:animate-[crt-glitch_3s_steps(1)_infinite]">
        <Typed text={TITLE} from={0} chars={chars} />
      </p>
      <p className="mt-2 text-[15px] text-zinc-300 motion-safe:animate-[crt-glitch_4.2s_steps(1)_1.1s_infinite]">
        <Typed text={SUBTITLE} from={TITLE.length} chars={chars} />
      </p>

      {/* The 9 levels as one centred path, in three phases; finished levels get a tick. */}
      <ol className="mt-8 w-full max-w-lg text-left motion-safe:animate-[crt-glitch_5.5s_steps(1)_2.4s_infinite]">
        {PIECES.map((phase) => (
          <li key={phase.title} className="mb-4 last:mb-0">
            <p className="mb-2.5 flex items-center gap-3 text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
              <span className="h-px flex-1 bg-white/10" />
              <span>
                <Typed text={phase.title} from={phase.head} chars={chars} />
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </p>
            <ol className="relative space-y-2 border-l border-cyber/25 pl-5">
              {phase.lines.map(({ n, at }) => {
                const ok = done(n)
                const current = !progress.solved && started && n === progress.level
                return (
                  <li key={n} className={cx('relative text-[15px]', ok ? 'text-zinc-400' : 'text-zinc-100')}>
                    {ok ? (
                      <Check size={13} aria-hidden="true" className="absolute top-1/2 -left-[1.6rem] -translate-y-1/2 rounded-full bg-black text-cyber" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute top-1/2 -left-[1.4rem] size-1.5 -translate-y-1/2 rounded-full',
                          current ? 'bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]' : 'bg-cyber shadow-[0_0_6px_var(--color-cyber)]',
                        )}
                      />
                    )}
                    <span className={cx('mr-3 tabular-nums', current ? 'text-amber-300' : 'text-cyber')}>{String(n).padStart(2, '0')}</span>
                    <Typed text={CTF_SKILLS[n - 1]!} from={at} chars={chars} />
                    {ok && <span className="sr-only"> (réussi)</span>}
                    {current && <span className="sr-only"> (en cours)</span>}
                  </li>
                )
              })}
            </ol>
          </li>
        ))}
      </ol>

      <div className={cx('mt-auto flex flex-col items-center gap-3 pt-6 transition-opacity duration-500', typing ? 'opacity-0' : 'opacity-100')}>
        {/* Slow blink, with the same occasional screen jump as the text. */}
        <span className="motion-safe:animate-[start-blink_1.6s_ease-in-out_infinite]">
          <span className="inline-block motion-safe:animate-[crt-glitch_3.7s_steps(1)_1.7s_infinite]">
            <StartButton style={button} onClick={onStart}>
              {label}
            </StartButton>
          </span>
        </span>
        {started && (
          <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-200">
            <RotateCcw size={12} aria-hidden="true" /> Recommencer à zéro
          </button>
        )}
      </div>
    </div>
  )
}

/** The start button in one of the proposed styles (compared on /mockups.html?view=ctfbuttons). */
export function StartButton({ style, onClick, children }: { style: StartButtonStyle; onClick: () => void; children: ReactNode }) {
  const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber'
  if (style === 'solid')
    return (
      <button type="button" onClick={onClick} className={cx('inline-flex items-center gap-2.5 bg-cyber px-8 py-3.5 text-sm font-bold tracking-[0.2em] text-black uppercase shadow-[0_8px_30px_-8px_var(--color-cyber)] transition-transform hover:-translate-y-0.5', focus)}>
        <Play size={15} aria-hidden="true" className="fill-black" /> {children}
      </button>
    )
  if (style === 'prompt')
    return (
      <button type="button" onClick={onClick} className={cx('group inline-flex items-center gap-2 text-lg text-zinc-100', focus)}>
        <span className="text-cyber">root@lab:~$</span>
        <span className="lowercase underline decoration-cyber/40 underline-offset-8 transition-colors group-hover:decoration-cyber">./{String(children).toLowerCase().replace(/ /g, '-')}</span>
        <span aria-hidden="true" className="inline-block h-5 w-2.5 bg-cyber motion-safe:animate-[blink_1s_steps(1)_infinite]" />
      </button>
    )
  if (style === 'key')
    return (
      <button type="button" onClick={onClick} className={cx('group inline-flex items-center gap-3 text-sm tracking-[0.15em] text-zinc-300 uppercase', focus)}>
        <span className="rounded-md border border-b-4 border-cyber/60 bg-zinc-900 px-3 py-1.5 text-xs text-cyber transition-all group-hover:translate-y-0.5 group-hover:border-b-2">Entrée ↵</span>
        {children}
      </button>
    )
  if (style === 'arrow')
    return (
      <button type="button" onClick={onClick} className={cx('group inline-flex items-center gap-3 rounded-full border border-cyber/50 py-2 pr-2 pl-6 text-sm tracking-[0.2em] text-zinc-100 uppercase transition-colors hover:border-cyber', focus)}>
        {children}
        <span className="grid size-9 place-items-center rounded-full bg-cyber text-black transition-transform group-hover:translate-x-1">→</span>
      </button>
    )
  // hud: corner brackets that close in on hover.
  return (
    <button type="button" onClick={onClick} className={cx('group relative px-10 py-3.5 text-[15px] tracking-[0.3em] text-cyber uppercase transition-colors hover:text-white', focus)}>
      {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
        <span key={c} aria-hidden="true" className={cx('absolute size-3 border-cyber transition-all duration-300 group-hover:size-4', c)} />
      ))}
      <span aria-hidden="true" className="absolute inset-0 bg-cyber/0 transition-colors group-hover:bg-cyber/10" />
      <span className="relative">▶ {children}</span>
    </button>
  )
}
