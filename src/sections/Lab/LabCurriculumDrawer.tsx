import { useEffectEvent, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import type { LabCourseGroup } from '../../content/lab'
import { keepClearOfPlayer } from '../../lib/keepClearOfPlayer'

// Two rail positions only, like a documentation outline: phases on the outer one, their levels one step in.
const OUTER = 1
const INNER = 13
const JOG = 20
const HINT_GAP = 8
const HINT_MIN_WIDTH = 96
type RailRow = { level: number | null; top: number; bottom: number }

const railX = (row: RailRow) => row.level === null ? OUTER : INNER
const center = (row: RailRow) => (row.top + row.bottom) / 2

/** The rail from the top down to one row (the whole of it without one), with a short curve at each change of position. */
function railPath(rows: RailRow[], last = rows.length - 1) {
  let path = `M${railX(rows[0]!)} ${rows[0]!.top}`
  for (let index = 0; index < last; index++) {
    const row = rows[index]!
    const next = rows[index + 1]!
    if (railX(row) === railX(next)) continue
    const seam = (row.bottom + next.top) / 2
    path += `V${seam - JOG / 2}C${railX(row)} ${seam} ${railX(next)} ${seam} ${railX(next)} ${seam + JOG / 2}`
  }
  return `${path}V${center(rows[last]!)}`
}

/** Levels as a documentation outline: the rail is lit from the top down to the selected level, which carries the only dot. */
function LevelList({ groups, completed, current, onPick, onHint, details }: {
  groups: readonly LabCourseGroup[]; completed: readonly number[]; current?: number; onPick: (level: number) => void; onHint: (row: HTMLElement | null, text?: string) => void; details?: (level: number) => ReactNode
}) {
  const list = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<RailRow[]>([])
  useLayoutEffect(() => {
    const node = list.current
    if (!node) return
    let alive = true
    const measure = () => {
      if (!alive) return
      const origin = node.getBoundingClientRect().top
      setRows([...node.querySelectorAll<HTMLElement>('h4, li > button')].map((element) => {
        const box = element.getBoundingClientRect()
        return { level: element.dataset.level ? Number(element.dataset.level) : null, top: box.top - origin, bottom: box.bottom - origin }
      }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    void document.fonts?.ready.then(measure)
    return () => { alive = false; observer.disconnect() }
  }, [])
  const selected = rows.findIndex((row) => row.level === current)
  return <div ref={list} className="lab-curriculum__levels">
    {groups.map((group) => <section key={group.title} aria-label={group.title}><h4>{group.title}</h4><ol>
      {group.levels.map((level) => <li key={level.id}>
        <button type="button" data-level={level.id} disabled={!level.available} aria-current={level.id === current ? 'step' : undefined}
          aria-label={`Niveau ${level.id} : ${level.title}${level.summary ? ` : ${level.summary}` : ''}${!level.available ? ' — À venir' : completed.includes(level.id) ? ' — Réussi' : ''}`}
          onPointerEnter={(event) => { if (event.pointerType !== 'touch') onHint(event.currentTarget, level.summary) }} onPointerLeave={() => onHint(null)}
          onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) onHint(event.currentTarget, level.summary) }} onBlur={() => onHint(null)}
          onClick={() => onPick(level.id)}>
          <span className="lab-curriculum__number">{String(level.id).padStart(2, '0')}</span>
          <strong>{level.title}</strong>
          {completed.includes(level.id) && <Check size={13} aria-hidden="true" className="lab-curriculum__done" />}
        </button>
        {level.available && details?.(level.id)}
      </li>)}
    </ol></section>)}
    {rows.length > 0 && <svg className="lab-curriculum__rail" aria-hidden="true">
      <path d={railPath(rows)} />
      {selected >= 0 && <>
        <path data-lit="true" d={railPath(rows, selected)} />
        <circle cx={INNER} cy={center(rows[selected]!)} r={2.5} />
      </>}
    </svg>}
  </div>
}

export function LabCurriculumDrawer({ id, title, groups, completed, current, onClose, onSelect, details, tone = 'green' }: {
  id: string; title: string; groups: readonly LabCourseGroup[]; completed: readonly number[]; current?: number
  onClose: () => void; onSelect: (level: number) => void; details?: (level: number) => ReactNode; tone?: 'green' | 'blue'
}) {
  const scope = useRef<HTMLDivElement>(null)
  const selected = useRef(false)
  const opener = useRef<HTMLElement | null | undefined>(undefined)
  const mounted = useRef(false)
  const close = useEffectEvent(onClose)
  const [hint, setHint] = useState<{ text: string; top: number; right: number; maxWidth: number } | null>(null)
  // The panel clips its content, so the tooltip sits beside it, over the free part of the terminal.
  const showHint = (row: HTMLElement | null, text?: string) => {
    const frame = scope.current?.getBoundingClientRect()
    const panel = row?.closest('.lab-curriculum__panel')?.getBoundingClientRect()
    if (!row || !text || !frame || !panel) return setHint(null)
    const box = row.getBoundingClientRect()
    setHint({ text, top: box.top + box.height / 2 - frame.top, right: frame.right - panel.left + HINT_GAP, maxWidth: panel.left - frame.left - 2 * HINT_GAP })
  }
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
      // A drop-down hanging from the terminal's bar, never over it.
      const bar = trigger.closest('.lab-navigation')?.parentElement?.getBoundingClientRect() ?? button
      node.style.top = `${bar.bottom - frame.top - workspace.clientTop}px`
    }
    position()
    keepClearOfPlayer(node)
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
      <div className="lab-curriculum__body" onScroll={() => setHint(null)}>
        <LevelList groups={groups} completed={completed} current={current} details={details} onHint={showHint}
          onPick={(level) => { selected.current = true; onSelect(level); onClose() }} />
      </div>
    </div>
    {hint && hint.maxWidth >= HINT_MIN_WIDTH && <div className="lab-curriculum__hint" aria-hidden="true" style={{ top: hint.top, right: hint.right, maxWidth: hint.maxWidth }}>{hint.text}</div>}
  </div>
}
