import { Activity, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import writeupsIndex from '../../content/writeups.json'
import { CtfIntro } from './CtfIntro'
import { cx } from '../../lib/cx'
import { cyberLabCurriculum } from '../../content/cyberLab'
import { CYBER_PROGRESS_KEY, completeCyberLevel, readCyberProgress } from './ctf/cyberProgress'
import { LabCurriculumDrawer } from './LabCurriculumDrawer'
import { keepFieldClearOfPlayer } from '../../lib/keepClearOfPlayer'

// The CTF console (3,000+ lines) is fetched only when the Lab comes near the viewport.
const CtfConsole = lazy(() => import('./ctf/CtfConsole'))

const TOPICS = {
  web: { label: 'Web', title: 'Web', rule: /web/i },
  ad: { label: 'AD', title: 'Active Directory', rule: /active directory/i },
  privesc: { label: 'Privesc', title: 'Élévation de privilèges', rule: /privilege escalation/i },
  cracking: { label: 'Mots de passe', title: 'Mots de passe', rule: /cracking|password/i },
  network: { label: 'Réseau', title: 'Réseau', rule: /network/i },
  reverse: { label: 'Reverse', title: 'Rétro-ingénierie', rule: /reverse/i },
} as const
type Topic = keyof typeof TOPICS
const TOPIC_KEYS = Object.keys(TOPICS) as Topic[]

// Epitech labs were run from Exegol (the pentest environment), TryHackMe rooms on the platform.
const SOURCE_LABEL: Record<string, string> = { epitech: 'Exegol', tryhackme: 'TryHackMe' }

const writeups = writeupsIndex.writeups.map((w) => ({
  ...w,
  topics: TOPIC_KEYS.filter((k) => TOPICS[k].rule.test(`${w.focus} ${w.environment ?? ''}`)),
}))

function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: '600px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])
  return [ref, near] as const
}

/** Cyber screen kept intact while the Lab switches domains. */
export function CyberLab() {
  const [topic, setTopic] = useState<Topic | null>(null)
  const [activeLevel, setActiveLevel] = useState<number | null>(null)
  const [visited, setVisited] = useState<number[]>([])
  const [selection, setSelection] = useState(0)
  const [progress, setProgress] = useState(readCyberProgress)
  const [drawer, setDrawer] = useState(false)
  const [consoleRef, showConsole] = useNearViewport<HTMLDivElement>()
  const visible = topic ? writeups.filter((w) => w.topics.includes(topic)) : writeups

  const selectLevel = (level: number) => {
    if (!cyberLabCurriculum.some(group => group.levels.some(item => item.id === level))) return
    setVisited(previous => previous.includes(level) ? previous : [...previous, level])
    setActiveLevel(level)
    setSelection(previous => previous + 1)
  }
  const completeLevel = useCallback((level: number) => setProgress(previous => completeCyberLevel(previous, level)), [])
  useEffect(() => {
    try { localStorage.setItem(CYBER_PROGRESS_KEY, JSON.stringify(progress)) } catch { /* Keep earned progress in memory. */ }
  }, [progress])
  // The hidden sessions retain drafts, tools and pending operations; only this one receives focus.
  useEffect(() => {
    if (activeLevel === null) {
      if (selection > 0) consoleRef.current?.querySelector<HTMLElement>('[data-lab-intro-heading]')?.focus({ preventScroll: true })
      return
    }
    const id = window.setInterval(() => {
      const input = consoleRef.current?.querySelector<HTMLInputElement>(`[data-cyber-level="${activeLevel}"] input`)
      if (input) {
        input.focus({ preventScroll: true })
        window.clearInterval(id)
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [activeLevel, consoleRef, selection])

  return (
      <div className="lab-grid">
        <div className="space-y-5">
          {/* One terminal window: an intro screen (what the CTF trains), then « Commencer » opens the real console.
              Fixed height, sized to the window so the whole Lab fits on screen; the console scrolls inside. */}
          <div ref={consoleRef} onFocus={keepFieldClearOfPlayer} className="lab-terminal lab-workspace flex flex-col overflow-hidden border border-cyber/20 bg-black">
            {activeLevel === null && (
              <>
                <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900 px-3 py-2 font-mono text-[10px] tracking-widest text-white uppercase">
                  <span className="text-cyber">&gt;_</span> ctf@lab:~
                </div>
                <CtfIntro onStart={selectLevel} completed={progress.completed} />
              </>
            )}
            {showConsole && visited.map(level => <div key={level} className="lab-session" data-cyber-level={level} hidden={activeLevel !== level}>
              <Activity mode={activeLevel === level ? 'visible' : 'hidden'}>
                <Suspense fallback={<p role="status" className="p-4 text-sm text-zinc-400">Chargement du niveau…</p>}>
                  <CtfConsole initialLevel={level} onComplete={completeLevel} onPresentation={() => setActiveLevel(null)}
                    onCurriculum={() => setDrawer(previous => !previous)} curriculumOpen={drawer} completedAll={progress.completed.length === 9}
                    onNext={level < 9 ? () => selectLevel(level + 1) : undefined} />
                </Suspense>
              </Activity>
            </div>)}
            {drawer && <LabCurriculumDrawer id="cyber-lab-curriculum" title="Niveaux cybersécurité" groups={cyberLabCurriculum}
              completed={progress.completed} current={activeLevel ?? undefined}
              onClose={() => setDrawer(false)} onSelect={selectLevel} />}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xl font-bold tracking-[0.2em] text-cyber uppercase">
            Write-ups
          </p>
          {/* Topic tabs, same style as the Projects job tabs: underline and count badge. */}
          <div role="group" aria-label="Filtrer les write-ups" className="flex flex-wrap gap-x-5 gap-y-2">
            {[null, ...TOPIC_KEYS].map((k) => {
              const on = topic === k
              const count = k ? writeups.filter((w) => w.topics.includes(k)).length : writeups.length
              return (
                <button key={k ?? 'all'} type="button" aria-pressed={on} title={k ? TOPICS[k].title : undefined} aria-label={k ? `${TOPICS[k].title} (${count})` : undefined} onClick={() => setTopic(k)} className="group relative inline-flex cursor-pointer items-center gap-2 pb-2 text-[15px]">
                  <span className={on ? 'font-semibold text-white' : 'text-zinc-400 transition-colors group-hover:text-zinc-200'}>{k ? TOPICS[k].label : 'Tous'}</span>
                  <span className={cx('rounded px-1.5 text-xs tabular-nums', on ? 'bg-cyber/25 text-white' : 'bg-cyber/10 text-cyber')}>{count}</span>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-px bg-cyber transition-all duration-300" style={{ width: on ? '100%' : '0%' }} />
                </button>
              )
            })}
          </div>
          {/* Fixed height whatever the filter, so the layout does not jump; the list scrolls inside. */}
          <ul className="h-[clamp(18rem,calc(100svh-22rem),40rem)] divide-y divide-white/5 overflow-y-auto border border-white/10 bg-zinc-950/60">
            {visible.map((w) => (
              <li key={w.slug}>
                <a href={w.url} target="_blank" rel="noreferrer" className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-cyber/5">
                  <span className="text-base text-zinc-100 group-hover:text-cyber">{w.room}</span>
                  <span className="text-xs text-zinc-500">{SOURCE_LABEL[w.source] ?? w.source}</span>
                  <span className="col-span-2 text-xs text-zinc-400">{w.focus}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`https://github.com/${writeupsIndex.repo}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-cyber/30 bg-cyber/5 px-4 py-2 text-sm tracking-[0.2em] text-cyber uppercase hover:bg-cyber/10"
          >
            [ Tous les write-ups sur GitHub ↗ ]
          </a>
        </div>
      </div>
  )
}
