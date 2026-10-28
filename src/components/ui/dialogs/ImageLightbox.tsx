import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDialogLayer } from './dialogLayer'
import { useDialogKeyboard } from './useDialogKeyboard'

export function ImageLightbox({ src, alt, label, caption, onClose, onPrevious, onNext, labels }: {
  src: string
  alt: string
  label: string
  caption?: ReactNode
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  labels: { previous: string; next: string }
}) {
  const scope = useRef<HTMLDivElement>(null)
  useDialogLayer(scope)
  const onKeyDown = useDialogKeyboard({ onClose, onPrevious, onNext })
  return createPortal(
    <div ref={scope} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onKeyDown={onKeyDown}
      onClick={(event) => { event.stopPropagation(); onClose() }}
      className="fixed inset-0 z-[1200] flex cursor-zoom-out items-center justify-center bg-black p-4 outline-none">
      <img src={src} alt={alt} className="max-h-[94vh] max-w-[94vw] object-contain" />
      {caption}
      {[
        { action: onPrevious, side: 'left-4', Icon: ChevronLeft, text: labels.previous },
        { action: onNext, side: 'right-4', Icon: ChevronRight, text: labels.next },
      ].map(({ action, side, Icon, text }) => action && (
        <button key={text} type="button" aria-label={text}
          onClick={(event) => { event.stopPropagation(); action() }}
          className={`absolute top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-zinc-300 transition-colors hover:border-cyber/60 hover:text-cyber ${side}`}>
          <Icon size={26} aria-hidden="true" />
        </button>
      ))}
    </div>, document.body,
  )
}
