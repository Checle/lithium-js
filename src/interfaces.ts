import { Readable, Writable, Duplex } from 'stream'
import { WriteStream } from 'fs'

export interface Comparable {
  compare (target: any): number
}

export interface Seekable {
  seekable: Boolean

  seek (offset: number): number
}

export interface Sequence extends Iterable<Buffer> {
  position: number
  length: number

  read (size?: number): Buffer
  write (chunk: any): boolean
  seek (offset: number): number

  push (chunk: any): void
  unshift (chunk: any): void
  shift (): Buffer
  pop (): Buffer
  slice(start?: number, end?: number): Sequence

  toString (): string
  valueOf (): Buffer
  [Symbol.iterator] (): Iterator<Buffer>
  compare (target: any): number
}

export interface Sink {
  push (chunk: Input): void
}

export interface JS extends Function, Array<any> {
}

export interface Record extends WriteStream {
  position: number
  path: string
}

export interface State {
  /**
   * Creates a new state as a transition of the current state. May alter the
   * current state.
   */
  transform (chunk?: Buffer): State
}

export interface Context extends State, Seekable {
  /**
   * Performs a state transition from the current context state feeding `chunk`
   * to the state machine and returns the resulting state. Updates the context
   * state to the resulting state.
   */
  transform (chunk?: Buffer): State

  /**
   * Reposition state to corresponding to the current input position plus
   * `offset` bytes. A new transition may be invokes if the target position
   * does not match a state boundary.
   */
  seek (offset: number): number
}

export interface Container extends Record, Duplex {
  stop (): void
}

export interface Process {
  exec (any)
  fork (): Process
}

export interface Stream extends Readable, Writable, Seekable { }

export interface Element <T> extends Iterable<T> {
  value: T
  next: Element<T>
  previous: Element<T>
}

export interface Entry <K, V> extends Iterable<V> {
  key: K
  value: V
  next: Entry<K, V>
  previous: Entry<K, V>
}

export interface Tree <K, V> extends Entry<K, V> { // TODO: extends Map, Set
  /**
   * Adds a specified value to the tree so that it will be contained in it.
   * Returns `value` if it has been added to the tree or the existing value if
   * an entry with equal key exists in the tree.
   */
  add (value: V): V

  /**
   * Sets a specified key to the specified value.
   * Returns `value` if the value has been set successfully or the existing
   * value stored under the specified key otherwise.
   */
  set (key: K, value: V): V

  /**
   * Returns true if an equivalent value exists as node of the tree or false otherwise.
   */
  has (key: K): boolean

  /**
   * Returns the node of the tree with the greatest value that is less than or
   * equal to the specified value.
   * If none exists, returns the node with the least overall value.
   */
  find (key: K): Entry<K, V>
}

export type Input = Record | Readable | Buffer | Function | string | any

export type Acceptor = (/*this: interfaces.Sequence,*/ ...buffer: Buffer[]) => any

export type Accessor = (/*this: interfaces.Record,*/ ...inputs: Input[]) => Accessor

export type Slice = Array<any> | Buffer | string
