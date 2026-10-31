import { isAiLabLevel, type AiLabConfig, type DefenseStageId, type LabLevel } from '../../../content/aiLab'

export type StageStatus = 'inactive' | 'passed' | 'blocked' | 'error' | 'not-run'
export type LabOutcome = 'delivered' | 'off-topic' | 'error' | 'quota'
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
export type LabAttempt = { prompt: string; config: AiLabConfig; result: LabResult }
export type LabState = {
  level: LabLevel
  config: AiLabConfig
  completed: number[]
  attempts: LabAttempt[]
  /** Only exchanges after this attempt id go back to the model. */
  conversationStart: number
  remaining: number | null
  pending: boolean
  draft: string
  flag: string
  validation: 'idle' | 'incorrect' | 'correct'
  hints: Partial<Record<LabLevel, number>>
  work: Partial<Record<LabLevel, { draft: string; flag: string; validation: LabState['validation'] }>>
}
export const initialLabState: LabState = {
  level: 1, config: 'simple', completed: [], attempts: [], conversationStart: 0, remaining: null, pending: false, draft: '', flag: '', validation: 'idle', hints: {}, work: {},
}
type Action =
  | { type: 'draft'; value: string }
  | { type: 'flag'; value: string }
  | { type: 'config'; value: AiLabConfig }
  | { type: 'session'; completed: number[]; remaining: number }
  | { type: 'pending'; value: boolean }
  | { type: 'attempt'; prompt: string; config: AiLabConfig; result: LabResult; remaining: number | null }
  | { type: 'validated'; correct: boolean; completed: number[] }
  | { type: 'hint'; total: number }
  | { type: 'new-conversation' }
  | { type: 'level'; level: number }

/** UI state only: the server is the authority on flags, progress and quotas. */
export function labReducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case 'draft': return { ...state, draft: action.value }
    case 'flag': return { ...state, flag: action.value, validation: 'idle' }
    case 'config': return { ...state, config: action.value }
    case 'session': return { ...state, completed: action.completed, remaining: action.remaining }
    case 'pending': return { ...state, pending: action.value }
    case 'attempt':
      if (action.result.level !== state.level || !action.prompt.trim()) return state
      return { ...state, pending: false, draft: '', validation: 'idle', remaining: action.remaining ?? state.remaining, attempts: [
        ...state.attempts.filter(attempt => attempt.result.level !== state.level),
        ...[...state.attempts.filter(attempt => attempt.result.level === state.level), { prompt: action.prompt, config: action.config, result: action.result }].slice(-20),
      ] }
    case 'validated': return { ...state, validation: action.correct ? 'correct' : 'incorrect', completed: action.completed }
    case 'hint': {
      const shown = state.hints[state.level] ?? 0
      return shown >= action.total ? state : { ...state, hints: { ...state.hints, [state.level]: shown + 1 } }
    }
    case 'new-conversation': return { ...state, conversationStart: Math.max(state.conversationStart, ...state.attempts.map(attempt => attempt.result.id)) }
    case 'level': {
      if (!isAiLabLevel(action.level) || action.level === state.level) return state
      const saved = state.work[action.level] ?? { draft: '', flag: '', validation: 'idle' as const }
      return { ...state, level: action.level, ...saved, work: { ...state.work, [state.level]: { draft: state.draft, flag: state.flag, validation: state.validation } } }
    }
  }
}

/** What goes back to the model: published answers of the current conversation and configuration, newest six. */
export const conversationHistory = (state: LabState) => state.attempts
  .filter(({ config, result }) => result.level === state.level && config === state.config && result.id > state.conversationStart && result.answer)
  .slice(-6)
  .map(({ prompt, result }) => ({ prompt, answer: result.answer!.slice(0, 1000) }))

export const stageStatusLabels: Record<StageStatus, string> = {
  inactive: 'Non active', passed: 'Passée', blocked: 'Bloquée', error: 'Erreur', 'not-run': 'Non exécutée',
}
