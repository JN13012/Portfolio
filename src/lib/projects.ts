import type { Project, ProjectStatus, Track } from '../content/types'
import { complexity } from '../content/complexity'

export type ProjectSort = 'selection' | 'date' | 'complexity'

export type ProjectFilter = {
  tracks?: Track[]
  statuses?: ProjectStatus[]
}

export type ProjectGroup = 'perso-pro' | 'formation'

/** Personal and work projects first; course projects (Epitech, IBM, hackathon) second. */
export const groupOf = (p: Project): ProjectGroup =>
  p.showcase === 'perso-pro' || p.context === 'personal' || p.context === 'work' ? 'perso-pro' : 'formation'

/** Complexity note 1–5 (src/content/complexity.ts); 1 if a project has none yet. */
export const complexityOf = (p: Project) => complexity[p.slug]?.note ?? 1

const recency = (p: Project) => (p.period.end ? p.period.end : '9999-99')

export function filterProjects(projects: Project[], filter: ProjectFilter) {
  return projects.filter(
    (p) =>
      (!filter.tracks?.length || filter.tracks.some((t) => p.tracks.includes(t))) &&
      (!filter.statuses?.length || filter.statuses.includes(p.status)),
  )
}

/**
 * selection (default): projects with a full case study first, then by complexity.
 * date: ongoing first, then by end month. complexity: highest note first.
 * Ties always go to the most recent project.
 */
export function sortProjects(projects: Project[], sort: ProjectSort) {
  const byRecency = (a: Project, b: Project) => recency(b).localeCompare(recency(a))
  const byComplexity = (a: Project, b: Project) => complexityOf(b) - complexityOf(a) || byRecency(a, b)
  const copy = [...projects]
  if (sort === 'date') return copy.sort(byRecency)
  if (sort === 'complexity') return copy.sort(byComplexity)
  const study = (p: Project) => (p.tier === 'dossier' ? 0 : 1)
  return copy.sort((a, b) => study(a) - study(b) || byComplexity(a, b))
}

/** Reads `?metier=cyber,ia` from the URL (targeted application links). */
export function tracksFromSearch(search: string): Track[] {
  const value = new URLSearchParams(search).get('metier') ?? ''
  return value.split(',').filter((t): t is Track => t === 'ia' || t === 'cyber' || t === 'dev')
}
