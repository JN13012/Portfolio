export const hardSkills = [
  // CYBERSECURITE
  {
    category: "Cybersécurité",
    icon: "🛡️",
    theme: "border-red-500/40 text-red-400",
    glow: "shadow-[0_0_25px_rgba(239,68,68,0.15)]",

    tools: [
      "Nmap",
      "Gobuster",
      "SQLMap",
      "Metasploit",
      "Hydra",
      "Hashcat",
      "JTR",
      "Splunk",
      "Snort",
      "Fail2Ban",
      "FlareVM",
      "TCP/IP",
    ],

    items: [
      {
        name: "Sécurité Offensive",
        icon: "⚔️",
        tools:
          "Nmap, Gobuster, SQLMap, Metasploit, Hydra, John The Ripper, Hashcat",
        details:
          "Réalisation de tests d’intrusion Web et réseau : reconnaissance, énumération de services, exploitation de vulnérabilités, brute force et analyse de surface d’attaque selon les méthodologies OWASP.",
      },

      {
        name: "Sécurité Défensive & Forensics",
        icon: "🧱",
        tools:
          "Splunk, Snort, Fail2Ban, SIEM, Monitoring, FlareVM, Reverse Engineering, Malware Analysis",
        details:
          "Mise en place de mécanismes de défense et de surveillance de sécurité : détection d’intrusions, supervision d’événements via SIEM, analyse de logs et monitoring d’infrastructure. Investigation post-incident, analyse de malwares en environnement isolé et récupération d’artefacts numériques.",
      },

      {
        name: "Réseaux & Protocoles",
        icon: "🌐",
        tools: "TCP/IP, DNS, HTTP, Routing, Wireshark",
        details:
          "Analyse des protocoles réseau, compréhension des couches TCP/IP, inspection de trafic et diagnostic de communications réseau.",
      },
    ],
  },

  // IA
  {
    category: "Intelligence Artificielle",
    icon: "🤖",
    theme: "border-blue-500/40 text-blue-400",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",

    tools: [
      "LLM",
      "NLP",
      "PyTorch",
      "Flask",
      "Inference",
      "Embeddings",
      "LangChain",
      "FAISS",
      "ChromaDB",
      "Transformers",
    ],

    items: [
      {
        name: "AI Engineering & Backend",
        icon: "⚙️",
        tools:
          "Flask, REST APIs, LangChain, Prompt Engineering, AI Workflows, Deployment, Groq, IBM Watsonx",
        details:
          "Conception et déploiement d’applications IA en production : développement de backends et APIs pour exposer des modèles d’IA, intégration de LLMs via prompt engineering, orchestration de workflows avec LangChain et gestion d’inférences via APIs. Focus sur la mise en production et l’intégration des modèles dans des systèmes applicatifs.",
      },

      {
        name: "Machine Learning & IA Fondamentale",
        icon: "🧠",
        tools:
          "PyTorch, Transformers, NLP, Embeddings, FAISS, ChromaDB, LLMs, Llama 3, Hugging Face, Inference Pipelines",
        details:
          "Maîtrise des concepts fondamentaux de l’intelligence artificielle moderne : modèles de langage (LLMs), NLP, embeddings et recherche sémantique. Expérience en inférence de modèles, construction de pipelines IA, indexation vectorielle et exploitation d’écosystèmes comme PyTorch et Hugging Face pour l’entraînement et l’évaluation de modèles.",
      },
    ],
  },

  // =========================================================
  // DEV & DEVSECOPS
  // =========================================================
  {
    category: "Ingénierie & DevSecOps",
    icon: "⚙️",
    theme: "border-emerald-500/40 text-emerald-400",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",

    tools: [
      "React",
      "Next.js",
      "Node.js",
      "Docker",
      "Jenkins",
      "Linux",
      "Git",
      "Socket.io",
      "MySQL",
      "Prisma",
      "CI/CD",
    ],

    items: [
      {
        name: "Fullstack & Applications Web",
        icon: "💻",
        tools: "React, Next.js, Node.js, Socket.io",
        details:
          "Développement d’applications web complètes et modernes avec interfaces dynamiques, communication temps réel et intégration frontend/backend. Conception d’expériences utilisateur interactives et performantes.",
      },

      {
        name: "Backend, APIs & Données",
        icon: "🔌",
        tools:
          "Node.js, Flask, REST APIs, Authentication, MySQL, Prisma, ORM, SQL",
        details:
          "Conception d’architectures backend robustes et sécurisées. Développement d’APIs REST, gestion de l’authentification et modélisation de bases de données relationnelles avec optimisation des accès et des performances.",
      },

      {
        name: "DevOps, Systèmes & Infrastructure",
        icon: "🚀",
        tools:
          "Docker, Jenkins, Git, CI/CD, Linux, Bash, System Administration",
        details:
          "Mise en place de pipelines CI/CD et automatisation des déploiements. Administration de systèmes Linux, scripting Bash et gestion d’infrastructures pour assurer fiabilité, scalabilité et reproductibilité des environnements.",
      },
    ],
  },
];
