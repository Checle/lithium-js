// TODO: must be interatable without deleting portions

import {prototype} from './decorators'
import fork from 'object-fork'
import * as interfaces from './interfaces'

@fork export default class Sequence implements interfaces.Sequence {
  constructor (...args) {
    this.push.apply(this, args)
  }

  private list: Buffer[] = []
  private size: number = 0

  position: number
  length: number

  read (size?: number): Buffer { return null }
  write (chunk: any): boolean { return null }
  seek (offset: number): number { return null }

  push (...chunks: any[]): number {
    for (let chunk of chunks) {
      let buffer = null
      if (typeof chunk === 'string') buffer = Buffer.from(chunk)
      else if (chunk instanceof Buffer) buffer = chunk
      else if (chunk instanceof Array) this.push(...chunk)
      else if (Symbol.iterator in chunk) for (let item of chunk) this.push(item)
      else buffer = Buffer.from(String(chunk))
      if (buffer == null) continue

      this.size += buffer.length
      this.list.push(buffer)
    }
    return this.size
  }

  valueOf (): Buffer {
    var buffer = Buffer.concat(this.list, this.size)
    this.list = [buffer]
    return buffer
  }
  toString(): string {
    return String(this.valueOf())
  }

  unshift (chunk: any): void { return null }
  shift (): Buffer { return null }
  pop (): Buffer { return null }
  slice(start?: number, end?: number): Sequence { return null }

  compare (target: any): number { return null }
  [Symbol.iterator] (): Iterator<Buffer> { return null }

  /*
  private size: number


  read (size?: number): Buffer {
    if (this.portions[0].length == size) return this.portions[0]
    var target = new Sequence()
    var start = 0
    while (target.size < size) {
      target.push(this.shift())
      portion.copy(target, start)
      start += portion.length
      size -= portion.length
    }
  }

  shift (): Buffer {
    if (!this.portions.length) return null
    return this.portions.shift()
  }

  compare (target: any): number { return -1 }

  get length (): number {
    return this.size
  }
  */
}
