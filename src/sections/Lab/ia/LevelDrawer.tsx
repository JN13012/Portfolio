import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, LockKeyhole, X } from 'lucide-react'
import { aiLabLevels, type LabLevel } from '../../../content/aiLab'
import { useDialogLayer } from '../../../components/ui/dialogs/dialogLayer'
import { useDialogKeyboard } from '../../../components/ui/dialogs/useDialogKeyboard'
import { demoFlag } from '../../../../dev/mockups/aiLabFixtures'

export function LevelDrawer({ level, completed, onClose, onSelect }: {
  level: LabLevel; completed: LabLevel[]; onClose: () => void; onSelect: (level: LabLevel) => void
}) {
  const scope = useRef<HTMLDivElement>(null)
  const [inspected, setInspected] = useState(level)
  const item = aiLabLevels[inspected - 1]!
  const unlocked = item.id === 1 || completed.includes((item.id - 1) as LabLevel)
  const finished = completed.includes(item.id)
  useDialogLayer(scope)
  const onKeyDown = useDialogKeyboard({ onClose })
  return createPortal(
    <div className="ai-lab-drawer" ref={scope} role="dialog" aria-modal="true" aria-labelledby="ai-lab-drawer-title" tabIndex={-1} onKeyDown={onKeyDown}
      onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="ai-lab-drawer__panel" data-dialog-panel>
        <header><div><p className="ai-lab__eyebrow">Démonstration · 5 niveaux</p><h3 id="ai-lab-drawer-title">Niveaux et consignes</h3></div>
          <button type="button" onClick={onClose} data-dialog-initial-focus aria-label="Fermer les consignes"><X size={21} aria-hidden="true" /></button></header>
        <div className="ai-lab-drawer__body">
          <nav aria-label="Détails des niveaux"><ol>{aiLabLevels.map(entry => <li key={entry.id}>
            <button type="button" aria-pressed={entry.id === inspected} onClick={() => setInspected(entry.id)}>
              <span>{entry.id}. {entry.title}</span>
              {completed.includes(entry.id) ? <Check size={15} aria-label="Terminé en démonstration" /> : entry.id !== 1 && !completed.includes((entry.id - 1) as LabLevel) ? <LockKeyhole size={14} aria-label="Verrouillé" /> : null}
            </button>
          </li>)}</ol></nav>
          <section key={item.id} className="ai-lab-drawer__description" aria-label={`Consignes du niveau ${item.id}`}>
            <p className="ai-lab__eyebrow">Niveau {item.id}{finished ? ' · exploré en démonstration' : !unlocked ? ' · verrouillé' : ''}</p>
            <h4>{item.title}</h4><p>{item.objective}</p>
            <h5>Défense ajoutée</h5><p className="ai-lab-drawer__defense">{item.defense}</p><p>{item.description}</p>
            {unlocked ? <>
              <h5>Indices à révéler</h5>{item.hints.map((hint, index) => <details key={hint}><summary>Indice {index + 1}</summary><p>{hint}</p></details>)}
              {finished && <><h5>Ce qu’il faut retenir</h5><p>{item.takeaway}</p><details><summary>Voir la solution de démonstration</summary><p>Le scénario « Flag révélé » affiche <code>{demoFlag(item.id)}</code>. Il s’agit d’un exemple préparé, pas d’un contournement d’un modèle réel.</p></details></>}
              <button type="button" className="ai-lab__drawer-action" onClick={() => { onSelect(item.id); onClose() }}>Explorer le niveau {item.id}</button>
            </> : <p className="ai-lab-drawer__locked">Validez le niveau précédent pour accéder aux indices et à l’exercice simulé.</p>}
          </section>
        </div>
        <footer>Sentry est ici en mode entraînement, avec une conversation séparée de son rôle d’assistant. Aucun véritable secret n’est utilisé.</footer>
      </div>
    </div>, document.body,
  )
}
