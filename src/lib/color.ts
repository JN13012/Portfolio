/** '#3fd8f2' + 0.5 → 'rgba(63, 216, 242, 0.5)'. For canvas, where CSS color-mix() is not reliable. */
export function withAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/** Reads a color token from :root, with a fallback. */
export function readToken(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}
