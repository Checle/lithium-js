import {Readable} from 'stream'

import RecordState from '../record'

/**
 * A state machine context that implements a read stream.
 */
export default class ReadableContext extends Readable {
  constructor (private state: RecordState) {
    super()
    this.push(state.chunk)
  }

  _read (size: number): void {
    while (size > 0 && this.state.next) {
      this.state = this.state.next
      this.push(this.state.chunk)
      size -= this.state.chunk.length
    }
  }
}
