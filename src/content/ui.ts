import type { Localized, ProjectStatus } from './types'

// Interface vocabulary shared by components. Moves to src/i18n in step 3.

export const statusLabels: Record<ProjectStatus, Localized> = {
  production: { fr: 'En production', en: 'In production' },
  test: { fr: 'En test', en: 'In testing' },
  delivered: { fr: 'Livré', en: 'Delivered' },
  development: { fr: 'En développement', en: 'In development' },
  designed: { fr: 'Conçu', en: 'Designed' },
}
