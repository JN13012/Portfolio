import { formatEther, getAddress, isAddress, parseUnits, type AbiFunction, type AbiParameter, type Hex } from 'viem'
import artifacts from '../../../content/lab/blockchainCtf.json'
import { blockchainHelp, chainConsole as say, contractDocs, errorDocs } from '../../../content/lab/blockchain'
import { LocalChain, type ContractName, type DecodedLog, type TxResult } from './chain'

// The console of the Blockchain CTF: a small subset of Foundry's `cast` and `forge` commands, shared by
// every level. Every command runs on the in-browser chain; nothing is scripted. A level only describes
// its accounts, contracts and goal (levels/*.ts).

/** `help` and `command` lines get shell colours, `code` lines Solidity colours, `tip` lines a coloured command; the others one colour each. */
export type Line = { text: string; tone?: 'muted' | 'ok' | 'error' | 'flag' | 'command' | 'help' | 'code' | 'tip' }

/** Named accounts of a level, in the order `accounts` lists them. */
export type Accounts = Record<string, Hex>

/** The player is always Mallory: the usual name of the active attacker, next to Alice and Bob. */
export const PLAYER = 'mallory'

// Fixed, readable addresses for the people; contract addresses come from the chain.
export const PEOPLE = {
  mallory: '0x0000000000000000000000000000000000BAdBAd',
  alice: '0x000000000000000000000000000000000000a11c',
  bob: '0x0000000000000000000000000000000000000b0b',
  deployer: '0x000000000000000000000000000000000000dE10',
} as const satisfies Accounts

export type LevelDefinition = {
  id: number
  /** The level's copy: help line for accounts, examples, and what each deployable program needs. */
  console: {
    accounts: string
    /** Printed under `accounts`, e.g. where the people's ETH went. */
    accountsNote?: string
    examples: readonly string[]
    programs?: Partial<Record<string, { needs: string; deploy: string }>>
  }
  /** Compiled contracts of this level: `ls`, `cat`, `forge create` and the source panel. */
  contracts: readonly ContractName[]
  /** Whether `help` lists `cast block`: for levels whose contracts read block values. The command always works. */
  blocks?: boolean
  /** Contracts the player may deploy with `forge create`. */
  deployable: readonly ContractName[]
  /** Program name → account name of its deployed copy (`Vault` → `vault`), for messages and shortcuts. */
  aliases: Partial<Record<ContractName, string>>
  /** Accounts whose balance the panel shows, when they exist. */
  balances: readonly string[]
  /** Accounts whose balance is printed after each transaction. */
  watched: readonly string[]
  /** Funds the people, deploys the contracts and returns the named accounts the player can use. */
  setup: (chain: LocalChain) => Promise<Accounts>
  /** `events`: every event of the player's successful transactions so far, oldest first. */
  solved: (chain: LocalChain, accounts: Accounts, events: readonly DecodedLog[]) => Promise<boolean>
  /** A dead end to point out once, e.g. a pot won by luck, which gives no flag. */
  notice?: (chain: LocalChain, accounts: Accounts, events: readonly DecodedLog[]) => Promise<string | undefined>
}

const eth = (wei: bigint) => `${formatEther(wei)} ETH`

export class ChainConsole {
  /** Events of the player's successful transactions, for levels whose goal depends on how it was reached. */
  private readonly events: DecodedLog[] = []

  private constructor(private readonly chain: LocalChain, private readonly level: LevelDefinition, private readonly accounts: Accounts) {}

  static async start(level: LevelDefinition): Promise<ChainConsole> {
    const chain = await LocalChain.create()
    return new ChainConsole(chain, level, await level.setup(chain))
  }

  solved(): Promise<boolean> {
    return this.level.solved(this.chain, this.accounts, this.events)
  }

  notice(): Promise<string | undefined> {
    return this.level.notice?.(this.chain, this.accounts, this.events) ?? Promise.resolve(undefined)
  }

  /** Balances shown in the panel, for the accounts that exist so far. */
  async balances(): Promise<Array<{ name: string; wei: bigint }>> {
    const names = this.level.balances.filter(name => this.accounts[name])
    return Promise.all(names.map(async name => ({ name, wei: await this.chain.balance(this.accounts[name]!) })))
  }

  /** Runs one console line and returns what the terminal prints. */
  async run(input: string): Promise<Line[]> {
    // Typed lines are echoed by the console itself; here only their output.
    const words = tokenize(input)
    const [command, sub] = words
    try {
      if (!command) return []
      if (command === 'help') return this.help()
      if (command === 'ls') return [{ text: this.files().join('    ') }]
      if (command === 'cat') return this.cat(words[1])
      if (command === 'accounts') return await this.listAccounts()
      if (command === 'cast') {
        if (sub === 'interface') return this.castInterface(words[2])
        if (sub === 'balance') return await this.castBalance(words.slice(2))
        if (sub === 'block') return this.castBlock(words.slice(2))
        if (sub === 'call' || sub === 'send') return await this.cast(sub, words.slice(2))
        return [{ text: say.castUsage, tone: 'error' }]
      }
      if (command === 'forge') {
        if (sub === 'create') return await this.forgeCreate(words.slice(2))
        return [{ text: this.level.deployable.length ? say.forgeUsage : say.nothingToDeploy, tone: 'error' }]
      }
      return [{ text: say.unknownCommand(command), tone: 'error' }]
    } catch (error) {
      // Library errors are multi-line and technical: keep their first line only.
      const message = error instanceof Error ? error.message : String(error)
      return [{ text: message.split('\n')[0]!.trim(), tone: 'error' }]
    }
  }

  private help(): Line[] {
    const { accounts, examples } = this.level.console
    return blockchainHelp({ accounts, examples, deploys: this.level.deployable.length > 0, blocks: !!this.level.blocks }).map(text => ({ text, tone: 'help' as const }))
  }

  private files(): string[] {
    return this.level.contracts.map(name => artifacts.contracts[name].file)
  }

  private cat(file?: string): Line[] {
    const name = file && this.level.contracts.find(contract => artifacts.contracts[contract].file.toLowerCase() === file.toLowerCase())
    if (!name) return [{ text: say.fileNotFound(this.files().join(', ')), tone: 'error' }]
    return artifacts.contracts[name].source.trimEnd().split('\n').map(text => ({ text, tone: 'code' as const }))
  }

  private async listAccounts(): Promise<Line[]> {
    const rows = await Promise.all(Object.entries(this.accounts).map(async ([name, address]) => ({ name, address, wei: await this.chain.balance(address) })))
    const note = this.level.console.accountsNote
    return [
      ...rows.map(({ name, address, wei }) => ({ text: `${name.padEnd(9)} ${address}  ${eth(wei)}` })),
      ...(note ? [{ text: note, tone: 'muted' as const }] : []),
    ]
  }

  private async castBalance(args: string[]): Promise<Line[]> {
    const target = this.resolve(args.find(arg => !arg.startsWith('--')))
    return [{ text: eth(await this.chain.balance(target)) }]
  }

  /** The latest block's values that a contract reads as `block.number`, `block.timestamp` and `block.prevrandao`. */
  private castBlock(args: string[]): Line[] {
    if (args.length > 1 || (args[0] && args[0] !== 'latest')) return [{ text: say.blockUsage, tone: 'error' }]
    const { number, timestamp, prevrandao } = this.chain.latestBlock()
    // Labelled as Solidity names them; cast itself prints prevrandao as mixHash.
    return [
      { text: `number      ${number}` },
      { text: `timestamp   ${timestamp} (${new Date(Number(timestamp) * 1000).toISOString().replace('.000Z', 'Z')})` },
      { text: `prevrandao  ${prevrandao}` },
    ]
  }

  /** Lists a contract's functions with their parameter names, what they do and a working command. */
  private castInterface(targetName?: string): Line[] {
    if (!targetName) return [{ text: say.interfaceUsage(this.contractAccounts().join(', ')), tone: 'error' }]
    const target = this.resolve(targetName)
    const contract = this.chain.contractAt(target)
    if (!contract) return [{ text: say.notAContract(targetName, this.contractAccounts().join(', ')), tone: 'error' }]
    const docs = contractDocs[contract] ?? {}
    return [
      { text: `${targetName} (${contract}.sol) :` },
      ...this.chain.functions(target).flatMap(fn => {
        const params = fn.inputs.map(input => `${input.type}${input.name ? ` ${input.name}` : ''}`).join(', ')
        const returns = fn.outputs.length ? ` returns (${fn.outputs.map(output => output.type).join(', ')})` : ''
        const mutability = fn.stateMutability === 'nonpayable' ? '' : ` ${fn.stateMutability}`
        return [
          { text: `  ${fn.name}(${params})${mutability}${returns}` },
          ...(docs[fn.name] ? [{ text: `      ${docs[fn.name]!.summary}`, tone: 'muted' as const }] : []),
          { text: `      ${example(targetName, contract, fn)}`, tone: 'help' as const },
        ]
      }),
    ]
  }

  private async cast(mode: 'call' | 'send', args: string[]): Promise<Line[]> {
    const { positional, value, valueRaw } = parseFlags(args)
    const [targetName, signature, ...rest] = positional
    if (!targetName) return [{ text: say.castModeUsage(mode), tone: 'error' }]
    const target = this.resolve(targetName)
    const contract = this.chain.contractAt(target)
    if (!contract) return [{ text: say.notAContractToCall(targetName, mode, this.contractAccounts().join(', ')), tone: 'error' }]
    const functions = this.chain.functionNames(target).join(', ')
    if (!signature) return [{ text: say.missingFunction(targetName, functions), tone: 'error' }]

    // "name", "name(types)" or "name(types)(return types)", as cast accepts them.
    const parsed = /^(\w+)(?:\(([^()]*)\))?(?:\(([^()]*)\))?$/.exec(signature)
    const fnName = parsed?.[1] ?? signature.replace(/\(.*$/, '')
    const fn = this.chain.functionAbi(target, fnName)
    if (!fn) return [{ text: say.unknownFunction(targetName, fnName, functions), tone: 'error' }]
    const types = fn.inputs.map(input => input.type).join(',')
    const sample = example(targetName, contract, fn)
    if (!parsed || (parsed[2] !== undefined && parsed[2].replace(/\s/g, '') !== types)) {
      return [{ text: say.unknownSignature(signature, sample), tone: 'error' }]
    }

    const readOnly = fn.stateMutability === 'view' || fn.stateMutability === 'pure'
    if (mode === 'call' && !readOnly) return [{ text: say.writes(fnName, sample), tone: 'error' }]
    if (mode === 'send' && readOnly) return [{ text: say.readOnly(fnName, fn.stateMutability, sample), tone: 'error' }]
    if (mode === 'send' && value > 0n && fn.stateMutability !== 'payable') return [{ text: say.notPayable(fnName, sample), tone: 'error' }]
    if (fn.inputs.length !== rest.length) {
      const described = fn.inputs.map(input => {
        const doc = input.name ? contractDocs[contract]?.[fnName]?.params?.[input.name] : undefined
        return `${input.name} (${input.type})${doc ? ` : ${doc}` : ''}`
      }).join(' ; ')
      return [{ text: say.argumentCount(fnName, fn.inputs.length, rest, described, sample), tone: 'error' }]
    }
    const callArgs = rest.map((raw, index) => this.argument(raw, fn.inputs[index]!))
    const exact = parsed[2] === undefined
      ? [{ text: say.exactSyntax(`cast ${mode} ${targetName} "${fnName}(${types})"${rest.map(arg => ` ${arg}`).join('')}${valueRaw ? ` --value ${valueRaw}` : ''}`), tone: 'muted' as const }]
      : []

    if (mode === 'call') {
      const result = await this.chain.read(target, fnName, callArgs)
      return [{ text: this.format(result) }, ...exact]
    }
    const player = this.accounts[PLAYER]!
    const before = await this.chain.balance(player)
    if (value > before) return [{ text: say.insufficient(PLAYER, eth(before), eth(value)), tone: 'error' }]
    const tiny = valueRaw && /^\d+$/.test(valueRaw) && value < 10n ** 15n ? [{ text: say.tinyValue(valueRaw, eth(value)), tone: 'muted' as const }] : []
    const sent = await this.chain.send(player, target, fnName, callArgs, value)
    if (sent.ok) this.events.push(...sent.logs)
    return [...await this.describe(sent, before), ...tiny, ...exact]
  }

  private async forgeCreate(args: string[]): Promise<Line[]> {
    if (!this.level.deployable.length) return [{ text: say.nothingToDeploy, tone: 'error' }]
    const { positional, value, constructorArgs } = parseFlags(args)
    const name = positional[0]?.replace(/^.*:/, '').replace(/\.sol$/, '')
    const program = this.level.contracts.find(contract => contract === name)
    if (!program) return [{ text: say.unknownProgram(this.level.contracts.join(', ')), tone: 'error' }]
    // A second copy of the target would only confuse the level: it is the one already deployed.
    if (!this.level.deployable.includes(program)) {
      return [{ text: say.alreadyDeployed(program, this.level.aliases[program] ?? program, this.level.deployable.join(', ')), tone: 'error' }]
    }
    const guide = this.level.console.programs?.[program]
    const inputs = LocalChain.constructorInputs(program)
    if (constructorArgs.length !== inputs.length) {
      return [{ text: guide && !constructorArgs.length ? say.constructorMissing(program, guide.needs, guide.deploy) : say.constructorCount(program, inputs.length, constructorArgs.length), tone: 'error' }]
    }
    const deployArgs = constructorArgs.map((raw, index) => this.argument(raw, inputs[index]!))
    // A contract-typed parameter must point to a contract: an account would make every later call fail silently.
    for (const [index, input] of inputs.entries()) {
      if (input.internalType?.startsWith('contract ') && !this.chain.contractAt(deployArgs[index] as Hex)) {
        return [{ text: say.argumentNotContract(constructorArgs[index]!, input.name ?? '', input.internalType.replace('contract ', ''), guide?.deploy ?? ''), tone: 'error' }]
      }
    }
    const player = this.accounts[PLAYER]!
    const result = await this.chain.deploy(player, program, deployArgs, value)
    if (!result.ok || !result.createdAddress) return [{ text: say.deployRefused(result.error ?? ''), tone: 'error' }]
    const alias = this.level.aliases[program]
    if (alias) this.accounts[alias] = result.createdAddress
    return [
      { text: `Deployer: ${PLAYER} (${player})` },
      { text: `Deployed to: ${result.createdAddress}`, tone: 'ok' },
      ...(alias ? [{ text: say.shortcut(alias), tone: 'muted' as const }] : []),
    ]
  }

  /** Prints a transaction like `cast send`, plus what it changed. */
  private async describe(result: TxResult, before: bigint): Promise<Line[]> {
    if (!result.ok) {
      const named = result.error && result.error !== 'revert'
      const doc = named && result.errorContract ? errorDocs[`${result.errorContract}.${result.error}`] : undefined
      return [
        { text: named ? say.reverted(result.error!) : say.bareRevert, tone: 'error' },
        ...(doc ? [{ text: doc, tone: 'muted' as const }] : []),
        { text: `gasUsed ${result.gasUsed}`, tone: 'muted' },
      ]
    }
    const lines: Line[] = [{ text: 'status 1 (success)', tone: 'ok' }, { text: `gasUsed ${result.gasUsed}`, tone: 'muted' }]
    // Group identical events, so eleven nested withdrawals read as one line.
    const counts = new Map<string, number>()
    for (const log of result.logs) counts.set(`${log.contract}.${log.event}`, (counts.get(`${log.contract}.${log.event}`) ?? 0) + 1)
    // A single event shows its arguments, e.g. the number a lottery drew; repeated ones only their count.
    for (const [event, count] of counts) {
      const args = count === 1 ? result.logs.find(log => `${log.contract}.${log.event}` === event)!.args : undefined
      const shown = args && Object.keys(args).length ? `(${Object.entries(args).map(([name, value]) => `${name}: ${this.formatArg(value)}`).join(', ')})` : ''
      lines.push({ text: `event ${event}${shown}${count > 1 ? ` × ${count}` : ''}`, tone: 'muted' })
    }
    const after = await this.chain.balance(this.accounts[PLAYER]!)
    if (after !== before) lines.push({ text: `${PLAYER} : ${eth(before)} → ${eth(after)}` })
    for (const name of this.level.watched) {
      if (this.accounts[name]) lines.push({ text: `${name} : ${eth(await this.chain.balance(this.accounts[name]))}` })
    }
    return lines
  }

  /** A returned value as cast prints it, with ETH for amounts and the account's name for addresses. */
  private format(result: unknown): string {
    if (typeof result === 'bigint') return `${result} (${eth(result)})`
    if (typeof result === 'string' && isAddress(result)) {
      if (/^0x0{40}$/.test(result)) return `${result} (${say.zeroAddress})`
      const name = this.accountName(result)
      return name ? `${result} (${name})` : result
    }
    return String(result)
  }

  /** An event argument: an account's name, an amount in ETH, or a small number as it is. */
  private formatArg(value: unknown): string {
    if (typeof value === 'string' && isAddress(value)) return this.accountName(value) ?? value
    // Below a millionth of an ETH, a number is a count or a guess, not an amount.
    if (typeof value === 'bigint') return value >= 10n ** 12n ? eth(value) : String(value)
    return String(value)
  }

  private accountName(address: string): string | undefined {
    return Object.entries(this.accounts).find(([, known]) => known.toLowerCase() === address.toLowerCase())?.[0]
  }

  /** Named accounts that hold a contract. */
  private contractAccounts(): string[] {
    return Object.entries(this.accounts).flatMap(([name, address]) => (this.chain.contractAt(address) ? [name] : []))
  }

  private resolve(name?: string): Hex {
    const known = say.accountsOr(Object.keys(this.accounts))
    if (!name) throw new Error(say.missingAccount(known))
    // Any case is accepted, as cast does; the ABI encoder wants the checksummed form.
    if (isAddress(name, { strict: false })) return getAddress(name)
    if (/^0x/i.test(name)) throw new Error(say.invalidAddress(name))
    // A contract's name is its code, not an address: point to the deployed copy instead.
    const program = this.level.contracts.find(contract => contract === name)
    const alias = program && this.level.aliases[program]
    if (program && alias) {
      if (this.accounts[alias]) throw new Error(say.programNotAddress(program, alias))
      throw new Error(say.programNotDeployed(program, this.level.console.programs?.[program]?.deploy ?? ''))
    }
    const found = this.accounts[name.toLowerCase()]
    if (found) return getAddress(found)
    const undeployed = this.level.contracts.find(contract => this.level.aliases[contract] === name.toLowerCase())
    if (undeployed) throw new Error(say.aliasNotDeployed(name.toLowerCase(), this.level.console.programs?.[undeployed]?.deploy ?? ''))
    throw new Error(say.unknownAccount(name, known))
  }

  /** Converts a typed argument to the parameter's type, with a message naming the parameter when it does not fit. */
  private argument(raw: string, param: AbiParameter): unknown {
    if (param.type === 'address') {
      if (/^\d/.test(raw) && !/^0x/i.test(raw)) throw new Error(say.notAnAddress(raw, param.name ?? ''))
      return this.resolve(raw)
    }
    if (param.type.startsWith('uint')) {
      const amount = parseAmount(raw)
      if (amount === undefined) throw new Error(say.notANumber(raw, param.name ?? '', param.type))
      return amount
    }
    return raw
  }
}

/** A complete, working command for `fn`: sample values from the content, or neutral defaults. */
function example(target: string, contract: ContractName, fn: AbiFunction): string {
  const readOnly = fn.stateMutability === 'view' || fn.stateMutability === 'pure'
  const sample = contractDocs[contract]?.[fn.name]?.sample
  const args = fn.inputs.map((input, index) => ` ${sample?.args?.[index] ?? (input.type === 'address' ? 'mallory' : '1')}`).join('')
  const value = fn.stateMutability === 'payable' ? ` --value ${sample?.value ?? '1ether'}` : ''
  return `cast ${readOnly ? 'call' : 'send'} ${target} "${fn.name}(${fn.inputs.map(input => input.type).join(',')})"${args}${value}`
}

/** Splits a command line on spaces, keeping "quoted signatures(uint256)" whole. */
export function tokenize(line: string): string[] {
  return [...line.trim().matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(match => match[1] ?? match[2] ?? match[3]!)
}

const UNITS = { ether: 18, gwei: 9, wei: 0 } as const

function parseFlags(args: string[]) {
  const positional: string[] = []
  const constructorArgs: string[] = []
  let value = 0n
  let valueRaw: string | undefined
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!
    if (arg === '--value') {
      valueRaw = args[++i]
      if (!valueRaw) throw new Error(say.valueMissing)
      const amount = parseAmount(valueRaw)
      if (amount === undefined) throw new Error(say.invalidAmount(valueRaw))
      // "--value 1 ether" would send 1 wei and pass "ether" as an argument: ask for the joined form.
      const unit = args[i + 1]?.toLowerCase()
      if (unit && unit in UNITS) throw new Error(say.joinUnit(`${valueRaw}${unit}`))
      value = amount
    }
    else if (arg === '--constructor-args') { constructorArgs.push(...args.slice(i + 1)); break }
    else if (arg.startsWith('-')) throw new Error(say.unknownOption(arg))
    else positional.push(arg)
  }
  return { positional, value, valueRaw, constructorArgs }
}

/** `1ether`, `0.5ether`, `2gwei`, `1e18` or a plain amount in wei, as `cast` accepts them; undefined otherwise. */
function parseAmount(raw: string): bigint | undefined {
  const unit = /^(\d+(?:\.\d+)?)(ether|gwei|wei)$/i.exec(raw)
  if (unit) return parseUnits(unit[1]!, UNITS[unit[2]!.toLowerCase() as keyof typeof UNITS])
  if (/^\d+(\.\d+)?e\d+$/.test(raw)) return BigInt(Number(raw))
  if (/^\d+$/.test(raw)) return BigInt(raw)
  return undefined
}
