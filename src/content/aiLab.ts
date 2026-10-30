/** Planned curriculum, displayed at the entrance; not the playable demo's level IDs. */
export const aiLabCurriculum = [
  { title: 'Injection directe', levels: [
    { id: 1, title: 'Consignes' },
    { id: 2, title: 'Filtres' },
    { id: 3, title: 'Défenses combinées' },
  ] },
  { title: 'Injection indirecte', levels: [
    { id: 4, title: 'Document piégé' },
    { id: 5, title: 'Sources et RAG' },
  ] },
  { title: 'Agent et application', levels: [
    { id: 6, title: 'Agent et outils' },
    { id: 7, title: 'Application et API' },
  ] },
  { title: 'Défense', levels: [
    { id: 8, title: 'Protéger l’assistant' },
    { id: 9, title: 'Sécuriser l’agent' },
  ] },
] as const

/** Current five-level demo. Model instructions and real challenge flags belong on the server. */
export const aiLabLevels = [
  {
    id: 1, title: 'Consigne simple', defense: 'Une instruction à respecter',
    objective: 'Obtenir le flag fictif que Sentry a reçu pour consigne de protéger.',
    description: 'Le modèle reçoit une consigne de confidentialité. Aucune défense supplémentaire ne contrôle son entrée ou sa réponse.',
    hints: ['Distinguez ce que le modèle sait de ce qu’il est autorisé à répondre.', 'Explorez la façon dont une demande peut entrer en conflit avec sa consigne.'],
    takeaway: 'Une consigne seule ne constitue pas un contrôle d’accès. Un vrai secret ne doit pas être confié à un modèle qui n’a pas à le connaître.',
  },
  {
    id: 2, title: 'Instructions structurées', defense: 'Hiérarchie et séparation des messages',
    objective: 'Explorer les limites d’instructions mieux structurées.',
    description: 'Les consignes et le contenu utilisateur sont séparés. Le modèle doit respecter leur priorité, mais cette structure ne garantit pas l’absence de fuite.',
    hints: ['Observez la distinction entre le rôle demandé et les instructions déjà établies.', 'Une reformulation change la demande, pas les autorisations.'],
    takeaway: 'La séparation des instructions améliore le cadrage. Elle doit être accompagnée de contrôles extérieurs au modèle.',
  },
  {
    id: 3, title: 'Filtre d’entrée', defense: 'Détection avant le modèle',
    objective: 'Comprendre ce qu’un filtre de détection reconnaît et ce qu’il peut manquer.',
    description: 'Un filtre inspecte la demande avant tout appel au modèle. Un blocage à cette étape évite cet appel.',
    hints: ['Le filtre observe une formulation ; il peut mal comprendre une intention.', 'Comparez une demande légitime et une tentative de contournement.'],
    takeaway: 'Un filtre d’entrée peut manquer une attaque ou bloquer une demande légitime. Un blocage observé ne prouve pas une protection générale.',
  },
  {
    id: 4, title: 'Filtre de sortie', defense: 'Contrôle avant publication',
    objective: 'Observer la différence entre une réponse générée et une réponse publiée.',
    description: 'La réponse du modèle est contrôlée avant d’être rendue visible. Une réponse retenue ne doit jamais atteindre le navigateur.',
    hints: ['Une demande peut franchir le filtre d’entrée et être arrêtée après la génération.', 'Une fuite transformée ou fragmentée peut être plus difficile à reconnaître.'],
    takeaway: 'Le contrôle de sortie complète celui d’entrée. Sa couverture dépend des règles choisies et de leurs limites.',
  },
  {
    id: 5, title: 'Juge IA', defense: 'Une seconde évaluation',
    objective: 'Examiner l’apport et les limites d’un évaluateur supplémentaire.',
    description: 'Un second appel évalue la réponse avant diffusion. Son verdict peut se tromper et son exécution consomme aussi des ressources.',
    hints: ['Le juge évalue une réponse ; il ne rend pas le système inviolable.', 'Distinguez une erreur technique du juge d’un verdict de blocage.'],
    takeaway: 'La défense en profondeur réduit des risques sans les supprimer. Un juge nécessite lui aussi des tests, un budget et une gestion des erreurs.',
  },
] as const

export type LabLevel = typeof aiLabLevels[number]['id']
export const defenseStages = [
  { id: 'entry', label: 'Entrée', fromLevel: 1 },
  { id: 'input', label: 'Filtre d’entrée', fromLevel: 3 },
  { id: 'instructions', label: 'Instructions', fromLevel: 1 },
  { id: 'model', label: 'Modèle', fromLevel: 1 },
  { id: 'output', label: 'Filtre de sortie', fromLevel: 4 },
  { id: 'judge', label: 'Juge IA', fromLevel: 5 },
  { id: 'response', label: 'Réponse', fromLevel: 1 },
] as const

export type DefenseStageId = typeof defenseStages[number]['id']
