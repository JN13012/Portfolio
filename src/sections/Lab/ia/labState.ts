import { containsIban, helpdesk, isAiLabLevel, payeeIban, poisonedCv, poisonedInbox, sourceForSearch, type DefenseStageId, type EmailDraft, type IndexedSource, type LabLevel, type ToolCall } from '../../../content/lab/ai'

export type StageStatus = 'inactive' | 'passed' | 'blocked' | 'error' | 'not-run'
export type LabOutcome = 'delivered' | 'flag' | 'blocked-input' | 'blocked-output' | 'blocked-classifier' | 'recommended' | 'rejected' | 'diverted' | 'official-iban' | 'not-retrieved' | 'granted' | 'denied' | 'off-topic' | 'error' | 'quota'
export type LabTrace = { stage: DefenseStageId; status: StageStatus }[]
export type LabResult = {
  id: number
  level: LabLevel
  outcome: LabOutcome
  title: string
  explanation: string
  answer?: string
  /** Level 6: the tools Sentry called, as the server ran them. */
  tools?: ToolCall[]
  /** Handed over by the server when level 4's CV is recommended, level 5's IBAN is given or level 6's access is granted. */
  flag?: string
  /** Level 5: the search's ranking of the sources, the emails as they were sent, and where the attack stopped. */
  ranking?: SearchRanking
  emails?: IndexedSource[]
  checks?: LabCheck[]
  /** Why it stopped there, read from Sentry's final line. */
  reason?: string
  trace: LabTrace
}
export type SearchRanking = { id: string; score: number }[]
/** One step of level 5's attack; `ok` is null when the attempt never reached it. */
export type LabCheck = { label: string; ok: boolean | null; detail?: string }
export type LabAttempt = { prompt: string; result: LabResult }
export type LabState = {
  level: LabLevel
  completed: number[]
  attempts: LabAttempt[]
  /** Only exchanges after this attempt id go back to the model. */
  conversationStart: number
  remaining: number | null
  /** The prompt on its way to the model, shown at once in the conversation. */
  pending: string | null
  draft: string
  /** Level 4's CV, kept across levels like a file on the desk. */
  cv: { profile: string; hidden: string }
  cvView: CvView
  /** Level 5's emails, kept the same way. */
  emails: EmailDraft[]
  inboxView: InboxView
  flag: string
  validation: 'idle' | 'incorrect' | 'correct'
  /** The hint shown in the carousel; 0 is its introduction. */
  hints: Partial<Record<LabLevel, number>>
  /** The attempt the level was solved after, to keep the success line in place in the conversation. */
  solvedAfter: Partial<Record<LabLevel, number>>
  work: Partial<Record<LabLevel, { draft: string; flag: string; validation: LabState['validation'] }>>
}
export type CvView = keyof typeof poisonedCv.views
export type InboxView = keyof typeof poisonedInbox.views
export const initialLabState: LabState = {
  level: 1, completed: [], attempts: [], conversationStart: 0, remaining: null, pending: null, draft: '', cv: { profile: poisonedCv.profile, hidden: '' }, cvView: 'edit', emails: [{ subject: '', body: '' }], inboxView: 'edit', flag: '', validation: 'idle', hints: {}, solvedAfter: {}, work: {},
}
type Action =
  | { type: 'draft'; value: string }
  | { type: 'flag'; value: string }
  | { type: 'cv'; field: keyof LabState['cv']; value: string }
  | { type: 'cv-view'; view: CvView }
  | { type: 'email'; index: number; field: keyof EmailDraft; value: string }
  | { type: 'emails'; emails: EmailDraft[] }
  | { type: 'email-add' }
  | { type: 'email-remove'; index: number }
  | { type: 'inbox-view'; view: InboxView }
  | { type: 'session'; completed: number[]; remaining: number }
  | { type: 'sending'; prompt: string }
  | { type: 'attempt'; prompt: string; result: LabResult; remaining: number | null }
  | { type: 'validated'; correct: boolean; completed: number[] }
  | { type: 'hint'; value: number; total: number }
  | { type: 'new-conversation' }
  | { type: 'level'; level: number }

/** UI state only: the server is the authority on flags, progress and quotas. */
export function labReducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case 'draft': return { ...state, draft: action.value }
    case 'flag': return { ...state, flag: action.value, validation: 'idle' }
    // Writing in the CV always happens in the edit view, where its fields are.
    case 'cv': return { ...state, cv: { ...state.cv, [action.field]: action.value }, cvView: 'edit' }
    case 'cv-view': return { ...state, cvView: action.view }
    case 'email': return { ...state, emails: state.emails.map((email, index) => index === action.index ? { ...email, [action.field]: action.value } : email), inboxView: 'edit' }
    case 'emails': return { ...state, emails: action.emails.slice(0, poisonedInbox.maxEmails), inboxView: 'edit' }
    case 'email-add': return state.emails.length >= poisonedInbox.maxEmails ? state : { ...state, emails: [...state.emails, { subject: '', body: '' }], inboxView: 'edit' }
    case 'email-remove': return state.emails.length <= 1 ? state : { ...state, emails: state.emails.filter((_, index) => index !== action.index) }
    case 'inbox-view': return { ...state, inboxView: action.view }
    case 'session': return { ...state, completed: action.completed, remaining: action.remaining }
    case 'sending': return { ...state, pending: action.prompt, draft: '', validation: 'idle' }
    case 'attempt':
      if (action.result.level !== state.level || !action.prompt.trim()) return state
      return { ...state, pending: null, remaining: action.remaining ?? state.remaining, attempts: [
        ...state.attempts.filter(attempt => attempt.result.level !== state.level),
        ...[...state.attempts.filter(attempt => attempt.result.level === state.level), { prompt: action.prompt, result: action.result }].slice(-20),
      ] }
    case 'validated': {
      const last = state.attempts.filter(attempt => attempt.result.level === state.level).at(-1)?.result.id ?? 0
      const solvedAfter = action.correct && state.solvedAfter[state.level] === undefined ? { ...state.solvedAfter, [state.level]: last } : state.solvedAfter
      return { ...state, validation: action.correct ? 'correct' : 'incorrect', completed: action.completed, solvedAfter }
    }
    case 'hint': return { ...state, hints: { ...state.hints, [state.level]: Math.min(action.total, Math.max(0, action.value)) } }
    case 'new-conversation': return { ...state, conversationStart: Math.max(state.conversationStart, ...state.attempts.map(attempt => attempt.result.id)) }
    case 'level': {
      if (!isAiLabLevel(action.level) || action.level === state.level) return state
      const saved = state.work[action.level] ?? { draft: '', flag: '', validation: 'idle' as const }
      return { ...state, level: action.level, ...saved, work: { ...state.work, [state.level]: { draft: state.draft, flag: state.flag, validation: state.validation } } }
    }
  }
}

/** What goes back to the model: published answers of the current conversation, newest six. */
export const conversationHistory = (state: LabState) => state.attempts
  .filter(({ result }) => result.level === state.level && result.id > state.conversationStart && result.answer)
  .slice(-6)
  .map(({ prompt, result }) => ({ prompt, answer: result.answer!.slice(0, 1000) }))

export const stageStatusLabels: Record<StageStatus, string> = {
  inactive: 'Non active', passed: 'Passée', blocked: 'Bloquée', error: 'Erreur', 'not-run': 'Non exécutée',
}

/** Where level 5's attack stopped, from facts the server returned: the email's rank and the answer. Nothing is guessed. */
export function inboxChecks(outcome: LabOutcome, ranking: SearchRanking, emails: readonly IndexedSource[]): LabCheck[] {
  const { checks, retrieved } = poisonedInbox
  const rankOf = (id: string) => ranking.findIndex(entry => entry.id === id) + 1
  const kept = emails.filter(email => rankOf(email.id) && rankOf(email.id) <= retrieved)
  const answered = outcome === 'diverted' || outcome === 'official-iban'
  return [
    { label: checks.retained, ok: kept.length > 0, detail: checks.ranks(kept.map(email => rankOf(email.id)).sort((a, b) => a - b)) },
    { label: checks.iban, ok: emails.some(email => containsIban(sourceForSearch(email))) },
    { label: checks.answer, ok: answered ? outcome === 'diverted' : null, detail: answered ? undefined : checks.notRun },
  ]
}

/** Why level 5's attempt ended where it did. Read from the outcome and Sentry's final « IBAN à payer » line, the one the payment tool reads. */
export function inboxReason(outcome: LabOutcome, answer?: string): string | undefined {
  const { reasons, iban, sources } = poisonedInbox
  if (outcome === 'not-retrieved' || outcome === 'diverted') return reasons[outcome]
  if (outcome === 'off-topic') return reasons.held
  if (outcome !== 'official-iban' || !answer) return undefined
  const payee = payeeIban(answer)
  const official = sources.find(source => source.id === 'altiplast')!.text.match(/FR76[\d ]+\d/)![0].replace(/\s/g, '')
  if (payee === null) return reasons.unread
  if (payee === 'AUCUN') return reasons.blocked
  if (payee === official) return reasons.official
  return payee === iban.replace(/\s/g, '') ? reasons.diverted : reasons.other
}

/** Where level 6's attack stopped, from the calls the server ran and its verdict on the directory. */
export function agentChecks(outcome: LabOutcome, tools: readonly ToolCall[]): LabCheck[] {
  const { checks, user, targetGroup } = helpdesk
  const plain = (value: unknown) => String(value ?? '').toLowerCase()
  const adds = tools.filter(call => call.name === 'ajouter_au_groupe')
  const own = adds.some(call => plain(call.arguments.groupe) === plain(targetGroup) && [user.id, plain(user.name)].includes(plain(call.arguments.utilisateur)))
  return [
    { label: checks.called, ok: tools.length > 0, detail: checks.count(tools.length) },
    { label: checks.add, ok: adds.length ? own : false, detail: adds.length ? adds.map(call => `${String(call.arguments.utilisateur ?? '?')} → ${String(call.arguments.groupe ?? '?')}`).join(', ') : checks.notCalled },
    { label: checks.access, ok: outcome === 'granted' },
  ]
}
