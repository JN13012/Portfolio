import { describe, expect, it, vi } from 'vitest'
import { createPresentationPlayer } from './presentationAudio'

class FakeMedia extends EventTarget {
  src = ''
  preload = ''
  currentTime = 0
  duration = 29.88
  paused = true
  ended = false
  load = vi.fn(() => { this.currentTime = 0; this.duration = NaN; this.ended = false; this.paused = true })
  removeAttribute = vi.fn()
  play = vi.fn(async () => { this.paused = false; this.ended = false })
  pause = vi.fn(() => {
    this.paused = true
    this.dispatchEvent(new Event('pause'))
  })
  emit(event: string) { this.dispatchEvent(new Event(event)) }
}

function setup() {
  const media = new FakeMedia()
  const create = vi.fn(() => media)
  const player = createPresentationPlayer(create, [{ id: 'introduction', src: '/intro.mp3' }])
  return { media, create, player }
}

describe('shared voice presentation player', () => {
  it('does not create or fetch media on mount; multiple controls share one lazy player', async () => {
    const { create, media, player } = setup()
    const unsubscribe = player.subscribe(vi.fn())
    expect(create).not.toHaveBeenCalled()
    await player.play()
    await player.play()
    expect(create).toHaveBeenCalledTimes(1)
    expect(media.preload).toBe('none')
    expect(media.src).toBe('/intro.mp3')
    expect(media.play).toHaveBeenCalledTimes(1)
    expect(player.get().status).toBe('loading')
    media.emit('playing')
    expect(player.get().status).toBe('playing')
    unsubscribe()
  })

  it('follows actual buffering, pause, resume and end events instead of a synthetic timer', async () => {
    const { media, player } = setup()
    await player.play()
    media.emit('loadedmetadata')
    media.emit('playing')
    media.currentTime = 10
    media.emit('timeupdate')
    expect(player.get()).toMatchObject({ status: 'playing', currentTime: 10, duration: 29.88 })
    media.emit('waiting')
    expect(player.get().status).toBe('loading')
    player.pause()
    media.emit('playing') // Late event after a pause must not animate a silent player.
    expect(player.get().status).toBe('paused')
    await player.play()
    media.emit('playing')
    media.emit('ended')
    expect(player.get()).toMatchObject({ status: 'ended', currentTime: 29.88 })
    await player.play()
    expect(media.currentTime).toBe(0)
    expect(player.get().currentTime).toBe(0)
  })

  it('freezes the actual pause position and tracks native seeks before the next progress event', async () => {
    const { media, player } = setup()
    await player.play()
    media.emit('loadedmetadata')
    media.emit('playing')
    media.currentTime = 7.5
    player.pause()
    expect(player.get()).toMatchObject({ status: 'paused', currentTime: 7.5 })
    media.currentTime = 12.6
    media.emit('seeking')
    expect(player.get()).toMatchObject({ status: 'paused', currentTime: 12.6 })
    media.currentTime = 9.5
    media.emit('seeked')
    expect(player.get().currentTime).toBe(9.5)
  })

  it('clamps seeking and stops without recreating the element or losing the duration', async () => {
    const { media, create, player } = setup()
    player.seek(10)
    expect(create).not.toHaveBeenCalled()
    await player.play()
    media.emit('loadedmetadata')
    player.seek(-5)
    expect(media.currentTime).toBe(0)
    player.seek(99)
    expect(media.currentTime).toBe(29.88)
    player.seek(NaN)
    expect(media.currentTime).toBe(29.88)
    player.stop()
    media.emit('pause') // Browsers may queue this event after stop has reset the player.
    expect(player.get()).toEqual({ chapterId: 'introduction', status: 'idle', currentTime: 0, duration: 29.88 })
    expect(media.paused).toBe(true)
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('treats a rejected play as recoverable and reloads failed media on retry', async () => {
    const { media, player } = setup()
    media.play.mockRejectedValueOnce(new Error('Unsupported or unavailable media'))
    await player.play()
    expect(player.get().status).toBe('error')
    await player.play()
    expect(media.load).toHaveBeenCalledTimes(1)
    media.emit('playing')
    expect(player.get().status).toBe('playing')
    media.emit('error')
    expect(player.get().status).toBe('error')
  })

  it('does not turn a cancelled pending play into an error or restart it', async () => {
    const { media, player } = setup()
    let reject!: (reason: Error) => void
    media.play.mockImplementationOnce(() => new Promise<void>((_, fail) => { reject = fail }))
    const pending = player.play()
    player.stop()
    reject(new Error('AbortError'))
    await pending
    expect(player.get().status).toBe('idle')
    expect(media.paused).toBe(true)
  })

  it('releases the source, detaches listeners and remains usable after a StrictMode-style teardown', async () => {
    const { media, create, player } = setup()
    const listener = vi.fn()
    const unsubscribe = player.subscribe(listener)
    await player.play()
    player.destroy()
    const calls = listener.mock.calls.length
    media.emit('error')
    expect(listener.mock.calls).toHaveLength(calls)
    expect(player.get()).toEqual({ chapterId: 'introduction', status: 'idle', currentTime: 0, duration: 0 })
    expect(media.removeAttribute).toHaveBeenCalledWith('src')
    expect(media.load).toHaveBeenCalledOnce()
    await player.play()
    expect(create).toHaveBeenCalledTimes(2)
    unsubscribe()
  })

  it('selects a recorded chapter directly, resets its clock and reuses the same media element', async () => {
    const media = new FakeMedia()
    const create = vi.fn(() => media)
    const player = createPresentationPlayer(create, [{ id: 'introduction', src: '/intro.mp3' }, { id: 'fraude', src: '/fraude.mp3' }])
    player.selectChapter('unavailable')
    expect(create).not.toHaveBeenCalled()
    player.selectChapter('fraude')
    expect(media.src).toBe('/fraude.mp3')
    media.duration = 29.04
    media.emit('loadedmetadata')
    media.emit('playing')
    player.seek(15)
    expect(player.get()).toMatchObject({ chapterId: 'fraude', currentTime: 15, duration: 29.04 })
    player.selectChapter('introduction')
    expect(media.src).toBe('/intro.mp3')
    expect(player.get()).toMatchObject({ chapterId: 'introduction', currentTime: 0, duration: 0, status: 'loading' })
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('advances after a native end, stops at the final recording and replays from the introduction', async () => {
    const media = new FakeMedia()
    const create = vi.fn(() => media)
    const player = createPresentationPlayer(create, [{ id: 'introduction', src: '/intro.mp3' }, { id: 'fraude', src: '/fraude.mp3' }, { id: 'profil', src: '/profil.mp3' }, { id: 'projets', src: '/projets.mp3' }])
    await player.play()
    media.emit('playing')
    media.ended = true
    media.paused = true
    media.emit('pause') // Native browsers emit pause before ended at the end of a track.
    expect(player.get().status).toBe('playing')
    media.emit('ended')
    expect(player.get()).toMatchObject({ chapterId: 'fraude', status: 'loading', currentTime: 0, duration: 0 })
    expect(media.src).toBe('/fraude.mp3')
    media.duration = 29.04
    media.emit('loadedmetadata')
    media.emit('playing')
    media.ended = true
    media.paused = true
    media.emit('pause')
    media.emit('ended')
    expect(player.get()).toMatchObject({ chapterId: 'profil', status: 'loading', currentTime: 0, duration: 0 })
    expect(media.src).toBe('/profil.mp3')
    media.duration = 33.450091
    media.emit('loadedmetadata')
    media.emit('playing')
    media.ended = true
    media.paused = true
    media.emit('pause')
    media.emit('ended')
    expect(player.get()).toMatchObject({ chapterId: 'projets', status: 'loading', currentTime: 0, duration: 0 })
    expect(media.src).toBe('/projets.mp3')
    media.duration = 67.84
    media.emit('loadedmetadata')
    media.emit('playing')
    media.ended = true
    media.paused = true
    media.emit('pause')
    media.emit('ended')
    expect(player.get()).toMatchObject({ chapterId: 'projets', status: 'ended', currentTime: 67.84 })
    await player.play()
    expect(player.get()).toMatchObject({ chapterId: 'introduction', status: 'loading', currentTime: 0, duration: 0 })
    expect(media.src).toBe('/intro.mp3')
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('does not advance on a late ended event after an explicit pause', async () => {
    const media = new FakeMedia()
    const player = createPresentationPlayer(() => media, [{ id: 'introduction', src: '/intro.mp3' }, { id: 'fraude', src: '/fraude.mp3' }])
    await player.play()
    media.emit('playing')
    player.pause()
    media.ended = true
    media.emit('ended')
    expect(player.get()).toMatchObject({ chapterId: 'introduction', status: 'paused' })
    expect(media.src).toBe('/intro.mp3')
  })

  it('ignores a cancelled old play promise when a different chapter has already started', async () => {
    const media = new FakeMedia()
    const player = createPresentationPlayer(() => media, [{ id: 'introduction', src: '/intro.mp3' }, { id: 'fraude', src: '/fraude.mp3' }])
    let reject!: (reason: Error) => void
    media.play.mockImplementationOnce(() => new Promise<void>((_, fail) => { reject = fail }))
    const pending = player.play()
    player.selectChapter('fraude')
    media.emit('playing')
    reject(new Error('AbortError from the previous source'))
    await pending
    expect(player.get()).toMatchObject({ chapterId: 'fraude', status: 'playing' })
  })
})
