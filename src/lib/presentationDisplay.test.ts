import { afterEach, describe, expect, it, vi } from 'vitest'
import { autoFoldDelay, canGoQuiet, createPresentationDisplay, IDLE_FOLD_MS, PAUSE_CAPTION_MS, PAUSE_FOLD_MS, PHONE_FOLD_MS, PRESENTATION_VIEW_KEY } from './presentationDisplay'
import { createPresentationPlayer } from './presentationAudio'

afterEach(() => { vi.useRealTimers() })

describe('presentation display, independent of playback', () => {
  it('starts expanded without creating media, and remembers only the chosen view within the session', () => {
    const saved = new Map<string, string>()
    const storage = { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => { saved.set(key, value) } }
    const createMedia = vi.fn()
    const player = createPresentationPlayer(createMedia, [{ id: 'introduction', src: '/intro.mp3' }])
    const display = createPresentationDisplay(storage)
    expect(display.get().minimized).toBe(false)
    display.setMinimized(true)
    expect(saved.get(PRESENTATION_VIEW_KEY)).toBe('reduced')
    expect(createPresentationDisplay(storage).get()).toEqual({ minimized: true, speechVisible: false })
    expect(player.get().status).toBe('idle')
    expect(createMedia).not.toHaveBeenCalled()
    display.setMinimized(false)
    expect(createPresentationDisplay(storage).get().minimized).toBe(false)
  })

  it('still changes view when browser storage is blocked', () => {
    const display = createPresentationDisplay({ getItem: () => { throw Error() }, setItem: () => { throw Error() } })
    display.setMinimized(true)
    expect(display.get().minimized).toBe(true)
  })

  it('keeps the paused caption for three seconds without restarting its timer on progress notifications', () => {
    vi.useFakeTimers()
    const display = createPresentationDisplay()
    display.sync('playing')
    display.sync('paused')
    vi.advanceTimersByTime(PAUSE_CAPTION_MS - 1)
    display.sync('paused')
    expect(display.get().speechVisible).toBe(true)
    vi.advanceTimersByTime(1)
    expect(display.get().speechVisible).toBe(false)
    display.sync('paused')
    expect(vi.getTimerCount()).toBe(0)
    display.sync('playing')
    expect(display.get().speechVisible).toBe(true)
  })

  it('cancels a pending hide on resume, retains the view at the end and clears the caption on teardown', () => {
    vi.useFakeTimers()
    const display = createPresentationDisplay()
    display.sync('playing')
    display.sync('paused')
    vi.advanceTimersByTime(1000)
    display.sync('loading')
    display.sync('playing')
    vi.advanceTimersByTime(PAUSE_CAPTION_MS)
    expect(display.get().speechVisible).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
    display.setMinimized(true)
    display.sync('ended')
    expect(display.get()).toEqual({ minimized: true, speechVisible: false })
    display.sync('playing')
    display.sync('paused')
    display.resetSpeech()
    expect(display.get()).toEqual({ minimized: true, speechVisible: false })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not show a speech bubble when initial loading is cancelled or fails', () => {
    vi.useFakeTimers()
    const display = createPresentationDisplay()
    display.sync('loading')
    display.sync('paused')
    expect(display.get().speechVisible).toBe(false)
    display.sync('error')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('remembers a view expanded by hand, and forgets it once reduced', () => {
    const saved = new Map<string, string>()
    const storage = { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => { saved.set(key, value) } }
    const display = createPresentationDisplay(storage)
    expect(display.pinned()).toBe(false)
    display.setMinimized(false)
    expect(display.pinned()).toBe(true)
    expect(createPresentationDisplay(storage).pinned()).toBe(true)
    display.setMinimized(true)
    expect(display.pinned()).toBe(false)
  })
})

describe('auto fold delay', () => {
  const idle = { status: 'idle', pinned: false, welcomeDone: true, held: false, phone: false } as const
  it('waits for the welcome bubble, then folds an untouched strip', () => {
    expect(autoFoldDelay(idle)).toBe(IDLE_FOLD_MS)
    expect(autoFoldDelay({ ...idle, phone: true })).toBe(PHONE_FOLD_MS)
    expect(autoFoldDelay({ ...idle, welcomeDone: false })).toBeNull()
    expect(autoFoldDelay({ ...idle, pinned: true })).toBeNull()
  })
  it('keeps playback, errors and a strip under the pointer open', () => {
    for (const status of ['playing', 'loading', 'error'] as const) expect(autoFoldDelay({ ...idle, status })).toBeNull()
    expect(autoFoldDelay({ ...idle, held: true })).toBeNull()
    expect(autoFoldDelay({ ...idle, status: 'ended', held: true })).toBeNull()
  })
  it('folds after a pause, even expanded by hand, and at once at the end', () => {
    expect(autoFoldDelay({ ...idle, status: 'paused', pinned: true })).toBe(PAUSE_FOLD_MS)
    expect(autoFoldDelay({ ...idle, status: 'paused', phone: true })).toBe(PHONE_FOLD_MS)
    expect(autoFoldDelay({ ...idle, status: 'ended', welcomeDone: false })).toBe(0)
  })
})

describe('reduced strip', () => {
  it('hides play only while nothing is playing or to retry', () => {
    expect(['idle', 'paused', 'ended'].every((status) => canGoQuiet(status as never))).toBe(true)
    expect(['playing', 'loading', 'error'].some((status) => canGoQuiet(status as never))).toBe(false)
  })
})
