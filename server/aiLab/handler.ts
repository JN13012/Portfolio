import { aiLabCurriculum, defenseStages, type DefenseStageId } from '../../src/content/aiLab'
import { askGuard, askModel, type AiBinding, type ChatMessage } from './model'
import { levelOneInstructions } from './prompts'

type Statement = {
  bind(...values: (string | number)[]): Statement
  first<T>(): Promise<T | null>
  run(): Promise<{ meta: { changes: number } }>
  all<T>(): Promise<{ results: T[] }>
}
export type LabEnv = {
  AI?: AiBinding
  LAB_DB?: { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<unknown> }
  LAB_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> }
  LAB_IP_SECRET?: string
}
type Ready = Required<LabEnv>
type Session = { session_hash: string; secret: string; attempts: number }
type StageStatus = 'inactive' | 'passed' | 'blocked' | 'error' | 'not-run'

const OPEN_HOSTS = new Set(['www.jeremie-nagi.workers.dev', 'developpement-www.jeremie-nagi.workers.dev', 'localhost', '127.0.0.1'])
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])
const COOKIE = '__Host-lab_session'
const SESSION_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000
const BUSY_MS = 45_000
const MAX_BODY_BYTES = 16_384
const MAX_PROMPT = 2000
const MAX_HISTORY_ANSWER = 1000
const MAX_HISTORY_CHARS = 4000
const MAX_EXCHANGES = 6
// Measured on 31 October 2026: about 15 neurons for a usual attempt, 80 for the longest one allowed.
export const QUOTAS = { session: 60, ip1h: 30, ip5h: 60, ip24h: 100, neuronsPerDay: 5000, reservedNeurons: 80, validations: 200 } as const
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const REAL_LEVELS: readonly number[] = aiLabCurriculum.flatMap(part => part.levels).filter(level => level.available).map(level => level.id)

const reply = (status: number, body: object, headers: HeadersInit = {}) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
})
const hex = (bytes: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('')
const encoder = new TextEncoder()
const sha256 = async (value: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
const hmac = async (secret: string, value: string) => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)))
}
const randomHex = (size: number) => hex(crypto.getRandomValues(new Uint8Array(size)))
const utcDay = (now: number) => new Date(now).toISOString().slice(0, 10)

/** Unique to the session and the level, created and checked here, never in the build. */
export async function flagFor(secret: string, level: number) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const code = Array.from((await hmac(secret, `flag:${level}`)).slice(0, 12), byte => alphabet[byte % 32]).join('')
  return `FLAG{${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}}`
}

/** A real check on the published answer: the flag's code, forwards or backwards, whatever separates its characters. Other encodings are not recognised. */
export function containsFlag(answer: string, flag: string) {
  const code = flag.slice('FLAG{'.length, -1).replaceAll('-', '')
  const compact = answer.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return compact.includes(code) || compact.includes([...code].reverse().join(''))
}

/** The key changes every day, so yesterday's rows are found with yesterday's key and no clear IP is ever needed. */
const ipHashes = async (request: Request, secret: string, now: number) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'local'
  const [today, yesterday] = await Promise.all([utcDay(now), utcDay(now - SESSION_MS)].map(async day => hex(await hmac(`${secret}:${day}`, ip))))
  return { today: today!, yesterday: yesterday! }
}

const stageTrace = (level: number, ran: Partial<Record<DefenseStageId, StageStatus>>) => defenseStages.map(stage => ({
  stage: stage.id, status: stage.fromLevel > level ? 'inactive' : ran[stage.id] ?? 'not-run',
}))
const sessionHashOf = async (request: Request) => {
  const token = request.headers.get('Cookie')?.split(/;\s*/).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1)
  return token && /^[0-9a-f]{64}$/.test(token) ? sha256(token) : null
}
const readSession = (db: Ready['LAB_DB'], hash: string, now: number) =>
  db.prepare('SELECT session_hash, secret, attempts FROM lab_sessions WHERE session_hash = ? AND expires_at > ?').bind(hash, now).first<Session>()
const completedLevels = async (db: Ready['LAB_DB'], hash: string) =>
  (await db.prepare('SELECT level FROM lab_progress WHERE session_hash = ? ORDER BY level').bind(hash).all<{ level: number }>()).results.map(row => row.level)

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const reader = request.body?.getReader()
  if (!reader) return null
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) { await reader.cancel(); return null }
    chunks.push(value)
  }
  try {
    const parsed: unknown = JSON.parse(await new Blob(chunks as BlobPart[]).text())
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null
  } catch { return null }
}

/** The browser's history is untrusted: only well-formed user and assistant turns are rebuilt, newest first within the bound. */
function rebuildHistory(input: unknown): ChatMessage[] | null {
  if (input === undefined) return []
  if (!Array.isArray(input) || input.length > MAX_EXCHANGES) return null
  const kept: ChatMessage[] = []
  let chars = 0
  for (const exchange of [...input].reverse() as { prompt?: unknown; answer?: unknown }[]) {
    if (typeof exchange?.prompt !== 'string' || typeof exchange.answer !== 'string') return null
    if (exchange.prompt.length > MAX_PROMPT || exchange.answer.length > MAX_HISTORY_ANSWER) return null
    chars += exchange.prompt.length + exchange.answer.length
    if (chars > MAX_HISTORY_CHARS) break
    kept.unshift({ role: 'user', content: exchange.prompt }, { role: 'assistant', content: exchange.answer })
  }
  return kept
}

async function createOrResume(request: Request, env: Ready, now: number) {
  const db = env.LAB_DB
  const hash = await sessionHashOf(request)
  const existing = hash ? await readSession(db, hash, now) : null
  if (existing) return reply(200, { available: true, completed: await completedLevels(db, existing.session_hash), remaining: Math.max(0, QUOTAS.session - existing.attempts) })
  const token = randomHex(32)
  const expires = now + SESSION_MS
  await db.batch([
    db.prepare('DELETE FROM lab_sessions WHERE session_hash IN (SELECT session_hash FROM lab_sessions WHERE expires_at <= ? LIMIT 100)').bind(now),
    db.prepare('DELETE FROM lab_progress WHERE rowid IN (SELECT rowid FROM lab_progress WHERE expires_at <= ? LIMIT 100)').bind(now),
    db.prepare('DELETE FROM lab_requests WHERE rowid IN (SELECT rowid FROM lab_requests WHERE expires_at <= ? LIMIT 200)').bind(now),
    db.prepare('DELETE FROM lab_ip_usage WHERE rowid IN (SELECT rowid FROM lab_ip_usage WHERE hour <= ? LIMIT 200)').bind(Math.floor((now - 2 * SESSION_MS) / HOUR_MS)),
    db.prepare('DELETE FROM lab_budget WHERE day < ?').bind(utcDay(now - 2 * SESSION_MS)),
    db.prepare('INSERT INTO lab_sessions (session_hash, secret, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), randomHex(32), expires),
  ])
  return reply(200, { available: true, completed: [], remaining: QUOTAS.session }, {
    'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${SESSION_MS / 1000}; HttpOnly; Secure; SameSite=Strict`,
  })
}

async function attempt(request: Request, env: Ready, now: number) {
  const db = env.LAB_DB
  const body = await readJson(request)
  const level = body?.level
  const history = rebuildHistory(body?.history)
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
  if (typeof level !== 'number' || !REAL_LEVELS.includes(level) || !history
    || !prompt || prompt.length > MAX_PROMPT || typeof body?.requestId !== 'string' || !UUID.test(body.requestId)) return reply(400, { error: 'request' })
  const hash = await sessionHashOf(request)
  const session = hash ? await readSession(db, hash, now) : null
  if (!session) return reply(401, { error: 'session' })
  const unavailable = (status: number, outcome: string, reason: string, remaining: number) =>
    reply(status, { outcome, reason, remaining, trace: stageTrace(level, {}) })

  const fresh = await db.prepare('INSERT OR IGNORE INTO lab_requests (session_hash, request_id, expires_at) VALUES (?, ?, ?)').bind(session.session_hash, body.requestId, now + SESSION_MS).run()
  if (!fresh.meta.changes) return reply(409, { error: 'duplicate' })

  // Each reservation is one atomic statement, so concurrent attempts cannot overrun a quota.
  const held = await db.prepare('UPDATE lab_sessions SET attempts = attempts + 1, busy_until = ? WHERE session_hash = ? AND expires_at > ? AND busy_until <= ? AND attempts < ? RETURNING attempts')
    .bind(now + BUSY_MS, session.session_hash, now, now, QUOTAS.session).first<{ attempts: number }>()
  const left = Math.max(0, QUOTAS.session - session.attempts)
  if (!held) return unavailable(429, 'quota', session.attempts >= QUOTAS.session ? 'session' : 'busy', left)
  const remaining = Math.max(0, QUOTAS.session - held.attempts)
  const release = (refund: boolean) => db.prepare(`UPDATE lab_sessions SET busy_until = 0${refund ? ', attempts = MAX(0, attempts - 1)' : ''} WHERE session_hash = ?`).bind(session.session_hash).run()

  const ips = await ipHashes(request, env.LAB_IP_SECRET, now)
  const hour = Math.floor(now / HOUR_MS)
  const used = 'SELECT COALESCE(SUM(count), 0) FROM lab_ip_usage WHERE ip_hash IN (?, ?) AND hour > ?'
  const ipHeld = await db.prepare(`INSERT INTO lab_ip_usage (ip_hash, hour, count) SELECT ?, ?, 1 WHERE (${used}) < ? AND (${used}) < ? AND (${used}) < ?
    ON CONFLICT (ip_hash, hour) DO UPDATE SET count = count + 1 RETURNING count`)
    .bind(ips.today, hour, ips.today, ips.yesterday, hour - 1, QUOTAS.ip1h, ips.today, ips.yesterday, hour - 5, QUOTAS.ip5h, ips.today, ips.yesterday, hour - 24, QUOTAS.ip24h).first()
  if (!ipHeld) { await release(true); return unavailable(429, 'quota', 'ip', remaining + 1) }
  const releaseIp = () => db.prepare('UPDATE lab_ip_usage SET count = MAX(0, count - 1) WHERE ip_hash = ? AND hour = ?').bind(ips.today, hour).run()

  const day = utcDay(now)
  const budgetHeld = await db.prepare(`INSERT INTO lab_budget (day, neurons) SELECT ?1, ?2 WHERE ?2 <= ?3
    ON CONFLICT (day) DO UPDATE SET neurons = neurons + ?2 WHERE neurons + ?2 <= ?3 RETURNING neurons`)
    .bind(day, QUOTAS.reservedNeurons, QUOTAS.neuronsPerDay).first()
  if (!budgetHeld) { await Promise.all([release(true), releaseIp()]); return unavailable(503, 'quota', 'budget', remaining + 1) }
  const settleBudget = (spent: number) => db.prepare('UPDATE lab_budget SET neurons = MAX(0, neurons - ?) WHERE day = ?').bind(QUOTAS.reservedNeurons - Math.min(spent, QUOTAS.reservedNeurons), day).run()

  // A provider failure is neither an attack blocked nor a spent attempt.
  const failed = async (ran: Partial<Record<DefenseStageId, StageStatus>>) => {
    await Promise.all([release(true), releaseIp(), settleBudget(0)])
    return reply(200, { outcome: 'error', remaining: remaining + 1, trace: stageTrace(level, ran) })
  }
  const start = { entry: 'passed', instructions: 'passed' } as const
  const flag = await flagFor(session.secret, level)
  const messages: ChatMessage[] = [{ role: 'system', content: levelOneInstructions(flag) }, ...history, { role: 'user', content: prompt }]
  let answer: Awaited<ReturnType<typeof askModel>>
  try { answer = await askModel(env.AI, messages) }
  catch { return failed({ ...start, model: 'error' }) }
  let verdict: Awaited<ReturnType<typeof askGuard>>
  try { verdict = await askGuard(env.AI, prompt, answer.text) }
  catch { return failed({ ...start, model: 'passed', response: 'error' }) }

  // An unknown cost keeps the whole reservation rather than undercounting.
  const spent = answer.neurons === null || verdict.neurons === null ? QUOTAS.reservedNeurons : answer.neurons + verdict.neurons
  await Promise.all([release(false), settleBudget(spent)])
  if (!verdict.allowed) return reply(200, { outcome: 'off-topic', remaining, trace: stageTrace(level, { ...start, model: 'passed', response: 'blocked' }) })
  const revealed = containsFlag(answer.text, flag)
  return reply(200, { outcome: revealed ? 'flag' : 'delivered', answer: answer.text, remaining, trace: stageTrace(level, { ...start, model: 'passed', response: 'passed', flag: revealed ? 'passed' : 'not-run' }) })
}

async function validate(request: Request, env: Ready, now: number) {
  const db = env.LAB_DB
  const body = await readJson(request)
  const level = body?.level
  if (typeof level !== 'number' || !REAL_LEVELS.includes(level) || typeof body?.flag !== 'string' || body.flag.length > 100) return reply(400, { error: 'request' })
  const hash = await sessionHashOf(request)
  const session = hash ? await readSession(db, hash, now) : null
  if (!session) return reply(401, { error: 'session' })
  const allowed = await db.prepare('UPDATE lab_sessions SET validations = validations + 1 WHERE session_hash = ? AND validations < ? RETURNING validations').bind(session.session_hash, QUOTAS.validations).first()
  if (!allowed) return reply(429, { error: 'quota' })
  const correct = body.flag.trim().toUpperCase() === await flagFor(session.secret, level)
  if (correct) await db.prepare('INSERT OR IGNORE INTO lab_progress (session_hash, level, expires_at) VALUES (?, ?, ?)').bind(session.session_hash, level, now + SESSION_MS).run()
  return reply(200, { correct, completed: await completedLevels(db, session.session_hash) })
}

export async function handleLabRequest(request: Request, env: LabEnv, now = Date.now()): Promise<Response> {
  const url = new URL(request.url)
  if (!OPEN_HOSTS.has(url.hostname)) return reply(404, {})
  if (request.method !== 'POST') return reply(405, {}, { Allow: 'POST' })
  const origin = request.headers.get('Origin')
  let originHost = ''
  try { originHost = origin ? new URL(origin).hostname : '' } catch { /* An invalid Origin is refused below. */ }
  const sameSite = originHost === url.hostname || (LOCAL_HOSTS.has(originHost) && LOCAL_HOSTS.has(url.hostname))
  if (!sameSite || request.headers.get('Sec-Fetch-Site') === 'cross-site') return reply(403, {})
  if (request.headers.get('Content-Type')?.split(';')[0]?.trim() !== 'application/json') return reply(415, {})
  if (!env.AI || !env.LAB_DB || !env.LAB_LIMITER || !env.LAB_IP_SECRET) return reply(503, { available: false })
  const ready = env as Ready
  try {
    const { today } = await ipHashes(request, ready.LAB_IP_SECRET, now)
    if (!(await ready.LAB_LIMITER.limit({ key: today })).success) return reply(429, { error: 'rate' })
    if (url.pathname === '/api/lab/session') return await createOrResume(request, ready, now)
    if (url.pathname === '/api/lab/attempt') return await attempt(request, ready, now)
    if (url.pathname === '/api/lab/validate') return await validate(request, ready, now)
    return reply(404, {})
  } catch {
    // Neither prompts nor database errors are exposed or logged.
    return reply(503, { available: false })
  }
}
