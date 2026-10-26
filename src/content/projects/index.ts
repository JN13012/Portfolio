import type { Project } from '../types'
import { archive } from './archive'
import { argos } from './argos'
import { blocktrader } from './blocktrader'
import { cards } from './cards'
import { llmApps } from './llm-apps'
import { auditWeb, pentest } from './pentest'
import { zeroday } from './zeroday'

/** Case studies, in default display order. */
export const dossiers: Project[] = [blocktrader, argos, pentest, zeroday]

export const projects: Project[] = [...dossiers, auditWeb, ...llmApps, ...cards, ...archive]

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export { archive, cards }
