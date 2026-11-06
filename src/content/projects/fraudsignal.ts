import type { Project } from '../types'
import fraudSignalImg from '../../assets/Projets/FraudSignal.webp'

// Figures from the FraudSignal README and results/ (commit 4cd29f2), read on 2026-11-01.
export const fraudsignal: Project = {
  slug: 'fraudsignal',
  tier: 'card',
  status: 'delivered',
  tracks: ['ia', 'cyber'],
  title: 'FraudSignal',
  period: { start: '2026-11', end: '2026-11' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Un pipeline LLM qui analyse les messages suspects et demande une relecture si besoin.',
  },
  summary: {
    fr: 'FraudSignal analyse les e-mails, SMS et messages WhatsApp suspects. Gemini rend un verdict appuyé par des signaux cités dans le message, et le code décide quand un humain doit vérifier. C’est une aide à la décision, pas une preuve de fraude.',
  },
  sections: [
    {
      kind: 'result',
      title: { fr: 'Résultats' },
      body: { fr: 'Sur 180 messages fictifs, F1 de 0,99 sur la fraude, contre 0,81 pour une référence TF-IDF. 34 messages partent en relecture, dont les 11 où le modèle se trompe.' },
    },
    {
      kind: 'security',
      title: { fr: 'Prompt injection' },
      body: { fr: 'Sur 48 tests de prompt injection, aucun n’a modifié le verdict.' },
    },
  ],
  // The visual says itself that it is an excerpt on a fictional message: results/gemini_v3.jsonl, fraud-fr-sms-01.
  images: [
    { src: fraudSignalImg },
  ],
  stack: ['Python', 'Gemini', 'Vertex AI', 'FastAPI', 'Cloud Run', 'Docker', 'scikit-learn'],
  links: { github: 'https://github.com/JN13012/FraudSignal' },
  facts: [
    { value: '180', label: { fr: 'messages fictifs' }, source: 'FraudSignal: data/messages.json, README « Evaluation »' },
    { value: '48', label: { fr: 'tests de prompt injection' }, source: 'FraudSignal: data/injections.json, README « Prompt injection »' },
  ],
  scale: { months: 1, tests: 104 },
}
