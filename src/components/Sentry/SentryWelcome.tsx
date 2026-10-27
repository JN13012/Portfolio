import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { SEEN_KEY, markSentryWelcomeSeen } from './welcomeSession'

/** Mounted after the intro, only while the conversation is closed. */
export function SentryWelcome({ onDismiss }: { onDismiss: () => void }) {
  const [phase, setPhase] = useState<'waiting' | 'visible' | 'dismissed'>(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1' ? 'dismissed' : 'waiting'
    } catch {
      return 'waiting'
    }
  })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (phase !== 'waiting') return
    const timer = setTimeout(() => {
      markSentryWelcomeSeen()
      setPhase('visible')
    }, 1200)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'visible' || hovered || focused) return
    const timer = setTimeout(() => setPhase('dismissed'), 8000)
    return () => clearTimeout(timer)
  }, [phase, hovered, focused])

  const dismiss = () => {
    setPhase('dismissed')
    onDismiss()
  }

  if (phase !== 'visible') return null

  return (
    <div
      className="sentry-welcome"
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
        <strong>Bonjour, moi c’est Sentry.</strong>
        <span>Je vous guide dans le portfolio de Jérémie.</span>
      </p>
    </div>
  )
}
