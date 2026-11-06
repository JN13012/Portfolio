import { useEffect, useState, type RefObject } from 'react'

/**
 * True once the element comes within `margin` of the viewport, and stays true. Used to load CSS
 * background images only when they are about to be seen: unlike <img loading="lazy">, a background
 * image starts downloading as soon as it is rendered, even far below the fold.
 */
export function useNearViewport(ref: RefObject<Element | null>, margin = '400px'): boolean {
  // Without IntersectionObserver (old browsers, tests), load at once.
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const node = ref.current
    if (near || !node) return
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setNear(true) }, { rootMargin: margin })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, margin, near])
  return near
}
