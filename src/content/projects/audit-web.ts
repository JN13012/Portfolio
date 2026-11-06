import type { Project } from '../types'
import auditTorImg from '../../assets/Projets/Audit_Tor.webp'
import auditGobusterImg from '../../assets/Projets/Audit_Gobuster.webp'
import auditSqlmapImg from '../../assets/Projets/Audit_Sqlmap.webp'

// Legacy portfolio entry « Audit - 1 » (archive/portfolio-v0: 04/2026, ~20 h, phases and tags), confirmed by Jérémie on 2026-10-17.
export const auditWeb: Project = {
  slug: 'audit-web',
  tier: 'card',
  status: 'delivered',
  tracks: ['cyber'],
  title: 'Audit web professionnel',
  period: { start: '2026-04', end: '2026-04' },
  team: { size: 1 },
  context: 'work',
  tagline: {
    fr: 'Premier audit de sécurité web professionnel, autorisé, sur une infrastructure réelle.',
    en: 'A first professional web security audit, authorised, on real infrastructure.',
  },
  summary: {
    fr: 'Un audit de sécurité web d’environ 20 heures, mené dans un cadre autorisé sur l’infrastructure réelle d’un client, de la reconnaissance au rapport technique. Aucune vulnérabilité n’a été découverte ; le client reste confidentiel.',
    en: 'A web security audit of about 20 hours, carried out in an authorised setting on a client’s real infrastructure, from reconnaissance to the technical report. No vulnerability was found; the client remains confidential.',
  },
  // Told by Jérémie on 2026-10-26, as is the result: no vulnerability found.
  sections: [
    {
      kind: 'approach',
      title: { fr: 'La démarche' },
      body: { fr: 'Audit en boîte noire : reconnaissance, détection du WAF, tests de filtrage via Tor, analyse du trafic avec Burp Suite et recherche guidée par l’OWASP Top 10, dont l’injection SQL.' },
    },
    {
      kind: 'limits',
      title: { fr: 'Les difficultés' },
      body: { fr: 'Le WAF bloquait les tests trop visibles, et un message d’erreur unique à la connexion ne révélait pas si un compte existait.' },
    },
  ],
  // Redacted by Jérémie (client hidden); JoomScan, Nmap and Tor start-up left out (CMS version, Tor warnings).
  images: [
    { src: auditTorImg },
    { src: auditGobusterImg },
    { src: auditSqlmapImg },
  ],
  stack: ['Burp Suite', 'Tor', 'OWASP Top 10'],
  links: { confidential: true },
  facts: [{ value: '≈ 20 h', label: { fr: 'd’audit', en: 'of auditing' }, source: 'legacy portfolio « Audit - 1 », confirmed by Jérémie' }],
  scale: { months: 1 },
}
