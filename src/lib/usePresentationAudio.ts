import { useSyncExternalStore } from 'react'
import { presentationAudio, presentationPhase } from './presentationAudio'
import { presentationDisplay } from './presentationDisplay'

export function usePresentationAudio() {
  return useSyncExternalStore(presentationAudio.subscribe, presentationAudio.get, presentationAudio.get)
}

export function usePresentationPhase() {
  return useSyncExternalStore(presentationAudio.subscribe, presentationPhase, presentationPhase)
}

/** A first visit's player, as the prerendered page shows it; React applies the stored view right after. */
const FIRST_VISIT_DISPLAY = { minimized: false, speechVisible: false }

export function usePresentationDisplay() {
  return useSyncExternalStore(presentationDisplay.subscribe, presentationDisplay.get, () => FIRST_VISIT_DISPLAY)
}
