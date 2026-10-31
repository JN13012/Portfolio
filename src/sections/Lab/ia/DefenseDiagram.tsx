import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Sentry } from '../../../components/Sentry'
import { aiLabLevels, defensePanelCopy, defenseStages, type DefenseStageId, type LabLevel } from '../../../content/aiLab'
import { useReducedMotion } from '../../../lib/useReducedMotion'
import { stageStatusLabels, type LabResult, type LabTrace } from './labState'

const subscribeVisibility = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}
const subscribeWidth = (callback: () => void) => {
  const query = window.matchMedia('(min-width: 1024px)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
// A simplified drawing: each stage of the current level is one point on a line and a ring marks the stages
// that can stop a request. The Hero illustrates the model's network; here it is one larger point.
const SIGNAL_SPEED = 100 // Drawing units per second, measured along the line so the pace stays the same everywhere.
const BASE_HEIGHT = 124
const TOP_SPACE = 44
const BOTTOM_SPACE = 26
const MAX_ROW_GAP = 110
const MARGIN_X = 50
const WIDTH = 640
const STAGE_LAYOUT: Record<DefenseStageId, { rows: readonly number[]; label: readonly string[]; check?: true }> = {
  entry: { rows: [1], label: ['Entrée'] },
  input: { rows: [1], label: ['Filtre', 'd’entrée'], check: true },
  instructions: { rows: [1], label: ['Consignes'] },
  model: { rows: [1], label: ['Modèle'] },
  output: { rows: [1], label: ['Filtre', 'de sortie'], check: true },
  classifier: { rows: [1], label: ['Classifieur', 'IA'], check: true },
  response: { rows: [1], label: ['Réponse'] },
  flag: { rows: [1], label: ['Flag'] },
}
type Point = { x: number; y: number }
type Column = { stage: number; x: number; nodes: Point[] }

/** Evenly spaced columns and the links between them. A real model uses all its neurons: there is no single route. */
function buildNetwork(stages: readonly DefenseStageId[], height = BASE_HEIGHT) {
  const space = height - TOP_SPACE - BOTTOM_SPACE
  const centerY = TOP_SPACE + space / 2
  const rowGap = Math.min(MAX_ROW_GAP, space / 2)
  const rows = stages.flatMap((id, stage) => STAGE_LAYOUT[id].rows.map(count => ({ stage, count })))
  const gap = (WIDTH - 2 * MARGIN_X) / (rows.length - 1)
  const columns: Column[] = rows.map(({ stage, count }, index) => {
    const x = MARGIN_X + index * gap
    return { stage, x, nodes: Array.from({ length: count }, (_, row) => ({ x, y: centerY + (row - (count - 1) / 2) * rowGap })) }
  })
  const edges = columns.slice(1).flatMap((target, index) => columns[index]!.nodes.flatMap(from => target.nodes.map(to => ({ from, to }))))
  return { columns, edges, height, centerY, rowGap }
}
type Network = ReturnType<typeof buildNetwork>

/** On wide screens the drawing takes all the height its window leaves it, in drawing units. */
function useDrawingHeight(box: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(BASE_HEIGHT)
  useLayoutEffect(() => {
    const node = box.current
    if (!node) return
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => {
      const { width, height: pixels } = node.getBoundingClientRect()
      setHeight(query.matches && width ? Math.max(BASE_HEIGHT, Math.round(pixels * WIDTH / width)) : BASE_HEIGHT)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    query.addEventListener('change', update)
    return () => { observer.disconnect(); query.removeEventListener('change', update) }
  }, [box])
  return height
}
const activeStages = (trace: LabTrace) => trace.filter(entry => entry.status !== 'inactive')

function NetworkPicture({ trace, network, revealed, waiting = false, moving = false, front, frontRef, pulseRef, title }: {
  trace: LabTrace; network: Network; revealed: string[]; waiting?: boolean; moving?: boolean; front: number; title: string
  frontRef?: RefObject<SVGRectElement | null>; pulseRef?: RefObject<SVGCircleElement | null>
}) {
  const stages = activeStages(trace)
  const { columns, edges, height, centerY, rowGap } = network
  return <svg className="ai-lab__network" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`Réseau des défenses : ${title}`}>
    <defs>
      <linearGradient id="ai-lab-signal" gradientUnits="userSpaceOnUse" x1={MARGIN_X} y1="0" x2={WIDTH - MARGIN_X} y2="0"><stop offset="0" stopColor="#4ade80" /><stop offset="1" stopColor="#38bdf8" /></linearGradient>
      <clipPath id="ai-lab-front"><rect ref={frontRef} x="0" y="0" width={front} height={height} /></clipPath>
    </defs>
    {edges.map(({ from, to }, index) => <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="ai-lab__edge" />)}
    {!waiting && <g clipPath="url(#ai-lab-front)">{edges.map(({ from, to }, index) => <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="ai-lab__edge-lit" />)}</g>}
    {stages.map((entry, index) => {
      const layout = STAGE_LAYOUT[entry.stage]
      const status = revealed.includes(entry.stage) ? entry.status : waiting ? 'ready' : 'not-run'
      const own = columns.filter(column => column.stage === index)
      const labelX = (own[0]!.x + own[own.length - 1]!.x) / 2
      return <g key={entry.stage} data-stage={entry.stage} data-status={status}>
        {own.flatMap(column => column.nodes.map(node => layout.check
          ? <g key={node.x}>
              <circle className="ai-lab__check" cx={node.x} cy={node.y} r={8} />
              {status === 'blocked' || status === 'error'
                ? <path className="ai-lab__check-mark" d={`M${node.x - 3} ${node.y - 3}l6 6m0-6l-6 6`} />
                : <circle cx={node.x} cy={node.y} r={2.25} />}
            </g>
          : <circle key={`${node.x}-${node.y}`} cx={node.x} cy={node.y} r={entry.stage === 'model' ? 6 : 3.5} />))}
        <text className="ai-lab__stage-name" x={labelX} y={layout.label.length > 1 ? 12 : 27} textAnchor="middle">{layout.label.map((label, line) => <tspan key={label} x={labelX} dy={line ? 15 : 0}>{label}</tspan>)}</text>
        {(status === 'blocked' || status === 'error') && <text className="ai-lab__stage-word" x={layout.check ? labelX - 4 : labelX} y={centerY + (layout.check ? 30 : rowGap + 22)} textAnchor={layout.check ? 'start' : 'middle'}>{stageStatusLabels[status]}</text>}
      </g>
    })}
    {moving && <circle ref={pulseRef} className="ai-lab__pulse" cx={MARGIN_X} cy={centerY} r={2.5} />}
  </svg>
}

/** What happens and why, in a space kept for it so nothing jumps: the current stage, then the verdict. */
function Explanation({ title, text, outcome, live = true }: { title: string; text: string; outcome?: string; live?: boolean }) {
  return <div className="ai-lab__trace-summary" data-outcome={outcome} role="status" aria-live={live ? 'polite' : 'off'}>
    <h4>{title}</h4>
    <p>{text}</p>
  </div>
}

function WaitingPicture({ trace, level }: { trace: LabTrace; level: LabLevel }) {
  const box = useRef<HTMLDivElement>(null)
  const height = useDrawingHeight(box)
  const network = useMemo(() => buildNetwork(activeStages(trace).map(entry => entry.stage), height), [trace, height])
  return <div ref={box} className="ai-lab__picture" data-playback="waiting">
    <NetworkPicture trace={trace} network={network} revealed={[]} waiting front={0} title={`niveau ${level}, en attente d’une tentative`} />
  </div>
}

function Trace({ result }: { result: LabResult }) {
  const reduced = useReducedMotion()
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false)
  const desktop = useSyncExternalStore(subscribeWidth, () => window.matchMedia('(min-width: 1024px)').matches, () => false)
  const root = useRef<HTMLDivElement>(null)
  const frontRef = useRef<SVGRectElement>(null)
  const pulseRef = useRef<SVGCircleElement>(null)
  const elapsed = useRef(0)
  const [near, setNear] = useState(false)
  const [step, setStep] = useState(0)
  const ordered = useMemo(() => result.trace.filter(entry => entry.status === 'passed' || entry.status === 'blocked' || entry.status === 'error'), [result.trace])
  const height = useDrawingHeight(root)
  const network = useMemo(() => buildNetwork(activeStages(result.trace).map(entry => entry.stage), height), [result.trace, height])
  // The front reaches each stage at its first column, and stops at the last stage it runs.
  const arrivals = useMemo(() => ordered.map((_, index) => network.columns.find(column => column.stage === index)!.x), [ordered, network])
  const stop = arrivals.at(-1) ?? MARGIN_X
  const instant = reduced || !desktop
  const shown = instant ? ordered.length : step
  const done = shown >= ordered.length
  const playing = !instant && visible && near && !done
  useEffect(() => {
    const node = root.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setNear(!!entry?.isIntersecting), { threshold: 0.15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  // Time advances only while playing, so leaving the screen or the tab freezes the signal where it is.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsed.current += now - last
      last = now
      const front = Math.min(stop, MARGIN_X + elapsed.current * SIGNAL_SPEED / 1000)
      frontRef.current?.setAttribute('width', String(front))
      pulseRef.current?.setAttribute('cx', String(front))
      setStep(arrivals.filter(x => x <= front).length)
      if (front < stop) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, stop, arrivals])
  const stage = defenseStages.find(entry => entry.id === ordered[shown - 1]?.stage)
  return <>
    <div ref={root} className="ai-lab__picture" data-playback={playing ? 'playing' : done ? 'complete' : 'suspended'} data-trace-step={shown}>
      <NetworkPicture trace={result.trace} network={network} revealed={ordered.slice(0, shown).map(entry => entry.stage)} moving={!instant && !done}
        front={done ? stop : MARGIN_X} frontRef={frontRef} pulseRef={pulseRef} title={result.title} />
    </div>
    {done ? <Explanation title={result.title} text={result.explanation} outcome={result.outcome} />
      : <Explanation title={stage?.label ?? defensePanelCopy.analysing} text={stage?.note ?? defensePanelCopy.analysing} live={false} />}
  </>
}

/** What to learn from the level. The takeaway comes once the server has validated the flag. */
function Lesson({ level, solved }: { level: LabLevel; solved: boolean }) {
  const brief = aiLabLevels[level - 1]!
  const root = useRef<HTMLDivElement>(null)
  // On short screens this block scrolls: bring the takeaway into view when it appears.
  useEffect(() => { if (solved && root.current) root.current.scrollTop = root.current.scrollHeight }, [solved])
  return <div ref={root} className="ai-lab__lesson">
    <dl>
      <div><dt>Défense en place</dt><dd>{brief.defense}</dd></div>
      <div><dt>Type d’attaque</dt><dd>{brief.attack}</dd></div>
    </dl>
    <div><h4>Comprendre</h4><p>{brief.lesson}</p></div>
    <a href={brief.reference.url} target="_blank" rel="noreferrer">{brief.reference.label}</a>
    {solved && <div data-solved="true"><h4>À retenir</h4><p>{brief.takeaway}</p></div>}
  </div>
}

/** One hint at a time, in a block that keeps its height. */
function HintCarousel({ level, hint, onHint, onUsePrompt }: { level: LabLevel; hint: number; onHint: (value: number) => void; onUsePrompt: (prompt: string) => void }) {
  const { hints } = aiLabLevels[level - 1]!
  const current = hints[hint - 1]
  return <section className="ai-lab__hints" aria-label="Indices">
    {current
      ? <p aria-live="polite"><strong>Indice {hint}/{hints.length}</strong>{current.text}</p>
      : <p aria-live="polite" className="ai-lab__hints-intro"><Sentry size={28} animated={false} /><span>{defensePanelCopy.hintsIntro}</span></p>}
    <div className="ai-lab__hints-nav">
      <button type="button" aria-label="Indice précédent" disabled={hint <= 0} onClick={() => onHint(hint - 1)}><ChevronLeft size={15} aria-hidden="true" /></button>
      {current?.prompt && <button type="button" className="ai-lab__hint-use" onClick={() => onUsePrompt(current.prompt!)}>Mettre dans le champ</button>}
      <button type="button" aria-label="Indice suivant" disabled={hint >= hints.length} onClick={() => onHint(hint + 1)}><ChevronRight size={15} aria-hidden="true" /></button>
    </div>
  </section>
}

export function DefenseDiagram({ level, result, solved, hint, onHint, onUsePrompt }: {
  level: LabLevel; result?: LabResult; solved: boolean; hint: number; onHint: (value: number) => void; onUsePrompt: (prompt: string) => void
}) {
  const [replay, setReplay] = useState(0)
  const brief = aiLabLevels[level - 1]!
  const trace: LabTrace = result?.trace ?? defenseStages.map(stage => ({ stage: stage.id, status: stage.fromLevel <= level ? 'not-run' : 'inactive' }))
  return <aside id="ai-lab-defenses" className="ai-lab__defenses" aria-label="Analyse et guide">
    <header><p><Sentry size={32} animated={false} /><span>Analyse et guide · niveau {level}</span></p>
      <button type="button" className="ai-lab__replay" disabled={!result} onClick={() => setReplay(value => value + 1)}><RotateCcw size={14} aria-hidden="true" /> Rejouer</button></header>
    <div className="ai-lab__defenses-body">
      {result ? <Trace key={`${result.id}-${replay}`} result={result} /> : <WaitingPicture trace={trace} level={level} />}
      {!result && <Explanation title={`Niveau ${level} · ${brief.title}`} text={brief.description} />}
      <Lesson level={level} solved={solved} />
      <HintCarousel level={level} hint={hint} onHint={onHint} onUsePrompt={onUsePrompt} />
      <ol className="ai-lab__stage-list" aria-label={result ? 'Étapes du dernier essai' : 'Défenses disponibles'}>{trace.filter(entry => entry.status !== 'inactive').map(entry => <li key={entry.stage} data-status={!result ? 'ready' : entry.status}>
        <span>{defenseStages.find(stage => stage.id === entry.stage)!.label}</span><span>{!result ? 'Prête' : stageStatusLabels[entry.status]}</span>
      </li>)}</ol>
    </div>
  </aside>
}
