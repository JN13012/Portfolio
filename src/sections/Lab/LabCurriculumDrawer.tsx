import { useEffectEvent, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import type { LabCourseGroup } from '../../content/lab'

export function LabCurriculumDrawer({ id, title, groups, completed, current, visited, onClose, onSelect, details, tone = 'green' }: {
  id: string; title: string; groups: readonly LabCourseGroup[]; completed: readonly number[]; current?: number; visited: readonly number[]
  onClose: () => void; onSelect: (level: number) => void; details?: (level: number) => ReactNode; tone?: 'green' | 'blue'
}) {
  const scope = useRef<HTMLDivElement>(null)
  const selected = useRef(false)
  const opener = useRef<HTMLElement | null | undefined>(undefined)
  const mounted = useRef(false)
  const close = useEffectEvent(onClose)
  useLayoutEffect(() => {
    const node = scope.current
    if (!node) return
    mounted.current = true
    if (opener.current === undefined) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const workspace = node.parentElement
    const trigger = [...(workspace?.querySelectorAll<HTMLButtonElement>(`button[aria-controls="${id}"]`) ?? [])].find(button => button.getClientRects().length > 0)
    const position = () => {
      if (!workspace || !trigger) return
      const frame = workspace.getBoundingClientRect()
      const button = trigger.getBoundingClientRect()
      node.style.top = `${button.bottom - frame.top - workspace.clientTop + 4}px`
      node.style.right = `${Math.max(8, frame.right - workspace.clientLeft - button.right)}px`
    }
    position()
    const observer = new ResizeObserver(position)
    if (workspace) observer.observe(workspace)
    if (trigger) observer.observe(trigger)
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !node.contains(event.target) && !trigger?.contains(event.target)) {
        selected.current = true // Let the clicked control receive focus.
        close()
      }
    }
    document.addEventListener('pointerdown', outside, true)
    node.querySelector<HTMLButtonElement>('li > button:not(:disabled)')?.focus({ preventScroll: true })
    return () => {
      mounted.current = false
      observer.disconnect()
      document.removeEventListener('pointerdown', outside, true)
      queueMicrotask(() => {
        if (!mounted.current && !selected.current && opener.current?.isConnected && opener.current.getClientRects().length && !opener.current.closest('[inert]')) {
          opener.current.focus({ preventScroll: true })
        }
      })
    }
  }, [id])
  return <div id={id} ref={scope} className="lab-curriculum" data-tone={tone} role="dialog" aria-labelledby={`${id}-title`} tabIndex={-1}
    onKeyDown={event => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); onClose() } }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="lab-curriculum__panel" data-dialog-panel>
      <h3 id={`${id}-title`} className="sr-only">{title}</h3>
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
