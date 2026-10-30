import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { RotateCcw } from 'lucide-react'
import { defenseStages, type LabLevel } from '../../../content/aiLab'
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
const nodes = [1, 3, 2, 4, 2, 2, 1].map((count, layer) => Array.from({ length: count }, (_, index) => ({ x: 35 + layer * 88, y: 135 + (index - (count - 1) / 2) * 52 })))
const shortLabels = [['Entrée'], ['Filtre', 'd’entrée'], ['Instructions'], ['Modèle'], ['Filtre', 'de sortie'], ['Juge IA'], ['Réponse']]

function NetworkPicture({ trace, revealed, current, waiting = false, title }: { trace: LabTrace; revealed: string[]; current?: string; waiting?: boolean; title: string }) {
  return <svg className="ai-lab__network" viewBox="0 0 600 275" role="img" aria-label={`Illustration des défenses : ${title}`}>
    {nodes.slice(1).flatMap((layer, index) => layer.flatMap((target, b) => nodes[index]!.map((source, a) => <line key={`${index}-${a}-${b}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} className="ai-lab__edge" data-traversed={revealed.includes(trace[index + 1]!.stage)} />)))}
    {nodes.map((layer, index) => {
      const entry = trace[index]!
      const status = revealed.includes(entry.stage) ? entry.status : entry.status === 'inactive' ? 'inactive' : waiting ? 'ready' : 'not-run'
      return <g key={entry.stage} data-stage={entry.stage} data-status={status} data-current={current === entry.stage}>
        {layer.map((node, i) => <circle key={i} cx={node.x} cy={node.y} r={index === 0 || index === 6 ? 7 : 5} />)}
        <text x={layer[0]!.x} y="245" textAnchor="middle">{shortLabels[index]!.map((label, line) => <tspan key={label} x={layer[0]!.x} dy={line ? 13 : 0}>{label}</tspan>)}</text>
      </g>
    })}
  </svg>
}

function Trace({ result }: { result: LabResult }) {
  const reduced = useReducedMotion()
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false)
  const desktop = useSyncExternalStore(subscribeWidth, () => window.matchMedia('(min-width: 1024px)').matches, () => false)
  const root = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [step, setStep] = useState(0)
  const ordered = result.trace.filter(entry => entry.status === 'passed' || entry.status === 'blocked' || entry.status === 'error')
  const instant = reduced || !desktop
  const shown = instant ? ordered.length : step
  const playing = !instant && visible && near && step < ordered.length
  useEffect(() => {
    const node = root.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setNear(!!entry?.isIntersecting), { threshold: 0.15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setStep(previous => previous + 1), 420)
    return () => window.clearTimeout(timer)
  }, [playing, step])
  const current = ordered[shown - 1]?.stage
  return <div ref={root} data-playback={playing ? 'playing' : shown >= ordered.length ? 'complete' : 'suspended'} data-trace-step={shown}>
    <NetworkPicture trace={result.trace} revealed={ordered.slice(0, shown).map(entry => entry.stage)} current={current} title={result.title} />
    <p className="ai-lab__diagram-caption">Illustration du parcours de traitement · reconstitution d’un exemple</p>
  </div>
}

export function DefenseDiagram({ level, result }: { level: LabLevel; result?: LabResult }) {
  const [replay, setReplay] = useState(0)
  const trace: LabTrace = result?.trace ?? defenseStages.map(stage => ({ stage: stage.id, status: stage.fromLevel <= level ? 'not-run' : 'inactive' }))
  return <aside className="ai-lab__defenses" aria-label="Défenses de Sentry">
    <header><p className="ai-lab__eyebrow">Défenses de Sentry · niveau {level}</p><span>Simulation</span></header>
    {result ? <Trace key={`${result.id}-${replay}`} result={result} /> : <div data-playback="waiting"><NetworkPicture trace={trace} revealed={[]} waiting title={`niveau ${level}, en attente d’une tentative`} /><p className="ai-lab__diagram-caption">Parcours de traitement · protections actives en bleu</p></div>}
    <div className="ai-lab__trace-summary" role="status"><h4>{result ? result.title : `Les défenses du niveau ${level}`}</h4><p>{result ? result.explanation : 'Chaque tentative suivra ce parcours. Les protections des niveaux suivants restent atténuées.'}</p></div>
    <ol className="ai-lab__stage-list" aria-label={result ? 'Étapes du dernier exemple' : 'Défenses disponibles'}>{trace.map((entry, index) => <li key={entry.stage} data-status={!result && entry.status === 'not-run' ? 'ready' : entry.status}>
      <span>{defenseStages[index]!.label}</span><span>{!result ? entry.status === 'inactive' ? `Niveau ${defenseStages[index]!.fromLevel}` : 'Prête' : stageStatusLabels[entry.status]}</span>
    </li>)}</ol>
    <button type="button" className="ai-lab__replay" disabled={!result} onClick={() => setReplay(value => value + 1)}><RotateCcw size={14} aria-hidden="true" /> Rejouer le parcours</button>
    <p className="ai-lab__footnote">Le dessin illustre les étapes de l’application, pas les neurones ni le raisonnement interne d’un modèle.</p>
  </aside>
}
