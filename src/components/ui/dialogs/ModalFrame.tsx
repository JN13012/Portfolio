import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDialogLayer } from './dialogLayer'
import { useDialogKeyboard } from './useDialogKeyboard'

export function ModalFrame({ label, panelClassName, children, outside, onClose, onPrevious, onNext, restoreFocus, fallbackFocus }: {
  label: string
  panelClassName: string
  children: ReactNode
  outside?: ReactNode
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  restoreFocus?: () => boolean
  fallbackFocus?: () => HTMLElement | null
}) {
  const scope = useRef<HTMLDivElement>(null)
  useDialogLayer(scope, { restoreFocus, fallbackFocus })
  const onKeyDown = useDialogKeyboard({ onClose, onPrevious, onNext })
  return createPortal(
    <div ref={scope} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/95 p-4 outline-none backdrop-blur-xl">
      <div data-dialog-panel onClick={(event) => event.stopPropagation()}
        className={`relative flex w-[95vw] flex-col overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.5)] md:w-[85vw] lg:w-[75vw] ${panelClassName}`}>
        {children}
      </div>
      {outside}
    </div>, document.body,
  )
}
