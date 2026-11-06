import { Activity, lazy, Suspense, useEffect, useState } from 'react'
import SectionHeader from '../../components/ui/SectionHeader'
import { blockchainLab } from '../../content/lab/blockchain'
import { ctfSection } from '../../content/lab'
import { tracksFromSearch } from '../../lib/projects'
import { CyberLab } from './cyber/CyberLab'
import './lab.css'

const AiLab = lazy(() => import('./ia/AiLab'))
// The EVM and the compiled contracts load only when the Blockchain tab is opened.
const BlockchainLab = lazy(() => import('./blockchain/BlockchainLab'))
// ?lab= or a #lab-… link choose the CTF; otherwise a targeted link (?metier=ia|blockchain) opens that job's CTF.
const startParam = new URLSearchParams(window.location.search).get('lab')
const job = tracksFromSearch(window.location.search)[0]
const explicit = startParam !== null || window.location.hash === '#lab-ia' || window.location.hash === '#lab-blockchain'
const startInIa = startParam === 'ia' || window.location.hash === '#lab-ia' || (!explicit && job === 'ia')
const startInChain = startParam === 'blockchain' || window.location.hash === '#lab-blockchain' || (!explicit && job === 'blockchain')

/** Domain selection preserves each screen's state and suspends the hidden screen's effects. */
export function Lab() {
  const [domain, setDomain] = useState<'cyber' | 'ia' | 'blockchain'>(startInIa ? 'ia' : startInChain ? 'blockchain' : 'cyber')
  const [visitedCyber, setVisitedCyber] = useState(!startInIa && !startInChain)
  const [visitedIa, setVisitedIa] = useState(startInIa)
  const [visitedChain, setVisitedChain] = useState(startInChain)
  // Links to #lab-ia or #lab-blockchain, such as the Hero's panels, open that side, even when the hash is already in the address.
  useEffect(() => {
    const openIa = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest('a[href="#lab-ia"]')) { setVisitedIa(true); setDomain('ia') }
      if (event.target.closest('a[href="#lab-blockchain"]')) { setVisitedChain(true); setDomain('blockchain') }
    }
    document.addEventListener('click', openIa)
    return () => document.removeEventListener('click', openIa)
  }, [])
  return (
    <section id="lab" className="py-24">
      <SectionHeader index="03" title={ctfSection.title} />
      {/* Anchor of the Hero's blockchain panel; #lab-ia is the tab group itself. */}
      <span id="lab-blockchain" aria-hidden="true" className="block scroll-mt-24" />
      <div id="lab-ia" role="group" aria-label={ctfSection.domains} className="mb-6 scroll-mt-24 flex flex-wrap items-center gap-x-8 gap-y-3 pb-2">
        <button type="button" aria-pressed={domain === 'cyber'} onClick={() => { setVisitedCyber(true); setDomain('cyber') }} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
          <span className={domain === 'cyber' ? 'bg-[linear-gradient(90deg,#f43f5e_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>Cyber</span>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-[#f43f5e]" style={{ width: domain === 'cyber' ? '100%' : 0 }} />
        </button>
        <button type="button" aria-pressed={domain === 'ia'} onClick={() => { setVisitedIa(true); setDomain('ia') }} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
          <span className={domain === 'ia' ? 'bg-[linear-gradient(90deg,#38bdf8_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>IA</span>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-sky-400" style={{ width: domain === 'ia' ? '100%' : 0 }} />
        </button>
        <button type="button" aria-pressed={domain === 'blockchain'} onClick={() => { setVisitedChain(true); setDomain('blockchain') }} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2.5 text-lg">
          <span className={domain === 'blockchain' ? 'bg-[linear-gradient(90deg,#a78bfa_10%,#fff_115%)] bg-clip-text font-semibold text-transparent' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>{blockchainLab.tab}</span>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 rounded-full bg-violet-400" style={{ width: domain === 'blockchain' ? '100%' : 0 }} />
        </button>
      </div>
      {visitedCyber && <div className="lab-panel" hidden={domain !== 'cyber'}><Activity mode={domain === 'cyber' ? 'visible' : 'hidden'}><CyberLab /></Activity></div>}
      {visitedIa && <div className="lab-panel" hidden={domain !== 'ia'}><Activity mode={domain === 'ia' ? 'visible' : 'hidden'}>
        <Suspense fallback={<p className="text-sm text-zinc-400" role="status">{ctfSection.loadingIa}</p>}><AiLab /></Suspense>
      </Activity></div>}
      {visitedChain && <div className="lab-panel" hidden={domain !== 'blockchain'}><Activity mode={domain === 'blockchain' ? 'visible' : 'hidden'}>
        <Suspense fallback={<p className="text-sm text-zinc-400" role="status">{blockchainLab.loading}</p>}><BlockchainLab /></Suspense>
      </Activity></div>}
    </section>
  )
}
