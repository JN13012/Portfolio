// Timeline and cited sections of a prepared answer, shared by Sentry and the Hero network.
import type { AnswerSource, BrainNodeId } from '../content/assistant'

type Phase = 'question' | 'search' | 'write' | 'done'

export const QUESTION_MS = 1000
export const SEARCH_MS = 1500
/** Writing time follows the answer's length, within bounds. */
const writeMs = (chars: number) => Math.min(4200, Math.max(1600, chars * 12))
export const runDuration = (chars: number) => QUESTION_MS + SEARCH_MS + writeMs(chars)

export type Run = { startedAt: number; chars: number; lit: BrainNodeId[] }
export type RunState = { phase: Phase; /** 0–1 within the phase */ progress: number; /** characters of the answer shown */ shown: number }

export function runState(run: Pick<Run, 'startedAt' | 'chars'>, now: number): RunState {
  const t = now - run.startedAt
  const write = writeMs(run.chars)
  if (t < QUESTION_MS) return { phase: 'question', progress: Math.max(0, t) / QUESTION_MS, shown: 0 }
  if (t < QUESTION_MS + SEARCH_MS) return { phase: 'search', progress: (t - QUESTION_MS) / SEARCH_MS, shown: 0 }
  if (t < QUESTION_MS + SEARCH_MS + write) {
    const progress = (t - QUESTION_MS - SEARCH_MS) / write
    return { phase: 'write', progress, shown: Math.floor(progress * run.chars) }
  }
  return { phase: 'done', progress: 1, shown: run.chars }
}

/** The brain nodes an answer draws on: a project lights Projets, a credential Certifications. */
export function litNodes(sources: AnswerSource[]): BrainNodeId[] {
  const ids = sources.map((s) => (s.kind === 'section' ? s.node : s.kind === 'project' ? 'projects' : 'certifications'))
  return [...new Set(ids)]
}
