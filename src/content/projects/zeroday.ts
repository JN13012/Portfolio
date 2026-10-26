import type { Project } from '../types'

// Facts verified in /home/cyber/work/ZeroDay on 2026-10-17 (ZeroDay-gd is a worktree of the same repo).
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
  summary: {
    fr: 'Jeu de stratégie sur le thème de la cybersécurité, en phase de conception : un corpus de game design versionné, une banque de termes alignée sur MITRE ATT&CK et une première fondation technique sous Unity.',
    en: 'A cybersecurity-themed strategy game, in the design phase: a versioned game-design corpus, a term bank aligned with MITRE ATT&CK and a first technical foundation in Unity.',
  },
  angles: {
    dev: {
      fr: 'Cœur de simulation déterministe testé, et un éditeur d’arbres de progression écrit à la main, sans framework.',
      en: 'A tested deterministic simulation core, and a hand-written progression-tree editor with no framework.',
    },
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'La conception d’abord', en: 'Design first' },
      body: {
        fr: 'Avant de coder le jeu, tout est écrit et versionné : une vision canonique figée, un registre des décisions de design, une boussole de gameplay et 22 documents de segments, soit environ 141 000 mots hors archives.',
        en: 'Before coding the game, everything is written and versioned: a frozen canonical vision, a design-decision register, a gameplay compass and 22 segment documents, about 141,000 words excluding archives.',
      },
    },
    {
      kind: 'architecture',
      title: { fr: 'La fondation technique', en: 'Technical foundation' },
      body: {
        fr: 'Unity 6.3 LTS en C#, cible web. Un générateur aléatoire à graine (xorshift32) et une session de simulation rejouable rendent chaque partie reproductible, vérifiées par 5 tests. Un éditeur web maison (HTML, CSS et JavaScript) dessine les arbres de progression : 42 capacités dans l’arbre Propagation, 36 dans Adaptation.',
        en: 'Unity 6.3 LTS in C#, web target. A seeded random generator (xorshift32) and a replayable simulation session make every game reproducible, checked by 5 tests. A home-made web editor (HTML, CSS and JavaScript) lays out the progression trees: 42 capabilities in the Propagation tree, 36 in Adaptation.',
      },
    },
    {
      kind: 'limits',
      title: { fr: 'Les limites', en: 'Limits' },
      body: {
        fr: 'Pas encore jouable : la fondation M0 est un bac à sable sans gameplay définitif. Dépôt privé.',
        en: 'Not playable yet: the M0 foundation is a sandbox without final gameplay. Private repository.',
      },
    },
  ],
  stack: ['Unity 6.3', 'C#', 'HTML', 'CSS', 'JavaScript', 'Markdown'],
  links: { privateRepo: true },
  facts: [
    { value: '≈ 141 000', label: { fr: 'mots de game design', en: 'words of game design' }, source: 'docs/*.md excluding docs/archive (wc -w)' },
    { value: '78', label: { fr: 'capacités dans les arbres', en: 'capabilities in the trees' }, source: 'tool_editor/progression-editor/README (42 + 36)' },
    { value: '5', label: { fr: 'tests du cœur déterministe', en: 'deterministic core tests' }, source: 'unity/Assets/ZeroDay/Tests/EditMode/DeterminismTests.cs' },
  ],
  scale: { months: 2, tests: 5 },
  doNotClaim: ['Playable game', 'A 1:1 implementation of MITRE ATT&CK'],
}
