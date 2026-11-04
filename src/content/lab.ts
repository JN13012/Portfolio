export type LabCourseLevel = { id: number; title: string; summary?: string; objective: string; available: boolean }
export type LabCourseGroup = { title: string; levels: readonly LabCourseLevel[] }

/** The section's name. Both sides are capture-the-flag games, hence « CTF » (decision 2026-11-04). */
export const ctfSection = {
  title: 'CTF',
  domains: 'Domaine du CTF',
  loadingIa: 'Chargement du CTF IA…',
} as const
