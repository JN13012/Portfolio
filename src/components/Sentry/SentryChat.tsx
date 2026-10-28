import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, PenLine, Play, SendHorizontal } from 'lucide-react'
import { assistantUi as ui, brainNodes, type AnswerSource, type BrainNodeId } from '../../content/assistant'
import { credentials } from '../../content/certifications'
import { hero } from '../../content/hero'
import { projects } from '../../content/projects'
import { assistant, useAssistant } from '../../lib/assistantStore'
import type { RunState } from '../../lib/brain'
import { emitCore } from '../../lib/coreBus'
import { cx } from '../../lib/cx'
import { Sentry, type SentryState } from './Sentry'
import { SentryWelcome } from './SentryWelcome'
import { markSentryWelcomeSeen } from './welcomeSession'
import { useSentryActivity } from './useSentryActivity'

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

/** Message avatars remain still; the header carries the current activity. */
function FromSentry({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <Sentry size={32} animated={false} className="mt-1" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

const bubble = 'rounded-lg rounded-tl-sm border border-white/8 bg-zinc-900 px-3 py-2.5 text-sm leading-relaxed text-zinc-200'

export type SentryChatProps = {
  /** Development expression preview only; never enabled in the production build. */
  preparedPreview?: boolean
  /** Supply only from real service health checks; no backend is connected by default. */
  serviceAvailable?: boolean
  /** Future assistant/security activity can drive the avatar without coupling it to the Hero. */
  activity?: SentryState
  /** Defer the welcome until the globe intro has closed. */
  introComplete?: boolean
}

export function SentryChat({ serviceAvailable = false, activity, introComplete = true, preparedPreview = false }: SentryChatProps) {
  const preview = import.meta.env.DEV && preparedPreview
  const { open, exchanges } = useAssistant()
  const last = exchanges.at(-1) ?? null
  const [draft, setDraft] = useState('')
  const { state, busy, face } = useSentryActivity(preview ? last?.run ?? null : null, preview && !!draft.trim(), introComplete, activity)
  const log = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(open)

  useEffect(() => {
    if (open) {
      markSentryWelcomeSeen()
      const target = input.current ?? close.current
      target?.focus({ preventScroll: true })
    } else if (wasOpen.current) {
      toggle.current?.focus({ preventScroll: true })
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    const el = log.current
    if (el) el.scrollTop = el.scrollHeight
  }, [open, exchanges.length, state?.shown, state?.phase])

  // Prepared questions, inside the chat: the current topic first, never one already asked.
  const asked = new Set(exchanges.map((e) => e.answer?.id))
  const current = last?.node ?? null
  const topics = current ? [nodeOf(current), ...brainNodes.filter((n) => n.id !== current)] : brainNodes
  const suggestions = preview ? topics
    .flatMap((n) => n.questions.map((q) => ({ q, node: n.id })))
    .filter(({ q }) => !asked.has(q.id))
    .slice(0, exchanges.length ? 2 : 4) : []

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    assistant.askFree(text)
    setDraft('')
    input.current?.focus({ preventScroll: true })
  }

  const status = (s: RunState, lit: BrainNodeId[]) =>
    s.phase === 'question' ? ui.reading.fr : s.phase === 'search' ? `${ui.searching.fr} : ${lit.map((id) => nodeOf(id).label.fr).join(', ')}` : ui.writing.fr

  return (
    <aside onKeyDown={(e) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        assistant.setOpen(false)
      }
    }} aria-label={`${ui.name}, ${ui.role.fr}`} className="sentry-chat" data-open={open}>
      {introComplete && !open && <SentryWelcome onDismiss={() => toggle.current?.focus({ preventScroll: true })} />}

      <button
        ref={toggle}
        type="button"
        className="sentry-launcher"
        onClick={() => assistant.setOpen(!open)}
        aria-expanded={open}
        aria-controls={open ? 'sentry-chat' : undefined}
        aria-label={open ? ui.close.fr : ui.open.fr}
      >
        <Sentry size={128} state={face} paused={open || !introComplete} />
        <span className="sentry-launcher__chevron" aria-hidden="true">
          {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </span>
        <span className="sentry-launcher__hint" aria-hidden="true">
          {open ? ui.close.fr : ui.open.fr}
        </span>
      </button>

      {open && (
        <section id="sentry-chat" className="sentry-chat__panel" aria-label="Conversation avec Sentry">
          <header className="flex shrink-0 items-center gap-3 border-b border-white/8 px-3 py-2.5">
            <Sentry size={72} state={face} paused={!introComplete} className="sentry-chat__avatar" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-zinc-100">{ui.name}</p>
              <p className="truncate text-xs text-zinc-400">
                {preview ? serviceAvailable ? <span className="text-cyber-light">{ui.online.fr}</span> : ui.offline.fr : ui.designing.fr}
              </p>
            </div>
            <button
              ref={close}
              type="button"
              onClick={() => assistant.setOpen(false)}
              aria-label={ui.close.fr}
              className="grid size-11 shrink-0 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:shadow-focus focus-visible:outline-none"
            >
              <ChevronDown size={20} aria-hidden="true" />
            </button>
          </header>
          {preview ? <div className="sentry-chat__body flex min-h-0 flex-1 flex-col">
            <div ref={log} className="sentry-chat__log flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
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
                      <FromSentry>
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
                <div className="flex flex-wrap gap-1.5 pl-[40px]">
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
              {last && !busy ? last.answer?.answer.fr ?? ui.freeSoon.fr : ''}
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
                ref={input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={300}
                placeholder={ui.placeholder.fr}
                className="h-10 min-w-0 flex-1 rounded-md border border-white/16 bg-black px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyber/60 focus-visible:outline-none"
              />
              <button
                type="submit"
                aria-label={ui.send.fr}
                disabled={busy || !draft.trim()}
                className="grid size-10 shrink-0 place-items-center rounded-md bg-cyber text-black transition-opacity hover:opacity-90 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-50"
              >
                <SendHorizontal size={17} aria-hidden="true" />
              </button>
            </form>
          </div> : (
            <div className="sentry-chat__log min-h-0 flex-1 overflow-y-auto px-3 py-3">
              <FromSentry>
                <p className={bubble} role="status">{ui.underConstruction.fr}</p>
              </FromSentry>
            </div>
          )}
        </section>
      )}
    </aside>
  )
}
