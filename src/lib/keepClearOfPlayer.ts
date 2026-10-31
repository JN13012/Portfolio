import type { FocusEvent } from 'react'

/** Scrolls the page just enough for the element to clear the fixed audio player, never under the nav bar. */
export function keepClearOfPlayer(element: Element) {
  const player = document.querySelector('.presentation-dock[data-inline="false"]')?.getBoundingClientRect()
  if (!player) return
  const box = element.getBoundingClientRect()
  if (box.left >= player.right || box.right <= player.left || box.bottom <= player.top) return
  const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
  const distance = Math.min(box.bottom - player.top + 8, box.top - header - 8)
  if (distance > 0) window.scrollBy(0, distance)
}

/** For a Lab workspace: a field receiving focus, with the form around it, stays above the player. */
export function keepFieldClearOfPlayer({ target }: FocusEvent<HTMLElement>) {
  if (target.matches('input, textarea, select')) keepClearOfPlayer(target.closest('form') ?? target)
}
