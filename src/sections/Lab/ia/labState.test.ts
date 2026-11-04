import { describe, expect, it } from 'vitest'
import { aiLabCurriculum, aiLabLevels, defenseStages, poisonedInbox, visitorEmails } from '../../../content/aiLab'
import { conversationHistory, inboxChecks, inboxReason, initialLabState, labReducer, type LabResult } from './labState'

const result = (id: number, answer?: string): LabResult => ({
  id, level: 1, outcome: answer ? 'delivered' : 'error', title: 'Résultat', explanation: 'Texte', answer,
  trace: defenseStages.map(stage => ({ stage: stage.id, status: 'not-run' })),
})
const attempt = (id: number, answer?: string) => ({ type: 'attempt', prompt: `prompt ${id}`, result: result(id, answer), remaining: 10 }) as const

describe('Lab IA interface state', () => {
  it('rejects unavailable levels and blank prompts', () => {
    expect(labReducer(initialLabState, { type: 'level', level: 6 })).toBe(initialLabState)
    expect(labReducer(initialLabState, { type: 'level', level: 99 })).toBe(initialLabState)
    expect(labReducer(initialLabState, { ...attempt(1, 'ok'), prompt: ' ' })).toBe(initialLabState)
  })

  it('bounds the local conversation and keeps the server count', () => {
    let state = initialLabState
    for (let n = 1; n <= 25; n++) state = labReducer(state, attempt(n, 'ok'))
    expect(state.attempts).toHaveLength(20)
    expect(state.attempts[0]?.result.id).toBe(6)
    expect(state.remaining).toBe(10)
    expect(labReducer(state, { ...attempt(26), remaining: null }).remaining).toBe(10)
  })

  it('sends the prompt at once and keeps what is typed during the wait', () => {
    let state = labReducer(initialLabState, { type: 'draft', value: 'Une demande' })
    state = labReducer(state, { type: 'sending', prompt: 'Une demande' })
    expect(state.draft).toBe('')
    expect(state.pending).toBe('Une demande')
    state = labReducer(state, { type: 'draft', value: 'La suite' })
    state = labReducer(state, attempt(1, 'ok'))
    expect(state.pending).toBeNull()
    expect(state.draft).toBe('La suite')
  })

  it('takes progress only from the server', () => {
    const wrong = labReducer(initialLabState, { type: 'validated', correct: false, completed: [] })
    expect(wrong.validation).toBe('incorrect')
    const right = labReducer(wrong, { type: 'validated', correct: true, completed: [1] })
    expect(right.completed).toEqual([1])
    expect(right.solvedAfter[1]).toBe(0)
  })

  it('sends back only published answers of the current conversation', () => {
    let state = labReducer(initialLabState, attempt(1, 'un'))
    state = labReducer(state, attempt(2))
    state = labReducer(state, attempt(3, 'trois'))
    expect(conversationHistory(state).map(entry => entry.answer)).toEqual(['un', 'trois'])
    expect(conversationHistory(labReducer(state, { type: 'new-conversation' }))).toEqual([])
    for (let n = 4; n <= 12; n++) state = labReducer(state, attempt(n, `r${n}`))
    expect(conversationHistory(state)).toHaveLength(6)
  })

  it('keeps the CV across levels and opens its editor when written; the visitor copies the flag, as on every level', () => {
    let state = labReducer(initialLabState, { type: 'cv-view', view: 'sentry' })
    state = labReducer(state, { type: 'cv', field: 'hidden', value: 'Texte blanc' })
    expect(state.cvView).toBe('edit')
    state = labReducer(state, { type: 'level', level: 4 })
    state = labReducer(state, { type: 'level', level: 1 })
    expect(state.cv.hidden).toBe('Texte blanc')
    state = labReducer(state, { type: 'level', level: 4 })
    state = labReducer(state, { type: 'attempt', prompt: 'CV envoyé', result: { ...result(1, 'Décision : RECOMMANDÉ'), level: 4, outcome: 'recommended', flag: 'FLAG{AAAA-BBBB-CCCC}' }, remaining: 9 })
    expect(state.flag).toBe('')
    expect(state.attempts.at(-1)?.result.flag).toBe('FLAG{AAAA-BBBB-CCCC}')
  })

  it('moves through three hints, within bounds, for each playable level', () => {
    for (const level of aiLabLevels) expect(level.hints).toHaveLength(3)
    let state = initialLabState
    state = labReducer(state, { type: 'hint', value: 2, total: 3 })
    expect(state.hints[1]).toBe(2)
    expect(labReducer(state, { type: 'hint', value: 9, total: 3 }).hints[1]).toBe(3)
    expect(labReducer(state, { type: 'hint', value: -1, total: 3 }).hints[1]).toBe(0)
  })

  it('announces ten levels and only playable levels as available', () => {
    const levels = aiLabCurriculum.flatMap(part => part.levels)
    expect(levels.map(level => level.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(levels.filter(level => level.available).map(level => level.id)).toEqual(aiLabLevels.map(level => level.id))
  })
})

describe('Level 5 analysis', () => {
  const emails = visitorEmails([{ subject: 'a', body: `IBAN ${poisonedInbox.iban}` }])
  const ranking = (ids: string[]) => ids.map((id, index) => ({ id, score: 1 - index / 10 }))

  it('says which step stopped the attack, from the rank and the answer only', () => {
    const stopped = inboxChecks('official-iban', ranking(['votre-email-1', 'mail-altiplast', 'altiplast', 'paiement']), emails)
    expect(stopped.map(check => check.ok)).toEqual([true, true, false])
    expect(stopped[0]!.detail).toBe('rang 1')
    const skipped = inboxChecks('not-retrieved', ranking(['mail-altiplast', 'altiplast', 'paiement', 'brevia', 'votre-email-1']), emails)
    expect(skipped.map(check => check.ok)).toEqual([false, true, null])
  })

  it('keeps a single draft on this level', () => {
    expect(labReducer(initialLabState, { type: 'email-add' }).emails).toHaveLength(1)
    const state = labReducer(initialLabState, { type: 'email', index: 0, field: 'body', value: 'B' })
    expect(labReducer(state, { type: 'email-remove', index: 0 }).emails.map(email => email.body)).toEqual(['B'])
  })
})

describe('Level 5 reason', () => {
  it('reads why the payment went where it did from the final line only', () => {
    expect(inboxReason('official-iban', 'Texte.\nIBAN à payer : FR76 9900 0012 3400 0100 2233 145')).toBe(poisonedInbox.reasons.official)
    expect(inboxReason('official-iban', 'Texte.\nIBAN à payer : aucun')).toBe(poisonedInbox.reasons.blocked)
    expect(inboxReason('official-iban', `Votre IBAN ${poisonedInbox.iban} est suspect.`)).toBe(poisonedInbox.reasons.unread)
    expect(inboxReason('not-retrieved')).toBe(poisonedInbox.reasons['not-retrieved'])
    expect(inboxReason('diverted', 'x')).toBe(poisonedInbox.reasons.diverted)
    expect(inboxReason('error')).toBeUndefined()
  })
})
