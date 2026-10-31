import { flushSync } from 'react-dom'

const STEP_MS = 70
const FOLD_MS = 160
const EASING = 'ease-in-out'

/**
 * The strip's cascade: replay and time first, then each visible chapter, narrow one after the other while
 * the dock stays anchored on the right, so play slides into the chevron. Opening plays it backwards.
 * Only called with motion allowed; the view changes at once otherwise.
 */
export async function foldPlayer(root: HTMLElement, minimize: boolean, setMinimized: (value: boolean) => void) {
  if (!minimize) flushSync(() => setMinimized(false))
  const list = root.querySelector<HTMLElement>('.presentation-chapters')
  const toolbar = root.querySelector<HTMLElement>('.presentation-toolbar')
  const controls = root.querySelector<HTMLElement>('.presentation-controls')
  if (!list || !toolbar || !controls) { setMinimized(minimize); return }

  // Measure before the layout changes. Chapters scrolled out of the list stay out of the cascade; one cut
  // by its edge counts for what shows, so the dock keeps its width when the cascade starts.
  const bounds = list.getBoundingClientRect()
  const steps = new Map<string, { element: HTMLElement; width: number; height: number }[]>()
  const skipped: HTMLElement[] = []
  root.querySelectorAll<HTMLElement>('[data-fold]').forEach((element) => {
    const box = element.getBoundingClientRect()
    const inList = element.parentElement === list
    const shown = inList ? Math.min(box.right, bounds.right - 3) - Math.max(box.left, bounds.left + 3) : box.width
    if (shown <= 0) { skipped.push(element); return }
    const step = element.dataset.fold ?? ''
    steps.set(step, [...(steps.get(step) ?? []), { element, width: shown, height: box.height }])
  })
  const total = (steps.size - 1) * STEP_MS + FOLD_MS
  const direction: PlaybackDirection = minimize ? 'normal' : 'reverse'
  const gaps = [toolbar, controls, list].map((element) => ({ element, style: getComputedStyle(element) }))
    .map(({ element, style }) => ({ element, gap: style.columnGap, padding: style.padding, height: element === list ? element.offsetHeight : 0 }))

  root.dataset.folding = 'true'
  skipped.forEach((element) => { element.style.display = 'none' })
  const animations: Animation[] = []
  ;[...steps.values()].forEach((group, index) => group.forEach(({ element, width, height }) => {
    const delay = index * STEP_MS
    // Time sits under the buttons on small screens: it gives back its height as well.
    const y = element.matches('.presentation-time') ? { height: [`${height}px`, '0px'] } : {}
    animations.push(element.animate({ width: [`${width}px`, '0px'], opacity: [1, 0], ...y }, { delay, endDelay: total - delay - FOLD_MS, duration: FOLD_MS, easing: EASING, fill: 'both', direction }))
  }))
  gaps.forEach(({ element, gap, padding, height }) => {
    const keyframes: PropertyIndexedKeyframes = element === list
      ? { columnGap: [gap, '0px'], padding: [padding, '0px'], height: [`${height}px`, '44px'] }
      : { columnGap: [gap, '0px'] }
    animations.push(element.animate(keyframes, { duration: total, easing: EASING, fill: 'both', direction }))
  })
  // Only shown once reduced: the progress bar or the word next to play grow in as the rest folds.
  root.querySelectorAll<HTMLElement>('[data-fold-reveal]').forEach((element) => {
    const { width, marginRight } = getComputedStyle(element)
    animations.push(element.animate({ width: ['0px', width], marginRight: ['0px', marginRight] }, { duration: total, easing: EASING, fill: 'both', direction }))
  })

  await Promise.allSettled(animations.map((animation) => animation.finished))
  if (minimize && root.isConnected) flushSync(() => setMinimized(true))
  animations.forEach((animation) => animation.cancel())
  skipped.forEach((element) => { element.style.removeProperty('display') })
  delete root.dataset.folding
}
