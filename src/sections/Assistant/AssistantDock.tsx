// The chat with Sentry, docked at the bottom right of every page, like a messaging window. Folded: a
// bar with Sentry, its name and « En ligne ». Open: greeting, prepared questions, the conversation
// with sources (a project or certification opens its modal, a section is a link) and the question
// box with ▶ for the voice introduction (V1.1). The hero network plays each answer (assistantStore).
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, PenLine, Play, SendHorizontal } from 'lucide-react'
import { assistantUi as ui, brainNodes, type AnswerSource, type BrainNodeId } from '../../content/assistant'
import { credentials } from '../../content/certifications'
import { hero } from '../../content/hero'
import { projects } from '../../content/projects'
import { assistant, useAssistant } from '../../lib/assistantStore'
import { runState, type Run, type RunState } from '../../lib/brain'
import { emitCore } from '../../lib/coreBus'
import { cx } from '../../lib/cx'
import { Sentry, type SentryMood } from './Sentry'

/** Re-renders every frame while an answer is being played. */
function useRunState(run: Run | null): RunState | null {
  const [now, setNow] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const tick = () => {
      const t = performance.now()
      setNow(t)
      if (runState(run, t).phase !== 'done') raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run])
  return run ? runState(run, Math.max(now, 0)) : null
}

const nodeOf = (id: BrainNodeId) => brainNodes.find((n) => n.id === id)!
const chip = 'inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] text-left transition-colors focus-visible:outline-none focus-visible:shadow-focus'

function Source({ source }: { source: AnswerSource }) {
  const style = `${chip} border-cyber/45 text-cyber-light hover:bg-cyber/10`
  if (source.kind === 'section') {
    const node = nodeOf(source.node)
    return (
      <a href={node.target} aria-label={`${ui.goTo.fr} : ${node.label.fr}`} className={style}>
        {node.label.fr} <ArrowRight size={13} aria-hidden="true" />
      </a>
    )
  }
  const [section, title, open] =
    source.kind === 'project'
      ? [nodeOf('projects').label.fr, projects.find((p) => p.slug === source.slug)?.title, () => emitCore('openProject', { slug: source.slug })]
      : [nodeOf('certifications').label.fr, credentials.find((c) => c.id === source.id)?.title, () => emitCore('openCredential', { id: source.id })]
  return (
    <button type="button" onClick={open} aria-haspopup="dialog" className={style}>
      {section} · {title}
    </button>
  )
}

/** A message from Sentry: its small face, then the bubble. */
function FromSentry({ children, mood = 'idle' }: { children: React.ReactNode; mood?: SentryMood }) {
  return (
    <div className="flex items-start gap-2">
      <Sentry size={26} mood={mood} className="mt-1" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const bubble = 'rounded-lg rounded-tl-sm border border-white/8 bg-zinc-900 px-3 py-2.5 text-sm leading-relaxed text-zinc-200'

export function AssistantDock() {
  const { open, exchanges } = useAssistant()
  const last = exchanges.at(-1) ?? null
  const state = useRunState(last?.run ?? null)
  const busy = !!state && state.phase !== 'done'
  const [draft, setDraft] = useState('')
  const log = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = log.current
    if (el) el.scrollTop = el.scrollHeight
  }, [open, exchanges.length, state?.shown, state?.phase])

  // Prepared questions, inside the chat: the current topic first, never one already asked.
  const asked = new Set(exchanges.map((e) => e.answer?.id))
  const current = last?.node ?? null
  const topics = current ? [nodeOf(current), ...brainNodes.filter((n) => n.id !== current)] : brainNodes
  const suggestions = topics
    .flatMap((n) => n.questions.map((q) => ({ q, node: n.id })))
    .filter(({ q }) => !asked.has(q.id))
    .slice(0, exchanges.length ? 2 : 4)

  const mood: SentryMood = busy ? (state.phase === 'question' ? 'reading' : 'thinking') : last?.answer ? 'happy' : 'idle'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    assistant.askFree(text)
    setDraft('')
  }

  const status = (s: RunState, lit: BrainNodeId[]) =>
    s.phase === 'question' ? ui.reading.fr : s.phase === 'search' ? `${ui.searching.fr} : ${lit.map((id) => nodeOf(id).label.fr).join(', ')}` : ui.writing.fr

  return (
    <aside aria-label={`${ui.name}, ${ui.role.fr}`} className="fixed right-0 bottom-0 z-[1050] w-full sm:right-6 sm:w-[360px]">
      <section className="flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-white/12 bg-zinc-950/95 shadow-[0_-10px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => assistant.setOpen(!open)}
          aria-expanded={open}
          aria-controls="sentry-chat"
          aria-label={open ? ui.close.fr : ui.open.fr}
          className="flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:shadow-focus focus-visible:outline-none"
        >
          <span className="relative">
            <Sentry size={36} mood={mood} />
            <span aria-hidden="true" className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-zinc-950 bg-cyber" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-zinc-100">{ui.name}</span>
            <span className="block truncate text-xs text-zinc-400">
              {ui.role.fr} · <span className="text-cyber-light">{ui.online.fr}</span>
            </span>
          </span>
          {open ? <ChevronDown size={18} aria-hidden="true" className="text-zinc-400" /> : <ChevronUp size={18} aria-hidden="true" className="text-zinc-400" />}
        </button>

        {open && (
          <div id="sentry-chat" className="flex h-[calc(100dvh-4.5rem)] flex-col border-t border-white/8 sm:h-[min(34rem,72vh)]">
            <div ref={log} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
              <FromSentry>
                <p className={bubble}>{ui.greeting.fr}</p>
              </FromSentry>

              {exchanges.map((x) => {
                const live = x === last ? state : null
                const done = !live || live.phase === 'done'
                return (
                  <div key={x.id} className="flex flex-col gap-2.5">
                    <p className="max-w-[85%] self-end rounded-lg rounded-tr-sm border border-cyber/35 bg-cyber/14 px-3 py-2 text-sm text-zinc-100">{x.question}</p>
                    {!x.answer ? (
                      <FromSentry>
                        <div className={bubble}>
                          {ui.freeSoon.fr}{' '}
                          <a href="#contact" className="text-cyber underline-offset-2 hover:underline">
                            {ui.writeToHim.fr}
                          </a>
                        </div>
                      </FromSentry>
                    ) : (
                      <FromSentry mood={x === last ? mood : 'idle'}>
                        {live && !done && live.phase !== 'write' ? (
                          <p className="flex items-center gap-2 pt-1.5 text-[13px] text-cyber-light">
                            <span aria-hidden="true" className="size-2 rounded-full bg-cyber shadow-[0_0_8px_var(--color-cyber)]" />
                            {status(live, x.run?.lit ?? [])}
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <p className={bubble}>{done ? x.answer.answer.fr : x.answer.answer.fr.slice(0, live!.shown)}</p>
                            {done && (
                              <>
                                <p className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                                  {x.answer.validated ? <BadgeCheck size={14} aria-hidden="true" className="text-cyber" /> : <PenLine size={13} aria-hidden="true" />}
                                  {x.answer.validated ? ui.validated.fr : ui.draft.fr}
                                </p>
                                <p className="text-[11px] tracking-[0.16em] text-zinc-400 uppercase">{ui.sources.fr}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {x.answer.sources.map((s, i) => (
                                    <Source key={i} source={s} />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </FromSentry>
                    )}
                  </div>
                )
              })}

              {/* Prepared questions, inside the conversation (more of them before the first one). */}
              {!busy && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-[34px]">
                  {suggestions.map(({ q, node }) => (
                    <button key={q.id} type="button" onClick={() => assistant.ask(q, node)} className={cx(chip, 'border-white/14 text-zinc-300 hover:border-cyber/50 hover:text-zinc-100')}>
                      {q.question.fr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Screen readers get the whole answer once, not every character. */}
            <p className="sr-only" aria-live="polite">
              {last?.answer && !busy ? last.answer.answer.fr : ''}
            </p>

            <form onSubmit={submit} className="flex gap-2 border-t border-white/8 p-3">
              {/* Voice introduction (V1.1): reserved spot, disabled until the audio exists. */}
              <button
                type="button"
                disabled
                aria-label={`${hero.voice.fr} (${hero.voiceSoon.fr})`}
                title={`${hero.voice.fr} · ${hero.voiceSoon.fr}`}
                className="grid size-10 shrink-0 cursor-not-allowed place-items-center rounded-md border border-white/12 text-zinc-500"
              >
                <Play size={15} aria-hidden="true" />
              </button>
              <label htmlFor="assistant-input" className="sr-only">
                {ui.inputLabel.fr}
              </label>
              <input
                id="assistant-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={300}
                placeholder={ui.placeholder.fr}
                className="h-10 min-w-0 flex-1 rounded-md border border-white/16 bg-black px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyber/60 focus-visible:outline-none"
              />
              <button
                type="submit"
                aria-label={ui.send.fr}
                disabled={busy}
                className="grid size-10 shrink-0 place-items-center rounded-md bg-cyber text-black transition-opacity hover:opacity-90 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-50"
              >
                <SendHorizontal size={17} aria-hidden="true" />
              </button>
            </form>
          </div>
        )}
      </section>
    </aside>
  )
}
