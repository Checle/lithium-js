import {EventEmitter} from 'events'

import * as types from '../types'
import {toBuffer} from '../utils'

abstract class RecordState extends EventEmitter implements types.State {
  next: RecordState = null
  accessor: types.Record

  constructor (public value?, public owner: RecordState = null, public chunk: Buffer = toBuffer(value)) {
    super()

    let accessor: any = (...inputs) => {
      if (!inputs.length) return this.next && this.next.accessor
      return this.record(...inputs).accessor
    }

    Object.defineProperties(accessor, {
      path: { get: () => this.path },
      name: { get: () => String(this.value) },
      position: { get: () => this.position },
    })
    accessor.valueOf = () => this.next && this.next.value
    accessor.toString = () => String(this.valueOf())

    this.accessor = accessor
  }

  valueOf = () => this.value

  get path (): string {
    return (this.owner ? this.owner.path : '') + this.chunk
  }

  get position (): number {
    return this.owner ? this.owner.position + this.owner.chunk.length : 0
  }

  transform (chunk?: Buffer): RecordState {
    return this.record(chunk)
  }

  /**
   * Executes arbitrary arguments on the current state, yielding a new state.
   */
  abstract record (...inputs): RecordState
}

export default RecordState
