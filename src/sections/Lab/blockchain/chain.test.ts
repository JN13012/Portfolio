import { describe, expect, it } from 'vitest'
import { parseEther, type Hex } from 'viem'
import { LocalChain } from './chain'

const player = '0x1000000000000000000000000000000000000001' as Hex
const alice = '0x2000000000000000000000000000000000000002' as Hex

describe('LocalChain', () => {
  it('runs the reentrancy exploit from the CTF repository', async () => {
    const chain = await LocalChain.create()
    await chain.fund(player, parseEther('2'))
    await chain.fund(alice, parseEther('10'))

    const vault = (await chain.deploy(alice, 'Vault')).createdAddress!
    expect((await chain.send(alice, vault, 'deposit', [], parseEther('10'))).ok).toBe(true)
    expect(await chain.read(vault, 'balanceOf', [alice])).toBe(parseEther('10'))

    const attacker = await chain.deploy(player, 'VaultAttacker', [vault])
    expect(attacker.ok).toBe(true)
    const second = await chain.deploy(player, 'VaultAttacker', [vault])
    expect(second.createdAddress).not.toBe(attacker.createdAddress)

    const run = await chain.send(player, attacker.createdAddress!, 'attack', [], parseEther('1'))
    expect(run.ok).toBe(true)
    expect(run.logs.filter(log => log.event === 'Withdrawn')).toHaveLength(11)
    expect(await chain.balance(vault)).toBe(0n)
    expect(await chain.balance(player)).toBe(parseEther('12'))
  })

  it('names custom errors on revert', async () => {
    const chain = await LocalChain.create()
    await chain.fund(player, parseEther('1'))
    const vault = (await chain.deploy(player, 'Vault')).createdAddress!
    const result = await chain.send(player, vault, 'withdraw')
    expect(result).toMatchObject({ ok: false, error: 'NothingToWithdraw' })
  })

  it('runs the unprotected initializer exploit through an ERC-1967 proxy', async () => {
    const chain = await LocalChain.create()
    await chain.fund(player, parseEther('1'))
    await chain.fund(alice, parseEther('10'))

    // As in the repository's test: the proxy runs initialize(alice) in its own storage, at deployment.
    const implementation = (await chain.deploy(alice, 'SharedWallet')).createdAddress!
    const proxy = await chain.deploy(alice, 'ERC1967Proxy', [implementation, LocalChain.encodeCall('SharedWallet', 'initialize', [alice])])
    expect(proxy.ok).toBe(true)
    const wallet = proxy.createdAddress!
    chain.useAbi(wallet, 'SharedWallet')

    const funding = await chain.transfer(alice, wallet, parseEther('10'))
    expect(funding.logs.map(log => `${log.contract}.${log.event}`)).toEqual(['SharedWallet.Received'])
    expect(await chain.read(wallet, 'owner')).toBe(alice)
    // The storage is the proxy's: the implementation itself was never initialized.
    expect(await chain.read(implementation, 'owner')).toBe('0x0000000000000000000000000000000000000000')

    expect(await chain.send(player, wallet, 'withdraw', [player, parseEther('10')])).toMatchObject({ ok: false, error: 'NotOwner', errorContract: 'SharedWallet' })
    expect((await chain.send(player, wallet, 'initialize', [player])).ok).toBe(true)
    expect((await chain.send(player, wallet, 'withdraw', [player, parseEther('10')])).ok).toBe(true)
    expect(await chain.balance(wallet)).toBe(0n)
    expect(await chain.balance(player)).toBe(parseEther('11'))
    expect(await chain.send(alice, wallet, 'withdraw', [alice, 0n])).toMatchObject({ ok: false, error: 'NotOwner' })
  })

  it('mines each transaction in a new block, with a fresh prevrandao', async () => {
    const chain = await LocalChain.create()
    await chain.fund(player, parseEther('1'))
    const before = chain.latestBlock()
    expect(before.prevrandao).toMatch(/^0x[0-9a-f]{64}$/)

    await chain.transfer(player, alice, 1n)
    const after = chain.latestBlock()
    expect(after.number).toBe(before.number + 1n)
    expect(after.timestamp).toBe(before.timestamp + 12n)
    expect(after.prevrandao).not.toBe(before.prevrandao)

    // A read does not mine a block.
    const vault = (await chain.deploy(player, 'Vault')).createdAddress!
    const mined = chain.latestBlock()
    await chain.read(vault, 'balanceOf', [player])
    expect(chain.latestBlock()).toEqual(mined)
  })

  it('draws a different lottery number from block to block, and the attacker always wins', async () => {
    const chain = await LocalChain.create()
    await chain.fund(alice, parseEther('10'))
    await chain.fund(player, parseEther('3'))
    const lottery = (await chain.deploy(alice, 'Lottery', [], parseEther('10'))).createdAddress!

    // The same player and guess, in 20 blocks: the draw follows prevrandao and the timestamp.
    const drawn = new Set<unknown>()
    for (let i = 0; i < 20; i++) {
      const played = await chain.send(player, lottery, 'play', [0n], parseEther('0.1'))
      const event = played.logs.find(log => log.event === 'Played')!
      drawn.add(event.args.winningNumber)
      if (event.args.prize) break
    }
    expect(drawn.size).toBeGreaterThan(1)

    // A fresh lottery each round, since a lucky ticket above may have emptied it.
    for (let round = 0; round < 5; round++) {
      await chain.fund(alice, parseEther('10'))
      const target = (await chain.deploy(alice, 'Lottery', [], parseEther('10'))).createdAddress!
      const attacker = (await chain.deploy(player, 'LotteryAttacker', [target])).createdAddress!
      expect((await chain.send(player, attacker, 'attack', [], parseEther('0.1'))).ok).toBe(true)
      expect(await chain.balance(target)).toBe(0n)
    }
  })
})

