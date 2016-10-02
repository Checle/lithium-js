import * as interfaces from '../interfaces'
import {sortedIndexOf} from '../utils'
import {fork} from '../util/fork'
import {Duplex} from 'stream'
import RecordState from './record'

export default Context

class Transition {
  constructor (public offset: number, public state: RecordState, public chunk: Buffer = new Buffer(0)) { }
  valueOf () { return this.offset }
}

/**
 * A state machine context that can be fed as a write stream.
 */
export class Context extends Duplex implements interfaces.Context {
  seekable: boolean = true

  private transition = new Transition(0, this.initial)
  private transitions: Transition[] = [this.transition]
  private index: number = 1
  private queue: Buffer[] = []

  constructor (public initial: RecordState) {
    super()
  }

  transform (chunk: Buffer): RecordState {
    let transition = this.transition
    let state = fork(transition.state).transform(chunk)
    if (state == null) return null
    transition.chunk = chunk
    this.transition = new Transition(transition.offset + chunk.length, state)
    this.transitions.splice(this.index++, 0, this.transition)
    return state
  }

  seek (position: number): number {
    let offset = this.transition.offset + position
    if (!position) return offset

    // Find state at or before `offset`
    let index = sortedIndexOf(this.transitions, offset + 1)
    if (index < 0) return null

    // Move pointer to target transition
    let transition = this.transition = this.transitions[index - 1]
    this.index = index

    if (transition.offset < offset) {
      // Perform a partial transition if necessary
      this.transform(transition.chunk.slice(0, offset - transition.offset))
    }
    return offset
  }

  _write (chunk: Buffer, encoding: string, callback: Function): void {
    if (!this.queue.length) {
      // Schedule queue to be worked off
      setImmediate(this.immediate.bind(this))
    }
    // Queue chunks pushed during the same tick
    this.queue.push(chunk)
    callback()
  }

  _read (size: number): void {
    while (this.index < this.transitions.length && size > 0) {
      this.transition = this.transitions[this.index++]
      let chunk = this.transition.chunk
      if (chunk.length > size) {
      // Perform a partial transition if necessary
        this.transform(chunk.slice(0, size))
      }
      chunk = this.transition.chunk
      // Add chunk to readable queue
      this.push(chunk)
      size -= chunk.length
    }
  }

  private immediate () {
    // Record queued chunks and flush queue
    this.transition.state.record(...this.queue.splice(0))
  }
}
