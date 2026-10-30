import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import type { LabCourseGroup } from '../../content/lab'

export function LabCurriculumDrawer({ id, title, groups, completed, current, visited, onClose, onSelect, details, tone = 'green' }: {
  id: string; title: string; groups: readonly LabCourseGroup[]; completed: readonly number[]; current?: number; visited: readonly number[]
  onClose: () => void; onSelect: (level: number) => void; details?: (level: number) => ReactNode; tone?: 'green' | 'blue'
}) {
  const scope = useRef<HTMLDivElement>(null)
  const selected = useRef(false)
  const opener = useRef<HTMLElement | null | undefined>(undefined)
  const mounted = useRef(false)
  useLayoutEffect(() => {
    const node = scope.current
    if (!node) return
    mounted.current = true
    if (opener.current === undefined) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    // Only the covered terminal is inert. The rest of the site remains usable.
    const siblings = [...(node.parentElement?.children ?? [])].filter((element): element is HTMLElement => element instanceof HTMLElement && element !== node)
    const previous = siblings.map(element => element.inert)
    siblings.forEach(element => { element.inert = true })
    node.querySelector<HTMLButtonElement>('[data-dialog-initial-focus]')?.focus({ preventScroll: true })
    return () => {
      mounted.current = false
      siblings.forEach((element, index) => { element.inert = previous[index]! })
      queueMicrotask(() => {
        if (!mounted.current && !selected.current && opener.current?.isConnected && opener.current.getClientRects().length && !opener.current.closest('[inert]')) {
          opener.current.focus({ preventScroll: true })
        }
      })
    }
  }, [])
  return <div id={id} ref={scope} className="lab-curriculum" data-tone={tone} role="dialog" aria-labelledby={`${id}-title`} tabIndex={-1}
    onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); onClose() } }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="lab-curriculum__panel" data-dialog-panel>
      <header><h3 id={`${id}-title`}>{title}</h3><button type="button" data-dialog-initial-focus aria-label="Fermer le parcours" onClick={onClose}><X size={20} aria-hidden="true" /></button></header>
      <div className="lab-curriculum__body">
        {groups.map(group => <section key={group.title} aria-label={group.title}><h4>{group.title}</h4><ol>
          {group.levels.map(level => <li key={level.id}>
            <button type="button" disabled={!level.available} aria-current={level.id === current ? 'step' : undefined}
              aria-label={`Niveau ${level.id} : ${level.title}${!level.available ? ' — À venir' : completed.includes(level.id) ? ' — Réussi' : ''}`}
              onClick={() => { selected.current = true; onSelect(level.id); onClose() }}>
              <span className="lab-curriculum__number">{String(level.id).padStart(2, '0')}</span>
              <strong>{level.title}</strong>
              <span className="lab-curriculum__status">{completed.includes(level.id) ? <><Check size={13} aria-hidden="true" /><span className="sr-only">Réussi</span></> : !level.available ? 'À venir' : visited.includes(level.id) ? 'En cours' : ''}</span>
            </button>
            {level.available && details && <details><summary aria-label={`Indices du niveau ${level.id}`}>Indices</summary>{details(level.id)}</details>}
          </li>)}
        </ol></section>)}
      </div>
    </div>
  </div>
}
