import { useEffect, useRef, useState, type RefObject } from 'react'

/** Shared Lab entrance clock: 170 chars/s, once per session, suspended while invisible. */
export function useTerminalTyping(root: RefObject<HTMLElement | null>, total: number, sessionKey: string, reduced: boolean) {
  const [alreadyTyped] = useState(() => {
    try { return Boolean(sessionStorage.getItem(sessionKey)) } catch { return true }
  })
  const [chars, setChars] = useState(0)
  const progress = useRef(0)
  useEffect(() => {
    const node = root.current
    if (!node || reduced || alreadyTyped) return
    let frame = 0
    let visible = false
    const sync = () => {
      cancelAnimationFrame(frame)
      if (!visible || document.hidden) return
      const offset = progress.current
      const startedAt = performance.now()
      const tick = (now: number) => {
        const count = Math.min(total, offset + (now - startedAt) / 1000 * 170)
        progress.current = count
        setChars(count)
        if (count < total) frame = requestAnimationFrame(tick)
        else {
          try { sessionStorage.setItem(sessionKey, '1') } catch { /* Completion stays in memory. */ }
          observer.disconnect()
          document.removeEventListener('visibilitychange', sync)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; sync() }, { threshold: .35 })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', sync) }
  }, [root, total, sessionKey, reduced, alreadyTyped])
  return reduced || alreadyTyped ? Infinity : chars
}
