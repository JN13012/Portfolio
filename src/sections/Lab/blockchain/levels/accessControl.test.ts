import { describe, expect, it } from 'vitest'
import { ChainConsole } from '../console'
import { accessControl } from './accessControl'

const texts = (lines: { text: string }[]) => lines.map(line => line.text).join('\n')

describe('Blockchain CTF level 2', () => {
  it('starts with Alice owning a 10 ETH wallet behind a proxy', async () => {
    const level = await ChainConsole.start(accessControl)
    expect(texts(await level.run('cast call wallet "owner()"'))).toBe('0x000000000000000000000000000000000000a11c (alice)')
    expect(texts(await level.run('cast balance wallet'))).toBe('10 ETH')
    expect(texts(await level.run('ls'))).toBe('SharedWallet.sol    ERC1967Proxy.sol')
    expect(texts(await level.run('cast interface wallet'))).toContain('withdraw(address to, uint256 amount)')
    expect(await level.solved()).toBe(false)
  })

  it('explains why the owner check refuses Mallory', async () => {
    const level = await ChainConsole.start(accessControl)
    const refused = texts(await level.run('cast send wallet "withdraw(address,uint256)" mallory 10ether'))
    expect(refused).toContain('Transaction annulée (revert) : NotOwner')
    expect(refused).toContain('Seul le propriétaire du portefeuille')
    expect(texts(await level.run('cast send wallet withdraw mallory'))).toContain('to (address) : le compte qui reçoit les ETH ; amount (uint256)')
    expect(texts(await level.run('forge create SharedWallet'))).toContain('aucun contrat à déployer')
    expect(texts(await level.run('cast call SharedWallet "owner()"'))).toContain('s’appelle wallet')
    expect(texts(await level.run('help'))).not.toContain('forge')
  })

  it('is solved by re-initializing the wallet, then withdrawing', async () => {
    const level = await ChainConsole.start(accessControl)
    expect(texts(await level.run('cast send wallet "initialize(address)" mallory'))).toContain('event SharedWallet.OwnerSet')
    expect(texts(await level.run('cast call wallet owner'))).toContain('(mallory)')
    // More than the wallet holds: the transfer fails, and the console says why.
    expect(texts(await level.run('cast send wallet "withdraw(address,uint256)" mallory 11ether'))).toContain('dépasse-t-il son solde')
    const drained = texts(await level.run('cast send wallet "withdraw(address,uint256)" mallory 10ether'))
    expect(drained).toContain('mallory : 2 ETH → 12 ETH')
    expect(drained).toContain('wallet : 0 ETH')
    expect(await level.solved()).toBe(true)
  })

  it('is not solved by funding the wallet', async () => {
    const level = await ChainConsole.start(accessControl)
    expect(texts(await level.run('cast send wallet "initialize(address)" 0x0000000000000000000000000000000000000000'))).toContain('ZeroAddress')
    expect(await level.solved()).toBe(false)
  })
})
