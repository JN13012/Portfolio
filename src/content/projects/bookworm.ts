import type { Project } from '../types'

export const bookworm: Project = {
  slug: 'bookworm',
  tier: 'card',
  status: 'delivered',
  tracks: ['ia', 'data'],
  title: 'Bookworm',
  period: { start: '2026-06', end: '2026-06' },
  team: { size: 1 },
  context: 'epitech',
  tagline: {
    fr: 'Analyse de livres Gutenberg en NLP : thèmes, personnages, résumé et fiche.',
    en: 'NLP analysis of Gutenberg books: topics, characters, summary and book card.',
  },
  summary: {
    fr: 'Un outil en ligne de commande qui analyse les livres du projet Gutenberg avec du NLP et en produit une fiche de lecture.',
    en: 'A command-line tool that analyses Project Gutenberg books with NLP and produces a book card.',
  },
  sections: [
    {
      kind: 'approach',
      title: { fr: 'Analyses', en: 'Analyses' },
      points: [
        { label: { fr: 'Thèmes', en: 'Topics' }, text: { fr: 'les mots importants de chaque section (TF-IDF).', en: 'the key words of each section (TF-IDF).' } },
        { label: { fr: 'Entités', en: 'Entities' }, text: { fr: 'les personnages et les lieux, avec spaCy.', en: 'characters and places, with spaCy.' } },
        { label: { fr: 'Résumé et livres proches', en: 'Summary and similar books' }, text: { fr: 'un résumé court et les livres les plus proches (similarité cosinus).', en: 'a short summary and the closest books (cosine similarity).' } },
        { label: { fr: 'Fiche', en: 'Book card' }, text: { fr: 'tout réuni dans une fiche, avec un cache des calculs.', en: 'all of it in one card, with a cache of the results.' } },
      ],
    },
  ],
  stack: ['Python', 'spaCy', 'scikit-learn', 'NLP'],
  links: { github: 'https://github.com/JN13012/Alice_In_Wonderland' },
  facts: [],
  scale: { months: 1 },
}
