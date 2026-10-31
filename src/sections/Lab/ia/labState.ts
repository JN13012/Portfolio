import { isAiLabLevel, type DefenseStageId, type LabLevel } from '../../../content/aiLab'

export type StageStatus = 'inactive' | 'passed' | 'blocked' | 'error' | 'not-run'
export type LabOutcome = 'delivered' | 'flag' | 'off-topic' | 'error' | 'quota'
export type LabTrace = { stage: DefenseStageId; status: StageStatus }[]
export type LabResult = {
  id: number
  level: LabLevel
  outcome: LabOutcome
  title: string
  explanation: string
  answer?: string
  trace: LabTrace
}
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
  flag: string
  validation: 'idle' | 'incorrect' | 'correct'
  /** The hint shown in the carousel; 0 is its introduction. */
  hints: Partial<Record<LabLevel, number>>
  /** The attempt the level was solved after, to keep the success line in place in the conversation. */
  solvedAfter: Partial<Record<LabLevel, number>>
  work: Partial<Record<LabLevel, { draft: string; flag: string; validation: LabState['validation'] }>>
}
export const initialLabState: LabState = {
  level: 1, completed: [], attempts: [], conversationStart: 0, remaining: null, pending: null, draft: '', flag: '', validation: 'idle', hints: {}, solvedAfter: {}, work: {},
}
type Action =
  | { type: 'draft'; value: string }
  | { type: 'flag'; value: string }
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
