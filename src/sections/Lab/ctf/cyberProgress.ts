export type CyberProgress = { version: 2; completed: number[] }
export const CYBER_PROGRESS_KEY = 'ctf-progress'

export function parseCyberProgress(raw: string | null): CyberProgress {
  const empty: CyberProgress = { version: 2, completed: [] }
  try {
    const value: unknown = JSON.parse(raw ?? 'null')
    if (!value || typeof value !== 'object') return empty
    const saved = value as Record<string, unknown>
    if (saved.version === 2 && Array.isArray(saved.completed)) {
      return { version: 2, completed: [...new Set(saved.completed.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= 9))].sort((a, b) => a - b) }
    }
    // The previous format only allowed sequential play; preserve those earned successes once.
    if (saved.version === undefined && Number.isInteger(saved.level) && Number(saved.level) >= 1 && Number(saved.level) <= 9 && typeof saved.solved === 'boolean') {
      const count = saved.solved ? 9 : Number(saved.level) - 1
      return { version: 2, completed: Array.from({ length: count }, (_, index) => index + 1) }
    }
    return empty
  } catch { return empty }
}

export function completeCyberLevel(progress: CyberProgress, level: number): CyberProgress {
  if (!Number.isInteger(level) || level < 1 || level > 9 || progress.completed.includes(level)) return progress
  return { version: 2, completed: [...progress.completed, level].sort((a, b) => a - b) }
}

export function readCyberProgress(): CyberProgress {
  try { return parseCyberProgress(localStorage.getItem(CYBER_PROGRESS_KEY)) } catch { return { version: 2, completed: [] } }
}
