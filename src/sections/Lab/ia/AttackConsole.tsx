import { useEffect, useRef, type Dispatch, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { aiLabLevels } from '../../../content/aiLab'
import { demoScenarios, type DemoScenario } from '../../../../dev/mockups/aiLabFixtures'
import { labReducer, type LabState } from './labState'
import { LabNavigation } from '../LabNavigation'

type Props = {
  state: LabState
  dispatch: Dispatch<Parameters<typeof labReducer>[1]>
  scenario: DemoScenario
  onScenario: (scenario: DemoScenario) => void
  onSend: () => void
  onValidate: () => void
  onDetails: () => void
  onPresentation: () => void
  curriculumOpen: boolean
}

export function AttackConsole({ state, dispatch, scenario, onScenario, onSend, onValidate, onDetails, onPresentation, curriculumOpen }: Props) {
  const history = useRef<HTMLDivElement>(null)
  const level = aiLabLevels[state.level - 1]!
  const attempts = state.attempts.filter(attempt => attempt.result.level === state.level)
  useEffect(() => {
    const node = history.current
    if (node) node.scrollTop = node.scrollHeight
  }, [state.attempts, state.level])
  const send = (event: FormEvent) => { event.preventDefault(); onSend() }
  return (
    <div className="lab-terminal ai-lab__console">
      <div className="ai-lab__console-heading">
        <span className="ai-lab__level-title">{String(state.level).padStart(2, '0')}/09 · {level.title}</span>
        <LabNavigation tone="blue" onPresentation={onPresentation} onCurriculum={onDetails} open={curriculumOpen} drawerId="ai-lab-curriculum" />
      </div>
      <div className="ai-lab__console-meta"><span>Sentry · niveau {state.level}</span><span>{level.title}</span></div>
      <div className="ai-lab__history" ref={history} role="log" aria-label="Conversation de démonstration" aria-live="polite" aria-relevant="additions">
        <div className="ai-lab__boot">
          <p><span aria-hidden="true">&gt;&gt;</span> LABORATOIRE DE SÉCURITÉ IA — CAPTURE THE FLAG</p>
          <p className="ai-lab__greeting"><span>sentry&gt;</span> Je protège un flag. Votre mission : me le faire révéler.</p>
          <p><span aria-hidden="true">&gt;&gt;</span> Chaque niveau ajoute une défense.</p>
          <p><span aria-hidden="true">&gt;&gt;</span> Saisissez votre premier prompt pour commencer.</p>
        </div>
        {attempts.length === 0 && <p className="ai-lab__empty">Choisissez un scénario ci-dessous, puis envoyez un prompt pour voir son résultat simulé.</p>}
        {attempts.map(({ prompt, result }) => <div className="ai-lab__exchange" key={result.id}>
          <p className="ai-lab__prompt"><span>vous&gt;</span> {prompt}</p>
          <p className="ai-lab__result-label" data-outcome={result.outcome}>Démonstration · {result.title}</p>
          {result.answer && <p className="ai-lab__answer"><span>sentry&gt;</span> {result.answer}</p>}
          <p className="ai-lab__explanation">{result.explanation}</p>
        </div>)}
      </div>
      <div className="ai-lab__controls">
        <label className="ai-lab__scenario">Scénario simulé
          <select value={scenario} onChange={event => onScenario(event.target.value as DemoScenario)}>
            {demoScenarios.map(item => <option key={item.id} value={item.id} disabled={item.fromLevel > state.level}>{item.label}{item.fromLevel > state.level ? ` · niveau ${item.fromLevel}` : ''}</option>)}
          </select>
        </label>
        <form onSubmit={send} className="ai-lab__prompt-form">
          <label className="sr-only" htmlFor="ai-lab-prompt">Votre prompt de démonstration</label>
          <textarea id="ai-lab-prompt" rows={2} maxLength={2000} value={state.draft} placeholder="Votre prompt…" onChange={event => dispatch({ type: 'draft', value: event.target.value })}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); onSend() }
            }} />
          <button type="submit" className="ai-lab__send" disabled={!state.draft.trim()}><Send size={15} aria-hidden="true" /><span>Envoyer</span></button>
        </form>
        <form onSubmit={event => { event.preventDefault(); onValidate() }} className="ai-lab__flag-form">
          <label htmlFor="ai-lab-flag">Valider le flag fictif</label>
          <div><input id="ai-lab-flag" value={state.flag} maxLength={100} autoComplete="off" spellCheck={false} placeholder="DEMO{…}" onChange={event => dispatch({ type: 'flag', value: event.target.value })} />
            <button type="submit" disabled={!state.flag.trim()}>Valider</button></div>
        </form>
        {state.validation !== 'idle' && <p className="ai-lab__validation" role="status">
          {state.validation === 'incorrect' ? 'Ce flag ne correspond pas à la démonstration de ce niveau.' : 'Flag de démonstration validé pour ce niveau.'}
        </p>}
      </div>
    </div>
  )
}
