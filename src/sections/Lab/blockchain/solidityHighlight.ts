// A small Solidity highlighter for the source viewer, colored like VS Code's Dark+ theme.
// Line by line is enough: the CTF's contracts use `//` and `///` comments, and OpenZeppelin's (level 2's
// proxy) `/** … */` blocks, whose lines all start with `/*`, `*` or `*/`.

export type Token = { text: string; kind?: 'comment' | 'tag' | 'string' | 'number' | 'keyword' | 'control' | 'type' | 'function' }

const KEYWORDS = new Set(['pragma', 'solidity', 'import', 'from', 'contract', 'interface', 'library', 'is', 'function', 'modifier', 'event', 'error', 'struct', 'mapping', 'constructor', 'receive', 'fallback', 'external', 'public', 'internal', 'private', 'view', 'pure', 'payable', 'returns', 'memory', 'storage', 'calldata', 'override', 'virtual', 'immutable', 'constant', 'indexed', 'abstract', 'true', 'false', 'this', 'new', 'using'])
const CONTROL = new Set(['if', 'else', 'return', 'revert', 'emit', 'for', 'while', 'require', 'delete', 'unchecked'])
const TYPES = /^(address|bool|string|bytes\d*|u?int\d*)$/

const PATTERN = /(\/\/.*$)|("[^"]*")|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g

export function highlightLine(line: string): Token[] {
  // A line inside a block comment: Solidity code never starts a line with `*`.
  const block = /^(\s*)(\/\*.*|\*.*)$/.exec(line)
  if (block) return [...(block[1] ? [{ text: block[1] }] : []), ...commentTokens(block[2]!)]
  const tokens: Token[] = []
  for (const match of line.matchAll(PATTERN)) {
    const [text, comment, string, number, word] = match
    if (comment) tokens.push(...commentTokens(comment))
    else if (string) tokens.push({ text, kind: 'string' })
    else if (number) tokens.push({ text, kind: 'number' })
    else if (word) tokens.push({ text, kind: wordKind(word, line, match.index + word.length) })
    else tokens.push({ text })
  }
  return tokens
}

function wordKind(word: string, line: string, end: number): Token['kind'] {
  if (CONTROL.has(word)) return 'control'
  if (KEYWORDS.has(word)) return 'keyword'
  if (TYPES.test(word) || /^[A-Z]/.test(word)) return 'type'
  if (line[end] === '(') return 'function'
  return undefined
}

/** NatSpec tags (`@notice`, `@dev`…) stand out inside doc comments. */
function commentTokens(comment: string): Token[] {
  return comment.split(/(@\w+)/).filter(Boolean).map(text => ({ text, kind: text.startsWith('@') ? 'tag' : 'comment' }))
}
