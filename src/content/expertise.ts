import { groupOf } from '../lib/projects'
import { projects } from './projects'
import type { Localized, Track } from './types'

// Expertise carousel: six domains, each a list of tools that scrolls by.
// Only real technical stack (libraries, frameworks, languages, tools): no models or hosted
// services (Llama 3, watsonx, Groq, Whisper) and no standards (OWASP Top 10, ISO 27001, RGPD).
// Each domain's tools are grouped by sub-domain, in the order they are used (no group titles shown).
// Tools come from skills.ts (backed by projects, write-ups or certificate syllabuses);
// proofs from tracks.ts and certifications.ts (verified 2026-10-17).
// A tool used in projects shows how many, and lists them on hover by origin, so repeated use shows (decision 2026-10-31).
// Cyber tools come from write-ups and certificate rooms, not one project each: their note says what they do.

type ExpertiseTool = {
  name: string
  /** What the tool does, for a tool not tied to projects. */
  note?: Localized
  /** Slugs of the projects using the tool, most telling first. */
  projects?: string[]
}

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

const t = (name: string, fr: string, en?: string): ExpertiseTool => ({ name, note: en ? { fr, en } : { fr } })
const used = (name: string, slugs: string[]): ExpertiseTool => ({ name, projects: slugs })

export const projectCount = (count: number) => `${count} ${count > 1 ? 'projets' : 'projet'}`

/** A tool's projects by origin, in the same two groups as the Projects section; an empty group is left out. */
export function projectsByOrigin(slugs: string[]) {
  const used = slugs.flatMap((slug) => projects.find((project) => project.slug === slug) ?? [])
  return [
    { title: 'Perso & pro', names: used.filter((project) => groupOf(project) === 'perso-pro').map((project) => project.title) },
    { title: 'Formation', names: used.filter((project) => groupOf(project) === 'formation').map((project) => project.title) },
  ].filter((group) => group.names.length > 0)
}

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
      used('LangChain', ['rag-pdf-chatbot']),
      used('FAISS', ['rag-pdf-chatbot']),
      used('Hugging Face Transformers', ['rag-pdf-chatbot', 'meeting-companion', 'llm-context-wrapper']),
      used('PyTorch', ['llm-context-wrapper']),
      used('spaCy', ['bookworm']),
      used('Gradio', ['meeting-companion', 'career-coach']),
      used('Flask', ['rag-pdf-chatbot', 'assistant-translator', 'ai-voice-assistant']),
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
      t('Jupyter', 'Certification IBM'),
      used('Pandas', ['blocktrader', 'hackathon-citiz']),
      used('NumPy', ['blocktrader', 'hackathon-citiz']),
      used('GeoPandas', ['hackathon-citiz']),
      used('Parquet', ['hackathon-citiz']),
      // Alice_In_Wonderland (Bookworm) modules/topics.py and similarity.py, all Jérémie's commits.
      used('scikit-learn', ['bookworm']),
      // blocktrader/engine/fast.py: compiled copy of the reference engine, about 25x faster.
      used('Numba', ['blocktrader']),
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
      used('Docker', ['time-manager', 'chatflow', 'generateur-otp-rcs', 'hackathon-citiz', 'popeye', 'my-marvin']),
      used('Kubernetes', ['kubernetes']),
      used('GitHub Actions', ['blocktrader', 'chronox', 'maria-agent', 'argos-security-arena']),
      used('Jenkins', ['my-marvin']),
      used('Vitest', ['time-manager', 'argos-security-arena']),
      used('Jest', ['chatflow']),
      used('pytest', ['argos']),
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
      used('TypeScript', ['blocktrader', 'maria-agent', 'generateur-otp-rcs', 'time-manager']),
      used('JavaScript', ['salesforce-executor', 'ctf-du-site', 'zeroday']),
      used('Python', ['blocktrader', 'argos', 'cyberpong', 'unit-converter', 'hackathon-citiz', 'bookworm', 'rag-pdf-chatbot', 'meeting-companion', 'career-coach', 'assistant-translator', 'ai-voice-assistant', 'llm-context-wrapper']),
      used('Java', ['vaultborn']),
      used('C++', ['chronox']),
      used('Rust', ['maria-agent']),
      used('C#', ['zeroday']),
      used('Apex', ['salesforce-executor']),
      used('React', ['blocktrader', 'maria-agent', 'argos-security-arena', 'ctf-du-site', 'time-manager', 'chatflow']),
      used('Next.js', ['chatflow']),
      used('NestJS', ['generateur-otp-rcs', 'time-manager']),
      used('Express', ['chatflow', 'platino']),
      used('Prisma', ['chatflow']),
      used('SQL', ['chronox', 'argos', 'chatflow', 'time-manager']),
      used('PostgreSQL', ['time-manager', 'kubernetes', 'platino', 'popeye']),
      used('MongoDB', ['generateur-otp-rcs']),
      used('Redis', ['kubernetes', 'popeye']),
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
