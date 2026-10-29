import { describe, expect, it, vi } from 'vitest'
import { createPresentationPlayer } from './presentationAudio'

class FakeMedia extends EventTarget {
  src = ''
  preload = ''
  currentTime = 0
  duration = 29.88
  paused = true
  load = vi.fn()
  removeAttribute = vi.fn()
  play = vi.fn(async () => { this.paused = false })
  pause = vi.fn(() => {
    this.paused = true
    this.dispatchEvent(new Event('pause'))
  })
  emit(event: string) { this.dispatchEvent(new Event(event)) }
}

function setup() {
  const media = new FakeMedia()
  const create = vi.fn(() => media)
  const player = createPresentationPlayer(create, '/intro.mp3')
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
    expect(player.get()).toEqual({ status: 'idle', currentTime: 0, duration: 29.88 })
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
    expect(player.get()).toEqual({ status: 'idle', currentTime: 0, duration: 0 })
    expect(media.removeAttribute).toHaveBeenCalledWith('src')
    expect(media.load).toHaveBeenCalledOnce()
    await player.play()
    expect(create).toHaveBeenCalledTimes(2)
    unsubscribe()
  })
})
