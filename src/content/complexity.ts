// Complexity of each project, 1 to 5, validated by Jérémie (2026-10-24; review in docs/projets-notes.md).
// Note = 1 + technical difficulty (0–2) + real constraints (0–1) + polish (0–1).
// Argos and ZeroDay are rated on their designed scope (validated by Jérémie): their cards still say
// « En cours » and their pages state what exists today.
// `why` is editorial (never displayed): it keeps every note traceable.

export type Complexity = 1 | 2 | 3 | 4 | 5

export const complexity: Record<string, { note: Complexity; why: string }> = {
  blocktrader: { note: 5, why: 'Backtest engine, anti-overfitting protocols, real market data; 46 tests, hardened CI' },
  argos: { note: 5, why: 'AI agents for cybersecurity (designed scope); OSINT engine with data provenance and a written legal framework' },
  zeroday: { note: 5, why: 'Professional-grade game aimed at the Play Store (designed scope); in design phase' },
  pentest: { note: 5, why: 'Active Directory and privilege escalation; one authorised client audit; 25 published reports' },
  'salesforce-executor': { note: 5, why: 'Complete internal tool (execution, scheduling, logs), in production at ULIT' },
  chatflow: { note: 4, why: 'Real-time web and desktop messaging (Socket.IO, Electron); 110 tests' },
  'ctf-du-site': { note: 4, why: '9 levels in a simulated terminal, played by real visitors' },
  'rag-pdf-chatbot': { note: 3, why: 'Full RAG pipeline (FAISS, LangChain, Llama 3, Docker); guided IBM project' },
  'generateur-otp-rcs': { note: 3, why: 'Two-factor authentication through a real sending API (hackathon)' },
  'time-manager': { note: 3, why: 'Typed API and React front end; 68 tests' },
  kubernetes: { note: 3, why: 'Multi-node cluster: ingress, secrets, volumes, RBAC, monitoring' },
  vaultborn: { note: 3, why: 'Complete 2D action RPG: 7 classes, worlds, saving, design patterns' },
  'meeting-companion': { note: 2, why: 'Speech-to-text then LLM pipeline; guided IBM project' },
  'assistant-translator': { note: 2, why: 'Speech, translation and synthesis pipeline; guided IBM project' },
  'career-coach': { note: 2, why: 'LLM on watsonx with a Gradio interface; guided IBM project' },
  'ai-voice-assistant': { note: 2, why: 'Voice assistant (Watson, Groq); guided IBM project' },
  'llm-context-wrapper': { note: 2, why: 'Conversation memory around a Transformers model; guided IBM project' },
  bookworm: { note: 2, why: 'Book analysis with spaCy' },
  'atlas-academy': { note: 2, why: 'Learning platform, paused' },
  'base-de-connaissance': { note: 2, why: '659 structured Obsidian notes' },
  platino: { note: 2, why: 'Express and PostgreSQL web application' },
  popeye: { note: 2, why: 'Multi-service app with Docker Compose' },
  'my-marvin': { note: 2, why: 'Jenkins configured entirely as code' },
  cyberpong: { note: 1, why: 'Pong game in Python' },
  'unit-converter': { note: 1, why: 'Converter with a Tkinter interface' },
  'smart-fridge': { note: 1, why: 'Project-management project' },
}
