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
    fr: 'Jeu mobile de stratégie, en conception : le joueur incarne un malware qui se propage dans le monde entier, pendant que les pays réagissent, se défendent et construisent un remède. Un multijoueur avec classement et une version où l’on joue l’humanité sont prévus.',
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
      kind: 'problem',
      title: { fr: 'Le concept', en: 'The concept' },
      body: {
        fr: 'Le joueur ne contrôle pas une armée : il fait évoluer un code malveillant, exploite les dépendances numériques des sociétés et provoque des pannes en chaîne. Chaque pays réagit à sa façon, et le monde coopère pour bâtir un « Neutralisateur ».',
        en: 'The player does not command an army: they evolve a malicious code, exploit the digital dependencies of societies and trigger cascading failures. Each country reacts in its own way, and the world cooperates to build a “Neutraliser”.',
      },
    },
    {
      kind: 'approach',
      title: { fr: 'L’envergure prévue', en: 'Planned scope' },
      body: { fr: 'Un monde simulé pays par pays, et de quoi rejouer longtemps.', en: 'A world simulated country by country, and plenty of replay value.' },
      points: [
        {
          label: { fr: '9 classes de malware', en: '9 malware classes' },
          text: { fr: 'Ver, Trojan, Virus polymorphe, RAT, Rootkit, Botnet, Ransomware, Wiper, IA rogue.', en: 'Worm, Trojan, Polymorphic virus, RAT, Rootkit, Botnet, Ransomware, Wiper, Rogue AI.' },
        },
        { label: { fr: '3 arbres d’évolution', en: '3 evolution trees' }, text: { fr: 'Propagation, Adaptation, Impact.', en: 'Propagation, Adaptation, Impact.' } },
        { label: { fr: '3 difficultés', en: '3 difficulty levels' }, text: { fr: 'Facile, Normal, Brutal.', en: 'Easy, Normal, Brutal.' } },
        {
          label: { fr: 'Une carte du monde', en: 'A world map' },
          text: { fr: '28 types de cibles : PC, smartphones, objets connectés, véhicules, data centers…', en: '28 kinds of targets: PCs, smartphones, connected devices, vehicles, data centres…' },
        },
        { label: { fr: 'Progression', en: 'Progression' }, text: { fr: 'des déblocages permanents d’une partie à l’autre.', en: 'permanent unlocks from one game to the next.' } },
        {
          label: { fr: 'Prévu ensuite', en: 'Planned next' },
          text: { fr: 'un multijoueur avec classement, et une V2 où l’on joue l’humanité qui se défend.', en: 'multiplayer with a leaderboard, and a V2 where you play humanity defending itself.' },
        },
      ],
    },
    {
      kind: 'architecture',
      title: { fr: 'La conception et la technique', en: 'Design and tech' },
      body: { fr: 'Tout est écrit avant d’être codé.', en: 'Everything is written down before it is coded.' },
      points: [
        {
          label: { fr: 'Game design', en: 'Game design' },
          text: { fr: 'environ 141 000 mots versionnés, un registre des décisions, des termes alignés sur MITRE ATT&CK.', en: 'about 141,000 versioned words, a decision register, terms aligned with MITRE ATT&CK.' },
        },
        { label: { fr: 'Unity (C#)', en: 'Unity (C#)' }, text: { fr: 'une partie peut être rejouée à l’identique, pour tester et équilibrer le jeu.', en: 'a game can be replayed exactly, to test and balance it.' } },
        { label: { fr: 'Éditeur maison', en: 'In-house editor' }, text: { fr: 'un outil web pour dessiner les arbres d’évolution.', en: 'a web tool to lay out the evolution trees.' } },
      ],
    },
    {
      kind: 'result',
      title: { fr: 'Où en est le projet', en: 'Where it stands' },
      body: {
        fr: 'Les arbres Propagation et Adaptation sont figés, l’arbre Impact est en cours. Le premier prototype jouable (Ver, carte du monde, propagation, victoire) viendra une fois le game design terminé. Pas encore jouable ; dépôt privé.',
        en: 'The Propagation and Adaptation trees are frozen, the Impact tree is in progress. The first playable prototype (Worm, world map, spreading, victory) will follow once the game design is done. Not playable yet; private repository.',
      },
    },
  ],
  stack: ['Unity 6.3', 'C#', 'HTML', 'CSS', 'JavaScript', 'Markdown'],
  links: { privateRepo: true },
  facts: [
    { value: '9', label: { fr: 'classes de malware', en: 'malware classes' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md §17.2' },
    { value: '3', label: { fr: 'arbres d’évolution', en: 'evolution trees' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md (Propagation, Adaptation, Impact)' },
    { value: '3', label: { fr: 'difficultés', en: 'difficulty levels' }, source: 'docs/00_VISION_CANONIQUE_ZERO_DAY_V1.md §18.1' },
    { value: '≈ 141 000', label: { fr: 'mots de game design', en: 'words of game design' }, source: 'docs/*.md excluding docs/archive (wc -w)' },
  ],
  scale: { months: 2, tests: 5 },
  doNotClaim: ['Playable game', 'A 1:1 implementation of MITRE ATT&CK', 'Multiplayer, leaderboard or the humanity V2 as existing (plans only)'],
}
