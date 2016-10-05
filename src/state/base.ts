import {sortedIndexOf, toBuffer} from '../utils'
import RecordState from './record'
import FunctionState from './function'
import BufferState from './buffer'
import StreamState from './stream'

export default class BaseState extends RecordState {
  private states = new Map<Buffer, RecordState>()
  private buffers: Buffer[] = []

  /**
   * Creates a contextual record state from an input value.
   */
  resolve (input): RecordState {
    let chunk = toBuffer(input)
    if (chunk) return new BufferState(chunk, this)
    if (typeof input === 'function') return new FunctionState(input, this)
    return new StreamState(input, this)
  }

  get (path: Buffer) {
    let index = sortedIndexOf(this.buffers, path)
    if (index === 0) return null

    let chunk = this.buffers[index - 1]
    if (chunk.compare(path, 0, chunk.length) !== 0) return null

    return this.states.get(chunk).get(path.slice(chunk.length))
  }

  record (...inputs): RecordState {
    if (!inputs.length) return this

    let input = inputs[0]
    let state = this.resolve(input)

    // Search target child
    let index = sortedIndexOf(this.buffers, state.chunk)
    let result: RecordState

    if (index > 0) {
      let chunk = this.buffers[index - 1]
      let target = this.states.get(chunk)

      if (chunk.equals(state.chunk)) return target.record(...inputs.slice(1))

      result = target.record(...inputs)
    } else {
      result = state.record(...inputs.slice(1))
    }

    // Insert child
    this.buffers.splice(index, 0, state.chunk)
    this.states.set(state.chunk, result)

    // Chunk is the highest value
    if (index === this.buffers.length) {
      this.next = state
      this.emit('data', state.chunk)
    }

    return result
  }
}
