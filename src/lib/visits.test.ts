import { describe, expect, it, vi } from 'vitest'
import { createVisitClient } from './visits'
const storage = () => {
  const values = new Map<string, string>()
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
}
describe('visit session client', () => {
  it('shares one request across StrictMode mounts and keeps the identifier after reload', async () => {
    const saved = storage()
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ total: 1 }))
    const load = createVisitClient(saved, send)
    expect(await Promise.all([load(), load()])).toEqual([1, 1])
    expect(send).toHaveBeenCalledTimes(1)
    const first = send.mock.calls[0]?.[1]?.body
    send.mockResolvedValue(Response.json({ total: 1 }))
    await createVisitClient(saved, send)()
    expect(send.mock.calls[1]?.[1]?.body).toBe(first)
  })
  it('retries the same identifier after a lost response and a reload', async () => {
    const saved = storage()
    const send = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(Response.json({ total: 2 }))
    expect(await createVisitClient(saved, send)()).toBeNull()
    expect(await createVisitClient(saved, send)()).toBe(2)
    expect(send.mock.calls[0]?.[1]?.body).toBe(send.mock.calls[1]?.[1]?.body)
  })
  it('reads without counting when storage cannot persist the session', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ total: 10 }))
    expect(await createVisitClient({ getItem: () => null, setItem: () => { throw Error() } }, send)()).toBe(10)
    expect(send.mock.calls[0]?.[1]?.method).toBeUndefined()
  })
  it('does not recount or renew an expired session', async () => {
    const saved = storage()
    const session = JSON.stringify({ sessionId: crypto.randomUUID(), startedAt: 1 })
    saved.setItem('portfolio-visit-session', session)
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ total: 10 }))
    await createVisitClient(saved, send)()
    expect(send.mock.calls[0]?.[1]?.method).toBeUndefined()
    expect(saved.getItem('portfolio-visit-session')).toBe(session)
  })
  it('returns a neutral value for errors or invalid totals', async () => {
    for (const response of [Response.json({}, { status: 503 }), Response.json({ total: -1 }), Response.json({ total: '12' }), new Response('<html>')]) {
      expect(await createVisitClient(storage(), vi.fn<typeof fetch>().mockResolvedValue(response))()).toBeNull()
    }
  })
})
