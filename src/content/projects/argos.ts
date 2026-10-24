import type { Project } from '../types'

// Verified in /home/cyber/work/Argos on 2026-10-17. Rebuilt on 2026-10-10: the current
// code is a company-data (OSINT) engine; the AI agent layer is documented design only.
export const argos: Project = {
  slug: 'argos',
  tier: 'dossier',
  status: 'development',
  showcase: 'perso-pro',
  tracks: ['cyber', 'ia'],
  title: 'Argos',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'epitech',
  summary: {
    fr: 'Projet de fin d’études Epitech en cybersécurité. Le premier module collecte des informations publiques sur les entreprises en gardant la source de chaque donnée ; une couche d’agents IA est en conception.',
    en: 'Epitech cybersecurity capstone. The first module collects public information about companies and keeps the source of every data point; an AI agent layer is being designed.',
  },
  angles: {
    cyber: {
      fr: 'Un cadre légal écrit avant le code : sources publiques et API officielles uniquement, données personnelles minimisées.',
      en: 'A legal framework written before the code: public sources and official APIs only, minimal personal data.',
    },
    ia: {
      fr: 'Architecture prévue pour des agents IA (capacités, workflows, pilotage), documentée et pas encore implémentée.',
      en: 'An architecture planned for AI agents (capabilities, workflows, orchestration), documented and not built yet.',
    },
  },
  sections: [
    {
      kind: 'architecture',
      title: { fr: 'Le moteur', en: 'The engine' },
      body: {
        fr: 'Python, connecteur à l’API publique INSEE SIRENE, base SQLite. Chaque observation est enregistrée avec sa source et sa date : une donnée sans provenance est refusée. Les rapports sont générés en Markdown.',
        en: 'Python, a connector to the public INSEE SIRENE API, SQLite storage. Every observation is stored with its source and date: data without provenance is refused. Reports are generated in Markdown.',
      },
    },
    {
      kind: 'security',
      title: { fr: 'Le cadre légal', en: 'Legal framework' },
      body: {
        fr: 'Un document fixe les règles du projet : sources publiques ou API officielles, respect des conditions d’utilisation, organisations plutôt que personnes, aucune prise de contact automatisée.',
        en: 'A document sets the project rules: public sources or official APIs, respect for terms of use, organisations rather than people, no automated outreach.',
      },
    },
    {
      kind: 'limits',
      title: { fr: 'Où en est le projet', en: 'Where it stands' },
      body: {
        fr: 'Dépôt reconstruit sur une base propre le 10 octobre 2026. L’intégration de modèles de langage viendra une fois le moteur stabilisé.',
        en: 'Repository rebuilt from a clean baseline on 10 October 2026. Language-model integration will come once the engine is stable.',
      },
    },
  ],
  stack: ['Python', 'httpx', 'SQLite', 'pytest'],
  links: { github: 'https://github.com/JN13012/Argos' },
  facts: [
    { value: '62', label: { fr: 'tests', en: 'tests' }, source: 'tracked test functions in tests/ (2026-10-17)' },
  ],
  scale: { months: 3, tests: 62 },
  doNotClaim: ['Working AI agents or LLM integration as current features', 'Untracked frontend or reporting as versioned'],
}
