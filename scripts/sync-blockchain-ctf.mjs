// Copies the compiled contracts of the Blockchain CTF from the smart-contract-ctf repository into
// src/content/lab/blockchainCtf.json: ABI, creation bytecode and Solidity source, nothing else.
// The portfolio runs exactly these bytecodes in the browser; the repository stays the source of truth.
//
// Usage: build the contracts first (`forge build` in the CTF repository), then
//   npm run sync:blockchain-ctf [path/to/smart-contract-ctf]   (default: ../smart-contract-ctf)
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const REPO = 'JN13012/smart-contract-ctf'
const root = resolve(process.argv[2] ?? join(import.meta.dirname, '..', '..', 'smart-contract-ctf'))

// The contracts each playable level deploys; the levels (src/sections/Lab/blockchain/levels/) pick theirs.
// Fixed versions stay out: the site plays the flaw, the repository shows the fix.
const CONTRACTS = [
  // Level 1, reentrancy.
  { name: 'Vault', source: 'src/01-Reentrancy/Vault.sol' },
  { name: 'VaultAttacker', source: 'src/01-Reentrancy/VaultAttacker.sol' },
  // Level 2, unprotected initializer: the wallet's code, and OpenZeppelin's proxy that runs it.
  { name: 'SharedWallet', source: 'src/02-AccessControl/SharedWallet.sol' },
  { name: 'ERC1967Proxy', source: 'lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol' },
  // Level 3, predictable randomness: the lottery and the contract that predicts its draw.
  { name: 'Lottery', source: 'src/03-Randomness/Lottery.sol' },
  { name: 'LotteryAttacker', source: 'src/03-Randomness/LotteryAttacker.sol' },
]

const commit = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain', '--', 'src'], { encoding: 'utf8' }).trim()
if (dirty) throw new Error(`Uncommitted changes in ${root}/src: commit them so the portfolio points to a real revision.`)

const contracts = Object.fromEntries(CONTRACTS.map(({ name, source }) => {
  const file = source.split('/').at(-1)
  const artifact = JSON.parse(readFileSync(join(root, 'out', file, `${name}.json`), 'utf8'))
  return [name, {
    file,
    path: source,
    abi: artifact.abi,
    bytecode: artifact.bytecode.object,
    source: readFileSync(join(root, source), 'utf8'),
  }]
}))

const out = { repo: REPO, commit, contracts }
writeFileSync(new URL('../src/content/lab/blockchainCtf.json', import.meta.url), JSON.stringify(out, null, 2) + '\n')
console.log(`blockchainCtf.json: ${Object.keys(contracts).join(', ')} at ${REPO}@${commit.slice(0, 7)}`)
