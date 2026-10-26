// Renders every French text of src/content into docs/relecture-contenu.md, for proofreading.
// Usage: npm run review   (regenerate after any content change)

import { writeFileSync } from 'node:fs'
import { credentials, inProgress } from '../src/content/certifications'
import { contact } from '../src/content/contact'
import { hero } from '../src/content/hero'
import { profile } from '../src/content/profile'
import { archive, cards, dossiers } from '../src/content/projects'
import { llmApps } from '../src/content/projects/llm-apps'
import { skills } from '../src/content/skills'
import { timeline } from '../src/content/timeline'
import { atAGlance, tracks } from '../src/content/tracks'
import type { Period, Project } from '../src/content/types'
import { credentialKindLabels, credentialLevelLabels, modalSummary, statusLabels, teamLabel } from '../src/content/ui'
import writeups from '../src/content/writeups.json'

const out: string[] = []
const h = (level: number, text: string) => out.push('', `${'#'.repeat(level)} ${text}`, '')
const p = (text: string) => out.push(text, '')

const period = (x: Project['period'] | Period) =>
  'approx' in x ? x.approx.fr : `${x.start} → ${'end' in x && x.end ? x.end : 'en cours'}`

out.push(
  '# Relecture du contenu V1 (FR)',
  '',
  `> Généré par \`npm run review\` le ${new Date().toISOString().slice(0, 10)} à partir de \`src/content/\`. Ne pas modifier ce fichier à la main : corriger le contenu source, puis régénérer.`,
  '> Les chiffres viennent des dépôts et des certificats (voir les champs `source` dans le code).',
)

h(2, 'Hero')
p(`**${profile.firstName} ${profile.lastName}** — ${hero.title.map((t) => t.text.fr).join(' · ')}`)
p(`> ${hero.pitch.fr}`)
p(hero.proofs.map((x) => `- ${x.fr}`).join('\n'))
p(`${profile.availability.fr} · ${profile.seeking.map((s) => s.fr).join(' · ')} · ${profile.location.fr}`)

h(2, 'En 30 secondes')
p(atAGlance.map((x) => x.fr).join(' · '))

h(2, 'Trois métiers')
for (const t of tracks) {
  h(3, t.label.fr)
  p(t.positioning.fr)
  p(`Preuves : ${t.proofs.map((x) => x.fr).join(' · ')}`)
}

h(2, 'Dossiers')
for (const d of dossiers) {
  h(3, `${d.title} — ${statusLabels[d.status].fr} (${period(d.period)})`)
  p(modalSummary(d, 'fr'))
  for (const [track, text] of Object.entries(d.angles ?? {})) p(`*Angle ${track}* : ${text.fr}`)
  for (const s of d.sections ?? []) p(`**${s.title.fr}.** ${s.body.fr}`)
  if (d.facts.length) p(`Chiffres : ${d.facts.map((f) => `${f.value} ${f.label.fr}`).join(' · ')}`)
  p(`Stack : ${d.stack.join(', ')}`)
}

h(2, 'Autres réalisations')
for (const c of cards) {
  h(3, `${c.title} — ${statusLabels[c.status].fr}${c.team.size > 1 || c.team.role ? ` · ${teamLabel(c.team, 'fr')}` : ''}`)
  p(modalSummary(c, 'fr'))
}

h(2, 'Applications LLM (certification IBM)')
for (const a of llmApps) {
  h(3, a.title)
  p(modalSummary(a, 'fr'))
}

h(2, 'Archives')
p(archive.map((a) => `- **${a.title}** (${a.period.start.slice(0, 4)}) — ${modalSummary(a, 'fr')}`).join('\n'))

h(2, 'Lab')
p(`${writeups.writeups.length} write-ups indexés depuis ${writeups.repo} (métadonnées seulement).`)

h(2, 'Parcours')
for (const e of timeline) {
  h(3, `${e.title.fr} — ${e.organisations.map((o) => o.name).join(' · ')} (${e.periodLabel.fr})`)
  if (e.badge) p(e.badge.fr)
  p(e.summary.fr)
  if (e.highlights) p(e.highlights.map((x) => `- ${x.fr}`).join('\n'))
}

h(2, 'Compétences')
for (const [track, groups] of Object.entries(skills)) {
  h(3, track)
  p(groups.map((g) => `- **${g.title.fr}** : ${g.items.join(', ')}`).join('\n'))
}

h(2, 'Certifications')
p(
  credentials
    .map(
      (c) =>
        `- **${c.title}** — ${c.issuer}, ${c.date} · ${credentialKindLabels[c.kind].fr} · ${credentialLevelLabels[c.level]}${c.hours ? ` · ${c.hours} h` : ''} — ${c.note.fr}${c.previous ? ` ${c.previous.fr}` : ''}`,
    )
    .join('\n'),
)
p(`En cours : ${inProgress.map((i) => `${i.title} (${Math.round(i.progress * 100)} % au ${i.measuredAt}) — ${i.note.fr}`).join(' · ')}`)

h(2, 'Contact')
p(Object.values(contact).map((x) => `- ${x.fr}`).join('\n'))

h(2, 'Langues')
p(profile.languages.map((l) => `${l.name.fr} (${l.level === 'native' ? 'langue maternelle' : l.level}${l.note ? `, ${l.note.fr}` : ''})`).join(' · '))

writeFileSync(new URL('../docs/relecture-contenu.md', import.meta.url), out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n')
console.log('docs/relecture-contenu.md written')
