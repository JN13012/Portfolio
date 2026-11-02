import type { Project } from '../types'

// Facts verified in /home/cyber/work/ZeroDay on 2026-10-17 and 2026-10-26 (ZeroDay-gd is a worktree of the same repo).
// Mobile game per the Vision v1.14; multiplayer with leaderboard and the « play humanity » V2 are plans told by Jérémie (2026-10-26).
export const zeroday: Project = {
  slug: 'zeroday',
  tier: 'dossier',
  status: 'development',
  // Game development on a security theme, not security work.
  tracks: ['dev'],
  title: 'ZeroDay',
  period: { start: '2026-08' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Jeu mobile de stratégie : incarner un malware qui se propage, face aux défenses du monde.',
    en: 'A mobile strategy game: play a malware spreading across the world against its defences.',
  },
  summary: {
    fr: 'Jeu mobile de stratégie, en conception : le joueur incarne un malware qui se propage dans le monde entier, pendant que les pays réagissent, se défendent et développent un antivirus pour l’éradiquer. Un multijoueur avec classement et une version où l’on joue l’humanité sont prévus.',
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
      title: { fr: 'Le jeu prévu' },
      body: { fr: 'Le joueur fait évoluer son malware dans 3 arbres (Propagation, Adaptation, Impact), avec 9 classes, du Ver à l’IA rogue.' },
    },
    {
      kind: 'result',
      title: { fr: 'Où en est le projet' },
      body: { fr: 'Un prototype en cours de conception.' },
    },
  ],
  stack: ['Unity', 'C#', 'JavaScript'],
  links: { privateRepo: true },
  facts: [
    { value: '9', label: { fr: 'classes de malware', en: 'malware classes' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md §17.2' },
    { value: '3', label: { fr: 'arbres d’évolution', en: 'evolution trees' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md (Propagation, Adaptation, Impact)' },
    { value: '≈ 141 000', label: { fr: 'mots de game design', en: 'words of game design' }, source: 'docs/*.md excluding docs/archive (wc -w)' },
  ],
  scale: { months: 2, tests: 5 },
  doNotClaim: ['Playable game', 'A 1:1 implementation of MITRE ATT&CK', 'Multiplayer, leaderboard or the humanity V2 as existing (plans only)'],
}
