import type { Project } from '../types'
import platinoImg from '../../assets/Projets/Platino.webp'
import popeyeImg from '../../assets/Projets/Popeye.png'
import myMarvinImg from '../../assets/Projets/My_marvin.png'
import vaultbornImg from '../../assets/Projets/Vaultborn.webp'
import cyberpongImg from '../../assets/Projets/Cyberpong.png'
import cyberpong2Img from '../../assets/Projets/Cyberpong2.webp'
import cyberpong7Img from '../../assets/Projets/Cyberpong7.webp'
import cyberpong11Img from '../../assets/Projets/Cyberpong11.webp'
import unitConverterImg from '../../assets/Projets/Unit_converter.png'
import convertisseur1Img from '../../assets/Projets/Convertisseur1.webp'
import convertisseur2Img from '../../assets/Projets/Convertisseur2.webp'
import vocalAssistantAIImg from '../../assets/Projets/Vocal_assistant_AI.png'
import lLMContextWrapperImg from '../../assets/Projets/LLM-Context-Wrapper.png'

// « Archives »: earlier or smaller projects, folded by year.
const archived = (p: Omit<Project, 'tier' | 'facts' | 'team'> & { team?: Project['team'] }): Project => ({
  tier: 'archive',
  facts: [],
  team: { size: 1 },
  ...p,
})

export const archive: Project[] = [
  archived({
    slug: 'platino',
    status: 'delivered',
    tracks: ['dev'],
    title: 'Platino',
    period: { start: '2025-10', end: '2025-10' },
    // Jérémie's commits: src/models, src/controllers, src/routes.
    team: { size: 4, role: { fr: 'backend', en: 'back end' } },
    context: 'epitech',
    tagline: {
      fr: 'Job board étudiant : comptes, profils, candidatures, API Express.',
      en: 'A student job board: accounts, profiles, applications, Express API.',
    },
    summary: {
      fr: 'Plateforme d’offres d’emploi pour étudiants : comptes, profils, candidatures et favoris, API Express et PostgreSQL.',
      en: 'Student job board: accounts, profiles, applications and favourites, Express API and PostgreSQL.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Fonctionnalités', en: 'Features' },
        points: [
          { label: { fr: 'Profil', en: 'Profile' }, text: { fr: 'informations, bio, compétences et CV.', en: 'details, bio, skills and CV.' } },
          { label: { fr: 'Offres', en: 'Offers' }, text: { fr: 'consulter, postuler, suivre ses candidatures et ses favoris.', en: 'browse, apply, track applications and favourites.' } },
        ],
      },
      {
        kind: 'result',
        title: { fr: 'Ma part', en: 'My part' },
        points: [
          { label: { fr: 'API', en: 'API' }, text: { fr: 'les modèles, les contrôleurs et les routes, sur PostgreSQL.', en: 'the models, controllers and routes, on PostgreSQL.' } },
        ],
      },
    ],
    images: [
      { src: platinoImg },
    ],
    stack: ['Express', 'PostgreSQL', 'Tailwind CSS'],
    links: { privateRepo: true },
    scale: { months: 1 },
  }),
  archived({
    slug: 'popeye',
    status: 'delivered',
    tracks: ['devops'],
    title: 'POPEYE',
    period: { start: '2025-11', end: '2025-11' },
    context: 'epitech',
    tagline: {
      fr: 'Une app de vote en microservices, orchestrée avec Docker Compose.',
      en: 'A microservice voting app, orchestrated with Docker Compose.',
    },
    summary: {
      fr: 'Application web de vote en microservices, orchestrée avec Docker Compose.',
    },
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Architecture', en: 'Architecture' },
        points: [
          { label: { fr: 'Vote', en: 'Vote' }, text: { fr: 'une interface web envoie les votes dans Redis.', en: 'a web interface pushes votes into Redis.' } },
          { label: { fr: 'Traitement', en: 'Processing' }, text: { fr: 'un worker les enregistre dans la base de données PostgreSQL.', en: 'a worker saves them in the PostgreSQL database.' } },
          { label: { fr: 'Résultats', en: 'Results' }, text: { fr: 'une seconde interface les affiche.', en: 'a second interface displays them.' } },
        ],
      },
    ],
    images: [
      { src: popeyeImg },
    ],
    stack: ['Docker', 'Docker Compose', 'Redis', 'PostgreSQL'],
    links: { github: 'https://github.com/JN13012/POPEYE' },
    scale: { months: 1 },
  }),
  archived({
    slug: 'my-marvin',
    status: 'delivered',
    tracks: ['devops'],
    title: 'My_Marvin',
    period: { start: '2025-11', end: '2025-11' },
    context: 'epitech',
    tagline: {
      fr: 'Jenkins entièrement configuré par le code (JCasC, Job DSL), en Docker.',
      en: 'Jenkins configured entirely as code (JCasC, Job DSL), in Docker.',
    },
    summary: {
      fr: 'Instance Jenkins conteneurisée, configurée entièrement par le code (JCasC, Job DSL).',
      en: 'A containerised Jenkins instance configured entirely as code (JCasC, Job DSL).',
    },
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Jobs' },
        body: { fr: 'Les jobs sont créés par un script Job DSL en Groovy.' },
      },
    ],
    images: [
      { src: myMarvinImg },
    ],
    stack: ['Jenkins', 'Groovy', 'Docker'],
    links: { github: 'https://github.com/JN13012/My_Marvin' },
    scale: { months: 1 },
  }),
  archived({
    slug: 'vaultborn',
    status: 'delivered',
    tracks: ['dev'],
    title: 'Vaultborn',
    period: { start: '2025-10', end: '2025-10' },
    // Team of 3 (Jérémie, 2026-10-26).
    team: { size: 3 },
    context: 'epitech',
    tagline: {
      fr: 'Action-RPG 2D en Java : 7 classes jouables, mondes connectés, sauvegarde.',
      en: 'A 2D action RPG in Java: 7 playable classes, connected worlds, saves.',
    },
    summary: {
      fr: 'Action-RPG 2D en Java : 7 classes jouables, mondes interconnectés, inventaire et sauvegarde, architecture en patterns (Factory, World, Screen).',
      en: '2D action RPG in Java: 7 playable classes, connected worlds, inventory and saves, pattern-based architecture (Factory, World, Screen).',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Contenu', en: 'Content' },
        points: [
          { label: { fr: '7 classes jouables', en: '7 playable classes' }, text: { fr: 'guerriers, archer et mages, chacun avec ses statistiques.', en: 'warriors, an archer and mages, each with its own stats.' } },
          { label: { fr: 'Mondes', en: 'Worlds' }, text: { fr: 'une forêt et un enfer, reliés par des portes.', en: 'a forest and a hell, linked by gates.' } },
          { label: { fr: 'Progression', en: 'Progression' }, text: { fr: 'niveaux, inventaire et sauvegarde automatique.', en: 'levels, inventory and automatic saving.' } },
        ],
      },
    ],
    images: [
      { src: vaultbornImg },
    ],
    stack: ['Java', 'LibGDX'],
    links: { github: 'https://github.com/JN13012/Vaultborn' },
    scale: { months: 1 },
  }),
  archived({
    slug: 'cyberpong',
    status: 'delivered',
    tracks: ['dev'],
    title: 'CyberPong',
    period: { start: '2025-10', end: '2025-10' },
    context: 'personal',
    tagline: {
      fr: 'Mon premier jeu vidéo : un Pong futuriste où 7 virus déforment la partie.',
      en: 'My first video game: a futuristic Pong where 7 viruses bend the match.',
    },
    summary: {
      fr: 'Mon premier jeu vidéo, en Python. Une introduction scénarisée façon terminal de hacker « infecte » le jeu ; ensuite, à chaque niveau, un nouveau virus change les règles.',
      en: 'My first video game, in Python. A scripted intro styled as a hacker’s terminal “infects” the game; then, at every level, a new virus changes the rules.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Les 7 virus' },
        body: { fr: 'Les raquettes rétrécissent, la balle accélère, l’écran tremble, un mur apparaît au milieu… Chaque virus a sa musique.' },
      },
    ],
    images: [
      { src: cyberpongImg },
      { src: cyberpong2Img },
      { src: cyberpong7Img },
      { src: cyberpong11Img },
    ],
    stack: ['Python', 'Pygame'],
    links: { github: 'https://github.com/JN13012/CyberPong' },
    scale: { months: 1 },
  }),
  archived({
    slug: 'unit-converter',
    status: 'delivered',
    tracks: ['dev'],
    title: 'Unit Converter',
    period: { start: '2025-09', end: '2025-09' },
    context: 'personal',
    tagline: {
      fr: 'Convertisseur d’unités en Python : 8 catégories, en terminal et en interface.',
      en: 'A Python unit converter: 8 categories, in the terminal and a GUI.',
    },
    summary: {
      fr: 'Un outil Python qui convertit une valeur et affiche le résultat dans toutes les autres unités de sa catégorie à la fois, en terminal ou dans une interface Tkinter.',
      en: 'A Python tool that converts a value and shows the result in every other unit of its category at once, in the terminal or a Tkinter GUI.',
    },
    sections: [
      {
        kind: 'approach',
        title: { fr: 'Les 8 catégories' },
        body: { fr: 'Température, masse, longueur, temps, volume, surface, vitesse et stockage.' },
      },
    ],
    images: [
      { src: unitConverterImg },
      { src: convertisseur1Img },
      { src: convertisseur2Img },
    ],
    stack: ['Python', 'Tkinter'],
    links: { github: 'https://github.com/JN13012/Unit_converter' },
    scale: { months: 1 },
  }),
  archived({
    slug: 'ai-voice-assistant',
    status: 'delivered',
    tracks: ['ia'],
    title: 'AI Voice Assistant',
    period: { start: '2026-03', end: '2026-03' },
    context: 'ibm',
    tagline: {
      fr: 'Assistant vocal : la voix avec Watson, les réponses avec Llama 3 via Groq.',
      en: 'A voice assistant: voice with Watson, answers with Llama 3 through Groq.',
    },
    summary: {
      fr: 'Un assistant vocal : IBM Watson reconnaît et synthétise la voix, Llama 3.3 répond via Groq.',
    },
    images: [
      { src: vocalAssistantAIImg },
    ],
    stack: ['Python', 'Flask', 'Groq', 'IBM Watson'],
    links: { github: 'https://github.com/JN13012/AI-Voice-Assistant' },
    scale: { months: 1 },
  }),
  archived({
    slug: 'llm-context-wrapper',
    status: 'delivered',
    tracks: ['ia'],
    title: 'LLM Context Wrapper',
    period: { start: '2026-03', end: '2026-03' },
    context: 'ibm',
    tagline: {
      fr: 'Donner une mémoire de conversation à un modèle Hugging Face.',
      en: 'Giving a Hugging Face model a conversation memory.',
    },
    summary: {
      fr: 'Une surcouche Python à Hugging Face Transformers qui garde l’historique de conversation du modèle Blenderbot.',
      en: 'A Python wrapper around Hugging Face Transformers that keeps the Blenderbot model’s conversation history.',
    },
    sections: [
      {
        kind: 'architecture',
        title: { fr: 'Fonctionnement', en: 'How it works' },
        points: [
          { label: { fr: 'Modèle', en: 'Model' }, text: { fr: 'Blenderbot 400M, chargé avec Hugging Face Transformers.', en: 'Blenderbot 400M, loaded with Hugging Face Transformers.' } },
          { label: { fr: 'Mémoire', en: 'Memory' }, text: { fr: 'l’historique est renvoyé au modèle à chaque tour.', en: 'the history is sent back to the model at every turn.' } },
          { label: { fr: 'Pipeline', en: 'Pipeline' }, text: { fr: 'tokenisation, inférence, puis décodage.', en: 'tokenisation, inference, then decoding.' } },
        ],
      },
    ],
    images: [
      { src: lLMContextWrapperImg },
    ],
    stack: ['Python', 'Transformers', 'PyTorch'],
    links: { github: 'https://github.com/JN13012/LLM-Context-Wrapper' },
    scale: { months: 1 },
  }),
]
