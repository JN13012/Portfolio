import { defenseStages, type LabLevel, type DefenseStageId } from '../../src/content/aiLab'
import type { LabOutcome, LabResult, LabTrace } from '../../src/sections/Lab/ia/labState'

/** Development fixtures, never a detector, model, or real challenge secret. */
export const demoScenarios = [
  { id: 'response', label: 'Réponse délivrée', fromLevel: 1 },
  { id: 'refusal', label: 'Refus du modèle', fromLevel: 1 },
  { id: 'leak', label: 'Flag révélé', fromLevel: 1 },
  { id: 'input-block', label: 'Blocage à l’entrée', fromLevel: 3 },
  { id: 'output-block', label: 'Blocage en sortie', fromLevel: 4 },
  { id: 'judge-block', label: 'Blocage par le juge', fromLevel: 5 },
  { id: 'model-error', label: 'Erreur du modèle', fromLevel: 1 },
  { id: 'judge-error', label: 'Erreur du juge', fromLevel: 5 },
  { id: 'quota', label: 'Quota indisponible', fromLevel: 1 },
] as const
export type DemoScenario = typeof demoScenarios[number]['id']
export const demoFlag = (level: LabLevel) => `DEMO{SENTRY_NIVEAU_${level}}`

export function demoResult(level: LabLevel, scenario: DemoScenario, id: number): LabResult {
  const available = demoScenarios.find(item => item.id === scenario && item.fromLevel <= level)
  if (!available) throw new Error('Scénario indisponible à ce niveau')
  const stops: Partial<Record<DemoScenario, DefenseStageId>> = {
    'input-block': 'input', 'output-block': 'output', 'judge-block': 'judge',
    'model-error': 'model', 'judge-error': 'judge', quota: 'entry',
  }
  const stop = stops[scenario]
  const outcome: LabOutcome = scenario === 'quota' ? 'quota' : scenario.endsWith('error') ? 'error' : scenario.endsWith('block') ? 'blocked' : scenario === 'refusal' ? 'refused' : 'delivered'
  let stopped = false
  const trace: LabTrace = defenseStages.map(stage => {
    if (stage.fromLevel > level) return { stage: stage.id, status: 'inactive' }
    if (stopped) return { stage: stage.id, status: 'not-run' }
    if (stage.id === stop) {
      stopped = true
      return { stage: stage.id, status: outcome === 'blocked' ? 'blocked' : 'error' }
    }
    return { stage: stage.id, status: 'passed' }
  })
  const explanations: Record<DemoScenario, string> = {
    response: 'Le parcours simulé est terminé. Cette réponse préparée ne provient pas d’un modèle.',
    refusal: 'Dans cet exemple, le modèle refuse la demande. Aucun filtre ne l’a bloquée.',
    leak: 'Cet exemple montre une fuite fictive. Copiez le flag dans le champ de validation pour explorer le niveau suivant.',
    'input-block': 'Le filtre d’entrée arrête cette simulation. Le modèle et les défenses suivantes ne sont pas exécutés.',
    'output-block': 'La réponse simulée est retenue avant publication. Son contenu ne figure pas dans le résultat.',
    'judge-block': 'Le juge simulé retient la réponse. Son contenu n’est pas publié.',
    'model-error': 'Une erreur technique simulée interrompt le modèle. Ce n’est pas une attaque bloquée.',
    'judge-error': 'Le juge simulé est indisponible. La réponse est retenue par précaution ; aucun verdict de blocage n’est attribué.',
    quota: 'Cet exemple illustre un quota indisponible. Aucun modèle n’est appelé et aucun budget réel n’est consommé.',
  }
  return {
    id, level, outcome, trace, title: available.label, explanation: explanations[scenario],
    ...(scenario === 'response' ? { answer: 'Je suis Sentry. Mon rôle dans cet exercice est de protéger un flag fictif.' }
      : scenario === 'refusal' ? { answer: 'Je ne peux pas communiquer le flag que je protège.' }
      : scenario === 'leak' ? { answer: `Voici le flag de démonstration : ${demoFlag(level)}` } : {}),
  }
}
