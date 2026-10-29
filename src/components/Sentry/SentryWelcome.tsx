import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { assistantUi as ui } from '../../content/assistant'
import { useDocumentVisible } from '../../lib/useDocumentVisible'

/** Time the greeting stays on screen (paused while hovered or focused), then a short fade (2026-10-27). */
const SHOWN_MS = 10000
const FADE_MS = 400

/** Mounted after the intro, only while the conversation is closed. */
export function SentryWelcome({ onDismiss, onDone }: {
  onDismiss: () => void
  onDone: () => void
}) {
  const [phase, setPhase] = useState<'visible' | 'leaving'>('visible')
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const documentVisible = useDocumentVisible()

  useEffect(() => {
    if (phase !== 'visible' || hovered || focused || !documentVisible) return
    const timer = setTimeout(() => setPhase('leaving'), SHOWN_MS)
    return () => clearTimeout(timer)
  }, [phase, hovered, focused, documentVisible])

  useEffect(() => {
    if (phase !== 'leaving') return
    const timer = setTimeout(onDone, FADE_MS)
    return () => clearTimeout(timer)
  }, [phase, onDone])

  const dismiss = () => {
    onDone()
    onDismiss()
  }

  return (
    <div
      className="sentry-welcome"
      data-leaving={phase === 'leaving' || undefined}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          dismiss()
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      <svg className="sentry-welcome__tail" viewBox="0 0 38 28" aria-hidden="true">
        <path d="M1 1 C7 13 16 23 34 25 C25 17 25 9 29 1" />
      </svg>
      <span className="sentry-welcome__name">Sentry</span>
      <button
        type="button"
        className="sentry-welcome__close"
        aria-label="Fermer le message de bienvenue"
        onClick={dismiss}
      >
        <X size={15} aria-hidden="true" />
      </button>
      <p role="status">
        <strong>{ui.welcomeTitle.fr}</strong>
        <span>{ui.welcomeBody.fr}</span>
      </p>
    </div>
  )
}
