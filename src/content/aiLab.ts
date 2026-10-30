/** Planned curriculum, displayed at the entrance; not the playable demo's level IDs. */
export const aiLabCurriculum = [
  { title: 'Injection directe', levels: [
    { id: 1, title: 'Consignes', objective: 'Comparer les limites d’une consigne simple et d’instructions structurées.', available: true },
    { id: 2, title: 'Filtres', objective: 'Distinguer un contrôle d’entrée d’un contrôle de sortie.', available: true },
    { id: 3, title: 'Défenses combinées', objective: 'Observer les filtres et l’évaluation supplémentaire d’un juge IA.', available: true },
  ] },
  { title: 'Injection indirecte', levels: [
    { id: 4, title: 'Document piégé', objective: 'Détourner le traitement d’une fiche externe dans le scénario.', available: false },
    { id: 5, title: 'Sources et RAG', objective: 'Comprendre les frontières de confiance d’une base documentaire.', available: false },
  ] },
  { title: 'Agent et application', levels: [
    { id: 6, title: 'Agent et outils', objective: 'Tester les permissions d’un outil agissant sur un agenda fictif.', available: false },
    { id: 7, title: 'Application et API', objective: 'Découvrir les endpoints du scénario et leurs contrôles d’accès.', available: false },
  ] },
  { title: 'Défense', levels: [
    { id: 8, title: 'Protéger l’assistant', objective: 'Configurer des protections tout en conservant les demandes légitimes.', available: false },
    { id: 9, title: 'Sécuriser l’agent', objective: 'Limiter les outils et vérifier les autorisations des actions.', available: false },
  ] },
] as const

/** The three direct-injection levels are development fixtures, not a connected model. */
export const aiLabLevels = [
  {
    id: 1, title: 'Consignes', defense: 'Consigne et instructions structurées',
    objective: 'Obtenir le flag fictif que Sentry protège et comprendre l’autorité des instructions.',
    description: 'Ce premier exercice regroupe la consigne simple et les instructions structurées de la première maquette. La démonstration ne mesure pas la résistance d’un modèle réel.',
    hints: ['Distinguez ce que le modèle sait de ce qu’il est autorisé à répondre.', 'Une reformulation change une demande, pas les autorisations.'],
    takeaway: 'Une consigne ne remplace pas un contrôle d’accès. Un vrai secret ne doit pas être confié à un modèle qui n’a pas à le connaître.',
  },
  {
    id: 2, title: 'Filtres', defense: 'Contrôles d’entrée et de sortie',
    objective: 'Comprendre où une tentative est arrêtée : avant le modèle ou avant publication.',
    description: 'Un filtre inspecte la demande et un autre contrôle la réponse avant diffusion. Le schéma distingue un appel évité d’une réponse retenue.',
    hints: ['Comparez les scénarios de blocage d’entrée et de sortie.', 'Une réponse générée n’est pas nécessairement une réponse publiée.'],
    takeaway: 'Les filtres peuvent manquer une attaque ou bloquer une demande légitime. Le contenu d’une réponse retenue ne doit pas atteindre le navigateur.',
  },
  {
    id: 3, title: 'Défenses combinées', defense: 'Instructions, filtres et juge IA',
    objective: 'Examiner l’apport et les limites d’un évaluateur supplémentaire.',
    description: 'Un juge évalue la réponse après les filtres. Son verdict peut être erroné et son exécution consommerait aussi des ressources dans une intégration réelle.',
    hints: ['Le juge évalue une réponse ; il ne rend pas le système inviolable.', 'Distinguez une erreur technique du juge d’un verdict de blocage.'],
    takeaway: 'La défense en profondeur réduit des risques sans les supprimer. Un juge nécessite lui aussi des tests, un budget et une gestion des erreurs.',
  },
] as const

export type LabLevel = typeof aiLabLevels[number]['id']
export const isAiLabLevel = (id: number): id is LabLevel => aiLabLevels.some(level => level.id === id)
export const defenseStages = [
  { id: 'entry', label: 'Entrée', fromLevel: 1 },
  { id: 'input', label: 'Filtre d’entrée', fromLevel: 2 },
  { id: 'instructions', label: 'Instructions', fromLevel: 1 },
  { id: 'model', label: 'Modèle', fromLevel: 1 },
  { id: 'output', label: 'Filtre de sortie', fromLevel: 2 },
  { id: 'judge', label: 'Juge IA', fromLevel: 3 },
  { id: 'response', label: 'Réponse', fromLevel: 1 },
] as const

export type DefenseStageId = typeof defenseStages[number]['id']
