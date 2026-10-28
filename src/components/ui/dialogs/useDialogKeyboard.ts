import { useCallback, type KeyboardEvent } from 'react'
import { isTopDialog, trapDialogTab } from './dialogLayer'

export function useDialogKeyboard({ onClose, onPrevious, onNext }: {
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
}) {
  return useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const node = event.currentTarget
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !isTopDialog(node) || !node.contains(event.target as Node)) return
    if (event.key === 'Tab') {
      event.stopPropagation()
      trapDialogTab(node, event)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
      return
    }
    const editable = event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]')
    if (editable) return
    const action = event.key === 'ArrowLeft' ? onPrevious : event.key === 'ArrowRight' ? onNext : undefined
    if (action) {
      event.preventDefault()
      event.stopPropagation()
      action()
    }
  }, [onClose, onPrevious, onNext])
}
