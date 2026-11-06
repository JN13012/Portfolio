import type { Project } from '../types'
import labIAImg from '../../assets/Projets/Lab_IA.webp'

// Facts from server/aiLab, content/lab/ai.ts and docs/conception-lab-ia.md (2026-11-01).
export const labIa: Project = {
  slug: 'lab-ia',
  tier: 'card',
  status: 'development',
  stage: 'MVP',
  tracks: ['ia', 'cyber'],
  title: 'CTF IA',
  period: { start: '2026-10' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Un exercice de red teaming sur un vrai modèle, jouable sur ce site : 5 niveaux ouverts.',
  },
  summary: {
    fr: 'Un exercice de red teaming jouable dans le CTF de ce site, face à Sentry, qui répond avec un vrai modèle. Le visiteur lui fait révéler un flag fictif, glisse un texte caché dans un CV pour qu’il le recommande, puis lui fait payer une facture sur un faux IBAN en trompant sa recherche. Les niveaux 1 à 5 sont ouverts ; les 5 autres sont annoncés « À venir ».',
  },
  sections: [
    {
      kind: 'security',
      title: { fr: 'Sécurité' },
      body: { fr: 'Le serveur gère les flags et la progression, et applique des quotas par session et par adresse IP, sur 1 heure, 5 heures et 24 heures.' },
    },
  ],
  images: [
    { src: labIAImg },
  ],
  stack: ['React', 'TypeScript', 'Cloudflare Workers', 'Workers AI', 'D1'],
  links: { demo: '#lab-ia' },
  facts: [
    { value: '5', label: { fr: 'niveaux ouverts' }, source: 'src/content/lab/ai.ts: levels with available: true' },
    { value: '10', label: { fr: 'niveaux prévus' }, source: 'src/content/lab/ai.ts: aiLabCurriculum' },
    { value: '39', label: { fr: 'tests du serveur' }, source: 'server/aiLab/handler.test.ts' },
  ],
  scale: { months: 1, tests: 39 },
}
