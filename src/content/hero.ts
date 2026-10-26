import type { Localized } from './types'

export type CoreNodeId = 'ia' | 'cyber' | 'dev' | 'parcours' | 'contact'

export type CoreNode = {
  id: CoreNodeId
  /** In-page anchor the node scrolls to. */
  target: string
  label: Localized
  /** Short description shown on hover / focus. */
  hint: Localized
}

// Hero copy: option A, chosen 2026-10-17 (docs/concept-v1.md §6).
export const hero = {
  title: [
    { text: { fr: 'Développeur IA', en: 'AI developer' }, tone: 'ai' },
    { text: { fr: 'Pentester junior', en: 'Junior penetration tester' }, tone: 'threat' },
  ],
  pitch: {
    fr: 'Je construis des agents IA pour la cybersécurité, et je sais comment on les attaque.',
    en: 'I build AI agents for cybersecurity, and I know how they get attacked.',
  },
  /** Verifiable proofs under the pitch (certificates, repos). */
  proofs: [
    { fr: 'IBM AI Developer Professional', en: 'IBM AI Developer Professional' },
    { fr: 'TryHackMe Jr Penetration Tester', en: 'TryHackMe Jr Penetration Tester' },
    // Verified 2026-10-17: Argos is currently an OSINT engine; the agent layer is designed, not built.
    { fr: 'Argos : moteur OSINT, couche agents IA en conception', en: 'Argos: OSINT engine, AI agent layer in design' },
  ],
  /** Certificates shown as cards under the pitch (logo resolved in the component). */
  certificates: [
    { id: 'ibm', title: 'IBM AI Developer', sub: { fr: 'Professional Certificate', en: 'Professional Certificate' } },
    { id: 'thm', title: 'Jr Penetration Tester', sub: { fr: 'TryHackMe · 96 h', en: 'TryHackMe · 96 h' } },
    { id: 'epitech', title: 'MSc Cybersécurité', sub: { fr: 'Epitech Marseille', en: 'Epitech Marseille' } },
  ],
  /** Facts strip at the bottom of the hero. */
  strip: [
    { icon: 'globe', text: { fr: '5 langues · 6 pays', en: '5 languages · 6 countries' } },
    { icon: 'badge', text: { fr: 'Jr Penetration Tester', en: 'Jr Penetration Tester' } },
    { icon: 'brain', text: { fr: 'IBM AI Developer', en: 'IBM AI Developer' } },
    { icon: 'shield', text: { fr: 'MSc Epitech cybersécurité', en: 'MSc Epitech cybersecurity' } },
    { icon: 'target', text: { fr: 'Ex-militaire (2e RIMa)', en: 'Former soldier (2e RIMa)' } },
  ],
  voice: { fr: 'Écouter ma présentation', en: 'Listen to my introduction' },
  voiceSoon: { fr: 'bientôt', en: 'soon' },
  ctaCv: { fr: 'Télécharger le CV', en: 'Download CV' },
  ctaContact: { fr: 'Me contacter', en: 'Contact me' },
  scrollHint: { fr: 'Défiler', en: 'Scroll' },
  updated: { fr: 'MAJ', en: 'Updated' },
  coreLabel: { fr: 'Noyau de contrôle : navigation', en: 'Control core: navigation' },
  nodes: [
    { id: 'ia', target: '#ia', label: { fr: 'IA', en: 'AI' }, hint: { fr: 'Agents et applications LLM', en: 'Agents and LLM apps' } },
    { id: 'cyber', target: '#cyber', label: { fr: 'Cyber', en: 'Cyber' }, hint: { fr: 'Pentest et SOC', en: 'Pentest and SOC' } },
    { id: 'dev', target: '#dev', label: { fr: 'Dev', en: 'Dev' }, hint: { fr: 'Code testé et automatisé', en: 'Tested, automated code' } },
    { id: 'parcours', target: '#parcours', label: { fr: 'Parcours', en: 'Journey' }, hint: { fr: 'Six pays, cinq langues', en: 'Six countries, five languages' } },
    { id: 'contact', target: '#contact', label: { fr: 'Contact', en: 'Contact' }, hint: { fr: 'Disponible immédiatement', en: 'Available now' } },
  ],
  gate: {
    title: { fr: 'Salle de contrôle', en: 'Control room' },
    loading: { fr: 'Initialisation', en: 'Initialising' },
    enter: { fr: 'Entrer', en: 'Enter' },
    skip: { fr: "Passer l'introduction", en: 'Skip intro' },
  },
} satisfies {
  title: Array<{ text: Localized; tone: 'ai' | 'threat' }>
  pitch: Localized
  proofs: Localized[]
  nodes: CoreNode[]
  [key: string]: unknown
}
