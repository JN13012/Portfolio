import type { Project } from '../types'
import cTFJohnImg from '../../assets/Projets/CTF_John.webp'
import cTFHashcatImg from '../../assets/Projets/CTF_Hashcat.webp'
import cTFMetasploitImg from '../../assets/Projets/CTF_Metasploit.webp'
import cTFForensicImg from '../../assets/Projets/CTF_Forensic.png'
import cTFSnortImg from '../../assets/Projets/CTF_Snort.webp'

export const ctfDuSite: Project = {
  slug: 'ctf-du-site',
  tier: 'card',
  status: 'delivered',
  tracks: ['cyber'],
  title: 'CTF Cyber',
  // git log of src/components/ProfileConsole: 2026-04-29 → 2026-05-28.
  period: { start: '2026-04', end: '2026-05' },
  team: { size: 1 },
  context: 'personal',
  tagline: {
    fr: 'CTF en 9 niveaux jouable sur ce site : attaquer une machine, puis la défendre.',
    en: 'A 9-level CTF playable on this site: attack a machine, then defend it.',
  },
  summary: {
    fr: 'Un CTF jouable sur ce site, dans un terminal simulé. On attaque d’abord une machine fictive, de la reconnaissance à l’exploitation, puis on passe côté défense : analyser l’attaque, la contenir et durcir l’infrastructure.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Les 9 niveaux' },
      points: [
        { text: { fr: 'Reconnaissance' } },
        { text: { fr: 'Commandes Linux' } },
        { text: { fr: 'Scan de services' } },
        { text: { fr: 'Injection SQL' } },
        { text: { fr: 'Mots de passe' } },
        { text: { fr: 'Exploit MS17-010' } },
        { text: { fr: 'SOC' } },
        { text: { fr: 'Forensique' } },
        { text: { fr: 'Durcissement' } },
      ],
    },
  ],
  images: [
    { src: cTFJohnImg },
    { src: cTFHashcatImg },
    { src: cTFMetasploitImg },
    { src: cTFForensicImg },
    { src: cTFSnortImg },
  ],
  stack: ['React', 'JavaScript'],
  links: { demo: '#lab' },
  facts: [
    { value: '9', label: { fr: 'niveaux', en: 'levels' }, source: 'src/sections/Lab/cyber/ctfData.js' },
    { value: '21', label: { fr: 'commandes et outils simulés', en: 'simulated commands and tools' }, source: 'ctfData.js: `unlocks` of all levels' },
  ],
  scale: { months: 2 },
}
