import type { Localized, Track } from './types'

// Expertise carousel: six domains, each a list of tools that scrolls by.
// Only real technical stack (libraries, frameworks, languages, tools): no models or hosted
// services (Llama 3, watsonx, Groq, Whisper) and no standards (OWASP Top 10, ISO 27001, RGPD).
// Each domain's tools are grouped by sub-domain, in the order they are used (no group titles shown).
// Tools come from skills.ts (backed by projects, write-ups or certificate syllabuses);
// proofs from tracks.ts and certifications.ts (verified 2026-10-17).

type ExpertiseTool = { name: string; note: Localized }

export type ExpertiseDomain = {
  id: 'ia' | 'data' | 'offensive' | 'defensive' | 'devops' | 'dev'
  /** Project filter the domain links to. */
  track: Track
  /** Family shown above the name on the carousel card. */
  category: Localized
  label: Localized
  positioning: Localized
  proofs: Localized[]
  tools: ExpertiseTool[]
}

const t = (name: string, fr: string, en: string): ExpertiseTool => ({ name, note: { fr, en } })

export const expertise: ExpertiseDomain[] = [
  {
    id: 'ia',
    track: 'ia',
    category: { fr: 'Intelligence artificielle', en: 'Artificial intelligence' },
    label: { fr: 'IA appliquée', en: 'Applied AI' },
    positioning: {
      fr: 'Des applications LLM de bout en bout (RAG, voix, orchestration), avec des garde-fous pensés dès la conception.',
      en: 'End-to-end LLM applications (RAG, speech, orchestration), with guard rails designed in from the start.',
    },
    proofs: [
      { fr: 'IBM AI Developer Professional', en: 'IBM AI Developer Professional' },
      { fr: '4 applications LLM publiées', en: '4 published LLM applications' },
    ],
    tools: [
      t('LangChain', 'Chatbot RAG sur des CV et des PDF', 'RAG chatbot over CVs and PDFs'),
      t('FAISS', 'Index vectoriel du chatbot RAG', 'Vector index of the RAG chatbot'),
      t('Hugging Face Transformers', 'Mémoire de conversation, embeddings du RAG', 'Conversation memory, RAG embeddings'),
      t('PyTorch', 'Exécution d’un modèle conversationnel', 'Running a conversational model'),
      t('spaCy', 'Analyse de livres : entités, thèmes, style', 'Book analysis: entities, themes, style'),
      t('Gradio', 'Interfaces de démo des applications IBM', 'Demo interfaces of the IBM applications'),
      t('Flask', 'Back-end des applications IA', 'Back end of the AI applications'),
    ],
  },
  {
    id: 'data',
    track: 'data',
    category: { fr: 'Données', en: 'Data' },
    label: { fr: 'Data', en: 'Data' },
    positioning: {
      fr: 'Des données publiques à la décision : nettoyage, géotraitement, cartes et indicateurs sourcés.',
      en: 'From open data to decisions: cleaning, geoprocessing, maps and sourced indicators.',
    },
    proofs: [
      { fr: '2e place au hackathon Microsoft × Citiz', en: '2nd place at the Microsoft × Citiz hackathon' },
      { fr: 'Réseau piéton de 16,6 M de nœuds', en: '16.6 M-node pedestrian network' },
    ],
    tools: [
      // « Python for Data Science, AI & Development » (IBM AI Developer): notebooks, Pandas and NumPy.
      t('Jupyter', 'Notebooks d’analyse (certification IBM)', 'Analysis notebooks (IBM certification)'),
      t('Pandas', 'Hackathon Citiz, backtests crypto', 'Citiz hackathon, crypto backtests'),
      t('NumPy', 'Hackathon Citiz, études BlockTrader', 'Citiz hackathon, BlockTrader studies'),
      t('GeoPandas', 'Contours, isochrones et couverture (Citiz)', 'Boundaries, isochrones and coverage (Citiz)'),
      t('Parquet', 'Tables bronze, silver et gold (Citiz)', 'Bronze, silver and gold tables (Citiz)'),
      // Alice_In_Wonderland (Bookworm) modules/topics.py and similarity.py, all Jérémie's commits.
      t('scikit-learn', 'TF-IDF et similarité cosinus (Bookworm)', 'TF-IDF and cosine similarity (Bookworm)'),
      // blocktrader/engine/fast.py: compiled copy of the reference engine, about 25x faster.
      t('Numba', 'Moteur de backtest compilé, ≈ 25× plus rapide (BlockTrader)', 'Compiled backtest engine, ≈ 25× faster (BlockTrader)'),
    ],
  },
  {
    id: 'offensive',
    track: 'cyber',
    category: { fr: 'Cybersécurité', en: 'Cybersecurity' },
    label: { fr: 'Pentest', en: 'Pentest' },
    positioning: {
      fr: 'Pentest web et Active Directory, avec une méthode documentée de la reconnaissance au rapport.',
      en: 'Web and Active Directory pentesting, with a documented method from reconnaissance to report.',
    },
    proofs: [
      { fr: 'Jr Penetration Tester (96 h)', en: 'Jr Penetration Tester (96 h)' },
      { fr: '25 write-ups publiés', en: '25 published write-ups' },
      { fr: 'Un audit web autorisé', en: 'One authorised web audit' },
    ],
    tools: [
      // ffuf, CeWL, Kerbrute, Evil-WinRM, linPEAS: Jr Penetration Tester rooms (Jérémie's Obsidian notes, 2026-10-26).
      t('Nmap', 'Reconnaissance de chaque machine', 'Reconnaissance of every machine'),
      t('Gobuster', 'Découverte de contenu web caché', 'Hidden web content discovery'),
      t('ffuf', 'Fuzzing web et énumération d’identifiants', 'Web fuzzing and username enumeration'),
      t('Burp Suite', 'Tests d’applications web', 'Web application testing'),
      t('SQLMap', 'Tests d’injection SQL', 'SQL injection testing'),
      // AI security tools, used in the Jr Penetration Tester « LLM Pentesting » room (Jérémie, 2026-10-26).
      t('Promptfoo', 'Pentest de LLM : tests d’attaque répétables', 'LLM pentesting: repeatable attack tests'),
      t('garak', 'Scan de vulnérabilités d’un LLM', 'LLM vulnerability scanning'),
      t('PyRIT', 'Campagnes de red teaming sur un LLM', 'Red-teaming campaigns on an LLM'),
      t('Metasploit', 'Exploitation en environnement de lab', 'Exploitation in lab environments'),
      t('Netcat', 'Reverse shells et écoute de ports', 'Reverse shells and port listeners'),
      t('linPEAS', 'Recherche automatique d’élévation de privilèges Linux', 'Automated Linux privilege-escalation checks'),
      t('Bash', 'Ligne de commande et scripts d’automatisation', 'Command line and automation scripts'),
      t('Kerbrute', 'Énumération d’utilisateurs par Kerberos', 'User enumeration through Kerberos'),
      t('Responder', 'Tests réseau en lab Active Directory', 'Network testing in an Active Directory lab'),
      t('NetExec', 'Énumération SMB et Active Directory', 'SMB and Active Directory enumeration'),
      t('BloodHound', 'Cartographie Active Directory', 'Active Directory mapping'),
      t('Impacket', 'Attaques Kerberos et Active Directory', 'Kerberos and Active Directory attacks'),
      t('Evil-WinRM', 'Mouvement latéral en Active Directory', 'Lateral movement in Active Directory'),
      // Used in an Active Directory lab (Jérémie, 2026-10-23); not in the public write-ups.
      t('Mimikatz', 'Extraction d’identifiants en lab Active Directory', 'Credential extraction in an Active Directory lab'),
      t('CeWL', 'Listes de mots tirées du site cible', 'Wordlists built from the target site'),
      t('Hashcat', 'Audit de robustesse des mots de passe', 'Password strength auditing'),
      t('John the Ripper', 'Audit de robustesse des mots de passe', 'Password strength auditing'),
      t('Hydra', 'Audit des authentifications', 'Authentication auditing'),
    ],
  },
  {
    id: 'defensive',
    track: 'cyber',
    category: { fr: 'Cybersécurité', en: 'Cybersecurity' },
    label: { fr: 'Cyberdéfense', en: 'Cyber defence' },
    positioning: {
      fr: 'Analyse de logs et de trafic, malwares en environnement isolé, durcissement et conformité.',
      en: 'Log and traffic analysis, malware in isolated labs, hardening and compliance.',
    },
    proofs: [
      { fr: 'Cyber Security 101 (SEC1)', en: 'Cyber Security 101 (SEC1)' },
      { fr: 'SOC Level 1 en cours', en: 'SOC Level 1 in progress' },
    ],
    tools: [
      t('Splunk', 'Investigation de logs', 'Log investigation'),
      t('Wireshark', 'Analyse de captures réseau', 'Network capture analysis'),
      t('Snort', 'Règles de détection', 'Detection rules'),
      t('Fail2ban', 'Protection contre le brute force', 'Brute-force protection'),
      t('FlareVM', 'Analyse de malwares Windows', 'Windows malware analysis'),
      t('REMnux', 'Analyse de malwares', 'Malware analysis'),
      t('CyberChef', 'Décodage de données', 'Data decoding'),
    ],
  },
  {
    id: 'devops',
    track: 'devops',
    category: { fr: 'Ingénierie logicielle', en: 'Software engineering' },
    label: { fr: 'DevOps', en: 'DevOps' },
    positioning: {
      fr: 'Conteneurs, CI et tests automatisés, avec un pipeline durci sur BlockTrader.',
      en: 'Containers, CI and automated tests, with a hardened pipeline on BlockTrader.',
    },
    proofs: [
      { fr: '56 tests et CI durcie sur BlockTrader', en: '56 tests and hardened CI on BlockTrader' },
      { fr: 'Déploiement Kubernetes (projet Bernstein)', en: 'Kubernetes deployment (Bernstein project)' },
    ],
    tools: [
      t('Docker', 'Conteneurisation des projets (Compose)', 'Containerising the projects (Compose)'),
      t('Kubernetes', 'Cluster k3d multi-nœuds : ingress, RBAC, volumes', 'Multi-node k3d cluster: ingress, RBAC, volumes'),
      t('GitHub Actions', 'CI durcie de BlockTrader', 'Hardened CI of BlockTrader'),
      t('Jenkins', 'Instance configurée par le code (JCasC)', 'Instance configured as code (JCasC)'),
      t('Vitest', 'Tests de Time Manager et d’Argos Security Arena', 'Tests of Time Manager and Argos Security Arena'),
      t('Jest', 'Tests de ChatFlow', 'Tests of ChatFlow'),
      t('pytest', 'Tests du moteur Argos', 'Tests of the Argos engine'),
    ],
  },
  {
    id: 'dev',
    track: 'dev',
    category: { fr: 'Ingénierie logicielle', en: 'Software engineering' },
    label: { fr: 'Développement', en: 'Development' },
    positioning: {
      fr: 'Du code testé et automatisé, du prototype à la production.',
      en: 'Tested, automated code, from prototype to production.',
    },
    proofs: [
      { fr: 'Stage full-stack Salesforce (ULIT)', en: 'Full-stack Salesforce internship (ULIT)' },
      { fr: 'Un outil interne en production', en: 'One internal tool in production' },
    ],
    tools: [
      t('TypeScript', 'BlockTrader, générateur OTP, Time Manager', 'BlockTrader, OTP generator, Time Manager'),
      t('JavaScript', 'Code Executor (Salesforce), CTF du portfolio', 'Code Executor (Salesforce), portfolio CTF'),
      t('Python', 'Argos, BlockTrader, applications IA', 'Argos, BlockTrader, AI applications'),
      t('Java', 'Vaultborn, action-RPG 2D (LibGDX)', 'Vaultborn, 2D action RPG (LibGDX)'),
      t('C++', 'Chronox, widget Windows natif (C++20)', 'Chronox, native Windows widget (C++20)'),
      t('Rust', 'API de Maria Agent (Axum, Tokio)', 'Maria Agent API (Axum, Tokio)'),
      t('C#', 'ZeroDay, jeu de stratégie (Unity)', 'ZeroDay, strategy game (Unity)'),
      t('Apex', 'Développement Salesforce en stage', 'Salesforce development (internship)'),
      t('React', 'BlockTrader, ChatFlow, ce portfolio', 'BlockTrader, ChatFlow, this portfolio'),
      t('Tailwind CSS', 'Ce portfolio, Maria Agent', 'This portfolio, Maria Agent'),
      t('Vite', 'Ce portfolio, Maria Agent', 'This portfolio, Maria Agent'),
      t('Next.js', 'Messagerie temps réel ChatFlow', 'ChatFlow real-time messaging'),
      t('NestJS', 'API du générateur OTP et de Time Manager', 'APIs of the OTP generator and Time Manager'),
      t('Express', 'API de ChatFlow', 'ChatFlow API'),
      t('Axum', 'API de Maria Agent', 'Maria Agent API'),
      t('Win32', 'Fenêtre et session Windows de Chronox', 'Chronox window and Windows session'),
      t('Direct2D', 'Dessin du widget Chronox', 'Chronox widget drawing'),
      t('CMake', 'Build de Chronox', 'Chronox build'),
      t('Prisma', 'Modèle de données de ChatFlow', 'ChatFlow data model'),
      t('SQL', 'Modélisation et requêtes', 'Modelling and queries'),
      t('PostgreSQL', 'Bases de données de Time Manager, Bernstein et POPEYE', 'Databases of Time Manager, Bernstein and POPEYE'),
      t('MongoDB', 'Base du générateur OTP', 'OTP generator database'),
      t('SQLite', 'Historique local de Chronox', 'Chronox local history'),
      t('Redis', 'File de votes de Bernstein (Kubernetes)', 'Vote queue of Bernstein (Kubernetes)'),
    ],
  },
]

/**
 * Full domain order when the visitor arrives through a targeted link (?metier=ia|data|cyber|dev|devops, see
 * src/lib/projects.ts). One job per link: only the first value is used.
 */
const domainOrderFor: Record<Track, ExpertiseDomain['id'][]> = {
  ia: ['ia', 'data', 'offensive', 'defensive', 'devops', 'dev'],
  data: ['data', 'ia', 'dev', 'devops', 'offensive', 'defensive'],
  cyber: ['offensive', 'defensive', 'ia', 'data', 'devops', 'dev'],
  dev: ['dev', 'devops', 'ia', 'data', 'offensive', 'defensive'],
  devops: ['devops', 'dev', 'offensive', 'defensive', 'ia', 'data'],
}

/** The domains in display order for the job of the link (none = default order). */
export function orderedDomains(tracks: Track[]): ExpertiseDomain[] {
  const order = tracks[0] ? domainOrderFor[tracks[0]] : expertise.map((d) => d.id)
  return order.map((id) => expertise.find((d) => d.id === id)!)
}
