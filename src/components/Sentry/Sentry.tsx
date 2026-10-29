import { memo, useRef, type CSSProperties } from 'react'
import shell from '../../assets/mascot/robot-shell.webp'
import { SentryFace } from './SentryFace'
import type { SentryState } from './sentryActivity'
import { useSentryMotion } from './useSentryMotion'
import { useSentryInclination } from './useSentryInclination'
import type { WelcomeCue } from '../../lib/sentryWelcome'
import './Sentry.css'

export type { SentryState } from './sentryActivity'
export type SentryProps = {
  /** Controlled by the caller's real activity. Never inferred from question content. */
  state?: SentryState
  size?: number
  className?: string
  /** Historical message avatars stay still, without observers or timers. */
  animated?: boolean
  /** Explicitly pause a launcher hidden by the chat or the globe intro. */
  paused?: boolean
  /** A discrete welcome gesture, independent of the expression. */
  welcomeCue?: WelcomeCue
  onCueFinished?: (cue: WelcomeCue) => void
}

/** The supplied shell stays intact; every expression lives on a separate SVG layer. */
export const Sentry = memo(function Sentry({ state = 'idle', size = 48, className = '', animated = true, paused = false, welcomeCue = 0, onCueFinished }: SentryProps) {
  const root = useRef<HTMLSpanElement>(null)
  useSentryMotion(root, animated, paused, state)
  useSentryInclination(root, animated, paused, welcomeCue, onCueFinished)

  return (
    <span
      ref={root}
      aria-hidden="true"
      className={`sentry ${className}`}
      data-state={state}
      data-animated={animated}
      data-motion="paused"
      data-welcome-cue={welcomeCue || undefined}
      data-compact={size < 64 || undefined}
      style={{ '--sentry-size': `${size}px` } as CSSProperties}
    >
      <img className="sentry__shell" src={shell} width="1254" height="1254" alt="" draggable="false" />
      <SentryFace state={state} />
    </span>
  )
})
