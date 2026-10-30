import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './terminalStartButton.css'

/** The same recessed key for both Lab entrances; only its color palette changes. */
export function TerminalStartButton({ onClick, children, tone = 'green', disabled = false }: { onClick: () => void; children: ReactNode; tone?: 'green' | 'blue'; disabled?: boolean }) {
  const root = useRef<HTMLSpanElement>(null)
  const tilt = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const node = root.current
    if (!node) return
    let visible = false
    const sync = () => { node.dataset.motion = visible && !document.hidden && !reduced ? 'running' : 'paused' }
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; sync() })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    if (reduced && tilt.current) tilt.current.style.transform = ''
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); node.dataset.motion = 'paused' }
  }, [reduced])
  const move = (event: PointerEvent) => {
    const node = tilt.current
    if (!node || disabled || reduced || event.pointerType !== 'mouse') return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    node.style.transform = `rotateX(${-y * 15}deg) rotateY(${x * 22}deg)`
    node.style.setProperty('--gx', `${(x + .5) * 100}%`)
    node.style.setProperty('--gy', `${(y + .5) * 100}%`)
  }
  const leave = () => { if (tilt.current) tilt.current.style.transform = '' }
  return <span ref={root} className="terminal-start inline-block [perspective:700px]" data-tone={tone} data-motion="paused">
    <span ref={tilt} className="block transition-transform duration-150 ease-out">
      <button type="button" disabled={disabled} onClick={onClick} onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave}
        className="group block cursor-pointer rounded-2xl focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4">
        <span className="block rounded-[13px] bg-[#040607] px-2.5 pt-3 pb-2.5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95),inset_0_-1px_0_rgba(255,255,255,0.06)]">
          <span className="terminal-start__key relative block overflow-hidden rounded-lg border px-11 py-3.5 text-[15px] font-bold tracking-[0.3em] whitespace-nowrap text-white uppercase transition-all duration-100 ease-out group-hover:brightness-110 group-active:scale-[0.94] group-active:brightness-90">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgba(255,255,255,0.18),transparent_55%)]" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] motion-safe:animate-[key-sweep_2.8s_ease-in-out_infinite] motion-reduce:hidden" />
            <span className="relative">▶ {children}</span>
          </span>
        </span>
      </button>
    </span>
  </span>
}
