import { AudioLines, BadgeCheck, BrainCircuit, Crosshair, Download, Globe, Mail, MapPin, ShieldCheck, type LucideIcon } from 'lucide-react'
import { hero } from '../../content/hero'
import { profile } from '../../content/profile'
import Coursera from '../../assets/COURSERA.webp'
import THM from '../../assets/THM.jpg'
import Epitech from '../../assets/Formations/Epitech.webp'
import { NeuralHero } from './core/NeuralHero'

const panel = 'rounded-sm border border-white/10 bg-zinc-950/60 backdrop-blur-sm shadow-[0_14px_36px_rgba(0,0,0,0.26)]'
const LOGOS: Record<string, string> = { ibm: Coursera, thm: THM, epitech: Epitech }
const STRIP_ICONS: Record<string, LucideIcon> = { globe: Globe, badge: BadgeCheck, brain: BrainCircuit, shield: ShieldCheck, target: Crosshair }
const TONE: Record<string, string> = { ai: 'text-sky-400', threat: 'text-rose-500' }

/** Hero: who, which jobs, proof, availability and CTAs on the left; the neural network (navigation) on the right. */
export function Hero() {
  return (
    <section id="acceuil" aria-labelledby="hero-title" className="relative flex min-h-screen flex-col justify-center gap-10 pt-28 pb-10 lg:pb-32">
      <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-6">
          <p className="text-sm tracking-[0.3em] text-cyber uppercase">&gt; whoami</p>
          <h1 id="hero-title" className="text-6xl leading-none font-bold tracking-tight text-white uppercase md:text-8xl">
            {profile.lastName} <span className="text-cyber">{profile.firstName}</span>
          </h1>
          <p className="text-2xl font-bold tracking-tight uppercase md:text-3xl">
            {hero.title.map((part, i) => (
              <span key={part.text.fr}>
                {i > 0 && <span className="text-zinc-600"> · </span>}
                <span className={TONE[part.tone]}>{part.text.fr}</span>
              </span>
            ))}
          </p>
          <p className="max-w-2xl border-l-2 border-cyber/80 pl-4 text-xl text-zinc-200">{hero.pitch.fr}</p>

          <ul className="flex flex-wrap gap-3">
            {hero.certificates.map((c) => (
              <li key={c.id} className={`${panel} flex items-center gap-3 px-3 py-2.5`}>
                <img src={LOGOS[c.id]} alt="" className="size-10 rounded-sm object-cover" />
                <div>
                  <p className="text-[15px] text-zinc-100">{c.title}</p>
                  <p className="text-xs text-zinc-400">{c.sub.fr}</p>
                </div>
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-zinc-300">
            <li className="inline-flex items-center gap-2 text-zinc-100">
              <span aria-hidden="true" className="size-2.5 animate-pulse rounded-full bg-cyber shadow-[0_0_12px_var(--color-cyber)]" />
              {profile.availability.fr}
            </li>
            {profile.seeking.map((s) => (
              <li key={s.fr}>{s.fr}</li>
            ))}
            <li className="inline-flex items-center gap-1.5">
              <MapPin size={15} aria-hidden="true" /> {profile.location.fr}
            </li>
          </ul>

          <div className="flex flex-wrap gap-4">
            <a
              href={profile.cv.url}
              download={profile.cv.fileName}
              className="inline-flex items-center gap-3 border border-cyber/60 bg-cyber/10 px-6 py-3.5 text-base tracking-[0.2em] text-cyber uppercase transition-colors hover:bg-cyber/20"
            >
              <Download size={18} aria-hidden="true" /> {hero.ctaCv.fr}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 border border-white/20 px-6 py-3.5 text-base tracking-[0.2em] text-zinc-100 uppercase transition-colors hover:border-white/40"
            >
              <Mail size={18} aria-hidden="true" /> {hero.ctaContact.fr}
            </a>
          </div>

          {/* Cloned-voice introduction (V1.1): reserved spot, disabled until the audio exists. */}
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-3 border border-white/10 px-4 py-2.5 text-sm tracking-[0.2em] text-zinc-500 uppercase"
          >
            <AudioLines size={16} aria-hidden="true" /> {hero.voice.fr} <span className="text-[10px] text-zinc-600">· {hero.voiceSoon.fr}</span>
          </button>
        </div>

        {/* Desktop only: on small screens the menu handles navigation and the diagram would be unreadable. */}
        <NeuralHero className="mx-auto hidden w-full max-w-[min(40rem,80vh)] lg:block" />
      </div>

      <ul className={`${panel} absolute right-0 bottom-6 left-0 hidden flex-wrap justify-between gap-4 px-6 py-4 lg:flex`}>
        {hero.strip.map((f) => {
          const Icon = STRIP_ICONS[f.icon] ?? Globe
          return (
            <li key={f.text.fr} className="inline-flex items-center gap-2.5 text-[15px] text-zinc-200">
              <Icon size={18} aria-hidden="true" className="text-cyber" /> {f.text.fr}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
