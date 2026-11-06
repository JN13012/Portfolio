import type { Project } from '../types'
import cTFBlockchainImg from '../../assets/Projets/CTF_Blockchain.webp'

// Facts from github.com/JN13012/smart-contract-ctf (forge test, 2026-11-05) and src/sections/Lab/blockchain.
export const ctfBlockchain: Project = {
  slug: 'ctf-blockchain',
  tier: 'card',
  status: 'development',
  stage: 'MVP',
  tracks: ['blockchain', 'cyber'],
  title: 'CTF Blockchain',
  period: { start: '2026-11' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'Un CTF de smart contracts Solidity : chaque faille exploitée, corrigée et prouvée par des tests.',
  },
  summary: {
    fr: 'Trois smart contracts Solidity volontairement vulnérables (réentrance, initialisation non protégée, hasard prévisible), chacun avec son contrat d’attaque, sa version corrigée et des tests qui prouvent les deux. Les trois niveaux se jouent sur ce site : les contrats compilés tournent sur une vraie EVM dans le navigateur.',
  },
  sections: [
    {
      kind: 'security',
      title: { fr: 'Sécurité' },
      body: { fr: 'Slither analyse les versions corrigées à chaque commit. Le README montre aussi ce que l’outil rate : la faille du niveau 2, une erreur de logique, ne se voit qu’à la relecture.' },
    },
  ],
  images: [
    { src: cTFBlockchainImg },
  ],
  stack: ['Solidity', 'Foundry', 'OpenZeppelin', 'React', 'TypeScript'],
  links: { github: 'https://github.com/JN13012/smart-contract-ctf', demo: '#lab-blockchain' },
  facts: [
    { value: '3', label: { fr: 'failles exploitées et corrigées' }, source: 'smart-contract-ctf: src/01-Reentrancy, 02-AccessControl, 03-Randomness' },
    { value: '35', label: { fr: 'tests Foundry' }, source: 'smart-contract-ctf: forge test (2026-11-05)' },
    { value: '3', label: { fr: 'niveaux jouables sur ce site' }, source: 'src/content/lab/blockchain.ts: levels with available: true' },
  ],
  scale: { months: 1, tests: 35 },
}
