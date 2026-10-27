import cvUrl from '../assets/CV.pdf'
import type { Localized } from './types'

type Language = {
  code: string
  name: Localized
  /** CEFR level as declared on the CV; "native" for French. */
  level: string
  note?: Localized
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
  cv: {
    // Single CV until one per job exists (plan §7).
    url: cvUrl,
    fileName: 'CV_Jeremie_Nagi.pdf',
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
  /** Presentation paragraphs of the Profil section. */
  about: [
    {
      fr: 'Développeur IA et pentester junior, en Master of Science à Epitech Marseille. Mon fil rouge : construire des systèmes d’IA et savoir comment on les attaque.',
      en: 'AI developer and junior penetration tester, Master of Science student at Epitech Marseille. My common thread: building AI systems and knowing how they get attacked.',
    },
    {
      fr: 'Avant l’informatique : l’infanterie (2e RIMa), la mécanique en endurance (24 Heures du Mans 2017) et l’infrastructure blockchain depuis 2018. Cinq langues, six pays.',
      en: 'Before IT: the infantry (2e RIMa), endurance-racing mechanics (2017 24 Hours of Le Mans) and blockchain infrastructure since 2018. Five languages, six countries.',
    },
  ],
  /** At-a-glance facts of the Profil section. */
  facts: [
    { label: { fr: 'Localisation', en: 'Location' }, value: { fr: 'Marseille · mobile', en: 'Marseille · open to relocation' } },
    { label: { fr: 'Recherche', en: 'Looking for' }, value: { fr: 'Alternance 4 j entreprise / 1 j école (stage possible)', en: 'Work-study, 4 days company / 1 day school (internship possible)' } },
    { label: { fr: 'Formation', en: 'Education' }, value: { fr: 'MSc Epitech · 2025 – 2028', en: 'MSc Epitech · 2025 – 2028' } },
    { label: { fr: 'Disponibilité', en: 'Availability' }, value: { fr: 'Immédiate', en: 'Immediate' } },
  ],
  interests: [
    { id: 'travel', label: { fr: 'Voyages', en: 'Travel' } },
    { id: 'sport', label: { fr: 'Sport', en: 'Sport' } },
    { id: 'geopolitics', label: { fr: 'Géopolitique', en: 'Geopolitics' } },
    { id: 'finance', label: { fr: 'Finance', en: 'Finance' } },
  ],
  /** Countries lived in (ISO 3166-1 alpha-2), for the « En 30 secondes » strip and the V1.1 globe. */
  countries: ['LB', 'QA', 'SA', 'CA', 'PE', 'FR'],
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
  cv: { url: string; fileName: string }
  languages: Language[]
  about: Localized[]
  facts: Array<{ label: Localized; value: Localized }>
  interests: Array<{ id: string; label: Localized }>
  countries: string[]
  updatedAt: string
}
