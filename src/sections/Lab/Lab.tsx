import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import SectionHeader from '../../components/SectionHeader'
import writeupsIndex from '../../content/writeups.json'
import { cx } from '../../lib/cx'

// The CTF console (3,000+ lines) is fetched only when the Lab comes near the viewport.
const ProfileConsole = lazy(() => import('../../components/ProfileConsole/ProfileConsole'))

const TOPICS = {
  web: { label: 'Web', rule: /web/i },
  ad: { label: 'Active Directory', rule: /active directory/i },
  privesc: { label: 'Élévation de privilèges', rule: /privilege escalation/i },
  cracking: { label: 'Mots de passe', rule: /cracking|password/i },
  network: { label: 'Réseau', rule: /network/i },
  reverse: { label: 'Rétro-ingénierie', rule: /reverse/i },
} as const
type Topic = keyof typeof TOPICS
const TOPIC_KEYS = Object.keys(TOPICS) as Topic[]

const SOURCE_LABEL: Record<string, string> = { epitech: 'Epitech', tryhackme: 'TryHackMe' }

const writeups = writeupsIndex.writeups.map((w) => ({
  ...w,
  topics: TOPIC_KEYS.filter((k) => TOPICS[k].rule.test(`${w.focus} ${w.environment ?? ''}`)),
}))

const CTF_SKILLS = [
  'Système Linux & recherche de fichiers',
  'Réseaux TCP/IP & services exposés',
  'Scan, énumération & reconnaissance',
  'Exploitation web & injection SQL',
  'Cassage de hashs & accès SSH',
  'Exploitation système & élévation de privilèges',
  'Analyse SIEM & corrélation de logs',
  'Forensique, investigation & confinement',
  'Durcissement : WAF, firewall & IDS',
]

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
  const [consoleRef, showConsole] = useNearViewport<HTMLDivElement>()
  const visible = topic ? writeups.filter((w) => w.topics.includes(topic)) : writeups

  return (
    <section id="lab" className="scroll-mt-24 py-24">
      <SectionHeader index="04" title="Lab" />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-5">
          <div className="space-y-4 border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-sm">
            <p className="font-mono text-xl font-bold tracking-[0.2em] text-cyber uppercase">CTF en 9 niveaux</p>
            <p className="font-mono text-base text-zinc-100">
              Un environnement d’entraînement jouable ici même. Tapez <span className="text-cyber">help</span> pour commencer ; le premier indice se cache dans le code source de la page.
            </p>
            <ol className="grid gap-1.5 font-mono text-sm text-zinc-300 sm:grid-cols-2">
              {CTF_SKILLS.map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="text-cyber">[{String(i + 1).padStart(2, '0')}]</span> {s}
                </li>
              ))}
            </ol>
          </div>
          <div ref={consoleRef} className="min-h-[34rem] overflow-hidden border border-cyber/20 bg-black">
            {showConsole && (
              <Suspense fallback={null}>
                <ProfileConsole />
              </Suspense>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-xl font-bold tracking-[0.2em] text-cyber uppercase">
            Write-ups <span className="text-zinc-500">· {visible.length}</span>
          </p>
          <p className="font-mono text-sm text-zinc-400">
            Rapports de tests d’intrusion publiés sur GitHub : méthode complète, de la reconnaissance au résultat, et enseignements.
          </p>
          <div role="group" aria-label="Filtrer les write-ups" className="flex flex-wrap gap-2">
            {[null, ...TOPIC_KEYS].map((k) => (
              <button
                key={k ?? 'all'}
                type="button"
                aria-pressed={topic === k}
                onClick={() => setTopic(k)}
                className={cx(
                  'border px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-all',
                  topic === k ? 'border-cyber bg-cyber text-black' : 'border-white/15 bg-white/5 text-zinc-400 hover:text-zinc-100',
                )}
              >
                {k ? TOPICS[k].label : 'Tous'}
              </button>
            ))}
          </div>
          <ul className="max-h-[40rem] divide-y divide-white/5 overflow-y-auto border border-white/10 bg-zinc-950/60">
            {visible.map((w) => (
              <li key={w.slug}>
                <a href={w.url} target="_blank" rel="noreferrer" className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-cyber/5">
                  <span className="font-mono text-base text-zinc-100 group-hover:text-cyber">{w.room}</span>
                  <span className="font-mono text-xs text-zinc-500">{SOURCE_LABEL[w.source] ?? w.source}</span>
                  <span className="col-span-2 font-mono text-xs text-zinc-400">{w.focus}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`https://github.com/${writeupsIndex.repo}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block border border-cyber/30 bg-cyber/5 px-4 py-2 font-mono text-sm tracking-[0.2em] text-cyber uppercase hover:bg-cyber/10"
          >
            [ Tous les write-ups sur GitHub ↗ ]
          </a>
        </div>
      </div>
    </section>
  )
}
