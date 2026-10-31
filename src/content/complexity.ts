// Complexity of each project, 1 to 5, validated by Jérémie (2026-10-24; review in docs/projets-notes.md).
// Note = 1 + technical difficulty (0–2) + real constraints (0–1) + polish (0–1).
// Never displayed (display tried and removed on 2026-10-26): notes only drive the « Plus complexes » sort.
// Argos is rated on its designed scope (Jérémie's choice); its page states what exists today.
// `why` is editorial (never displayed): it keeps every note traceable.

type Complexity = 1 | 2 | 3 | 4 | 5

export const complexity: Record<string, { note: Complexity; why: string }> = {
  blocktrader: { note: 5, why: 'Backtest engine, anti-overfitting protocols, real market data, market observatory; 56 tests, hardened CI' },
  argos: { note: 5, why: 'Designed scope: an AI pentest and defence agent platform on the level of Strix, Pentera or NodeZero (Jérémie, 2026-10-26); today only the SIRENE discovery exists' },
  zeroday: { note: 3, why: 'What exists: deterministic Unity core with tests, a hand-written tree editor, ~141,000 words of frozen game design; not playable yet' },
  // Split from « pentest » on 2026-10-26; notes validated by Jérémie the same day.
  pentest: { note: 4, why: 'Active Directory (Kerberos delegation, kerberoasting) and privilege escalation; 25 published reports' },
  'audit-web': { note: 4, why: '1 + 1 (standard tooling, black-box, no finding) + 1 (real client behind a WAF) + 1 (technical report); still above the CTF (Jérémie, 2026-10-26)' },
  'salesforce-executor': { note: 5, why: 'Complete internal tool (execution, scheduling, logs), in production at ULIT' },
  'hackathon-citiz': { note: 4, why: 'Regional pedestrian network (16.6 M OSM nodes), 5-minute isochrones, coverage; 2nd place' },
  chatflow: { note: 4, why: 'Real-time web and desktop messaging (Socket.IO, Electron); 110 tests' },
  'ctf-du-site': { note: 3, why: '9 levels in a simulated terminal, played by real visitors; easier than the audit (Jérémie, 2026-10-26)' },
  'rag-pdf-chatbot': { note: 3, why: 'Full RAG pipeline (FAISS, LangChain, Llama 3, Docker); guided IBM project' },
  'generateur-otp-rcs': { note: 4, why: '1 + 1 (2FA backend: hashing, rate limiting) + 1 (real sending API, 4-day deadline) + 1 (Swagger, Docker, 4th place); reviewed 2026-10-25, ranking corrected 2026-10-28' },
  'time-manager': { note: 4, why: 'Typed API and React front end, 68 tests; same level as ChatFlow (validated by Jérémie, 2026-10-24)' },
  kubernetes: { note: 3, why: 'Multi-node cluster: ingress, secrets, volumes, RBAC, monitoring' },
  vaultborn: { note: 3, why: 'Complete 2D action RPG: 7 classes, worlds, saving, design patterns' },
  'meeting-companion': { note: 2, why: 'Speech-to-text then LLM pipeline; guided IBM project' },
  'assistant-translator': { note: 2, why: 'Speech, translation and synthesis pipeline; guided IBM project' },
  'career-coach': { note: 2, why: 'LLM on watsonx with a Gradio interface; guided IBM project, same level as the other IBM apps (reviewed 2026-10-25)' },
  'ai-voice-assistant': { note: 2, why: 'Voice assistant (Watson, Groq); guided IBM project' },
  'llm-context-wrapper': { note: 2, why: 'Conversation memory around a Transformers model; guided IBM project' },
  bookworm: { note: 3, why: '1 + 1 (NLP pipeline: entities, topics per section, summary) + 0 + 1 (complete CLI, book card); solo and not guided; reviewed 2026-10-25' },
  'argos-security-arena': { note: 4, why: 'Front-only training platform: curriculum model (areas, paths, modules, rooms), unlock rules, points and ranks, 31 tests, backend plan written; paused (set to 4 by Jérémie, 2026-10-26)' },
  'base-de-connaissance': { note: 2, why: '659 structured Obsidian notes' },
  platino: { note: 2, why: 'Express and PostgreSQL web application' },
  popeye: { note: 2, why: 'Multi-service app with Docker Compose' },
  'my-marvin': { note: 2, why: 'Jenkins configured entirely as code' },
  // Proposed on 2026-10-31, to validate with Jérémie.
  chronox: { note: 3, why: '1 + 1 (native Win32 and Direct2D, session events, DST, crash recovery) + 0 + 1 (automated tests, Windows CI, measured performance)' },
  'maria-agent': { note: 2, why: '1 + 1 (typed Rust API and React front end) + 0 + 0; the studio is simulated, 11 integration tests' },
  cyberpong: { note: 1, why: 'Pong game in Python' },
  'unit-converter': { note: 1, why: 'Converter with a Tkinter interface' },
  'smart-fridge': { note: 1, why: 'Project-management project' },
}
