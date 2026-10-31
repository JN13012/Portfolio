import type { LabLevel } from '../../../content/aiLab'
import type { LabOutcome, LabTrace } from './labState'

type SessionReply = { available: true; completed: number[]; remaining: number }
type AttemptReply = { outcome: LabOutcome; reason?: 'session' | 'ip' | 'budget' | 'busy'; answer?: string; remaining: number; trace: LabTrace }
type ValidateReply = { correct: boolean; completed: number[] }

const post = (path: string, body: object) => fetch(`/api/lab/${path}`, {
  method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
})

export async function openSession(): Promise<SessionReply | null> {
  try {
    const response = await post('session', {})
    return response.ok ? await response.json() as SessionReply : null
  } catch { return null }
}

/** Returns null when no usable answer came back; a lost session is reopened once, with a new request id. */
export async function sendAttempt(input: { level: LabLevel; prompt: string; history: { prompt: string; answer: string }[] }): Promise<AttemptReply | null> {
  try {
    let response = await post('attempt', { ...input, requestId: crypto.randomUUID() })
    if (response.status === 401 && await openSession()) response = await post('attempt', { ...input, requestId: crypto.randomUUID() })
    const reply = await response.json() as Partial<AttemptReply>
    return reply.outcome && reply.trace ? reply as AttemptReply : null
  } catch { return null }
}

export async function validateFlag(level: LabLevel, flag: string): Promise<ValidateReply | null> {
  try {
    const response = await post('validate', { level, flag })
    return response.ok ? await response.json() as ValidateReply : null
  } catch { return null }
}
