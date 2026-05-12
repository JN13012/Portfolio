export const DOMAINS = [
  // =========================================================
  // CYBERSÉCURITÉ (5 → 3 items)
  // =========================================================
  {
    category: "Cybersécurité",
    label: "SECURITY",
    index: "01",
    icon: "🛡️",
    hue: "#bf3a2e",
    muted: "rgba(191,58,46,0.1)",
    border: "rgba(191,58,46,0.2)",
    tag: "Offensive · Defensive · Forensics",
    items: [
      {
        name: "Offensive Security & Réseau",
        tools: ["Nmap", "Gobuster", "Metasploit", "SQLMap", "Wireshark", "TCPdump"],
        details:
          "Tests d’intrusion Web et réseau : reconnaissance, énumération de services, exploitation de vulnérabilités OWASP, analyse de trafic réseau et compréhension des protocoles TCP/IP. Approche offensive complète combinant pentest et audit réseau.",
      },
      {
        name: "Sécurité Applicative",
        tools: ["JWT", "Bcrypt", "OWASP", "Middleware", "Nftables"],
        details:
          "Sécurisation des APIs et applications web : authentification, hashing, protection des routes, prévention des injections SQL/XSS/CSRF et mise en place de politiques de sécurité applicatives robustes.",
      },
      {
        name: "Blue Team & Forensics",
        tools: [
          "Snort",
          "SIEM",
          "ELK Stack",
          "Grafana",
          "FlareVM",
          "Volatility",
          "Autopsy",
        ],
        details:
          "Détection d’intrusions, analyse de logs et investigation post-incident. Analyse de malwares, corrélation d’événements systèmes et réseau, monitoring temps réel et réponse aux incidents (SOC + forensic).",
      },
    ],
  },

  // =========================================================
  // IA (5 → 3 items)
  // =========================================================
  {
    category: "Intelligence Artificielle",
    label: "AI / ML",
    index: "02",
    icon: "🤖",
    hue: "#2563c4",
    muted: "rgba(37,99,196,0.1)",
    border: "rgba(37,99,196,0.2)",
    tag: "Generative · RAG · Governance",
    items: [
      {
        name: "LLMs & IA Générative",
        tools: [
          "Watsonx",
          "Llama",
          "Claude API",
          "Mistral",
          "HuggingFace",
          "Transformers",
          "spaCy",
        ],
        details:
          "Conception de systèmes IA génératifs : intégration de LLMs, prompt engineering avancé, NLP, classification de texte, embeddings et adaptation de modèles à des domaines spécifiques.",
      },
      {
        name: "RAG & Search Systems",
        tools: ["FAISS", "LangChain", "ChromaDB", "Pinecone"],
        details:
          "Architecture de systèmes RAG : embeddings vectoriels, recherche sémantique, gestion de mémoire longue durée et pipelines documentaires scalables pour LLMs.",
      },
      {
        name: "Machine Learning & AI Ops",
        tools: [
          "Scikit-learn",
          "Pandas",
          "NumPy",
          "XGBoost",
          "MLflow",
          "SHAP",
          "Evidently",
          "Fairness360",
        ],
        details:
          "Machine learning complet : entraînement de modèles, feature engineering, validation croisée, déploiement en production et monitoring (drift, biais, explicabilité).",
      },
    ],
  },

  // =========================================================
  // ENGINEERING (5 → 3 items)
  // =========================================================
  {
    category: "Ingénierie & DevSecOps",
    label: "ENGINEERING",
    index: "03",
    icon: "⚙️",
    hue: "#0e9e6e",
    muted: "rgba(14,158,110,0.1)",
    border: "rgba(14,158,110,0.2)",
    tag: "Fullstack · DevOps · Cloud",
    items: [
      {
        name: "Fullstack Architecture",
        tools: ["Next.js", "Prisma", "Socket.io", "tRPC"],
        details:
          "Applications fullstack modernes : SSR/SSG, APIs typées, temps réel, architecture scalable et optimisation performance frontend/backend.",
      },
      {
        name: "DevOps & Infrastructure",
        tools: [
          "Docker",
          "Jenkins",
          "GitHub Actions",
          "K8s",
          "Bash",
          "Ansible",
          "Nginx",
          "Systemd",
          "Redis",
          "PostgreSQL",
          "MySQL",
        ],
        details:
          "CI/CD, conteneurisation, orchestration Kubernetes, administration Linux, scripting, hardening serveurs et gestion de bases de données en production.",
      },
      {
        name: "Enterprise Systems",
        tools: ["Apex", "SOQL", "Flows", "LWC"],
        details:
          "Développement Salesforce : automatisation des processus métier, composants Lightning, logique backend et gestion de données CRM complexes.",
      },
    ],
  },
];