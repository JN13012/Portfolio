import { Sentry } from '../../../components/Sentry'
import { aiLabIdle } from '../../../content/lab/ai'

/** Shown instead of the analysis window while no level is open: nothing here belongs to a level yet. */
export function AiLabIdle() {
  return <aside className="ai-lab__defenses" aria-label={aiLabIdle.heading}>
    <header><p><Sentry size={32} animated={false} /><span>{aiLabIdle.heading}</span></p></header>
    <div className="ai-lab__idle">
      <div className="ai-lab__idle-title">
        <Sentry size={120} animated={false} />
        <h3>{aiLabIdle.title}</h3>
      </div>
      <p>{aiLabIdle.intro}</p>
      <dl>{aiLabIdle.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
      <p>{aiLabIdle.next}</p>
    </div>
  </aside>
}
