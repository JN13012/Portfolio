import type { Project } from '../types'
import arenaDashboardImg from '../../assets/Projets/Arena_Dashboard.webp'
import arenaPathImg from '../../assets/Projets/Arena_Path.webp'

export const argosSecurityArena: Project = {
  slug: 'argos-security-arena',
  tier: 'card',
  status: 'development',
  stage: 'POC',
  tracks: ['cyber', 'ia'],
  // Repo JN13012/Lab_CTF (README: « Atlas Academy »), last commit 2026-10-02; title kept by Jérémie (2026-10-26).
  // Separate from Argos (Argos Product Brief v2.4 §4: « cyber range d’entraînement et de benchmark »): never say it is
  // Argos's arena. Positioned first as an AI-agent benchmark platform (Jérémie, 2026-10-26); only the human training UI exists.
  title: 'Argos Security Arena',
  period: { start: '2026-06' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Plateforme de benchmark et d’entraînement en cybersécurité, pour les humains comme pour les agents IA.',
    en: 'A benchmark platform for AI agents: testing them on vulnerable scenarios.',
  },
  summary: {
    fr: 'Une plateforme de benchmark et d’entraînement en cybersécurité, pour les humains comme pour les agents IA, sur des scénarios dont on connaît les failles, avec scores et classements.',
    en: 'A cybersecurity benchmark and training platform, built first for AI agents, then for people.',
  },
  sections: [
    {
      kind: 'result',
      title: { fr: 'Où en est le projet' },
      body: { fr: 'En pause, elle sera reprise en parallèle d’Argos pour le tester. L’interface d’entraînement existe ; le benchmark et le backend restent à développer.' },
    },
  ],
  images: [
    { src: arenaDashboardImg },
    { src: arenaPathImg },
  ],
  stack: ['React', 'Tailwind CSS', 'Vitest', 'GitHub Actions'],
  links: { github: 'https://github.com/JN13012/Lab_CTF' },
  facts: [],
  scale: { months: 4, tests: 31 },
}
