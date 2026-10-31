import { useEffect } from 'react'
import { onCore } from '../../lib/coreBus'
import { presentationAudio } from '../../lib/presentationAudio'
import { presentationDisplay } from '../../lib/presentationDisplay'
import { sentryWelcome } from '../../lib/sentryWelcome'

/** Media events own the clock; no animation loop, fetch on mount, or autoplay. */
export function PresentationAudioLifecycle() {
  useEffect(() => {
    const offGate = onCore('replayGate', presentationAudio.pause)
    const syncPlayer = () => {
      const { status } = presentationAudio.get()
      if (status !== 'idle') sentryWelcome.dismiss()
      presentationDisplay.sync(status)
    }
    const offPlayer = presentationAudio.subscribe(syncPlayer)
    syncPlayer()
    // Reduced earlier in this session; an automatic fold during the visit leaves the greeting alone.
    if (presentationDisplay.get().minimized) sentryWelcome.dismiss()
    const hide = () => { if (document.hidden) presentationAudio.pause() }
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('pagehide', presentationAudio.pause)
    return () => {
      offGate()
      offPlayer()
      document.removeEventListener('visibilitychange', hide)
      window.removeEventListener('pagehide', presentationAudio.pause)
      presentationAudio.destroy()
      presentationDisplay.resetSpeech()
    }
  }, [])
  return null
}
