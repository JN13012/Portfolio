// The assistant's conversation, shared by the chat window (site-wide, bottom right) and the hero
// network, which plays the answer being written. A tiny external store: no context provider needed.
import { useSyncExternalStore } from 'react'
import { type BrainNodeId, type PreparedAnswer } from '../content/assistant'
import { litNodes, type Run } from './brain'

type Exchange = {
  id: number
  question: string
  /** null: a free question, not answered yet (no backend in this step). */
  answer: PreparedAnswer | null
  node: BrainNodeId | null
  run: Run | null
}

type State = { open: boolean; exchanges: Exchange[] }

let state: State = { open: false, exchanges: [] }
let nextId = 0
const listeners = new Set<() => void>()
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export const assistant = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  get: () => state,
  setOpen: (open: boolean) => set({ open }),
  ask(answer: PreparedAnswer, node: BrainNodeId) {
    // Under reduced motion the answer is shown at once (a run that is already over).
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const run = { startedAt: still ? -Infinity : performance.now(), chars: answer.answer.fr.length, lit: litNodes(answer.sources) }
    set({ open: true, exchanges: [...state.exchanges, { id: nextId++, question: answer.question.fr, answer, node, run }] })
  },
  askFree(text: string) {
    set({ open: true, exchanges: [...state.exchanges, { id: nextId++, question: text, answer: null, node: null, run: null }] })
  },
}

export function useAssistant() {
  return useSyncExternalStore(assistant.subscribe, assistant.get, assistant.get)
}

/** The answer the network should play: the last one, while the chat is open. */
export function currentRun(s: State) {
  return s.open ? (s.exchanges.at(-1)?.run ?? null) : null
}
