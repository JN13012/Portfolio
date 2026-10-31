import type { Localized } from './types'

type Language = {
  code: string
  name: Localized
  /** CEFR level as declared on the CV; "native" for French. */
  level: string
  note?: Localized
}

type Strength = {
  id: string
  title: Localized
  context: Localized
  /** Years shown on the timeline rail. */
  period: { start: string; end: string }
  text: Localized
}

export const profile = {
  firstName: 'Jérémie',
  lastName: 'Nagi',
  availability: {
    fr: 'Disponible immédiatement',
    en: 'Available immediately',
  },
  /** What is being sought, most important first. */
  seeking: [
    { fr: 'Alternance · MSc Epitech', en: 'Work-study · MSc Epitech' },
    { fr: 'Stage possible', en: 'Internship possible' },
  ],
  location: {
    fr: 'Marseille · mobile',
    en: 'Marseille · open to relocation',
  },
  email: 'jeremie.nagi@epitech.eu',
  links: {
    github: 'https://github.com/JN13012',
    linkedin: 'https://www.linkedin.com/in/jn13012',
    tryhackme: 'https://tryhackme.com/p/JN13',
    coursera: 'https://www.coursera.org/user/e4a10664a5b2f8c1c89a72345402e8b1',
    trailblazer: 'https://www.salesforce.com/trailblazer/yfqjerhp8yqpaobh7v',
  },
  languages: [
    { code: 'fr', name: { fr: 'Français', en: 'French' }, level: 'native' },
    { code: 'en', name: { fr: 'Anglais', en: 'English' }, level: 'C1' },
    { code: 'es', name: { fr: 'Espagnol', en: 'Spanish' }, level: 'C1' },
    {
      code: 'ar',
      name: { fr: 'Arabe', en: 'Arabic' },
      level: 'C1',
      note: { fr: 'libanais et littéraire', en: 'Lebanese and Modern Standard' },
    },
    { code: 'de', name: { fr: 'Allemand', en: 'German' }, level: 'A1' },
  ] satisfies Language[],
  /** Introduction of the Profil section: the road, not the job (the hero pitch already says what he does). */
  about: {
    fr: 'Je suis arrivé à l’IA et à la cybersécurité par un chemin peu commun. Chaque étape m’a laissé quelque chose que j’utilise aujourd’hui.',
    en: 'I came to AI and cybersecurity by an unusual road. Each step left me something I use today.',
  },
  /**
   * Before IT, and what it left: concise takeaways, with the full experience details in Parcours.
   * Oldest first, drawn as a timeline.
   */
  strengths: [
    {
      id: 'rima',
      title: { fr: 'Décider sous pression, agir ensemble', en: 'Deciding under pressure, acting together' },
      context: { fr: 'Armée', en: 'Army' },
      period: { start: '2014', end: '2016' },
      text: {
        fr: 'L’exigence du terrain m’a appris la discipline, la cohésion et l’importance de pouvoir compter les uns sur les autres.',
        en: 'The demands of the field taught me discipline, cohesion and the importance of being able to rely on one another.',
      },
    },
    {
      id: 'motorsport',
      title: { fr: 'Diagnostiquer vite, sans droit à l’erreur', en: 'Diagnosing fast, with no room for error' },
      context: { fr: 'Mécanique', en: 'Mechanics' },
      period: { start: '2017', end: '2025' },
      text: {
        fr: 'Responsable des pneumatiques d’un prototype LMP2 lors du FIA World Endurance Championship, WEC 2017. Un arrêt au stand ne se rejoue pas.',
        en: 'In charge of the tyres of an LMP2 prototype during the FIA World Endurance Championship, WEC 2017. A pit stop cannot be replayed.',
      },
    },
    {
      id: 'blockchain',
      title: { fr: 'Monter et superviser une infra', en: 'Building and monitoring infrastructure' },
      context: { fr: 'Minage', en: 'Mining' },
      period: { start: '2018', end: '2022' },
      text: {
        fr: 'Ma première expérience entrepreneuriale dans l’exploitation de systèmes informatiques, avec la responsabilité du bon fonctionnement et de la rentabilité.',
        en: 'My first entrepreneurial experience running IT systems, with responsibility for their reliability and profitability.',
      },
    },
  ],
  /** The International block: languages and the countries lived in, drawn on a flat map. */
  international: {
    title: { fr: 'International', en: 'International' },
    summary: { fr: '5 langues · 6 pays où j’ai vécu', en: '5 languages · 6 countries lived in' },
    lead: {
      fr: 'Un parcours immersif entre plusieurs pays m’a appris à m’adapter rapidement à de nouveaux environnements.',
      en: 'An immersive path across several countries taught me to adapt quickly to new environments.',
    },
    countryNames: {
      CA: { fr: 'Canada', en: 'Canada' },
      PE: { fr: 'Pérou', en: 'Peru' },
      FR: { fr: 'France', en: 'France' },
      LB: { fr: 'Liban', en: 'Lebanon' },
      SA: { fr: 'Arabie saoudite', en: 'Saudi Arabia' },
      QA: { fr: 'Qatar', en: 'Qatar' },
    },
    /** Time lived in each country, from Jérémie (2026-10-27): France 0–1 then 14–35, Lebanon 1–5, Saudi Arabia 5–10, Qatar 10–13. */
    stays: {
      FR: { fr: '22 ans', en: '22 years' },
      LB: { fr: '4 ans', en: '4 years' },
      SA: { fr: '5 ans', en: '5 years' },
      QA: { fr: '3 ans', en: '3 years' },
      // Canada: a data-centre project, stopped for lack of a Hydro-Québec crypto power quota.
      CA: { fr: '3 mois', en: '3 months' },
      PE: { fr: '1 an et demi', en: 'a year and a half' },
    },
    mapLabel: {
      fr: 'Pays où Jérémie a vécu : France 22 ans, Liban 4 ans, Arabie saoudite 5 ans, Qatar 3 ans, Canada 3 mois, Pérou 1 an et demi ',
      en: 'Countries Jérémie has lived in: France 22 years, Lebanon 4 years, Saudi Arabia 5 years, Qatar 3 years, Canada 3 months, Peru a year and a half',
    },
  },
  /**
   * Prepared Sentry questions offered under the strengths (assistant.ts, Profil node). A button shows only once
   * its answer exists: Jérémie writes strengths and weaknesses himself (plan §7), never an LLM.
   */
  sentryQuestions: ['strengths', 'weaknesses'],
  /** Interests: a row of icons, each opens a small panel on hover, focus or tap. */
  interests: [
    {
      id: 'finance',
      label: { fr: 'Finance', en: 'Finance' },
      text: { fr: 'Les marchés crypto, à l’origine de BlockTrader.', en: 'Crypto markets, where BlockTrader comes from.' },
      project: 'blocktrader',
    },
    {
      id: 'geopolitics',
      label: { fr: 'Géopolitique', en: 'Geopolitics' },
      text: {
        fr: 'Suivre la géopolitique, c’est aussi suivre les avancées de l’IA, les menaces cyber et les régulations.',
        en: 'Following geopolitics also means following AI advances, cyber threats and regulation.',
      },
    },
    {
      id: 'travel',
      label: { fr: 'Voyages', en: 'Travel' },
      text: { fr: 'Six pays où j’ai vécu et 18 visités.', en: 'Six countries lived in and 18 visited.' },
    },
    {
      id: 'sport',
      label: { fr: 'Sport', en: 'Sport' },
      text: { fr: 'Course à pied, natation, renforcement musculaire, randonnées…', en: 'Running, swimming, strength training, hiking…' },
    },
  ],
  /** Availability block under the portrait: the work-study rhythm is not in the hero. `id` picks the icon. */
  workStudy: [
    { id: 'master', text: { fr: 'Master jusqu’en 2028', en: 'Master’s until 2028' } },
    { id: 'work', text: { fr: 'Alternance · Stage possible', en: 'Work-study · Internship possible' } },
    { id: 'rhythm', text: { fr: '4 j entreprise / 1 j école', en: '4 days company / 1 day school' } },
  ],
  /** Labels of the Profil section. */
  ui: {
    strengthsTitle: { fr: 'Avant l’informatique, et ce que j’en garde :', en: 'Before IT, and what I kept from it:' },
    interests: { fr: 'Centres d’intérêt', en: 'Interests' },
    native: { fr: 'Natif', en: 'Native' },
    replayGlobe: { fr: 'Revoir le globe', en: 'Replay the globe' },
    askSentry: { fr: 'Demander à Sentry :', en: 'Ask Sentry:' },
  },
  /** At-a-glance facts of the Profil section. */
  facts: [
    { label: { fr: 'Localisation', en: 'Location' }, value: { fr: 'Marseille · mobile', en: 'Marseille · open to relocation' } },
    { label: { fr: 'Recherche', en: 'Looking for' }, value: { fr: 'Alternance 4 j entreprise / 1 j école (stage possible)', en: 'Work-study, 4 days company / 1 day school (internship possible)' } },
    { label: { fr: 'Formation', en: 'Education' }, value: { fr: 'MSc Epitech · 2026 – 2028', en: 'MSc Epitech · 2026 – 2028' } },
    { label: { fr: 'Disponibilité', en: 'Availability' }, value: { fr: 'Immédiate', en: 'Immediate' } },
  ],
  /** Countries lived in (ISO 3166-1 alpha-2), drawn in Profil and on the intro globe. */
  countries: ['LB', 'SA', 'QA', 'CA', 'PE', 'FR'],
  /** Date shown in the hero file header. Update when content changes. */
  updatedAt: '2026-10-17',
} satisfies {
  firstName: string
  lastName: string
  availability: Localized
  seeking: Localized[]
  location: Localized
  email: string
  links: Record<string, string>
  languages: Language[]
  about: Localized
  strengths: Strength[]
  international: { title: Localized; summary: Localized; lead: Localized; countryNames: Record<string, Localized>; stays: Record<string, Localized>; mapLabel: Localized }
  interests: Array<{ id: string; label: Localized; text?: Localized; project?: string }>
  workStudy: Array<{ id: string; text: Localized }>
  sentryQuestions: string[]
  ui: Record<string, Localized>
  facts: Array<{ label: Localized; value: Localized }>
  countries: string[]
  updatedAt: string
}
