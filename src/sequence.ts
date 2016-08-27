// TODO: must be interatable without deleting portions

import { prototype } from 'decorators'
import fork from 'forks'
import * as interfaces from 'interfaces'

@fork export default class Sequence implements interfaces.Sequence {
  private portions: Buffer[] = []

  position: number
  length: number

  read (size?: number): Buffer { return null }
  write (chunk: any): boolean { return null }
  seek (offset: number): number { return null }

  push (chunk: any): void { return null }
  unshift (chunk: any): void { return null }
  shift (): Buffer { return null }
  pop (): Buffer { return null }
  slice(start?: number, end?: number): Sequence { return null }

  toString(): string { return null }
  valueOf(): Buffer { return null }
  next (): IteratorResult<Buffer> { return null }
  compare (target: any): number { return null }

  /*
  private size: number

  push (...portions: any[]): number {
    for (var portion of portions) {
      if (portion instanceof Buffer) var buffer = portion
      else if (portion instanceof Array) buffer = Buffer.from(portion.join(''))
      else buffer = Buffer.from(String(portion))
      this.size += buffer.length
      this.portions.push(buffer)
    }
    return this.size
  }

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

  valueOf (): Buffer {
    var buffer = new Buffer(this.size)
    for (var offset = 0, i = 0; i < this.portions.length; i++) {
      var portion = this.portions[i]
      portion.copy(buffer, offset)
      offset += portion.length
    }
    this.portions = [buffer]
    return buffer
  }

  compare (target: any): number { return -1 }

  get length (): number {
    return this.size
  }
  */
}
