import type { SkillGroup, Track } from './types'

// Grouped by job, no percentages. Each item is backed by a project, a write-up
// (tools listed in the write-ups' front matter) or a certification syllabus.

export const skills: Record<Track, SkillGroup[]> = {
  ia: [
    {
      title: { fr: 'Applications LLM', en: 'LLM applications' },
      items: ['LangChain', 'RAG', 'FAISS', 'IBM watsonx', 'Llama 3', 'Groq', 'Hugging Face Transformers', 'Gradio'],
    },
    {
      title: { fr: 'Voix et langage', en: 'Speech and language' },
      items: ['Whisper', 'IBM Watson STT / TTS', 'spaCy', 'NLP'],
    },
    {
      title: { fr: 'Python et données', en: 'Python and data' },
      items: ['Python', 'Flask', 'PyTorch', 'Pandas', 'NumPy'],
    },
  ],
  cyber: [
    {
      title: { fr: 'Pentest web et réseau', en: 'Web and network pentest' },
      items: ['Nmap', 'Gobuster', 'Burp Suite', 'SQLMap', 'Metasploit', 'OWASP Top 10'],
    },
    {
      title: { fr: 'Active Directory et Windows', en: 'Active Directory and Windows' },
      items: ['NetExec', 'Impacket', 'Responder', 'ldapsearch', 'rpcclient', 'smbclient'],
    },
    {
      title: { fr: 'Mots de passe et élévation de privilèges', en: 'Passwords and privilege escalation' },
      items: ['Hashcat', 'John the Ripper', 'Hydra', 'SUID / sudo / cron', 'Linux', 'Windows'],
    },
    {
      title: { fr: 'Défense et analyse', en: 'Defence and analysis' },
      items: ['Splunk', 'Wireshark', 'Snort', 'Fail2ban', 'FlareVM', 'REMnux', 'CyberChef'],
    },
    {
      title: { fr: 'Conformité', en: 'Compliance' },
      // Only what is studied in the MSc or applied in a project (OTP generator).
      items: ['ISO 27001', 'RGPD'],
    },
  ],
  dev: [
    {
      title: { fr: 'Langages', en: 'Languages' },
      items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Apex', 'SQL'],
    },
    {
      title: { fr: 'Web et back-end', en: 'Web and back-end' },
      items: ['React', 'Next.js', 'NestJS', 'Express', 'Prisma', 'Drizzle', 'Socket.IO', 'Electron', 'Lightning Web Components'],
    },
    {
      title: { fr: 'Données', en: 'Data' },
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'],
    },
    {
      title: { fr: 'Tests, CI et déploiement', en: 'Testing, CI and deployment' },
      items: ['Vitest', 'Jest', 'pytest', 'GitHub Actions', 'Docker', 'Docker Compose', 'Kubernetes', 'Jenkins'],
    },
  ],
}
