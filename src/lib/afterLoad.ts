/**
 * Runs `callback` once the page has loaded and the main thread is idle, so
 * decorative animation loops never compete with the initial render.
 * Returns a cancel function.
 */
export function afterLoadIdle(callback: () => void) {
  let cancelIdle = () => {}
  const schedule = () => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, { timeout: 1500 })
      cancelIdle = () => window.cancelIdleCallback(id)
    } else {
      const id = setTimeout(callback, 200)
      cancelIdle = () => clearTimeout(id)
    }
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  return () => {
    window.removeEventListener('load', schedule)
    cancelIdle()
  }
}
