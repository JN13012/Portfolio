export type Locale = 'fr' | 'en'

/** French is the only maintained language (decision 2026-10-30). Existing EN text stays until the English version is built, and may be stale. */
export type Localized = { fr: string; en?: string }

/** The jobs the site targets. Also used for project filters (`?metier=`). */
export type Track = 'ia' | 'data' | 'cyber' | 'dev' | 'devops'

/**
 * Honest project status, always shown next to a project: still being built, or finished.
 * Real use by a company is said with `inProduction` on the project, not with a status.
 */
/** `ongoing`: a series that keeps growing (write-ups), shown « En continu ». */
export type ProjectStatus = 'development' | 'delivered' | 'ongoing'

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
  /** One sentence, or the intro of the list below; left out when the title and list say it all. */
  body?: Localized
  /** The detail as a short list: one line each, with an optional bold label. */
  points?: Array<{ label?: Localized; text: Localized }>
}

export type Project = {
  slug: string
  tier: ProjectTier
  status: ProjectStatus
  /** Shown with the personal & professional projects although made in a course (e.g. Argos, pursued beyond Epitech). */
  showcase?: 'perso-pro'
  /** Result of a competition, shown in the hackathon badge, e.g. « 2e place ». */
  award?: Localized
  /** Where the project is used for real, e.g. « En production chez ULIT ». */
  inProduction?: Localized
  tracks: Track[]
  title: string
  period: { start: YearMonth; end?: YearMonth }
  /** `role`: what Jérémie did in a group (shown next to the team size). */
  team: { size: number; role?: Localized }
  context: ProjectContext
  /** Card line: one full sentence, 90 characters at most (the card shows two lines). */
  tagline?: Localized
  /** 2–3 lines, recruiter level, shown in the modal. */
  summary: Localized
  /** The same facts seen from each job. */
  angles?: Partial<Record<Track, Localized>>
  /** Dossiers only: problem → approach → architecture → security → result → limits. */
  sections?: DossierSection[]
  /** Shown under the visuals when they are not the real product (e.g. a design mock-up). */
  imageNote?: Localized
  stack: string[]
  links: {
    github?: string
    demo?: string
    writeup?: string
    /** Projects bundling several repos (e.g. the LLM applications). */
    repos?: Array<{ label: string; url: string }>
    /** Repo exists but is private: described without a code link. */
    privateRepo?: boolean
    /** Client work with no code to show (the audit): « Rapport confidentiel ». */
    confidential?: boolean
  }
  /** Scope figures (what the project covers), 3–4 for a dossier; verifiable only. */
  facts: Fact[]
  /** Inputs of the « envergure » sort (computed, see lib/projects.ts). */
  scale: { months: number; tests?: number }
  /** Editorial guard rail, never displayed. */
  doNotClaim?: string[]
}

// ── Credentials ─────────────────────────────────────────────────────────────

export type CredentialKind = 'certification' | 'learning-path' | 'professional-certificate' | 'course' | 'workshop'

/**
 * Difficulty 1–5 (Intro → Insane), from the grid validated by Jérémie on 2026-10-25:
 * 1 introductions · 2 applied courses and first paths (Security Engineer, Python for Data Science: long but rated beginner) · 3 practical exam,
 * long certificate, AI pentesting workshop, or any course rated intermediate by its platform (THM DevSecOps,
 * the Coursera Flask, GenAI apps and GenAI for software development courses) · 4 Jr Penetration Tester · 5 kept for a proctored
 * professional exam (PT1, OSCP…).
 */
export type CredentialLevel = 1 | 2 | 3 | 4 | 5

export type Credential = {
  id: string
  title: string
  /** Shorter title for the card when the official one runs past two lines; the modal keeps `title`. */
  cardTitle?: string
  issuer: string
  kind: CredentialKind
  /** Tabs of the section: cyber, or IA & dev. */
  tracks: Track[]
  /** Day from the certificate, or month when only that is known. */
  date: IsoDate | YearMonth
  level: CredentialLevel
  credentialId?: string
  verifyUrl?: string
  /** Course duration from the certificate, rounded up to the hour. */
  hours?: number
  /** Exam duration, for exam-based certifications. */
  examHours?: number
  /** What it covers, recruiter level: one or two short sentences. */
  note: Localized
  /** Exam result, shown as one line under the note (score, pass mark, time taken). */
  result?: Localized
  /** Aim of a workshop, shown as « Objectif : … » before the list. */
  goal?: Localized
  /** The detail as a short list: one line each, with an optional bold label. */
  points?: Array<{ label?: Localized; text: Localized }>
  /** Tools and topics, tool names as in expertise.ts so their logos show. */
  stack: string[]
  /** Courses bundled in a professional certificate. */
  includes?: string[]
  /** An earlier completion of the same path, said in the modal. */
  previous?: Localized
  /** « PRO » badge: exam-based certification or professional certificate (choice of Jérémie). */
  pro?: boolean
}

/** A path still in progress: a card marked « En cours », never counted with the obtained credentials. */
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
  note: Localized
  /** Same list as Credential.points. */
  points?: Array<{ label?: Localized; text: Localized }>
  stack: string[]
}

// ── Journey ─────────────────────────────────────────────────────────────────

/** Exact months when known; otherwise a text shown as is, until the dates are confirmed. */
export type Period = { start: YearMonth; end?: YearMonth } | { approx: Localized }

/** How an entry is drawn on the Parcours axis: the tech path, before the reconversion, or a personal activity. */
export type TimelineTone = 'tech' | 'before' | 'personal'

export type TimelineEntry = {
  id: string
  /** The lane on the axis. */
  kind: 'experience' | 'education'
  title: Localized
  /** Label inside the bar on the axis. */
  short: Localized
  /** Several for a block grouping jobs; `url` = the school's or company's site. */
  organisations: { name: string; url?: string; place?: Localized }[]
  /** ISO 3166-1 alpha-2, for the V1.1 globe. */
  country: string
  /** Position on the axis, months inclusive; no end = still going on (drawn up to today). */
  span: { start: YearMonth; end?: YearMonth }
  /** Planned end of an ongoing course, drawn hatched after today. */
  expectedEnd?: YearMonth
  /** Shown as is: what we actually know of the dates. */
  periodLabel: Localized
  /** Dates still to be confirmed by Jérémie. */
  datesToConfirm?: boolean
  badge?: Localized
  tone: TimelineTone
  /** Sub-row inside the lane, for entries that overlap (0 = top). */
  row?: number
  summary: Localized
  highlights?: Localized[]
  /** Small print under the details (e.g. confidentiality). */
  note?: Localized
  tags?: string[]
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
