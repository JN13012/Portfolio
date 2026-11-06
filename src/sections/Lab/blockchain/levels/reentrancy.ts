import { parseEther } from 'viem'
import { reentrancyLevel as copy } from '../../../../content/lab/blockchain'
import { PEOPLE, type LevelDefinition } from '../console'

// Level 1: a vault that pays before it updates its books. Alice and Bob each deposited 5 ETH;
// Mallory deploys VaultAttacker against it and empties it through reentrant withdrawals.

const ether = (amount: number) => parseEther(String(amount))

export const reentrancy: LevelDefinition = {
  id: 1,
  console: copy.console,
  contracts: ['Vault', 'VaultAttacker'],
  deployable: ['VaultAttacker'],
  aliases: { Vault: 'vault', VaultAttacker: 'attacker' },
  balances: ['mallory', 'vault', 'attacker'],
  watched: ['vault'],
  async setup(chain) {
    const { setup } = copy
    await chain.fund(PEOPLE.mallory, ether(setup.player))
    await chain.fund(PEOPLE.alice, ether(setup.alice))
    await chain.fund(PEOPLE.bob, ether(setup.bob))
    const vault = (await chain.deploy(PEOPLE.deployer, 'Vault')).createdAddress
    if (!vault) throw new Error('Vault deployment failed')
    await chain.send(PEOPLE.alice, vault, 'deposit', [], ether(setup.alice))
    await chain.send(PEOPLE.bob, vault, 'deposit', [], ether(setup.bob))
    return { mallory: PEOPLE.mallory, alice: PEOPLE.alice, bob: PEOPLE.bob, vault }
  },
  // Solved once the vault holds nothing while it still owes Alice and Bob.
  solved: async (chain, accounts) => (await chain.balance(accounts.vault!)) === 0n,
}
