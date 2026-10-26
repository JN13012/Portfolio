import type { Localized, Track } from './types'

type TrackContent = {
  id: Track
  label: Localized
  /** One-sentence positioning. */
  positioning: Localized
  /** Verifiable proofs, shown as a mono line. */
  proofs: Localized[]
  /** Slugs of the two highlighted projects. */
  featured: [string, string]
}

// « Trois métiers » section (docs/concept-v1.md §6). Proofs come from certificates and
// the facts of src/content/projects (verified 2026-10-17).
export const tracks: TrackContent[] = [
  {
    id: 'ia',
    label: { fr: 'IA', en: 'AI' },
    positioning: {
      fr: 'Des applications LLM de bout en bout (RAG, voix, orchestration), avec des garde-fous pensés dès la conception.',
      en: 'End-to-end LLM applications (RAG, speech, orchestration), with guard rails designed in from the start.',
    },
    proofs: [
      { fr: 'IBM AI Developer Professional', en: 'IBM AI Developer Professional' },
      { fr: '4 applications LLM publiées', en: '4 published LLM applications' },
      { fr: 'Atelier « Supercharging Your Pentesting With AI »', en: '“Supercharging Your Pentesting With AI” workshop' },
    ],
    featured: ['rag-pdf-chatbot', 'argos'],
  },
  {
    id: 'data',
    label: { fr: 'Data', en: 'Data' },
    positioning: {
      fr: 'Des données publiques à la décision : nettoyage, géotraitement, cartes et indicateurs sourcés.',
      en: 'From open data to decisions: cleaning, geoprocessing, maps and sourced indicators.',
    },
    proofs: [
      { fr: '2e place au hackathon Microsoft × Citiz', en: '2nd place at the Microsoft × Citiz hackathon' },
      { fr: 'Réseau piéton de 16,6 M nœuds', en: '16.6 M-node pedestrian network' },
    ],
    featured: ['hackathon-citiz', 'bookworm'],
  },
  {
    id: 'cyber',
    label: { fr: 'Cyber', en: 'Cyber' },
    positioning: {
      fr: 'Pentest web et Active Directory avec une méthode documentée de bout en bout, et une montée en compétence côté SOC.',
      en: 'Web and Active Directory pentesting with an end-to-end documented method, and growing SOC skills.',
    },
    proofs: [
      { fr: 'Jr Penetration Tester (96 h)', en: 'Jr Penetration Tester (96 h)' },
      { fr: '25 write-ups publiés', en: '25 published write-ups' },
      { fr: 'Un audit web autorisé', en: 'One authorised web audit' },
      { fr: 'SOC Level 1 en cours', en: 'SOC Level 1 in progress' },
    ],
    featured: ['pentest', 'argos'],
  },
  {
    id: 'dev',
    label: { fr: 'Dev', en: 'Dev' },
    positioning: {
      fr: 'Du code testé et automatisé, du prototype à la production.',
      en: 'Tested, automated code, from prototype to production.',
    },
    proofs: [
      { fr: 'Stage full-stack Salesforce (ULIT)', en: 'Full-stack Salesforce internship (ULIT)' },
      { fr: 'Un outil interne en production', en: 'One internal tool in production' },
      { fr: '56 tests et CI durcie sur BlockTrader', en: '56 tests and hardened CI on BlockTrader' },
    ],
    featured: ['blocktrader', 'zeroday'],
  },
  {
    id: 'devops',
    label: { fr: 'DevOps', en: 'DevOps' },
    positioning: {
      fr: 'Conteneurs, orchestration et intégration continue, avec un pipeline durci sur BlockTrader.',
      en: 'Containers, orchestration and continuous integration, with a hardened pipeline on BlockTrader.',
    },
    proofs: [
      { fr: 'Déploiement Kubernetes multi-nœuds (Bernstein)', en: 'Multi-node Kubernetes deployment (Bernstein)' },
      { fr: 'Jenkins configuré par le code (My_Marvin)', en: 'Jenkins configured as code (My_Marvin)' },
      { fr: '56 tests et CI durcie sur BlockTrader', en: '56 tests and hardened CI on BlockTrader' },
    ],
    featured: ['kubernetes', 'my-marvin'],
  },
]

/** « En 30 secondes » strip. */
export const atAGlance: Localized[] = [
  { fr: '5 langues', en: '5 languages' },
  { fr: '6 pays', en: '6 countries' },
  { fr: 'MSc Epitech cybersécurité', en: 'MSc Epitech cybersecurity' },
  { fr: 'Jr Penetration Tester', en: 'Jr Penetration Tester' },
  { fr: 'IBM AI Developer', en: 'IBM AI Developer' },
  { fr: 'Ex-militaire', en: 'Former soldier' },
  { fr: 'Disponible immédiatement', en: 'Available immediately' },
]

export const trackLabels = Object.fromEntries(tracks.map((t) => [t.id, t.label])) as Record<Track, Localized>
