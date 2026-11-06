import type { Project } from '../types'
import smartfridgeImg from '../../assets/Projets/Smartfridge.png'

export const smartFridge: Project = {
  slug: 'smart-fridge',
  tier: 'card',
  status: 'delivered',
  tracks: [],
  title: 'Smart Fridge',
  period: { start: '2025-12', end: '2025-12' },
  // Team of 3 (Jérémie, 2026-10-26).
  team: { size: 3 },
  context: 'epitech',
  tagline: {
    fr: 'Conception d’un produit : marché, personas, risques, budget et planning.',
    en: 'Designing a product: market, personas, risks, budget and planning.',
  },
  summary: {
    fr: 'Le pilotage de la conception d’un réfrigérateur connecté, du marché au planning.',
    en: 'Running the design of a connected fridge, from the market to the schedule.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Livrables', en: 'Deliverables' },
      points: [
        { label: { fr: 'Cadrage', en: 'Framing' }, text: { fr: 'brainstorming et présentation du projet.', en: 'brainstorming and project presentation.' } },
        { label: { fr: 'Utilisateurs', en: 'Users' }, text: { fr: 'personas de l’équipe et du client.', en: 'team and customer personas.' } },
        { label: { fr: 'Marché', en: 'Market' }, text: { fr: 'analyses SWOT et PESTEL.', en: 'SWOT and PESTEL analyses.' } },
        { label: { fr: 'Pilotage', en: 'Steering' }, text: { fr: 'indicateurs, cartographie des risques, budget et ressources.', en: 'KPIs, risk map, budget and resources.' } },
        { label: { fr: 'Planning', en: 'Schedule' }, text: { fr: 'diagramme de Gantt, avec les risques.', en: 'Gantt chart, with the risks.' } },
      ],
    },
  ],
  images: [
    { src: smartfridgeImg },
  ],
  stack: ['Gestion de projet'],
  links: { github: 'https://github.com/JN13012/Smart-Fridge' },
  facts: [],
  scale: { months: 1 },
}
