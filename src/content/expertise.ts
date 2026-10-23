import type { Localized, Track } from './types'

// Expertise carousel: five domains, each a list of tools that scrolls by.
// Only real technical stack (libraries, frameworks, languages, tools): no models or hosted
// services (Llama 3, watsonx, Groq, Whisper) and no standards (OWASP Top 10, ISO 27001, RGPD).
// Tools come from skills.ts (backed by projects, write-ups or certificate syllabuses);
// proofs from tracks.ts and certifications.ts (verified 2026-10-17).

export type ExpertiseTool = { name: string; note: Localized }

export type ExpertiseDomain = {
  id: 'ia' | 'offensive' | 'defensive' | 'devops' | 'dev'
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
      t('LangChain', 'Pipelines RAG et orchestration LLM', 'RAG pipelines and LLM orchestration'),
      t('FAISS', 'Recherche vectorielle', 'Vector search'),
      t('Hugging Face Transformers', 'Bibliothèque de modèles pré-entraînés', 'Pre-trained model library'),
      t('Gradio', 'Interfaces de démonstration', 'Demo interfaces'),
      t('spaCy', 'Traitement du langage', 'Natural language processing'),
      t('PyTorch', 'Machine learning', 'Machine learning'),
      t('Pandas', 'Manipulation de datasets', 'Dataset handling'),
      t('NumPy', 'Calcul numérique', 'Numerical computing'),
      t('Flask', 'API Python des applications IA', 'Python APIs for AI apps'),
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
      { fr: 'Jr Penetration Tester (95 h)', en: 'Jr Penetration Tester (95 h)' },
      { fr: '25 write-ups publiés', en: '25 published write-ups' },
      { fr: 'Un audit web autorisé', en: 'One authorised web audit' },
    ],
    tools: [
      t('Nmap', 'Scan et énumération réseau', 'Network scanning and enumeration'),
      t('Gobuster', 'Fuzzing web', 'Web fuzzing'),
      t('Burp Suite', 'Proxy et analyse HTTP', 'HTTP proxy and analysis'),
      t('SQLMap', 'Injections SQL', 'SQL injection testing'),
      t('Metasploit', 'Exploitation et payloads', 'Exploitation and payloads'),
      t('NetExec', 'Énumération Active Directory', 'Active Directory enumeration'),
      t('Impacket', 'Protocoles Windows (SMB, Kerberos)', 'Windows protocols (SMB, Kerberos)'),
      t('BloodHound', 'Chemins d’attaque Active Directory', 'Active Directory attack paths'),
      t('Responder', 'Capture de hashs NTLM', 'NTLM hash capture'),
      // Used in an Active Directory lab (Jérémie, 2026-10-23); not in the public write-ups.
      t('Mimikatz', 'Extraction d’identifiants Windows', 'Windows credential extraction'),
      t('pypykatz', 'Analyse de dumps LSASS (Python)', 'LSASS dump analysis (Python)'),
      t('Hashcat', 'Cassage de hashs', 'Hash cracking'),
      t('John the Ripper', 'Cassage de mots de passe', 'Password cracking'),
      t('Hydra', 'Audit d’authentification', 'Authentication testing'),
      t('Linux', 'Élévation de privilèges (SUID, sudo, cron)', 'Privilege escalation (SUID, sudo, cron)'),
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
      t('Splunk', 'SIEM et requêtes SPL', 'SIEM and SPL queries'),
      t('Wireshark', 'Inspection de paquets', 'Packet inspection'),
      t('Snort', 'Règles IDS', 'IDS rules'),
      t('Fail2ban', 'Protection anti brute-force', 'Brute-force protection'),
      t('FlareVM', 'Analyse de malwares Windows', 'Windows malware analysis'),
      t('REMnux', 'Analyse de malwares Linux', 'Linux malware analysis'),
      t('CyberChef', 'Décodage et transformation', 'Decoding and transformation'),
    ],
  },
  {
    id: 'devops',
    track: 'dev',
    category: { fr: 'Ingénierie logicielle', en: 'Software engineering' },
    label: { fr: 'DevOps', en: 'DevOps' },
    positioning: {
      fr: 'Conteneurs, CI et tests automatisés, avec un pipeline durci sur BlockTrader.',
      en: 'Containers, CI and automated tests, with a hardened pipeline on BlockTrader.',
    },
    proofs: [
      { fr: '46 tests et CI durcie sur BlockTrader', en: '46 tests and hardened CI on BlockTrader' },
      { fr: 'Déploiement Kubernetes (projet Gandalf)', en: 'Kubernetes deployment (Gandalf project)' },
    ],
    tools: [
      t('Docker', 'Conteneurs et environnements multi-services (Compose)', 'Containers and multi-service environments (Compose)'),
      t('Kubernetes', 'Orchestration de conteneurs', 'Container orchestration'),
      t('GitHub Actions', 'CI et vérifications automatiques', 'CI and automated checks'),
      t('Jenkins', 'Pipelines CI/CD', 'CI/CD pipelines'),
      t('Vitest', 'Tests unitaires (TypeScript)', 'Unit tests (TypeScript)'),
      t('Jest', 'Tests unitaires (JavaScript)', 'Unit tests (JavaScript)'),
      t('pytest', 'Tests unitaires (Python)', 'Unit tests (Python)'),
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
      { fr: 'Alternance full-stack Salesforce (ULIT)', en: 'Full-stack Salesforce work-study (ULIT)' },
      { fr: 'Un outil interne en production', en: 'One internal tool in production' },
    ],
    tools: [
      t('TypeScript', 'Front-end et back-end typés', 'Typed front and back end'),
      t('JavaScript', 'Développement web', 'Web development'),
      t('Python', 'Scripts et API', 'Scripts and APIs'),
      t('Java', 'Programmation orientée objet', 'Object-oriented programming'),
      t('Apex', 'Développement Salesforce', 'Salesforce development'),
      t('React', 'Interfaces web', 'Web interfaces'),
      t('Next.js', 'Applications React', 'React applications'),
      t('NestJS', 'API Node.js structurées', 'Structured Node.js APIs'),
      t('Express', 'API Node.js', 'Node.js APIs'),
      t('Prisma', 'ORM TypeScript', 'TypeScript ORM'),
      t('SQL', 'Requêtes et modélisation', 'Queries and modelling'),
      t('PostgreSQL', 'Base relationnelle', 'Relational database'),
      t('MongoDB', 'Base documentaire', 'Document database'),
      t('Redis', 'Cache et files', 'Cache and queues'),
    ],
  },
]
