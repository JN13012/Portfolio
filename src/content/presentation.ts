import introUrl from '../assets/audio/intro.mp3'
import fraudeUrl from '../assets/audio/fraude.mp3'
import profilUrl from '../assets/audio/profil.mp3'

export type PresentationWord = { text: string; start: number; end: number }
export type PresentationCaption = { start: number; end: number; text: string; words: readonly PresentationWord[] }

/** Approved text with locally measured word timings; never generate timings from text length. */
function caption(start: number, end: number, words: readonly (readonly [string, number, number])[]): PresentationCaption {
  return { start, end, text: words.map(([text]) => text).join(' '), words: words.map(([text, start, end]) => ({ text, start, end })) }
}

export const presentationCaptions = [
  caption(0, 4.12, [
    ['Bonjour !', 0, 0.34], ['Je', 0.98, 1.18], ['suis', 1.18, 1.34], ['Sentry,', 1.34, 1.82],
    ['l’assistant', 2.12, 2.48], ['IA', 2.48, 2.88], ['de', 2.88, 3.08], ['Jérémie.', 3.08, 3.46],
  ]),
  caption(4.12, 9.14, [
    ['Grâce', 4.12, 4.34], ['au', 4.34, 4.46], ['clonage', 4.46, 4.76], ['vocal', 4.76, 5.04],
    ['par', 5.04, 5.3], ['intelligence', 5.3, 5.66], ['artificielle,', 5.66, 6.5],
    ['je', 7.04, 7.12], ['peux', 7.12, 7.26], ['vous', 7.26, 7.38], ['parler', 7.38, 7.62],
    ['avec', 7.62, 7.78], ['sa', 7.78, 7.92], ['propre', 7.92, 8.2], ['voix.', 8.2, 8.46],
  ]),
  caption(9.14, 10.78, [
    ['Bienvenue', 9.14, 9.48], ['dans', 9.48, 9.6], ['son', 9.6, 9.72], ['portfolio !', 9.72, 10.16],
  ]),
  caption(10.78, 14.72, [
    ['Je', 10.78, 10.92], ['vais', 10.92, 11.02], ['vous', 11.02, 11.1], ['faire', 11.1, 11.26],
    ['découvrir', 11.26, 11.64], ['son', 11.64, 11.86], ['parcours,', 11.86, 12.4],
    ['ses', 12.48, 12.8], ['compétences', 12.8, 13.44], ['et', 13.44, 13.56], ['ses', 13.56, 13.68], ['projets.', 13.68, 13.98],
  ]),
]

/** Owner-supplied text, timed against local speech recognition and the recording's pauses. */
export const fraudeCaptions = [
  caption(0, 3.88, [
    ['Avant', 0, 0.18], ['de', 0.18, 0.28], ['poursuivre,', 0.28, 0.86], ['une', 0.86, 1.12],
    ['petite', 1.12, 1.4], ['sensibilisation', 1.4, 2.18], ['à', 2.18, 2.46], ['la', 2.46, 2.54],
    ['fraude', 2.54, 2.78], ['numérique !', 2.78, 3.16],
  ]),
  caption(3.88, 7.05, [
    ['L’intelligence', 3.88, 4.3], ['artificielle', 4.3, 5.02], ['permet', 5.02, 5.32],
    ['aujourd’hui', 5.32, 5.8], ['d’imiter', 5.8, 6.16], ['une', 6.16, 6.34], ['voix,', 6.34, 6.56],
  ]),
  caption(7.05, 10.90, [
    ['facilitant', 7.05, 7.52], ['ainsi', 7.52, 7.86], ['l’usurpation', 7.86, 8.48],
    ['d’identité', 8.48, 9.08], ['et', 9.08, 9.44], ['certaines', 9.44, 9.72], ['fraudes.', 9.72, 10.14],
  ]),
  caption(10.90, 14.36, [
    ['Face', 10.90, 11.06], ['à', 11.06, 11.18], ['une', 11.18, 11.26], ['demande', 11.26, 11.48],
    ['suspecte,', 11.48, 11.9], ['vérifiez', 12.6, 12.94], ['l’identité', 12.94, 13.4],
    ['de', 13.4, 13.5], ['votre', 13.5, 13.66], ['interlocuteur', 13.66, 14.36],
  ]),
  caption(14.36, 17.54, [
    ['en', 14.36, 14.62], ['le', 14.62, 14.72], ['rappelant', 14.72, 15.12], ['sur', 15.12, 15.32],
    ['un', 15.32, 15.44], ['numéro', 15.44, 15.68], ['connu', 15.68, 16.22], ['ou', 16.22, 16.42], ['officiel.', 16.42, 16.94],
  ]),
  caption(17.54, 22.64, [
    ['Une', 17.54, 17.62], ['question', 17.62, 17.92], ['de', 17.92, 18.06], ['vérification', 18.06, 18.68],
    ['portant', 18.68, 19.06], ['sur', 19.06, 19.24], ['une', 19.24, 19.34], ['information', 19.34, 19.86],
    ['privée', 19.86, 20.68], ['peut', 20.68, 21.3], ['également', 21.3, 21.6], ['aider.', 21.6, 21.96],
  ]),
]

/** Approved Profil transcript, aligned locally to profil.wav and its natural pauses. */
export const profilCaptions = [
  caption(0, 2.10, [
    ['Maintenant', 0, 0.28], ['que', 0.28, 0.44], ['vous', 0.44, 0.54], ['savez', 0.54, 0.78],
    ['que', 0.78, 0.94], ['je', 0.94, 1.04], ['ne', 1.04, 1.12], ['suis', 1.12, 1.2], ['pas', 1.2, 1.38], ['humain,', 1.38, 1.76],
  ]),
  caption(2.10, 4.70, [
    ['laissez-moi', 2.14, 2.48], ['vous', 2.48, 2.6], ['présenter', 2.6, 3.04],
    ['celui', 3.04, 3.32], ['qui', 3.32, 3.48], ['m’a', 3.48, 3.6], ['donné', 3.6, 3.76], ['vie !', 3.76, 4.0],
  ]),
  caption(4.70, 6.65, [
    ['Alors,', 4.70, 5.0], ['qui', 5.46, 5.66], ['est', 5.66, 5.74], ['Jérémie ?', 5.74, 6.06],
  ]),
  caption(6.65, 12.72, [
    ['Étudiant', 6.65, 7.0], ['à', 7.0, 7.1], ['Epitech,', 7.1, 7.62], ['il', 8.0, 8.06],
    ['s’intéresse', 8.06, 8.84], ['particulièrement', 8.84, 9.26], ['à', 9.26, 9.5], ['l’ingénierie', 9.5, 10.12],
    ['IA', 10.12, 10.5], ['et', 10.97, 11.02], ['à', 11.02, 11.1], ['la', 11.1, 11.18], ['cybersécurité.', 11.18, 12.0],
  ]),
  caption(12.72, 16.59, [
    ['Il', 12.72, 12.82], ['possède', 12.82, 13.18], ['la', 13.18, 13.32], ['certification', 13.32, 13.8],
    ['IBM', 13.8, 14.56], ['AI', 14.56, 15.48], ['Developer', 15.48, 16.0],
  ]),
  caption(16.59, 20.23, [
    ['et', 16.59, 16.66], ['a', 16.66, 16.74], ['validé', 16.74, 17.08], ['le', 17.08, 17.18],
    ['parcours', 17.18, 17.56], ['Jr.', 17.56, 17.88], ['Pentester', 18.16, 18.68], ['de', 18.68, 18.98], ['TryHackMe.', 18.98, 19.56],
  ]),
  caption(20.23, 24.80, [
    ['Il', 20.23, 20.28], ['souhaite', 20.28, 20.56], ['désormais', 20.56, 21.0], ['approfondir', 21.0, 21.62],
    ['ses', 21.62, 21.76], ['compétences', 21.76, 22.38], ['en', 22.38, 22.5], ['ingénierie', 22.5, 23.04],
    ['et', 23.04, 23.14], ['sécurité', 23.14, 23.5], ['de', 23.5, 23.8], ['l’IA.', 23.8, 24.06],
  ]),
  caption(24.80, 26.53, [
    ['Ce', 24.80, 24.9], ['qui', 24.9, 25.02], ['le', 25.02, 25.1], ['motive', 25.1, 25.34], ['surtout ?', 25.34, 25.74],
  ]),
  caption(26.53, 30.58, [
    ['Apprendre,', 26.53, 26.88], ['expérimenter', 27.36, 27.88], ['et', 27.88, 28.06], ['contribuer', 28.06, 28.56],
    ['à', 28.56, 28.64], ['des', 28.64, 28.74], ['projets', 28.74, 28.98], ['concrets', 28.98, 29.44],
    ['et', 29.44, 29.58], ['ambitieux.', 29.58, 29.98],
  ]),
  caption(30.58, 33.450091, [
    ['Et', 30.58, 30.62], ['justement,', 30.62, 31.1], ['découvrons', 31.54, 31.92],
    ['quelques-unes', 31.92, 32.36], ['de', 32.36, 32.48], ['ses', 32.48, 32.58], ['réalisations !', 32.58, 33.12],
  ]),
]

/** Only recorded, approved chapters have a source. Durations come from the media at runtime. */
export const presentationChapters = [
  { id: 'introduction', title: 'Intro', shortTitle: 'Intro', summary: 'Sentry et la voix clonée de Jérémie', src: introUrl, duration: 14.72, captions: presentationCaptions },
  { id: 'fraude', title: 'Fraude', shortTitle: 'Fraude', summary: 'Clonage vocal, usurpation d’identité et vérification de l’interlocuteur', src: fraudeUrl, duration: 22.64, captions: fraudeCaptions },
  { id: 'profil', title: 'Profil', shortTitle: 'Profil', summary: 'Présentation de Jérémie et de son profil', src: profilUrl, duration: 33.450091, captions: profilCaptions },
  { id: 'projets', title: 'Projets', shortTitle: 'Projets', summary: 'Les réalisations de Jérémie' },
  { id: 'parcours', title: 'Parcours', shortTitle: 'Parcours', summary: 'Formation et expériences professionnelles' },
  { id: 'alternance', title: 'Alternance', shortTitle: 'Alternance', summary: 'Recherche d’alternance et contact' },
] as const satisfies ReadonlyArray<{ id: string; title: string; shortTitle: string; summary: string; src?: string; duration?: number; captions?: readonly PresentationCaption[] }>

export function presentationCaptionAt(seconds: number, chapterId = 'introduction') {
  const chapter = presentationChapters.find((item) => item.id === chapterId)
  return chapter && 'captions' in chapter ? chapter.captions.find((cue) => seconds >= cue.start && seconds < cue.end) : undefined
}

export const presentationCopy = {
  play: 'Écouter la présentation',
  pause: 'Mettre la présentation en pause',
  resume: 'Reprendre la présentation',
  replay: 'Réécouter la présentation',
  retry: 'Réessayer la présentation',
  minimize: 'Réduire le lecteur audio',
  expand: 'Développer le lecteur audio',
  loading: 'Chargement de la présentation…',
  playing: 'Présentation en cours',
  paused: 'Présentation en pause',
  ended: 'Présentation terminée',
  error: 'Lecture indisponible. Vous pouvez réessayer.',
  soon: 'À venir',
}
