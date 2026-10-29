import type { Localized } from './types'

/** Development controls only; this module is not imported by the portfolio. */
export const sentryPreviewUi = {
  title: { fr: 'Sentry · expressions', en: 'Sentry · expressions' },
  note: { fr: 'Aperçu de développement. Aucun service IA connecté.', en: 'Development preview. No AI service connected.' },
  automatic: { fr: 'Activité du chat', en: 'Chat activity' },
  question: { fr: 'Lire une fiche préparée', en: 'Read a prepared card' },
  block: { fr: 'Simuler un blocage pédagogique', en: 'Simulate a pedagogical block' },
  idle: { fr: 'Repos', en: 'Idle' },
  reading: { fr: 'Lecture', en: 'Reading' },
  searching: { fr: 'Recherche', en: 'Searching' },
  responding: { fr: 'Réponse', en: 'Responding' },
  speaking: { fr: 'Présentation vocale', en: 'Voice presentation' },
  blocked: { fr: 'Blocage', en: 'Blocked' },
} satisfies Record<string, Localized>
