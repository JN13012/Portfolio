import { parseEther } from 'viem'
import { accessControlLevel as copy } from '../../../../content/lab/blockchain'
import { LocalChain } from '../chain'
import { PEOPLE, type LevelDefinition } from '../console'

// Level 2: Alice's wallet runs behind an ERC-1967 proxy, so its owner is set by initialize() instead of a
// constructor, and nothing stops a second call: Mallory becomes the owner, then withdraws everything.

const ether = (amount: number) => parseEther(String(amount))

export const accessControl: LevelDefinition = {
  id: 2,
  console: copy.console,
  contracts: ['SharedWallet', 'ERC1967Proxy'],
  deployable: [],
  // Both programs run at the same address: the proxy holds the storage, SharedWallet the code.
  aliases: { SharedWallet: 'wallet', ERC1967Proxy: 'wallet' },
  balances: ['mallory', 'wallet'],
  watched: ['wallet'],
  async setup(chain) {
    const { setup } = copy
    await chain.fund(PEOPLE.mallory, ether(setup.player))
    await chain.fund(PEOPLE.alice, ether(setup.alice))
    // As in the repository's test: the proxy runs initialize(alice) in its own storage, at deployment.
    const implementation = (await chain.deploy(PEOPLE.alice, 'SharedWallet')).createdAddress
    if (!implementation) throw new Error('SharedWallet deployment failed')
    const wallet = (await chain.deploy(PEOPLE.alice, 'ERC1967Proxy', [implementation, LocalChain.encodeCall('SharedWallet', 'initialize', [PEOPLE.alice])])).createdAddress
    if (!wallet) throw new Error('Proxy deployment failed')
    chain.useAbi(wallet, 'SharedWallet')
    await chain.transfer(PEOPLE.alice, wallet, ether(setup.alice))
    return { mallory: PEOPLE.mallory, alice: PEOPLE.alice, wallet }
  },
  solved: async (chain, accounts) => (await chain.balance(accounts.wallet!)) === 0n,
}
