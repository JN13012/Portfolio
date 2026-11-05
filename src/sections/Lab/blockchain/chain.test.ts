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
})
