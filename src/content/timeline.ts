import type { TimelineEntry } from './types'

// Experiences and education merged, most recent first.
// Source: legacy Experiences.jsx / Formations.jsx (migrated 2026-10-17) and Jérémie's answers.
// Jérémie prefers durations where exact dates were never given (decided 2026-10-17).

export const timeline: TimelineEntry[] = [
  {
    id: 'epitech-msc',
    kind: 'education',
    title: {
      fr: 'Master of Science — Architecte des systèmes d’information, spécialité cybersécurité',
      en: 'Master of Science — Information Systems Architect, cybersecurity track',
    },
    organisation: 'Epitech',
    place: { fr: 'Marseille', en: 'Marseille' },
    country: 'FR',
    period: { approx: { fr: '2025 – 2028', en: '2025 – 2028' } },
    current: true,
    summary: {
      fr: 'Cursus en alternance : architecture systèmes et réseaux, ingénierie logicielle, DevSecOps et cloud, sécurité réseau, audits et tests d’intrusion, gestion des risques et conformité (ISO 2700x, RGPD).',
      en: 'Work-study programme: systems and network architecture, software engineering, DevSecOps and cloud, network security, audits and penetration testing, risk management and compliance (ISO 2700x, GDPR).',
    },
    tracks: ['cyber', 'dev', 'ia'],
  },
  {
    id: 'ulit',
    kind: 'experience',
    title: { fr: 'Développeur full-stack (alternance)', en: 'Full-stack developer (work-study)' },
    organisation: 'ULIT',
    place: { fr: 'France', en: 'France' },
    country: 'FR',
    period: { start: '2026-01', end: '2026-06' },
    summary: {
      fr: 'Développement sur Salesforce : applications Apex, Lightning Web Components et JavaScript, et un éditeur de scripts interne.',
      en: 'Salesforce development: Apex, Lightning Web Components and JavaScript applications, plus an internal script editor.',
    },
    highlights: [
      {
        fr: 'Éditeur de scripts interne : exécution, historique, sauvegarde, versioning, planification et suivi des logs.',
        en: 'Internal script editor: execution, history, saving, versioning, scheduling and log tracking.',
      },
      {
        fr: 'Résolution de tickets : corrections, évolutions fonctionnelles, traitement des données et des processus métier.',
        en: 'Ticket resolution: fixes, feature changes, data processing and business processes.',
      },
      { fr: 'Mise en place de tests unitaires.', en: 'Unit tests.' },
    ],
    tracks: ['dev'],
  },
  {
    id: 'blockchain',
    kind: 'experience',
    title: { fr: 'Entrepreneur — infrastructure blockchain', en: 'Entrepreneur — blockchain infrastructure' },
    organisation: 'Indépendant',
    place: { fr: 'France', en: 'France' },
    country: 'FR',
    period: { approx: { fr: 'Depuis 2018', en: 'Since 2018' } },
    current: true,
    summary: {
      fr: 'Conception, assemblage et exploitation de fermes de minage (Ethereum avant le passage au Proof-of-Stake, Bitcoin, Raptoreum, Chia).',
      en: 'Design, assembly and operation of mining farms (Ethereum before Proof-of-Stake, Bitcoin, Raptoreum, Chia).',
    },
    highlights: [
      {
        fr: 'Administration et supervision sous HiveOS, Braiins OS, Linux et Windows ; automatisation des redémarrages, mises à jour et gestion d’erreurs.',
        en: 'Administration and monitoring on HiveOS, Braiins OS, Linux and Windows; automated restarts, updates and error handling.',
      },
      {
        fr: 'Optimisation des performances, de la consommation et du refroidissement (overclocking, undervolting).',
        en: 'Performance, power and cooling optimisation (overclocking, undervolting).',
      },
      {
        fr: 'Diagnostic des pannes et maintenance du matériel.',
        en: 'Hardware fault diagnosis and maintenance.',
      },
    ],
    tracks: ['dev'],
  },
  {
    id: 'motorsport',
    kind: 'experience',
    title: { fr: 'Technicien mécanique — compétition et maintenance', en: 'Mechanical technician — racing and maintenance' },
    organisation: 'G-Drive Racing · Renault · Wärtsilä',
    place: { fr: 'France et international', en: 'France and abroad' },
    country: 'FR',
    period: { approx: { fr: '5 ans, dont la saison WEC 2017', en: '5 years, including the 2017 WEC season' } },
    summary: {
      fr: 'Championnat du monde d’endurance 2017 avec G-Drive Racing, dont les 24 Heures du Mans : responsable des pneumatiques sur prototype LMP2.',
      en: '2017 FIA World Endurance Championship with G-Drive Racing, including the 24 Hours of Le Mans: tyre technician on an LMP2 prototype.',
    },
    highlights: [
      {
        fr: 'Pressions, préchauffage et préparation des trains de pneus ; ravitaillement et coordination des arrêts aux stands.',
        en: 'Tyre pressures, pre-heating and set preparation; refuelling and pit-stop coordination.',
      },
      {
        fr: 'Diagnostic et réparation automobile chez Renault.',
        en: 'Car diagnosis and repair at Renault.',
      },
      {
        fr: 'Contrôle et remise en service de pièces de moteurs marins et de groupes électrogènes chez Wärtsilä.',
        en: 'Inspection and recommissioning of marine engine and generator parts at Wärtsilä.',
      },
    ],
    tracks: [],
  },
  {
    id: 'ecole-performance',
    kind: 'education',
    title: {
      fr: 'Préparateur et développeur de véhicules de compétition (Bac+2)',
      en: 'Racing vehicle preparation and development (2-year degree)',
    },
    organisation: 'École de la Performance',
    place: { fr: 'Nogaro', en: 'Nogaro' },
    country: 'FR',
    period: { approx: { fr: '2017', en: '2017' } },
    summary: {
      fr: 'Formation aux métiers de technicien motoriste en sport automobile.',
      en: 'Training for engine technician roles in motorsport.',
    },
    tracks: [],
  },
  {
    id: 'rima',
    kind: 'experience',
    title: { fr: 'Combattant de l’infanterie', en: 'Infantry soldier' },
    organisation: '2e Régiment d’Infanterie de Marine',
    place: { fr: 'France', en: 'France' },
    country: 'FR',
    period: { approx: { fr: '2 ans', en: '2 years' } },
    summary: {
      fr: 'Formation militaire initiale, CPIS de Perpignan, stage au CNEC de Mont-Louis (franchissement, rusticité, autonomie).',
      en: 'Initial military training, CPIS Perpignan, CNEC Mont-Louis course (obstacle crossing, hardiness, autonomy).',
    },
    highlights: [
      {
        fr: 'Sang-froid, prise de décision et sens des responsabilités, utiles en environnement technique sous pression.',
        en: 'Composure, decision-making and responsibility, useful in high-pressure technical environments.',
      },
    ],
    tracks: [],
  },
]
