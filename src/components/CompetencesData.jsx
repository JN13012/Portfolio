import ActiveDirectory from "../assets/Icon/ActiveDirectory.png";
import Burpsuite from "../assets/Icon/Burpsuite.png";
import Css from "../assets/Icon/Css.png";
import Docker from "../assets/Icon/Docker.png";
import Fail2ban from "../assets/Icon/Fail2ban.png";
import Firewall from "../assets/Icon/Firewall.png";
import Flarevm from "../assets/Icon/Flarevm.png";
import Gobuster from "../assets/Icon/Gobuster.png";
import Hashcat from "../assets/Icon/Hashcat.png";
import Hydra from "../assets/Icon/Hydra.svg";
import Javascript from "../assets/Icon/Javascript.png";
import Linux from "../assets/Icon/Linux.png";
import Metasploit from "../assets/Icon/Metasploit.png";
import Nmap from "../assets/Icon/Nmap.webp";
import Python from "../assets/Icon/Python.png";
import Remnux from "../assets/Icon/Remnux.png";
import Sqlmap from "../assets/Icon/Sqlmap.png";
import Snort from "../assets/Icon/Snort.png";
import TCP from "../assets/Icon/TCP.png";
import Wireshark from "../assets/Icon/Wireshark.png";
import Splunk from "../assets/Icon/Splunk.png";
import Cyberchef from "../assets/Icon/Cyberchef.png";
import Flask from "../assets/Icon/Flask.png";
import Pytorch from "../assets/Icon/Pytorch.png";
import Pandas from "../assets/Icon/Pandas.png";
import Numpy from "../assets/Icon/Numpy.png";
import Langchain from "../assets/Icon/Langchain.png";
import Java from "../assets/Icon/Java.png";
import Nodejs from "../assets/Icon/Nodejs.png";
import React from "../assets/Icon/React.png";
import Sql from "../assets/Icon/Sql.png";
import Jenkins from "../assets/Icon/Jenkins.png";

export const TOOL_ICONS = {
  "Active Directory": ActiveDirectory,
  "TCP/IP": TCP,
  Nmap: Nmap,
  BurpSuite: Burpsuite,
  Wireshark: Wireshark,
  Metasploit: Metasploit,
  SQLMap: Sqlmap,
  Splunk: Splunk,
  Fail2ban: Fail2ban,
  Firewall: Firewall,
  FlareVM: Flarevm,
  REMnux: Remnux,
  Snort: Snort,
  CyberChef: Cyberchef,
  Gobuster: Gobuster,
  Hashcat: Hashcat,
  Hydra: Hydra,
  JavaScript: Javascript,
  "Node.js": Nodejs,
  "Linux (CLI)": Linux,
  Python: Python,
  Docker: Docker,
  "Docker Compose": Docker,
  Flask: Flask,
  PyTorch: Pytorch,
  Pandas: Pandas,
  NumPy: Numpy,
  LangChain: Langchain,
  Java: Java,
  Nodejs: Nodejs,
  React: React,
  SQL: Sql,
  Jenkins: Jenkins,
};

export const TOOL_DESCRIPTIONS = {
  "Active Directory": "Identités & accès",
  "TCP/IP": "Réseaux",
  Nmap: "Scan réseau",
  BurpSuite: "Proxy web",
  Wireshark: "Analyse trafic",
  Metasploit: "Exploitation",
  SQLMap: "Injection SQL",
  Splunk: "SIEM & logs",
  Fail2ban: "Anti brute-force",
  Firewall: "Règles réseau",
  FlareVM: "Forensic Windows",
  REMnux: "Analyse malware",
  Snort: "IDS / IPS",
  CyberChef: "Décodage data",
  Gobuster: "Fuzzing web",
  Hashcat: "Cracking hash",
  Hydra: "Audit auth",
  JavaScript: "Front-end",
  "Node.js": "Runtime JS",
  "Linux (CLI)": "Terminal",
  Python: "Scripts & API",
  Docker: "Conteneurs",
  "Docker Compose": "Stack locale",
  Flask: "API Python",
  PyTorch: "Deep learning",
  Pandas: "Dataframes",
  NumPy: "Calcul data",
  LangChain: "RAG & LLM",
  Java: "POO",
  Nodejs: "Back-end JS",
  React: "Interface web",
  SQL: "Base données",
  Jenkins: "CI/CD",
};

export const DOMAINS = [
  {
    category: "Cybersécurité",
    label: "Cybersécurité",
    index: "01",
    hue: "#f43f5e",

    items: [
      {
        name: "Red Team",
        accent: "#ef4444",
        tag: "Reconnaissance - Énumération - Exploitation & Post-exploitation",
        tools: [
          "Linux (CLI)",
          "TCP/IP",
          "Nmap",
          "Gobuster",
          "BurpSuite",
          "SQLMap",
          "Metasploit",
          "Hashcat",
          "Hydra",
          "Wireshark",
        ],
        details:
          "Réalisation de tests d'intrusion sur environnements Web et réseaux par l'exploitation de vulnérabilités (OWASP Top 10). Exploitation de failles CVE avec Metasploit pour le déploiement de payloads, gestion de sessions Meterpreter et escalade de privilèges. Capacité à intercepter et analyser le trafic HTTP via l'utilisation du Proxy Burp Suite. Audit d'authentification et cassage de hahs: attaques par dictionnaire et brute force.",
      },
      {
        name: "Blue Team",
        accent: "#2563eb",
        tag: "SIEM - Analyse de logs - Réponse incident - Forensic - Durcissement",
        tools: [
          "Splunk",
          "Active Directory",
          "Firewall",
          "Wireshark",
          "Snort",
          "Fail2ban",
          "FlareVM",
          "REMnux",
          "CyberChef",
        ],
        details:
          "Analyse de logs via search queries SPL sur le SIEM Splunk. Analyse Forensics et malwares en environnements isolés (FlareVM/REMnux). Mise en œuvre de mesures de Durcissement incluant la configuration de WAF, Firewall et d'IDS/IPS.",
      },
    ],
  },
  {
    category: "Intelligence Artificielle",
    label: "Intelligence Artificielle",
    index: "02",
    hue: "#22d3ee",

    items: [
      {
        name: "Développement IA",
        accent: "#818cf8",
        tag: "LLM - RAG - NLP - Pipeline - Data analysis",
        tools: ["Flask", "PyTorch", "LangChain", "Pandas", "NumPy"],
        details:
          "Développement d’API backend pour applications IA avec Flask : intégration de LLM, pipelines RAG, NLP, orchestration de modèles génératifs. Analayse et traitement de données avec Pandas et NumPy.",
      },
    ],
  },
  {
    category: "Ingénierie Logicielle",
    label: "Ingénierie logicielle",
    index: "03",
    hue: "#34d399",

    items: [
      {
        name: "Full Stack",
        accent: "#22c55e",
        tag: "Back-end - API REST - POO - Base de données",
        tools: ["Python", "Java", "JavaScript", "Nodejs", "React", "SQL"],
        details:
          "Développement de logiciels et de jeux en Java/Python en appliquant les principes de POO. Développement d’applications back-end et de composants web Salesforce, conception d’API REST et manipulation de bases de données.",
      },
      {
        name: "DevOps",
        accent: "#f59e0b",
        tag: "Conteuneurisation -  Automatisation - CI/CD",
        tools: ["Docker", "Jenkins"],
        details:
          "Conteneurisation d’applications avec Docker et mise en place de pipelines CI/CD afin d’automatiser le déploiement et les tests.",
      },
    ],
  },
];
