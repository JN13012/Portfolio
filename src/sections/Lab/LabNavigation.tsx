import { ChevronRight, Undo2 } from 'lucide-react'

export function LabNavigation({ onPresentation, onCurriculum, open, drawerId, tone = 'green' }: {
  onPresentation: () => void; onCurriculum: () => void; open: boolean; drawerId: string; tone?: 'green' | 'blue'
}) {
  return <div className="lab-navigation" data-tone={tone}>
    <button type="button" className="lab-navigation__return" aria-label="Revenir à la présentation" title="Revenir à la présentation" onClick={onPresentation}>
      <Undo2 size={16} aria-hidden="true" />
    </button>
    <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={drawerId} onClick={onCurriculum}>
      Parcours <ChevronRight size={14} aria-hidden="true" />
    </button>
  </div>
}
