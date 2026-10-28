#!/usr/bin/env node
// Converts heavy images in src/assets to WebP (max 1600 px wide), rewrites the
// imports that reference them, and removes the originals (they stay in git history).
// Usage: node scripts/optimize-images.mjs [--dry]   (sharp is a dev dependency)
import { readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'
import sharp from 'sharp'

const ROOT = new URL('..', import.meta.url).pathname
const ASSETS = join(ROOT, 'src/assets')
const SOURCE_ROOTS = ['src', 'dev'].map((directory) => join(ROOT, directory))
const THRESHOLD = 120 * 1024 // bytes
const MAX_WIDTH = 1600
const dry = process.argv.includes('--dry')

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const images = walk(ASSETS).filter((p) => /\.(png|jpe?g)$/i.test(p) && statSync(p).size > THRESHOLD)
const sources = SOURCE_ROOTS.flatMap(walk).filter((p) => /\.(jsx?|tsx?)$/.test(p))

let saved = 0
for (const img of images) {
  const out = img.slice(0, -extname(img).length) + '.webp'
  const before = statSync(img).size
  const meta = await sharp(img).metadata()
  const buffer = await sharp(img)
    .resize({ width: Math.min(MAX_WIDTH, meta.width ?? MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer()
  saved += before - buffer.length
  console.log(`${relative(ROOT, img)}  ${Math.round(before / 1024)} Ko → ${Math.round(buffer.length / 1024)} Ko`)
  if (dry) continue
  writeFileSync(out, buffer)
  // Rewrite imports: same path, new extension.
  const from = basename(img)
  const to = basename(out)
  for (const src of sources) {
    const code = readFileSync(src, 'utf8')
    if (!code.includes(from)) continue
    writeFileSync(src, code.split(`/${from}"`).join(`/${to}"`).split(`/${from}'`).join(`/${to}'`))
  }
  unlinkSync(img)
}
console.log(`${images.length} images, ${Math.round(saved / 1024)} Ko saved${dry ? ' (dry run)' : ''}`)
