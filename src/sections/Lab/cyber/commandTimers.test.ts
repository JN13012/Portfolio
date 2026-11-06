import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createCommandTimers } from './commandTimers'

describe('CTF command timers', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('suspends pending commands, resumes their remaining delay and does not duplicate them', () => {
    const timers = createCommandTimers()
    const output = vi.fn()
    timers.resume()
    timers.schedule(output, 1000)
    vi.advanceTimersByTime(250)
    timers.pause()
    timers.pause()
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(10000)
    expect(output).not.toHaveBeenCalled()
    timers.resume()
    timers.resume()
    vi.advanceTimersByTime(749)
    expect(output).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(output).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('holds newly scheduled and nested work until visible again', () => {
    const timers = createCommandTimers()
    const output = vi.fn()
    timers.schedule(() => { output('first'); timers.schedule(() => output('second'), 200) }, 100)
    expect(vi.getTimerCount()).toBe(0)
    timers.resume()
    vi.advanceTimersByTime(100)
    expect(output).toHaveBeenCalledWith('first')
    timers.pause()
    vi.advanceTimersByTime(1000)
    expect(output).toHaveBeenCalledTimes(1)
    timers.resume()
    vi.advanceTimersByTime(200)
    expect(output).toHaveBeenLastCalledWith('second')
  })
})
