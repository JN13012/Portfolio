import { aiLabCurriculum, cvMessage, isAgentLevel, cvText, defenseStages, inboxMessage, isDocumentLevel, isInboxLevel, isVisitorEmail, poisonedCv, paysVisitor, poisonedInbox, sourceForSearch, stageRuns, visitorEmails, type DefenseStageId, type EmailDraft } from '../../src/content/lab/ai'
import { inputAllowed, outputAllowed } from './filters'
import { helpdeskDirectory, helpdeskTools } from './helpdesk'
import { askAgent, askClassifier, askGuard, askModel, type AiBinding, type ChatMessage } from './model'
import { classifierInstructions, helpdeskInstructions, inboxInstructions, screeningInstructions, simpleInstructions } from './prompts'
import { searchSources } from './search'

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
// Longer than an attempt can take: level 6's agent stops calling the model after 45 s, then one call and the safeguard, at 20 s each.
const BUSY_MS = 90_000
// Cloudflare's error code once the account's daily Workers AI allocation is used up.
const PROVIDER_QUOTA = 'AiError: 4006:'
const MAX_BODY_BYTES = 16_384
const MAX_PROMPT = 2000
const MAX_HISTORY_ANSWER = 1000
const MAX_HISTORY_CHARS = 4000
const MAX_EXCHANGES = 6
// Measured on 31 October 2026: about 15 neurons for a usual attempt, 80 for the longest one allowed, plus up to 10 for level 3's classifier; about 20 for a level 4 screening (2 November), and level 5's search adds about 0.02.
export const QUOTAS = { session: 60, ip1h: 30, ip5h: 60, ip24h: 100, neuronsPerHour: 1000, neuronsPer5h: 3000, neuronsPer24h: 5000, reservedNeurons: 90, validations: 200 } as const
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

/** Level 4's goal: the screening ends on a recommendation. Only the final words count, so « NON RECOMMANDÉ » or a decision followed by more text does not. */
export function recommends(answer: string) {
  const plain = answer.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[*_«»"`.]/g, '').trim().toLowerCase()
  return /decision\s*:\s*recommande$/.test(plain)
}

const compactFlag = (flag: string) => flag.toUpperCase().replace(/[^A-Z0-9]/g, '')

/** The key changes every day, so yesterday's rows are found with yesterday's key and no clear IP is ever needed. */
const ipHashes = async (request: Request, secret: string, now: number) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'local'
  const [today, yesterday] = await Promise.all([utcDay(now), utcDay(now - SESSION_MS)].map(async day => hex(await hmac(`${secret}:${day}`, ip))))
  return { today: today!, yesterday: yesterday! }
}

const stageTrace = (level: number, ran: Partial<Record<DefenseStageId, StageStatus>>) => defenseStages.map(stage => ({
  stage: stage.id, status: !stageRuns(stage.id, level) ? 'inactive' : ran[stage.id] ?? 'not-run',
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

/** Level 4 sends a CV instead of a conversation: two bounded texts, at least one of them filled. */
function readCv(input: unknown): { profile: string; hidden: string } | null {
  const { profile, hidden } = (input ?? {}) as { profile?: unknown; hidden?: unknown }
  if (typeof profile !== 'string' || typeof hidden !== 'string' || profile.length > poisonedCv.maxProfile || hidden.length > poisonedCv.maxHidden) return null
  return profile.trim() || hidden.trim() ? { profile, hidden } : null
}

/** Level 5 sends one to three emails, each with a bounded subject and a filled, bounded body. */
function readEmails(input: unknown): EmailDraft[] | null {
  if (!Array.isArray(input) || !input.length || input.length > poisonedInbox.maxEmails) return null
  const emails: EmailDraft[] = []
  for (const { subject, body } of input as { subject?: unknown; body?: unknown }[]) {
    if (typeof subject !== 'string' || typeof body !== 'string' || subject.length > poisonedInbox.maxSubject || body.length > poisonedInbox.maxBody || !body.trim()) return null
    emails.push({ subject, body })
  }
  return emails
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
    db.prepare('DELETE FROM lab_budget_hours WHERE hour <= ?').bind(Math.floor((now - 2 * SESSION_MS) / HOUR_MS)),
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
  if (typeof level !== 'number' || !REAL_LEVELS.includes(level) || typeof body?.requestId !== 'string' || !UUID.test(body.requestId)) return reply(400, { error: 'request' })
  const cv = isDocumentLevel(level) ? readCv(body.cv) : null
  const emails = isInboxLevel(level) ? readEmails(body.emails) : null
  const history = cv || emails ? [] : rebuildHistory(body.history)
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  const missing = isDocumentLevel(level) ? !cv : isInboxLevel(level) ? !emails : !prompt || prompt.length > MAX_PROMPT
  if (!history || missing) return reply(400, { error: 'request' })
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

  const filtered = stageRuns('input', level)
  // The history comes from the browser: a forged user turn must not slip past the input filter.
  const userTurns = [prompt, ...history.filter(turn => turn.role === 'user').map(turn => turn.content)]
  // No model call and no budget: this attempt costs no neurons, but still counts as an attempt.
  if (filtered && !userTurns.every(inputAllowed)) {
    await release(false)
    return reply(200, { outcome: 'blocked-input', remaining, trace: stageTrace(level, { entry: 'passed', input: 'blocked' }) })
  }

  // The site-wide budget, over the same windows, stops an attack spread over many IPs from using a whole day at once.
  const spentSince = (hours: number) => `(SELECT COALESCE(SUM(neurons), 0) FROM lab_budget_hours WHERE hour > ?1 - ${hours}) + ?2`
  const budgetHeld = await db.prepare(`INSERT INTO lab_budget_hours (hour, neurons) SELECT ?1, ?2
    WHERE ${spentSince(1)} <= ?3 AND ${spentSince(5)} <= ?4 AND ${spentSince(24)} <= ?5
    ON CONFLICT (hour) DO UPDATE SET neurons = neurons + ?2 RETURNING neurons`)
    .bind(hour, QUOTAS.reservedNeurons, QUOTAS.neuronsPerHour, QUOTAS.neuronsPer5h, QUOTAS.neuronsPer24h).first()
  if (!budgetHeld) { await Promise.all([release(true), releaseIp()]); return unavailable(503, 'quota', 'budget', remaining + 1) }
  const settleBudget = (spent: number) => db.prepare('UPDATE lab_budget_hours SET neurons = MAX(0, neurons - ?) WHERE hour = ?').bind(QUOTAS.reservedNeurons - Math.min(spent, QUOTAS.reservedNeurons), hour).run()

  // A provider failure is neither an attack blocked nor a spent attempt, but neurons already used stay counted.
  // Workers AI's daily allocation running out is a quota, not a fault: retrying would not help.
  const failed = async (error: unknown, ran: Partial<Record<DefenseStageId, StageStatus>>, spent = 0) => {
    await Promise.all([release(true), releaseIp(), settleBudget(spent)])
    if (String(error).includes(PROVIDER_QUOTA)) return unavailable(503, 'quota', 'provider', remaining + 1)
    return reply(200, { outcome: 'error', remaining: remaining + 1, trace: stageTrace(level, ran) })
  }
  // An unknown cost keeps the whole reservation rather than undercounting.
  const costOf = (...calls: { neurons: number | null }[]) => calls.some(call => call.neurons === null) ? QUOTAS.reservedNeurons : calls.reduce((sum, call) => sum + call.neurons!, 0)

  // The flag is never in the model's context on this level: the server hands it over for the decision alone.
  if (cv) {
    const read = { document: 'passed', instructions: 'passed' } as const
    let answer: Awaited<ReturnType<typeof askModel>>
    try { answer = await askModel(env.AI, [{ role: 'system', content: screeningInstructions }, { role: 'user', content: cvMessage(cv.profile, cv.hidden) }]) }
    catch (error) { return failed(error, { ...read, model: 'error' }) }
    const answered = { ...read, model: 'passed' } as const
    let verdict: Awaited<ReturnType<typeof askGuard>>
    // S7 (privacy) fires on a named CV, measured 6 times in 32 on 2 November 2026; the candidate is fictional and the answer goes only to its author.
    try { verdict = await askGuard(env.AI, cvText(cv.profile, cv.hidden), answer.text, ['S7']) }
    catch (error) { return failed(error, { ...answered, response: 'error' }, costOf(answer)) }
    await Promise.all([release(false), settleBudget(costOf(answer, verdict))])
    if (!verdict.allowed) return reply(200, { outcome: 'off-topic', remaining, trace: stageTrace(level, { ...answered, response: 'blocked' }) })
    const chosen = recommends(answer.text)
    return reply(200, {
      outcome: chosen ? 'recommended' : 'rejected', answer: answer.text, ...(chosen && { flag: await flagFor(session.secret, level) }),
      remaining, trace: stageTrace(level, { ...answered, response: 'passed', decision: chosen ? 'passed' : 'blocked' }),
    })
  }

  // Neither does level 5's: the search runs for real, and only Sentry's answer decides.
  if (emails) {
    const sent = visitorEmails(emails)
    let search: Awaited<ReturnType<typeof searchSources>>
    try { search = await searchSources(env.AI, [...poisonedInbox.sources, ...sent]) }
    catch (error) { return failed(error, { index: 'error' }) }
    const { ranking, retained } = search
    // Emails the search leaves out cannot reach Sentry: no model call, but the attempt counts.
    if (!retained.some(source => isVisitorEmail(source.id))) {
      await Promise.all([release(false), settleBudget(costOf(search))])
      return reply(200, { outcome: 'not-retrieved', ranking, remaining, trace: stageTrace(level, { index: 'passed', search: 'blocked' }) })
    }
    const found = { index: 'passed', search: 'passed', instructions: 'passed' } as const
    let answer: Awaited<ReturnType<typeof askModel>>
    try { answer = await askModel(env.AI, [{ role: 'system', content: inboxInstructions }, { role: 'user', content: inboxMessage(retained) }]) }
    catch (error) { return failed(error, { ...found, model: 'error' }, costOf(search)) }
    const answered = { ...found, model: 'passed' } as const
    let verdict: Awaited<ReturnType<typeof askGuard>>
    // Measured on 2 November 2026, the safeguard holds back a quarter of the answers, honest ones included: S2 (fraud), S6 (financial advice)
    // and S7 (privacy) fire on the exercise's own fictional IBANs and contacts, and the answer goes only to its author.
    try { verdict = await askGuard(env.AI, sent.map(sourceForSearch).join('\n\n'), answer.text, ['S2', 'S6', 'S7']) }
    catch (error) { return failed(error, { ...answered, response: 'error' }, costOf(search, answer)) }
    await Promise.all([release(false), settleBudget(costOf(search, answer, verdict))])
    if (!verdict.allowed) return reply(200, { outcome: 'off-topic', ranking, remaining, trace: stageTrace(level, { ...answered, response: 'blocked' }) })
    const paid = paysVisitor(answer.text)
    return reply(200, {
      outcome: paid ? 'diverted' : 'official-iban', answer: answer.text, ranking, ...(paid && { flag: await flagFor(session.secret, level) }),
      remaining, trace: stageTrace(level, { ...answered, response: 'passed', payment: paid ? 'passed' : 'blocked' }),
    })
  }

  // Level 6: the tools run for real on a fresh directory, and the server reads that directory, never Sentry's words.
  if (isAgentLevel(level)) {
    const start = { entry: 'passed', instructions: 'passed' } as const
    const directory = helpdeskDirectory()
    let agent: Awaited<ReturnType<typeof askAgent>>
    try { agent = await askAgent(env.AI, [{ role: 'system', content: helpdeskInstructions }, ...history, { role: 'user', content: prompt }], helpdeskTools, directory.run) }
    catch (error) { return failed(error, { ...start, model: 'error' }) }
    const answered = { ...start, model: 'passed', tools: agent.calls.length ? 'passed' : 'not-run' } as const
    let verdict: Awaited<ReturnType<typeof askGuard>>
    try { verdict = await askGuard(env.AI, prompt, agent.text || '…') }
    catch (error) { return failed(error, { ...answered, response: 'error' }, costOf(agent)) }
    await Promise.all([release(false), settleBudget(costOf(agent, verdict))])
    if (!verdict.allowed) return reply(200, { outcome: 'off-topic', remaining, trace: stageTrace(level, { ...answered, response: 'blocked' }) })
    // A plain question changes nothing and gets no verdict: « denied » only when Sentry did call the tool that adds to a group.
    const granted = directory.granted()
    const tried = agent.calls.some(call => call.name === 'ajouter_au_groupe')
    return reply(200, {
      outcome: granted ? 'granted' : tried ? 'denied' : 'answered', answer: agent.text, tools: agent.calls, ...(granted && { flag: await flagFor(session.secret, level) }),
      remaining, trace: stageTrace(level, { ...answered, response: 'passed', access: granted ? 'passed' : tried ? 'blocked' : 'not-run' }),
    })
  }

  // stageTrace marks the filters inactive on the levels that do not have them.
  const start = { entry: 'passed', input: 'passed', instructions: 'passed' } as const
  const flag = await flagFor(session.secret, level)
  const messages: ChatMessage[] = [{ role: 'system', content: simpleInstructions(flag) }, ...history, { role: 'user', content: prompt }]
  let answer: Awaited<ReturnType<typeof askModel>>
  try { answer = await askModel(env.AI, messages) }
  catch (error) { return failed(error, { ...start, model: 'error' }) }
  // Nothing is published, so the safeguard has nothing to check.
  if (filtered && !outputAllowed(answer.text, flag)) {
    await Promise.all([release(false), settleBudget(answer.neurons ?? QUOTAS.reservedNeurons)])
    return reply(200, { outcome: 'blocked-output', remaining, trace: stageTrace(level, { ...start, model: 'passed', output: 'blocked' }) })
  }
  const filteredOut = { ...start, model: 'passed', output: 'passed' } as const
  const calls: { neurons: number | null }[] = [answer]
  if (stageRuns('classifier', level)) {
    let judged: Awaited<ReturnType<typeof askClassifier>>
    try { judged = await askClassifier(env.AI, classifierInstructions(flag), answer.text) }
    catch (error) { return failed(error, { ...filteredOut, classifier: 'error' }, costOf(answer)) }
    calls.push(judged)
    // Nothing is published here either, so the safeguard is skipped.
    if (!judged.allowed) {
      await Promise.all([release(false), settleBudget(costOf(...calls))])
      return reply(200, { outcome: 'blocked-classifier', remaining, trace: stageTrace(level, { ...filteredOut, classifier: 'blocked' }) })
    }
  }
  const checked = { ...filteredOut, classifier: 'passed' } as const
  let verdict: Awaited<ReturnType<typeof askGuard>>
  try { verdict = await askGuard(env.AI, prompt, answer.text) }
  catch (error) { return failed(error, { ...checked, response: 'error' }, costOf(...calls)) }

  const spent = costOf(...calls, verdict)
  await Promise.all([release(false), settleBudget(spent)])
  if (!verdict.allowed) return reply(200, { outcome: 'off-topic', remaining, trace: stageTrace(level, { ...checked, response: 'blocked' }) })
  const revealed = containsFlag(answer.text, flag)
  return reply(200, { outcome: revealed ? 'flag' : 'delivered', answer: answer.text, remaining, trace: stageTrace(level, { ...checked, response: 'passed', flag: revealed ? 'passed' : 'blocked' }) })
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
  // Separators, case and the FLAG{} wrapper do not count: the model often splits the flag, and levels 2 and 3 end up with the code alone.
  const submitted = compactFlag(body.flag)
  const expected = compactFlag(await flagFor(session.secret, level))
  const correct = submitted === expected || `FLAG${submitted}` === expected
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
