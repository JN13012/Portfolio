import { Activity, lazy, Suspense, useState } from 'react'
import SectionHeader from '../../components/ui/SectionHeader'
import { CyberLab } from './CyberLab'
import { LabConstructionNotice } from './LabConstructionNotice'
import './lab.css'

// The preview and its fixtures are eliminated from the production build.
const AiLab = import.meta.env.DEV ? lazy(() => import('./ia/AiLab')) : null
const preview = import.meta.env.DEV
const startInIa = preview && new URLSearchParams(window.location.search).get('lab') === 'ia'

/** Domain selection preserves each screen's state and suspends the hidden screen's effects. */
export function Lab() {
  const [domain, setDomain] = useState<'cyber' | 'ia'>(startInIa ? 'ia' : 'cyber')
  const [visitedCyber, setVisitedCyber] = useState(!startInIa)
  const [visitedIa, setVisitedIa] = useState(startInIa)
  return (
    <section id="lab" className="py-24">
      {preview && domain === 'ia' && <LabConstructionNotice />}
      <SectionHeader index="04" title="Lab" />
      <div role="group" aria-label="Domaine du Lab" className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 pb-2">
        <button type="button" aria-pressed={domain === 'cyber'} onClick={() => { setVisitedCyber(true); setDomain('cyber') }} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
          <span className={domain === 'cyber' ? 'bg-[linear-gradient(90deg,#f43f5e_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>Cyber</span>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-[#f43f5e]" style={{ width: domain === 'cyber' ? '100%' : 0 }} />
        </button>
        <button type="button" disabled={!preview} aria-pressed={domain === 'ia'} onClick={() => { setVisitedIa(true); setDomain('ia') }} className={`group relative inline-flex items-center gap-2 pb-2.5 text-lg ${preview ? 'cursor-pointer' : 'cursor-not-allowed text-zinc-600'}`}>
          <span className={domain === 'ia' ? 'bg-[linear-gradient(90deg,#38bdf8_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : preview ? 'text-zinc-400 transition-colors group-hover:text-zinc-200' : undefined}>IA</span>
          {!preview && <span className="sr-only"> — À venir</span>}
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-400" style={{ width: domain === 'ia' ? '100%' : 0 }} />
        </button>
      </div>
      {visitedCyber && <div className="lab-panel" hidden={domain !== 'cyber'}><Activity mode={domain === 'cyber' ? 'visible' : 'hidden'}><CyberLab /></Activity></div>}
      {preview && visitedIa && AiLab && <div className="lab-panel" hidden={domain !== 'ia'}><Activity mode={domain === 'ia' ? 'visible' : 'hidden'}>
        <Suspense fallback={<p className="text-sm text-zinc-400" role="status">Chargement de l’aperçu IA…</p>}><AiLab /></Suspense>
      </Activity></div>}
    </section>
  )
}
