import { useEffect, useReducer, useRef, useState } from 'react'
import { demoFlag, demoResult, demoScenarios, type DemoScenario } from '../../../../dev/mockups/aiLabFixtures'
import { AttackConsole } from './AttackConsole'
import { AiLabIntro } from './AiLabIntro'
import { DefenseDiagram } from './DefenseDiagram'
import { LevelDrawer } from './LevelDrawer'
import { initialLabState, labReducer } from './labState'
import './aiLab.css'

/** Lot 1: interactive fixtures only. Imported exclusively by the DEV preview in Lab.tsx. */
export default function AiLab() {
  const [state, dispatch] = useReducer(labReducer, initialLabState)
  const [entered, setEntered] = useState(false)
  const consoleRoot = useRef<HTMLDivElement>(null)
  const [drawer, setDrawer] = useState(false)
  const [selectedScenario, setScenario] = useState<DemoScenario>('response')
  const nextAttempt = useRef(1)
  const scenario = demoScenarios.find(item => item.id === selectedScenario)!.fromLevel <= state.level ? selectedScenario : 'response'
  const last = state.attempts.filter(attempt => attempt.result.level === state.level).at(-1)?.result
  useEffect(() => {
    if (entered) consoleRoot.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus({ preventScroll: true })
  }, [entered])
  const send = () => {
    const prompt = state.draft.trim()
    if (!prompt) return
    dispatch({ type: 'attempt', prompt, result: demoResult(state.level, scenario, nextAttempt.current++) })
  }
  return <div className="ai-lab">
    <div className="lab-grid ai-lab__grid">
      <div ref={consoleRoot}>{entered ? <AttackConsole state={state} dispatch={dispatch} scenario={scenario} onScenario={setScenario} onSend={send}
        onValidate={() => dispatch({ type: 'validate-demo', correct: state.flag.trim() === demoFlag(state.level) })} onDetails={() => setDrawer(true)} /> : <AiLabIntro onEnter={() => setEntered(true)} />}</div>
      <DefenseDiagram level={state.level} result={last} />
    </div>
    {drawer && <LevelDrawer level={state.level} completed={state.completed} onClose={() => setDrawer(false)} onSelect={level => dispatch({ type: 'level', level })} />}
  </div>
}
