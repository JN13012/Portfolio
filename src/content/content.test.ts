import { describe, expect, it } from 'vitest'
import { envergure, filterProjects, sortProjects, tracksFromSearch } from '../lib/projects'
import { credentials, inProgress } from './certifications'
import { hero } from './hero'
import { profile } from './profile'
import { dossiers, projects } from './projects'
import { expertise, orderedDomains } from './expertise'
import { skills } from './skills'
import { timeline } from './timeline'
import { tracks } from './tracks'
import type { Localized } from './types'
import writeups from './writeups.json'

/** Walks any value and yields every { fr, en } object found. */
function* localizedIn(value: unknown, path = ''): Generator<[string, Localized]> {
  if (!value || typeof value !== 'object') return
  if ('fr' in value && 'en' in value && Object.keys(value).length === 2) {
    yield [path, value as Localized]
    return
  }
  for (const [k, v] of Object.entries(value)) yield* localizedIn(v, `${path}.${k}`)
}

const allContent = { hero, profile, projects, credentials, inProgress, timeline, skills, tracks, expertise }

/** Only what reaches the page: editorial fields (doNotClaim, fact sources) are dropped. */
const displayed = (value: unknown) =>
  JSON.stringify(value, (key, v) => (key === 'doNotClaim' || key === 'source' ? undefined : v))

describe('content', () => {
  it('has every user-facing string in French and English', () => {
    for (const [path, text] of localizedIn(allContent)) {
      expect(text.fr.trim(), `${path}.fr`).not.toBe('')
      expect(text.en.trim(), `${path}.en`).not.toBe('')
    }
  })

  it('has unique project slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only features projects that exist', () => {
    for (const t of tracks) for (const slug of t.featured) expect(projects.some((p) => p.slug === slug), slug).toBe(true)
  })

  it('gives every dossier its sections and every project a status', () => {
    for (const d of dossiers) expect(d.sections?.length, d.slug).toBeGreaterThan(0)
    for (const p of projects) expect(p.status, p.slug).toBeTruthy()
  })

  it('contains no placeholder links', () => {
    const json = displayed(allContent)
    expect(json).not.toMatch(/ton-username|example\.com|href="#"/)
  })

  it('links only to the owner’s GitHub account or known hosts', () => {
    const urls = displayed(allContent).match(/https?:\/\/[^"]+/g) ?? []
    for (const url of urls) {
      expect(url, url).toMatch(/^https:\/\/(github\.com\/JN13012|www\.linkedin\.com|tryhackme\.com|coursera\.org|www\.coursera\.org|www\.salesforce\.com)(\/|$)/)
    }
  })

  it('keeps BlockTrader honest', () => {
    const text = displayed(projects.find((p) => p.slug === 'blocktrader'))
    expect(text).not.toMatch(/CAGR|rendement annuel|%\s*\/\s*an|live trading|piloté par (l’)?IA/i)
  })

  it('dates in-progress items and caps progress', () => {
    for (const item of inProgress) {
      expect(item.progress).toBeGreaterThan(0)
      expect(item.progress).toBeLessThan(1)
      expect(item.measuredAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('indexes the 25 write-ups from the public repo', () => {
    expect(writeups.writeups).toHaveLength(25)
    for (const w of writeups.writeups) expect(w.url).toMatch(/^https:\/\/github\.com\/JN13012\/Cyber-Write-ups\//)
  })
})

describe('project filters', () => {
  it('filters by job and status', () => {
    const cyber = filterProjects(projects, { tracks: ['cyber'] })
    expect(cyber.length).toBeGreaterThan(0)
    expect(cyber.every((p) => p.tracks.includes('cyber'))).toBe(true)
    expect(filterProjects(projects, { statuses: ['development'] }).every((p) => p.status === 'development')).toBe(true)
  })

  it('sorts by date with ongoing projects first, and by envergure', () => {
    const byDate = sortProjects(projects, 'date')
    expect(byDate[0]?.period.end).toBeUndefined()
    const byScale = sortProjects(projects, 'envergure')
    for (let i = 1; i < byScale.length; i++) expect(envergure(byScale[i - 1]!)).toBeGreaterThanOrEqual(envergure(byScale[i]!))
  })

  it('reads ?metier= from the URL and ignores unknown values', () => {
    expect(tracksFromSearch('?metier=cyber,ia,foo')).toEqual(['cyber', 'ia'])
    expect(tracksFromSearch('')).toEqual([])
  })
})

describe('expertise order', () => {
  const ids = (t: Parameters<typeof orderedDomains>[0]) => orderedDomains(t).map((d) => d.id)
  it('keeps the default order without ?metier=', () => {
    expect(ids([])).toEqual(['ia', 'offensive', 'defensive', 'devops', 'dev'])
  })
  it('uses one order per job and keeps every domain', () => {
    expect(ids(['ia'])).toEqual(['ia', 'offensive', 'defensive', 'devops', 'dev'])
    expect(ids(['cyber'])).toEqual(['offensive', 'defensive', 'ia', 'devops', 'dev'])
    expect(ids(['dev'])).toEqual(['dev', 'ia', 'offensive', 'defensive', 'devops'])
    expect(ids(['ia', 'cyber'])).toEqual(ids(['ia']))
  })
})
