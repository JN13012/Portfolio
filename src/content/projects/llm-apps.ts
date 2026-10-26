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
      fr: 'Un chatbot répond aux questions sur des CV en PDF (découpage des documents, embeddings stockés dans FAISS, Llama 3 interrogé via LangChain), conteneurisé avec Docker.',
      en: 'A chatbot answering questions about PDF CVs (document chunking, embeddings stored in FAISS, Llama 3 queried through LangChain), containerised with Docker.',
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
      fr: 'Un assistant de réunion transcrit l’audio avec Whisper, puis en tire résumé, plan d’action et analyse de tonalité avec le modèle Granite d’IBM.',
      en: 'A meeting assistant that transcribes audio with Whisper, then produces a summary, action plan and tone analysis with IBM’s Granite model.',
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
      fr: 'Un coach de carrière optimise le CV et rédige des lettres de motivation adaptées à une offre, avec Llama 3.2 sur IBM watsonx.ai.',
      en: 'A career coach that optimises CVs and writes cover letters tailored to a job offer, with Llama 3.2 on IBM watsonx.ai.',
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
      fr: 'Un traducteur vocal transcrit la parole, la traduit avec Llama 3.3 via Groq, puis la relit à voix haute avec les services Watson.',
      en: 'A voice translator that transcribes speech, translates it with Llama 3.3 through Groq, then reads it aloud with Watson services.',
    },
    stack: ['Python', 'Groq', 'Llama 3', 'IBM Watson', 'Flask'],
    links: { github: 'https://github.com/JN13012/AI-Assistant-Translator' },
    facts: [],
    scale: { months: 2 },
  }),
]
