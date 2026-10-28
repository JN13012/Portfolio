import type { Project } from '../types'

// « Autres réalisations ». Teams counted with git shortlog (JN13 = Jérémie) on 2026-10-17; for course projects
// re-uploaded in one commit, sizes given by Jérémie on 2026-10-26 (Vaultborn 3, Smart Fridge 3, POPEYE and My_Marvin solo).

export const cards: Project[] = [
  {
    slug: 'generateur-otp-rcs',
    tier: 'card',
    status: 'delivered',
    award: { fr: '3e place', en: '3rd place' },
    tracks: ['cyber', 'dev'],
    title: 'Générateur OTP RCS',
    period: { start: '2026-06', end: '2026-06' },
    // Jérémie's commits: OTP service, repositories, IP rate limiting, DTO validation.
    // 4 people (Jérémie, 2026-10-26; git shortlog: Jérémie, Hatim, Marwan, Séverine).
    team: { size: 4, role: { fr: 'backend et sécurité applicative', en: 'backend and application security' } },
    context: 'hackathon',
    tagline: {
      fr: 'Backend 2FA : codes à 6 chiffres envoyés par RCS, hachés et limités.',
      en: 'A 2FA back end: 6-digit codes sent over RCS, hashed and rate-limited.',
    },
    summary: {
      fr: '3e place au hackathon inter-écoles pour la conception, en 4 jours, d’un service d’authentification à deux facteurs qui envoie les codes par RCS.',
      en: '3rd place at an inter-school hackathon for designing, in 4 days, a two-factor authentication service sending codes over RCS.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Fonctionnalités', en: 'Features' },
        points: [
          { label: { fr: 'Envoi', en: 'Sending' }, text: { fr: 'un code à 6 chiffres, envoyé par RCS avec l’API smsmode.', en: 'a 6-digit code, sent over RCS with the smsmode API.' } },
          { label: { fr: 'Vérification', en: 'Verification' }, text: { fr: 'le code saisi est comparé à la demande en cours.', en: 'the code entered is checked against the pending request.' } },
          { label: { fr: 'Expiration', en: 'Expiry' }, text: { fr: '5 minutes de validité, 3 essais au plus.', en: 'valid for 5 minutes, 3 attempts at most.' } },
        ],
      },
      {
        kind: 'security',
        title: { fr: 'Sécurité', en: 'Security' },
        points: [
          { label: { fr: 'Stockage', en: 'Storage' }, text: { fr: 'seule l’empreinte SHA-256 du code est gardée.', en: 'only the SHA-256 hash of the code is kept.' } },
          { label: { fr: 'Limitation', en: 'Rate limiting' }, text: { fr: 'par numéro de téléphone et par adresse IP.', en: 'per phone number and per IP address.' } },
          { label: { fr: 'Validation', en: 'Validation' }, text: { fr: 'chaque requête est vérifiée avant traitement.', en: 'every request is checked before processing.' } },
        ],
      },
      {
        kind: 'result',
        title: { fr: 'Ma part', en: 'My part' },
        points: [
          { label: { fr: 'Service OTP', en: 'OTP service' }, text: { fr: 'génération, envoi et vérification des codes.', en: 'generating, sending and checking codes.' } },
          { label: { fr: 'Données', en: 'Data' }, text: { fr: 'les accès à la base MongoDB.', en: 'access to the MongoDB database.' } },
          { label: { fr: 'Protections', en: 'Protections' }, text: { fr: 'limitation par IP et validation des requêtes.', en: 'per-IP rate limiting and request validation.' } },
        ],
      },
    ],
    stack: ['NestJS', 'TypeScript', 'MongoDB', 'Docker Compose', 'Swagger'],
    links: { github: 'https://github.com/JN13012/Generateur_Code_OTP' },
    facts: [
      { value: '3e', label: { fr: 'place', en: 'place' }, source: 'Jérémie, 2026-10-24 (proof on request)' },
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
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Objectifs', en: 'Goals' },
        points: [
          { label: { fr: 'Accessibilité', en: 'Accessibility' }, text: { fr: 'cartographier, pour chaque habitant, le nombre de transports accessibles à 5 minutes à pied.', en: 'map, for each resident, how many transport options are within a 5-minute walk.' } },
          { label: { fr: 'Desserte', en: 'Coverage' }, text: { fr: 'recenser les arrêts et les stations par type, avec la population qu’ils desservent.', en: 'list stops and stations by type, with the population they serve.' } },
          { label: { fr: 'Décision', en: 'Decision' }, text: { fr: 'estimer le potentiel de chaque site, chiffrer les coûts et classer les sites selon un budget.', en: 'estimate each site’s potential, cost it and rank the sites within a budget.' } },
        ],
      },
      {
        kind: 'architecture',
        title: { fr: 'Ma part', en: 'My part' },
        points: [
          // geo/download_osm_ara.py (Jérémie's commits): Geofabrik extracts archived with a checksum.
          { label: { fr: 'Extraction', en: 'Extraction' }, text: { fr: 'téléchargement et archivage des extraits OpenStreetMap, avec contrôle d’intégrité.', en: 'downloading and archiving the OpenStreetMap extracts, with integrity checks.' } },
          { label: { fr: 'Nettoyage', en: 'Cleaning' }, text: { fr: 'contrôle qualité des données géographiques (doublons, géométries invalides, valeurs manquantes).', en: 'quality checks on the geographic data (duplicates, invalid geometries, missing values).' } },
          { label: { fr: 'Réseau piéton', en: 'Pedestrian network' }, text: { fr: 'construit depuis OpenStreetMap, 16,6 millions de nœuds découpés en 835 tuiles.', en: 'built from OpenStreetMap, 16.6 million nodes split into 835 tiles.' } },
          { label: { fr: 'Croisement', en: 'Linking' }, text: { fr: 'population, arrêts, stations et routes, pour relier chaque habitant au réseau.', en: 'population, stops, stations and roads, to link every resident to the network.' } },
          { label: { fr: 'Zones desservies', en: 'Served areas' }, text: { fr: 'calcul des zones à 5 minutes à pied autour de chaque arrêt.', en: 'computing the areas within a 5-minute walk of each stop.' } },
          { label: { fr: 'Accès et couverture', en: 'Access and coverage' }, text: { fr: 'la carte d’accès et la population desservie, qui alimentent le modèle ; chaque étape testée.', en: 'the access map and population served, feeding the model; every step tested.' } },
        ],
      },
      {
        kind: 'result',
        title: { fr: 'Résultat', en: 'Result' },
        points: [
          { label: { fr: 'Modèle (équipe)', en: 'Model (team)' }, text: { fr: 'il apprend où les stations existantes se trouvent et note chaque zone ; testé sur des territoires qu’il n’a jamais vus, il fait mieux qu’un simple classement par population.', en: 'it learns where existing stations are and scores each area; tested on territories it has never seen, it beats a plain ranking by population.' } },
          { label: { fr: 'Liste priorisée', en: 'Priority list' }, text: { fr: 'les sites qui desservent le plus d’habitants pour un budget donné, avec une part réservée hors des grandes villes.', en: 'the sites serving the most residents for a given budget, with a share kept outside big cities.' } },
        ],
      },
    ],
    stack: ['Python', 'Pandas', 'GeoPandas', 'Shapely', 'OSMnx', 'NetworkX', 'SciPy', 'Parquet', 'Leaflet', 'Docker'],
    links: { privateRepo: true },
    facts: [
      { value: '2e', label: { fr: 'place', en: 'place' }, source: 'Jérémie, 2026-10-24 (proof on request)' },
      { value: '1', label: { fr: 'semaine', en: 'week' }, source: 'T-HAK-700 README: hackathon 19–21/10/2026, defence 23/10' },
    ],
    scale: { months: 1 },
    doNotClaim: [
      'Jérémie built the prediction model (it is team work; he collected, cleaned and computed the geodata)',
      'The model on main: it is on branch carte-citiz-dashboard (model/train.py, LightGBM, pushed by a teammate on 2026-10-26)',
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
      {
        kind: 'result',
        title: { fr: 'Ma part', en: 'My part' },
        points: [
          { label: { fr: 'Membres', en: 'Members' }, text: { fr: 'statut en ligne, exclusion, messages épinglés.', en: 'online status, kicking, pinned messages.' } },
          { label: { fr: 'Invitations', en: 'Invitations' }, text: { fr: 'une invitation unique par personne, et une liste paginée.', en: 'a single invitation per person, and a paginated list.' } },
          { label: { fr: 'Notifications', en: 'Notifications' }, text: { fr: 'l’envoi des notifications aux membres.', en: 'sending notifications to members.' } },
          { label: { fr: 'CI', en: 'CI' }, text: { fr: 'la mise en place de l’intégration continue.', en: 'setting up continuous integration.' } },
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
          { label: { fr: 'Équipes', en: 'Teams' }, text: { fr: 'les managers gèrent leurs équipes et suivent des indicateurs.', en: 'managers run their teams and follow KPIs.' } },
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
      {
        kind: 'limits',
        title: { fr: 'Où en est le projet', en: 'Where it stands' },
        body: { fr: 'En cours de construction.', en: 'Under construction.' },
      },
    ],
    stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Drizzle', 'React', 'Vite', 'Microsoft Entra ID', 'Caddy', 'Docker Compose', 'Vitest'],
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
        title: { fr: 'Ce qu’il fait', en: 'What it does' },
        body: {
          fr: 'Tout ce qu’il faut pour lancer du code Apex en confiance, sans quitter Salesforce.',
          en: 'Everything needed to run Apex code with confidence, without leaving Salesforce.',
        },
        points: [
          {
            label: { fr: 'Exécution', en: 'Execution' },
            text: { fr: 'par l’API Tooling, avec les erreurs localisées à la ligne et à la colonne.', en: 'through the Tooling API, with errors pinpointed to line and column.' },
          },
          { label: { fr: 'Coloration syntaxique', en: 'Syntax highlighting' }, text: { fr: 'du code Apex dans l’éditeur.', en: 'of Apex code in the editor.' } },
          {
            label: { fr: 'Chaînage de scripts', en: 'Script chaining' },
            text: { fr: 'A, puis B si A réussit, puis C ; au premier échec, la chaîne s’arrête et un message d’erreur est envoyé.', en: 'A, then B if A succeeds, then C; at the first failure the chain stops and an error message is sent.' },
          },
          {
            label: { fr: 'Planification', en: 'Scheduling' },
            text: { fr: 'exécution unique, quotidienne ou hebdomadaire, avec la liste des tâches planifiées.', en: 'one-off, daily or weekly runs, with the list of scheduled jobs.' },
          },
          {
            label: { fr: 'Logs', en: 'Logs' },
            text: { fr: 'niveaux réglables par catégorie, journaux sauvegardés avec chaque exécution, suivis et téléchargeables.', en: 'levels set per category, logs saved with every run, tracked and downloadable.' },
          },
          { label: { fr: 'Sessions', en: 'Sessions' }, text: { fr: 'plusieurs exécutions regroupées dans un même journal.', en: 'several runs grouped in one log.' } },
          {
            label: { fr: 'Versions', en: 'Versions' },
            text: { fr: 'nom et numéro de version automatiques, historique des versions, import et export.', en: 'automatic name and version number, version history, import and export.' },
          },
          {
            label: { fr: 'Historique', en: 'History' },
            text: { fr: 'toutes les exécutions d’un script, la dernière affichée à côté de son nom.', en: 'every run of a script, the latest shown next to its name.' },
          },
          {
            label: { fr: 'Droits', en: 'Permissions' },
            text: { fr: 'les droits Salesforce sont vérifiés avant chaque lecture ou écriture.', en: 'Salesforce permissions are checked before every read or write.' },
          },
        ],
      },
    ],
    // GitHub languages of JN13012/Code-Executor---Salesforce (2026-10-24): JavaScript, Apex, HTML, CSS; LWC components.
    stack: ['Apex', 'Lightning Web Components', 'JavaScript', 'Tooling API', 'HTML', 'CSS'],
    links: { privateRepo: true },
    facts: [
      { value: '≈ 20', label: { fr: 'utilisateurs', en: 'users' }, source: 'Jérémie, 2026-10-26: QA and dev teams' },
      { value: '9', label: { fr: 'fonctionnalités', en: 'features' }, source: 'the « Ce qu’il fait » list (repo + script chaining told by Jérémie)' },
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
          { label: { fr: 'Diversité lexicale', en: 'Lexical diversity' }, text: { fr: 'la richesse du vocabulaire.', en: 'how rich the vocabulary is.' } },
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
    status: 'development',
    tracks: ['cyber', 'ia', 'dev'],
    title: 'Base de connaissance',
    period: { start: '2026-06' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: '728 notes Obsidian : cours, méthodes de pentest et notes de projets, cyber, IA et dev.',
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
        body: { fr: 'Cinq domaines, comptés le 26 octobre 2026.', en: 'Five areas, counted on 26 October 2026.' },
        points: [
          { label: { fr: 'Cybersécurité (414 notes)', en: 'Security (414 notes)' }, text: { fr: '370 notes de cours TryHackMe et 43 fiches de méthode pentest.', en: '370 TryHackMe course notes and 43 pentest method sheets.' } },
          { label: { fr: 'Projets (257 notes)', en: 'Projects (257 notes)' }, text: { fr: 'conception et suivi d’Argos, BlockTrader, ZeroDay…', en: 'design and follow-up of Argos, BlockTrader, ZeroDay…' } },
          { label: { fr: 'IA (34 notes)', en: 'AI (34 notes)' }, text: { fr: 'le parcours IBM AI Developer.', en: 'the IBM AI Developer path.' } },
          { label: { fr: 'Salesforce et DevOps', en: 'Salesforce and DevOps' }, text: { fr: '10 et 7 notes.', en: '10 and 7 notes.' } },
        ],
      },
    ],
    stack: ['Obsidian'],
    links: { privateRepo: true },
    facts: [
      { value: '728', label: { fr: 'notes', en: 'notes' }, source: 'find vault -name "*.md" | wc -l (2026-10-26), per top folder' },
    ],
    scale: { months: 4 },
  },
  {
    slug: 'ctf-du-site',
    tier: 'card',
    status: 'delivered',
    tracks: ['cyber'],
    title: 'CTF du portfolio',
    // git log of src/components/ProfileConsole: 2026-04-29 → 2026-05-28.
    period: { start: '2026-04', end: '2026-05' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'CTF en 9 niveaux jouable sur ce site : attaquer une machine, puis la défendre.',
      en: 'A 9-level CTF playable on this site: attack a machine, then defend it.',
    },
    summary: {
      fr: 'Un CTF jouable dans le Lab de ce site, dans un terminal simulé. On attaque d’abord une machine fictive, de la reconnaissance à l’exploitation, puis on passe côté défense : analyser l’attaque, la contenir et durcir l’infrastructure. La progression est gardée dans le navigateur.',
      en: 'A CTF playable in this site’s Lab, in a simulated terminal. You first attack a fictional machine, from reconnaissance to exploitation, then switch to defence: analyse the attack, contain it and harden the infrastructure. Progress is kept in the browser.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Les 9 niveaux', en: 'The 9 levels' },
        body: { fr: 'Six niveaux d’attaque, puis trois de défense.', en: 'Six attack levels, then three defence levels.' },
        points: [
          { label: { fr: '1 · Reconnaissance', en: '1 · Reconnaissance' }, text: { fr: 'un flag caché dans le code source de la page.', en: 'a flag hidden in the page’s source code.' } },
          { label: { fr: '2 · Commandes Linux', en: '2 · Linux commands' }, text: { fr: 'fouiller les fichiers avec find et grep.', en: 'searching files with find and grep.' } },
          { label: { fr: '3 · Scan de services', en: '3 · Service scanning' }, text: { fr: 'énumérer les ports et les versions avec nmap.', en: 'enumerating ports and versions with nmap.' } },
          { label: { fr: '4 · Exploitation web', en: '4 · Web exploitation' }, text: { fr: 'des pages cachées (gobuster), puis une injection SQL (sqlmap).', en: 'hidden pages (gobuster), then an SQL injection (sqlmap).' } },
          { label: { fr: '5 · Mots de passe', en: '5 · Passwords' }, text: { fr: 'casser des empreintes MD5 (john, hashcat), puis se connecter en SSH.', en: 'cracking MD5 hashes (john, hashcat), then logging in over SSH.' } },
          { label: { fr: '6 · Exploitation système', en: '6 · System exploitation' }, text: { fr: 'la faille SMB MS17-010 avec Metasploit.', en: 'the MS17-010 SMB flaw with Metasploit.' } },
          { label: { fr: '7 · SOC', en: '7 · SOC' }, text: { fr: 'retrouver l’IP de l’attaquant dans un SIEM type Splunk.', en: 'finding the attacker’s IP in a Splunk-style SIEM.' } },
          { label: { fr: '8 · Forensique', en: '8 · Forensics' }, text: { fr: 'analyser le binaire, retrouver le processus malveillant et l’arrêter.', en: 'analysing the binary, finding the malicious process and killing it.' } },
          { label: { fr: '9 · Durcissement', en: '9 · Hardening' }, text: { fr: 'pare-feu, WAF et IDS (Snort).', en: 'firewall, WAF and IDS (Snort).' } },
        ],
      },
    ],
    stack: ['React', 'JavaScript'],
    links: { demo: '#lab' },
    facts: [
      { value: '9', label: { fr: 'niveaux', en: 'levels' }, source: 'src/sections/Lab/ctf/ctfData.js' },
      { value: '2', label: { fr: 'rôles : attaquant, puis défenseur', en: 'roles: attacker, then defender' }, source: 'ctfData.js: levels 1–6 attack, 7–9 defence' },
      { value: '21', label: { fr: 'commandes et outils simulés', en: 'simulated commands and tools' }, source: 'ctfData.js: `unlocks` of all levels' },
    ],
    scale: { months: 2 },
  },
  {
    slug: 'argos-security-arena',
    tier: 'card',
    status: 'development',
    tracks: ['cyber', 'ia'],
    // Repo JN13012/Lab_CTF (README: « Atlas Academy »), last commit 2026-10-02; title kept by Jérémie (2026-10-26).
    // Separate from Argos (Argos Product Brief v2.4 §4: « cyber range d’entraînement et de benchmark »): never say it is
    // Argos's arena. Positioned first as an AI-agent benchmark platform (Jérémie, 2026-10-26); only the human training UI exists.
    title: 'Argos Security Arena',
    period: { start: '2026-06' },
    team: { size: 1 },
    context: 'personal',
    tagline: {
      fr: 'Plateforme de benchmark pour agents IA : les tester sur des scénarios vulnérables.',
      en: 'A benchmark platform for AI agents: testing them on vulnerable scenarios.',
    },
    summary: {
      fr: 'Une plateforme de benchmark et d’entraînement en cybersécurité, pensée d’abord pour les agents IA, puis pour les humains.',
      en: 'A cybersecurity benchmark and training platform, built first for AI agents, then for people.',
    },
    sections: [
      {
        kind: 'problem',
        title: { fr: 'Objectif', en: 'Goal' },
        points: [
          { label: { fr: 'Benchmarks', en: 'Benchmarks' }, text: { fr: 'évaluer des agents IA de pentest sur des scénarios dont on connaît les failles.', en: 'evaluating AI pentest agents on scenarios whose flaws are known.' } },
          { label: { fr: 'Mesures', en: 'Metrics' }, text: { fr: 'scores, traces de chaque action et classements.', en: 'scores, a trace of every action and leaderboards.' } },
          { label: { fr: 'Isolation', en: 'Isolation' }, text: { fr: 'des environnements réinitialisés après chaque essai.', en: 'environments reset after every run.' } },
          { label: { fr: 'Entraînement', en: 'Training' }, text: { fr: 'les mêmes scénarios entraînent aussi bien les agents IA que les humains.', en: 'the same scenarios train AI agents and people alike.' } },
        ],
      },
      {
        kind: 'approach',
        title: { fr: 'Ce qui existe', en: 'What exists' },
        points: [
          { label: { fr: 'Domaines', en: 'Areas' }, text: { fr: 'cybersécurité, et IA en aperçu.', en: 'cybersecurity, and AI as a preview.' } },
          { label: { fr: 'Parcours', en: 'Paths' }, text: { fr: 'un parcours d’entrée « Recruit », puis six spécialisations, de l’offensif à la sécurité de l’IA.', en: 'an entry path, « Recruit », then six specialisations, from offensive work to AI security.' } },
          { label: { fr: 'Salles', en: 'Rooms' }, text: { fr: 'questions et flags, débloqués l’un après l’autre dans chaque module.', en: 'questions and flags, unlocked one after another in each module.' } },
          { label: { fr: 'Progression', en: 'Progress' }, text: { fr: 'points selon la difficulté, rangs, tableau de bord et suivi.', en: 'points by difficulty, ranks, dashboard and tracking.' } },
        ],
      },
      {
        kind: 'limits',
        title: { fr: 'Où en est le projet', en: 'Where it stands' },
        body: {
          fr: 'En pause. L’interface d’entraînement existe et elle est testée. Le benchmark des agents, le backend et les machines réelles restent à développer, d’après un plan déjà écrit.',
          en: 'On hold. The training interface exists and is tested. The agent benchmark, the back end and real machines are still to be built, following a plan already written.',
        },
      },
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'GitHub Actions'],
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
