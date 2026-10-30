import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/** Appended to the navbar so its position also follows the expanded mobile menu. */
export function LabConstructionNotice() {
  const [slot] = useState(() => document.createElement('div'))
  useLayoutEffect(() => {
    const header = document.querySelector('nav[aria-label="Navigation principale"]')?.parentElement
    if (!header) return
    header.append(slot)
    return () => slot.remove()
  }, [slot])
  return createPortal(<div className="lab-construction-notice" role="status">
    <span aria-hidden="true">🚧</span><span>Le Lab IA est en cours de construction</span><span aria-hidden="true">🚧</span>
  </div>, slot)
}
