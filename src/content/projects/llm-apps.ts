import type { Project } from '../types'

// Four generative AI applications built alone during the IBM AI Developer certificate
// (guided course projects, public repos on JN13012). Dates from each repository's git history.
const ibmApp = (p: Omit<Project, 'tier' | 'status' | 'tracks' | 'team' | 'context' | 'doNotClaim'>): Project => ({
  tier: 'card',
  status: 'delivered',
  tracks: ['ia'],
  team: { size: 1 },
  context: 'ibm',
  doNotClaim: ['Production use', 'Original research: these are guided course projects'],
  ...p,
})

export const llmApps: Project[] = [
  ibmApp({
    slug: 'rag-pdf-chatbot',
    title: 'RAG PDF Chatbot',
    period: { start: '2026-03', end: '2026-05' },
    summary: {
      fr: 'Chatbot qui répond aux questions sur des CV en PDF : découpage des documents, embeddings stockés dans FAISS et interrogation de Llama 3 via LangChain, conteneurisé avec Docker.',
      en: 'Chatbot answering questions about PDF CVs: document chunking, embeddings stored in FAISS and Llama 3 queried through LangChain, containerised with Docker.',
    },
    stack: ['Python', 'LangChain', 'FAISS', 'Llama 3', 'Flask', 'Docker'],
    links: { github: 'https://github.com/JN13012/RAG-pdf-Chatbot' },
    facts: [],
    scale: { months: 3 },
  }),
  ibmApp({
    slug: 'meeting-companion',
    title: 'Meeting Companion',
    period: { start: '2026-03', end: '2026-03' },
    summary: {
      fr: 'Assistant de réunion : transcription audio avec Whisper, puis résumé, plan d’action et analyse de tonalité avec le modèle Granite d’IBM.',
      en: 'Meeting assistant: audio transcription with Whisper, then summary, action plan and tone analysis with IBM’s Granite model.',
    },
    stack: ['Python', 'Whisper', 'Granite', 'Hugging Face', 'Gradio'],
    links: { github: 'https://github.com/JN13012/Business_AI_Meeting_Companion_STT' },
    facts: [],
    scale: { months: 1 },
  }),
  ibmApp({
    slug: 'career-coach',
    title: 'Career Coach',
    period: { start: '2026-04', end: '2026-04' },
    summary: {
      fr: 'Coach de carrière : optimisation de CV et rédaction de lettres de motivation adaptées à une offre, avec Llama 3.2 sur IBM watsonx.ai.',
      en: 'Career coach: CV optimisation and cover letters tailored to a job offer, with Llama 3.2 on IBM watsonx.ai.',
    },
    stack: ['Python', 'IBM watsonx', 'Llama 3', 'Gradio'],
    links: { github: 'https://github.com/JN13012/AI-Career-Coach' },
    facts: [],
    scale: { months: 1 },
  }),
  ibmApp({
    slug: 'assistant-translator',
    title: 'Assistant Translator',
    period: { start: '2026-03', end: '2026-04' },
    summary: {
      fr: 'Traducteur vocal : la parole est transcrite, traduite par Llama 3.3 via Groq, puis relue à voix haute avec les services Watson.',
      en: 'Voice translator: speech is transcribed, translated by Llama 3.3 through Groq, then read aloud with Watson services.',
    },
    stack: ['Python', 'Groq', 'Llama 3', 'IBM Watson', 'Flask'],
    links: { github: 'https://github.com/JN13012/AI-Assistant-Translator' },
    facts: [],
    scale: { months: 2 },
  }),
]
