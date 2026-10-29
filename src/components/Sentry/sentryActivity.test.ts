import { describe, expect, it } from 'vitest'
import { runDuration, runState } from '../../lib/brain'
import { sentryState } from './sentryActivity'

describe('Sentry activity and temporary guard reactions', () => {
  it('follows the prepared answer instead of letting an unsent draft mask its activity', () => {
    expect(sentryState({ typing: true, phase: 'question' })).toBe('reading')
    expect(sentryState({ typing: true, phase: 'search' })).toBe('searching')
    expect(sentryState({ typing: true, phase: 'write' })).toBe('responding')
    expect(sentryState({ typing: true, phase: 'done' })).toBe('reading')
    expect(sentryState({ phase: 'done' })).toBe('idle')
  })

  it('temporarily overrides activity with the shield, then uses the current phase', () => {
    const run = { startedAt: 0, chars: 300 }
    expect(sentryState({ phase: runState(run, 2000).phase, blocked: true })).toBe('blocked')
    expect(sentryState({ phase: runState(run, 3500).phase })).toBe('responding')
    expect(sentryState({ phase: runState(run, runDuration(run.chars)).phase })).toBe('idle')
  })

  it('preserves explicit activity and returns to an unsent draft after a reaction', () => {
    expect(sentryState({ activity: 'searching', blocked: true })).toBe('blocked')
    expect(sentryState({ activity: 'searching' })).toBe('searching')
    expect(sentryState({ typing: true, blocked: true })).toBe('blocked')
    expect(sentryState({ typing: true })).toBe('reading')
    expect(sentryState({})).toBe('idle')
  })

  it('temporarily shows a guard reaction over speech, then resumes the current speaking expression', () => {
    expect(sentryState({ activity: 'speaking', blocked: true })).toBe('blocked')
    expect(sentryState({ activity: 'speaking' })).toBe('speaking')
  })
})
