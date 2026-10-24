export type Locale = 'fr' | 'en'

/** Every user-facing string exists in both languages (EN is reviewed in step 6). */
export type Localized = Record<Locale, string>

/** The three jobs the site targets. Also used for project filters (`?metier=`). */
export type Track = 'ia' | 'cyber' | 'dev'

/**
 * Honest project status, always shown next to a project: still being built, or finished.
 * Real use by a company is said with `inProduction` on the project, not with a status.
 */
export type ProjectStatus = 'development' | 'delivered'

/** ISO month: '2026-04'. */
export type YearMonth = `${number}-${number}`

/** ISO date: '2026-10-07'. */
export type IsoDate = `${number}-${number}-${number}`

/**
 * A verifiable figure. `source` says where it can be checked (repo path,
 * command, certificate); it is editorial and never displayed.
 */
export type Fact = {
  value: string
  label: Localized
  source: string
}

// ── Projects ────────────────────────────────────────────────────────────────

/** Dossier = case study with its own page; card = short card; archive = folded list. */
export type ProjectTier = 'dossier' | 'card' | 'archive'

export type ProjectContext = 'personal' | 'epitech' | 'ibm' | 'hackathon' | 'work'

export type DossierSection = {
  kind: 'problem' | 'approach' | 'architecture' | 'security' | 'result' | 'limits'
  title: Localized
  body: Localized
}

export type Project = {
  slug: string
  tier: ProjectTier
  status: ProjectStatus
  /** Where the project is used for real, e.g. « En production chez ULIT ». */
  inProduction?: Localized
  tracks: Track[]
  title: string
  period: { start: YearMonth; end?: YearMonth }
  team: { size: number; label?: Localized }
  context: ProjectContext
  /** 2–3 lines, recruiter level. */
  summary: Localized
  /** The same facts seen from each job. */
  angles?: Partial<Record<Track, Localized>>
  /** Dossiers only: problem → approach → architecture → security → result → limits. */
  sections?: DossierSection[]
  stack: string[]
  links: {
    github?: string
    demo?: string
    writeup?: string
    /** Projects bundling several repos (e.g. the LLM applications). */
    repos?: Array<{ label: string; url: string }>
    /** Repo exists but is private: described without a code link. */
    privateRepo?: boolean
  }
  /** Verifiable figures only. */
  facts: Fact[]
  /** Inputs of the « envergure » sort (computed, see lib/projects.ts). */
  scale: { months: number; tests?: number }
  /** Editorial guard rail, never displayed. */
  doNotClaim?: string[]
}

// ── Credentials ─────────────────────────────────────────────────────────────

export type CredentialKind = 'certification' | 'learning-path' | 'professional-certificate' | 'course' | 'workshop'

export type Credential = {
  id: string
  title: string
  issuer: string
  kind: CredentialKind
  tracks: Track[]
  date: IsoDate
  credentialId?: string
  verifyUrl?: string
  hours?: number
  /** Shown first; the rest is grouped and folded. */
  featured: boolean
  /** Short description of what it proves. */
  note?: Localized
  /** Courses bundled in a professional certificate. */
  includes?: string[]
}

/** A path still in progress: shown in its own block, never with the obtained credentials. */
export type InProgress = {
  id: string
  title: string
  issuer: string
  tracks: Track[]
  /** 0–1. */
  progress: number
  /** Date of the measurement: an undated progress ages badly. */
  measuredAt: IsoDate
  verifyUrl?: string
}

// ── Journey ─────────────────────────────────────────────────────────────────

/** Exact months when known; otherwise a text shown as is, until the dates are confirmed. */
export type Period = { start: YearMonth; end?: YearMonth } | { approx: Localized }

export type TimelineEntry = {
  id: string
  kind: 'experience' | 'education'
  title: Localized
  organisation: string
  place: Localized
  /** ISO 3166-1 alpha-2, for the V1.1 globe. */
  country: string
  /** Entries are listed most recent first; the array order is the display order. */
  period: Period
  summary: Localized
  highlights?: Localized[]
  tracks: Track[]
  /** Still going on (shown as « En cours »). */
  current?: boolean
}

// ── Skills ──────────────────────────────────────────────────────────────────

export type SkillGroup = {
  title: Localized
  /** Proper nouns (tools, languages) stay untranslated. */
  items: string[]
}
