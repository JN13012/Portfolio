export const SEEN_KEY = 'sentry-welcome-seen'

export function markSentryWelcomeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // The greeting still works for this mount when storage is unavailable.
  }
}
