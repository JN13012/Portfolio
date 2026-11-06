import type { Project } from '../types'
import ulitLogoImg from '../../assets/Experiences/ULIT-removebg-preview.png'
import salesforceDevImg from '../../assets/Experiences/Salesforce_dev.webp'

export const salesforceExecutor: Project = {
  slug: 'salesforce-executor',
  tier: 'card',
  status: 'delivered',
  inProduction: { fr: 'En production chez ULIT', en: 'In production at ULIT' },
  tracks: ['dev'],
  title: 'Code Executor',
  // Code read in JN13012/Code-Executor---Salesforce (Jan–Feb 2026); work went on in the company's repo (no access).
  // Script chaining, users (QA and dev teams, ~20 people) and the end of the contract in June: Jérémie, 2026-10-26;
  // chaining also in his T-PRO-600 report (Epitech, June 2026).
  period: { start: '2026-01', end: '2026-06' },
  team: { size: 1 },
  context: 'work',
  tagline: {
    fr: 'Éditeur Apex dans Salesforce : chaînage de scripts, planification, logs. En production.',
    en: 'An Apex editor inside Salesforce: script chaining, scheduling, logs. In production.',
  },
  summary: {
    fr: 'Outil interne pour écrire, exécuter, enchaîner et planifier des scripts Apex directement dans Salesforce, avec la trace de chaque exécution et de chaque version. Utilisé par les équipes QA et dev d’ULIT (une vingtaine de personnes), toujours en production.',
    en: 'An internal tool to write, run, chain and schedule Apex scripts directly inside Salesforce, keeping track of every run and every version. Used by ULIT’s QA and dev teams (about twenty people), still in production.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Ce qu’il fait' },
      body: { fr: 'Erreurs localisées à la ligne, chaînage qui s’arrête au premier échec, planification, journaux téléchargeables, historique des versions, et droits Salesforce vérifiés avant chaque lecture ou écriture.' },
    },
  ],
  // GitHub languages of JN13012/Code-Executor---Salesforce (2026-10-24): JavaScript, Apex, HTML, CSS; LWC components.
  images: [
    { src: ulitLogoImg, emblemHeight: '40%' },
    { src: salesforceDevImg },
  ],
  stack: ['Apex', 'Lightning Web Components', 'JavaScript', 'Tooling API', 'HTML', 'CSS'],
  links: { privateRepo: true },
  facts: [
    { value: '≈ 20', label: { fr: 'utilisateurs', en: 'users' }, source: 'Jérémie, 2026-10-26: QA and dev teams' },
  ],
  scale: { months: 6 },
}
