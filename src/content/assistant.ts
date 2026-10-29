import type { Localized } from './types'

// The hero assistant (plan §6, « Hero, assistant et Lab IA », 2026-10-27).
// The brain's nodes represent the sections cited by prepared answers; questions are asked in Sentry.
// Prepared answers are drafted from src/content/ and only get the « validée » badge once Jérémie
// has read them (`validated: true`). Strengths and weaknesses are left out until he writes them.

export type BrainNodeId = 'profile' | 'expertise' | 'projects' | 'lab' | 'parcours' | 'certifications' | 'contact'

/** Where an answer comes from. A project or a credential opens its modal; a section is scrolled to on request. */
export type AnswerSource =
  | { kind: 'section'; node: BrainNodeId }
  | { kind: 'project'; slug: string }
  | { kind: 'credential'; id: string }

export type PreparedAnswer = {
  id: string
  question: Localized
  answer: Localized
  sources: AnswerSource[]
  /** Read and approved by Jérémie. Until then the answer says it is a draft. */
  validated: boolean
}

type BrainNode = {
  id: BrainNodeId
  label: Localized
  /** Anchor of the section on the page. */
  target: string
  questions: PreparedAnswer[]
}

export const brainNodes: BrainNode[] = [
  {
    id: 'profile',
    label: { fr: 'Profil', en: 'Profile' },
    target: '#profile',
    questions: [
      {
        id: 'who',
        question: { fr: 'Qui est Jérémie ?', en: 'Who is Jérémie?' },
        answer: {
          fr: 'Développeur IA et pentester junior, en MSc cybersécurité à Epitech Marseille. Son fil rouge : construire des systèmes d’IA et savoir comment on les attaque. Avant l’informatique : l’infanterie (2e RIMa), la mécanique en endurance et l’infrastructure blockchain. Il parle cinq langues et a vécu dans six pays.',
          en: 'AI developer and junior penetration tester, MSc cybersecurity student at Epitech Marseille. His common thread: building AI systems and knowing how they get attacked. Before IT: the infantry (2e RIMa), endurance-racing mechanics and blockchain infrastructure. He speaks five languages and has lived in six countries.',
        },
        sources: [{ kind: 'section', node: 'profile' }, { kind: 'section', node: 'parcours' }],
        validated: false,
      },
    ],
  },
  {
    id: 'expertise',
    label: { fr: 'Expertise', en: 'Expertise' },
    target: '#competences',
    questions: [
      {
        id: 'skills',
        question: { fr: 'Que sait-il faire ?', en: 'What can he do?' },
        answer: {
          fr: 'Trois domaines, chacun prouvé par des projets ou des certificats : l’IA appliquée (applications LLM et RAG, parcours IBM AI Developer), la cybersécurité (pentest web, Active Directory, élévation de privilèges ; certifié Jr Penetration Tester) et le développement (React, TypeScript, API testées, intégration continue).',
          en: 'Three areas, each backed by projects or certificates: applied AI (LLM and RAG applications, the IBM AI Developer path), cybersecurity (web pentesting, Active Directory, privilege escalation; Jr Penetration Tester certified) and development (React, TypeScript, tested APIs, continuous integration).',
        },
        sources: [
          { kind: 'section', node: 'expertise' },
          { kind: 'credential', id: 'ibm-ai-developer' },
          { kind: 'credential', id: 'thm-jr-penetration-tester' },
        ],
        validated: false,
      },
    ],
  },
  {
    id: 'projects',
    label: { fr: 'Projets', en: 'Projects' },
    target: '#projects',
    questions: [
      {
        id: 'ambitious',
        question: { fr: 'Quels sont ses projets les plus ambitieux ?', en: 'What are his most ambitious projects?' },
        answer: {
          fr: 'BlockTrader : un moteur de backtest avec des protocoles contre le surapprentissage, en développement ; le pilotage par IA est son objectif, pas encore branché. Salesforce Executor : un outil interne complet (exécution, planification, journaux), en production chez ULIT. Argos : une plateforme d’agents IA de pentest et de défense, en développement ; aujourd’hui, seul son moteur de découverte OSINT existe.',
          en: 'BlockTrader: a backtesting engine with anti-overfitting protocols, in development; AI steering is its goal, not wired in yet. Salesforce Executor: a complete internal tool (execution, scheduling, logs), in production at ULIT. Argos: a platform of AI pentest and defence agents, in development; today only its OSINT discovery engine exists.',
        },
        sources: [
          { kind: 'project', slug: 'blocktrader' },
          { kind: 'project', slug: 'salesforce-executor' },
          { kind: 'project', slug: 'argos' },
        ],
        validated: false,
      },
      {
        id: 'production',
        question: { fr: 'Lequel est utilisé en entreprise ?', en: 'Which one is used by a company?' },
        answer: {
          fr: 'Salesforce Executor, développé chez ULIT pendant son poste de développeur full-stack Salesforce (janvier à juin 2026) : l’outil est en production dans l’entreprise.',
          en: 'Salesforce Executor, built at ULIT during his full-stack Salesforce developer job (January to June 2026): the tool is in production at the company.',
        },
        sources: [{ kind: 'project', slug: 'salesforce-executor' }, { kind: 'section', node: 'parcours' }],
        validated: false,
      },
    ],
  },
  {
    id: 'lab',
    label: { fr: 'Lab', en: 'Lab' },
    target: '#lab',
    questions: [
      {
        id: 'pentest',
        question: { fr: 'Qu’a-t-il fait en pentest ?', en: 'What has he done in pentesting?' },
        answer: {
          fr: 'Il est certifié Jr Penetration Tester (TryHackMe, 96 h). Il a publié 25 write-ups de machines attaquées, sur Exegol (labs Epitech) et sur TryHackMe : web, élévation de privilèges, Active Directory, mots de passe… Vous pouvez aussi tenter ses défis dans le Lab.',
          en: 'He is a certified Jr Penetration Tester (TryHackMe, 96 h). He has published 25 write-ups of attacked machines, on Exegol (Epitech labs) and on TryHackMe: web, privilege escalation, Active Directory, passwords… You can also try his challenges in the Lab.',
        },
        sources: [
          { kind: 'credential', id: 'thm-jr-penetration-tester' },
          { kind: 'project', slug: 'pentest' },
          { kind: 'section', node: 'lab' },
        ],
        validated: false,
      },
      {
        id: 'ctf',
        question: { fr: 'Peut-on tester ses défis ?', en: 'Can I try his challenges?' },
        answer: {
          fr: 'Oui : le Lab propose un CTF à jouer dans le navigateur, du premier flag caché dans la page jusqu’aux niveaux suivants. Votre progression reste enregistrée dans ce navigateur.',
          en: 'Yes: the Lab has a CTF you play in the browser, from the first flag hidden in the page to the next levels. Your progress is kept in this browser.',
        },
        sources: [{ kind: 'section', node: 'lab' }, { kind: 'project', slug: 'ctf-du-site' }],
        validated: false,
      },
    ],
  },
  {
    id: 'parcours',
    label: { fr: 'Parcours', en: 'Journey' },
    target: '#parcours',
    questions: [
      {
        id: 'path',
        question: { fr: 'Quel est son parcours ?', en: 'What is his background?' },
        answer: {
          fr: 'Formation militaire dans l’Armée de terre (2014–2016), puis technicien mécanique en compétition et maintenance (2017–2025), en parallèle d’une infrastructure de minage blockchain (2018–2022). Il passe à l’informatique avec le Pré-MSc Epitech (2025), devient développeur full-stack Salesforce chez ULIT (janvier à juin 2026) et poursuit en MSc depuis septembre 2026.',
          en: 'Military training in the French Army (2014–2016), then racing and maintenance mechanical technician (2017–2025), alongside a blockchain mining infrastructure (2018–2022). He moved into IT with the Epitech Pre-MSc (2025), became a full-stack Salesforce developer at ULIT (January to June 2026) and has been in the MSc since September 2026.',
        },
        sources: [{ kind: 'section', node: 'parcours' }],
        validated: false,
      },
      {
        id: 'languages',
        question: { fr: 'Quelles langues parle-t-il ?', en: 'Which languages does he speak?' },
        answer: {
          fr: 'Français (langue maternelle) ; anglais, espagnol et arabe (libanais et littéraire) au niveau C1 ; allemand en bases (A1). Il a vécu dans six pays : Liban, Qatar, Arabie saoudite, Canada, Pérou et France.',
          en: 'French (native); English, Spanish and Arabic (Lebanese and Modern Standard) at C1; basic German (A1). He has lived in six countries: Lebanon, Qatar, Saudi Arabia, Canada, Peru and France.',
        },
        sources: [{ kind: 'section', node: 'profile' }, { kind: 'section', node: 'parcours' }],
        validated: false,
      },
    ],
  },
  {
    id: 'certifications',
    label: { fr: 'Certifications', en: 'Certifications' },
    target: '#certifications',
    questions: [
      {
        id: 'main',
        question: { fr: 'Quelles sont ses certifications principales ?', en: 'What are his main certifications?' },
        answer: {
          fr: 'Jr Penetration Tester de TryHackMe (96 h, octobre 2026), le parcours pentest le plus complet de la plateforme, et l’IBM AI Developer Professional Certificate. Il a aussi validé les parcours TryHackMe Cyber Security 101 et Pre Security.',
          en: 'TryHackMe’s Jr Penetration Tester (96 h, October 2026), the platform’s most complete pentest path, and the IBM AI Developer Professional Certificate. He has also completed the TryHackMe Cyber Security 101 and Pre Security paths.',
        },
        sources: [
          { kind: 'credential', id: 'thm-jr-penetration-tester' },
          { kind: 'credential', id: 'ibm-ai-developer' },
          { kind: 'section', node: 'certifications' },
        ],
        validated: false,
      },
    ],
  },
  {
    id: 'contact',
    label: { fr: 'Contact', en: 'Contact' },
    target: '#contact',
    questions: [
      {
        id: 'available',
        question: { fr: 'Est-il disponible ?', en: 'Is he available?' },
        answer: {
          fr: 'Oui, immédiatement. Il cherche une alternance (4 jours en entreprise, 1 jour à l’école, MSc Epitech) ; un stage est possible. Basé à Marseille, mobile.',
          en: 'Yes, immediately. He is looking for a work-study position (4 days at the company, 1 day at school, MSc Epitech); an internship is possible. Based in Marseille, open to relocation.',
        },
        sources: [{ kind: 'section', node: 'contact' }],
        validated: false,
      },
      {
        id: 'reach',
        question: { fr: 'Comment le contacter ?', en: 'How can I reach him?' },
        answer: {
          fr: 'Par le formulaire de contact du site ou par e-mail (jeremie.nagi@epitech.eu). Son CV se télécharge en haut de la page.',
          en: 'Through the site’s contact form or by email (jeremie.nagi@epitech.eu). His CV can be downloaded at the top of the page.',
        },
        sources: [{ kind: 'section', node: 'contact' }],
        validated: false,
      },
    ],
  },
]

export const assistantUi = {
  /** The mascot's name (2026-10-27): a sentinel robot whose eyes are two neurons. */
  name: 'Sentry',
  role: { fr: 'Assistant IA de Jérémie', en: 'Jérémie’s AI assistant' },
  online: { fr: 'En ligne', en: 'Online' },
  offline: { fr: 'Fiches du portfolio · IA à venir', en: 'Portfolio cards · AI coming soon' },
  designing: { fr: 'En cours de conception', en: 'Under development' },
  underConstruction: {
    fr: 'Je suis en cours de conception, merci de revenir plus tard.',
    en: 'I am still under development. Please come back later.',
  },
  open: { fr: 'Ouvrir la conversation avec Sentry', en: 'Open the chat with Sentry' },
  close: { fr: 'Réduire la conversation', en: 'Minimise the chat' },
  title: { fr: 'Sentry', en: 'Sentry' },
  subtitle: { fr: 'Répond uniquement sur Jérémie, avec ses sources', en: 'Answers only about Jérémie, with its sources' },
  greeting: {
    fr: 'Bonjour, je suis Sentry. Découvrez le parcours, les compétences et les projets de Jérémie avec les fiches préparées ci-dessous et leurs sources. L’assistant IA conversationnel sera connecté plus tard.',
    en: 'Hello, I am Sentry. Explore Jérémie’s background, skills and projects through the prepared cards below and their sources. The conversational AI assistant will be connected later.',
  },
  welcomeTitle: { fr: 'Bonjour, moi c’est Sentry ! 👋', en: 'Hello, I’m Sentry! 👋' },
  welcomeBody: {
    fr: 'Voici mon réseau de neurones. Il illustre la façon dont je traite l’information pendant que je vous guide à travers le portfolio de Jérémie.',
    en: 'Here is my neural network. It illustrates how I process information while guiding you through Jérémie’s portfolio.',
  },
  /** Captions under the brain's layers. */
  layers: {
    io: { fr: 'Échanges', en: 'Exchanges' },
    model: { fr: 'Modèle', en: 'Model' },
    knowledge: { fr: 'Ce qu’il sait', en: 'What it knows' },
  },
  nodeHint: { fr: 'Cliquez un nœud : l’assistant répond sur cette partie.', en: 'Click a node: the assistant answers about that part.' },
  note: { fr: 'Illustration des étapes de l’assistant, pas des neurones du modèle.', en: 'An illustration of the assistant’s steps, not of the model’s neurons.' },
  ask: { fr: 'Demander', en: 'Ask' },
  inputNode: { fr: 'question', en: 'question' },
  outputNode: { fr: 'réponse', en: 'answer' },
  reading: { fr: 'Ouverture de la fiche…', en: 'Opening the card…' },
  searching: { fr: 'Sources de la fiche', en: 'Card sources' },
  writing: { fr: 'Affichage de la fiche…', en: 'Displaying the card…' },
  sources: { fr: 'Sources', en: 'Sources' },
  goTo: { fr: 'Aller à la section', en: 'Go to the section' },
  draft: { fr: 'Brouillon, à valider par Jérémie', en: 'Draft, to be approved by Jérémie' },
  validated: { fr: 'Réponse validée par Jérémie', en: 'Answer approved by Jérémie' },
  otherTopics: { fr: 'Autres sujets', en: 'Other topics' },
  inputLabel: { fr: 'Votre question', en: 'Your question' },
  placeholder: { fr: 'Posez une question sur Jérémie…', en: 'Ask a question about Jérémie…' },
  send: { fr: 'Envoyer', en: 'Send' },
  freeSoon: {
    fr: 'Les questions libres arrivent bientôt. En attendant, choisissez une question ci-dessous, ou écrivez directement à Jérémie.',
    en: 'Free questions are coming soon. Meanwhile, pick a question below, or write to Jérémie directly.',
  },
  writeToHim: { fr: 'Écrire à Jérémie', en: 'Write to Jérémie' },
}
