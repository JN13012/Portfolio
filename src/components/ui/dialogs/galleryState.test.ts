import { describe, expect, it } from 'vitest'
import { galleryReducer } from './galleryState'

describe('image gallery navigation', () => {
  it('wraps from the last image to the first', () => {
    expect(galleryReducer({ imageIndex: 3, zoomed: false }, { type: 'step', delta: 1, count: 4 }).imageIndex).toBe(0)
  })
  it('wraps backwards from the first image to the last', () => {
    expect(galleryReducer({ imageIndex: 0, zoomed: false }, { type: 'step', delta: -1, count: 4 }).imageIndex).toBe(3)
  })
  it('keeps the zoom open while navigating', () => {
    expect(galleryReducer({ imageIndex: 1, zoomed: true }, { type: 'step', delta: 1, count: 4 })).toEqual({ imageIndex: 2, zoomed: true })
  })
  it('handles an empty gallery without an invalid index', () => {
    expect(galleryReducer({ imageIndex: 2, zoomed: true }, { type: 'step', delta: -1, count: 0 })).toEqual({ imageIndex: 0, zoomed: false })
  })
  it('keeps a single image at index zero in either direction', () => {
    for (const delta of [-1, 1]) expect(galleryReducer({ imageIndex: 0, zoomed: false }, { type: 'step', delta, count: 1 }).imageIndex).toBe(0)
  })
  it('does not open an empty lightbox', () => {
    expect(galleryReducer({ imageIndex: 0, zoomed: false }, { type: 'zoom', count: 0 }).zoomed).toBe(false)
  })
  it('resets both the image and zoom when a detail is opened again', () => {
    expect(galleryReducer({ imageIndex: 3, zoomed: true }, { type: 'reset' })).toEqual({ imageIndex: 0, zoomed: false })
  })
  it('keeps the selected image when leaving the lightbox', () => {
    expect(galleryReducer({ imageIndex: 2, zoomed: true }, { type: 'closeZoom' })).toEqual({ imageIndex: 2, zoomed: false })
  })
})
