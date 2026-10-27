import type { TimelineEntry } from './types'

// Experiences and education on one axis, most recent first (the order of the list on small screens).
// Source: legacy Experiences.jsx / Formations.jsx (migrated 2026-10-17) and Jérémie's answers (2026-10-24):
// Army from Q4 2014 until the work-study starts, École de la Performance 2017 (work-study, alongside the first mechanics year), mechanics 2017–07/2025 (G-Drive, then Wärtsilä, then Renault),
// mining 2018–09/2022 then personal crypto investing, Pré-MSc from 09/2025, MSc year 1 since 2026, ULIT internship until 06/2026.
// Where only years are known, `span` covers whole years; `periodLabel` says only what is known.
// `span.end` is the last month (inclusive).

export const timeline: TimelineEntry[] = [
  {
    id: 'epitech-msc',
    kind: 'education',
    title: {
      fr: 'Master of Science - Architecte des systèmes d’information',
      en: 'Master of Science - Information Systems Architect',
    },
    short: { fr: 'Master of Science - Epitech', en: 'Master of Science - Epitech' },
    organisations: [{ name: 'Epitech', url: 'https://www.epitech.eu/formation-alternance/master-of-science-post-bac3/', place: { fr: 'Marseille (13)', en: 'Marseille (13)' } }],
    country: 'FR',
    span: { start: '2026-09' },
    expectedEnd: '2028-08',
    periodLabel: { fr: '2026 – 2028 · diplôme prévu en 2028', en: '2026 – 2028 · expected to graduate in 2028' },
    badge: { fr: 'En cours · 1re année de master', en: 'Ongoing · first year of the master’s' },
    tone: 'tech',
    current: true,
    summary: {
      fr: 'Master informatique Bac+5 : une pédagogie par projets, au plus près des conditions de l’entreprise, pour devenir expert de sa spécialité.',
      en: 'Master’s-level (Bac+5) computing degree: project-based learning, as close as possible to real company conditions, to become an expert in one’s field.',
    },
    highlights: [
      {
        fr: 'En alternance : 4 jours en entreprise, 1 jour à l’école. Entreprise d’accueil recherchée.',
        en: 'Work-study: 4 days at a company, 1 day at school. Looking for a host company.',
      },
      {
        fr: 'Concevoir, déployer et piloter des projets techniques : gestion de projet, qualité, méthodes Agile.',
        en: 'Designing, deploying and running technical projects: project management, quality, Agile methods.',
      },
      {
        fr: 'Projet de fin d’études sur un an et demi : de l’analyse du besoin et du design thinking jusqu’à la production.',
        en: 'Final-year project over eighteen months: from needs analysis and design thinking to production.',
      },
      {
        fr: 'Anglais technique, pour travailler dans un environnement international.',
        en: 'Technical English, to work in an international environment.',
      },
      {
        fr: 'Spécialisation à choisir en janvier 2027.',
        en: 'Specialisation to be chosen in January 2027.',
      },
    ],
    tags: ['Architecture SI', 'Gestion de projet', 'Agile', 'Design thinking', 'Anglais technique'],
    tracks: ['cyber', 'dev', 'ia'],
  },
  {
    id: 'ulit',
    kind: 'experience',
    title: { fr: 'Développeur full-stack Salesforce', en: 'Full-stack Salesforce developer' },
    short: { fr: 'ULIT', en: 'ULIT' },
    organisations: [{ name: 'ULIT', url: 'https://usersloveit.com/wp/' }],
    country: 'FR',
    span: { start: '2026-01', end: '2026-06' },
    periodLabel: { fr: '01/2026 – 06/2026', en: '01/2026 – 06/2026' },
    badge: { fr: 'Stage · 6 mois', en: 'Internship · 6 months' },
    tone: 'tech',
    summary: {
      fr: 'Développement sur Salesforce : applications Apex, Lightning Web Components et JavaScript, et un éditeur de scripts interne utilisé en production.',
      en: 'Salesforce development: Apex, Lightning Web Components and JavaScript applications, plus an internal script editor used in production.',
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
    note: {
      fr: 'Code et captures confidentiels : rien n’est publié.',
      en: 'Code and screenshots are confidential: nothing is published.',
    },
    tags: ['Apex', 'LWC', 'JavaScript', 'Salesforce', 'Tests unitaires'],
    tracks: ['dev'],
  },
  {
    id: 'epitech-pre-msc',
    kind: 'education',
    title: { fr: 'Pré-MSc', en: 'Pre-MSc' },
    short: { fr: 'Pré-MSc', en: 'Pre-MSc' },
    organisations: [{ name: 'Epitech', url: 'https://www.epitech.eu/formation-alternance/pre-msc-post-bac2/', place: { fr: 'Marseille (13)', en: 'Marseille (13)' } }],
    country: 'FR',
    span: { start: '2025-09', end: '2026-08' },
    periodLabel: { fr: '09/2025 – 2026', en: '09/2025 – 2026' },
    tone: 'tech',
    summary: {
      fr: 'Année préparatoire au Master of Science.',
      en: 'Preparatory year for the Master of Science.',
    },
    highlights: [
      {
        fr: 'La « piscine » : quatre mois d’immersion intensive dans le code pour poser les bases de la programmation.',
        en: 'The “pool”: four months of intensive immersion in code to lay the programming foundations.',
      },
      {
        fr: 'Développement en Python et en Java, développement web.',
        en: 'Python and Java development, web development.',
      },
      {
        fr: 'Initiation au DevOps, à l’IA, à la data et à la cybersécurité.',
        en: 'Introduction to DevOps, AI, data and cybersecurity.',
      },
    ],
    tags: ['Python', 'Java', 'Web', 'DevOps', 'IA', 'Data', 'Cybersécurité'],
    tracks: ['cyber', 'dev'],
  },
  {
    id: 'crypto',
    kind: 'experience',
    title: { fr: 'Investissement et veille crypto', en: 'Crypto investing and monitoring' },
    short: { fr: 'Veille crypto', en: 'Crypto watch' },
    organisations: [{ name: 'Personnel' }],
    country: 'FR',
    span: { start: '2022-10' },
    periodLabel: { fr: 'Depuis 2022', en: 'Since 2022' },
    badge: { fr: 'Activité personnelle', en: 'Personal activity' },
    tone: 'personal',
    row: 1,
    current: true,
    summary: {
      fr: 'Après le minage, je reste investi à titre personnel et je suis de près l’écosystème crypto : évolutions des protocoles, sécurité, régulation et trading.',
      en: 'After mining, I stay invested on a personal basis and follow the crypto ecosystem closely: protocol changes, security, regulation and trading.',
    },
    tracks: [],
  },
  {
    id: 'blockchain',
    kind: 'experience',
    title: { fr: 'Infrastructure de minage', en: 'Mining infrastructure' },
    short: { fr: 'Minage', en: 'Mining' },
    organisations: [{ name: 'Indépendant' }],
    country: 'FR',
    span: { start: '2018-01', end: '2022-09' },
    periodLabel: { fr: '2018 – 09/2022', en: '2018 – 09/2022' },
    tone: 'before',
    row: 1,
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
      // Told by Jérémie on 2026-10-26.
      {
        fr: 'Optimisation des stratégies de minage sur Ethereum : Flashbots et Maximal Extractable Value (MEV).',
        en: 'Optimising mining strategies on Ethereum: Flashbots and Maximal Extractable Value (MEV).',
      },
      { fr: 'Diagnostic des pannes et maintenance du matériel.', en: 'Hardware fault diagnosis and maintenance.' },
    ],
    tags: ['Linux', 'HiveOS', 'Supervision', 'Automatisation', 'Hardware'],
    tracks: ['dev'],
  },
  {
    id: 'motorsport',
    kind: 'experience',
    title: { fr: 'Technicien mécanique - compétition et maintenance', en: 'Mechanical technician - racing and maintenance' },
    short: { fr: 'Sport auto · mécanique', en: 'Motorsport · mechanics' },
    organisations: [
      { name: 'G-Drive Racing', url: 'https://www.gdriveracing.com/', place: { fr: 'Saint-Aunès (34)', en: 'Saint-Aunès (34)' } },
      { name: 'Wärtsilä', url: 'https://www.wartsila.com/', place: { fr: 'Marseille (13)', en: 'Marseille (13)' } },
      { name: 'Renault', url: 'https://www.renault.fr/', place: { fr: 'Marseille (13)', en: 'Marseille (13)' } },
    ],
    country: 'FR',
    span: { start: '2017-01', end: '2025-07' },
    periodLabel: { fr: '2017 – 07/2025', en: '2017 – 07/2025' },
    tone: 'before',
    summary: {
      fr: 'Mécanique en compétition, puis en maintenance industrielle et en atelier automobile.',
      en: 'Mechanics in motorsport, then in industrial maintenance and in a car workshop.',
    },
    highlights: [
      {
        fr: 'G-Drive Racing : championnat du monde d’endurance 2017, 1re place en LMP2 aux 6 Heures de Spa-Francorchamps (Belgique, 6 mai 2017) et participation aux 24 Heures du Mans. Responsable des pneumatiques sur prototype LMP2 (pressions, préchauffage, préparation des trains de pneus) et ravitaillement en carburant lors des arrêts aux stands.',
        en: 'G-Drive Racing: 2017 FIA World Endurance Championship, 1st place in LMP2 at the 6 Hours of Spa-Francorchamps (Belgium, 6 May 2017) and the 24 Hours of Le Mans. Tyre technician on an LMP2 prototype (pressures, pre-heating, set preparation) and refuelling during pit stops.',
      },
      {
        fr: 'Wärtsilä : contrôle et remise en service de pièces de moteurs marins et de groupes électrogènes.',
        en: 'Wärtsilä: inspection and recommissioning of marine engine and generator parts.',
      },
      { fr: 'Renault : diagnostic et réparation automobile.', en: 'Renault: car diagnosis and repair.' },
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
    short: { fr: 'Bac+2', en: '2-yr degree' },
    organisations: [{ name: 'École de la Performance', url: 'https://www.ecoleperformance.com/formations/technicien-de-competition-option-automobile', place: { fr: 'Nogaro (32)', en: 'Nogaro (32)' } }],
    country: 'FR',
    span: { start: '2017-01', end: '2017-12' },
    periodLabel: { fr: '2017', en: '2017' },
    badge: { fr: 'Alternance', en: 'Work-study' },
    tone: 'before',
    summary: {
      fr: 'Formation en alternance de technicien de compétition : préparer, optimiser et régler une voiture de course, de l’atelier jusqu’au circuit.',
      en: 'Work-study training as a motorsport technician: preparing, optimising and setting up a race car, from the workshop to the track.',
    },
    highlights: [
      {
        fr: 'Moteur et boîte de vitesses : préparation et optimisation pour la performance.',
        en: 'Engine and gearbox: preparation and optimisation for performance.',
      },
      {
        fr: 'Cartographie : temps d’injection, richesse, avance à l’allumage.',
        en: 'Mapping: injection time, air-fuel ratio, ignition advance.',
      },
      {
        fr: 'Châssis et suspensions : réglages pour adapter la voiture au circuit et au pilote.',
        en: 'Chassis and suspension: set-up to suit the track and the driver.',
      },
      {
        fr: 'Mise en pratique en entreprise et en conditions de course.',
        en: 'Hands-on practice in a racing company and in race conditions.',
      },
    ],
    tags: ['Moteur', 'Boîte de vitesses', 'Cartographie', 'Allumage', 'Suspensions'],
    tracks: [],
  },
  {
    id: 'rima',
    kind: 'experience',
    title: { fr: 'Formation militaire', en: 'Military training' },
    short: { fr: 'Armée de terre', en: 'French Army' },
    organisations: [{ name: 'Armée de terre' }],
    country: 'FR',
    span: { start: '2014-10', end: '2016-12' },
    periodLabel: { fr: '2014 – 2016', en: '2014 – 2016' },
    tone: 'before',
    summary: {
      fr: 'De la préparation commando à l’engagement comme militaire du rang : rigueur, endurance et esprit d’équipe en conditions exigeantes.',
      en: 'From commando preparation to serving as an enlisted soldier: discipline, endurance and team spirit in demanding conditions.',
    },
    highlights: [
      {
        fr: 'Préparation militaire commando au Centre parachutiste d’instruction spécialisée (CPIS) de Perpignan.',
        en: 'Commando military preparation at the Specialised Parachute Training Centre (CPIS) in Perpignan.',
      },
      {
        fr: 'Stage au Centre national d’entraînement commando (CNEC) de Mont-Louis : franchissement, rusticité, autonomie.',
        en: 'Course at the National Commando Training Centre (CNEC) in Mont-Louis: obstacle crossing, hardiness, autonomy.',
      },
      {
        fr: 'Engagement et formation initiale de militaire du rang au 2e Régiment d’infanterie de marine (2e RIMa).',
        en: 'Enlistment and initial enlisted soldier training with the 2nd Marine Infantry Regiment (2e RIMa).',
      },
    ],
    tracks: [],
  },
]
