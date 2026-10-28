export type GalleryState = { imageIndex: number; zoomed: boolean }
type GalleryAction =
  | { type: 'reset' }
  | { type: 'zoom'; count: number }
  | { type: 'closeZoom' }
  | { type: 'step'; delta: number; count: number }

export const initialGallery: GalleryState = { imageIndex: 0, zoomed: false }

export function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case 'reset':
      return initialGallery
    case 'closeZoom':
      return { ...state, zoomed: false }
    case 'zoom':
      return action.count > 0
        ? { imageIndex: state.imageIndex < action.count ? state.imageIndex : 0, zoomed: true }
        : initialGallery
    case 'step':
      return action.count > 0
        ? { ...state, imageIndex: ((state.imageIndex + action.delta) % action.count + action.count) % action.count }
        : initialGallery
  }
}
