import type { Project } from '../types'

// Four applications built during the IBM AI Developer certificate (public repos, JN13012).
export const llmApps: Project = {
  slug: 'applications-llm',
  tier: 'dossier',
  status: 'delivered',
  tracks: ['ia'],
  title: 'Applications LLM',
  period: { start: '2026-03', end: '2026-05' },
  team: { size: 1 },
  context: 'ibm',
  summary: {
    fr: 'Quatre applications d’IA générative réalisées pendant le certificat IBM AI Developer : un chatbot RAG sur des CV, un compagnon de réunion, un coach de carrière et un traducteur vocal.',
    en: 'Four generative AI applications built during the IBM AI Developer certificate: a RAG chatbot over CVs, a meeting companion, a career coach and a voice translator.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Les quatre applications', en: 'The four applications' },
      body: {
        fr: 'RAG PDF Chatbot : analyse de CV, découpage des PDF, embeddings stockés dans FAISS et interrogation de Llama 3 via LangChain, conteneurisé avec Docker. Meeting Companion : transcription avec Whisper puis résumé, plan d’action et analyse de tonalité avec Granite (IBM), traitement par lots sur GPU. Career Coach : optimisation de CV et lettres de motivation avec Llama 3.2 sur watsonx.ai, interface Gradio. Assistant Translator : traduction vocale avec Llama 3.3 (Groq) et les services Watson de transcription et de synthèse.',
        en: 'RAG PDF Chatbot: CV analysis, PDF chunking, embeddings stored in FAISS and Llama 3 queried through LangChain, containerised with Docker. Meeting Companion: Whisper transcription, then summary, action plan and tone analysis with IBM Granite, batched GPU processing. Career Coach: CV optimisation and cover letters with Llama 3.2 on watsonx.ai, Gradio interface. Assistant Translator: voice translation with Llama 3.3 (Groq) and Watson speech-to-text and text-to-speech.',
      },
    },
    {
      kind: 'limits',
      title: { fr: 'Le contexte', en: 'Context' },
      body: {
        fr: 'Projets encadrés du parcours IBM, réalisés seul. Ils montrent la maîtrise des briques (RAG, voix, orchestration) ; l’agent RAG du portfolio prendra le relais en V2.',
        en: 'Guided projects from the IBM programme, built alone. They show command of the building blocks (RAG, speech, orchestration); the portfolio’s own RAG agent will take over in V2.',
      },
    },
  ],
  stack: ['Python', 'LangChain', 'FAISS', 'Llama 3', 'IBM watsonx', 'Whisper', 'Granite', 'Groq', 'Flask', 'Gradio', 'Docker'],
  links: {
    repos: [
      { label: 'RAG PDF Chatbot', url: 'https://github.com/JN13012/RAG-pdf-Chatbot' },
      { label: 'Meeting Companion', url: 'https://github.com/JN13012/Business_AI_Meeting_Companion_STT' },
      { label: 'Career Coach', url: 'https://github.com/JN13012/AI-Career-Coach' },
      { label: 'Assistant Translator', url: 'https://github.com/JN13012/AI-Assistant-Translator' },
    ],
  },
  facts: [
    { value: '4', label: { fr: 'applications publiées', en: 'published applications' }, source: 'github.com/JN13012 (public repos)' },
  ],
  scale: { months: 3 },
  doNotClaim: ['Production use', 'Original research: these are guided course projects'],
}
