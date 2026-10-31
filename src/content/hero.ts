import type { Localized } from './types'

export type CoreNodeId = 'ia' | 'cyber' | 'dev' | 'parcours' | 'contact'

type CoreNode = {
  id: CoreNodeId
  /** In-page anchor the node scrolls to. */
  target: string
  label: Localized
  /** Short description shown on hover / focus. */
  hint: Localized
}

// Hero copy: option A, chosen 2026-10-17 (docs/archive/concept-v1.md §6).
export const hero = {
  title: [
    { text: { fr: 'Développeur IA', en: 'AI developer' }, tone: 'ai' },
    { text: { fr: 'Pentester junior', en: 'Junior penetration tester' }, tone: 'threat' },
  ],
  pitch: {
    // Chosen by Jérémie on 2026-10-28: AI solutions and identifying system vulnerabilities.
    fr: 'Je développe des solutions IA et identifie les vulnérabilités des systèmes pour mieux les sécuriser.',
    en: 'I develop AI solutions and identify system vulnerabilities to better secure them.',
  },
  /**
   * Proofs under the pitch (2026-10-27), as a light list: one row per kind (label on the left, items as
   * text). The master in progress is not a certificate (started 09/2026, specialisation not chosen yet).
   * Certificates and projects open their modal; the master and the cyber lab open a panel in place, whose
   * button is the only way to their section (no jump without asking).
   */
  proofTitles: {
    formation: { fr: 'Formation', en: 'Education' },
    certified: { fr: 'Certifié', en: 'Certified' },
    projects: { fr: 'Projets', en: 'Projects' },
    labs: { fr: 'Labs', en: 'Labs' },
  },
  /** The timeline entry of the master; its title, period and highlights come from timeline.ts. */
  formation: {
    timeline: 'epitech-msc',
    title: { fr: 'Master of Science · Architecte des SI', en: 'Master of Science · IS Architect' },
    detail: { fr: 'Epitech Marseille · 1re année', en: 'Epitech Marseille · first year' },
    cta: { fr: 'Voir tout le parcours', en: 'See the whole journey' },
    target: '#parcours',
  },
  certificates: [
    { id: 'ibm', credential: 'ibm-ai-developer', title: 'IBM AI Developer', detail: { fr: 'Professional Certificate', en: 'Professional Certificate' } },
    // 89 rooms: the path's 2026 version, as in its credential note (certifications.ts).
    { id: 'thm', credential: 'thm-jr-penetration-tester', title: 'Jr Penetration Tester', detail: { fr: 'TryHackMe · 89 labs', en: 'TryHackMe · 89 labs' } },
  ],
  /** Four projects on two lines, in this order (Argos, BlockTrader / Code Executor, ZeroDay); the wording follows each one's status (never « live »). */
  projects: [
    { slug: 'argos', detail: { fr: 'Agents IA cyber · en développement', en: 'Cyber AI agents · in development' } },
    { slug: 'blocktrader', detail: { fr: 'Bot de trading · en test', en: 'Trading bot · in testing' } },
    { slug: 'salesforce-executor', detail: { fr: 'En production chez ULIT', en: 'In production at ULIT' } },
    { slug: 'zeroday', detail: { fr: 'Jeu mobile · en conception', en: 'Mobile game · in design' } },
  ],
  /** The labs. */
  labs: [
    { id: 'cyber', label: { fr: 'Lab cyber', en: 'Cyber lab' }, detail: { fr: 'CTF 9 niveaux · {n} write-ups', en: '9-level CTF · {n} write-ups' } },
    { id: 'ia', label: { fr: 'Lab IA', en: 'AI lab' }, detail: { fr: 'Red-team Sentry · niveau 1 jouable', en: 'Red-team Sentry' } },
  ],
  /** The cyber lab's panel (CTF levels as in CtfIntro, write-ups counted from writeups.json). */
  labPanel: {
    title: { fr: 'Lab cyber', en: 'Cyber lab' },
    intro: {
      fr: 'Un CTF jouable dans le navigateur, en 9 niveaux, et mes write-ups de pentest.',
      en: 'A CTF you play in the browser, in 9 levels, and my pentest write-ups.',
    },
    phases: [
      { title: { fr: 'Reconnaissance', en: 'Reconnaissance' }, text: { fr: 'Linux, réseau, scan et énumération', en: 'Linux, networking, scanning and enumeration' } },
      { title: { fr: 'Exploitation', en: 'Exploitation' }, text: { fr: 'Web et injection SQL, hashs et SSH, élévation de privilèges', en: 'Web and SQL injection, hashes and SSH, privilege escalation' } },
      { title: { fr: 'Défense', en: 'Defence' }, text: { fr: 'SIEM, forensique, durcissement WAF, firewall et IDS', en: 'SIEM, forensics, WAF, firewall and IDS hardening' } },
    ],
    writeups: { fr: '{n} write-ups : {epitech} Epitech, {thm} TryHackMe', en: '{n} write-ups: {epitech} Epitech, {thm} TryHackMe' },
    cta: { fr: 'Ouvrir le Lab', en: 'Open the Lab' },
    target: '#lab',
  },
  close: { fr: 'Fermer', en: 'Close' },
  /** Short availability shown in the hero, before the kind of contract. */
  available: { fr: 'Disponible', en: 'Available' },
  voice: { fr: 'Écouter ma présentation', en: 'Listen to my introduction' },
  voiceSoon: { fr: 'bientôt', en: 'soon' },
  // The old PDF is outdated and no longer served (decision 2026-10-30); greyed until the new one exists.
  cvPending: { fr: 'CV en cours de mise à jour' },
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
  nodes: CoreNode[]
  [key: string]: unknown
}
