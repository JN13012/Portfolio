import { useId } from 'react'

/**
 * Ethereum's mark as a faceted crystal (cyan to blue to soft violet), drawn after the icon Jérémie chose
 * on 2026-11-05: two pieces, each facet with its own light, and no background so it floats on the page.
 */
export function EthereumCrystal({ className }: { className?: string }) {
  const id = useId()
  const g = (name: string) => `url(#${id}${name})`
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}tl`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c7ecff" /><stop offset="1" stopColor="#6fb4ff" /></linearGradient>
        <linearGradient id={`${id}tr`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7d9cff" /><stop offset="1" stopColor="#5a6ff0" /></linearGradient>
        <linearGradient id={`${id}ml`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fd0ff" /><stop offset="1" stopColor="#5c8ef7" /></linearGradient>
        <linearGradient id={`${id}mr`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6d7ff2" /><stop offset="1" stopColor="#4a55d8" /></linearGradient>
        <linearGradient id={`${id}bl`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b6e6ff" /><stop offset="1" stopColor="#7bb7ff" /></linearGradient>
        <linearGradient id={`${id}br`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a8cf5" /><stop offset="1" stopColor="#6670ea" /></linearGradient>
      </defs>
      {/* Upper piece: two facets per side around the ridge. */}
      <polygon points="12,0 4.2,12.2 12,8.8" fill={g('tl')} />
      <polygon points="12,0 19.8,12.2 12,8.8" fill={g('tr')} />
      <polygon points="4.2,12.2 12,16.6 12,8.8" fill={g('ml')} />
      <polygon points="19.8,12.2 12,16.6 12,8.8" fill={g('mr')} />
      {/* Lower piece. */}
      <polygon points="4.2,13.8 12,24 12,18.3" fill={g('bl')} />
      <polygon points="19.8,13.8 12,24 12,18.3" fill={g('br')} />
    </svg>
  )
}
