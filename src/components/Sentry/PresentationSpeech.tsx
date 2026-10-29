import { presentationCaptionAt } from '../../content/presentation'
import { usePresentationAudio, usePresentationDisplay } from '../../lib/usePresentationAudio'
import { useDocumentVisible } from '../../lib/useDocumentVisible'
import './presentation.css'

/** The same caption follows the media clock in the floating bubble and chat header. */
export function PresentationSpeech({ inChat = false }: { inChat?: boolean }) {
  const audio = usePresentationAudio()
  const visible = useDocumentVisible()
  const display = usePresentationDisplay()
  if (display.minimized || !display.speechVisible || !['playing', 'paused', 'loading'].includes(audio.status)) return null
  if (audio.status === 'loading' && !audio.currentTime) return null
  const caption = presentationCaptionAt(audio.currentTime)
  if (!caption) return null

  return (
    <div className="presentation-speech" data-inline={inChat} data-playing={audio.status === 'playing' && visible} aria-label="Présentation de Sentry">
      <div className="presentation-speech__heading">
        <span className="presentation-speech__bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span>Sentry</span>
        {audio.status === 'paused' && <span className="presentation-speech__paused">En pause</span>}
      </div>
      <p data-presentation-caption>{caption.text}</p>
    </div>
  )
}
