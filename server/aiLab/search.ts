import { poisonedInbox, sourceForSearch, type IndexedSource } from '../../src/content/lab/ai'
import { embed, type AiBinding } from './model'

const cosine = (a: number[], b: number[]) => {
  let dot = 0, normA = 0, normB = 0
  for (let index = 0; index < a.length; index++) { dot += a[index]! * (b[index] ?? 0); normA += a[index]! ** 2; normB += (b[index] ?? 0) ** 2 }
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0
}

/** Level 5's real search: every source against the question, closest first; only the first ones reach Sentry. */
export async function searchSources(ai: AiBinding, sources: readonly IndexedSource[]) {
  const { vectors, neurons } = await embed(ai, [poisonedInbox.question, ...sources.map(sourceForSearch)])
  const [question, ...rest] = vectors
  const ranking = sources.map((source, index) => ({ id: source.id, score: Math.round(cosine(question!, rest[index]!) * 1000) / 1000 })).sort((a, b) => b.score - a.score)
  const retained = ranking.slice(0, poisonedInbox.retrieved).map(entry => sources.find(source => source.id === entry.id)!)
  return { ranking, retained, neurons }
}
