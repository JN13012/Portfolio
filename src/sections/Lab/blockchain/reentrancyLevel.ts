import { formatEther, isAddress, parseEther, type Hex } from 'viem'
import artifacts from '../../../content/blockchainCtf.json'
import { blockchainHelp, reentrancyLevel } from '../../../content/blockchainLab'
import { LocalChain, type ContractName, type TxResult } from './chain'

// Level 1 of the Blockchain CTF: the reentrancy vault, driven by a small subset of Foundry's
// `cast` and `forge` commands. Every command runs on the in-browser chain; nothing is scripted.

/** `help` and `command` lines get shell colours, `code` lines Solidity colours; the others one colour each. */
export type Line = { text: string; tone?: 'muted' | 'ok' | 'error' | 'flag' | 'command' | 'help' | 'code' }
export type Accounts = { mallory: Hex; alice: Hex; bob: Hex; deployer: Hex; vault: Hex; attacker?: Hex }

const FILES: Record<string, ContractName> = Object.fromEntries(
  Object.entries(artifacts.contracts).map(([name, contract]) => [contract.file.toLowerCase(), name as ContractName]),
)

// Fixed, readable addresses for the people; contract addresses come from the chain.
const PEOPLE = {
  // Mallory: the usual name of the active attacker in cryptography, next to Alice and Bob.
  mallory: '0x0000000000000000000000000000000000BAdBAd',
  alice: '0x000000000000000000000000000000000000a11c',
  bob: '0x0000000000000000000000000000000000000b0b',
  deployer: '0x000000000000000000000000000000000000dE10',
} as const

const eth = (wei: bigint) => `${formatEther(wei)} ETH`

export class ReentrancyLevel {
  private constructor(private readonly chain: LocalChain, readonly accounts: Accounts) {}

  static async start(): Promise<ReentrancyLevel> {
    const chain = await LocalChain.create()
    const { setup } = reentrancyLevel
    await chain.fund(PEOPLE.mallory, parseEther(String(setup.player)))
    await chain.fund(PEOPLE.alice, parseEther(String(setup.alice)))
    await chain.fund(PEOPLE.bob, parseEther(String(setup.bob)))
    const vault = (await chain.deploy(PEOPLE.deployer, 'Vault')).createdAddress
    if (!vault) throw new Error('Vault deployment failed')
    await chain.send(PEOPLE.alice, vault, 'deposit', [], parseEther(String(setup.alice)))
    await chain.send(PEOPLE.bob, vault, 'deposit', [], parseEther(String(setup.bob)))
    return new ReentrancyLevel(chain, { ...PEOPLE, vault })
  }

  /** The level is solved once the vault holds nothing while it still owes alice and bob. */
  async solved(): Promise<boolean> {
    return (await this.chain.balance(this.accounts.vault)) === 0n
  }

  /** ETH held by the player, the vault and, once deployed, the attacker contract. */
  async balances(): Promise<Array<{ name: string; wei: bigint }>> {
    const names: Array<keyof Accounts> = ['mallory', 'vault', ...(this.accounts.attacker ? ['attacker' as const] : [])]
    return Promise.all(names.map(async name => ({ name, wei: await this.chain.balance(this.accounts[name]!) })))
  }

  /** Runs one console line and returns what the terminal prints. */
  async run(input: string): Promise<Line[]> {
    // Typed lines are echoed by the console itself; here only their output.
    const words = tokenize(input)
    const [command, sub] = words
    try {
      if (!command) return []
      if (command === 'help') return blockchainHelp.map(text => ({ text, tone: 'help' as const }))
      if (command === 'ls') return [{ text: Object.values(artifacts.contracts).map(c => c.file).join('    ') }]
      if (command === 'cat') return this.cat(words[1])
      if (command === 'accounts') return await this.listAccounts()
      if (command === 'cast' && sub === 'balance') return await this.castBalance(words.slice(2))
      if (command === 'cast' && (sub === 'call' || sub === 'send')) return await this.cast(sub, words.slice(2))
      if (command === 'forge' && sub === 'create') return await this.forgeCreate(words.slice(2))
      return [{ text: `Commande inconnue : ${command}. Tapez help.`, tone: 'error' }]
    } catch (error) {
      // Library errors are multi-line and technical: keep their first line only.
      const message = error instanceof Error ? error.message : String(error)
      return [{ text: message.split('\n')[0]!.trim(), tone: 'error' }]
    }
  }

  private cat(file?: string): Line[] {
    const name = file && FILES[file.toLowerCase()]
    if (!name) return [{ text: `cat : fichier introuvable. Fichiers : ${Object.values(artifacts.contracts).map(c => c.file).join(', ')}`, tone: 'error' }]
    return artifacts.contracts[name].source.trimEnd().split('\n').map(text => ({ text, tone: 'code' as const }))
  }

  private async listAccounts(): Promise<Line[]> {
    const names: Array<keyof Accounts> = ['mallory', 'alice', 'bob', 'vault', ...(this.accounts.attacker ? ['attacker' as const] : [])]
    const rows = await Promise.all(names.map(async name => ({ name, wei: await this.chain.balance(this.accounts[name]!) })))
    return rows.map(({ name, wei }) => ({ text: `${name.padEnd(9)} ${this.accounts[name as keyof Accounts]}  ${eth(wei)}` }))
  }

  private async castBalance(args: string[]): Promise<Line[]> {
    const target = this.resolve(args.find(arg => !arg.startsWith('--')))
    return [{ text: eth(await this.chain.balance(target)) }]
  }

  private async cast(mode: 'call' | 'send', args: string[]): Promise<Line[]> {
    const { positional, value } = parseFlags(args)
    const [targetName, signature, ...rest] = positional
    if (!targetName || !signature) return [{ text: `Usage : cast ${mode} <contrat> "<fonction>(<types>)" [arguments]${mode === 'send' ? ' [--value 1ether]' : ''}`, tone: 'error' }]
    const target = this.resolve(targetName)
    if (!this.chain.contractAt(target)) return [{ text: `${targetName} n’est pas un contrat.`, tone: 'error' }]
    const fn = signature.replace(/\(.*$/, '')
    const inputs = this.chain.functionInputs(target, fn)
    if (!inputs) return [{ text: `${targetName} n’a pas de fonction ${fn}. Fonctions : ${this.chain.functionNames(target).join(', ')}`, tone: 'error' }]
    const example = `cast ${mode} ${targetName} "${fn}(${inputs.join(',')})"${inputs.map(type => (type === 'address' ? ' alice' : ' 1')).join('')}`
    const typed = /\((.*)\)$/.exec(signature)?.[1]
    if (typed !== undefined && typed.replace(/\s/g, '') !== inputs.join(',')) {
      return [{ text: `Signature inconnue : ${signature}. Exemple : ${example}`, tone: 'error' }]
    }
    if (inputs.length !== rest.length) {
      return [{ text: `${fn} attend ${inputs.length} argument${inputs.length > 1 ? 's' : ''}${inputs.length ? ` (${inputs.join(', ')})` : ''}. Exemple : ${example}`, tone: 'error' }]
    }
    const callArgs = rest.map(arg => this.argument(arg))
    if (mode === 'call') {
      const result = await this.chain.read(target, fn, callArgs)
      return [{ text: typeof result === 'bigint' ? `${result} (${eth(result)})` : String(result) }]
    }
    const before = await this.chain.balance(this.accounts.mallory)
    return this.describe(await this.chain.send(this.accounts.mallory, target, fn, callArgs, value), before)
  }

  private async forgeCreate(args: string[]): Promise<Line[]> {
    const { positional, value, constructorArgs } = parseFlags(args)
    const name = positional[0]?.replace(/^.*:/, '').replace(/\.sol$/, '') as ContractName | undefined
    if (!name || !(name in artifacts.contracts)) return [{ text: `forge create : contrat inconnu. Contrats : ${Object.keys(artifacts.contracts).join(', ')}`, tone: 'error' }]
    // A second, empty vault would only confuse the level: the target is the one already deployed.
    if (name === 'Vault') return [{ text: 'Le coffre est déjà déployé, à l’adresse « vault ». Ici, seul VaultAttacker est à déployer.', tone: 'error' }]
    if (constructorArgs.length === 0 && name === 'VaultAttacker') return [{ text: 'VaultAttacker attend l’adresse du coffre à attaquer : forge create VaultAttacker --constructor-args vault', tone: 'error' }]
    const result = await this.chain.deploy(this.accounts.mallory, name, constructorArgs.map(arg => this.argument(arg)), value)
    if (!result.ok || !result.createdAddress) return [{ text: `Déploiement refusé : ${result.error}`, tone: 'error' }]
    if (name === 'VaultAttacker') this.accounts.attacker = result.createdAddress
    return [
      { text: `Deployer: mallory (${this.accounts.mallory})` },
      { text: `Deployed to: ${result.createdAddress}`, tone: 'ok' },
      ...(name === 'VaultAttacker' ? [{ text: 'Raccourci : attacker', tone: 'muted' as const }] : []),
    ]
  }

  /** Prints a transaction like `cast send`, plus what it changed. */
  private async describe(result: TxResult, before: bigint): Promise<Line[]> {
    if (!result.ok) return [{ text: `Transaction annulée (revert) : ${result.error}`, tone: 'error' }, { text: `gasUsed ${result.gasUsed}`, tone: 'muted' }]
    const lines: Line[] = [{ text: 'status 1 (success)', tone: 'ok' }, { text: `gasUsed ${result.gasUsed}`, tone: 'muted' }]
    // Group consecutive identical events, so eleven nested withdrawals read as one line.
    const counts = new Map<string, number>()
    for (const log of result.logs) counts.set(`${log.contract}.${log.event}`, (counts.get(`${log.contract}.${log.event}`) ?? 0) + 1)
    for (const [event, count] of counts) lines.push({ text: `event ${event}${count > 1 ? ` × ${count}` : ''}`, tone: 'muted' })
    const after = await this.chain.balance(this.accounts.mallory)
    if (after !== before) lines.push({ text: `mallory : ${eth(before)} → ${eth(after)}` })
    lines.push({ text: `vault : ${eth(await this.chain.balance(this.accounts.vault))}` })
    return lines
  }

  private resolve(name?: string): Hex {
    if (!name) throw new Error('Compte manquant : mallory, alice, bob, vault, attacker ou une adresse 0x…')
    if (isAddress(name)) return name
    // A contract's name is its code, not an address: point to the deployed copy instead.
    if (name === 'Vault') throw new Error('Vault est le nom du programme, pas une adresse : le coffre déployé s’appelle vault.')
    if (name === 'VaultAttacker') throw new Error(this.accounts.attacker
      ? 'VaultAttacker est le nom du programme, pas une adresse : votre exemplaire déployé s’appelle attacker.'
      : 'VaultAttacker est le nom du programme, pas une adresse. Déployez-le d’abord : forge create VaultAttacker --constructor-args vault')
    const known = this.accounts[name.toLowerCase() as keyof Accounts]
    if (!known) throw new Error(name.toLowerCase() === 'attacker' ? 'Aucun attaquant déployé : forge create VaultAttacker --constructor-args vault' : `Compte inconnu : ${name}`)
    return known
  }

  private argument(raw: string): unknown {
    if (/^\d+$/.test(raw)) return BigInt(raw)
    if (/^[\d.]+ether$/.test(raw)) return parseEther(raw.replace('ether', ''))
    return this.resolve(raw)
  }
}

/** Splits a command line on spaces, keeping "quoted signatures(uint256)" whole. */
export function tokenize(line: string): string[] {
  return [...line.trim().matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(match => match[1] ?? match[2] ?? match[3]!)
}

function parseFlags(args: string[]) {
  const positional: string[] = []
  const constructorArgs: string[] = []
  let value = 0n
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!
    if (arg === '--value') value = parseValue(args[++i])
    else if (arg === '--constructor-args') { constructorArgs.push(...args.slice(i + 1)); break }
    else if (arg.startsWith('-')) throw new Error(`Option inconnue : ${arg}. Options : --value, --constructor-args`)
    else positional.push(arg)
  }
  return { positional, value, constructorArgs }
}

/** `1ether`, `0.5ether`, `1e18` or a plain amount in wei, as `cast` accepts them. */
function parseValue(raw?: string): bigint {
  if (!raw) throw new Error('--value attend un montant, par exemple 1ether')
  if (/^[\d.]+ether$/.test(raw)) return parseEther(raw.replace('ether', ''))
  if (/^\d+(\.\d+)?e\d+$/.test(raw)) return BigInt(Number(raw))
  if (/^\d+$/.test(raw)) return BigInt(raw)
  throw new Error(`Montant invalide : ${raw}. Exemple : 1ether`)
}
