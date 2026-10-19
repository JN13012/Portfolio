import type { Project, ProjectStatus, Track } from '../content/types'

export type ProjectSort = 'date' | 'envergure'

export type ProjectFilter = {
  tracks?: Track[]
  statuses?: ProjectStatus[]
}

/**
 * « Envergure »: a transparent score from verifiable inputs only, shown with
 * its formula on the site. Duration (months, capped at 12) + team size
 * (capped at 7) + tests (log scale, so 46 and 470 tests stay comparable).
 */
export function envergure(p: Project) {
  const months = Math.min(12, p.scale.months)
  const team = Math.min(7, p.team.size)
  const tests = p.scale.tests ? Math.log10(1 + p.scale.tests) * 4 : 0
  return Math.round((months + team + tests) * 10) / 10
}

const startKey = (p: Project) => p.period.end ?? p.period.start

export function filterProjects(projects: Project[], filter: ProjectFilter) {
  return projects.filter(
    (p) =>
      (!filter.tracks?.length || filter.tracks.some((t) => p.tracks.includes(t))) &&
      (!filter.statuses?.length || filter.statuses.includes(p.status)),
  )
}

export function sortProjects(projects: Project[], sort: ProjectSort) {
  const copy = [...projects]
  if (sort === 'envergure') return copy.sort((a, b) => envergure(b) - envergure(a))
  // Most recent first: by end month (or start when ongoing… ongoing first).
  return copy.sort((a, b) => {
    const ongoingA = a.period.end ? 0 : 1
    const ongoingB = b.period.end ? 0 : 1
    if (ongoingA !== ongoingB) return ongoingB - ongoingA
    return startKey(b).localeCompare(startKey(a))
  })
}

/** Reads `?metier=cyber,ia` from the URL (targeted application links). */
export function tracksFromSearch(search: string): Track[] {
  const value = new URLSearchParams(search).get('metier') ?? ''
  return value.split(',').filter((t): t is Track => t === 'ia' || t === 'cyber' || t === 'dev')
}
