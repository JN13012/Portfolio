export type LabCourseLevel = { id: number; title: string; objective: string; available: boolean }
export type LabCourseGroup = { title: string; levels: readonly LabCourseLevel[] }
