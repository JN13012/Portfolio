import { describe, expect, it } from 'vitest'
import { completeCyberLevel, parseCyberProgress } from './cyberProgress'

describe('Cyber level successes', () => {
  it('records a directly selected success without awarding earlier levels', () => {
    const initial = parseCyberProgress(null)
    const success = completeCyberLevel(initial, 8)
    expect(success.completed).toEqual([8])
    expect(completeCyberLevel(success, 8)).toBe(success)
    expect(parseCyberProgress(JSON.stringify(success))).toEqual(success)
    expect(completeCyberLevel(success, 1).completed).toEqual([1, 8])
  })

  it('migrates the old sequential format without resetting earned progress', () => {
    expect(parseCyberProgress('{"level":4,"solved":false}').completed).toEqual([1, 2, 3])
    expect(parseCyberProgress('{"level":9,"solved":true}').completed).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(parseCyberProgress('{"version":2,"completed":[9],"level":9,"solved":true}').completed).toEqual([9])
  })

  it('ignores damaged storage and invalid or duplicated level IDs', () => {
    for (const raw of ['invalid', 'null', '[]', '{"level":99,"solved":true}', '{"level":3}', '{"version":3,"level":4,"solved":true}']) {
      expect(parseCyberProgress(raw).completed).toEqual([])
    }
    expect(parseCyberProgress('{"version":2,"completed":[9,1,1,0,10,"3",null,2.5]}').completed).toEqual([1, 9])
    const initial = parseCyberProgress(null)
    for (const id of [0, 10, 1.5, NaN]) expect(completeCyberLevel(initial, id)).toBe(initial)
  })
})
