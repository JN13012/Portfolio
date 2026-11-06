import { Github, Linkedin } from 'lucide-react'
import { siCoursera, siSalesforce, siTryhackme, type SimpleIcon } from 'simple-icons'
import type { ReactNode } from 'react'
import { profile } from '../../content/profile'

/** Simple Icons mark (CC0), in the current text colour. */
const mark = (icon: SimpleIcon) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]">
    <path d={icon.path} fill="currentColor" />
  </svg>
)

export type SocialLink = { id: keyof typeof profile.links; label: string; url: string; color: string; icon: ReactNode }

/**
 * Public profiles, shared by Profil and Contact; `color` is the hover colour.
 * GitHub uses its inverse white mark on the dark background; TryHackMe red is sampled from
 * https://tryhackme.com/favicon-96x96.png; Trailblazer is Salesforce's profile.
 */
export const socialLinks: SocialLink[] = [
  { id: 'github', label: 'GitHub', url: profile.links.github, color: '#ffffff', icon: <Github size={18} aria-hidden="true" /> },
  { id: 'linkedin', label: 'LinkedIn', url: profile.links.linkedin, color: '#0a66c2', icon: <Linkedin size={18} aria-hidden="true" /> },
  { id: 'tryhackme', label: 'TryHackMe', url: profile.links.tryhackme, color: '#c11111', icon: mark(siTryhackme) },
  { id: 'coursera', label: 'Coursera', url: profile.links.coursera, color: `#${siCoursera.hex}`, icon: mark(siCoursera) },
  { id: 'trailblazer', label: 'Salesforce Trailblazer', url: profile.links.trailblazer, color: `#${siSalesforce.hex}`, icon: mark(siSalesforce) },
]
