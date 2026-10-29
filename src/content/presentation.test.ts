import { describe, expect, it } from 'vitest'
import { presentationCaptionAt } from './presentation'

describe('the current Sentry recording caption alignment', () => {
  it('matches the spoken phrases, including the welcome and closing sentence present in the 14.72 s recording', () => {
    expect(presentationCaptionAt(0.3)?.text).toBe('Bonjour !')
    expect(presentationCaptionAt(2.5)?.text).toContain('l’assistant IA de Jérémie')
    expect(presentationCaptionAt(4.6)?.text).toContain('clonage vocal')
    expect(presentationCaptionAt(7.5)?.text).toContain('sa propre voix')
    expect(presentationCaptionAt(9.5)?.text).toBe('Bienvenue dans son portfolio !')
    expect(presentationCaptionAt(11.3)?.text).toContain('son parcours')
    expect(presentationCaptionAt(13.5)?.text).toBe('ses compétences et ses projets.')
  })

  it('switches at the phrase boundary and does not invent text outside the recording', () => {
    expect(presentationCaptionAt(4.119)?.text).toContain('Jérémie')
    expect(presentationCaptionAt(4.12)?.text).toContain('Grâce')
    expect(presentationCaptionAt(-1)).toBeUndefined()
    expect(presentationCaptionAt(NaN)).toBeUndefined()
    expect(presentationCaptionAt(14.72)).toBeUndefined()
  })
})
