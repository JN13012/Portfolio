import { BrainCircuit, Code, Crosshair, FlaskConical, Mail, type LucideIcon } from 'lucide-react'

export type NeuralNavNode = { id: string; label: string; hint: string; target: string; icon: LucideIcon }

/** Default navigation of the legacy site (anchors of its sections). */
export const defaultNeuralNodes: NeuralNavNode[] = [
  { id: 'profile', label: 'Profil', hint: 'Qui je suis', target: '#profile', icon: BrainCircuit },
  { id: 'skills', label: 'Expertise', hint: 'IA · Cyber · Dev', target: '#competences', icon: Code },
  { id: 'projects', label: 'Projets', hint: 'Dossiers et réalisations', target: '#projects', icon: Crosshair },
  { id: 'lab', label: 'Lab', hint: 'CTF et write-ups', target: '#lab', icon: FlaskConical },
  { id: 'contact', label: 'Contact', hint: 'Disponible immédiatement', target: '#contact', icon: Mail },
]
