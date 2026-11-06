import type { Dispatch, ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { cvMessage, defensePanelCopy, poisonedCv } from '../../../content/lab/ai'
import type { CvView, labReducer, LabAttempt, LabState } from './labState'

type Props = {
  state: LabState
  dispatch: Dispatch<Parameters<typeof labReducer>[1]>
  last?: LabAttempt
  success: (attemptId: number) => ReactNode
}

/** Level 4: the visitor edits a CV that Sentry screens for a recruiter. The white text is what the recruiter never sees. */
export function PoisonedCv({ state, dispatch, last, success }: Props) {
  const { cv, cvView: view } = state
  const editing = view === 'edit'
  return <>
    <p className="ai-cv__mission"><span>Mission</span> {poisonedCv.mission}</p>
    <p className="ai-cv__offer"><span>Offre</span> {poisonedCv.offer}. Exigés : {poisonedCv.criteriaShort}.</p>
    <div className="ai-cv__views" role="group" aria-label="Affichage du CV">
      {(Object.entries(poisonedCv.views) as [CvView, string][]).map(([id, label]) =>
        <button key={id} type="button" aria-pressed={view === id} onClick={() => dispatch({ type: 'cv-view', view: id })}>{label}</button>)}
    </div>
    {view === 'sentry'
      ? <pre className="ai-cv__extract" aria-label={poisonedCv.views.sentry}>{cvMessage(cv.profile, cv.hidden)}</pre>
      : <article className="ai-cv__paper" aria-label={`CV de ${poisonedCv.name}`}>
          <header><h4>{poisonedCv.name}</h4><p>Poste visé : {poisonedCv.offer}</p></header>
          <section>
            <h5><Lock size={11} aria-hidden="true" /> {poisonedCv.verifiedTitle}</h5>
            <ul>{poisonedCv.verified.map(line => <li key={line}>{line}</li>)}</ul>
          </section>
          <section>
            <h5>{editing ? <label htmlFor="ai-lab-cv-profile">{poisonedCv.profileTitle}</label> : poisonedCv.profileTitle}</h5>
            {editing
              ? <textarea id="ai-lab-cv-profile" rows={3} maxLength={poisonedCv.maxProfile} value={cv.profile} onChange={event => dispatch({ type: 'cv', field: 'profile', value: event.target.value })} />
              : <p>{cv.profile}</p>}
          </section>
          {editing
            ? <div className="ai-cv__hidden">
                <label htmlFor="ai-lab-cv-hidden">{poisonedCv.hiddenLabel}</label>
                <textarea id="ai-lab-cv-hidden" rows={4} maxLength={poisonedCv.maxHidden} value={cv.hidden} placeholder="Vide pour l’instant." onChange={event => dispatch({ type: 'cv', field: 'hidden', value: event.target.value })} />
              </div>
            // Really white on white, as in a real CV: selecting it reveals it.
            : cv.hidden.trim() && <p className="ai-cv__white">{cv.hidden}</p>}
        </article>}
    {success(0)}
    {(state.pending !== null || last) && <section className="ai-cv__result" aria-label={poisonedCv.answerHeading}>
      <h5>{poisonedCv.answerHeading}</h5>
      {state.pending !== null
        ? <p className="ai-lab__answer" role="status"><span>sentry&gt;</span> <span className="ai-lab__thinking" aria-hidden="true"><i /><i /><i /></span><span className="sr-only">{defensePanelCopy.analysing}</span></p>
        : last && <>
            <p className="ai-lab__result-label" data-outcome={last.result.outcome}>{last.result.title}</p>
            {last.result.answer && <p className="ai-lab__answer"><span>sentry&gt;</span> {last.result.answer}</p>}
            {last.result.flag && <p className="ai-cv__flag">{poisonedCv.flagLabel} : <code>{last.result.flag}</code></p>}
            <button type="button" className="ai-lab__see-trace" onClick={() => document.getElementById('ai-lab-defenses')?.scrollIntoView()}>{defensePanelCopy.seeTrace}</button>
          </>}
    </section>}
    {state.pending === null && last && success(last.result.id)}
  </>
}
