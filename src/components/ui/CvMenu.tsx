import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { profile } from '../../content/profile'
import { tracksFromSearch } from '../../lib/projects'
import { cvMenuUi } from '../../content/ui'
import { cx } from '../../lib/cx'

/**
 * One « Télécharger mon CV » button opening the list of the three CVs (profile.cv), each a direct
 * download. Escape or a click elsewhere closes it; Escape returns focus to the button.
 */
/** The CV matching a targeted link (?metier=cyber|blockchain) comes first; otherwise the general AI × cyber one. */
const FIRST_FOR_JOB: Partial<Record<string, string>> = { cyber: 'cyber', blockchain: 'ia-blockchain' }
const firstId = FIRST_FOR_JOB[tracksFromSearch(window.location.search)[0] ?? '']
const CVS = firstId ? [...profile.cv].sort((a, b) => Number(b.id === firstId) - Number(a.id === firstId)) : profile.cv

export function CvMenu({ children, className, up = false }: { children: ReactNode; className: string; /** Opens above the button (the hero's button sits near the fold). */ up?: boolean }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    // Leaving the menu with Tab closes it too.
    const focus = (event: FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', key)
    document.addEventListener('focusin', focus)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', key)
      document.removeEventListener('focusin', focus)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      <button ref={button} type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)} className={cx(className, 'cursor-pointer')}>
        {children}
        <ChevronDown aria-hidden="true" className={cx('size-[1em] shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-180')} />
      </button>
      {open && (
        <ul
          id={menuId}
          aria-label={cvMenuUi.list.fr}
          className={cx('absolute left-0 z-30 min-w-full w-max max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-white/15 bg-zinc-950/95 py-1 text-left normal-case tracking-normal shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] backdrop-blur', up ? 'bottom-full mb-2' : 'top-full mt-2')}
        >
          {CVS.map((cv) => (
            <li key={cv.id}>
              <a
                href={cv.url}
                download={cv.fileName}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-100 transition-colors hover:bg-white/5 hover:text-cyber focus-visible:bg-white/5 focus-visible:text-cyber focus-visible:outline-none"
              >
                <Download size={16} aria-hidden="true" className="shrink-0" />
                {cv.label.fr}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
