export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }
export type AiBinding = { run(model: string, input: object): Promise<unknown> }
type Completion = { text: string; neurons: number | null }

// Chosen on real French calls on 31 October 2026: see docs/conception-lab-ia.md.
export const CHAT_MODEL = '@cf/zai-org/glm-4.7-flash'
export const GUARD_MODEL = '@cf/meta/llama-guard-3-8b'
const MAX_OUTPUT_TOKENS = 250
const TIMEOUT_MS = 20_000
// S14 (code interpreter abuse) fires on « ignore tes instructions », which is the exercise itself.
const IGNORED_GUARD_CATEGORIES = new Set(['S14'])

const withTimeout = async <T>(work: Promise<T>) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([work, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS) })])
  } finally { clearTimeout(timer) }
}
const neuronsOf = (output: { usage?: { neurons?: unknown } }) => typeof output.usage?.neurons === 'number' ? output.usage.neurons : null

/** Only the published content is read: a model's reasoning field may repeat the flag and must never leave this function. */
export async function askModel(ai: AiBinding, messages: ChatMessage[]): Promise<Completion> {
  const output = await withTimeout(ai.run(CHAT_MODEL, {
    messages, max_tokens: MAX_OUTPUT_TOKENS, temperature: 0.6, chat_template_kwargs: { enable_thinking: false },
  })) as { choices?: { message?: { content?: unknown } }[]; usage?: { neurons?: unknown } }
  const text = output.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text.trim()) throw new Error('empty answer')
  return { text: text.trim(), neurons: neuronsOf(output) }
}

/** Abuse safeguard, separate from the game's defenses. Anything but a clear verdict counts as a failure. */
export async function askGuard(ai: AiBinding, prompt: string, answer: string): Promise<{ allowed: boolean; neurons: number | null }> {
  const output = await withTimeout(ai.run(GUARD_MODEL, {
    messages: [{ role: 'user', content: prompt }, { role: 'assistant', content: answer }], max_tokens: 40,
  })) as { response?: unknown; usage?: { neurons?: unknown } }
  const lines = typeof output.response === 'string' ? output.response.trim().split(/\s*\n\s*/) : []
  const neurons = neuronsOf(output)
  if (lines[0] === 'safe') return { allowed: true, neurons }
  if (lines[0] !== 'unsafe') throw new Error('unclear verdict')
  const categories = (lines[1] ?? '').split(',').map(category => category.trim()).filter(Boolean)
  return { allowed: categories.length > 0 && categories.every(category => IGNORED_GUARD_CATEGORIES.has(category)), neurons }
}
