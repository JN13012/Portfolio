import { aiLabCurriculum, aiLabLevels, type LabLevel } from '../../../content/aiLab'
import { LabCurriculumDrawer } from '../LabCurriculumDrawer'
import { demoFlag } from '../../../../dev/mockups/aiLabFixtures'

export function LevelDrawer({ level, completed, visited, onClose, onSelect }: {
  level?: LabLevel; completed: LabLevel[]; visited: number[]; onClose: () => void; onSelect: (level: number) => void
}) {
  return <LabCurriculumDrawer id="ai-lab-curriculum" title="Parcours IA · Sentry" groups={aiLabCurriculum} tone="blue"
    completed={completed} current={level} visited={visited} onClose={onClose} onSelect={onSelect}
    details={id => {
      const item = aiLabLevels.find(entry => entry.id === id)
      if (!item) return null
      return <>
        <p>{item.description}</p>
        {item.hints.map((hint, index) => <details key={hint}><summary>Indice {index + 1}</summary><p>{hint}</p></details>)}
        {completed.includes(item.id) && <><p>{item.takeaway}</p><details><summary>Voir la solution de démonstration</summary><p>Le scénario « Flag révélé » affiche <code>{demoFlag(item.id)}</code>. Il s’agit d’un exemple préparé, pas d’un contournement d’un modèle réel.</p></details></>}
      </>
    }} />
}
