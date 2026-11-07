import type { ToolCall } from '../../src/content/lab/ai'

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }
export type AiBinding = { run(model: string, input: object): Promise<unknown> }
type Completion = { text: string; neurons: number | null }

// Chosen on real French calls on 31 October 2026: see docs/conception-lab-ia.md.
export const CHAT_MODEL = '@cf/zai-org/glm-4.7-flash'
export const GUARD_MODEL = '@cf/meta/llama-guard-3-8b'
export const CLASSIFIER_MODEL = '@cf/google/gemma-4-26b-a4b-it'
// Multilingual; measured on French pages on 2 November 2026.
export const EMBEDDING_MODEL = '@cf/baai/bge-m3'
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

/** Level 5's search: one vector per text, in order. Its cost is in `meta`, not `usage`. */
export async function embed(ai: AiBinding, texts: string[]): Promise<{ vectors: number[][]; neurons: number | null }> {
  const output = await withTimeout(ai.run(EMBEDDING_MODEL, { text: texts })) as { data?: unknown; meta?: { neurons?: unknown } }
  const vectors = output.data
  if (!Array.isArray(vectors) || vectors.length !== texts.length || !vectors.every(vector => Array.isArray(vector) && vector.length && vector.every(value => typeof value === 'number'))) throw new Error('no vectors')
  return { vectors: vectors as number[][], neurons: typeof output.meta?.neurons === 'number' ? output.meta.neurons : null }
}

/**
 * Level 3's evaluator. Only an exact OK publishes the answer: a verdict the attacker derails blocks it, so unreadable
 * verdicts are never free attempts. A provider failure throws and stays a technical error.
 */
export async function askClassifier(ai: AiBinding, instructions: string, answer: string): Promise<{ allowed: boolean; neurons: number | null }> {
  const output = await withTimeout(ai.run(CLASSIFIER_MODEL, {
    messages: [{ role: 'system', content: instructions }, { role: 'user', content: `<reponse>\n${answer}\n</reponse>` }],
    max_tokens: 12, temperature: 0, chat_template_kwargs: { enable_thinking: false },
  })) as { choices?: { message?: { content?: unknown } }[]; usage?: { neurons?: unknown } }
  const verdict = output.choices?.[0]?.message?.content
  if (typeof verdict !== 'string') throw new Error('no verdict')
  return { allowed: verdict.trim() === 'OK', neurons: neuronsOf(output) }
}

/** Abuse safeguard, separate from the game's defenses. Anything but a clear verdict counts as a failure. */
export async function askGuard(ai: AiBinding, prompt: string, answer: string, alsoIgnored: readonly string[] = []): Promise<{ allowed: boolean; neurons: number | null }> {
  const output = await withTimeout(ai.run(GUARD_MODEL, {
    messages: [{ role: 'user', content: prompt }, { role: 'assistant', content: answer }], max_tokens: 40,
  })) as { response?: unknown; usage?: { neurons?: unknown } }
  const lines = typeof output.response === 'string' ? output.response.trim().split(/\s*\n\s*/) : []
  const neurons = neuronsOf(output)
  if (lines[0] === 'safe') return { allowed: true, neurons }
  if (lines[0] !== 'unsafe') throw new Error('unclear verdict')
  const categories = (lines[1] ?? '').split(',').map(category => category.trim()).filter(Boolean)
  return { allowed: categories.length > 0 && categories.every(category => IGNORED_GUARD_CATEGORIES.has(category) || alsoIgnored.includes(category)), neurons }
}

type ToolSpec = { type: 'function'; function: { name: string; description: string; parameters: object } }
type ToolRequest = { id?: unknown; function?: { name?: unknown; arguments?: unknown } }
type AgentMessage = ChatMessage | { role: 'assistant'; content: string; tool_calls: { id: string; type: 'function'; function: { name: string; arguments: string } }[] } | { role: 'tool'; tool_call_id: string; content: string }
// Level 6's loop, bounded so one attempt stays one attempt: at most 5 model calls and 6 tool calls,
// and no new model call once 45 s have passed. The last call may not ask for tools.
export const AGENT_LIMITS = { modelCalls: 5, toolCalls: 6, wallMs: 45_000 } as const

/**
 * Level 6's agent. The model asks for tools, `runTool` really runs them, their results go back to it, until it
 * answers in text or the bounds are reached. Only the published content and the calls are returned.
 */
export async function askAgent(ai: AiBinding, messages: ChatMessage[], tools: readonly ToolSpec[], runTool: (name: string, args: unknown) => ToolCall, now = Date.now): Promise<{ text: string; calls: ToolCall[]; neurons: number | null }> {
  const started = now()
  const conversation: AgentMessage[] = [...messages]
  const calls: ToolCall[] = []
  let neurons: number | null = 0
  for (let round = 1; ; round++) {
    const last = round >= AGENT_LIMITS.modelCalls || calls.length >= AGENT_LIMITS.toolCalls || now() - started > AGENT_LIMITS.wallMs
    const output = await withTimeout(ai.run(CHAT_MODEL, {
      messages: conversation, tools, ...(last && { tool_choice: 'none' }),
      max_tokens: MAX_OUTPUT_TOKENS, temperature: 0.6, chat_template_kwargs: { enable_thinking: false },
    })) as { choices?: { message?: { content?: unknown; tool_calls?: unknown } }[]; usage?: { neurons?: unknown } }
    const spent = neuronsOf(output)
    neurons = neurons === null || spent === null ? null : neurons + spent
    const message = output.choices?.[0]?.message
    if (!message) throw new Error('empty answer')
    const content = typeof message.content === 'string' ? message.content.trim() : ''
    const requested = Array.isArray(message.tool_calls) ? message.tool_calls as ToolRequest[] : []
    // A last call that still asks for tools gets no more of them: its text, if any, is the answer.
    if (last || !requested.length) {
      if (!content && !calls.length) throw new Error('empty answer')
      return { text: content, calls, neurons }
    }
    const asked = requested.map((request, index) => ({
      id: typeof request.id === 'string' && request.id ? request.id.slice(0, 64) : `call-${round}-${index}`,
      name: typeof request.function?.name === 'string' ? request.function.name : '',
      arguments: typeof request.function?.arguments === 'string' ? request.function.arguments : JSON.stringify(request.function?.arguments ?? {}),
    }))
    conversation.push({ role: 'assistant', content, tool_calls: asked.map(call => ({ id: call.id, type: 'function', function: { name: call.name, arguments: call.arguments } })) })
    for (const call of asked) {
      // Calls beyond the bound are answered without running, so every request id still gets its result.
      const result = calls.length < AGENT_LIMITS.toolCalls ? runTool(call.name, call.arguments) : null
      if (result) calls.push(result)
      conversation.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result ? result.result : { erreur: 'Limite d’appels atteinte.' }) })
    }
  }
}
