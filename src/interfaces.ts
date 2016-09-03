import { Readable, Duplex } from 'stream'
import { WriteStream } from 'fs'

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
  transform (output: Sink, input: Buffer): State
}

export interface Container extends Record, Duplex {
  stop (): void
}

export interface Process {
  exec (any)
  fork (): Process
}

export interface Tree <T> {
  /**
   * Add a given value to the tree so that it will be contained in the tree.
   * Return true if the value has been added or false if it already has been contained in the tree.
   */
  add (value: T): boolean
  /**
   * Return if an equivalent value exists as node of the tree.
   */
  contains (value: T): boolean
  /**
   * Return the node of the tree with greatest value that is less than or equal to the given value.
   * If none exists, return the node with least overall value.
   */
  find (value: T): Tree<T>
}


export type Input = Record | Readable | Buffer | Function | string | any

export type Acceptor = (/*this: interfaces.Sequence,*/ ...buffer: Buffer[]) => any

export type Accessor = (/*this: interfaces.Record,*/ ...inputs: Input[]) => Accessor
