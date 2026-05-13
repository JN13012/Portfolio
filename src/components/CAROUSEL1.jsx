const getCardTransform = (i) => {
  const offset = i - activeIdx;
  const total = ALL.length;

  let normalizedOffset = offset;

  // LOOP INFINITE
  if (offset > total / 2) {
    normalizedOffset -= total;
  }

  if (offset < -total / 2) {
    normalizedOffset += total;
  }

  const abs = Math.abs(normalizedOffset);

  // CONFIG
  const spacing = 320;

  // POSITION
  const x = normalizedOffset * spacing;

  // DEPTH
  const z = -abs * 220;

  // ROTATION
  const rotateY = normalizedOffset * -30;

  // SCALE
  const scale = Math.max(1 - abs * 0.12, 0.68);

  // ATMOSPHERE
  const opacity = Math.max(1 - abs * 0.18, 0.15);

  return {
    transform: `
      translate3d(${x}px,0,${z}px)
      rotateY(${rotateY}deg)
      rotateX(4deg)
      scale(${scale})
    `,
    opacity,
    zIndex: 100 - abs,
    filter: `blur(${abs * 0.7}px)`,
    transition:
      "transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease, filter 700ms ease",
    willChange: "transform",
  };
};



  const getCardTransform = (i) => {
    const total = ALL.length;
    const angle  = (i / total) * Math.PI * 2;
    const offset = (activeIdx / total) * Math.PI * 2;
    const fin    = angle - offset;
    const x = Math.cos(fin) * 500;
    const y = Math.sin(fin) * 125;
    const z = Math.sin(fin) * 95;
    const depth = (z + 95) / 190;
    return {
      transform: `translate3d(${x}px,${y}px,${z}px) scale(${0.46 + depth * 0.5})`,
      opacity: 0.1 + depth * 0.9,
      zIndex: Math.floor(depth * 100),
      transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
    };
  };





  import Sec from "../assets/THM.jpg";
  import IA from "../assets/COURSERA.jpg";
  
  export const DOMAINS = [
    // CYBERSÉCURITÉ
    {
      category: "Cybersécurité",
      label: "SECURITY",
      index: "01",
      icon: "🛡️",
      hue: "#960505",
      backgroundImage: Sec,
      tag: "Red Team · Blue Team · Ingénierie logicielle",
      items: [
        {
          name: "Red Teaming",
          tools: [
            "TCP/IP",
            "Nmap",
            "BurpSuite",
            "Wireshark",
            "Metasploit",
            "SQLMap",
            "Hashcat",
            "Hydra",
            "Linux (CLI)",
          ],
          details:
            "Compréhension de la chaîne d'attaque : réalisation de tests d'intrusion sur environnements Web et réseaux via l'exploitation de vulnérabilités (OWASP Top 10) et de failles (CVE). Utilisation du framework Metasploit pour le déploiement de payloads, la gestion de sessions Meterpreter et escalade de privilèges. Capacité à intercepter et analyser le trafic web via l'utilisation du Proxy Burp Suite.",
        },
        {
          name: "Blue Teaming & SOC",
          tools: [
            "Splunk SIEM",
            "Wireshark",
            "Snort",
            "Fail2ban",
            "Firewall / WAF",
            "FlareVM",
            "REMnux",
            "CyberChef",
          ],
          details:
            "Analyse de logs via search queries SPL sur le SIEM Splunk. Pratique Forensics et analyse de malwares en environnements isolés (FlareVM/REMnux). Mise en œuvre de mesures de durcissement (Hardening) incluant la configuration de WAF, de firewalls et d'IDS/IPS.",
        },
      ],
    },
  
    // IA
    {
      category: "Intelligence Artificielle",
      label: "AI / LLM",
      index: "02",
      icon: "🤖",
      hue: "#053396",
      backgroundImage: IA,
      tag: "GenAI · RAG · Voice Processing",
      items: [
        {
          name: "Dev IA",
          tools: [
            "LangChain",
            "Llama 3.x",
            "IBM Watsonx",
            "Groq (LPU)",
            "FAISS / ChromaDB",
            "Whisper",
            "PyTorch (CUDA)",
            "Hugging Face",
          ],
          details:
            "Conception de systèmes d'IA générative incluant des pipelines RAG pour l'analyse de documents et des assistants vocaux temps réel (STT/TTS). Expertise dans l'orchestration de LLMs via LangChain, l'optimisation de l'inférence sur matériel spécialisé (Groq, GPU/CUDA) et l'intégration de services Cloud IA.",
        },
      ],
    },
  
    // INGÉNIERIE LOGICIELLE
    {
      category: "Ingénierie Logicielle",
      label: "Ingénierie logicielle",
      index: "03",
      icon: "💻",
      hue: "#059669",
      backgroundImage: IA,
      tag: "POO · Fullstack · Architecture",
      items: [
        {
          name: "Full Stack",
          tools: [
            "Java",
            "Python",
            "LibGDX",
            "Pygame",
            "Apex (Salesforce)",
            "Next.js",
            "React",
            "Node.js",
            "Socket.io",
            "PostgreSQL",
            "REST API",
          ],
          details:
            "Conception et développement de systèmes logiciels complets allant d'applications et jeux en Java/Python (POO, héritage, polymorphisme, design patterns comme Factory) à des architectures web full stack modernes. Mise en place d’API REST scalables, de communications temps réel via WebSockets (Socket.io) et de bases de données relationnelles (PostgreSQL). Approche orientée architecture, performance et modularité dans des environnements frontend et backend.",
        },
        {
          name: "DevOps",
          tools: [
            "Docker",
            "Docker Compose",
            "Jenkins",
            "Groovy / JCasC",
            "CI/CD",
          ],
          details:
            "Conteneurisation d'applications micro-services via Docker Compose. Automatisation de l'infrastructure (JCasC) et création de pipelines CI/CD reproductibles avec Jenkins.",
        },
      ],
    },
  ];
  