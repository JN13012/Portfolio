import { describe, expect, it } from 'vitest'
import { parseEther } from 'viem'
import { ChainConsole, PEOPLE, type LevelDefinition } from './console'

const texts = (lines: { text: string }[]) => lines.map(line => line.text).join('\n')

// A level with nothing to deploy, as level 2 will be: the console must adapt its help and forge.
const vaultOnly: LevelDefinition = {
  id: 0,
  console: { accounts: 'mallory, vault ou 0x…', examples: ['cast interface vault'] },
  contracts: ['Vault'],
  deployable: [],
  aliases: { Vault: 'vault' },
  balances: ['mallory', 'vault'],
  watched: ['vault'],
  async setup(chain) {
    await chain.fund(PEOPLE.mallory, parseEther('1'))
    const vault = (await chain.deploy(PEOPLE.deployer, 'Vault')).createdAddress!
    return { mallory: PEOPLE.mallory, vault }
  },
  solved: async () => false,
}

describe('Blockchain CTF console', () => {
  it('only knows the accounts and files of its level', async () => {
    const level = await ChainConsole.start(vaultOnly)
    expect(texts(await level.run('accounts')).split('\n').map(line => line.split(' ')[0])).toEqual(['mallory', 'vault'])
    expect(texts(await level.run('ls'))).toBe('Vault.sol')
    expect(texts(await level.run('cat VaultAttacker.sol'))).toContain('Fichiers : Vault.sol')
    expect(texts(await level.run('cast balance alice'))).toBe('Compte inconnu : alice. Comptes : mallory, vault ou une adresse 0x…')
    expect(await level.balances()).toEqual([{ name: 'mallory', wei: parseEther('1') }, { name: 'vault', wei: 0n }])
  })

  it('drops forge from a level with nothing to deploy', async () => {
    const level = await ChainConsole.start(vaultOnly)
    const help = texts(await level.run('help'))
    expect(help).not.toContain('forge')
    expect(help).toContain('Comptes : mallory, vault ou 0x…')
    expect(texts(await level.run('forge create Vault'))).toContain('aucun contrat à déployer')
  })

  it('prints the latest block, whose values change with each transaction', async () => {
    const level = await ChainConsole.start(vaultOnly)
    const first = texts(await level.run('cast block latest'))
    expect(first).toMatch(/^number +\d+\ntimestamp +\d+ \(\d{4}-\d\d-\d\dT[\d:]+Z\)\nprevrandao +0x[0-9a-f]{64}$/)
    await level.run('cast send vault "deposit()" --value 1ether')
    expect(texts(await level.run('cast block'))).not.toBe(first)
    expect(texts(await level.run('cast block 12'))).toContain('seul le dernier bloc')
    // Only levels whose contracts read block values list it in help.
    expect(texts(await level.run('help'))).not.toContain('cast block')
    expect(texts(await ChainConsole.start({ ...vaultOnly, blocks: true }).then(other => other.run('help')))).toContain('cast block')
  })
})

