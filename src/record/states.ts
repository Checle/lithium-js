import Tree from '../util/tree'
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
  constructor () {
    super({ objectMode: true })
    this.on('error', this.error)
    this.on('finish', this.finish)
  }

  protected target: State = null
  protected stack: State[] = []
  protected verified: boolean

  private immediates = []

  error (): void {
    if (this.verified != null) return
    this.verified = false
    this.end()
  }
  finish (): void {
    if (this.verified != null) return
    this.verified = true
  }

  /**
   * Makes the object-mode readable behave like not in object mode.
   */
  _read (size) {
    var list: Buffer[] = []
    var length = 0

    var chunk = this.read()
    if (chunk == null) return null
    if (chunk.length == size) return chunk
    if (chunk.length > size) return chunk.slice(0, size)
    do {
      let buffer = toBuffer(chunk)
      if (buffer == null) continue // Skip objects
      length += buffer.length
      list.push(buffer)
    } while (length < size && (chunk = this.read()) != null)

    var buffer = Buffer.concat(list, length)
    if (length > size) {
      this.unshift(buffer.slice(size))
      buffer = buffer.slice(0, size)
    }
    this.unshift(buffer)
  }
  _write (chunk: Input, encoding: string, callback: Function): void {
    function immediate () {
      try { this.record(...this.immediates) }
      finally { this.immediates = [] }
    }
    if (!this.immediates.length) setImmediate(immediate.bind(this))
    this.immediates.push(chunk)
    callback()
  }

  transform (chunk: Buffer): State {
    if (this.target) return this.target.transform(chunk)
    return new BufferState(chunk)
  }

  acquire (target: State): void {
    if (this.target === target || target === this) return
    if (this.target) {
      this.unpipe(this.target)
      this.stack.push(this.target)
    }
    this.target = target
    this.pipe(target)
  }
  release (): void {
    if (this.target) this.unpipe(this.target)
    this.target = this.stack.pop()
    this.pipe(this.target)
  }

  resolve (input: Input): State {
    // Undefined identity causes no state transition
    if (input === undefined) return this
    if (input === false) throw new RangeError() // TODO: add message or move

    var buffer = toBuffer(input)
    if (buffer) return this.transform(buffer)

    // Functions are not evaluated so branch
    if (typeof input === 'function') return new FunctionState(this, input)
    if (input.readable === true) (input as Readable).pipe(this)
    if (input.writable === true) return new WritableState(input)
    return this
  }

  process (): State {
    var inputs: Input[] = []
    var input: Input
    while ((input = this.read())) inputs.push(input)
    return this.record(inputs)
  }

  record (...inputs: Input[]): State {
    var input = inputs.shift()
    var target = this.resolve(input)
    if (inputs.length) target = target.record(...inputs)
    this.acquire(target)
    return target
  }
}

class TreeState extends State {
  constructor () {
    super()
  }

  private tree = new Tree<Buffer>()
  map = new Map<Buffer, State>()

  finish (): void {
    super.finish()
    if (!this.verified || !this.target) return

    var value: Buffer = this.target.read()
    this.release()
    this.tree.add(value)
    this.map.set(value, new TreeState())
  }

  select (value: Buffer) {
    var match = this.tree.find(value) // Get the greatest item less than or equal `value`
    if (match == null) return null

    var prefix = getCommonPrefix(match, value)
    // TODO: select match.next if prefix longer

    return this.map.get(match).transform(value.slice(prefix.length))
  }

  transform (chunk: Buffer): State {
    if (chunk == null || !chunk.length) return this
    var target

    target = this.select(chunk)
    if (target) return target

    return super.transform(chunk)
  }
}

class WritableState extends State {
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

class BufferState extends State {
  constructor (...inputs: Buffer[]) {
    super()
    for (let input of inputs) this.push(input)
  }
  
  _write (chunk: any, encoding: string, callback: Function): void {
    var buffer = toBuffer(chunk)
    if (buffer) this.push(buffer)
    callback()
  }

}
