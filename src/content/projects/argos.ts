import type { Project } from '../types'
import argosEmblemImg from '../../assets/Logos/Argos_Emblem.webp'
import argosDashboardImg from '../../assets/Projets/Argos_Dashboard.webp'
import argosParcoursImg from '../../assets/Projets/Argos_Parcours.webp'

// Verified in /home/cyber/work/Argos on 2026-10-17 and 2026-10-26. Personal project (Jérémie, 2026-10-26).
// Vision: Obsidian Work/Argos/Vision Version.md (V1–V6, 23 sub-steps, 2026-10-24). The code today is the first
// brick of the OSINT engine (SIRENE discovery, provenance, Markdown reports); everything else is design.
export const argos: Project = {
  slug: 'argos',
  tier: 'dossier',
  status: 'development',
  stage: 'POC',
  tracks: ['cyber', 'ia'],
  title: 'Argos',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Projet de plateforme de cybersécurité pilotée par IA pour les PME, du web à l’industrie.',
  },
  summary: {
    fr: 'Un projet de plateforme de cybersécurité pilotée par IA pour les PME sans équipe cyber : auditer, surveiller et faire corriger leur sécurité, avec une validation humaine à chaque étape.',
  },
  angles: {
    cyber: {
      fr: 'Six domaines d’audit prévus, du web à l’industrie, et un cadre écrit avant le code : mandat et périmètre non contournables, sources publiques, respect du RGPD.',
      en: 'Six planned audit domains, from web apps to industry, and a framework written before the code: mandate and scope that cannot be bypassed, public sources, GDPR compliance.',
    },
    ia: {
      fr: 'Des agents IA prévus pour planifier, analyser et rapprocher les données, avec une règle : l’IA assiste, les capacités essentielles fonctionnent sans elle. Encore à développer.',
      en: 'AI agents planned to plan, analyse and link data, under one rule: the AI assists, core capabilities work without it. Still to be built.',
    },
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Ce qu’Argos couvrira' },
      body: { fr: 'Six domaines prévus :' },
      points: [
        { text: { fr: 'Applications web' } },
        { text: { fr: 'IA et agents' } },
        { text: { fr: 'Réseau' } },
        { text: { fr: 'Identités et cloud' } },
        { text: { fr: 'Détection et réponse aux incidents' } },
        { text: { fr: 'Environnements spécialisés' } },
      ],
    },
    {
      // The pentest brick is only an empty module (argos/backend/attack/pentest, read on 2026-11-02): no execution capability.
      kind: 'result',
      title: { fr: 'Où en est le projet' },
      body: { fr: 'Le début du moteur OSINT est en place et la structure de la brique pentest est posée. Les agents IA et les six domaines restent à développer.' },
    },
  ],
  imageNote: {
    fr: 'Maquette de l’interface cible, pas encore développée.',
    en: 'Mock-up of the target interface, not built yet.',
  },
  images: [
    { src: argosEmblemImg, emblemHeight: '100%' },
    { src: argosDashboardImg },
    { src: argosParcoursImg },
  ],
  stack: ['Python', 'FastAPI', 'Pydantic', 'React', 'SQLite', 'pytest'],
  links: { github: 'https://github.com/JN13012/Argos' },
  facts: [
    { value: '6', label: { fr: 'domaines de sécurité prévus', en: 'planned security domains' }, source: 'Obsidian Work/Argos/Vision Version.md (V1–V6)' },
  ],
  scale: { months: 3, tests: 67 },
}
