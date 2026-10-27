import type { Project } from '../types'

// Verified in /home/cyber/work/Argos on 2026-10-17 and 2026-10-26. Personal project (Jérémie, 2026-10-26).
// Vision: Obsidian Work/Argos/Vision Version.md (V1–V6, 23 sub-steps, 2026-10-24). The code today is the first
// brick of the OSINT engine (SIRENE discovery, provenance, Markdown reports); everything else is design.
export const argos: Project = {
  slug: 'argos',
  tier: 'dossier',
  status: 'development',
  tracks: ['cyber', 'ia'],
  title: 'Argos',
  period: { start: '2026-07' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Plateforme de cybersécurité pilotée par IA pour les PME, du web à l’industrie.',
    en: 'An AI-driven cybersecurity platform for SMEs, from web apps to industry.',
  },
  summary: {
    fr: 'Une plateforme de cybersécurité pilotée par IA, pensée pour les PME sans équipe cyber : auditer, surveiller et faire corriger leur sécurité, avec une validation humaine à chaque étape. Le moteur OSINT est en développement ; les agents IA restent à développer.',
    en: 'An AI-driven cybersecurity platform for SMEs with no security team: audit, monitor and get their security fixed, with human validation at every step. The OSINT engine is in development; the AI agents are still to be built.',
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
      kind: 'problem',
      title: { fr: 'La vision', en: 'The vision' },
      body: {
        fr: 'Beaucoup de PME dépendent de leur informatique sans avoir les moyens d’un pentest régulier ni d’une équipe sécurité. Argos veut leur apporter une démarche professionnelle et continue : trouver les failles, prouver leur impact, faire corriger, puis vérifier.',
        en: 'Many SMEs depend on their IT without the means for regular pentests or a security team. Argos aims to give them a professional, continuous process: find the flaws, prove their impact, get them fixed, then check again.',
      },
    },
    {
      kind: 'approach',
      title: { fr: 'Ce qu’Argos couvrira', en: 'What Argos will cover' },
      body: {
        fr: 'Six étapes, avec dès la première un socle commun : inventaire, risques, preuves, rapports, suivi des corrections, protection des données et validation humaine.',
        en: 'Six stages, with a common base from the first one: inventory, risks, evidence, reports, remediation tracking, data protection and human validation.',
      },
      points: [
        { label: { fr: 'V1 · Applications web', en: 'V1 · Web applications' }, text: { fr: 'audit externe, authentification et sessions, API, code source et CI/CD.', en: 'external audit, authentication and sessions, APIs, source code and CI/CD.' } },
        { label: { fr: 'V2 · IA, LLM et agents', en: 'V2 · AI, LLMs and agents' }, text: { fr: 'prompt injection et fuites, RAG et bases vectorielles, agents, outils et MCP.', en: 'prompt injection and leaks, RAG and vector stores, agents, tools and MCP.' } },
        {
          label: { fr: 'V3 · Réseau et infrastructures', en: 'V3 · Network and infrastructure' },
          text: { fr: 'exposition Internet, réseau interne, Windows, Linux, stockage, sauvegardes.', en: 'internet exposure, internal network, Windows, Linux, storage, backups.' },
        },
        {
          label: { fr: 'V4 · Identités, messagerie et cloud', en: 'V4 · Identity, email and cloud' },
          text: { fr: 'Microsoft 365, Active Directory, cloud, conteneurs et Kubernetes.', en: 'Microsoft 365, Active Directory, cloud, containers and Kubernetes.' },
        },
        {
          label: { fr: 'V5 · Surveillance et réponse aux incidents', en: 'V5 · Monitoring and incident response' },
          text: { fr: 'détection, investigation, réponse et reprise.', en: 'detection, investigation, response and recovery.' },
        },
        {
          label: { fr: 'V6 · Environnements spécialisés', en: 'V6 · Specialised environments' },
          text: { fr: 'mobile, objets connectés et firmware, industrie (OT).', en: 'mobile, connected devices and firmware, industry (OT).' },
        },
      ],
    },
    {
      kind: 'architecture',
      title: { fr: 'Le moteur OSINT, en cours', en: 'The OSINT engine, in progress' },
      body: {
        fr: 'La base de tout le reste : collecter, nettoyer et croiser des données publiques sur des organisations, en gardant la source et la date de chaque donnée.',
        en: 'The base of everything else: collecting, cleaning and linking public data about organisations, keeping the source and date of every data point.',
      },
      points: [
        { label: { fr: 'Collecte', en: 'Collection' }, text: { fr: 'API publiques, crawling et scraping de sites web.', en: 'public APIs, crawling and scraping of websites.' } },
        { label: { fr: 'Traitement', en: 'Processing' }, text: { fr: 'nettoyage, analyse et corrélation des données.', en: 'cleaning, analysis and correlation of the data.' } },
        { label: { fr: 'IA et NLP', en: 'AI and NLP' }, text: { fr: 'comprendre les textes collectés, classer et rapprocher les organisations.', en: 'understanding the collected text, classifying and linking organisations.' } },
        {
          label: { fr: 'Usages', en: 'Uses' },
          text: {
            fr: 'cartographier ce qu’une organisation expose avant un audit, et trouver les entreprises qui ont besoin d’un service (pentest, site à refaire, agent vocal), dans le respect du RGPD.',
            en: 'mapping what an organisation exposes before an audit, and finding companies that need a service (pentest, website rebuild, voice agent), in line with the GDPR.',
          },
        },
      ],
    },
    {
      kind: 'result',
      title: { fr: 'Où en est le projet', en: 'Where it stands' },
      body: {
        fr: 'La première brique du moteur OSINT est codée : elle recherche des entreprises dans la base publique SIRENE de l’INSEE, garde la source et la date de chaque donnée et produit un rapport lisible. Le crawling, l’analyse, les agents IA et les étapes V1 à V6 restent à développer.',
        en: 'The first brick of the OSINT engine is built: it searches companies in INSEE’s public SIRENE database, keeps the source and date of every data point and produces a readable report. Crawling, analysis, the AI agents and stages V1 to V6 are still to be built.',
      },
    },
  ],
  imageNote: {
    fr: 'Maquette de l’interface cible, pas encore développée.',
    en: 'Mock-up of the target interface, not built yet.',
  },
  stack: ['Python', 'httpx', 'SQLite', 'pytest'],
  links: { github: 'https://github.com/JN13012/Argos' },
  facts: [
    { value: '6', label: { fr: 'domaines de sécurité prévus', en: 'planned security domains' }, source: 'Obsidian Work/Argos/Vision Version.md (V1–V6)' },
    { value: 'OSINT', label: { fr: 'premier module en développement', en: 'first module in development' }, source: 'README.md « Current focus »' },
  ],
  scale: { months: 3, tests: 67 },
  doNotClaim: [
    'Working AI agents or LLM integration as current features',
    'Crawling, scraping, NLP or any V1–V6 stage as built (only SIRENE discovery and reports are)',
    'Searching private individuals by interests (GDPR: Jérémie chose companies and professionals only, 2026-10-26)',
    'Untracked frontend or reporting as versioned',
  ],
}
