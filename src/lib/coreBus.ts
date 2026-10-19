// Tiny event bus between the things that hit the core (backdrop meteors, the
// CTF, later the prompt-injection agent) and the core that reacts.

type CoreEvents = {
  /** Something hit the guardrail shell. `angle` in radians, screen space (0 = right, clockwise). */
  attack: { angle: number }
  /** A CTF level was solved. */
  flag: { level: number }
  /** Launch an attack now (demo controls): the backdrop sends a meteor at the core. */
  incoming: Record<string, never>
  /** The entry gate closed and the hero is now visible. */
  gateClosed: Record<string, never>
}

const bus = new EventTarget()

export function emitCore<K extends keyof CoreEvents>(type: K, detail: CoreEvents[K]) {
  bus.dispatchEvent(new CustomEvent(type, { detail }))
}

export function onCore<K extends keyof CoreEvents>(type: K, handler: (detail: CoreEvents[K]) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<CoreEvents[K]>).detail)
  bus.addEventListener(type, listener)
  return () => bus.removeEventListener(type, listener)
}
