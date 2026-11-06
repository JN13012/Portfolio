import type { Project } from '../types'
import zeroDayImg from '../../assets/Projets/ZeroDay.webp'

// Facts verified in /home/cyber/work/ZeroDay on 2026-10-17 and 2026-10-26 (ZeroDay-gd is a worktree of the same repo).
// Mobile game per the Vision v1.14; multiplayer with leaderboard and the « play humanity » V2 are plans told by Jérémie (2026-10-26).
export const zeroday: Project = {
  slug: 'zeroday',
  tier: 'dossier',
  status: 'development',
  // Game development on a security theme, not security work; blockchain for its planned Web3 V3.
  tracks: ['dev', 'blockchain'],
  title: 'ZeroDay',
  period: { start: '2026-08' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Jeu mobile de stratégie : incarner un malware qui se propage, face aux défenses du monde.',
    en: 'A mobile strategy game: play a malware spreading across the world against its defences.',
  },
  summary: {
    fr: 'Jeu mobile de stratégie où le joueur incarne un malware évolutif qui se propage à travers les infrastructures mondiales, jusqu’à corrompre une IA et menacer l’existence de l’humanité. Les nations réagissent, renforcent leur cybersécurité et développent un neutralisateur pour l’éradiquer.',
    en: 'A mobile strategy game, in design: the player is a malware spreading across the world while countries react, defend themselves and build a cure. Multiplayer with a leaderboard and a version where you play humanity are planned.',
  },
  angles: {
    dev: {
      fr: 'Cœur de simulation déterministe sous Unity, vérifié par des tests, et un éditeur d’arbres d’évolution écrit à la main, sans framework.',
      en: 'A deterministic simulation core in Unity, checked by tests, and a hand-written evolution-tree editor with no framework.',
    },
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Évolution du projet' },
      points: [
        { text: { fr: 'V0 – Prototype : moteur de simulation, carte mondiale interactive et mécanique de jeu.' } },
        { text: { fr: 'V1 – Jeu solo : 9 classes de malwares, 3 arbres d’évolution et simulation des réactions mondiales.' } },
        { text: { fr: 'V2 – Multijoueur : affrontements entre joueurs, classements et possibilité d’incarner l’humanité.' } },
        { text: { fr: 'V3 – Écosystème Web3 : économie crypto (ZDAY coin), NFT (malwares, skins, profils, territoires) et marketplace.' } },
      ],
    },
    {
      kind: 'result',
      title: { fr: 'Où en est le projet' },
      body: { fr: 'Prototype V0 en cours de conception.' },
    },
  ],
  images: [
    { src: zeroDayImg },
  ],
  stack: ['Unity', 'C#', 'JavaScript'],
  links: { privateRepo: true },
  facts: [
    { value: '9', label: { fr: 'classes de malware', en: 'malware classes' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md §17.2' },
    { value: '3', label: { fr: 'arbres d’évolution', en: 'evolution trees' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md (Propagation, Adaptation, Impact)' },
    { value: '≈ 141 000', label: { fr: 'mots de game design', en: 'words of game design' }, source: 'docs/*.md excluding docs/archive (wc -w)' },
  ],
  scale: { months: 2, tests: 5 },
}
