import { useSyncExternalStore } from 'react'
import { presentationAudio, presentationPhase } from './presentationAudio'
import { presentationDisplay } from './presentationDisplay'

export function usePresentationAudio() {
  return useSyncExternalStore(presentationAudio.subscribe, presentationAudio.get, presentationAudio.get)
}

export function usePresentationPhase() {
  return useSyncExternalStore(presentationAudio.subscribe, presentationPhase, presentationPhase)
}

export function usePresentationDisplay() {
  return useSyncExternalStore(presentationDisplay.subscribe, presentationDisplay.get, presentationDisplay.get)
}
