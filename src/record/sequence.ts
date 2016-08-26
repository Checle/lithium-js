export default class Sequence {
  private portions: Buffer[]
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
}
