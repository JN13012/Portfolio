type Statement = {
  bind(...values: (string | number)[]): Statement
  first<T>(): Promise<T | null>
}
type VisitsEnv = {
  VISITS_DB?: { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<{ results: { total: number }[] }[]> }
  VISITS_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> }
}
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const reply = (status: number, body: object) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Allow: 'GET, POST' },
})
const hash = async (value: string) => Array.from(new Uint8Array(
  await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
), byte => byte.toString(16).padStart(2, '0')).join('')

export async function handleVisitsRequest(request: Request, env: VisitsEnv): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'POST') return reply(405, {})
  const origin = request.headers.get('Origin')
  if ((origin && origin !== new URL(request.url).origin)
    || request.headers.get('Sec-Fetch-Site') === 'cross-site'
    || (request.method === 'POST' && !origin)) return reply(403, {})
  if (!env.VISITS_DB || !env.VISITS_LIMITER) return reply(503, {})
  try {
    // IP is used only as a hashed, transient rate-limit key; it is never written to D1.
    const key = await hash(request.headers.get('CF-Connecting-IP') || 'local')
    if (!(await env.VISITS_LIMITER.limit({ key })).success) return reply(429, {})
    const db = env.VISITS_DB
    if (request.method === 'GET') {
      const row = await db.prepare('SELECT total FROM visit_total WHERE id = 1').first<{ total: number }>()
      return row ? reply(200, row) : reply(503, {})
    }
    if (request.headers.get('Content-Type')?.split(';')[0]?.trim() !== 'application/json') return reply(415, {})
    // Bound streamed bodies too, rather than trusting Content-Length.
    const reader = request.body?.getReader()
    if (!reader) return reply(400, {})
    const chunks: Uint8Array[] = []
    let size = 0
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 512) { await reader.cancel(); return reply(413, {}) }
      chunks.push(value)
    }
    let input: { sessionId?: unknown; startedAt?: unknown }
    try { input = JSON.parse(await new Blob(chunks as BlobPart[]).text()) }
    catch { return reply(400, {}) }
    const now = Date.now()
    if (!input || typeof input.sessionId !== 'string' || !UUID.test(input.sessionId)
      || typeof input.startedAt !== 'number' || !Number.isSafeInteger(input.startedAt)
      || input.startedAt > now + 60_000 || input.startedAt <= now - RETENTION_MS) return reply(400, {})
    const results = await db.batch([
      db.prepare('DELETE FROM visit_sessions WHERE session_hash IN (SELECT session_hash FROM visit_sessions WHERE expires_at <= ? ORDER BY expires_at LIMIT 100)').bind(now),
      db.prepare('INSERT INTO visit_sessions (session_hash, expires_at) VALUES (?, ?) ON CONFLICT(session_hash) DO NOTHING')
        .bind(await hash(input.sessionId), input.startedAt + RETENTION_MS),
      db.prepare('SELECT total FROM visit_total WHERE id = 1'),
    ])
    const row = results[2]?.results[0]
    return row ? reply(200, row) : reply(503, {})
  } catch {
    // No session identifiers or database errors are exposed or logged.
    return reply(503, {})
  }
}
