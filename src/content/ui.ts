import type { CredentialKind, CredentialLevel, Locale, Localized, Project, ProjectContext, ProjectStatus } from './types'

// Interface vocabulary shared by components. Moves to src/i18n in step 3.

export const statusLabels: Record<ProjectStatus, Localized> = {
  development: { fr: 'En développement', en: 'In development' },
  delivered: { fr: 'Terminé', en: 'Finished' },
}

/** Type badge of a certification card: what was actually obtained. */
export const credentialKindLabels: Record<CredentialKind, Localized> = {
  certification: { fr: 'Examen', en: 'Exam' },
  'learning-path': { fr: 'Parcours', en: 'Learning path' },
  'professional-certificate': { fr: 'Certificat professionnel', en: 'Professional certificate' },
  course: { fr: 'Cours', en: 'Course' },
  workshop: { fr: 'Atelier', en: 'Workshop' },
}

/** TryHackMe's own difficulty words, kept in English in both languages. */
export const credentialLevelLabels: Record<CredentialLevel, string> = {
  1: 'INTRO',
  2: 'EASY',
  3: 'MEDIUM',
  4: 'HARD',
  5: 'INSANE',
}

/** « Seul », « Binôme », « Équipe de 5 », then the role when known. */
export function teamLabel(team: Project['team'], locale: Locale) {
  const size =
    team.size === 1
      ? { fr: 'Seul', en: 'Solo' }
      : team.size === 2
        ? { fr: 'Binôme', en: 'Pair' }
        : { fr: `Équipe de ${team.size}`, en: `Team of ${team.size}` }
  return team.role ? `${size[locale]} · ${team.role[locale]}` : size[locale]
}

/** Said before the summary in the project modal (the card only shows a short badge). */
export const contextLead: Partial<Record<ProjectContext, Localized>> = {
  ibm: { fr: 'Projet de certification IBM AI Developer', en: 'IBM AI Developer certification project' },
}

/** The summary as read in the modal: « Projet de certification IBM AI Developer : un chatbot… ». */
export function modalSummary(project: Project, locale: Locale) {
  const lead = contextLead[project.context]?.[locale]
  const text = project.summary[locale]
  return lead ? `${lead}${locale === 'fr' ? ' : ' : ': '}${text.charAt(0).toLowerCase()}${text.slice(1)}` : text
}

/** Labels of the dyno chart in the Parcours effect of the Bac+2 entry. */
export const dynoLabels = {
  power: { fr: 'Puissance (ch)', en: 'Power (hp)' },
  torque: { fr: 'Couple (Nm)', en: 'Torque (Nm)' },
  rpm: { fr: 'tr/min', en: 'rpm' },
  powerUnit: { fr: 'ch', en: 'hp' },
} satisfies Record<string, Localized>

/** Toggle for the one-shot effects of the Parcours panel (on by default). */
export const parcoursEffectsLabels = {
  label: { fr: 'Animations', en: 'Animations' },
  on: { fr: 'Animations activées', en: 'Animations on' },
  off: { fr: 'Animations désactivées', en: 'Animations off' },
} satisfies Record<string, Localized>

/** Shown in the Parcours effect of the motorsport entry when the #26 crosses the line. */
export const motorsportWin = {
  title: { fr: '1re place LMP2', en: '1st in LMP2' },
  detail: { fr: '6 Heures de Spa-Francorchamps (Belgique) · 6 mai 2017', en: '6 Hours of Spa-Francorchamps (Belgium) · 6 May 2017' },
} satisfies Record<string, Localized>
