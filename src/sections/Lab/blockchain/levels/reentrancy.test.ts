import { describe, expect, it } from 'vitest'
import { ChainConsole, tokenize } from '../console'
import { reentrancy } from './reentrancy'

const texts = (lines: { text: string }[]) => lines.map(line => line.text).join('\n')

describe('Blockchain CTF level 1', () => {
  it('tokenizes quoted signatures', () => {
    expect(tokenize('cast call vault "balanceOf(address)" alice')).toEqual(['cast', 'call', 'vault', 'balanceOf(address)', 'alice'])
  })

  it('starts with 10 ETH in the vault and reads balances', async () => {
    const level = await ChainConsole.start(reentrancy)
    expect(texts(await level.run('cast balance vault'))).toBe('10 ETH')
    expect(texts(await level.run('cast call vault "balanceOf(address)" alice'))).toContain('5 ETH')
    expect(await level.solved()).toBe(false)
  })

  it('explains a missing argument instead of an encoding error', async () => {
    const level = await ChainConsole.start(reentrancy)
    expect(texts(await level.run('cast call vault balanceOf(address)'))).toBe('balanceOf attend 1 argument, reçu 0. account (address) : le compte dont on lit le solde. Exemple : cast call vault "balanceOf(address)" alice')
    expect(texts(await level.run('cast call vault balanceOf(adress)'))).toBe('Signature inconnue : balanceOf(adress). Exemple : cast call vault "balanceOf(address)" alice')
    expect(texts(await level.run('cast send vault "steal()"'))).toContain('Fonctions : balanceOf, deposit, withdraw')
  })

  it('rejects what real cast and forge would reject', async () => {
    const level = await ChainConsole.start(reentrancy)
    expect(texts(await level.run('cast call vault "balanceOf(1)" bob'))).toContain('"balanceOf(address)"')
    expect(texts(await level.run('forge create VaultAttacker --constructor-1 vault'))).toContain('Option inconnue : --constructor-1')
    expect(texts(await level.run('forge create Vault'))).toContain('déjà déployé')
    expect(texts(await level.run('forge create VaultAttacker'))).toContain('attend l’adresse du coffre')
    expect(texts(await level.run('cast balance VaultAttacker'))).toContain('Déployez-le d’abord')
    await level.run('forge create VaultAttacker --constructor-args vault')
    expect(texts(await level.run('cast balance VaultAttacker'))).toContain('s’appelle attacker')
    expect(texts(await level.run('cast balance attacker'))).toBe('0 ETH')
  })

  it('guides each common mistake', async () => {
    const level = await ChainConsole.start(reentrancy)
    const say = async (command: string) => texts(await level.run(command))
    // A bare function name works, and shows the exact cast syntax.
    expect(await say('cast call vault balanceOf alice')).toBe('5000000000000000000 (5 ETH)\nSyntaxe exacte de cast : cast call vault "balanceOf(address)" alice')
    expect(await say('cast call vault "balanceOf(address)(uint256)" alice')).toBe('5000000000000000000 (5 ETH)')
    // Mallory's address is not checksummed: it must still work as an argument, in any case.
    expect(await say('cast call vault "balanceOf(address)" mallory')).toBe('0 (0 ETH)')
    expect(await say('cast call vault "balanceOf(address)" 0x000000000000000000000000000000000000A11C')).toBe('5000000000000000000 (5 ETH)')
    expect(await say('cast call vault balanceOf 102 alice')).toContain('reçu 2 (102 alice)')
    expect(await say('cast call vault balanceOf 102')).toContain('102 n’est pas une adresse : account (address)')
    expect(await say('cast call vault balanceOf 0x12')).toContain('40 caractères hexadécimaux')
    expect(await say('cast call vault balanceOf charlie')).toContain('Comptes : mallory, alice, bob, vault')
    expect(await say('cast call vault')).toContain('Fonctions de vault : balanceOf, deposit, withdraw')
    expect(await say('cast call vault deposit')).toContain('utilisez cast send')
    expect(await say('cast send vault balanceOf alice')).toContain('utilisez cast call')
    expect(await say('cast send vault "withdraw()" --value 1ether')).toContain('non payable')
    expect(await say('cast send vault "deposit()" --value 1 ether')).toContain('--value 1ether')
    expect(await say('cast send vault "deposit()" --value 100ether')).toBe('Solde insuffisant : mallory a 2 ETH et veut envoyer 100 ETH.')
    expect(await say('cast send vault "deposit()" --value 1')).toContain('se lit en wei')
    expect(await say('cast')).toContain('Sous-commandes : interface, balance, block, call, send')
    expect(await say('forge')).toContain('forge create')
    expect(await say('forge create VaultAttacker --constructor-args alice')).toContain('alice n’est pas un contrat')
    expect(await say('cast send vault deposit')).toContain('ajoutez --value')
  })

  it('describes a contract with cast interface', async () => {
    const level = await ChainConsole.start(reentrancy)
    const lines = texts(await level.run('cast interface vault'))
    expect(lines).toContain('balanceOf(address account) view returns (uint256)')
    expect(lines).toContain('cast send vault "deposit()" --value 1ether')
    expect(texts(await level.run('cast interface alice'))).toContain('alice n’est pas un contrat')
  })

  it('explains where the ETH went, and shows event arguments', async () => {
    const level = await ChainConsole.start(reentrancy)
    expect(texts(await level.run('accounts'))).toContain('Alice et Bob ont déposé tous leurs ETH dans le coffre')
    expect(texts(await level.run('cast send vault "deposit()" --value 1ether'))).toContain('event Vault.Deposited(account: mallory, amount: 1 ETH)')
  })

  it('names the custom error of a reverted transaction', async () => {
    const level = await ChainConsole.start(reentrancy)
    expect(texts(await level.run('cast send vault "withdraw()"'))).toContain('NothingToWithdraw')
  })

  it('is solved by the exploit typed in the console', async () => {
    const level = await ChainConsole.start(reentrancy)
    expect(texts(await level.run('forge create VaultAttacker --constructor-args vault'))).toContain('Deployed to')
    const attack = texts(await level.run('cast send attacker "attack()" --value 1ether'))
    expect(attack).toContain('Vault.Withdrawn × 11')
    expect(attack).toContain('mallory : 2 ETH → 12 ETH')
    expect(await level.solved()).toBe(true)
  })

  it('is not solved by an honest deposit and withdrawal', async () => {
    const level = await ChainConsole.start(reentrancy)
    await level.run('cast send vault "deposit()" --value 1ether')
    await level.run('cast send vault "withdraw()"')
    expect(await level.solved()).toBe(false)
  })
})
