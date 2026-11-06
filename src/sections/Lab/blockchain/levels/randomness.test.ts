import { describe, expect, it } from 'vitest'
import { randomnessLevel as copy } from '../../../../content/lab/blockchain'
import { ChainConsole } from '../console'
import { randomness } from './randomness'

const texts = (lines: { text: string }[]) => lines.map(line => line.text).join('\n')

describe('Blockchain CTF level 3', () => {
  it('starts with a 10 ETH pot and explains how to play', async () => {
    const level = await ChainConsole.start(randomness)
    expect(texts(await level.run('cast balance lottery'))).toBe('10 ETH')
    expect(texts(await level.run('cast call lottery "TICKET_PRICE()"'))).toBe('100000000000000000 (0.1 ETH)')
    expect(texts(await level.run('cast interface lottery'))).toContain('cast send lottery "play(uint256)" 7 --value 0.1ether')
    expect(texts(await level.run('help'))).toContain('cast block')
    expect(texts(await level.run('accounts'))).toContain('La cagnotte de 10 ETH est dans lottery.')
  })

  it('explains a wrong ticket', async () => {
    const level = await ChainConsole.start(randomness)
    expect(texts(await level.run('cast send lottery "play(uint256)" 7 --value 1ether'))).toContain('Un ticket coûte exactement 0,1 ETH')
    expect(texts(await level.run('cast send lottery "play(uint256)" 10 --value 0.1ether'))).toContain('Le chiffre va de 0 à 9.')
    expect(texts(await level.run('forge create LotteryAttacker --constructor-args mallory'))).toContain('forge create LotteryAttacker --constructor-args lottery')
  })

  it('is solved by the attacker, which wins with its first ticket', async () => {
    const level = await ChainConsole.start(randomness)
    expect(texts(await level.run('forge create LotteryAttacker --constructor-args lottery'))).toContain('Raccourci : attacker')
    const won = texts(await level.run('cast send attacker "attack()" --value 0.1ether'))
    expect(won).toMatch(/event Lottery\.Played\(player: attacker, guess: (\d), winningNumber: \1, prize: 10\.1 ETH\)/)
    expect(won).toContain('mallory : 1 ETH → 11 ETH')
    expect(await level.solved()).toBe(true)
    expect(await level.notice()).toBeUndefined()
  })

  it('gives no flag for a lucky ticket, and says why', async () => {
    // Tickets typed by hand until one wins: ten tickets win at least once about two times in three,
    // so a few fresh lotteries are enough.
    for (let attempt = 0; attempt < 30; attempt++) {
      const level = await ChainConsole.start(randomness)
      for (let ticket = 0; ticket < 10; ticket++) {
        const played = texts(await level.run('cast send lottery "play(uint256)" 7 --value 0.1ether'))
        if (!played.includes('lottery : 0 ETH')) continue
        expect(await level.solved()).toBe(false)
        expect(await level.notice()).toBe(copy.luck)
        // The attacker winning back its own ticket afterwards does not turn luck into a flag.
        await level.run('forge create LotteryAttacker --constructor-args lottery')
        await level.run('cast send attacker "attack()" --value 0.1ether')
        expect(await level.solved()).toBe(false)
        return
      }
      expect(await level.notice()).toBe(copy.broke)
    }
    throw new Error('No lucky ticket in 300 tries')
  })
})
