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
    tagline: {
      fr: 'Chatbot RAG qui répond aux questions sur des CV en PDF, avec Llama 3.',
      en: 'A RAG chatbot answering questions about PDF CVs, with Llama 3.',
    },
    summary: {
      fr: 'Un chatbot qui analyse des CV et des lettres de motivation en PDF et répond à des questions précises, grâce au RAG.',
      en: 'A chatbot that reads PDF CVs and cover letters and answers precise questions, using RAG.',
    },
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Fonctionnement', en: 'How it works' },
        points: [
          { label: { fr: 'Chargement', en: 'Loading' }, text: { fr: 'le PDF est lu puis découpé en morceaux.', en: 'the PDF is read, then split into chunks.' } },
          { label: { fr: 'Indexation', en: 'Indexing' }, text: { fr: 'embeddings Hugging Face, stockés dans FAISS.', en: 'Hugging Face embeddings, stored in FAISS.' } },
          { label: { fr: 'Réponse', en: 'Answer' }, text: { fr: 'les passages utiles partent à Llama 3.3 sur watsonx.ai, via LangChain.', en: 'the relevant passages go to Llama 3.3 on watsonx.ai, through LangChain.' } },
          { label: { fr: 'Interface', en: 'Interface' }, text: { fr: 'une page Flask pour déposer le PDF et poser ses questions.', en: 'a Flask page to upload the PDF and ask questions.' } },
        ],
      },
    ],
    // No Dockerfile in the repo (checked 2026-10-26): Docker removed.
    stack: ['Python', 'LangChain', 'FAISS', 'Hugging Face', 'watsonx', 'Llama 3', 'Flask'],
    links: { github: 'https://github.com/JN13012/RAG-pdf-Chatbot' },
    facts: [],
    scale: { months: 3 },
  }),
  ibmApp({
    slug: 'meeting-companion',
    title: 'Meeting Companion',
    period: { start: '2026-03', end: '2026-03' },
    tagline: {
      fr: 'Transcrit une réunion, puis en tire résumé, actions et tonalité.',
      en: 'Transcribes a meeting, then draws a summary, actions and tone from it.',
    },
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
    tagline: {
      fr: 'Coach de carrière IA : optimise le CV, rédige la lettre, conseille.',
      en: 'An AI career coach: optimises the CV, writes the letter, gives advice.',
    },
    summary: {
      fr: 'Un coach de carrière IA en trois onglets : adapter son CV à une offre, rédiger la lettre de motivation et répondre aux questions de carrière.',
    },
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Modèle' },
        body: { fr: 'Llama 3.2 sur IBM watsonx.ai, interface Gradio.' },
      },
    ],
    stack: ['Python', 'IBM watsonx', 'Llama 3', 'Gradio'],
    links: { github: 'https://github.com/JN13012/AI-Career-Coach' },
    facts: [],
    scale: { months: 1 },
  }),
  ibmApp({
    slug: 'assistant-translator',
    title: 'Assistant Translator',
    period: { start: '2026-03', end: '2026-04' },
    tagline: {
      fr: 'Traducteur vocal : parler, traduire avec Llama 3.3, réécouter.',
      en: 'A voice translator: speak, translate with Llama 3.3, listen back.',
    },
    summary: {
      fr: 'Un traducteur vocal : IBM Watson transcrit la parole, Llama 3.3 la traduit via Groq, puis Watson lit la traduction à voix haute.',
    },
    stack: ['Python', 'Groq', 'Llama 3', 'IBM Watson', 'Flask'],
    links: { github: 'https://github.com/JN13012/AI-Assistant-Translator' },
    facts: [],
    scale: { months: 2 },
  }),
]
