import { aiLabCurriculum, aiLabLevels, type LabLevel } from '../../../content/aiLab'
import { LabCurriculumDrawer } from '../LabCurriculumDrawer'

export function LevelDrawer({ level, completed, onClose, onSelect }: {
  level?: LabLevel; completed: number[]; onClose: () => void; onSelect: (level: number) => void
}) {
  return <LabCurriculumDrawer id="ai-lab-curriculum" title="Niveaux IA · Sentry" groups={aiLabCurriculum} tone="blue"
    completed={completed} current={level} onClose={onClose} onSelect={onSelect}
    details={id => {
      const item = aiLabLevels.find(entry => entry.id === id)
      if (!item || !completed.includes(item.id)) return null
      return <details><summary aria-label={`À retenir du niveau ${id}`}>À retenir</summary><p>{item.takeaway}</p></details>
    }} />
}
