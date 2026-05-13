import Sec from "../assets/THM.jpg";
import IA from "../assets/COURSERA.jpg";

// Devicon CDN — fallback silencieux via onError dans le composant
export const TOOL_ICONS = {
  "Docker":         "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "Docker Compose": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "Jenkins":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg",
  "React":          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Next.js":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "Node.js":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain.svg",
  "PostgreSQL":     "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  "Python":         "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "Java":           "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "PyTorch (CUDA)": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg",
  "Socket.io":      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg",
  "Linux (CLI)":    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
};

export const DOMAINS = [
  {
    category: "Cybersécurité",
    label: "SECURITY",
    index: "01",
    hue: "#960505",
    backgroundImage: Sec,
    tag: "Red Team · Blue Team · Ingénierie logicielle",
    items: [
      {
        name: "Red Teaming",
        level: "Avancé",
        shortDesc: "Tests d'intrusion Web & réseau · OWASP Top 10 · CVE",
        featured: ["Nmap", "BurpSuite", "Metasploit", "Wireshark"],
        tools: ["TCP/IP", "Nmap", "BurpSuite", "Wireshark", "Metasploit", "SQLMap", "Hashcat", "Hydra", "Linux (CLI)"],
        details:
          "Compréhension de la chaîne d'attaque : réalisation de tests d'intrusion sur environnements Web et réseaux via l'exploitation de vulnérabilités (OWASP Top 10) et de failles (CVE). Utilisation du framework Metasploit pour le déploiement de payloads, la gestion de sessions Meterpreter et escalade de privilèges. Capacité à intercepter et analyser le trafic web via l'utilisation du Proxy Burp Suite.",
      },
      {
        name: "Blue Teaming & SOC",
        level: "Intermédiaire",
        shortDesc: "Analyse de logs · Forensics · Hardening système",
        featured: ["Splunk SIEM", "Wireshark", "FlareVM", "Snort"],
        tools: ["Splunk SIEM", "Wireshark", "Snort", "Fail2ban", "Firewall / WAF", "FlareVM", "REMnux", "CyberChef"],
        details:
          "Analyse de logs via search queries SPL sur le SIEM Splunk. Pratique Forensics et analyse de malwares en environnements isolés (FlareVM/REMnux). Mise en œuvre de mesures de durcissement (Hardening) incluant la configuration de WAF, de firewalls et d'IDS/IPS.",
      },
    ],
  },
  {
    category: "Intelligence Artificielle",
    label: "AI / LLM",
    index: "02",
    hue: "#053396",
    backgroundImage: IA,
    tag: "GenAI · RAG · Voice Processing",
    items: [
      {
        name: "Dev IA",
        level: "Avancé",
        shortDesc: "Pipelines RAG · Assistants vocaux temps réel · LLM",
        featured: ["LangChain", "Llama 3.x", "PyTorch (CUDA)", "Whisper"],
        tools: ["LangChain", "Llama 3.x", "IBM Watsonx", "Groq (LPU)", "FAISS / ChromaDB", "Whisper", "PyTorch (CUDA)", "Hugging Face"],
        details:
          "Conception de systèmes d'IA générative incluant des pipelines RAG pour l'analyse de documents et des assistants vocaux temps réel (STT/TTS). Expertise dans l'orchestration de LLMs via LangChain, l'optimisation de l'inférence sur matériel spécialisé (Groq, GPU/CUDA) et l'intégration de services Cloud IA.",
      },
    ],
  },
  {
    category: "Ingénierie Logicielle",
    label: "SOFTWARE",
    index: "03",
    hue: "#059669",
    backgroundImage: IA,
    tag: "POO · Fullstack · Architecture",
    items: [
      {
        name: "Full Stack",
        level: "Avancé",
        shortDesc: "API REST · WebSockets · Architecture modulaire",
        featured: ["React", "Node.js", "PostgreSQL", "Next.js"],
        tools: ["Java", "Python", "LibGDX", "Pygame", "Apex (Salesforce)", "Next.js", "React", "Node.js", "Socket.io", "PostgreSQL", "REST API"],
        details:
          "Conception et développement de systèmes logiciels complets allant d'applications et jeux en Java/Python (POO, héritage, polymorphisme, design patterns comme Factory) à des architectures web full stack modernes. Mise en place d'API REST scalables, de communications temps réel via WebSockets (Socket.io) et de bases de données relationnelles (PostgreSQL). Approche orientée architecture, performance et modularité dans des environnements frontend et backend.",
      },
      {
        name: "DevOps",
        level: "Intermédiaire",
        shortDesc: "Conteneurisation · CI/CD · Infrastructure as Code",
        featured: ["Docker", "Jenkins", "Docker Compose", "CI/CD"],
        tools: ["Docker", "Docker Compose", "Jenkins", "Groovy / JCasC", "CI/CD"],
        details:
          "Conteneurisation d'applications micro-services via Docker Compose. Automatisation de l'infrastructure (JCasC) et création de pipelines CI/CD reproductibles avec Jenkins.",
      },
    ],
  },
];