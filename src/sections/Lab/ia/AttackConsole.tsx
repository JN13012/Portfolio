import { useEffect, useRef, type Dispatch, type FormEvent } from 'react'
import { Send, ShieldCheck, Terminal } from 'lucide-react'
import { aiLabConfigs, aiLabCurriculum, aiLabLevels, aiLabUnavailable, defensePanelCopy, type AiLabConfig } from '../../../content/aiLab'
import { labReducer, type LabState } from './labState'
import { LabNavigation } from '../LabNavigation'

const levelCount = String(aiLabCurriculum.reduce((count, part) => count + part.levels.length, 0)).padStart(2, '0')

type Props = {
  state: LabState
  dispatch: Dispatch<Parameters<typeof labReducer>[1]>
  available: boolean
  onSend: () => void
  onValidate: () => void
  onDetails: () => void
  onPresentation: () => void
  curriculumOpen: boolean
}

export function AttackConsole({ state, dispatch, available, onSend, onValidate, onDetails, onPresentation, curriculumOpen }: Props) {
  const history = useRef<HTMLDivElement>(null)
  const level = aiLabLevels[state.level - 1]!
  const attempts = state.attempts.filter(attempt => attempt.result.level === state.level)
  useEffect(() => {
    const node = history.current
    if (node) node.scrollTop = node.scrollHeight
  }, [state.attempts, state.level, state.pending])
  const send = (event: FormEvent) => { event.preventDefault(); onSend() }
  const canSend = available && !state.pending && !!state.draft.trim()
  return (
    <div className="lab-terminal ai-lab__console">
      <div className="ai-lab__console-heading">
        <span className="ai-lab__level-title">
          {state.completed.includes(state.level) ? <ShieldCheck size={14} aria-hidden="true" data-solved="true" /> : <Terminal size={14} aria-hidden="true" />}
          <span>{String(state.level).padStart(2, '0')}/{levelCount} · {level.title}</span>
        </span>
        <LabNavigation tone="blue" onPresentation={onPresentation} onCurriculum={onDetails} open={curriculumOpen} drawerId="ai-lab-curriculum" />
      </div>
      <div className="ai-lab__history" ref={history} role="log" aria-label="Conversation avec Sentry" aria-live="polite" aria-relevant="additions">
        <div className="ai-lab__boot">
          <p><span aria-hidden="true">&gt;&gt;</span> RED-TEAM SENTRY — CAPTURE THE FLAG</p>
          <p className="ai-lab__greeting"><span>sentry&gt;</span> Je protège un flag. Votre mission : me le faire révéler.</p>
          <p><span aria-hidden="true">&gt;&gt;</span> Cible volontairement vulnérable, flag fictif, vrai modèle.</p>
          <p><span aria-hidden="true">&gt;&gt;</span> Saisissez votre premier prompt pour commencer.</p>
        </div>
        {!available && <p className="ai-lab__empty" role="status">{aiLabUnavailable}</p>}
        {attempts.map(({ prompt, result }) => <div className="ai-lab__exchange" key={result.id}>
          <p className="ai-lab__prompt"><span>vous&gt;</span> {prompt}</p>
          <p className="ai-lab__result-label" data-outcome={result.outcome}>{result.title}</p>
          {result.answer && <p className="ai-lab__answer"><span>sentry&gt;</span> {result.answer}</p>}
          <button type="button" className="ai-lab__see-trace" onClick={() => document.getElementById('ai-lab-defenses')?.scrollIntoView()}>{defensePanelCopy.seeTrace}</button>
        </div>)}
        {state.pending && <p className="ai-lab__empty" role="status">{defensePanelCopy.analysing}</p>}
      </div>
      <div className="ai-lab__controls">
        <div className="ai-lab__toolbar">
          <label className="ai-lab__scenario">Défense
            <select value={state.config} disabled={state.pending} onChange={event => dispatch({ type: 'config', value: event.target.value as AiLabConfig })}>
              {aiLabConfigs.map(config => <option key={config.id} value={config.id}>{config.label}</option>)}
            </select>
          </label>
          <button type="button" className="ai-lab__new-conversation" disabled={state.pending || !attempts.length} onClick={() => dispatch({ type: 'new-conversation' })}>Nouvelle conversation</button>
          <form onSubmit={event => { event.preventDefault(); onValidate() }} className="ai-lab__flag-form">
            <label htmlFor="ai-lab-flag">Valider le flag</label>
            <div><input id="ai-lab-flag" value={state.flag} maxLength={100} autoComplete="off" spellCheck={false} placeholder="FLAG{…}" onChange={event => dispatch({ type: 'flag', value: event.target.value })} />
              <button type="submit" disabled={!state.flag.trim() || !available}>Valider</button></div>
          </form>
          {state.validation !== 'idle' && <p className="ai-lab__validation" role="status">
            {state.validation === 'incorrect' ? 'Ce flag n’est pas le bon pour ce niveau.' : 'Flag validé par le serveur : niveau réussi.'}
          </p>}
        </div>
        <form onSubmit={send} className="ai-lab__prompt-form">
          <span className="ai-lab__prompt-mark" aria-hidden="true">&gt;</span>
          <label className="sr-only" htmlFor="ai-lab-prompt">Votre prompt</label>
          <textarea id="ai-lab-prompt" rows={2} maxLength={2000} value={state.draft} placeholder="Votre prompt…" onChange={event => dispatch({ type: 'draft', value: event.target.value })}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); if (canSend) onSend() }
            }} />
          <button type="submit" className="ai-lab__send" disabled={!canSend}><Send size={15} aria-hidden="true" /><span>Envoyer</span></button>
        </form>
        <p className="ai-lab__notice">{state.remaining !== null && <strong>Essais restants : {state.remaining}. </strong>}{defensePanelCopy.notice}</p>
      </div>
    </div>
  )
}
