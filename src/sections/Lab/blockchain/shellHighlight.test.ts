import { describe, expect, it } from 'vitest'
import { highlightShell } from './shellHighlight'

const kinds = (line: string) => highlightShell(line).filter(token => token.kind).map(token => `${token.kind}:${token.text}`)

describe('highlightShell', () => {
  it('keeps the text intact', () => {
    const line = '  cast send <contrat> "<fonction>()" [--value 1ether]'
    expect(highlightShell(line).map(token => token.text).join('')).toBe(line)
  })

  it('colours tools, subcommands, accounts, signatures, flags and amounts', () => {
    expect(kinds('cast send attacker "attack()" --value 1ether')).toEqual(['keyword:cast', 'function:send', 'account:attacker', 'string:"attack()"', 'flag:--value', 'number:1ether'])
    expect(kinds('forge create VaultAttacker --constructor-args vault')).toEqual(['keyword:forge', 'function:create', 'type:VaultAttacker', 'flag:--constructor-args', 'account:vault'])
  })

  it('turns help titles into headings', () => {
    expect(kinds('Exemples :')).toEqual(['heading:Exemples :'])
    expect(kinds('Comptes : mallory, alice')[0]).toBe('heading:Comptes :')
  })
})
