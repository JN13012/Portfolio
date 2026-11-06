import type { Token } from './solidityHighlight'

// Colours for the console's commands and help, in the same Dark+ palette as the source viewer:
// tools and subcommands, account names, quoted signatures, flags, <placeholders> and amounts.

const TOOLS = new Set(['cast', 'forge', 'ls', 'cat', 'accounts', 'reset', 'clear', 'help'])
const SUBCOMMANDS = new Set(['interface', 'balance', 'block', 'call', 'send', 'create'])
const ACCOUNTS = new Set(['mallory', 'alice', 'bob', 'vault', 'attacker', 'wallet'])
const PATTERN = /("[^"]*")|(<[^>]+>)|(--[\w-]+)|(0x[0-9a-fA-F…]*)|(\b\d+(?:\.\d+)?(?:ether|gwei|wei)?\b)|([\w.]+)|(\s+)|(.)/g

export type ShellToken = { text: string; kind?: Token['kind'] | 'placeholder' | 'flag' | 'account' | 'heading' }

export function highlightShell(line: string): ShellToken[] {
  // Help section titles (« Exemples : », « Comptes : … ») stand out as headings.
  const at = line.startsWith(' ') ? -1 : line.indexOf(' :')
  if (at > 0) return [{ text: line.slice(0, at + 2), kind: 'heading' }, ...tokens(line.slice(at + 2))]
  return tokens(line)
}

function tokens(line: string): ShellToken[] {
  return [...line.matchAll(PATTERN)].map(([text, quoted, placeholder, flag, address, amount, word]) => {
    if (quoted) return { text, kind: 'string' as const }
    if (placeholder) return { text, kind: 'placeholder' as const }
    if (flag) return { text, kind: 'flag' as const }
    if (address || amount) return { text, kind: 'number' as const }
    if (word && TOOLS.has(word)) return { text, kind: 'keyword' as const }
    if (word && SUBCOMMANDS.has(word)) return { text, kind: 'function' as const }
    if (word && ACCOUNTS.has(word)) return { text, kind: 'account' as const }
    if (word && /^[A-Z]\w*(\.sol)?$/.test(word)) return { text, kind: 'type' as const }
    return { text }
  })
}
