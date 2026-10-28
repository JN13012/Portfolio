import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

/** Stop activity sampling in background tabs, and resample when the visitor returns. */
export function useDocumentVisible() {
  return useSyncExternalStore(subscribe, () => !document.hidden, () => false)
}
