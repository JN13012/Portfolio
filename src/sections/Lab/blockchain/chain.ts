import { createEVM, type EVM, type EVMRunCallOpts } from '@ethereumjs/evm'
import { SimpleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, bytesToHex, createAddressFromString, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { decodeErrorResult, decodeEventLog, decodeFunctionResult, encodeDeployData, encodeFunctionData, type Abi, type AbiFunction, type AbiParameter, type Hex } from 'viem'
import artifacts from '../../../content/lab/blockchainCtf.json'

// A local Ethereum chain running in the browser: a real EVM executing the contracts compiled in the
// smart-contract-ctf repository (src/content/lab/blockchainCtf.json). No network, no wallet, no real ETH.
// Gas is metered but not charged, so balances only move with the ETH the contracts send.
// Each transaction is mined in its own block, as on a quiet chain: number + 1, 12 seconds later, and a
// fresh random `prevrandao`. Contracts that read block values (level 3's lottery) see them change.

export type ContractName = keyof typeof artifacts.contracts
type Artifact = { abi: Abi; bytecode: string }
const artifact = (name: ContractName) => artifacts.contracts[name] as unknown as Artifact

export type DecodedLog = { contract: string; event: string; args: Record<string, unknown> }
/** What `cast block` shows of a block: the values a contract reads as `block.number`, `block.timestamp`… */
export type BlockInfo = { number: bigint; timestamp: bigint; prevrandao: Hex }

/** The block header the EVM reads; the library does not export its type. */
type Block = NonNullable<EVMRunCallOpts['block']>

/** Seconds between two blocks, as on Ethereum since the merge. */
const BLOCK_TIME = 12n

export type TxResult = {
  ok: boolean
  /** Custom error name, or the EVM's reason when the revert carries no data. */
  error?: string
  /** Contract whose ABI declares `error`, when it is a custom error. */
  errorContract?: ContractName
  gasUsed: bigint
  logs: DecodedLog[]
  returnValue?: Hex
  createdAddress?: Hex
}

export class LocalChain {
  private readonly names = new Map<string, ContractName>()
  /** The latest mined block: reads run against it, the next transaction gets a new one. */
  private block: Block

  private constructor(private readonly evm: EVM) {
    this.block = makeBlock(1n, BigInt(Math.floor(Date.now() / 1000)))
  }

  /** The latest block, as `cast block latest` prints it. */
  latestBlock(): BlockInfo {
    const { number, timestamp, prevRandao } = this.block.header
    return { number, timestamp, prevrandao: bytesToHex(prevRandao) as Hex }
  }

  static async create(): Promise<LocalChain> {
    return new LocalChain(await createEVM({ stateManager: new SimpleStateManager() }))
  }

  async fund(address: Hex, wei: bigint): Promise<void> {
    const state = this.evm.stateManager
    const at = createAddressFromString(address)
    const account = (await state.getAccount(at)) ?? new Account()
    account.balance = wei
    await state.putAccount(at, account)
  }

  async balance(address: Hex): Promise<bigint> {
    return (await this.evm.stateManager.getAccount(createAddressFromString(address)))?.balance ?? 0n
  }

  /** Deploys `name` from `from`. The new address follows the sender's nonce, as on a real chain. */
  async deploy(from: Hex, name: ContractName, args: readonly unknown[] = [], value = 0n): Promise<TxResult> {
    const { abi, bytecode } = artifact(name)
    const data = encodeDeployData({ abi, bytecode: bytecode as Hex, args })
    const result = await this.run(from, undefined, data, value)
    if (result.ok && result.createdAddress) this.names.set(result.createdAddress.toLowerCase(), name)
    return result
  }

  /**
   * Makes the contract at `address` answer with the ABI of `name`. For a proxy: its own ABI has no
   * functions, every call is forwarded to the implementation, so it is used with the implementation's
   * ABI, as `cast` is given it. Events emitted through the proxy are decoded with that ABI too.
   */
  useAbi(address: Hex, name: ContractName): void {
    this.names.set(address.toLowerCase(), name)
  }

  /** Calldata calling `fn` of contract `name`, e.g. the initializer a proxy runs when it is deployed. */
  static encodeCall(name: ContractName, fn: string, args: readonly unknown[] = []): Hex {
    return encodeFunctionData({ abi: artifact(name).abi, functionName: fn, args })
  }

  /** Sends plain ETH, without calldata: a contract receives it in its `receive` function. */
  async transfer(from: Hex, to: Hex, value: bigint): Promise<TxResult> {
    return this.run(from, to, '0x', value)
  }

  /** Sends a transaction calling `fn` on the contract at `to`. */
  async send(from: Hex, to: Hex, fn: string, args: readonly unknown[] = [], value = 0n): Promise<TxResult> {
    const abi = this.abiAt(to)
    return this.run(from, to, encodeFunctionData({ abi, functionName: fn, args }), value)
  }

  /** Reads a view function without changing any state. */
  async read(to: Hex, fn: string, args: readonly unknown[] = []): Promise<unknown> {
    const abi = this.abiAt(to)
    const checkpoint = this.evm.stateManager
    await checkpoint.checkpoint()
    try {
      const { execResult } = await this.evm.runCall({ to: createAddressFromString(to), data: hexToBytes(encodeFunctionData({ abi, functionName: fn, args })), gasLimit: 1_000_000n, block: this.block })
      if (execResult.exceptionError) throw new Error(execResult.exceptionError.error)
      return decodeFunctionResult({ abi, functionName: fn, data: bytesToHex(execResult.returnValue) as Hex })
    } finally {
      await checkpoint.revert()
    }
  }

  /** ABI entry of `fn` on the contract at `address`, or undefined when it has no such function. */
  functionAbi(address: Hex, fn: string): AbiFunction | undefined {
    return this.functions(address).find(entry => entry.name === fn)
  }

  functions(address: Hex): AbiFunction[] {
    return this.abiAt(address).filter((entry): entry is AbiFunction => entry.type === 'function')
  }

  functionNames(address: Hex): string[] {
    return this.functions(address).map(entry => entry.name)
  }

  /** Constructor parameters of a compiled contract, with their Solidity types (`contract IVault`…). */
  static constructorInputs(name: ContractName): readonly AbiParameter[] {
    const item = artifact(name).abi.find(entry => entry.type === 'constructor')
    return item && item.type === 'constructor' ? item.inputs : []
  }

  contractAt(address: Hex): ContractName | undefined {
    return this.names.get(address.toLowerCase())
  }

  private abiAt(address: Hex): Abi {
    const name = this.contractAt(address)
    if (!name) throw new Error(`No contract at ${address}`)
    return artifact(name).abi
  }

  private async run(from: Hex, to: Hex | undefined, data: Hex, value: bigint): Promise<TxResult> {
    const caller = createAddressFromString(from)
    const sender = (await this.evm.stateManager.getAccount(caller)) ?? new Account()
    // One block per transaction: what the transaction reads in `block.*` is only known once it is mined.
    this.block = makeBlock(this.block.header.number + 1n, this.block.header.timestamp + BLOCK_TIME)
    const { createdAddress, execResult } = await this.evm.runCall({
      caller, origin: caller, to: to ? createAddressFromString(to) : undefined,
      data: hexToBytes(data), value, gasLimit: 30_000_000n, block: this.block,
    })
    // runCall executes a message, not a signed transaction: bump the sender's nonce as a transaction would.
    sender.nonce += 1n
    sender.balance = (await this.evm.stateManager.getAccount(caller))?.balance ?? sender.balance
    await this.evm.stateManager.putAccount(caller, sender)

    const returned = bytesToHex(execResult.returnValue) as Hex
    if (execResult.exceptionError) {
      const reason = this.revertReason(returned, to)
      return { ok: false, error: reason?.name ?? execResult.exceptionError.error, errorContract: reason?.contract, gasUsed: execResult.executionGasUsed, logs: [] }
    }
    return {
      ok: true,
      gasUsed: execResult.executionGasUsed,
      logs: (execResult.logs ?? []).map(([address, topics, logData]) => this.decodeLog(address, topics, logData)),
      returnValue: returned,
      createdAddress: createdAddress ? (createdAddress.toString() as Hex) : undefined,
    }
  }

  /** Names a custom error by trying every known ABI: the revert may come from a nested contract. */
  private revertReason(data: Hex, to: Hex | undefined): { contract: ContractName; name: string } | undefined {
    if (data === '0x') return undefined
    const order = [to && this.contractAt(to), ...Object.keys(artifacts.contracts)].filter(Boolean) as ContractName[]
    for (const name of order) {
      try {
        return { contract: name, name: decodeErrorResult({ abi: artifact(name).abi, data }).errorName }
      } catch { /* not this contract's error */ }
    }
    return undefined
  }

  private decodeLog(address: Uint8Array, topics: Uint8Array[], data: Uint8Array): DecodedLog {
    const at = new Address(address).toString() as Hex
    const name = this.contractAt(at)
    try {
      if (!name) throw new Error('unknown emitter')
      const decoded = decodeEventLog({ abi: artifact(name).abi, topics: topics.map(t => bytesToHex(t)) as [Hex, ...Hex[]], data: bytesToHex(data) as Hex })
      return { contract: name, event: decoded.eventName ?? '?', args: (decoded.args ?? {}) as Record<string, unknown> }
    } catch {
      return { contract: name ?? at, event: 'Log', args: {} }
    }
  }
}

/** A block header with the fields the EVM reads; `prevrandao` is random, as the beacon chain makes it. */
function makeBlock(number: bigint, timestamp: bigint): Block {
  return {
    header: {
      number, timestamp,
      coinbase: createZeroAddress(),
      difficulty: 0n,
      prevRandao: crypto.getRandomValues(new Uint8Array(32)),
      gasLimit: 30_000_000n,
      getBlobGasPrice: () => undefined,
    },
  }
}
