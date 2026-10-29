import { describe, expect, it } from 'vitest'
import { fraudeCaptions, profilCaptions, projetsCaptions, presentationCaptionAt, presentationChapters } from './presentation'

describe('the current Sentry recording caption alignment', () => {
  it('matches the spoken phrases, including the welcome and closing sentence present in the 14.72 s recording', () => {
    expect(presentationCaptionAt(0.3)?.text).toBe('Bonjour ! Je suis Sentry, l’assistant IA de Jérémie.')
    expect(presentationCaptionAt(2.5)?.text).toContain('l’assistant IA de Jérémie')
    expect(presentationCaptionAt(4.6)?.text).toContain('clonage vocal')
    expect(presentationCaptionAt(4.6)?.text).toContain('sa propre voix')
    expect(presentationCaptionAt(7.5)?.text).toContain('sa propre voix')
    expect(presentationCaptionAt(9.5)?.text).toBe('Bienvenue dans son portfolio !')
    expect(presentationCaptionAt(11.3)?.text).toContain('son parcours')
    expect(presentationCaptionAt(13.5)?.text).toBe('Je vais vous faire découvrir son parcours, ses compétences et ses projets.')
  })

  it('switches at the phrase boundary and does not invent text outside the recording', () => {
    expect(presentationCaptionAt(4.119)?.text).toContain('Jérémie')
    expect(presentationCaptionAt(4.12)?.text).toContain('Grâce')
    expect(presentationCaptionAt(-1)).toBeUndefined()
    expect(presentationCaptionAt(NaN)).toBeUndefined()
    expect(presentationCaptionAt(14.72)).toBeUndefined()
  })

  it('offers the six requested chapters with the four recordings enabled in playlist order', () => {
    expect(presentationChapters.map((chapter) => chapter.shortTitle.toLocaleUpperCase('fr-FR'))).toEqual(['INTRO', 'FRAUDE', 'PROFIL', 'PROJETS', 'PARCOURS', 'ALTERNANCE'])
    expect(presentationChapters.filter((chapter) => 'src' in chapter).map((chapter) => chapter.id)).toEqual(['introduction', 'fraude', 'profil', 'projets'])
    expect(presentationCaptionAt(0, 'fraude')?.text).toContain('fraude numérique')
    expect(presentationCaptionAt(5, 'profil')?.text).toBe('Alors, qui est Jérémie ?')
    expect(presentationCaptionAt(5, 'projets')?.text).toContain('ARGOS')
    expect(presentationCaptionAt(5, 'parcours')).toBeUndefined()
    expect(presentationCaptionAt(22.64, 'fraude')).toBeUndefined()
  })

  it('keeps the supplied Projets transcript complete, including project names and the transition to Parcours', () => {
    expect(projetsCaptions.map((cue) => cue.text).join(' ')).toBe(
      'Passons maintenant aux projets de Jérémie ! Commençons par ARGOS, une plateforme de cybersécurité pilotée par intelligence artificielle, conçue pour aider les entreprises à identifier et corriger leurs vulnérabilités. Son premier module de recherche et d’analyse de données publiques est en développement. Avec Block-Trader, Jérémie développe un système de trading, où la validation des stratégies et la gestion des risques occupent une place centrale. Maria Agent est un projet d’assistant vocal intelligent, conçu pour accompagner les professionnels dans la gestion des appels et des réservations. Code Executor est un outil Salesforce permettant d’exécuter, d’enchaîner et de planifier des scripts. Il est déjà utilisé en production. Et avec ZERO//DAY, Jérémie développe un jeu de stratégie dans lequel vous incarnez une intelligence artificielle malveillante qui se propage à travers le monde. Il développe également de nombreux autres projets, dont des laboratoires d’entraînement en IA et en cybersécurité. Derrière tous ces projets, un même fil conducteur : explorer de nouvelles technologies, relever des défis et donner vie à ses idées. Mais son parcours n’a pas commencé dans l’informatique… Découvrons son histoire !',
    )
    expect(presentationCaptionAt(14, 'projets')?.text).toBe('Son premier module de recherche et d’analyse de données publiques est en développement.')
    expect(presentationCaptionAt(17, 'projets')?.text).toContain('Block-Trader')
    expect(presentationCaptionAt(26, 'projets')?.text).toContain('Maria Agent')
    expect(presentationCaptionAt(33, 'projets')?.text).toContain('Code Executor')
    expect(presentationCaptionAt(42, 'projets')?.text).toContain('ZERO//DAY')
    expect(presentationCaptionAt(67, 'projets')?.text).toContain('Découvrons son histoire !')
    expect(presentationCaptionAt(67.84, 'projets')).toBeUndefined()
  })

  it('keeps the full approved Profil transcript, aspirations and closing invitation', () => {
    expect(profilCaptions.map((cue) => cue.text).join(' ')).toBe(
      'Maintenant que vous savez que je ne suis pas humain, laissez-moi vous présenter celui qui m’a donné vie ! Alors, qui est Jérémie ? Étudiant à Epitech, il s’intéresse particulièrement à l’ingénierie IA et à la cybersécurité. Il possède la certification IBM AI Developer et a validé le parcours Jr. Pentester de TryHackMe. Il souhaite désormais approfondir ses compétences en ingénierie et sécurité de l’IA. Ce qui le motive surtout ? Apprendre, expérimenter et contribuer à des projets concrets et ambitieux. Et justement, découvrons quelques-unes de ses réalisations !',
    )
    expect(presentationCaptionAt(14, 'profil')?.text).toContain('IBM AI Developer')
    expect(presentationCaptionAt(21, 'profil')?.text).toContain('Il souhaite désormais approfondir')
    expect(presentationCaptionAt(33, 'profil')?.text).toContain('ses réalisations !')
    expect(presentationCaptionAt(33.450091, 'profil')).toBeUndefined()
  })

  it('uses the replacement fraud transcript in full, without the previous recording’s extra phrases', () => {
    expect(fraudeCaptions.map((cue) => cue.text).join(' ')).toBe(
      'Avant de poursuivre, une petite sensibilisation à la fraude numérique ! L’intelligence artificielle permet aujourd’hui d’imiter une voix, facilitant ainsi l’usurpation d’identité et certaines fraudes. Face à une demande suspecte, vérifiez l’identité de votre interlocuteur en le rappelant sur un numéro connu ou officiel. Une question de vérification portant sur une information privée peut également aider.',
    )
    expect(presentationCaptionAt(4.1, 'fraude')?.text).toContain('L’intelligence artificielle')
    expect(presentationCaptionAt(9, 'fraude')?.text).toContain('l’usurpation d’identité')
    expect(presentationCaptionAt(17, 'fraude')?.text).toContain('numéro connu ou officiel')
    expect(presentationCaptionAt(20, 'fraude')?.text).toContain('information privée')
    expect(presentationCaptionAt(9, 'introduction')?.text).toContain('sa propre voix')
  })

  it('keeps readable passages contiguous, with no brief fragment or caption beyond any recording', () => {
    for (const chapter of presentationChapters) {
      if (!('captions' in chapter)) continue
      expect(chapter.captions.at(0)?.start).toBe(0)
      expect(chapter.captions.at(-1)?.end).toBe(chapter.duration)
      chapter.captions.forEach((cue, index) => {
        expect(cue.end - cue.start).toBeGreaterThanOrEqual(1.5)
        expect(presentationCaptionAt(cue.start, chapter.id)).toBe(cue)
        expect(presentationCaptionAt(cue.end, chapter.id)).toBe(chapter.captions[index + 1])
        expect(cue.words.map((word) => word.text).join(' ')).toBe(cue.text)
        cue.words.forEach((word, wordIndex) => {
          expect(word.end).toBeGreaterThan(word.start)
          expect(word.start).toBeGreaterThanOrEqual(cue.words[wordIndex - 1]?.end ?? cue.start)
          expect(word.end).toBeLessThanOrEqual(cue.end)
        })
      })
    }
  })
})
