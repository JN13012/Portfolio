import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import SectionHeader from '../../components/SectionHeader'
import writeupsIndex from '../../content/writeups.json'
import { CtfIntro } from './CtfIntro'
import { cx } from '../../lib/cx'

// The CTF console (3,000+ lines) is fetched only when the Lab comes near the viewport.
const ProfileConsole = lazy(() => import('../../components/ProfileConsole/ProfileConsole'))

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

/** Lab: the 9-level CTF (moved out of the hero) and the index of the published write-ups. */
export function Lab() {
  const [topic, setTopic] = useState<Topic | null>(null)
  const [started, setStarted] = useState(false)
  const [consoleRef, showConsole] = useNearViewport<HTMLDivElement>()
  const visible = topic ? writeups.filter((w) => w.topics.includes(topic)) : writeups

  // After « Commencer », put the cursor in the console once it has loaded.
  useEffect(() => {
    if (!started) return
    const id = window.setInterval(() => {
      const input = document.querySelector<HTMLInputElement>('#lab input')
      if (input) {
        input.focus({ preventScroll: true })
        window.clearInterval(id)
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [started])

  return (
    <section id="lab" className="py-24">
      <SectionHeader index="04" title="Lab" />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-5">
          {/* One terminal window: an intro screen (what the CTF trains), then « Commencer » opens the real console.
              Fixed height, sized to the window so the whole Lab fits on screen; the console scrolls inside. */}
          <div ref={consoleRef} className="flex h-[clamp(26rem,calc(100svh-12rem),46rem)] flex-col overflow-hidden border border-cyber/20 bg-black">
            {started ? (
              showConsole && (
                <Suspense fallback={null}>
                  <ProfileConsole />
                </Suspense>
              )
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900 px-3 py-2 font-mono text-[10px] tracking-widest text-white uppercase">
                  <span className="text-cyber">&gt;_</span> ctf@lab:~
                </div>
                <CtfIntro onStart={() => setStarted(true)} />
              </>
            )}
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
    </section>
  )
}
