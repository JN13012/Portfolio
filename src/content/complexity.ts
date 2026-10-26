// Complexity of each project, 1 to 5, validated by Jérémie (2026-10-24; review in docs/projets-notes.md).
// Note = 1 + technical difficulty (0–2) + real constraints (0–1) + polish (0–1).
// Argos and ZeroDay are rated on their designed scope (validated by Jérémie): their cards still say
// « En cours » and their pages state what exists today.
// `why` is editorial (never displayed): it keeps every note traceable.

export type Complexity = 1 | 2 | 3 | 4 | 5

export const complexity: Record<string, { note: Complexity; why: string }> = {
  blocktrader: { note: 5, why: 'Backtest engine, anti-overfitting protocols, real market data, market observatory; 56 tests, hardened CI' },
  argos: { note: 5, why: 'AI agents for cybersecurity (designed scope); OSINT engine with data provenance and a written legal framework' },
  zeroday: { note: 5, why: 'Professional-grade game aimed at the Play Store (designed scope); in design phase' },
  pentest: { note: 5, why: 'Active Directory and privilege escalation; one authorised client audit; 25 published reports' },
  'salesforce-executor': { note: 5, why: 'Complete internal tool (execution, scheduling, logs), in production at ULIT' },
  'hackathon-citiz': { note: 4, why: 'Regional pedestrian network (16.6 M OSM nodes), 5-minute isochrones, coverage; 2nd place' },
  chatflow: { note: 4, why: 'Real-time web and desktop messaging (Socket.IO, Electron); 110 tests' },
  'ctf-du-site': { note: 4, why: '9 levels in a simulated terminal, played by real visitors' },
  'rag-pdf-chatbot': { note: 3, why: 'Full RAG pipeline (FAISS, LangChain, Llama 3, Docker); guided IBM project' },
  'generateur-otp-rcs': { note: 4, why: '1 + 1 (2FA backend: hashing, rate limiting) + 1 (real sending API, 4-day deadline) + 1 (Swagger, Docker, 3rd place); reviewed 2026-10-25' },
  'time-manager': { note: 4, why: 'Typed API and React front end, 68 tests; same level as ChatFlow (validated by Jérémie, 2026-10-24)' },
  kubernetes: { note: 3, why: 'Multi-node cluster: ingress, secrets, volumes, RBAC, monitoring' },
  vaultborn: { note: 3, why: 'Complete 2D action RPG: 7 classes, worlds, saving, design patterns' },
  'meeting-companion': { note: 2, why: 'Speech-to-text then LLM pipeline; guided IBM project' },
  'assistant-translator': { note: 2, why: 'Speech, translation and synthesis pipeline; guided IBM project' },
  'career-coach': { note: 2, why: 'LLM on watsonx with a Gradio interface; guided IBM project, same level as the other IBM apps (reviewed 2026-10-25)' },
  'ai-voice-assistant': { note: 2, why: 'Voice assistant (Watson, Groq); guided IBM project' },
  'llm-context-wrapper': { note: 2, why: 'Conversation memory around a Transformers model; guided IBM project' },
  bookworm: { note: 3, why: '1 + 1 (NLP pipeline: entities, topics per section, summary) + 0 + 1 (complete CLI, book card); solo and not guided; reviewed 2026-10-25' },
  'argos-security-arena': { note: 2, why: 'Training platform (formerly Atlas Academy), paused' },
  'base-de-connaissance': { note: 2, why: '659 structured Obsidian notes' },
  platino: { note: 2, why: 'Express and PostgreSQL web application' },
  popeye: { note: 2, why: 'Multi-service app with Docker Compose' },
  'my-marvin': { note: 2, why: 'Jenkins configured entirely as code' },
  cyberpong: { note: 1, why: 'Pong game in Python' },
  'unit-converter': { note: 1, why: 'Converter with a Tkinter interface' },
  'smart-fridge': { note: 1, why: 'Project-management project' },
}
