// Sentry, the assistant's mascot: a small sentinel robot whose eyes are two neurons of the hero
// network, linked by a synapse. Its mood follows the assistant: idle (blinks, antenna pulses),
// reading, thinking (a signal runs from eye to eye), happy (answer given), alert (attack blocked).
// Still under prefers-reduced-motion. Original drawing (2026-10-27).
import { useId, useSyncExternalStore } from 'react'
import { cx } from '../../lib/cx'

export type SentryMood = 'idle' | 'reading' | 'thinking' | 'happy' | 'alert'

const QUERY = '(prefers-reduced-motion: reduce)'
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function Sentry({ mood = 'idle', size = 40, className }: { mood?: SentryMood; size?: number; className?: string }) {
  const glow = `sentry-glow-${useId().replace(/:/g, '')}`
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true)
  const alert = mood === 'alert'
  // Reading: the eyes look down-left, toward the question.
  const look = mood === 'reading' ? -2.5 : 0
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={cx('shrink-0 overflow-visible', alert ? 'text-[var(--color-threat)]' : 'text-cyber', className)}
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Antenna: a synapse that pulses. */}
      <line x1="32" y1="11" x2="32" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="32" cy="4" r="2.6" fill="currentColor" filter={`url(#${glow})`} className={still ? undefined : 'animate-pulse'} />

      {/* Ears, head, neck. */}
      <rect x="3.5" y="25" width="5" height="13" rx="2.5" fill="#0f1712" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="55.5" y="25" width="5" height="13" rx="2.5" fill="#0f1712" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="8" y="11" width="48" height="41" rx="15" fill="#0f1712" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="52" width="12" height="5" rx="2" fill="#0f1712" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />

      {/* Visor. */}
      <rect x="14" y="20" width="36" height="21" rx="9" fill="#040706" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" />

      {/* Eyes: two neurons and their synapse. */}
      <g transform={`translate(${look} ${look ? 1.5 : 0})`}>
        <line x1="24" y1="30.5" x2="40" y2="30.5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
        {mood === 'happy' ? (
          <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" filter={`url(#${glow})`}>
            <path d="M20 32 q4 -5.5 8 0" />
            <path d="M36 32 q4 -5.5 8 0" />
          </g>
        ) : (
          <g fill="currentColor" filter={`url(#${glow})`} className={still || mood !== 'idle' ? undefined : 'sentry-blink'}>
            <circle cx="24" cy="30.5" r="4" />
            <circle cx="40" cy="30.5" r="4" />
          </g>
        )}
        {mood === 'thinking' && !still && (
          <circle cy="30.5" r="1.6" fill="#ffffff">
            <animate attributeName="cx" values="24;40;24" dur="0.9s" repeatCount="indefinite" />
          </circle>
        )}
      </g>

      {/* Attack blocked: a small shield on the forehead. */}
      {alert && <path d="M32 13.5 l5 2 v3.5 c0 3 -2.2 5 -5 6 c-2.8 -1 -5 -3 -5 -6 v-3.5 z" fill="currentColor" opacity="0.9" />}
    </svg>
  )
}
