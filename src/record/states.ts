import Tree from '../util/tree.ts'
import { Duplex, Readable, Writable } from 'stream'
import { Input, Accessor, Acceptor } from '../interfaces'
import { getCommonPrefix } from '../utils'

function toBuffer (value: any): Buffer {
  if (Buffer.isBuffer(value)) return value
  if (typeof value === 'number') value = String.fromCharCode(value)
  if (typeof value === 'string') return Buffer.from(value)
  return null
}

class State extends Duplex {
  transform (chunk: Buffer): State {
    var target = this.record(chunk)
    return null
  }

  acquire (target: State) {
    if (target === this.target) return
    if (this.target) this.unpipe(this.target)
    this.pipe(target)
    this.target = target
  }

  protected target: State
  protected verified: boolean

  error () {
    if (this.verified == null) this.verified = false
  }
  finish () {
    if (this.verified == null) this.verified = true
  }

  resolve (input: Input): State {
    // Identity undefined causes no state transition
    if (input === undefined) return null

    var buffer = toBuffer(input)
    if (buffer) return this.transform(buffer)

    // Functions are not evaluated so branch
    if (typeof input === 'function') return new FunctionState(this, input)
    if (input.readable === true) (input as Readable).pipe(this)
    if (input.writable === true) return new TargetState(input)
    return null
  }
  record (...inputs: Input[]): State {
    var input = inputs.shift()
    var target = this.resolve(input) || this
    if (inputs.length) return target.record(...inputs)
    return target
  }
}

class TargetState extends State {
  constructor (private destination: Writable) {
    super()
    this.pipe(destination)
  }
}

class FunctionState extends State {
  constructor (private scope: State, private acceptor: Function) {
    super()
  }

  transform (chunk: Buffer): State {
    return this.record(chunk)
  }

  record (...inputs: Input[]): State {
    try {
      // Evoke acceptor with raw queue
      inputs[0] = this.acceptor(...inputs)
    } catch (error) {
      this.emit('error', error)
      this.end()
      throw error
    }
    return super.record(...inputs)
  }
}

class TreeState extends State {
  constructor (private value?: Buffer) {
    super()
  }

  private tree = new Tree<Buffer>()
  private map = new Map<Buffer, State>()

  select (value: Buffer) {
    var match = this.tree.find(value) // Get the greatest item less than or equal `value`
    if (match == null) return null

    var prefix = getCommonPrefix(match, value)
    return this.map.get(match).transform(value.slice(prefix.length))
  }

  transform (chunk: Buffer): State {
    var target

    if (chunk == null || !chunk.length) return this

    target = this.select(chunk)
    if (target) return target

    target = this.resolve(chunk)
    if (target) this.acquire(target)

    return this
  }
}
