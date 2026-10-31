export type LabCourseLevel = { id: number; title: string; summary?: string; objective: string; available: boolean }
export type LabCourseGroup = { title: string; levels: readonly LabCourseLevel[] }
