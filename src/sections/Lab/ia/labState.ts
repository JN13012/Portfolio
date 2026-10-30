import { isAiLabLevel, type DefenseStageId, type LabLevel } from '../../../content/aiLab'

export type StageStatus = 'inactive' | 'passed' | 'blocked' | 'error' | 'not-run'
export type LabOutcome = 'delivered' | 'refused' | 'blocked' | 'error' | 'quota'
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
  completed: LabLevel[]
  attempts: LabAttempt[]
  draft: string
  flag: string
  validation: 'idle' | 'incorrect' | 'correct'
  work: Partial<Record<LabLevel, { draft: string; flag: string; validation: LabState['validation'] }>>
}
export const initialLabState: LabState = { level: 1, completed: [], attempts: [], draft: '', flag: '', validation: 'idle', work: {} }
type Action =
  | { type: 'draft'; value: string }
  | { type: 'flag'; value: string }
  | { type: 'attempt'; prompt: string; result: LabResult }
  | { type: 'validate-demo'; correct: boolean }
  | { type: 'level'; level: number }

/** UI state only. A future live API must authoritatively validate flags, levels and counters. */
export function labReducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case 'draft': return { ...state, draft: action.value }
    case 'flag': return { ...state, flag: action.value, validation: 'idle' }
    case 'attempt':
      if (action.result.level !== state.level || !action.prompt.trim()) return state
      return { ...state, draft: '', validation: 'idle', attempts: [
        ...state.attempts.filter(attempt => attempt.result.level !== state.level),
        ...[...state.attempts.filter(attempt => attempt.result.level === state.level), { prompt: action.prompt, result: action.result }].slice(-20),
      ] }
    case 'validate-demo':
      return { ...state, validation: action.correct ? 'correct' : 'incorrect', completed: action.correct && !state.completed.includes(state.level) ? [...state.completed, state.level] : state.completed }
    case 'level': {
      if (!isAiLabLevel(action.level) || action.level === state.level) return state
      const saved = state.work[action.level] ?? { draft: '', flag: '', validation: 'idle' as const }
      return { ...state, level: action.level, ...saved, work: { ...state.work, [state.level]: { draft: state.draft, flag: state.flag, validation: state.validation } } }
    }
  }
}

export const stageStatusLabels: Record<StageStatus, string> = {
  inactive: 'Non active', passed: 'Passée', blocked: 'Bloquée', error: 'Erreur', 'not-run': 'Non exécutée',
}
