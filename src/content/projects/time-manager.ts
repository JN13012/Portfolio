import type { Project } from '../types'

export const timeManager: Project = {
  slug: 'time-manager',
  tier: 'card',
  status: 'development',
  tracks: ['dev'],
  title: 'Time Manager',
  period: { start: '2026-10' },
  // 4 authors in git shortlog (2026-10-24): cassidy-epitech, cyrine, Jérémie, Aboubakr.
  team: { size: 4, role: { fr: 'backend', en: 'back end' } },
  context: 'epitech',
  tagline: {
    fr: 'App de pointage : employés, équipes et indicateurs, connexion Microsoft.',
    en: 'A time-clock app: employees, teams and KPIs, Microsoft sign-in.',
  },
  summary: {
    fr: 'Une application de pointage pour une enseigne fictive : les employés pointent, les managers gèrent leurs équipes et suivent des indicateurs.',
    en: 'A time-clock app for a fictional retailer: employees clock in, managers run their teams and follow KPIs.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Fonctionnalités', en: 'Features' },
      points: [
        { label: { fr: 'Pointage', en: 'Clocking' }, text: { fr: 'arrivées, départs et corrections.', en: 'arrivals, departures and corrections.' } },
        { label: { fr: 'Connexion', en: 'Sign-in' }, text: { fr: 'par e-mail ou par Microsoft (Entra ID), sans inscription libre.', en: 'by email or Microsoft (Entra ID), with no open sign-up.' } },
      ],
    },
    {
      kind: 'architecture',
      title: { fr: 'Architecture', en: 'Architecture' },
      points: [
        { label: { fr: 'Services', en: 'Services' }, text: { fr: 'Caddy en entrée, API NestJS, PostgreSQL, front React.', en: 'Caddy in front, NestJS API, PostgreSQL, React front end.' } },
        { label: { fr: 'Déploiement', en: 'Deployment' }, text: { fr: 'Docker, avec migrations automatiques.', en: 'Docker, with automatic migrations.' } },
      ],
    },
    {
      kind: 'result',
      title: { fr: 'Ma part', en: 'My part' },
      points: [
        { label: { fr: 'Base de données', en: 'Database' }, text: { fr: 'tout le schéma (utilisateurs, équipes, appartenances, pointages, corrections), avec ses migrations et ses tests.', en: 'the whole schema (users, teams, memberships, time entries, corrections), with its migrations and tests.' } },
        { label: { fr: 'API des équipes', en: 'Teams API' }, text: { fr: 'validation, accès aux données, règles métier, droits du manager, archivage, puis les routes et le contrôleur, testés.', en: 'validation, data access, business rules, manager rights, archiving, then the routes and controller, tested.' } },
      ],
    },
  ],
  stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Drizzle', 'React', 'Microsoft Entra ID', 'Caddy', 'Docker Compose', 'Vitest'],
  links: { privateRepo: true },
  facts: [],
  scale: { months: 1, tests: 68 },
}
