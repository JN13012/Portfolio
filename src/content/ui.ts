import type { Localized, ProjectStatus } from './types'

// Interface vocabulary shared by components. Moves to src/i18n in step 3.

export const statusLabels: Record<ProjectStatus, Localized> = {
  development: { fr: 'En développement', en: 'In development' },
  delivered: { fr: 'Terminé', en: 'Finished' },
}
