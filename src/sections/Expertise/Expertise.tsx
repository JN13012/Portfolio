import { useState } from 'react'
import SectionHeader from '../../components/ui/SectionHeader'
import { ToolLogo } from '../../components/ui/ToolLogo/ToolLogo'
import { normalizeToolName } from '../../components/ui/ToolLogo/logoRegistry'
import { orderedDomains, type ExpertiseDomain } from '../../content/expertise'
import { tracksFromSearch } from '../../lib/projects'
import { cx } from '../../lib/cx'

/** Logos drawn small inside their image (wide wordmarks, padding) are scaled up to match the others. */
const ICON_SCALE: Record<string, number> = {
  // Wide wordmarks fill the width before the height.
  splunk: 1.3,
  snort: 1.25,
  remnux: 1.25,
  sqlmap: 1.15,
  spacy: 1.3,
  scikitlearn: 1.3,
  ffuf: 1.35,
  evilwinrm: 1.45,
  // Thin drawn emblems.
  faiss: 1.2,
  shapely: 1.35,
  responder: 1.15,
}

/** accent: lines, glows; text: a brighter shade of the accent, readable as text on the dark page. */
const HUE: Record<ExpertiseDomain['id'], { accent: string; text: string }> = {
  ia: { accent: '#818cf8', text: '#a5b4fc' },
  data: { accent: '#eab308', text: '#fde047' },
  offensive: { accent: '#ef4444', text: '#f87171' },
  defensive: { accent: '#2563eb', text: '#60a5fa' },
  devops: { accent: '#f97316', text: '#fb923c' },
  dev: { accent: '#22c55e', text: '#4ade80' },
}

/**
 * Expertise: the domain list on the left chooses the domain; all its tools show in a grid on the right.
 */
export function Expertise() {
  // A targeted link (?metier=cyber…) puts that job's domains first and opens the first one.
  const [domains] = useState(() => orderedDomains(tracksFromSearch(window.location.search)))
  const [active, setActive] = useState(0)
  const domain = domains[active]!
  return (
    <section id="competences" className="py-24">
      <SectionHeader index="02" title="Expertise" />
      {/* The rail stays put (top-aligned, sticky) whatever the size of the grid; -mt-3.5 cancels the
          buttons' top padding so the first domain lines up with the grid, 56 px under the title like every section. */}
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:items-start">
        <div className="-mt-3.5 lg:sticky lg:top-28">
          <RailHeaders domains={domains} active={active} onSelect={setActive} />
        </div>
        <div className="min-w-0">
          <ToolGrid key={domain.id} domain={domain} />
        </div>
      </div>
    </section>
  )
}

type HeaderProps = { domains: ExpertiseDomain[]; active: number; onSelect: (i: number) => void }

/**
 * Rail: a vertical list on the left, the logos on the right. The active domain is tinted in its
 * colour: a coloured line, and the name in a gradient from a light tint of the colour to white.
 */
function RailHeaders({ domains, active, onSelect }: HeaderProps) {
  return (
    <div role="group" aria-label="Domaines" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {domains.map((d, i) => {
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
 * Tool grid: every tool of the domain at once, each tile with its logo, name and what Jérémie did
 * with it; on hover the tile lifts and lights up in the domain colour. Incomplete rows are centred.
 */
function ToolGrid({ domain }: { domain: ExpertiseDomain }) {
  const { accent } = HUE[domain.id]
  return (
    <ul aria-label={`Outils · ${domain.label.fr}`} className="flex animate-[fadeIn_400ms_ease-out_both] flex-wrap justify-center gap-3">
      {domain.tools.map((t) => (
        <li
          key={t.name}
          className="group flex w-[calc((100%-1.5rem)/3)] flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-zinc-950/45 px-3 pt-5 pb-4 text-center transition-all duration-300 outline-none hover:-translate-y-1.5 hover:scale-[1.04] hover:border-[color:var(--accent)] hover:bg-zinc-900/70 hover:shadow-[0_18px_40px_-18px_var(--accent)] focus-visible:border-[color:var(--accent)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 sm:w-[calc((100%-3rem)/5)]"
          style={{ ['--accent' as string]: `${accent}80` }}
        >
          <span className="grid h-[76px] place-items-center">
            <ToolLogo name={t.name} size={Math.round(76 * (ICON_SCALE[normalizeToolName(t.name)] ?? 1))} tone={accent} />
          </span>
          <span className="text-sm font-semibold text-zinc-100">{t.name}</span>
          {/* What Jérémie did with it. */}
          <span className="text-xs leading-snug text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">{t.note.fr}</span>
          <span aria-hidden="true" className="mt-auto h-0.5 w-6 rounded-full opacity-40 transition-all duration-300 group-hover:w-10 group-hover:opacity-100" style={{ background: accent }} />
        </li>
      ))}
    </ul>
  )
}
