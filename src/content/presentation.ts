import introUrl from '../assets/audio/sentry-intro-fr.mp3'

/** Only recorded, approved chapters have a source. Durations come from the media at runtime. */
export const presentationChapters = [
  { id: 'introduction', title: 'Introduction', shortTitle: 'Intro', summary: 'Sentry et la voix clonée de Jérémie', src: introUrl, duration: 14.72 },
  { id: 'ia', title: 'Intelligence artificielle', shortTitle: 'IA', summary: 'Développement IA, LLM, RAG et applications intelligentes' },
  { id: 'cyber', title: 'Cybersécurité', shortTitle: 'Cyber', summary: 'Pentest, recherche de vulnérabilités, Red Team et Blue Team' },
  { id: 'argos', title: 'ARGOS', shortTitle: 'ARGOS', summary: 'Agents IA pour la cybersécurité' },
  { id: 'projets', title: 'Autres projets', shortTitle: 'Projets', summary: 'Block-Trader, ZERO//DAY, Salesforce et autres réalisations' },
  { id: 'parcours', title: 'Parcours et certifications', shortTitle: 'Parcours', summary: 'EPITECH, expérience professionnelle, IBM et TryHackMe' },
  { id: 'voix', title: 'IA vocale et sécurité', shortTitle: 'Voix', summary: 'Clonage vocal, usurpation d’identité et sécurité de l’IA' },
  { id: 'contact', title: 'Conclusion et contact', shortTitle: 'Contact', summary: 'Découvrir le portfolio et contacter Jérémie' },
] as const satisfies ReadonlyArray<{ id: string; title: string; shortTitle: string; summary: string; src?: string; duration?: number }>

/** Owner-supplied text, aligned locally to the word starts in the current 14.72 s recording. */
export const presentationCaptions = [
  { start: 0, end: 0.98, text: 'Bonjour !' },
  { start: 0.98, end: 4.12, text: 'Je suis Sentry, l’assistant IA de Jérémie.' },
  { start: 4.12, end: 7.04, text: 'Grâce au clonage vocal par intelligence artificielle,' },
  { start: 7.04, end: 9.14, text: 'je peux vous parler avec sa propre voix.' },
  { start: 9.14, end: 10.78, text: 'Bienvenue dans son portfolio !' },
  { start: 10.78, end: 12.48, text: 'Je vais vous faire découvrir son parcours,' },
  { start: 12.48, end: 14.72, text: 'ses compétences et ses projets.' },
]

export function presentationCaptionAt(seconds: number) {
  return presentationCaptions.find((cue) => seconds >= cue.start && seconds < cue.end)
}

export const presentationCopy = {
  play: 'Écouter la présentation',
  pause: 'Mettre la présentation en pause',
  resume: 'Reprendre la présentation',
  replay: 'Réécouter l’introduction',
  retry: 'Réessayer la présentation',
  minimize: 'Réduire le lecteur audio',
  expand: 'Développer le lecteur audio',
  loading: 'Chargement de la présentation…',
  playing: 'Présentation en cours',
  paused: 'Présentation en pause',
  ended: 'Introduction terminée',
  error: 'Lecture indisponible. Vous pouvez réessayer.',
  soon: 'À venir',
}
