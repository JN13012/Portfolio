import introUrl from '../assets/audio/intro.mp3'
import fraudeUrl from '../assets/audio/fraude.mp3'
import profilUrl from '../assets/audio/profil.mp3'
import projetsUrl from '../assets/audio/projets.mp3'

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

/** Approved Projets text, aligned locally to projets.wav and its natural pauses. */
export const projetsCaptions = [
  caption(0, 2.08, [
    ['Passons', 0, 0.24], ['maintenant', 0.24, 0.56], ['aux', 0.56, 0.72],
    ['projets', 0.72, 1.04], ['de', 1.04, 1.18], ['Jérémie !', 1.18, 1.62],
  ]),
  caption(2.08, 5.56, [
    ['Commençons', 2.08, 2.64], ['par', 2.64, 2.84], ['ARGOS,', 2.84, 3.34],
    ['une', 3.8, 3.9], ['plateforme', 3.9, 4.32], ['de', 4.32, 4.5], ['cybersécurité', 4.5, 5.38],
  ]),
  caption(5.56, 7.9, [
    ['pilotée', 5.56, 5.94], ['par', 5.94, 6.12], ['intelligence', 6.12, 6.56], ['artificielle,', 6.56, 7.38],
  ]),
  caption(7.9, 12.18, [
    ['conçue', 7.9, 8.22], ['pour', 8.22, 8.48], ['aider', 8.48, 8.6], ['les', 8.6, 8.8],
    ['entreprises', 8.8, 9.28], ['à', 9.28, 9.48], ['identifier', 9.48, 9.8], ['et', 9.8, 10.16],
    ['corriger', 10.16, 10.48], ['leurs', 10.48, 10.68], ['vulnérabilités.', 10.68, 11.46],
  ]),
  caption(12.18, 16.66, [
    ['Son', 12.18, 12.42], ['premier', 12.42, 12.72], ['module', 12.72, 12.96],
    ['de', 12.96, 13.14], ['recherche', 13.14, 13.48], ['et', 13.48, 13.68],
    ['d’analyse', 13.68, 14.12], ['de', 14.12, 14.24], ['données', 14.24, 14.44],
    ['publiques', 14.44, 15.1], ['est', 15.1, 15.42], ['en', 15.42, 15.56], ['développement.', 15.56, 15.96],
  ]),
  caption(16.66, 20.3, [
    ['Avec', 16.66, 16.88], ['Block-Trader,', 16.88, 17.52], ['Jérémie', 18.24, 18.48],
    ['développe', 18.48, 18.96], ['un', 18.96, 19.04], ['système', 19.04, 19.36],
    ['de', 19.36, 19.58], ['trading,', 19.58, 19.92],
  ]),
  caption(20.3, 22, [
    ['où', 20.3, 20.56], ['la', 20.56, 20.68], ['validation', 20.68, 21.02],
    ['des', 21.02, 21.36], ['stratégies', 21.36, 22],
  ]),
  caption(22, 24.98, [
    ['et', 22, 22.46], ['la', 22.46, 22.58], ['gestion', 22.58, 22.9], ['des', 22.9, 23.06],
    ['risques', 23.06, 23.38], ['occupent', 23.38, 23.72], ['une', 23.72, 23.84],
    ['place', 23.84, 24], ['centrale.', 24, 24.48],
  ]),
  caption(24.98, 28.22, [
    ['Maria', 24.98, 25.42], ['Agent', 25.42, 25.76], ['est', 25.76, 25.98], ['un', 25.98, 26.1],
    ['projet', 26.1, 26.36], ['d’assistant', 26.36, 26.86], ['vocal', 26.86, 27.14], ['intelligent,', 27.14, 27.7],
  ]),
  caption(28.22, 32.74, [
    ['conçu', 28.22, 28.5], ['pour', 28.5, 28.72], ['accompagner', 28.72, 29.16],
    ['les', 29.16, 29.26], ['professionnels', 29.26, 29.9], ['dans', 29.9, 30], ['la', 30, 30.12],
    ['gestion', 30.12, 30.44], ['des', 30.44, 30.58], ['appels', 30.58, 31],
    ['et', 31, 31.46], ['des', 31.46, 31.56], ['réservations.', 31.56, 32.14],
  ]),
  caption(32.74, 34.6, [
    ['Code', 32.74, 33], ['Executor', 33, 33.56], ['est', 33.56, 33.72],
    ['un', 33.72, 33.86], ['outil', 33.86, 34.06], ['Salesforce', 34.06, 34.6],
  ]),
  caption(34.6, 38.68, [
    ['permettant', 34.6, 35.38], ['d’exécuter,', 35.38, 36.06], ['d’enchaîner', 36.58, 36.96],
    ['et', 36.96, 37.1], ['de', 37.1, 37.18], ['planifier', 37.18, 37.56],
    ['des', 37.56, 37.7], ['scripts.', 37.7, 37.9],
  ]),
  caption(38.68, 40.72, [
    ['Il', 38.68, 38.88], ['est', 38.88, 38.98], ['déjà', 38.98, 39.22],
    ['utilisé', 39.22, 39.62], ['en', 39.62, 39.72], ['production.', 39.72, 40.14],
  ]),
  caption(40.72, 44.56, [
    ['Et', 40.72, 40.88], ['avec', 40.88, 41.02], ['ZERO//DAY,', 41.02, 42.18],
    ['Jérémie', 42.18, 42.92], ['développe', 42.92, 43.42], ['un', 43.42, 43.5],
    ['jeu', 43.5, 43.64], ['de', 43.64, 43.76], ['stratégie', 43.76, 44.56],
  ]),
  caption(44.56, 47.98, [
    ['dans', 44.56, 44.78], ['lequel', 44.78, 45.04], ['vous', 45.04, 45.22], ['incarnez', 45.22, 45.62],
    ['une', 45.62, 45.78], ['intelligence', 45.78, 46.16], ['artificielle', 46.16, 47], ['malveillante', 47.14, 47.7],
  ]),
  caption(47.98, 50, [
    ['qui', 47.98, 48.18], ['se', 48.18, 48.32], ['propage', 48.32, 48.72],
    ['à', 48.72, 48.84], ['travers', 48.84, 49.08], ['le', 49.08, 49.24], ['monde.', 49.24, 49.52],
  ]),
  caption(50, 52.72, [
    ['Il', 50, 50.26], ['développe', 50.26, 50.68], ['également', 50.68, 50.92],
    ['de', 50.92, 51.16], ['nombreux', 51.16, 51.54], ['autres', 51.54, 51.72], ['projets,', 51.72, 52.1],
  ]),
  caption(52.72, 56.22, [
    ['dont', 52.72, 52.82], ['des', 52.82, 52.86], ['laboratoires', 52.86, 53.36],
    ['d’entraînement', 53.36, 53.88], ['en', 53.88, 54.1], ['IA', 54.1, 54.32],
    ['et', 54.32, 54.58], ['en', 54.58, 54.68], ['cybersécurité.', 54.68, 55.44],
  ]),
  caption(56.22, 59.02, [
    ['Derrière', 56.22, 56.4], ['tous', 56.5, 56.58], ['ces', 56.58, 56.72], ['projets,', 56.72, 57.04],
    ['un', 57.5, 57.6], ['même', 57.6, 57.78], ['fil', 57.78, 57.96], ['conducteur :', 57.96, 58.64],
  ]),
  caption(59.02, 60.94, [
    ['explorer', 59.02, 59.38], ['de', 59.38, 59.56], ['nouvelles', 59.56, 59.76], ['technologies,', 59.76, 60.36],
  ]),
  caption(60.94, 63.24, [
    ['relever', 60.94, 61.14], ['des', 61.14, 61.28], ['défis', 61.28, 61.66],
    ['et', 61.66, 61.82], ['donner', 61.82, 61.96], ['vie', 61.96, 62.18],
    ['à', 62.18, 62.28], ['ses', 62.28, 62.42], ['idées.', 62.42, 62.76],
  ]),
  caption(63.24, 65.95, [
    ['Mais', 63.24, 63.4], ['son', 63.4, 63.54], ['parcours', 63.54, 63.92], ['n’a', 63.92, 64.08],
    ['pas', 64.08, 64.2], ['commencé', 64.2, 64.56], ['dans', 64.56, 64.72], ['l’informatique…', 64.72, 65.24],
  ]),
  caption(65.95, 67.84, [
    ['Découvrons', 66.12, 66.48], ['son', 66.48, 66.66], ['histoire !', 66.66, 67],
  ]),
]

/** Only recorded, approved chapters have a source. Durations come from the media at runtime. */
export const presentationChapters = [
  { id: 'introduction', title: 'Intro', shortTitle: 'Intro', summary: 'Sentry et la voix clonée de Jérémie', src: introUrl, duration: 14.72, captions: presentationCaptions },
  { id: 'fraude', title: 'Fraude', shortTitle: 'Fraude', summary: 'Clonage vocal, usurpation d’identité et vérification de l’interlocuteur', src: fraudeUrl, duration: 22.64, captions: fraudeCaptions },
  { id: 'profil', title: 'Profil', shortTitle: 'Profil', summary: 'Présentation de Jérémie et de son profil', src: profilUrl, duration: 33.450091, captions: profilCaptions },
  { id: 'projets', title: 'Projets', shortTitle: 'Projets', summary: 'Les réalisations de Jérémie', src: projetsUrl, duration: 67.84, captions: projetsCaptions },
  { id: 'parcours', title: 'Parcours', shortTitle: 'Parcours', summary: 'Formation et expériences professionnelles' },
  { id: 'alternance', title: 'Alternance', shortTitle: 'Alternance', summary: 'Recherche d’alternance et contact' },
] as const satisfies ReadonlyArray<{ id: string; title: string; shortTitle: string; summary: string; src?: string; duration?: number; captions?: readonly PresentationCaption[] }>

export function presentationCaptionAt(seconds: number, chapterId = 'introduction') {
  const chapter = presentationChapters.find((item) => item.id === chapterId)
  return chapter && 'captions' in chapter ? chapter.captions.find((cue) => seconds >= cue.start && seconds < cue.end) : undefined
}

export const presentationCopy = {
  listen: 'Écouter',
  listenAgain: 'Réécouter',
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
