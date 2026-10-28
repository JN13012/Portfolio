import type { Project, ProjectStatus, Track } from '../content/types'
import { complexity } from '../content/complexity'

type ProjectSort = 'date' | 'complexity'

type ProjectFilter = {
  tracks?: Track[]
  statuses?: ProjectStatus[]
}

type ProjectGroup = 'perso-pro' | 'formation'

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
 * date (default): ongoing first, then by end month; the same month goes to the most complex.
 * complexity: highest note first. Other ties go to the most recent project.
 */
export function sortProjects(projects: Project[], sort: ProjectSort) {
  const byRecency = (a: Project, b: Project) => recency(b).localeCompare(recency(a))
  const byComplexity = (a: Project, b: Project) => complexityOf(b) - complexityOf(a) || byRecency(a, b)
  const copy = [...projects]
  if (sort === 'complexity') return copy.sort(byComplexity)
  return copy.sort((a, b) => byRecency(a, b) || complexityOf(b) - complexityOf(a))
}

const TRACKS: Track[] = ['ia', 'data', 'cyber', 'dev', 'devops']

/** Reads `?metier=cyber,ia` from the URL (targeted application links). */
export function tracksFromSearch(search: string): Track[] {
  const value = new URLSearchParams(search).get('metier') ?? ''
  return value.split(',').filter((t): t is Track => TRACKS.includes(t as Track))
}
