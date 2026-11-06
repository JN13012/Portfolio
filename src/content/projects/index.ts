import type { Project } from '../types'
import { archive } from './archive'
import { argos } from './argos'
import { auditWeb } from './audit-web'
import { blocktrader } from './blocktrader'
import { ibmApps } from './ibm-apps'
import { pentest } from './pentest'
import { zeroday } from './zeroday'
import { argosSecurityArena } from './argos-security-arena'
import { baseDeConnaissance } from './base-de-connaissance'
import { bookworm } from './bookworm'
import { chatflow } from './chatflow'
import { chronox } from './chronox'
import { ctfBlockchain } from './ctf-blockchain'
import { ctfDuSite } from './ctf-du-site'
import { fraudsignal } from './fraudsignal'
import { generateurOtpRcs } from './generateur-otp-rcs'
import { hackathonCitiz } from './hackathon-citiz'
import { kubernetes } from './kubernetes'
import { labIa } from './lab-ia'
import { mariaAgent } from './maria-agent'
import { salesforceExecutor } from './salesforce-executor'
import { smartFridge } from './smart-fridge'
import { timeManager } from './time-manager'

// One file per project (its text, facts and images), except two families sharing a template:
// the IBM certificate apps (ibm-apps.ts) and the Epitech archive (archive.ts).

/** Case studies, in default display order. */
export const dossiers: Project[] = [argos, pentest, zeroday]

// « Autres réalisations ». Teams counted with git shortlog (JN13 = Jérémie) on 2026-10-17; for course projects
// re-uploaded in one commit, sizes given by Jérémie on 2026-10-26 (Vaultborn 3, Smart Fridge 3, POPEYE and My_Marvin solo).
export const cards: Project[] = [fraudsignal, chronox, mariaAgent, generateurOtpRcs, hackathonCitiz, chatflow, timeManager, salesforceExecutor, kubernetes, bookworm, baseDeConnaissance, labIa, ctfBlockchain, ctfDuSite, argosSecurityArena, smartFridge]

export const projects: Project[] = [blocktrader, ...dossiers, auditWeb, ...ibmApps, ...cards, ...archive]

export { archive, blocktrader, ibmApps }
