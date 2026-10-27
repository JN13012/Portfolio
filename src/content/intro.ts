import type { Localized } from './types'

export type JourneyStop = {
  code: string
  country: Localized
  city: string
  lat: number
  lon: number
  /** Index in the existing globeDots.bin / globeOutlines.json assets. */
  mapIndex: number
}

// Cities confirmed by Jérémie; the interface deliberately labels the countries.
export const introJourney: JourneyStop[] = [
  { code: 'FR', country: { fr: 'France', en: 'France' }, city: 'Marseille', lat: 43.2965, lon: 5.3698, mapIndex: 0 },
  { code: 'LB', country: { fr: 'Liban', en: 'Lebanon' }, city: 'Tripoli', lat: 34.4367, lon: 35.8497, mapIndex: 1 },
  { code: 'SA', country: { fr: 'Arabie saoudite', en: 'Saudi Arabia' }, city: 'Riyadh', lat: 24.7136, lon: 46.6753, mapIndex: 2 },
  { code: 'QA', country: { fr: 'Qatar', en: 'Qatar' }, city: 'Doha', lat: 25.2854, lon: 51.531, mapIndex: 3 },
  { code: 'CA', country: { fr: 'Canada', en: 'Canada' }, city: 'Montréal', lat: 45.5019, lon: -73.5674, mapIndex: 4 },
  { code: 'PE', country: { fr: 'Pérou', en: 'Peru' }, city: 'Ayacucho', lat: -13.1631, lon: -74.2236, mapIndex: 5 },
  { code: 'FR', country: { fr: 'France', en: 'France' }, city: 'Marseille', lat: 43.2965, lon: 5.3698, mapIndex: 0 },
]

export const introCopy = {
  portfolio: { fr: 'Portfolio personnel', en: 'Personal portfolio' },
  title: { fr: 'Un parcours.', en: 'One journey.' },
  titleAccent: { fr: 'Plusieurs horizons.', en: 'Many horizons.' },
  description: {
    fr: 'Des pays, des langues et des expériences qui ont façonné ma façon de voir le monde.',
    en: 'Countries, languages and experiences that shaped the way I see the world.',
  },
  countries: { fr: 'pays', en: 'countries' },
  languages: { fr: 'langues', en: 'languages' },
  base: { fr: 'Aujourd’hui à Marseille', en: 'Based in Marseille' },
  enter: { fr: 'Entrer dans le portfolio', en: 'Enter the portfolio' },
  skip: { fr: 'Passer l’introduction', en: 'Skip introduction' },
  accessible: {
    fr: 'Le globe retrace mon parcours : France, Liban, Arabie saoudite, Qatar, Canada, Pérou, puis retour en France. Entrer ouvre le portfolio avec un rapprochement vers Marseille. Vous pouvez entrer à tout moment.',
    en: 'The globe traces my journey: France, Lebanon, Saudi Arabia, Qatar, Canada, Peru, then back to France. Enter opens the portfolio with a dive towards Marseille. You can enter at any time.',
  },
  start: { fr: 'Point de départ', en: 'Starting point' },
  return: { fr: 'Retour en France', en: 'Back to France' },
  destination: { fr: 'Destination · Marseille', en: 'Destination · Marseille' },
  fallback: { fr: 'Chaque étape ouvre un nouvel horizon.', en: 'Every stop opens a new horizon.' },
} satisfies Record<string, Localized>
