import {Writable} from 'stream'

import RecordState from '../record'

/**
 * A state machine context that can be fed as a write stream.
 */
export default class WritableContext extends Writable {
  private queue: Buffer[] = []

  constructor (private state: RecordState) {
    super()
    this.on('error', this.error)
  }

  transform (chunk: Buffer): RecordState {
    return (this.state = this.state.record(chunk))
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

  private immediate () {
    // Record queued chunks and flush queue
    this.state.record(...this.queue.splice(0))
  }

  private error () {
    this.end()
  }
}
