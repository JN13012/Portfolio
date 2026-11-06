import type { Project } from '../types'
import hackathonCitizImg from '../../assets/Projets/Hackathon_Citiz.webp'

export const hackathonCitiz: Project = {
  slug: 'hackathon-citiz',
  tier: 'card',
  status: 'delivered',
  award: { fr: '2e place', en: '2nd place' },
  tracks: ['data', 'ia'],
  title: 'Hackathon Microsoft × Citiz',
  period: { start: '2026-10', end: '2026-10' },
  // 5 authors in git shortlog of Epitech2026-2027/T-HAK-700-MAR-7-1-hack-7 (2026-10-24); 5 roles in its README.
  team: { size: 5, role: { fr: 'data engineer géospatial', en: 'geospatial data engineer' } },
  context: 'hackathon',
  tagline: {
    fr: 'Où ouvrir une station d’autopartage : réseau piéton de 16,6 M de nœuds.',
    en: 'Where to open a car-sharing station: a 16.6 M-node pedestrian network.',
  },
  summary: {
    fr: '2e place au hackathon Epitech pour la conception d’un outil d’aide à la décision : où ouvrir des stations d’autopartage Citiz pour desservir le plus d’habitants au moindre coût.',
    en: '2nd place at the Epitech hackathon for designing a decision tool: where to open Citiz car-sharing stations to serve the most residents at the lowest cost.',
  },
  // geo/download_osm_ara.py (Jérémie's commits): Geofabrik extracts archived with a checksum.
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Comment ça marche' },
      body: { fr: 'L’outil s’appuie sur des données publiques : population, emplois, équipements, ménages sans voiture, arrêts de transport et réseau piéton OpenStreetMap de 16,6 millions de nœuds. Nous les avons extraites, nettoyées et croisées pour mesurer ce qui est accessible à 5 minutes à pied. Un modèle LightGBM utilise toutes ces données pour noter chaque zone.' },
    },
  ],
  images: [
    { src: hackathonCitizImg },
  ],
  stack: ['Python', 'Pandas', 'GeoPandas', 'OSMnx', 'NetworkX', 'SciPy', 'Parquet', 'Leaflet', 'Docker'],
  links: { privateRepo: true },
  facts: [
    { value: '2e', label: { fr: 'place', en: 'place' }, source: 'Jérémie, 2026-10-24 (proof on request)' },
    { value: '1', label: { fr: 'semaine', en: 'week' }, source: 'T-HAK-700 README: hackathon 19–21/10/2026, defence 23/10' },
  ],
  scale: { months: 1 },
}
