import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPresentationTranscript } from './presentationTranscript'
import type { PresentationSnapshot } from './presentationAudio'

/** A native-style clock that progresses without firing timeupdate on every word. */
function setup() {
  let snapshot: PresentationSnapshot = { chapterId: 'introduction', status: 'playing', currentTime: 0, duration: 14.72 }
  let rate = 1
  let sampledAt = Date.now()
  const listeners = new Set<() => void>()
  const readClock = vi.fn(() => ({
    currentTime: snapshot.currentTime + (snapshot.status === 'playing' ? (Date.now() - sampledAt) / 1000 * rate : 0),
    playbackRate: rate,
  }))
  const player = {
    get: () => snapshot,
    readClock,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } },
  }
  return {
    clock: createPresentationTranscript(player),
    readClock,
    listeners,
    update(patch: Partial<PresentationSnapshot>, speed = rate) {
      snapshot = { ...snapshot, currentTime: readClock().currentTime, ...patch }
      sampledAt = Date.now()
      rate = speed
      listeners.forEach((listener) => listener())
    },
  }
}

describe('word-level presentation clock', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('follows short words and real silence between sparse native progress events', () => {
    const { clock } = setup()
    const stop = clock.subscribe(vi.fn())
    expect(clock.get().wordIndex).toBe(0) // Bonjour !
    vi.advanceTimersByTime(345)
    expect(clock.get().wordIndex).toBe(-1) // Natural pause, not a fixed reading rate.
    vi.advanceTimersByTime(640)
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('Je')
    vi.advanceTimersByTime(200)
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('suis')
    stop()
  })

  it('freezes during pause and buffering, resynchronizes seeks and starts the new chapter immediately', () => {
    const { clock, update } = setup()
    const stop = clock.subscribe(vi.fn())
    update({ status: 'paused', currentTime: 4.5 })
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('clonage')
    expect(vi.getTimerCount()).toBe(0)
    const frozen = clock.get()
    vi.advanceTimersByTime(5000)
    expect(clock.get()).toBe(frozen)
    update({ currentTime: 12.9 })
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('compétences')
    update({ chapterId: 'fraude', currentTime: 4.5, status: 'playing', duration: 22.64 })
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('artificielle')
    update({ status: 'loading' })
    expect(vi.getTimerCount()).toBe(0)
    stop()
  })

  it('uses the actual playback rate and does not notify when the same word is still active', () => {
    const { clock, update } = setup()
    const listener = vi.fn()
    const stop = clock.subscribe(listener)
    update({ currentTime: 0.98 }, 2)
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('Je')
    listener.mockClear()
    update({})
    expect(listener).not.toHaveBeenCalled()
    vi.advanceTimersByTime(110)
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('suis')
    stop()
  })

  it('crosses block boundaries without waiting for a native timeupdate event', () => {
    const { clock, update } = setup()
    const stop = clock.subscribe(vi.fn())
    update({ currentTime: 4.1 })
    expect(clock.get().caption?.text).toContain('Bonjour')
    vi.advanceTimersByTime(25)
    expect(clock.get().caption?.text).toContain('Grâce')
    expect(clock.get().wordIndex).toBe(0)
    stop()
  })

  it('starts only with a visible subscriber and releases every timer and listener on teardown', () => {
    const { clock, readClock, listeners } = setup()
    expect(readClock).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
    const stop = clock.subscribe(vi.fn())
    expect(vi.getTimerCount()).toBe(1)
    expect(listeners.size).toBe(1)
    stop()
    expect(vi.getTimerCount()).toBe(0)
    expect(listeners.size).toBe(0)
    const reads = readClock.mock.calls.length
    vi.advanceTimersByTime(5000)
    expect(readClock).toHaveBeenCalledTimes(reads)
    const stopAgain = clock.subscribe(vi.fn()) // StrictMode or moving the player into the chat.
    expect(clock.get().caption?.words[clock.get().wordIndex]?.text).toBe('vocal')
    stopAgain()
    expect(vi.getTimerCount()).toBe(0)
  })
})
