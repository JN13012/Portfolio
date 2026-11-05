import { createEVM, type EVM } from '@ethereumjs/evm'
import { SimpleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { decodeErrorResult, decodeEventLog, decodeFunctionResult, encodeDeployData, encodeFunctionData, type Abi, type Hex } from 'viem'
import artifacts from '../../../content/blockchainCtf.json'

// A local Ethereum chain running in the browser: a real EVM executing the contracts compiled in the
// smart-contract-ctf repository (src/content/blockchainCtf.json). No network, no wallet, no real ETH.
// Gas is metered but not charged, so balances only move with the ETH the contracts send.

export type ContractName = keyof typeof artifacts.contracts
type Artifact = { abi: Abi; bytecode: string }
const artifact = (name: ContractName) => artifacts.contracts[name] as unknown as Artifact

export type DecodedLog = { contract: string; event: string; args: Record<string, unknown> }
export type TxResult = {
  ok: boolean
  /** Custom error name, or the EVM's reason when the revert carries no data. */
  error?: string
  gasUsed: bigint
  logs: DecodedLog[]
  returnValue?: Hex
  createdAddress?: Hex
}

export class LocalChain {
  private readonly names = new Map<string, ContractName>()

  private constructor(private readonly evm: EVM) {}

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
      const { execResult } = await this.evm.runCall({ to: createAddressFromString(to), data: hexToBytes(encodeFunctionData({ abi, functionName: fn, args })), gasLimit: 1_000_000n })
      if (execResult.exceptionError) throw new Error(execResult.exceptionError.error)
      return decodeFunctionResult({ abi, functionName: fn, data: bytesToHex(execResult.returnValue) as Hex })
    } finally {
      await checkpoint.revert()
    }
  }

  /** Input types of `fn` on the contract at `address`, or undefined when it has no such function. */
  functionInputs(address: Hex, fn: string): string[] | undefined {
    const item = this.abiAt(address).find(entry => entry.type === 'function' && entry.name === fn)
    return item && item.type === 'function' ? item.inputs.map(input => input.type) : undefined
  }

  functionNames(address: Hex): string[] {
    return this.abiAt(address).flatMap(entry => (entry.type === 'function' ? [entry.name] : []))
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
    const { createdAddress, execResult } = await this.evm.runCall({
      caller, origin: caller, to: to ? createAddressFromString(to) : undefined,
      data: hexToBytes(data), value, gasLimit: 30_000_000n,
    })
    // runCall executes a message, not a signed transaction: bump the sender's nonce as a transaction would.
    sender.nonce += 1n
    sender.balance = (await this.evm.stateManager.getAccount(caller))?.balance ?? sender.balance
    await this.evm.stateManager.putAccount(caller, sender)

    const returned = bytesToHex(execResult.returnValue) as Hex
    if (execResult.exceptionError) {
      return { ok: false, error: this.revertReason(returned, to) ?? execResult.exceptionError.error, gasUsed: execResult.executionGasUsed, logs: [] }
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
  private revertReason(data: Hex, to: Hex | undefined): string | undefined {
    if (data === '0x') return undefined
    const order = [to && this.contractAt(to), ...Object.keys(artifacts.contracts)].filter(Boolean) as ContractName[]
    for (const name of order) {
      try {
        return decodeErrorResult({ abi: artifact(name).abi, data }).errorName
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
