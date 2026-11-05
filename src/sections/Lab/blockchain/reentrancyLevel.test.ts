import { describe, expect, it } from 'vitest'
import { ReentrancyLevel, tokenize } from './reentrancyLevel'

const texts = (lines: { text: string }[]) => lines.map(line => line.text).join('\n')

describe('Blockchain CTF level 1', () => {
  it('tokenizes quoted signatures', () => {
    expect(tokenize('cast call vault "balanceOf(address)" alice')).toEqual(['cast', 'call', 'vault', 'balanceOf(address)', 'alice'])
  })

  it('starts with 10 ETH in the vault and reads balances', async () => {
    const level = await ReentrancyLevel.start()
    expect(texts(await level.run('cast balance vault'))).toBe('10 ETH')
    expect(texts(await level.run('cast call vault "balanceOf(address)" alice'))).toContain('5 ETH')
    expect(await level.solved()).toBe(false)
  })

  it('explains a missing argument instead of an encoding error', async () => {
    const level = await ReentrancyLevel.start()
    expect(texts(await level.run('cast call vault balanceOf(address)'))).toBe('balanceOf attend 1 argument (address). Exemple : cast call vault "balanceOf(address)" alice')
    expect(texts(await level.run('cast call vault balanceOf(adress)'))).toBe('Signature inconnue : balanceOf(adress). Exemple : cast call vault "balanceOf(address)" alice')
    expect(texts(await level.run('cast send vault "steal()"'))).toContain('Fonctions : balanceOf, deposit, withdraw')
  })

  it('rejects what real cast and forge would reject', async () => {
    const level = await ReentrancyLevel.start()
    expect(texts(await level.run('cast call vault "balanceOf(1)" bob'))).toContain('"balanceOf(address)"')
    expect(texts(await level.run('forge create VaultAttacker --constructor-1 vault'))).toContain('Option inconnue : --constructor-1')
    expect(texts(await level.run('forge create Vault'))).toContain('déjà déployé')
    expect(texts(await level.run('forge create VaultAttacker'))).toContain('attend l’adresse du coffre')
    expect(texts(await level.run('cast balance VaultAttacker'))).toContain('Déployez-le d’abord')
    await level.run('forge create VaultAttacker --constructor-args vault')
    expect(texts(await level.run('cast balance VaultAttacker'))).toContain('s’appelle attacker')
    expect(texts(await level.run('cast balance attacker'))).toBe('0 ETH')
  })

  it('names the custom error of a reverted transaction', async () => {
    const level = await ReentrancyLevel.start()
    expect(texts(await level.run('cast send vault "withdraw()"'))).toContain('NothingToWithdraw')
  })

  it('is solved by the exploit typed in the console', async () => {
    const level = await ReentrancyLevel.start()
    expect(texts(await level.run('forge create VaultAttacker --constructor-args vault'))).toContain('Deployed to')
    const attack = texts(await level.run('cast send attacker "attack()" --value 1ether'))
    expect(attack).toContain('Vault.Withdrawn × 11')
    expect(attack).toContain('mallory : 2 ETH → 12 ETH')
    expect(await level.solved()).toBe(true)
  })

  it('is not solved by an honest deposit and withdrawal', async () => {
    const level = await ReentrancyLevel.start()
    await level.run('cast send vault "deposit()" --value 1ether')
    await level.run('cast send vault "withdraw()"')
    expect(await level.solved()).toBe(false)
  })
})
