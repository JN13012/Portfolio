import type { Project } from '../types'
import { archive } from './archive'
import { argos } from './argos'
import { blocktrader } from './blocktrader'
import { cards } from './cards'
import { llmApps } from './llm-apps'
import { auditWeb, pentest } from './pentest'
import { zeroday } from './zeroday'

/** Case studies, in default display order. */
export const dossiers: Project[] = [argos, pentest, zeroday]

export const projects: Project[] = [blocktrader, ...dossiers, auditWeb, ...llmApps, ...cards, ...archive]

export { archive, blocktrader, cards }
