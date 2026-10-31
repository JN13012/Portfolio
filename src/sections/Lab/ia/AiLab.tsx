import { Activity, useEffect, useReducer, useRef, useState } from 'react'
import { aiLabLevels, aiLabOutcomes, aiLabQuotaCopy, aiLabUnavailable, defenseStages, isAiLabLevel } from '../../../content/aiLab'
import { keepFieldClearOfPlayer } from '../../../lib/keepClearOfPlayer'
import { AttackConsole } from './AttackConsole'
import { AiLabIntro } from './AiLabIntro'
import { DefenseDiagram } from './DefenseDiagram'
import { LevelDrawer } from './LevelDrawer'
import { openSession, sendAttempt, validateFlag } from './labApi'
import { conversationHistory, initialLabState, labReducer, type LabResult } from './labState'
import './aiLab.css'

/** Real attempts on the real model, through `/api/lab`. Nothing here is simulated. */
export default function AiLab() {
  const [state, dispatch] = useReducer(labReducer, initialLabState)
  const [entered, setEntered] = useState(false)
  const [selection, setSelection] = useState(0)
  const [available, setAvailable] = useState(true)
  const consoleRoot = useRef<HTMLDivElement>(null)
  const [drawer, setDrawer] = useState(false)
  const nextAttempt = useRef(1)
  const sessionOpened = useRef(false)
  const last = state.attempts.filter(attempt => attempt.result.level === state.level).at(-1)?.result
  useEffect(() => {
    if (entered) consoleRoot.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus({ preventScroll: true })
    else if (selection > 0) consoleRoot.current?.querySelector<HTMLElement>('[data-lab-intro-heading]')?.focus({ preventScroll: true })
  }, [entered, state.level, selection])
  // No session or database row until the visitor actually enters a level.
  useEffect(() => {
    if (!entered || sessionOpened.current) return
    sessionOpened.current = true
    void openSession().then(session => {
      if (session) dispatch({ type: 'session', completed: session.completed, remaining: session.remaining })
      else setAvailable(false)
    })
  }, [entered])
  const selectLevel = (level: number) => {
    if (!isAiLabLevel(level)) return
    dispatch({ type: 'level', level })
    setSelection(previous => previous + 1)
    setEntered(true)
  }
  const send = async () => {
    const prompt = state.draft.trim()
    if (!prompt || state.pending) return
    const { level, config } = state
    dispatch({ type: 'pending', value: true })
    const reply = await sendAttempt({ level, config, prompt, history: conversationHistory(state) })
    const id = nextAttempt.current++
    const notRun = defenseStages.map(stage => ({ stage: stage.id, status: stage.fromLevel > level ? 'inactive' as const : 'not-run' as const }))
    const result: LabResult = !reply
      ? { id, level, outcome: 'error', title: 'Lab indisponible', explanation: aiLabUnavailable, trace: notRun }
      : reply.outcome === 'quota'
        ? { id, level, outcome: 'quota', title: 'Essais indisponibles', explanation: aiLabQuotaCopy[reply.reason ?? 'busy'], trace: reply.trace }
        : { id, level, outcome: reply.outcome, title: aiLabOutcomes[reply.outcome].title, explanation: aiLabOutcomes[reply.outcome].text, answer: reply.answer, trace: reply.trace }
    dispatch({ type: 'attempt', prompt, config, result, remaining: reply?.remaining ?? null })
  }
  const validate = async () => {
    const reply = await validateFlag(state.level, state.flag)
    if (reply) dispatch({ type: 'validated', correct: reply.correct, completed: reply.completed })
    else setAvailable(false)
  }
  return <div className="ai-lab">
    <div className="lab-grid ai-lab__grid">
      <div ref={consoleRoot} onFocus={keepFieldClearOfPlayer} className="lab-terminal lab-workspace">
        {!entered && <AiLabIntro onEnter={selectLevel} completed={state.completed} />}
        <div className="lab-session" hidden={!entered}><Activity mode={entered ? 'visible' : 'hidden'}>
          <AttackConsole state={state} dispatch={dispatch} available={available} onSend={() => void send()}
            onValidate={() => void validate()} onDetails={() => setDrawer(previous => !previous)}
            onPresentation={() => setEntered(false)} curriculumOpen={drawer} />
        </Activity></div>
        {drawer && <LevelDrawer level={entered ? state.level : undefined} completed={state.completed} onClose={() => setDrawer(false)} onSelect={selectLevel} />}
      </div>
      <DefenseDiagram level={state.level} result={last} hintsShown={state.hints[state.level] ?? 0} onHint={() => dispatch({ type: 'hint', total: aiLabLevels[state.level - 1]!.hints.length })} />
    </div>
  </div>
}
