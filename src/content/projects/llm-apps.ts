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
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Fonctionnement', en: 'How it works' },
        points: [
          { label: { fr: 'Transcription', en: 'Transcription' }, text: { fr: 'l’audio est transcrit avec Whisper.', en: 'the audio is transcribed with Whisper.' } },
          { label: { fr: 'Analyse', en: 'Analysis' }, text: { fr: 'Granite (IBM, sur watsonx.ai) en tire résumé, plan d’action et tonalité.', en: 'Granite (IBM, on watsonx.ai) draws a summary, action plan and tone from it.' } },
          { label: { fr: 'Interface', en: 'Interface' }, text: { fr: 'une page Gradio.', en: 'a Gradio page.' } },
        ],
      },
    ],
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
      fr: 'Un coach de carrière IA en trois onglets : CV, lettre de motivation et conseils.',
      en: 'An AI career coach in three tabs: CV, cover letter and advice.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Onglets', en: 'Tabs' },
        points: [
          { label: { fr: 'CV', en: 'CV' }, text: { fr: 'l’adapte à une offre.', en: 'tailors it to a job offer.' } },
          { label: { fr: 'Lettre de motivation', en: 'Cover letter' }, text: { fr: 'la rédige pour l’offre.', en: 'writes it for the offer.' } },
          { label: { fr: 'Conseils', en: 'Advice' }, text: { fr: 'répond aux questions de carrière.', en: 'answers career questions.' } },
          { label: { fr: 'Modèle', en: 'Model' }, text: { fr: 'Llama 3.2 sur IBM watsonx.ai, interface Gradio.', en: 'Llama 3.2 on IBM watsonx.ai, Gradio interface.' } },
        ],
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
      fr: 'Un traducteur vocal transcrit la parole, la traduit avec Llama 3.3 via Groq, puis la relit à voix haute avec les services Watson.',
      en: 'A voice translator that transcribes speech, translates it with Llama 3.3 through Groq, then reads it aloud with Watson services.',
    },
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Fonctionnement', en: 'How it works' },
        points: [
          { label: { fr: 'Écoute', en: 'Listening' }, text: { fr: 'Watson Speech to Text transcrit la parole.', en: 'Watson Speech to Text transcribes speech.' } },
          { label: { fr: 'Traduction', en: 'Translation' }, text: { fr: 'Llama 3.3 traduit le texte, via Groq.', en: 'Llama 3.3 translates the text, through Groq.' } },
          { label: { fr: 'Lecture', en: 'Reading' }, text: { fr: 'Watson Text to Speech lit la traduction, dans une page Flask.', en: 'Watson Text to Speech reads the translation, in a Flask page.' } },
        ],
      },
    ],
    stack: ['Python', 'Groq', 'Llama 3', 'IBM Watson', 'Flask'],
    links: { github: 'https://github.com/JN13012/AI-Assistant-Translator' },
    facts: [],
    scale: { months: 2 },
  }),
]
