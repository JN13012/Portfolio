// Where the network's drawing area sits in the hero, in % of its box (the column + 4rem). Negative
// values reach outside the box: up and down into the hero's margins, right into the page margin.
// Tuned with the mouse in the dev placement mode (/?placer). Two sets: wide screens have more room.

export type Placement = { top: number; right: number; bottom: number; left: number }

export const WIDE_FROM = 1800

export const HERO_PLACEMENT: Record<'normal' | 'wide', Placement> = {
  // left 0 (B, 2026-10-27): the network keeps to its half and never reaches under the text.
  normal: { top: 0, right: 0, bottom: 0, left: 0 },
  wide: { top: -20, right: -10, bottom: -10, left: 0 },
}

export const placementStyle = (p: Placement) => ({ top: `${p.top}%`, right: `${p.right}%`, bottom: `${p.bottom}%`, left: `${p.left}%` })
