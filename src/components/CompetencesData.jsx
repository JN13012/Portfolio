export const hardSkills = [
  {
    category: "Cybersécurité",
    icon: "🛡️",
    theme: "border-red-500/40 text-red-400",
    glow: "shadow-[0_0_25px_rgba(239,68,68,0.15)]",
    tools: ["Nmap", "Metasploit", "Wireshark", "Burp Suite", "Hydra", "Snort", "Hashcat"],
    items: [
      { 
        name: "Pentest Offensif (THM 101)", 
        tools: "Nmap, Gobuster, Metasploit, SQLMap", 
        details: "Scan & énumération de services. Exploitation de vulnérabilités Web (Injections SQL, XSS, IDOR) et brute-force (Hydra, John the Ripper). Méthodologie alignée sur l'OWASP Top 10." 
      },
      { 
        name: "Sécurité Défensive & Réseaux", 
        tools: "Snort, Fail2ban, Wireshark, TCPdump", 
        details: "Analyse du modèle OSI et des protocoles (TCP/IP, DNS, HTTP). Configuration d'IDS/IPS et analyse de trafic réseau pour détecter des patterns d'attaque ou des exfiltrations." 
      },
      { 
        name: "Sécurité Applicative & Auth", 
        tools: "JWT, Bcrypt, Middleware Security", 
        details: "Implémentation de protocoles d'authentification sécurisés (Tokens JWT), hachage de mots de passe et protection des routes API (CRUD) contre les accès non autorisés." 
      },
      { 
        name: "Digital Forensic", 
        tools: "REMnux, FlareVM, Autopsy", 
        details: "Analyse de malwares en environnement isolé, investigation de logs système et récupération d'artefacts numériques pour l'analyse post-incident." 
      }
    ]
  },
  {
    category: "Intelligence Artificielle",
    icon: "🤖",
    theme: "border-blue-500/40 text-blue-400",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
    tools: ["IBM Watsonx", "PyTorch", "LangChain", "Hugging Face", "FAISS", "Python"],
    items: [
      { 
        name: "Développement IA (IBM)", 
        tools: "Watsonx.ai, Llama 3, Granite", 
        details: "Conception de solutions d'IA générative. Maîtrise des APIs d'inférence, du Prompt Engineering et de l'intégration de modèles STT (Speech-to-Text) et TTS (Text-to-Speech)." 
      },
      { 
        name: "Architecture RAG", 
        tools: "FAISS, ChromaDB, LangChain", 
        details: "Mise en place de systèmes de récupération augmentée (RAG). Indexation de documents via embeddings sémantiques et gestion de la persistance du contexte conversationnel." 
      },
      { 
        name: "Data Processing & NLP", 
        tools: "Pandas, NumPy, Scikit-learn", 
        details: "Nettoyage et préparation de datasets, tokenization et analyse du langage naturel pour l'entraînement ou le fine-tuning léger de pipelines IA." 
      },
      { 
        name: "Éthique & Gouvernance IA", 
        tools: "AI Fairness 360, Watsonx.governance", 
        details: "Évaluation des biais dans les modèles, monitoring de la 'dérive' (drift) et implémentation de pratiques d'IA responsable selon les standards IBM." 
      }
    ]
  },
  {
    category: "Ingénierie & DevSecOps",
    icon: "⚙️",
    theme: "border-emerald-500/40 text-emerald-400",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    tools: ["Docker", "Jenkins", "Linux", "Node.js", "MySQL", "Prisma", "Salesforce"],
    items: [
      { 
        name: "Architecture Fullstack", 
        tools: "Next.js, Socket.io, Prisma", 
        details: "Développement d'applications temps réel avec WebSockets. Gestion de bases de données relationnelles (MySQL) et ORM pour garantir l'intégrité des données." 
      },
      { 
        name: "DevSecOps & CI/CD", 
        tools: "Docker, Jenkins, JCasC, Git", 
        details: "Conteneurisation d'applications complexes via Docker-Compose. Automatisation de pipelines de déploiement et intégration de tests de sécurité automatisés." 
      },
      { 
        name: "Administration Système & AD", 
        tools: "Linux (Bash), Active Directory, GPO", 
        details: "Gestion des utilisateurs et des politiques de sécurité (GPO) sous Windows Server. Automatisation de tâches d'administration via scripts Bash et Python." 
      },
      { 
        name: "Écosystème Salesforce", 
        tools: "Apex, SOQL, Salesforce Flows", 
        details: "Développement de composants personnalisés, gestion de la planification (scheduling) et suivi rigoureux des logs d'exécution sur la plateforme Salesforce." 
      }
    ]
  }
];