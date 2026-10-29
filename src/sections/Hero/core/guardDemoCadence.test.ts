import { describe, expect, it } from 'vitest'
import { createGuardDemoCadence } from './guardDemoCadence'

describe('occasional educational guard demonstrations', () => {
  it('continues firing during sustained activity without postponing the next attack on each frame', () => {
    const cadence = createGuardDemoCadence(0, () => 0.5)
    expect(cadence.due(4375, 5, false, true)).toBe(true)
    for (let now = 4400; now < 16875; now += 25) expect(cadence.due(now, 5, false, true)).toBe(false)
    expect(cadence.due(16875, 5, false, true)).toBe(true)
    expect(cadence.due(16875, 5, false, true)).toBe(false)
  })

  it('waits for welcome completion, then starts a fresh cadence instead of releasing overdue attacks', () => {
    const cadence = createGuardDemoCadence(0, () => 0.5)
    expect(cadence.due(5000, 5, true, false)).toBe(false)
    expect(cadence.due(20000, 5, true, true)).toBe(false)
    expect(cadence.due(21000, 5, false, true)).toBe(false)
    expect(cadence.due(33499, 5, false, true)).toBe(false)
    expect(cadence.due(33500, 5, false, true)).toBe(true)
  })

  it('emits at most one demonstration after an offscreen gap and keeps the idle rhythm shorter', () => {
    const cadence = createGuardDemoCadence(0, () => 0.5)
    expect(cadence.due(60000, 5, false, false)).toBe(true)
    expect(cadence.due(60000, 5, false, false)).toBe(false)
    expect(cadence.due(66250, 5, false, false)).toBe(true)
  })
})
