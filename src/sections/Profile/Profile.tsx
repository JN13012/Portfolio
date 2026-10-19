import { BadgeCheck, Download, Dumbbell, Globe, Landmark, Plane, Terminal, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import SectionHeader from '../../components/SectionHeader'
import { profile } from '../../content/profile'
import Portrait from '../../assets/Profil.webp'

const panel = 'rounded-sm border border-white/10 bg-zinc-950/60 backdrop-blur-sm shadow-[0_14px_36px_rgba(0,0,0,0.26)]'

const FLAGS: Record<string, string> = { fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', ar: '🇱🇧', de: '🇩🇪' }
const INTEREST_ICONS: Record<string, LucideIcon> = { travel: Plane, sport: Dumbbell, geopolitics: Globe, finance: Landmark }

const LINKS = [
  { label: 'GitHub', url: profile.links.github },
  { label: 'LinkedIn', url: profile.links.linkedin },
  { label: 'TryHackMe', url: profile.links.tryhackme },
  { label: 'Coursera', url: profile.links.coursera },
  { label: 'Trailblazer', url: profile.links.trailblazer },
]

function Block({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 inline-flex items-center gap-3 border border-white/10 bg-zinc-900/60 px-4 py-2">
        <Icon size={16} aria-hidden="true" className="text-cyber" />
        <span className="font-mono text-sm tracking-[0.3em] text-cyber uppercase">{title}</span>
      </h3>
      <div className={`${panel} p-5`}>{children}</div>
    </div>
  )
}

/** Profil: photo and links, presentation and at-a-glance facts, languages (CEFR, no %) and interests. */
export function Profile() {
  return (
    <section id="profile" className="scroll-mt-24 py-24">
      <SectionHeader index="01" title="Profil" />
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr_22rem]">
        <div className="space-y-5">
          <div className="relative mx-auto max-w-72">
            <div className="absolute -inset-2 border border-cyber/30" />
            <div className="absolute -top-2 -left-2 size-5 border-t-2 border-l-2 border-cyber" />
            <div className="absolute -right-2 -bottom-2 size-5 border-r-2 border-b-2 border-cyber" />
            <img loading="lazy" decoding="async" src={Portrait} alt={`${profile.firstName} ${profile.lastName}`} className="relative w-full" />
          </div>
          <ul className="grid grid-cols-5 gap-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="grid aspect-square place-items-center border border-white/10 bg-zinc-950/60 px-1 text-center font-mono text-[10px] text-zinc-300 uppercase transition-colors hover:border-cyber/50 hover:text-cyber"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.cv.url}
            download={profile.cv.fileName}
            className="flex items-center justify-center gap-2 border border-cyber/60 bg-cyber/10 py-3 font-mono tracking-[0.2em] text-cyber uppercase transition-colors hover:bg-cyber/20"
          >
            <Download size={16} aria-hidden="true" /> CV (.pdf)
          </a>
        </div>

        <div className="space-y-8">
          <Block icon={Terminal} title="Présentation">
            <div className="space-y-3 font-mono text-[15px] leading-relaxed text-zinc-200">
              {profile.about.map((p) => (
                <p key={p.fr}>{p.fr}</p>
              ))}
            </div>
          </Block>
          <Block icon={BadgeCheck} title="En bref">
            <dl className="grid gap-x-6 gap-y-3 font-mono text-[15px] sm:grid-cols-2">
              {profile.facts.map((f) => (
                <div key={f.label.fr} className="border-b border-white/5 pb-2">
                  <dt className="text-xs tracking-widest text-zinc-500 uppercase">{f.label.fr}</dt>
                  <dd className="text-zinc-100">{f.value.fr}</dd>
                </div>
              ))}
            </dl>
          </Block>
        </div>

        <div className="space-y-8">
          <Block icon={Globe} title="Langues">
            <ul className="space-y-2.5 font-mono text-[15px]">
              {profile.languages.map((l) => (
                <li key={l.code} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0">
                  <span className="text-zinc-100">
                    <span aria-hidden="true" className="mr-2">
                      {FLAGS[l.code]}
                    </span>
                    {l.name.fr}
                  </span>
                  <span className="text-right text-xs text-cyber">
                    {l.level === 'native' ? 'Natif' : l.level}
                    {l.note && ` · ${l.note.fr}`}
                  </span>
                </li>
              ))}
            </ul>
          </Block>
          <Block icon={Plane} title="Centres d’intérêt">
            <ul className="grid grid-cols-4 gap-2">
              {profile.interests.map((i) => {
                const Icon = INTEREST_ICONS[i.id] ?? Globe
                return (
                  <li key={i.id} className="flex flex-col items-center gap-1.5 border border-white/5 py-3 text-zinc-400 transition-colors hover:text-cyber">
                    <Icon size={22} aria-hidden="true" />
                    <span className="font-mono text-[11px] text-zinc-200 uppercase">{i.label.fr}</span>
                  </li>
                )
              })}
            </ul>
          </Block>
        </div>
      </div>
    </section>
  )
}
