import { aiLabCurriculum, type LabLevel } from '../../../content/lab/ai'
import { LabCurriculumDrawer } from '../LabCurriculumDrawer'

export function LevelDrawer({ level, completed, onClose, onSelect }: {
  level?: LabLevel; completed: number[]; onClose: () => void; onSelect: (level: number) => void
}) {
  return <LabCurriculumDrawer id="ai-lab-curriculum" title="Niveaux IA · Sentry" groups={aiLabCurriculum} tone="blue"
    completed={completed} current={level} onClose={onClose} onSelect={onSelect} />
}
