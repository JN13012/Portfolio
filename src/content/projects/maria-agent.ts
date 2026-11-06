import type { Project } from '../types'

export const mariaAgent: Project = {
  slug: 'maria-agent',
  tier: 'card',
  status: 'development',
  stage: 'POC',
  tracks: ['ia', 'dev'],
  title: 'Maria Agent',
  period: { start: '2026-10' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Une plateforme d’agents IA secrétaires, conçue pour répondre au téléphone et prendre les rendez-vous.',
  },
  summary: {
    fr: 'Maria Agent est une plateforme d’agents IA secrétaires conçue pour répondre au téléphone et prendre les rendez-vous. Le studio web et l’API Rust sont en place ; le moteur vocal y est encore simulé.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Comment ça fonctionnera', en: 'How it will work' },
      body: { fr: 'La voix de l’appelant sera transcrite en texte (STT). Un LLM analysera la demande, consultera l’agenda et rédigera la réponse, que Gradium transformera en voix (TTS). Chaque étape fonctionnera en flux continu pour répondre sans attente, et le serveur validera chaque réservation.' },
    },
    {
      kind: 'limits',
      title: { fr: 'Vision', en: 'Vision' },
      body: { fr: 'Chaque professionnel pourrait ensuite personnaliser le nom, la voix et la personnalité de son agent.' },
    },
  ],
  stack: ['Rust', 'Axum', 'React', 'TypeScript', 'Tailwind CSS', 'GitHub Actions'],
  links: { noCodeLink: true },
  facts: [],
  scale: { months: 1 },
}
