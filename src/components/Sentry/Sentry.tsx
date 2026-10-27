import { memo, type CSSProperties } from 'react'
import shell from '../../assets/mascot/robot-shell.webp'
import { SentryFace } from './SentryFace'
import './Sentry.css'

export type SentryState = 'idle' | 'reading' | 'searching' | 'responding' | 'blocked'
export type SentryProps = {
  /** Controlled by the caller's real activity. Never inferred from question content. */
  state?: SentryState
  size?: number
  className?: string
}

/** The supplied shell stays intact; every expression lives on a separate SVG layer. */
export const Sentry = memo(function Sentry({ state = 'idle', size = 48, className = '' }: SentryProps) {
  return (
    <span
      aria-hidden="true"
      className={`sentry ${className}`}
      data-state={state}
      data-compact={size < 64 || undefined}
      style={{ '--sentry-size': `${size}px` } as CSSProperties}
    >
      <img className="sentry__shell" src={shell} width="1254" height="1254" alt="" draggable="false" />
      <SentryFace state={state} />
    </span>
  )
})
