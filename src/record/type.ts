import { Readable } from 'stream'
import { ReadStream, WriteStream } from 'fs'

export type Input = Buffer | string

export interface Sequence<T> extends Iterator<T> {
  position: number
  length: number

  read (size?: number): T
  write (chunk: any): boolean
  seek (offset: number): number
  push (chunk: any): void
  unshift (chunk: any): void
  slice(start?: number, end?: number): T
  toString(): string
  valueOf(): T
  next (): IteratorResult<T>
}

export interface Record extends Sequence<Buffer>, Function {
  path: string
  name: string
}

export class Stream extends Readable implements ReadStream, WriteStream, Sequence<Buffer> {
  path: string
  position: number
  length: number
  seekable: boolean
  readable: boolean
  writable: boolean
  bytesWritten: number

  read (size?: number): Buffer { throw new SystemError('EBADF') }
  write (chunk: Input): boolean { throw new SystemError('EBADF') }
  seek (offset: number): number { throw new SystemError('EBADF') }
  close (): void { throw new SystemError('EBADF') }

  end (): void { }
  unshift (chunk: Input): void { }
  slice(start?: number, end?: number): Buffer { return null }
  valueOf(): Buffer { return null }
  next (): IteratorResult<Buffer> { return { done: true, value: undefined } }

  _read (size: number): void { }
  _write (chunk: Input, encoding: string, callback: Function): void { }

  static isReadable (stream): boolean {
    return stream.readable === true
  }
  static isWritable (stream): boolean {
    return stream.writable === true
  }
}

export class SystemError extends Error implements NodeJS.ErrnoException {
  constructor (public errno?, public syscall?) {
    super()
    this.message = errno
    if ('captureStackTrace' in Error) Error.captureStackTrace(this)
  }

  code = this.errno
  name = 'SystemError'
}
