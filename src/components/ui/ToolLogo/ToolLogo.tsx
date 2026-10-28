import { cx } from '../../../lib/cx'
import { emblem } from './emblems'
import { IMAGE_LOGOS, VECTOR_LOGOS, LOGO_COLORS, normalizeToolName, readableLogoColor } from './logoRegistry'

/** `onlyReal`: nothing when the tool has no real logo (no drawn emblem, no monogram). */
export function ToolLogo({ name, size, className, tone = '#a1a1aa', onlyReal }: { name: string; size: number; className?: string; tone?: string; onlyReal?: boolean }) {
  const k = normalizeToolName(name)
  if (IMAGE_LOGOS[k]) return <img src={IMAGE_LOGOS[k]} alt="" loading="lazy" decoding="async" draggable={false} className={cx('object-contain', className)} style={{ width: size, height: size }} />
  const icon = VECTOR_LOGOS[k]
  if (icon)
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={{ width: size * 0.82, height: size * 0.82 }}>
        <path d={icon.path} fill={LOGO_COLORS[k] ?? readableLogoColor(icon.hex)} />
      </svg>
    )
  if (onlyReal) return null
  const drawn = emblem(name, size, tone, className)
  if (drawn) return drawn
  const letters = name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean)
  const mono = (letters.length > 1 ? letters[0]![0]! + letters[1]![0]! : name.slice(0, 2)).toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={cx('grid place-items-center rounded-2xl border font-semibold tracking-wide', className)}
      style={{ width: size * 0.74, height: size * 0.74, fontSize: size * 0.26, color: tone, borderColor: `${tone}55`, background: `linear-gradient(160deg, ${tone}22, ${tone}08)` }}
    >
      {mono}
    </span>
  )
}

