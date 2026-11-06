import type { Project } from '../types'
import chronoxImg from '../../assets/Projets/Chronox.webp'
import chronoxDashboardImg from '../../assets/Projets/Chronox_dashboard.png'
import chronoxWidgetImg from '../../assets/Projets/Chronox_widget.png'

export const chronox: Project = {
  slug: 'chronox',
  tier: 'card',
  status: 'development',
  stage: 'MVP',
  tracks: ['dev'],
  title: 'Chronox',
  period: { start: '2026-10' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Un widget Windows natif pour connaître mon temps de travail, sans cloud.',
  },
  summary: {
    fr: 'Curieux de connaître ma moyenne d’heures travaillées, j’ai créé Chronox : un widget Windows qui compte le temps de ma session active, avec des bilans par jour, semaine, mois et année.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Comment ça marche', en: 'How it works' },
      body: { fr: 'Écrit en C++, il enregistre le temps chaque minute. Performances mesurées sur un échantillon de 8 heures : environ 8 Mo de mémoire et 0,15 % d’un cœur.' },
    },
    {
      kind: 'limits',
      title: { fr: 'Vision', en: 'Vision' },
      body: { fr: 'Il pourrait ensuite reconnaître l’application au premier plan, rattacher le temps à des projets et préparer un compte rendu quotidien, relié à GitHub, l’agenda ou d’autres applications.' },
    },
  ],
  images: [
    { src: chronoxImg, note: { fr: 'Référence artistique de l’interface visée.' } },
    { src: chronoxDashboardImg, note: { fr: 'Capture réelle du tableau de bord : bilans du jour, de la semaine, du mois et de l’année.' } },
    { src: chronoxWidgetImg, note: { fr: 'Capture réelle du widget.' } },
  ],
  stack: ['C++', 'SQLite', 'GitHub Actions'],
  links: { github: 'https://github.com/JN13012/chronox' },
  facts: [],
  scale: { months: 1 },
}
