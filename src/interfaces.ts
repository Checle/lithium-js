import { Duplex } from 'stream'
import { WriteStream } from 'fs'
import { Input } from './types'

export interface Sequence extends Iterator<Buffer> {
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

  toString(): string
  valueOf(): Buffer
  next (): IteratorResult<Buffer>
  compare (target: any): number
}

export interface Output {
  push (chunk: Input): void
}

export interface Record extends WriteStream {
  position: number
  path: string
}

export interface State {
  transform (input?: Buffer, output?: Sequence): State
}

export interface Container extends Record, Duplex {
  stop (): void
}

export interface Process {
  exec (any)
  fork ()
}
