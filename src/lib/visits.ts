const KEY = 'portfolio-visit-session'
type Session = { sessionId: string; startedAt: number }

// One request shared across StrictMode remounts and intro replays.
export function createVisitClient(storage: Pick<Storage, 'getItem' | 'setItem'>, send: typeof fetch = fetch) {
  let pending: Promise<number | null> | undefined
  return () => pending ??= (async () => {
    try {
      let session: Session | undefined
      try {
        const saved = JSON.parse(storage.getItem(KEY) || 'null')
        if (typeof saved?.sessionId === 'string' && typeof saved.startedAt === 'number') session = saved
        if (!session) {
          session = { sessionId: crypto.randomUUID(), startedAt: Date.now() }
          // Persist before sending: a lost response/reload retries the same identifier.
          storage.setItem(KEY, JSON.stringify(session))
        }
      } catch { session = undefined /* Storage unavailable: read the total without counting. */ }
      const active = session && session.startedAt > Date.now() - 30 * 24 * 60 * 60 * 1000
      const response = await send('/api/visits', active ? {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(session),
        signal: AbortSignal.timeout(8000),
      } : { signal: AbortSignal.timeout(8000) })
      if (!response.ok) return null
      const data = await response.json()
      return Number.isSafeInteger(data.total) && data.total >= 0 ? data.total as number : null
    } catch { return null }
  })()
}
// Access storage lazily, including browsers where its getter throws.
export const loadVisitTotal = createVisitClient({
  getItem: key => window.sessionStorage.getItem(key),
  setItem: (key, value) => window.sessionStorage.setItem(key, value),
})
