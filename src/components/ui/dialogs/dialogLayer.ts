import { useLayoutEffect, useRef, type RefObject } from 'react'

type Layer = { node: HTMLElement }
type FocusOptions = { restoreFocus?: () => boolean; fallbackFocus?: () => HTMLElement | null }
const layers: Layer[] = []
const previousInert = new Map<HTMLElement, boolean>()

/** Keep the background and underlying portals out of keyboard and accessibility navigation. */
function syncLayers() {
  const top = layers.at(-1)
  if (!top) {
    for (const [element, inert] of previousInert) element.inert = inert
    previousInert.clear()
    return
  }
  for (const child of document.body.children) {
    if (!(child instanceof HTMLElement)) continue
    if (!previousInert.has(child)) previousInert.set(child, child.inert)
    child.inert = !child.contains(top.node)
  }
  for (const layer of layers) {
    if (layer === top) layer.node.removeAttribute('aria-hidden')
    else layer.node.setAttribute('aria-hidden', 'true')
  }
}

export const isTopDialog = (node: HTMLElement) => layers.at(-1)?.node === node

function canFocus(element: HTMLElement | null): element is HTMLElement {
  return !!element?.isConnected && !element.closest('[inert]') && element !== document.body
}

function focus(element: HTMLElement) {
  const temporaryTabIndex = !element.hasAttribute('tabindex') && element.tabIndex < 0
  if (temporaryTabIndex) element.tabIndex = -1
  element.focus({ preventScroll: true })
  if (temporaryTabIndex) {
    if (document.activeElement !== element) element.removeAttribute('tabindex')
    else element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true })
  }
}

/** Registration is shared only by dialog layers; selections and business data stay in the sections. */
export function useDialogLayer(scope: RefObject<HTMLDivElement | null>, { restoreFocus, fallbackFocus }: FocusOptions = {}) {
  const options = useRef({ restoreFocus, fallbackFocus })
  const initialOpener = useRef<HTMLElement | null | undefined>(undefined)
  useLayoutEffect(() => {
    options.current = { restoreFocus, fallbackFocus }
  }, [restoreFocus, fallbackFocus])

  useLayoutEffect(() => {
    const node = scope.current
    if (!node) return
    if (initialOpener.current === undefined) initialOpener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const opener = initialOpener.current
    const layer = { node }
    layers.push(layer)
    syncLayers()
    focus(node.querySelector<HTMLElement>('[data-dialog-initial-focus]') ?? node)

    return () => {
      const wasTop = isTopDialog(node)
      const at = layers.indexOf(layer)
      if (at !== -1) layers.splice(at, 1)
      syncLayers()
      // Wait until removed buttons are detached; ignore StrictMode's synthetic cleanup.
      queueMicrotask(() => {
        if (!wasTop || layers.some((entry) => entry.node === node) || options.current.restoreFocus?.() === false) return
        const top = layers.at(-1)?.node
        if (canFocus(opener) && (!top || top.contains(opener))) focus(opener)
        else if (top) focus(top)
        else {
          const fallback = options.current.fallbackFocus?.() ?? null
          if (canFocus(fallback)) focus(fallback)
        }
      })
    }
  }, [scope])

  // A course or item change can remove the focused button without unmounting the frame.
  useLayoutEffect(() => {
    const node = scope.current
    if (node && isTopDialog(node) && !node.contains(document.activeElement)) {
      focus(node.querySelector<HTMLElement>('[data-dialog-initial-focus]') ?? node)
    }
  })
}

export function trapDialogTab(node: HTMLElement, event: { shiftKey: boolean; preventDefault: () => void }) {
  const controls = [...node.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')]
    .filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0)
  const first = controls[0]
  const last = controls.at(-1)
  const active = document.activeElement
  if (!first || !last) {
    event.preventDefault()
    focus(node)
  } else if (!node.contains(active) || active === node || (event.shiftKey ? active === first : active === last)) {
    event.preventDefault()
    focus(event.shiftKey ? last : first)
  }
}
