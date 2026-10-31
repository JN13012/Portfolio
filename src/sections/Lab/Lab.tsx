import { Activity, lazy, Suspense, useEffect, useState } from 'react'
import SectionHeader from '../../components/ui/SectionHeader'
import { CyberLab } from './CyberLab'
import './lab.css'

const AiLab = lazy(() => import('./ia/AiLab'))
const startInIa = new URLSearchParams(window.location.search).get('lab') === 'ia' || window.location.hash === '#lab-ia'

/** Domain selection preserves each screen's state and suspends the hidden screen's effects. */
export function Lab() {
  const [domain, setDomain] = useState<'cyber' | 'ia'>(startInIa ? 'ia' : 'cyber')
  const [visitedCyber, setVisitedCyber] = useState(!startInIa)
  const [visitedIa, setVisitedIa] = useState(startInIa)
  // Links to #lab-ia, such as the Hero's panel, open the AI side, even when that hash is already in the address.
  useEffect(() => {
    const openIa = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('a[href="#lab-ia"]')) return
      setVisitedIa(true)
      setDomain('ia')
    }
    document.addEventListener('click', openIa)
    return () => document.removeEventListener('click', openIa)
  }, [])
  return (
    <section id="lab" className="py-24">
      <SectionHeader index="04" title="Lab" />
      <div id="lab-ia" role="group" aria-label="Domaine du Lab" className="mb-6 scroll-mt-24 flex flex-wrap items-center gap-x-8 gap-y-3 pb-2">
        <button type="button" aria-pressed={domain === 'cyber'} onClick={() => { setVisitedCyber(true); setDomain('cyber') }} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
          <span className={domain === 'cyber' ? 'bg-[linear-gradient(90deg,#f43f5e_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>Cyber</span>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-[#f43f5e]" style={{ width: domain === 'cyber' ? '100%' : 0 }} />
        </button>
        <button type="button" aria-pressed={domain === 'ia'} onClick={() => { setVisitedIa(true); setDomain('ia') }} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
          <span className={domain === 'ia' ? 'bg-[linear-gradient(90deg,#38bdf8_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>IA</span>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-400" style={{ width: domain === 'ia' ? '100%' : 0 }} />
        </button>
      </div>
      {visitedCyber && <div className="lab-panel" hidden={domain !== 'cyber'}><Activity mode={domain === 'cyber' ? 'visible' : 'hidden'}><CyberLab /></Activity></div>}
      {visitedIa && <div className="lab-panel" hidden={domain !== 'ia'}><Activity mode={domain === 'ia' ? 'visible' : 'hidden'}>
        <Suspense fallback={<p className="text-sm text-zinc-400" role="status">Chargement du Lab IA…</p>}><AiLab /></Suspense>
      </Activity></div>}
    </section>
  )
}
