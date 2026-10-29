import { IDLE_FREQUENCY } from './networkTempo'

/** Reuse the renderer's clock: no timer, no accumulated attacks while the welcome is open. */
export function createGuardDemoCadence(startedAt: number, random = Math.random) {
  let nextAt: number | null = startedAt + 3500 / IDLE_FREQUENCY
  return {
    due(now: number, seconds: number, held: boolean, active: boolean) {
      if (held) { nextAt = null; return false }
      if (nextAt !== null && now < nextAt) return false
      const fire = nextAt !== null
      // Speech and answers keep occasional demonstrations, at half the idle frequency.
      nextAt = now + seconds * 1000 / IDLE_FREQUENCY * (active ? 2 : 1) * (0.8 + random() * 0.4)
      return fire
    },
  }
}
