import type { Project } from '../types'

export const kubernetes: Project = {
  slug: 'kubernetes',
  tier: 'card',
  status: 'delivered',
  tracks: ['devops'],
  title: 'Bernstein - Kubernetes',
  period: { start: '2026-06', end: '2026-06' },
  team: { size: 1 },
  context: 'epitech',
  tagline: {
    fr: 'Une app de vote en microservices déployée sur un cluster Kubernetes multi-nœuds.',
    en: 'A microservice voting app deployed on a multi-node Kubernetes cluster.',
  },
  summary: {
    fr: 'Une application de vote en microservices, déployée sur un cluster Kubernetes multi-nœuds.',
    en: 'A microservice voting app, deployed on a multi-node Kubernetes cluster.',
  },
  sections: [
    {
      kind: 'architecture',
      title: { fr: 'Architecture', en: 'Architecture' },
      points: [
        { label: { fr: 'Vote', en: 'Vote' }, text: { fr: 'une interface Flask envoie les votes dans une file Redis.', en: 'a Flask interface pushes votes into a Redis queue.' } },
        { label: { fr: 'Traitement', en: 'Processing' }, text: { fr: 'un worker Java les enregistre dans la base de données PostgreSQL.', en: 'a Java worker saves them in the PostgreSQL database.' } },
        { label: { fr: 'Résultats', en: 'Results' }, text: { fr: 'une application Node.js les affiche.', en: 'a Node.js app displays them.' } },
      ],
    },
    {
      kind: 'approach',
      title: { fr: 'Déploiement', en: 'Deployment' },
      points: [
        { label: { fr: 'Cluster', en: 'Cluster' }, text: { fr: 'k3d multi-nœuds, configuré entièrement en YAML.', en: 'multi-node k3d, configured entirely in YAML.' } },
        { label: { fr: 'Accès', en: 'Access' }, text: { fr: 'Traefik route le trafic entrant ; des droits par rôle (RBAC) lui permettent seulement de lire ses règles.', en: 'Traefik routes incoming traffic; role-based access control (RBAC) only lets it read its rules.' } },
        { label: { fr: 'Configuration', en: 'Configuration' }, text: { fr: 'ConfigMaps, et un Secret pour la base.', en: 'ConfigMaps, and a Secret for the database.' } },
        { label: { fr: 'Stockage', en: 'Storage' }, text: { fr: 'un volume persistant pour PostgreSQL.', en: 'a persistent volume for PostgreSQL.' } },
        { label: { fr: 'Supervision', en: 'Monitoring' }, text: { fr: 'cAdvisor sur chaque nœud.', en: 'cAdvisor on every node.' } },
      ],
    },
  ],
  stack: ['Kubernetes', 'k3d', 'Traefik', 'PostgreSQL', 'Redis'],
  links: { privateRepo: true },
  facts: [],
  scale: { months: 1 },
}
