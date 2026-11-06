import type { Project } from '../types'
import oTPRCSImg from '../../assets/Projets/OTP_RCS.webp'

export const generateurOtpRcs: Project = {
  slug: 'generateur-otp-rcs',
  tier: 'card',
  status: 'delivered',
  award: { fr: '4e place', en: '4th place' },
  tracks: ['cyber', 'dev'],
  title: 'Générateur OTP RCS',
  period: { start: '2026-06', end: '2026-06' },
  // Jérémie's commits: OTP service, repositories, IP rate limiting, DTO validation.
  // 4 people (Jérémie, 2026-10-26; git shortlog: Jérémie, Hatim, Marwan, Séverine).
  team: { size: 4, role: { fr: 'backend et sécurité applicative', en: 'backend and application security' } },
  context: 'hackathon',
  tagline: {
    fr: 'Backend 2FA : codes à 6 chiffres envoyés par RCS, hachés et à essais limités.',
    en: 'A 2FA back end: 6-digit codes sent over RCS, hashed and rate-limited.',
  },
  summary: {
    fr: '4e place au hackathon inter-écoles pour la conception, en 4 jours, d’un service d’authentification à deux facteurs qui envoie les codes par RCS.',
    en: '4th place at an inter-school hackathon for designing, in 4 days, a two-factor authentication service sending codes over RCS.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Fonctionnalités' },
      points: [
        { label: { fr: 'Envoi' }, text: { fr: 'un code à 6 chiffres, envoyé par RCS avec l’API smsmode.' } },
        { label: { fr: 'Expiration' }, text: { fr: '5 minutes de validité, 3 essais au plus.' } },
      ],
    },
    {
      kind: 'security',
      title: { fr: 'Sécurité' },
      points: [
        { label: { fr: 'Stockage' }, text: { fr: 'seule l’empreinte SHA-256 du code est gardée.' } },
        { label: { fr: 'Limitation' }, text: { fr: 'par numéro de téléphone et par adresse IP.' } },
      ],
    },
    {
      kind: 'result',
      title: { fr: 'Ma part' },
      body: { fr: 'Le service OTP, les accès à la base MongoDB, la limitation par IP et la validation des requêtes.' },
    },
  ],
  images: [
    { src: oTPRCSImg },
  ],
  stack: ['NestJS', 'TypeScript', 'MongoDB', 'Docker Compose', 'Swagger'],
  links: { github: 'https://github.com/JN13012/Generateur_Code_OTP' },
  facts: [
    { value: '4e', label: { fr: 'place', en: 'place' }, source: 'Jérémie, 2026-10-28 (ranking correction)' },
    { value: '4 jours', label: { fr: 'de hackathon', en: 'hackathon days' }, source: 'git log: 2026-06-03 → 2026-06-06' },
  ],
  scale: { months: 1 },
}
