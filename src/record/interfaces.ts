import { Duplex } from 'stream'
import { WriteStream } from 'fs'

export interface Sequence extends Iterator<Buffer> {
  position: number
  length: number

  read (size?: number): Buffer
  write (chunk: any): boolean
  seek (offset: number): number
  push (chunk: any): void
  unshift (chunk: any): void
  slice(start?: number, end?: number): Buffer
  toString(): string
  valueOf(): Buffer
  next (): IteratorResult<Buffer>
}

export interface Record extends WriteStream {
  position: number
  path: string
}

export interface Container extends Record, Duplex {
  stop (): void
}

export interface State extends Function {
  valueOf(): Buffer // Returns value
  toString(): string // Returns path
}
