import { describe, expect, it } from 'vitest'
import { aiLabCurriculum, aiLabLevels, defenseStages } from '../../../content/aiLab'
import { conversationHistory, initialLabState, labReducer, type LabResult } from './labState'

const result = (id: number, answer?: string): LabResult => ({
  id, level: 1, outcome: answer ? 'delivered' : 'error', title: 'Résultat', explanation: 'Texte', answer,
  trace: defenseStages.map(stage => ({ stage: stage.id, status: 'not-run' })),
})
const attempt = (id: number, answer?: string) => ({ type: 'attempt', prompt: `prompt ${id}`, config: 'simple', result: result(id, answer), remaining: 10 }) as const

describe('Lab IA interface state', () => {
  it('rejects unavailable levels and blank prompts', () => {
    expect(labReducer(initialLabState, { type: 'level', level: 2 })).toBe(initialLabState)
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

  it('takes progress only from the server', () => {
    const wrong = labReducer(initialLabState, { type: 'validated', correct: false, completed: [] })
    expect(wrong.validation).toBe('incorrect')
    const right = labReducer(wrong, { type: 'validated', correct: true, completed: [1] })
    expect(right.completed).toEqual([1])
  })

  it('sends back only published answers of the current conversation and configuration', () => {
    let state = labReducer(initialLabState, attempt(1, 'un'))
    state = labReducer(state, attempt(2))
    state = labReducer(state, attempt(3, 'trois'))
    expect(conversationHistory(state).map(entry => entry.answer)).toEqual(['un', 'trois'])
    expect(conversationHistory(labReducer(state, { type: 'config', value: 'structured' }))).toEqual([])
    expect(conversationHistory(labReducer(state, { type: 'new-conversation' }))).toEqual([])
    for (let n = 4; n <= 12; n++) state = labReducer(state, attempt(n, `r${n}`))
    expect(conversationHistory(state)).toHaveLength(6)
  })

  it('reveals three hints one at a time, for each playable level', () => {
    for (const level of aiLabLevels) expect(level.hints).toHaveLength(3)
    let state = initialLabState
    for (let n = 0; n < 5; n++) state = labReducer(state, { type: 'hint', total: 3 })
    expect(state.hints[1]).toBe(3)
  })

  it('announces ten levels and only playable levels as available', () => {
    const levels = aiLabCurriculum.flatMap(part => part.levels)
    expect(levels.map(level => level.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(levels.filter(level => level.available).map(level => level.id)).toEqual(aiLabLevels.map(level => level.id))
  })
})
