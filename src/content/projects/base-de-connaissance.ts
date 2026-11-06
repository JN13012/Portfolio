import type { Project } from '../types'
import obsidianImg from '../../assets/Obsidian.webp'
import obsidian0Img from '../../assets/Obsidian0.png'
import obsidian1Img from '../../assets/obsidian1.png'

export const baseDeConnaissance: Project = {
  slug: 'base-de-connaissance',
  tier: 'card',
  status: 'ongoing',
  tracks: ['cyber', 'ia', 'dev'],
  title: 'Base de connaissance',
  period: { start: '2026-06' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: '729 notes Obsidian : cours, méthodes de pentest et notes de projets, cyber, IA et dev.',
    en: '728 Obsidian notes: courses, pentest methods and project notes, security, AI and dev.',
  },
  summary: {
    fr: 'Une base de connaissances personnelle sous Obsidian, tenue au fil des formations et des projets : notes de cours, méthodes, cheatsheets et retours d’expérience.',
    en: 'A personal knowledge base in Obsidian, kept up through courses and projects: course notes, methods, cheat sheets and lessons learned.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Ce qu’elle couvre', en: 'What it covers' },
      points: [
        { label: { fr: 'Cybersécurité (414 notes)', en: 'Security (414 notes)' }, text: { fr: 'notes de cours TryHackMe et fiches de méthode pentest.', en: '370 TryHackMe course notes and 43 pentest method sheets.' } },
        { label: { fr: 'Projets (257 notes)', en: 'Projects (257 notes)' }, text: { fr: 'conception et suivi d’Argos, BlockTrader, ZeroDay…', en: 'design and follow-up of Argos, BlockTrader, ZeroDay…' } },
        { label: { fr: 'IA (34 notes)', en: 'AI (34 notes)' }, text: { fr: 'le parcours IBM AI Developer.', en: 'the IBM AI Developer path.' } },
        { label: { fr: 'Salesforce et DevOps', en: 'Salesforce and DevOps' }, text: { fr: '10 et 7 notes.', en: '10 and 7 notes.' } },
      ],
    },
  ],
  images: [
    { src: obsidianImg },
    { src: obsidian0Img },
    { src: obsidian1Img },
  ],
  stack: ['Obsidian'],
  links: { privateRepo: true },
  facts: [
    { value: '729', label: { fr: 'notes', en: 'notes' }, source: 'find vault -name "*.md" | wc -l (2026-10-26), per top folder' },
  ],
  scale: { months: 4 },
}
