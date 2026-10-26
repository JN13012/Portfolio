#!/usr/bin/env node
// Builds src/content/writeups.json from the public repo JN13012/Cyber-Write-ups.
// Only the YAML front matter and the file name are read: the portfolio links to
// the write-ups on GitHub and never copies their text (see CLAUDE.md).
//
// Usage: npm run sync:writeups   (needs network; set GITHUB_TOKEN to raise the rate limit)

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const REPO = 'JN13012/Cyber-Write-ups'
const BRANCH = 'main'
const OUT = fileURLToPath(new URL('../src/content/writeups.json', import.meta.url))

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-sync-writeups' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function getJson(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${url}`)
  return res.json()
}

async function getText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': headers['User-Agent'] } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${url}`)
  return res.text()
}

/** Minimal YAML front-matter parser: `key: value` and `key:` followed by `  - item` lists. */
function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const data = {}
  let listKey = null
  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '')
    if (!line.trim()) continue
    const item = line.match(/^\s*-\s+(.*)$/)
    if (item && listKey) {
      data[listKey].push(unquote(item[1]))
      continue
    }
    const pair = line.match(/^([\w-]+):\s*(.*)$/)
    if (!pair) continue
    const [, key, value] = pair
    if (value === '') {
      listKey = key
      data[key] = []
    } else {
      listKey = null
      data[key] = unquote(value)
    }
  }
  return data
}

const unquote = (s) => s.trim().replace(/^["']|["']$/g, '')

/** "07 - Proxy - Active Directory.md" → { number: 7, room: "Proxy", focus: "Active Directory" } */
function parseFileName(path) {
  const name = path.split('/').pop().replace(/\.md$/, '')
  const [num, room, ...focus] = name.split(' - ')
  return { number: Number(num), room, focus: focus.join(' - ') }
}

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const tree = await getJson(`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`)
const files = tree.tree
  .filter((n) => n.type === 'blob' && n.path.endsWith('.md') && /^(Exegol|THM)\//.test(n.path))
  .map((n) => n.path)
  .sort()

const writeups = []
for (const path of files) {
  const md = await getText(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${encodeURI(path)}`)
  const meta = parseFrontMatter(md)
  const { number, room, focus } = parseFileName(path)
  const source = path.startsWith('Exegol/') ? 'epitech' : 'tryhackme'
  writeups.push({
    slug: `${source}-${String(number).padStart(2, '0')}-${slugify(room)}`,
    source,
    platform: meta.platform ?? (source === 'epitech' ? 'Exegol' : 'TryHackMe'),
    room: meta.room ?? room,
    focus,
    os: meta.os ?? null,
    environment: meta.environment ?? null,
    techniques: meta.techniques ?? [],
    tools: meta.tools ?? [],
    lastVerified: meta.last_verified ?? null,
    url: `https://github.com/${REPO}/blob/${BRANCH}/${encodeURI(path)}`,
  })
}

await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), repo: REPO, writeups }, null, 2) + '\n')
console.log(`${writeups.length} write-ups → ${OUT}`)
