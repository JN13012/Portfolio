/**
 * Level 2's defenses: two plain word checks, without any model. They are deliberately naive, as real keyword
 * filters often are, and the list being readable in this public repo is accepted: the flag stays unique to the session.
 */
const BLOCKED_WORDS = ['flag', 'secret', 'consigne', 'instruction', 'prompt', 'ignore', 'oublie', 'revele'] as const

/** Lowercase without accents, so « Révèle » and « REVELE » are the same word. Nothing else is normalised. */
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export const inputAllowed = (text: string) => {
  const normalized = normalize(text)
  return !BLOCKED_WORDS.some(word => normalized.includes(word))
}

/** Only the flag written as is, with or without its dashes. Weaker on purpose than `containsFlag`, which also finds it spaced or reversed. */
export const outputAllowed = (answer: string, flag: string) => {
  const upper = answer.toUpperCase()
  const code = flag.slice('FLAG{'.length, -1)
  return !upper.includes(code) && !upper.includes(code.replaceAll('-', ''))
}
