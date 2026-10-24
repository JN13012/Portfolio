import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
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

export type StartButtonStyle = 'hud' | 'solid' | 'prompt' | 'key' | 'arrow' | 'neon' | 'bracket' | 'loader' | 'split' | 'card' | 'cap' | 'tilt' | 'brick' | 'socket'

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

export function CtfIntro({ onStart, button = 'socket' }: { onStart: () => void; button?: StartButtonStyle }) {
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
      {/* Scanlines, like an old CRT screen: very faint and still (moving lines hurt reading),
          plus a faint refresh band that sweeps by every few seconds. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 4px)',
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <span
          className="absolute inset-x-0 top-0 block h-1/4 motion-safe:animate-[scan-sweep_6s_linear_infinite] motion-reduce:hidden"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(74,222,128,0.06) 50%, transparent)',
          }}
        />
      </span>

      <p className="text-2xl font-bold tracking-[0.25em] text-cyber uppercase [text-shadow:0_0_18px_rgba(74,222,128,0.45)] motion-safe:animate-[crt-glitch_3s_steps(1)_infinite]">
        <Typed text={TITLE} from={0} chars={chars} />
      </p>
      <p className="mt-2 text-[15px] text-zinc-300 motion-safe:animate-[crt-glitch_4.2s_steps(1)_1.1s_infinite]">
        <Typed text={SUBTITLE} from={TITLE.length} chars={chars} />
      </p>

      {/* The 9 levels as one centred path, in three phases; finished levels get a tick. */}
      <ol className="mt-8 w-full max-w-lg text-left">
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

      <div className={cx('relative z-20 mt-auto flex flex-col items-center gap-3 pt-6 transition-opacity duration-500', typing ? 'opacity-0' : 'opacity-100')}>
        {/* Slow blink, with the same occasional screen jump as the text. */}
        <span className="motion-safe:animate-[start-blink_2.8s_ease-in-out_infinite]">
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
  if (style === 'cap') return <KeycapButton onClick={onClick}>{children}</KeycapButton>
  if (style === 'tilt') return <TiltButton onClick={onClick}>{children}</TiltButton>
  if (style === 'brick') return <BrickButton onClick={onClick}>{children}</BrickButton>
  if (style === 'socket') return <SocketButton onClick={onClick}>{children}</SocketButton>
  if (style === 'solid')
    return (
      <button
        type="button"
        onClick={onClick}
        className={cx(
          'inline-flex items-center gap-2.5 bg-cyber px-8 py-3.5 text-sm font-bold tracking-[0.2em] text-black uppercase shadow-[0_8px_30px_-8px_var(--color-cyber)] transition-transform hover:-translate-y-0.5',
          focus,
        )}
      >
        <Play size={15} aria-hidden="true" className="fill-black" /> {children}
      </button>
    )
  if (style === 'prompt')
    return (
      <button type="button" onClick={onClick} className={cx('group inline-flex items-center gap-2 text-lg text-zinc-100', focus)}>
        <span className="text-cyber">root@lab:~$</span>
        <span className="lowercase underline decoration-cyber/40 underline-offset-8 transition-colors group-hover:decoration-cyber">
          ./{String(children).toLowerCase().replace(/ /g, '-')}
        </span>
        <span aria-hidden="true" className="inline-block h-5 w-2.5 bg-cyber motion-safe:animate-[blink_1s_steps(1)_infinite]" />
      </button>
    )
  if (style === 'key')
    return (
      <button type="button" onClick={onClick} className={cx('group inline-flex items-center gap-3 text-sm tracking-[0.15em] text-zinc-300 uppercase', focus)}>
        <span className="rounded-md border border-b-4 border-cyber/60 bg-zinc-900 px-3 py-1.5 text-xs text-cyber transition-all group-hover:translate-y-0.5 group-hover:border-b-2">
          Entrée ↵
        </span>
        {children}
      </button>
    )
  if (style === 'arrow')
    return (
      <button
        type="button"
        onClick={onClick}
        className={cx(
          'group inline-flex items-center gap-3 rounded-full border border-cyber/50 py-2 pr-2 pl-6 text-sm tracking-[0.2em] text-zinc-100 uppercase transition-colors hover:border-cyber',
          focus,
        )}
      >
        {children}
        <span className="grid size-9 place-items-center rounded-full bg-cyber text-black transition-transform group-hover:translate-x-1">→</span>
      </button>
    )
  if (style === 'neon')
    return (
      <button
        type="button"
        onClick={onClick}
        // 3D: a dark green edge underneath (the button's thickness); it lifts on hover and presses down on click.
        className={cx(
          'rounded-sm border-2 border-cyber bg-[linear-gradient(180deg,rgba(74,222,128,0.16),rgba(74,222,128,0.04))] px-9 py-3 text-[15px] font-bold tracking-[0.3em] text-cyber uppercase transition-all duration-150 [text-shadow:0_0_10px_var(--color-cyber)]',
          'shadow-[0_7px_0_#15803d,0_8px_22px_-4px_rgba(74,222,128,0.55),inset_0_0_14px_rgba(74,222,128,0.3)]',
          'hover:-translate-y-0.5 hover:shadow-[0_9px_0_#15803d,0_12px_30px_-4px_rgba(74,222,128,0.7),inset_0_0_20px_rgba(74,222,128,0.45)]',
          'active:translate-y-1.5 active:shadow-[0_2px_0_#15803d,0_2px_10px_rgba(74,222,128,0.5),inset_0_0_20px_rgba(74,222,128,0.45)]',
          focus,
        )}
      >
        {children}
      </button>
    )
  if (style === 'bracket')
    return (
      <button type="button" onClick={onClick} className={cx('group text-lg tracking-[0.25em] text-zinc-100 uppercase', focus)}>
        <span className="text-cyber transition-all group-hover:mr-3">[</span>
        <span className="px-3 transition-colors group-hover:text-cyber">{children}</span>
        <span className="text-cyber transition-all group-hover:ml-3">]</span>
      </button>
    )
  if (style === 'loader')
    return (
      <button
        type="button"
        onClick={onClick}
        className={cx('group relative overflow-hidden border border-cyber/60 px-10 py-3.5 text-sm tracking-[0.3em] text-cyber uppercase', focus)}
      >
        {/* A bar fills the button on hover, like a loading progress. */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0 bg-cyber transition-all duration-500 ease-out group-hover:w-full" />
        <span className="relative transition-colors duration-300 group-hover:text-black">{children} ▸▸</span>
      </button>
    )
  if (style === 'split')
    return (
      <button
        type="button"
        onClick={onClick}
        className={cx('group relative border border-white/20 bg-black px-10 py-3.5 text-[15px] font-bold tracking-[0.3em] text-white uppercase', focus)}
      >
        {/* Permanent RGB split, like a signal slightly out of phase. */}
        <span className="[text-shadow:2px_0_rgba(244,63,94,0.8),-2px_0_rgba(56,189,248,0.8)] transition-[text-shadow] group-hover:[text-shadow:3px_0_rgba(244,63,94,0.9),-3px_0_rgba(56,189,248,0.9)]">
          {children}
        </span>
      </button>
    )
  if (style === 'card')
    return (
      <button
        type="button"
        onClick={onClick}
        className={cx('group flex flex-col items-start gap-1 border-l-2 border-cyber bg-cyber/5 py-3 pr-10 pl-5 text-left transition-colors hover:bg-cyber/10', focus)}
      >
        <span className="text-[15px] font-bold tracking-[0.2em] text-white uppercase">{children}</span>
        <span className="text-xs text-cyber">&gt; ./start_ctf.sh</span>
      </button>
    )
  // hud: corner brackets that close in on hover.
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('group relative px-10 py-3.5 text-[15px] tracking-[0.3em] text-cyber uppercase transition-colors hover:text-white', focus)}
    >
      {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
        <span key={c} aria-hidden="true" className={cx('absolute size-3 border-cyber transition-all duration-300 group-hover:size-4', c)} />
      ))}
      <span aria-hidden="true" className="absolute inset-0 bg-cyber/0 transition-colors group-hover:bg-cyber/10" />
      <span className="relative">▶ {children}</span>
    </button>
  )
}

/**
 * Keycap: a pushable 3D key in three layers (soft shadow, edge, front face). The face rises on
 * hover and sinks into the edge on press; the edge is darker at both ends, like a rounded side.
 */
function KeycapButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative cursor-pointer border-none bg-transparent p-0 outline-offset-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-cyber"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-[4px] rounded-lg bg-black/60 blur-[4px] transition-transform duration-500 group-hover:translate-y-[6px] group-hover:duration-200 group-active:translate-y-[1px] group-active:duration-75"
      />
      <span aria-hidden="true" className="absolute inset-0 rounded-lg bg-[linear-gradient(90deg,#0a2e18,#15803d_8%,#15803d_92%,#0a2e18)]" />
      <span className="relative block -translate-y-[6px] rounded-lg border border-cyber/70 bg-[linear-gradient(180deg,#1b5e36,#0f3a22)] px-10 py-3.5 text-[15px] font-bold tracking-[0.3em] whitespace-nowrap text-white uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] [text-shadow:0_0_10px_rgba(74,222,128,0.8)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-[9px] group-hover:duration-200 group-hover:[transition-timing-function:cubic-bezier(0.3,0.7,0.4,1.5)] group-active:-translate-y-[2px] group-active:duration-75">
        ▶ {children}
      </span>
    </button>
  )
}

/**
 * Tilt: a glass panel that leans towards the pointer, with a light reflection following it.
 * Flat under reduced motion and on touch screens (no pointer to follow).
 */
function TiltButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  const move = (e: ReactPointerEvent) => {
    const el = ref.current
    if (!el || reduced || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${-y * 16}deg) rotateY(${x * 22}deg) translateZ(8px)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }
  return (
    <span className="inline-block [perspective:600px]">
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        onPointerMove={move}
        onPointerLeave={leave}
        className="relative block overflow-hidden rounded-md border border-cyber/60 bg-cyber/10 px-11 py-4 whitespace-nowrap text-[15px] font-bold tracking-[0.3em] text-cyber uppercase shadow-[0_18px_40px_-14px_rgba(74,222,128,0.6)] backdrop-blur-sm transition-transform duration-150 ease-out [transform-style:preserve-3d] [text-shadow:0_0_10px_var(--color-cyber)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgba(255,255,255,0.22),transparent_55%)]"
        />
        <span className="relative inline-block [transform:translateZ(20px)]">▶ {children}</span>
      </button>
    </span>
  )
}

/**
 * Brick: the tilting glass face of « tilt » set on a thick block. The block's side (green, darker at
 * the ends) shows under the face; the whole brick leans towards the pointer, the face rises on hover
 * and sinks into the block when pressed. Flat under reduced motion and on touch screens.
 */
function BrickButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const move = (e: ReactPointerEvent) => {
    const el = ref.current
    if (!el || reduced || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 18}deg)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }
  return (
    <span className="inline-block pt-2 [perspective:700px]">
      <span ref={ref} className="block transition-transform duration-150 ease-out [transform-style:preserve-3d]">
        <button
          type="button"
          onClick={onClick}
          onPointerMove={move}
          onPointerLeave={leave}
          className="group relative block cursor-pointer rounded-lg focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber"
        >
          {/* Soft shadow and glow on the surface under the brick. */}
          <span aria-hidden="true" className="absolute inset-x-1 -bottom-3 h-6 rounded-[50%] bg-cyber/35 blur-xl transition-opacity group-hover:opacity-100 sm:opacity-70" />
          <span aria-hidden="true" className="absolute inset-0 translate-y-[5px] rounded-lg bg-black/70 blur-[5px]" />
          {/* The block's side, visible under the face. */}
          <span aria-hidden="true" className="absolute inset-0 rounded-lg bg-[linear-gradient(90deg,#062314,#15803d_10%,#16a34a_50%,#15803d_90%,#062314)]" />
          {/* The face: dark glass with a lit top edge and a reflection following the pointer. */}
          <span className="relative block -translate-y-[9px] overflow-hidden rounded-lg border border-cyber/80 bg-[linear-gradient(180deg,#14402a,#0a2416)] px-11 py-4 text-[15px] font-bold tracking-[0.3em] whitespace-nowrap text-white uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.35)] transition-transform duration-300 [text-shadow:0_0_12px_rgba(74,222,128,0.9)] [transition-timing-function:cubic-bezier(0.3,0.7,0.4,1.4)] group-hover:-translate-y-[12px] group-active:-translate-y-[2px] group-active:duration-75">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgba(255,255,255,0.2),transparent_55%)]"
            />
            <span className="relative">▶ {children}</span>
          </span>
        </button>
      </span>
    </span>
  )
}

/**
 * Socket: a key sitting in a recessed housing. The housing never moves; the key stands a little
 * above it (its side shows at the bottom) and, when pressed, sinks into the housing, flush and
 * darker, like a real push button. The whole unit leans towards the pointer (not on touch screens
 * or under reduced motion).
 */
function SocketButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const move = (e: ReactPointerEvent) => {
    const el = ref.current
    if (!el || reduced || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 24}deg)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }
  return (
    <span className="inline-block [perspective:700px]">
      <span ref={ref} className="block transition-transform duration-150 ease-out">
        <button
          type="button"
          onClick={onClick}
          onPointerMove={move}
          onPointerLeave={leave}
          // The housing: a dark recessed frame.
          className="group block cursor-pointer rounded-2xl focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyber"
        >
          {/* A dark recessed well the key sits in. */}
          <span className="block rounded-[13px] bg-[#040607] px-2.5 pt-3 pb-2.5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95),inset_0_-1px_0_rgba(255,255,255,0.06)]">
            <span className="relative block">
              {/* Fixed outline at the key's resting size (1px out): it stays put while the key sinks. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[3px] rounded-[10px] border border-cyber/15 transition-colors duration-100 group-active:border-cyber/60"
              />
              {/* The key: stands out of the well; pressed, it shrinks back into it, away from the viewer, and darkens. */}
              <span className="relative block overflow-hidden rounded-lg border border-cyber/60 bg-[linear-gradient(180deg,#1f6b40,#0e3a22)] px-3.5 py-3.5 text-[15px] font-bold tracking-[0.3em] whitespace-nowrap text-white uppercase shadow-[0_0_0_2px_#0b3a1f,0_6px_14px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-100 ease-out [text-shadow:0_0_5px_rgba(74,222,128,0.3)] group-hover:brightness-110 group-active:scale-[0.94] group-active:bg-[linear-gradient(180deg,#123e26,#0a2818)] group-active:shadow-[0_0_0_0_#0b3a1f,inset_0_3px_10px_rgba(0,0,0,0.75)] group-active:brightness-90">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgba(255,255,255,0.18),transparent_55%)]"
                />
                <span className="relative">▶ {children}</span>
              </span>
            </span>
          </span>
        </button>
      </span>
    </span>
  )
}
