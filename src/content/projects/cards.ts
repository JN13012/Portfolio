import type { Project } from '../types'

// « Autres réalisations ». Teams counted with git shortlog (JN13 = Jérémie) on 2026-10-17; for course projects
// re-uploaded in one commit, sizes given by Jérémie on 2026-10-26 (Vaultborn 3, Smart Fridge 3, POPEYE and My_Marvin solo).

export const cards: Project[] = [
  {
    // Figures from the FraudSignal README and results/ (commit 4cd29f2), read on 2026-11-01.
    slug: 'fraudsignal',
    tier: 'card',
    status: 'delivered',
    tracks: ['ia', 'cyber'],
    title: 'FraudSignal',
    period: { start: '2026-11', end: '2026-11' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'Un pipeline LLM qui analyse les messages suspects et demande une relecture si besoin.',
    },
    summary: {
      fr: 'FraudSignal analyse les e-mails, SMS et messages WhatsApp suspects. Gemini rend un verdict appuyé par des signaux cités dans le message, et le code décide quand un humain doit vérifier. C’est une aide à la décision, pas une preuve de fraude.',
    },
    sections: [
      {
        kind: 'result',
        title: { fr: 'Résultats' },
        body: { fr: 'Sur 180 messages fictifs, F1 de 0,99 sur la fraude, contre 0,81 pour une référence TF-IDF. 34 messages partent en relecture, dont les 11 où le modèle se trompe.' },
      },
      {
        kind: 'security',
        title: { fr: 'Prompt injection' },
        body: { fr: 'Sur 48 tests de prompt injection, aucun n’a modifié le verdict.' },
      },
    ],
    // The visual says itself that it is an excerpt on a fictional message: results/gemini_v3.jsonl, fraud-fr-sms-01.
    stack: ['Python', 'Gemini', 'Vertex AI', 'FastAPI', 'Cloud Run', 'Docker', 'scikit-learn'],
    links: { github: 'https://github.com/JN13012/FraudSignal' },
    facts: [
      { value: '180', label: { fr: 'messages fictifs' }, source: 'FraudSignal: data/messages.json, README « Evaluation »' },
      { value: '48', label: { fr: 'tests de prompt injection' }, source: 'FraudSignal: data/injections.json, README « Prompt injection »' },
    ],
    scale: { months: 1, tests: 104 },
    doNotClaim: ['A live service or demo: it was deployed, measured, then stopped', 'Real-world accuracy: the dataset is fictional and the figures are not a held-out test', 'Resistance to adaptive attackers', 'Billed cost: the per-message cost is an estimate from list prices'],
  },
  {
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
        body: { fr: 'Il pourrait ensuite reconnaître l’application au premier plan, rattacher le temps à des projets et préparer un compte rendu quotidien, relié à GitHub, Jira, l’agenda ou d’autres applications.' },
      },
    ],
    imageNotes: [
      { fr: 'Référence artistique de l’interface visée.' },
      { fr: 'Capture réelle du widget.' },
    ],
    stack: ['C++', 'SQLite', 'GitHub Actions'],
    links: { github: 'https://github.com/JN13012/chronox' },
    facts: [],
    scale: { months: 1 },
    doNotClaim: ['A finished status: the text reads as the finished product (Jérémie, 2026-10-31), the badge stays « En développement » until it is', 'The reference image as a screenshot: only the second image is one', 'A profile beyond the 8-hour run on another PC, stated by Jérémie on 2026-11-02: docs/PERFORMANCE.md in the Chronox repo still records only short samples', 'A memory-leak test: docs/PERFORMANCE.md in the Chronox repo states none was done'],
  },
  {
    slug: 'maria-agent',
    tier: 'card',
    status: 'development',
    stage: 'POC',
    tracks: ['ia', 'dev'],
    title: 'Maria Agent',
    period: { start: '2026-10' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'Une plateforme d’agents IA secrétaires, conçue pour répondre au téléphone et prendre les rendez-vous.',
    },
    summary: {
      fr: 'Maria Agent est une plateforme d’agents IA secrétaires conçue pour répondre au téléphone et prendre les rendez-vous. Le studio web et l’API Rust sont en place ; le moteur vocal y est encore simulé.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Comment ça fonctionnera', en: 'How it will work' },
        body: { fr: 'La voix de l’appelant sera transcrite en texte (STT). Un LLM analysera la demande, consultera l’agenda et rédigera la réponse, que Gradium transformera en voix (TTS). Chaque étape fonctionnera en flux continu pour répondre sans attente, et le serveur validera chaque réservation.' },
      },
      {
        kind: 'limits',
        title: { fr: 'Vision', en: 'Vision' },
        body: { fr: 'Chaque professionnel pourrait ensuite personnaliser le nom, la voix et la personnalité de son agent.' },
      },
    ],
    stack: ['Rust', 'Axum', 'React', 'TypeScript', 'Tailwind CSS', 'GitHub Actions'],
    links: { noCodeLink: true },
    facts: [],
    scale: { months: 1 },
    doNotClaim: ['A working voice assistant: the studio is simulated, as the text says', 'Any real voice, LLM or speech-to-text'],
  },
  {
    slug: 'generateur-otp-rcs',
    tier: 'card',
    status: 'delivered',
    award: { fr: '4e place', en: '4th place' },
    tracks: ['cyber', 'dev'],
    title: 'Générateur OTP RCS',
    period: { start: '2026-06', end: '2026-06' },
    // Jérémie's commits: OTP service, repositories, IP rate limiting, DTO validation.
    // 4 people (Jérémie, 2026-10-26; git shortlog: Jérémie, Hatim, Marwan, Séverine).
    team: { size: 4, role: { fr: 'backend et sécurité applicative', en: 'backend and application security' } },
    context: 'hackathon',
    tagline: {
      fr: 'Backend 2FA : codes à 6 chiffres envoyés par RCS, hachés et à essais limités.',
      en: 'A 2FA back end: 6-digit codes sent over RCS, hashed and rate-limited.',
    },
    summary: {
      fr: '4e place au hackathon inter-écoles pour la conception, en 4 jours, d’un service d’authentification à deux facteurs qui envoie les codes par RCS.',
      en: '4th place at an inter-school hackathon for designing, in 4 days, a two-factor authentication service sending codes over RCS.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Fonctionnalités' },
        points: [
          { label: { fr: 'Envoi' }, text: { fr: 'un code à 6 chiffres, envoyé par RCS avec l’API smsmode.' } },
          { label: { fr: 'Expiration' }, text: { fr: '5 minutes de validité, 3 essais au plus.' } },
        ],
      },
      {
        kind: 'security',
        title: { fr: 'Sécurité' },
        points: [
          { label: { fr: 'Stockage' }, text: { fr: 'seule l’empreinte SHA-256 du code est gardée.' } },
          { label: { fr: 'Limitation' }, text: { fr: 'par numéro de téléphone et par adresse IP.' } },
        ],
      },
      {
        kind: 'result',
        title: { fr: 'Ma part' },
        body: { fr: 'Le service OTP, les accès à la base MongoDB, la limitation par IP et la validation des requêtes.' },
      },
    ],
    stack: ['NestJS', 'TypeScript', 'MongoDB', 'Docker Compose', 'Swagger'],
    links: { github: 'https://github.com/JN13012/Generateur_Code_OTP' },
    facts: [
      { value: '4e', label: { fr: 'place', en: 'place' }, source: 'Jérémie, 2026-10-28 (ranking correction)' },
      { value: '4 jours', label: { fr: 'de hackathon', en: 'hackathon days' }, source: 'git log: 2026-06-03 → 2026-06-06' },
    ],
    scale: { months: 1 },
    doNotClaim: ['ISO 27001 certification (practices aligned with it, nothing more)'],
  },
  {
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
    stack: ['Python', 'Pandas', 'GeoPandas', 'OSMnx', 'NetworkX', 'SciPy', 'Parquet', 'Leaflet', 'Docker'],
    links: { privateRepo: true },
    facts: [
      { value: '2e', label: { fr: 'place', en: 'place' }, source: 'Jérémie, 2026-10-24 (proof on request)' },
      { value: '1', label: { fr: 'semaine', en: 'week' }, source: 'T-HAK-700 README: hackathon 19–21/10/2026, defence 23/10' },
    ],
    scale: { months: 1 },
    doNotClaim: [
      'Jérémie built the prediction model (it is team work; he collected, cleaned and computed the geodata)',
      'The model as his work: LightGBM is on main (README, model/), built by a teammate; data sources in SOURCES.md (read on 2026-11-02)',
    ],
  },
  {
    slug: 'chatflow',
    tier: 'card',
    status: 'delivered',
    tracks: ['dev'],
    title: 'ChatFlow',
    period: { start: '2026-03', end: '2026-04' },
    // Jérémie's commits touch ChatFlow/api and ChatFlow/client; role given by Jérémie (2026-10-24).
    team: { size: 4, role: { fr: 'backend', en: 'back end' } },
    context: 'epitech',
    tagline: {
      fr: 'Messagerie temps réel : serveurs, salons, rôles, sur le web et en desktop.',
      en: 'Real-time messaging: servers, channels, roles, on the web and desktop.',
    },
    summary: {
      fr: 'Une messagerie temps réel façon plateforme communautaire, sur le web et en application desktop.',
      en: 'A real-time community messaging app, on the web and desktop.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Fonctionnalités', en: 'Features' },
        points: [
          { label: { fr: 'Communautés', en: 'Communities' }, text: { fr: 'serveurs, salons, membres, rôles et invitations.', en: 'servers, channels, members, roles and invitations.' } },
          { label: { fr: 'Messages', en: 'Messages' }, text: { fr: 'en temps réel, avec réactions, pièces jointes, messages privés et amis.', en: 'real time, with reactions, attachments, direct messages and friends.' } },
          { label: { fr: 'Clients', en: 'Clients' }, text: { fr: 'un site Next.js multilingue et une application Electron (Windows, macOS, Linux).', en: 'a multilingual Next.js site and an Electron app (Windows, macOS, Linux).' } },
        ],
      },
      {
        kind: 'architecture',
        title: { fr: 'Architecture', en: 'Architecture' },
        points: [
          { label: { fr: 'API', en: 'API' }, text: { fr: 'Express, Prisma et MySQL, documentée avec Swagger.', en: 'Express, Prisma and MySQL, documented with Swagger.' } },
          { label: { fr: 'Temps réel', en: 'Real time' }, text: { fr: 'Socket.IO.', en: 'Socket.IO.' } },
          { label: { fr: 'Fichiers', en: 'Files' }, text: { fr: 'stockés dans MinIO.', en: 'stored in MinIO.' } },
        ],
      },
    ],
    stack: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Socket.IO', 'Next.js', 'React', 'Electron', 'Docker', 'Jest'],
    links: { privateRepo: true },
    facts: [],
    scale: { months: 2, tests: 110 },
  },
  {
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
  },
  {
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
    stack: ['Apex', 'Lightning Web Components', 'JavaScript', 'Tooling API', 'HTML', 'CSS'],
    links: { privateRepo: true },
    facts: [
      { value: '≈ 20', label: { fr: 'utilisateurs', en: 'users' }, source: 'Jérémie, 2026-10-26: QA and dev teams' },
    ],
    scale: { months: 6 },
  },
  {
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
  },
  {
    slug: 'bookworm',
    tier: 'card',
    status: 'delivered',
    tracks: ['ia', 'data'],
    title: 'Bookworm',
    period: { start: '2026-06', end: '2026-06' },
    team: { size: 1 },
    context: 'epitech',
    tagline: {
      fr: 'Analyse de livres Gutenberg en NLP : thèmes, personnages, résumé et fiche.',
      en: 'NLP analysis of Gutenberg books: topics, characters, summary and book card.',
    },
    summary: {
      fr: 'Un outil en ligne de commande qui analyse les livres du projet Gutenberg avec du NLP et en produit une fiche de lecture.',
      en: 'A command-line tool that analyses Project Gutenberg books with NLP and produces a book card.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Analyses', en: 'Analyses' },
        points: [
          { label: { fr: 'Thèmes', en: 'Topics' }, text: { fr: 'les mots importants de chaque section (TF-IDF).', en: 'the key words of each section (TF-IDF).' } },
          { label: { fr: 'Entités', en: 'Entities' }, text: { fr: 'les personnages et les lieux, avec spaCy.', en: 'characters and places, with spaCy.' } },
          { label: { fr: 'Résumé et livres proches', en: 'Summary and similar books' }, text: { fr: 'un résumé court et les livres les plus proches (similarité cosinus).', en: 'a short summary and the closest books (cosine similarity).' } },
          { label: { fr: 'Fiche', en: 'Book card' }, text: { fr: 'tout réuni dans une fiche, avec un cache des calculs.', en: 'all of it in one card, with a cache of the results.' } },
        ],
      },
    ],
    stack: ['Python', 'spaCy', 'scikit-learn', 'NLP'],
    links: { github: 'https://github.com/JN13012/Alice_In_Wonderland' },
    facts: [],
    scale: { months: 1 },
  },
  {
    slug: 'base-de-connaissance',
    tier: 'card',
    status: 'ongoing',
    tracks: ['cyber', 'ia', 'dev'],
    title: 'Base de connaissance',
    period: { start: '2026-06' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: '729 notes Obsidian : cours, méthodes de pentest et notes de projets, cyber, IA et dev.',
      en: '728 Obsidian notes: courses, pentest methods and project notes, security, AI and dev.',
    },
    summary: {
      fr: 'Une base de connaissances personnelle sous Obsidian, tenue au fil des formations et des projets : notes de cours, méthodes, cheatsheets et retours d’expérience.',
      en: 'A personal knowledge base in Obsidian, kept up through courses and projects: course notes, methods, cheat sheets and lessons learned.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Ce qu’elle couvre', en: 'What it covers' },
        points: [
          { label: { fr: 'Cybersécurité (414 notes)', en: 'Security (414 notes)' }, text: { fr: 'notes de cours TryHackMe et fiches de méthode pentest.', en: '370 TryHackMe course notes and 43 pentest method sheets.' } },
          { label: { fr: 'Projets (257 notes)', en: 'Projects (257 notes)' }, text: { fr: 'conception et suivi d’Argos, BlockTrader, ZeroDay…', en: 'design and follow-up of Argos, BlockTrader, ZeroDay…' } },
          { label: { fr: 'IA (34 notes)', en: 'AI (34 notes)' }, text: { fr: 'le parcours IBM AI Developer.', en: 'the IBM AI Developer path.' } },
          { label: { fr: 'Salesforce et DevOps', en: 'Salesforce and DevOps' }, text: { fr: '10 et 7 notes.', en: '10 and 7 notes.' } },
        ],
      },
    ],
    stack: ['Obsidian'],
    links: { privateRepo: true },
    facts: [
      { value: '729', label: { fr: 'notes', en: 'notes' }, source: 'find vault -name "*.md" | wc -l (2026-10-26), per top folder' },
    ],
    scale: { months: 4 },
  },
  {
    // Facts from server/aiLab, content/aiLab.ts and docs/conception-lab-ia.md (2026-11-01).
    slug: 'lab-ia',
    tier: 'card',
    status: 'development',
    stage: 'MVP',
    tracks: ['ia', 'cyber'],
    title: 'Lab IA',
    period: { start: '2026-10' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'Un exercice de red teaming sur un vrai modèle, jouable sur ce site : 5 niveaux ouverts.',
    },
    summary: {
      fr: 'Un exercice de red teaming jouable dans le Lab de ce site, face à Sentry, qui répond avec un vrai modèle. Le visiteur lui fait révéler un flag fictif, glisse un texte caché dans un CV pour qu’il le recommande, puis lui fait payer une facture sur un faux IBAN en trompant sa recherche. Les niveaux 1 à 5 sont ouverts ; les 5 autres sont annoncés « À venir ».',
    },
    sections: [
      {
        kind: 'security',
        title: { fr: 'Sécurité' },
        body: { fr: 'Le serveur gère les flags et la progression, et applique des quotas par session et par adresse IP, sur 1 heure, 5 heures et 24 heures.' },
      },
    ],
    stack: ['React', 'TypeScript', 'Cloudflare Workers', 'Workers AI', 'D1'],
    links: { demo: '#lab-ia' },
    facts: [
      { value: '4', label: { fr: 'niveaux ouverts' }, source: 'src/content/aiLab.ts: levels with available: true' },
      { value: '10', label: { fr: 'niveaux prévus' }, source: 'src/content/aiLab.ts: aiLabCurriculum' },
      { value: '39', label: { fr: 'tests du serveur' }, source: 'server/aiLab/handler.test.ts' },
    ],
    scale: { months: 1, tests: 39 },
    doNotClaim: ['Levels 5 to 10 as playable', 'An unbreakable defence: the target is deliberately vulnerable', 'A product or an evaluation tool: it is a teaching mini-game'],
  },
  {
    slug: 'ctf-du-site',
    tier: 'card',
    status: 'delivered',
    tracks: ['cyber'],
    title: 'Lab cyber',
    // git log of src/components/ProfileConsole: 2026-04-29 → 2026-05-28.
    period: { start: '2026-04', end: '2026-05' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'CTF en 9 niveaux jouable sur ce site : attaquer une machine, puis la défendre.',
      en: 'A 9-level CTF playable on this site: attack a machine, then defend it.',
    },
    summary: {
      fr: 'Un CTF jouable dans le Lab de ce site, dans un terminal simulé. On attaque d’abord une machine fictive, de la reconnaissance à l’exploitation, puis on passe côté défense : analyser l’attaque, la contenir et durcir l’infrastructure.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Les 9 niveaux' },
        points: [
          { text: { fr: 'Reconnaissance' } },
          { text: { fr: 'Commandes Linux' } },
          { text: { fr: 'Scan de services' } },
          { text: { fr: 'Injection SQL' } },
          { text: { fr: 'Mots de passe' } },
          { text: { fr: 'Exploit MS17-010' } },
          { text: { fr: 'SOC' } },
          { text: { fr: 'Forensique' } },
          { text: { fr: 'Durcissement' } },
        ],
      },
    ],
    stack: ['React', 'JavaScript'],
    links: { demo: '#lab' },
    facts: [
      { value: '9', label: { fr: 'niveaux', en: 'levels' }, source: 'src/sections/Lab/ctf/ctfData.js' },
      { value: '21', label: { fr: 'commandes et outils simulés', en: 'simulated commands and tools' }, source: 'ctfData.js: `unlocks` of all levels' },
    ],
    scale: { months: 2 },
  },
  {
    slug: 'argos-security-arena',
    tier: 'card',
    status: 'development',
    stage: 'POC',
    tracks: ['cyber', 'ia'],
    // Repo JN13012/Lab_CTF (README: « Atlas Academy »), last commit 2026-10-02; title kept by Jérémie (2026-10-26).
    // Separate from Argos (Argos Product Brief v2.4 §4: « cyber range d’entraînement et de benchmark »): never say it is
    // Argos's arena. Positioned first as an AI-agent benchmark platform (Jérémie, 2026-10-26); only the human training UI exists.
    title: 'Argos Security Arena',
    period: { start: '2026-06' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'Plateforme de benchmark et d’entraînement en cybersécurité, pour les humains comme pour les agents IA.',
      en: 'A benchmark platform for AI agents: testing them on vulnerable scenarios.',
    },
    summary: {
      fr: 'Une plateforme de benchmark et d’entraînement en cybersécurité, pour les humains comme pour les agents IA, sur des scénarios dont on connaît les failles, avec scores et classements.',
      en: 'A cybersecurity benchmark and training platform, built first for AI agents, then for people.',
    },
    sections: [
      {
        kind: 'result',
        title: { fr: 'Où en est le projet' },
        body: { fr: 'En pause, elle sera reprise en parallèle d’Argos pour le tester. L’interface d’entraînement existe ; le benchmark et le backend restent à développer.' },
      },
    ],
    stack: ['React', 'Tailwind CSS', 'Vitest', 'GitHub Actions'],
    links: { github: 'https://github.com/JN13012/Lab_CTF' },
    facts: [],
    scale: { months: 4, tests: 31 },
    doNotClaim: ['Back end, accounts, real lab machines or certificates as existing', 'AI agent benchmarking as built (design direction only)', 'Being part of Argos'],
  },
  {
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
    stack: ['Gestion de projet'],
    links: { github: 'https://github.com/JN13012/Smart-Fridge' },
    facts: [],
    scale: { months: 1 },
  },
]
