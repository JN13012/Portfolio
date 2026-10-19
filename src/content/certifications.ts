import type { Credential, InProgress } from './types'

// Source: certificate files in C:\Users\Cyber\Documents\Certifications (read 2026-10-17).
// TryHackMe verification links follow tryhackme.com/certificate/<ID>; THM blocks automated
// checks (HTTP 429), so they were not machine-verified — open them once in a browser.

export const credentials: Credential[] = [
  {
    id: 'thm-jr-penetration-tester',
    title: 'Jr Penetration Tester',
    issuer: 'TryHackMe',
    kind: 'learning-path',
    tracks: ['cyber'],
    date: '2026-10-07',
    credentialId: 'THM-VKWDW1TVUB',
    verifyUrl: 'https://tryhackme.com/certificate/THM-VKWDW1TVUB',
    hours: 95,
    featured: true,
    note: {
      fr: 'Parcours pentest : reconnaissance, web (OWASP), exploitation, élévation de privilèges, Metasploit, Burp Suite.',
      en: 'Pentest path: reconnaissance, web (OWASP), exploitation, privilege escalation, Metasploit, Burp Suite.',
    },
  },
  {
    id: 'ibm-ai-developer',
    title: 'IBM AI Developer',
    issuer: 'IBM · Coursera',
    kind: 'professional-certificate',
    tracks: ['ia', 'dev'],
    date: '2026-04-08',
    credentialId: 'NLPNAKCP7EFK',
    verifyUrl: 'https://coursera.org/verify/professional-cert/NLPNAKCP7EFK',
    featured: true,
    note: {
      fr: '10 cours : IA générative, prompt engineering, applications Python et Flask, chatbots et applications LLM.',
      en: '10 courses: generative AI, prompt engineering, Python and Flask apps, chatbots and LLM applications.',
    },
    includes: [
      'Introduction to Software Engineering',
      'Introduction to Artificial Intelligence (AI)',
      'Generative AI: Introduction and Applications',
      'Generative AI: Prompt Engineering Basics',
      'Introduction to HTML, CSS, & JavaScript',
      'Python for Data Science, AI & Development',
      'Developing AI Applications with Python and Flask',
      'Building Generative AI-Powered Applications with Python',
      'Generative AI: Elevate your Software Development Career',
      'Software Developer Career Guide and Interview Preparation',
    ],
  },
  {
    id: 'thm-sec1',
    title: 'Cyber Security 101 (SEC1)',
    issuer: 'TryHackMe',
    kind: 'certification',
    tracks: ['cyber'],
    date: '2026-05-24',
    credentialId: 'THM-6a11ccd3e4df8e0742e97cf5',
    featured: true,
    note: {
      fr: "Certification à examen : réseau, Linux et Windows, outils offensifs et défensifs, cryptographie, sécurité web.",
      en: 'Exam-based certification: networking, Linux and Windows, offensive and defensive tools, cryptography, web security.',
    },
  },
  {
    id: 'thm-supercharging-pentesting-ai',
    title: 'Supercharging Your Pentesting With AI',
    issuer: 'TryHackMe',
    kind: 'workshop',
    tracks: ['cyber', 'ia'],
    date: '2026-10-05',
    featured: true,
    note: {
      fr: "Atelier de 5 crédits CPE : pentest assisté par IA, workflows agentiques, construction de harness, durcissement de prompts, CTF.",
      en: 'Workshop, 5 CPE credits: AI-assisted pentesting, agentic workflows, harness building, prompt hardening, CTF.',
    },
  },
  {
    id: 'thm-cyber-security-101',
    title: 'Cyber Security 101',
    issuer: 'TryHackMe',
    kind: 'learning-path',
    tracks: ['cyber'],
    date: '2025-10-14',
    credentialId: 'THM-VEMPGXQSXD',
    verifyUrl: 'https://tryhackme.com/certificate/THM-VEMPGXQSXD',
    hours: 46,
    featured: false,
  },
  {
    id: 'thm-sec0',
    title: 'Pre Security (SEC0)',
    issuer: 'TryHackMe',
    kind: 'certification',
    tracks: ['cyber'],
    date: '2026-05-19',
    credentialId: 'THM-6a0cbce9a1880079284577a7',
    featured: false,
  },
  {
    id: 'thm-pre-security',
    title: 'Pre Security',
    issuer: 'TryHackMe',
    kind: 'learning-path',
    tracks: ['cyber'],
    date: '2026-04-14',
    credentialId: 'THM-RHPS6ZUQ2H',
    verifyUrl: 'https://tryhackme.com/certificate/THM-RHPS6ZUQ2H',
    hours: 19,
    featured: false,
  },
]

export const inProgress: InProgress[] = [
  {
    id: 'thm-soc-level-1',
    title: 'SOC Level 1',
    issuer: 'TryHackMe',
    tracks: ['cyber'],
    progress: 0.5,
    measuredAt: '2026-10-17',
    verifyUrl: 'https://tryhackme.com/p/JN13',
  },
]
