import { describe, expect, it, vi } from 'vitest'
import { handleVisitsRequest } from './visits'
const valid = { sessionId: 'b4d49582-dbdc-41da-8a29-9856d2cc855d', startedAt: Date.now() }
const post = (body: unknown = valid, headers = {}) => new Request('https://site.test/api/visits', {
  method: 'POST', headers: { Origin: 'https://site.test', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
})
const environment = () => {
  const statement = { bind: vi.fn(), first: vi.fn().mockResolvedValue({ total: 4 }) }
  statement.bind.mockReturnValue(statement)
  return {
    VISITS_DB: { prepare: vi.fn().mockReturnValue(statement), batch: vi.fn().mockResolvedValue([{ results: [] }, { results: [] }, { results: [{ total: 5 }] }]) },
    VISITS_LIMITER: { limit: vi.fn().mockResolvedValue({ success: true }) },
  }
}
describe('visits API', () => {
  it('reads the total without writing, never caching it', async () => {
    const env = environment()
    const response = await handleVisitsRequest(new Request('https://site.test/api/visits'), env)
    expect(await response.json()).toEqual({ total: 4 })
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(env.VISITS_DB.batch).not.toHaveBeenCalled()
  })
  it('hashes session identifiers, bounds cleanup and uses one atomic batch', async () => {
    const env = environment()
    const response = await handleVisitsRequest(post(), env)
    expect(await response.json()).toEqual({ total: 5 })
    expect(env.VISITS_DB.batch).toHaveBeenCalledTimes(1)
    expect(env.VISITS_DB.prepare.mock.calls.some(([sql]) => sql.includes('LIMIT 100'))).toBe(true)
    const statement = env.VISITS_DB.prepare.mock.results[0]?.value
    const sessionHash = statement.bind.mock.calls[1]?.[0]
    expect(sessionHash).toMatch(/^[0-9a-f]{64}$/)
    expect(sessionHash).not.toBe(valid.sessionId)
  })
  it('rejects cross-origin, missing-origin and unsupported requests before D1', async () => {
    const env = environment()
    for (const request of [post(valid, { Origin: 'https://evil.test' }), new Request('https://site.test/api/visits', { method: 'POST' }), new Request('https://site.test/api/visits', { method: 'DELETE' })]) {
      expect([403, 405]).toContain((await handleVisitsRequest(request, env)).status)
    }
    expect(env.VISITS_DB.prepare).not.toHaveBeenCalled()
  })
  it('validates timestamps, identifiers, body size and content type', async () => {
    const env = environment()
    for (const body of [null, {}, { ...valid, sessionId: 'bad' }, { ...valid, startedAt: 1 }, { ...valid, startedAt: Date.now() + 120_000 }]) {
      expect((await handleVisitsRequest(post(body), env)).status).toBe(400)
    }
    expect((await handleVisitsRequest(post('x'.repeat(600)), env)).status).toBe(413)
    expect((await handleVisitsRequest(post(valid, { 'Content-Type': 'text/plain' }), env)).status).toBe(415)
    expect(env.VISITS_DB.batch).not.toHaveBeenCalled()
  })
  it('rate-limits before database work and returns neutral errors without a binding', async () => {
    const env = environment()
    env.VISITS_LIMITER.limit.mockResolvedValue({ success: false })
    expect((await handleVisitsRequest(post(), env)).status).toBe(429)
    expect(env.VISITS_DB.prepare).not.toHaveBeenCalled()
    expect((await handleVisitsRequest(post(), {})).status).toBe(503)
  })
  it('hides database failures', async () => {
    const env = environment()
    env.VISITS_DB.batch.mockRejectedValue(new Error('private database detail'))
    const response = await handleVisitsRequest(post(), env)
    expect(response.status).toBe(503)
    expect(await response.text()).toBe('{}')
  })
})
