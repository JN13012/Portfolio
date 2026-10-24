import { useState } from 'react'
import {
  siExpress,
  siGithubactions,
  siGradio,
  siHuggingface,
  siJest,
  siKubernetes,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siPytest,
  siRedis,
  siSalesforce,
  siSpacy,
  siTypescript,
  siVitest,
  type SimpleIcon,
} from 'simple-icons'
import SectionHeader from '../../components/SectionHeader'
import { TOOL_ICONS } from './toolIcons'
import { expertise, type ExpertiseDomain } from '../../content/expertise'
import { emblem } from './emblems'
import { cx } from '../../lib/cx'

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

// Logos: the colour icons first, then Simple Icons (CC0), then drawn emblems, else a monogram.
const PNG: Record<string, string> = Object.fromEntries(Object.entries(TOOL_ICONS).map(([k, v]) => [key(k), v]))
const SVG: Record<string, SimpleIcon> = {
  huggingfacetransformers: siHuggingface,
  gradio: siGradio,
  spacy: siSpacy,
  kubernetes: siKubernetes,
  githubactions: siGithubactions,
  vitest: siVitest,
  jest: siJest,
  pytest: siPytest,
  typescript: siTypescript,
  apex: siSalesforce,
  nextjs: siNextdotjs,
  nestjs: siNestjs,
  express: siExpress,
  prisma: siPrisma,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  redis: siRedis,
}

/** accent: lines, glows; text: a brighter shade of the accent, readable as text on the dark page. */
const HUE: Record<ExpertiseDomain['id'], { accent: string; text: string }> = {
  ia: { accent: '#818cf8', text: '#a5b4fc' },
  offensive: { accent: '#ef4444', text: '#f87171' },
  defensive: { accent: '#2563eb', text: '#60a5fa' },
  devops: { accent: '#f59e0b', text: '#fbbf24' },
  dev: { accent: '#22c55e', text: '#4ade80' },
}

/** Brand colours too dark for a dark card are drawn light instead. */
const readable = (hex: string) => {
  const n = parseInt(hex, 16)
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return l < 0.32 ? '#e4e4e7' : `#${hex}`
}

export function Logo({ name, size, className, tone = '#a1a1aa' }: { name: string; size: number; className?: string; tone?: string }) {
  const k = key(name)
  if (PNG[k]) return <img src={PNG[k]} alt="" loading="lazy" decoding="async" draggable={false} className={cx('object-contain', className)} style={{ width: size, height: size }} />
  const icon = SVG[k]
  if (icon)
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={{ width: size * 0.82, height: size * 0.82 }}>
        <path d={icon.path} fill={readable(icon.hex)} />
      </svg>
    )
  const drawn = emblem(name, size, tone, className)
  if (drawn) return drawn
  const letters = name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean)
  const mono = (letters.length > 1 ? letters[0]![0]! + letters[1]![0]! : name.slice(0, 2)).toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={cx('grid place-items-center rounded-2xl border font-semibold tracking-wide', className)}
      style={{ width: size * 0.74, height: size * 0.74, fontSize: size * 0.26, color: tone, borderColor: `${tone}55`, background: `linear-gradient(160deg, ${tone}22, ${tone}08)` }}
    >
      {mono}
    </span>
  )
}

/**
 * Expertise: the domain list on the left chooses the domain; all its tools show in a grid on the right.
 */
export function Expertise() {
  const [active, setActive] = useState(0)
  const domain = expertise[active]!
  return (
    <section id="competences" className="scroll-mt-24 py-24">
      <SectionHeader index="02" title="Expertise" />
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:items-center">
        <RailHeaders active={active} onSelect={setActive} />
        <div className="min-w-0">
          <ToolGrid key={domain.id} domain={domain} />
        </div>
      </div>
    </section>
  )
}

type HeaderProps = { active: number; onSelect: (i: number) => void }

/**
 * Rail: a vertical list on the left, the logos on the right. The active domain is tinted in its
 * colour: a coloured line, and the name in a gradient from a light tint of the colour to white.
 */
function RailHeaders({ active, onSelect }: HeaderProps) {
  return (
    <div role="group" aria-label="Domaines" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {expertise.map((d, i) => {
        const on = i === active
        const { accent, text } = HUE[d.id]
        return (
          <button
            key={d.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(i)}
            className="group relative flex shrink-0 items-center gap-3.5 rounded-lg py-3.5 pr-4 pl-4 text-left"
          >
            <span className={cx('relative text-xs tabular-nums transition-colors', on ? 'text-zinc-300' : 'text-zinc-600')}>{String(i + 1).padStart(2, '0')}</span>
            <span
              aria-hidden="true"
              className={cx('relative h-0.5 shrink-0 rounded-full transition-all duration-500', on ? 'w-8' : 'w-3 bg-zinc-600 group-hover:w-5 group-hover:bg-zinc-400')}
              style={on ? { background: accent } : undefined}
            />
            <span
              className={cx('relative mr-auto text-[17px] whitespace-nowrap transition-all duration-300', on ? 'font-semibold' : 'font-medium text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-200')}
              // Sized to the word, so short and long names get the same gradient (colour, then towards white).
              style={on ? { backgroundImage: `linear-gradient(90deg, ${text} 10%, #ffffff 115%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : undefined}
            >
              {d.label.fr}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Tool grid: every tool of the domain at once, each tile with its logo, name and use, so nothing
 * depends on hovering (and nothing floats away from its tile). Incomplete rows are centred.
 */
function ToolGrid({ domain }: { domain: ExpertiseDomain }) {
  const { accent } = HUE[domain.id]
  return (
    <ul aria-label={`Outils · ${domain.label.fr}`} className="flex animate-[fadeIn_400ms_ease-out_both] flex-wrap justify-center gap-3">
      {domain.tools.map((t) => (
        <li
          key={t.name}
          className="group flex w-[calc((100%-1.5rem)/3)] flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-zinc-950/45 px-3 pt-5 pb-4 text-center transition-all duration-300 hover:-translate-y-0.5 sm:w-[calc((100%-3rem)/5)]"
          style={{ ['--accent' as string]: accent }}
        >
          <span className="grid h-[68px] place-items-center transition-transform duration-300 group-hover:scale-110">
            <Logo name={t.name} size={68} tone={accent} />
          </span>
          <span className="text-sm font-semibold text-zinc-100">{t.name}</span>
          <span className="text-xs leading-snug text-zinc-400">{t.note.fr}</span>
          <span aria-hidden="true" className="mt-auto h-0.5 w-6 rounded-full opacity-40 transition-all duration-300 group-hover:w-10 group-hover:opacity-100" style={{ background: accent }} />
        </li>
      ))}
    </ul>
  )
}
