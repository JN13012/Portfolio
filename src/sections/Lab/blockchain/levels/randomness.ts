import { parseEther } from 'viem'
import { randomnessLevel as copy } from '../../../../content/lab/blockchain'
import type { DecodedLog } from '../chain'
import { PEOPLE, type Accounts, type LevelDefinition } from '../console'

// Level 3: a lottery draws its number from block.prevrandao, block.timestamp and the player's address.
// A ticket typed in the console cannot know the block it will land in; LotteryAttacker runs inside that
// block, computes the same number and always wins. The flag asks for that certainty, not for luck.

const ether = (amount: number) => parseEther(String(amount))
const TICKET = ether(0.1)

/** The pot was won: by whom, according to the lottery's own event. */
const winner = (accounts: Accounts, events: readonly DecodedLog[]) => {
  const won = events.find(log => log.contract === 'Lottery' && log.event === 'Played' && (log.args.prize as bigint) > 0n)
  const player = (won?.args.player as string | undefined)?.toLowerCase()
  return player === undefined ? undefined : player === accounts.attacker?.toLowerCase() ? 'attacker' : 'hand'
}

export const randomness: LevelDefinition = {
  id: 3,
  console: copy.console,
  blocks: true,
  contracts: ['Lottery', 'LotteryAttacker'],
  deployable: ['LotteryAttacker'],
  aliases: { Lottery: 'lottery', LotteryAttacker: 'attacker' },
  balances: ['mallory', 'lottery', 'attacker'],
  watched: ['lottery'],
  async setup(chain) {
    const { setup } = copy
    await chain.fund(PEOPLE.mallory, ether(setup.player))
    await chain.fund(PEOPLE.deployer, ether(setup.pot))
    const lottery = (await chain.deploy(PEOPLE.deployer, 'Lottery', [], ether(setup.pot))).createdAddress
    if (!lottery) throw new Error('Lottery deployment failed')
    return { mallory: PEOPLE.mallory, lottery }
  },
  // Solved once the attacker contract has won the pot: the certain win, not a lucky ticket.
  solved: async (_chain, accounts, events) => winner(accounts, events) === 'attacker',
  async notice(chain, accounts, events) {
    if (winner(accounts, events) === 'hand') return copy.luck
    return (await chain.balance(accounts.mallory!)) < TICKET ? copy.broke : undefined
  },
}
