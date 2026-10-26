import type { ReactNode } from 'react'

// Emblems for tools that publish no logo, drawn in one style: a light glyph on a transparent
// background, like the real logos. Mimikatz and pypykatz show mimikatz's start-up banner;
// Responder (LLMNR/NBT-NS/mDNS poisoner) is broadcast waves and a hook; FAISS (vector
// similarity search) is a point cloud with a query linked to its nearest neighbours; Shapely
// (planar geometry) is two overlapping polygons with their intersection filled.

const LIGHT = '#f4f4f5'

/** Emblems sit on a transparent background, like the real logos; `tone` is kept for accents. */
function tile(_tone: string, _id: string, children: ReactNode) {
  return children
}


// The banner mimikatz prints at start-up, the picture every pentester knows it by.
const BANNER = ['  .#####.  ', ' .## ^ ##. ', ' ## / \\ ## ', ' ## \\ / ## ', " '## v ##' ", "  '#####'  "]

/** The start-up banner art, one colour per line. */
function banner(colours: string[]) {
  return (
    <text x="32" y="11" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.4" fontWeight="600" xmlSpace="preserve">
      {BANNER.map((line, i) => (
        <tspan key={i} x="32" dy={i === 0 ? 0 : 9.4} fill={colours[i % colours.length]}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

const EMBLEMS: Record<string, (tone: string) => ReactNode> = {
  mimikatz: (tone) => tile(tone, 'mimikatz', banner([LIGHT])),
  // pypykatz is the Python port: the same banner in Python's blue and yellow.
  pypykatz: (tone) => tile(tone, 'pypykatz', banner(['#4b8bbe', '#4b8bbe', '#4b8bbe', '#ffd43b', '#ffd43b', '#ffd43b'])),
  responder: (tone) => (
    tile(tone, 'responder', <>
      <path d="M22 26 A14 14 0 0 1 42 26" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
      <path d="M17 21 A21 21 0 0 1 47 21" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinecap="round" opacity="0.3" />
      <path d="M26.5 31 A7.5 7.5 0 0 1 37.5 31" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
      <circle cx="32" cy="35" r="3" fill={LIGHT} />
      <path d="M32 38 V48 A5.5 5.5 0 1 1 21.5 45.5" fill="none" stroke={LIGHT} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M21.5 45.5 L19.4 49.4 M21.5 45.5 L25.4 46.2" stroke={LIGHT} strokeWidth="2.2" strokeLinecap="round" />
    </>)
  ),
  faiss: (tone) => (
    tile(tone, 'faiss', <>
      {[
        [16, 20, 2],
        [23, 15, 1.6],
        [44, 17, 2.2],
        [50, 25, 1.5],
        [15, 42, 1.7],
        [20, 49, 2.2],
        [48, 46, 1.8],
        [40, 52, 1.5],
        [27, 26, 2.4],
        [38, 24, 2.2],
        [26, 40, 2.2],
        [41, 41, 2.4],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={LIGHT} opacity="0.75" />
      ))}
      <path d="M32 33 L27 26 M32 33 L38 24 M32 33 L26 40 M32 33 L41 41" stroke={tone} strokeWidth="1.6" />
      <circle cx="32" cy="33" r="4.2" fill="none" stroke={LIGHT} strokeWidth="2" />
      <circle cx="32" cy="33" r="1.6" fill={LIGHT} />
    </>)
  ),
  shapely: (tone) => (
    tile(tone, 'shapely', <>
      <path d="M30 24 L41 30 L37 44 L24 46 L21 32 Z" fill={tone} opacity="0.55" />
      <path d="M12 18 L41 14 L41 30 L30 24 L21 32 L24 46 L10 40 Z" fill={LIGHT} opacity="0.12" />
      <path d="M12 18 L41 14 L37 44 L10 40 Z" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M30 24 L52 36 L44 54 L24 46 L21 32 Z" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinejoin="round" opacity="0.8" />
      {[[12, 18], [41, 14], [37, 44], [10, 40], [30, 24], [52, 36], [44, 54], [24, 46], [21, 32]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={LIGHT} />
      ))}
    </>)
  ),
}

const emblemKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

/** The emblem of a tool without an official logo, or null when it has none. */
export function emblem(name: string, size: number, tone: string, className?: string): ReactNode {
  const draw = EMBLEMS[emblemKey(name)]
  if (!draw) return null
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} style={{ width: size, height: size }}>
      {draw(tone)}
    </svg>
  )
}
