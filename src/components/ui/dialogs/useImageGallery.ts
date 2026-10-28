import { useCallback, useReducer } from 'react'
import { galleryReducer, initialGallery } from './galleryState'

export function useImageGallery(count: number) {
  const [state, dispatch] = useReducer(galleryReducer, initialGallery)
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])
  const closeZoom = useCallback(() => dispatch({ type: 'closeZoom' }), [])
  const openZoom = useCallback(() => dispatch({ type: 'zoom', count }), [count])
  const step = useCallback((delta: number) => dispatch({ type: 'step', delta, count }), [count])
  return { ...state, reset, openZoom, closeZoom, step }
}
