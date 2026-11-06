import type { Project } from '../types'
import chatflowImg from '../../assets/Projets/Chatflow.webp'

export const chatflow: Project = {
  slug: 'chatflow',
  tier: 'card',
  status: 'delivered',
  tracks: ['dev'],
  title: 'ChatFlow',
  period: { start: '2026-03', end: '2026-04' },
  // Jérémie's commits touch ChatFlow/api and ChatFlow/client; role given by Jérémie (2026-10-24).
  team: { size: 4, role: { fr: 'backend', en: 'back end' } },
  context: 'epitech',
  tagline: {
    fr: 'Messagerie temps réel : serveurs, salons, rôles, sur le web et en desktop.',
    en: 'Real-time messaging: servers, channels, roles, on the web and desktop.',
  },
  summary: {
    fr: 'Une messagerie temps réel façon plateforme communautaire, sur le web et en application desktop.',
    en: 'A real-time community messaging app, on the web and desktop.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Fonctionnalités', en: 'Features' },
      points: [
        { label: { fr: 'Communautés', en: 'Communities' }, text: { fr: 'serveurs, salons, membres, rôles et invitations.', en: 'servers, channels, members, roles and invitations.' } },
        { label: { fr: 'Messages', en: 'Messages' }, text: { fr: 'en temps réel, avec réactions, pièces jointes, messages privés et amis.', en: 'real time, with reactions, attachments, direct messages and friends.' } },
        { label: { fr: 'Clients', en: 'Clients' }, text: { fr: 'un site Next.js multilingue et une application Electron (Windows, macOS, Linux).', en: 'a multilingual Next.js site and an Electron app (Windows, macOS, Linux).' } },
      ],
    },
    {
      kind: 'architecture',
      title: { fr: 'Architecture', en: 'Architecture' },
      points: [
        { label: { fr: 'API', en: 'API' }, text: { fr: 'Express, Prisma et MySQL, documentée avec Swagger.', en: 'Express, Prisma and MySQL, documented with Swagger.' } },
        { label: { fr: 'Temps réel', en: 'Real time' }, text: { fr: 'Socket.IO.', en: 'Socket.IO.' } },
        { label: { fr: 'Fichiers', en: 'Files' }, text: { fr: 'stockés dans MinIO.', en: 'stored in MinIO.' } },
      ],
    },
  ],
  images: [
    { src: chatflowImg },
  ],
  stack: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Socket.IO', 'Next.js', 'React', 'Electron', 'Docker', 'Jest'],
  links: { privateRepo: true },
  facts: [],
  scale: { months: 2, tests: 110 },
}
