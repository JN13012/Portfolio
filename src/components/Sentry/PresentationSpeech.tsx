import { Fragment, useSyncExternalStore } from 'react'
import { presentationCaptionAt } from '../../content/presentation'
import { presentationTranscript } from '../../lib/presentationTranscript'
import { usePresentationAudio, usePresentationDisplay } from '../../lib/usePresentationAudio'
import { useDocumentVisible } from '../../lib/useDocumentVisible'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './presentation.css'

const noSubscription = () => () => {}

/** The same caption follows the media clock in the floating bubble and chat header. */
export function PresentationSpeech({ inChat = false }: { inChat?: boolean }) {
  const audio = usePresentationAudio()
  const visible = useDocumentVisible()
  const display = usePresentationDisplay()
  const reduced = useReducedMotion()
  const followWords = visible && !reduced && !display.minimized && display.speechVisible && ['playing', 'paused', 'loading'].includes(audio.status)
  const transcript = useSyncExternalStore(followWords ? presentationTranscript.subscribe : noSubscription, presentationTranscript.get, presentationTranscript.get)
  if (display.minimized || !display.speechVisible || !['playing', 'paused', 'loading'].includes(audio.status)) return null
  if (audio.status === 'loading' && !audio.currentTime) return null
  const caption = followWords ? transcript.caption : presentationCaptionAt(audio.currentTime, audio.chapterId)
  if (!caption) return null

  return (
    <div className="presentation-speech" data-inline={inChat} data-playing={audio.status === 'playing' && visible} aria-label="Présentation de Sentry">
      <div className="presentation-speech__heading">
        <span className="presentation-speech__bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span>Sentry</span>
        {audio.status === 'paused' && <span className="presentation-speech__paused">En pause</span>}
      </div>
      <p data-presentation-caption>
        {caption.words.map((word, index) => (
          <Fragment key={word.start}>
            {index > 0 && ' '}
            <span data-presentation-word data-active={followWords && transcript.wordIndex === index ? 'true' : undefined}>{word.text}</span>
          </Fragment>
        ))}
      </p>
    </div>
  )
}
