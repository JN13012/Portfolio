import { BadgeCheck, Code, Crosshair, FlaskConical, Mail, Route, UserRound, type LucideIcon } from 'lucide-react'
import { brainNodes, type BrainNodeId } from '../../../content/assistant'
import type { Run } from '../../../lib/brain'
import type { NeuralNavNode } from './navNodes'

const ICONS: Record<BrainNodeId, LucideIcon> = {
  profile: UserRound,
  expertise: Code,
  projects: Crosshair,
  lab: FlaskConical,
  parcours: Route,
  certifications: BadgeCheck,
  contact: Mail,
}

/**
 * The network's 5 output nodes (2026-10-27: fewer and unlabelled, the network is shorter). Each one
 * stands for one or more of the assistant's 7 sections; it lights up when an answer cites one of them.
 */
const OUTPUT_GROUPS: BrainNodeId[][] = [['profile', 'parcours'], ['expertise', 'certifications'], ['projects'], ['lab'], ['contact']]

export const assistantNetworkNodes: NeuralNavNode[] = OUTPUT_GROUPS.map(([first]) => {
  const n = brainNodes.find((b) => b.id === first)!
  return { id: n.id, label: n.label.fr, hint: n.questions[0]!.question.fr, target: n.target, icon: ICONS[n.id] }
})

/** The answer as the network plays it: each cited section becomes its output node. */
export function networkRun(run: Run | null): Run | null {
  if (!run) return null
  const lit = run.lit.map((id) => OUTPUT_GROUPS.find((g) => g.includes(id))![0]!)
  return { ...run, lit: [...new Set(lit)] }
}
