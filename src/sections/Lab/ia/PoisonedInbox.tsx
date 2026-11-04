import type { Dispatch, ReactNode } from 'react'
import { defensePanelCopy, inboxMessage, isVisitorEmail, poisonedInbox, visitorEmails, type IndexedSource } from '../../../content/aiLab'
import type { InboxView, labReducer, LabAttempt, LabResult, LabState } from './labState'

type Props = {
  state: LabState
  dispatch: Dispatch<Parameters<typeof labReducer>[1]>
  last?: LabAttempt
  success: (attemptId: number) => ReactNode
}

const knownSource = (id: string) => poisonedInbox.sources.find(source => source.id === id)!
const trusted = (source: IndexedSource) => source.type !== poisonedInbox.types.email
const { journal, times } = poisonedInbox

function Entry({ time, children }: { time: string; children: ReactNode }) {
  return <li><span className="ai-inbox__time">{time}</span><span>{children}</span></li>
}

/** What follows the email, in the order it happens. Only the times are simulated. */
function Journal({ result }: { result: LabResult }) {
  const ranks = (result.ranking ?? []).flatMap((entry, index) => isVisitorEmail(entry.id) ? [index + 1] : [])
  const answered = result.outcome === 'diverted' || result.outcome === 'official-iban'
  return <>
    <p className="ai-lab__result-label" data-outcome={result.outcome}>{result.title}</p>
    {ranks.length ? <ol className="ai-inbox__journal">
      <Entry time={times.you}>{journal.sent(ranks.length)}</Entry>
      <Entry time={times.night}>{journal.indexed(ranks, result.ranking!.length)}</Entry>
      <Entry time={times.morning}>{journal.asked}</Entry>
      {answered && <Entry time={times.morning}><span className="ai-lab__answer"><span>sentry&gt;</span> {result.answer}</span></Entry>}
      {result.outcome === 'not-retrieved' && <Entry time={times.morning}>{journal.notRead}</Entry>}
      {result.outcome === 'off-topic' && <Entry time={times.morning}>{journal.held}</Entry>}
      {result.outcome !== 'off-topic' && <Entry time={times.payment}><span data-diverted={result.outcome === 'diverted'}>{result.outcome === 'diverted' ? journal.diverted : journal.protected}</span></Entry>}
    </ol> : <p className="ai-inbox__note">{result.explanation}</p>}
    {result.flag && <p className="ai-cv__flag">{poisonedInbox.flagLabel} : <code>{result.flag}</code></p>}
    {ranks.length > 0 && <p className="ai-inbox__note">{poisonedInbox.simulated}</p>}
    <button type="button" className="ai-lab__see-trace" onClick={() => document.getElementById('ai-lab-defenses')?.scrollIntoView()}>{defensePanelCopy.seeTrace}</button>
  </>
}

/** Level 5: the visitor emails the invoices mailbox; a real search decides whether Sentry reads it. */
export function PoisonedInbox({ state, dispatch, last, success }: Props) {
  const { emails, inboxView: view } = state
  const sent = last?.result.emails
  const ranking = last?.result.ranking
  const drafts = visitorEmails(emails.filter(email => email.body.trim()))
  // The sources as the last search saw them, or as they stand before any search.
  const sources: IndexedSource[] = [...poisonedInbox.sources, ...(sent ?? drafts)]
  const listed = ranking
    ? ranking.flatMap(entry => { const source = sources.find(candidate => candidate.id === entry.id); return source ? [{ source, score: entry.score as number | null }] : [] })
    : sources.map(source => ({ source, score: null }))
  const retained = ranking && sent ? listed.slice(0, poisonedInbox.retrieved).map(entry => entry.source) : null
  const preview = [...drafts, knownSource('mail-altiplast'), knownSource('altiplast'), knownSource('paiement')].slice(0, poisonedInbox.retrieved)
  return <>
    <p className="ai-cv__mission"><span>Mission</span> {poisonedInbox.mission}</p>
    <section className="ai-inbox__briefing" aria-label={poisonedInbox.contextTitle}>
      <h5>{poisonedInbox.contextTitle}</h5>
      <ul>{poisonedInbox.context.map(line => <li key={line}>{line}</li>)}</ul>
      <p><span>{poisonedInbox.ibanLabel}</span> <code className="ai-inbox__iban">{poisonedInbox.iban}</code></p>
      <p><span>{poisonedInbox.senderLabel}</span> <code className="ai-inbox__iban">{poisonedInbox.sender}</code></p>
    </section>
    <div className="ai-cv__views" role="group" aria-label="Affichage de l’exercice">
      {(Object.entries(poisonedInbox.views) as [InboxView, string][]).map(([id, label]) =>
        <button key={id} type="button" aria-pressed={view === id} onClick={() => dispatch({ type: 'inbox-view', view: id })}>{label}</button>)}
    </div>
    {view === 'edit' && <div className="ai-inbox__editor">
      <p className="ai-inbox__header"><span>{poisonedInbox.fromLabel}</span> {poisonedInbox.sender}</p>
      <p className="ai-inbox__header"><span>{poisonedInbox.toLabel}</span> {poisonedInbox.mailbox}</p>
      {emails.map((email, index) => <div key={index} className="ai-inbox__email">
        {poisonedInbox.maxEmails > 1 && <p className="ai-inbox__email-head"><span>{poisonedInbox.emailLabel(index)}</span>
          {emails.length > 1 && <button type="button" onClick={() => dispatch({ type: 'email-remove', index })}>{poisonedInbox.removeEmail(index)}</button>}</p>}
        <label htmlFor={`ai-lab-email-subject-${index}`}>{poisonedInbox.subjectLabel}</label>
        <input id={`ai-lab-email-subject-${index}`} value={email.subject} maxLength={poisonedInbox.maxSubject} autoComplete="off" placeholder="Facture Altiplast…" onChange={event => dispatch({ type: 'email', index, field: 'subject', value: event.target.value })} />
        <label htmlFor={`ai-lab-email-body-${index}`}>{poisonedInbox.bodyLabel}</label>
        <textarea id={`ai-lab-email-body-${index}`} rows={4} maxLength={poisonedInbox.maxBody} value={email.body} placeholder="Vide pour l’instant." onChange={event => dispatch({ type: 'email', index, field: 'body', value: event.target.value })} />
      </div>)}
      {emails.length < poisonedInbox.maxEmails && <button type="button" className="ai-inbox__add" onClick={() => dispatch({ type: 'email-add' })}>+ {poisonedInbox.addEmail}</button>}
      <p className="ai-inbox__note">{poisonedInbox.editNote}</p>
    </div>}
    {view === 'ranking' && <>
      <p className="ai-inbox__note ai-inbox__analysis">{poisonedInbox.analysisNote}</p>
      <p className="ai-inbox__note">{ranking ? poisonedInbox.rankingNote : poisonedInbox.rankingPending}</p>
      <ol className="ai-inbox__sources" aria-label="Sources de Sentry">
        {listed.map(({ source, score }, index) => <li key={source.id} data-retained={retained ? index < poisonedInbox.retrieved : undefined} data-visitor={isVisitorEmail(source.id) || undefined}>
          <p className="ai-inbox__source-head">
            <span className="ai-inbox__type" data-trusted={trusted(source)}>{isVisitorEmail(source.id) ? poisonedInbox.yourEmail : source.type}</span>
            <strong>{source.title}</strong>
            {score !== null && <span className="ai-inbox__score">{score.toFixed(3)}</span>}
          </p>
          {source.from && <p className="ai-inbox__from">{poisonedInbox.fromLabel} : {source.from}</p>}
          <p>{source.text}</p>
          {retained && index < poisonedInbox.retrieved && <p className="ai-inbox__retained">{poisonedInbox.retainedLabel}</p>}
        </li>)}
      </ol>
    </>}
    {view === 'sentry' && <>
      <p className="ai-inbox__note ai-inbox__analysis">{poisonedInbox.analysisNote}</p>
      {!retained && <p className="ai-inbox__note">{poisonedInbox.previewNote}</p>}
      <pre className="ai-cv__extract ai-inbox__extract" aria-label={poisonedInbox.views.sentry}>{inboxMessage(retained ?? preview)}</pre>
    </>}
    {success(0)}
    {(state.pending !== null || last) && <section className="ai-cv__result" aria-label={poisonedInbox.journalHeading}>
      <h5>{poisonedInbox.journalHeading}</h5>
      {state.pending !== null
        ? <ol className="ai-inbox__journal">
            <Entry time={times.you}>{journal.sent(Math.max(1, drafts.length))}</Entry>
            <li role="status"><span className="ai-lab__thinking" aria-hidden="true"><i /><i /><i /></span> {poisonedInbox.journalPending}</li>
          </ol>
        : last && <Journal result={last.result} />}
    </section>}
    {state.pending === null && last && success(last.result.id)}
  </>
}
