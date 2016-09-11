import * as interfaces from '../interfaces'
import { sortedIndexOf, toSlice } from '../utils'
import { Duplex } from 'stream'
import RecordState from './record'

export default Context

export class Context extends Duplex implements interfaces.Context {
  constructor (public state: RecordState) {
    super()
  }

  seekable: boolean = true

  private offset: number = 0
  private offsets: number[] = []
  private states : RecordState[] = []
  private queue: Buffer[] = []

  private immediate () {
    this.state.record(...this.queue.splice(0))
  }

  transform (chunk: Buffer): RecordState {
    var state = this.state.transform(chunk)
    if (state == null) return null
    this.offsets.push(this.offset)
    this.states.push(this.state)
    this.offset += chunk.length
    return (this.state = state)
  }

  seek (offset: number): number {
    throw new Error('Not implemented')
  }

  _write (chunk: Buffer, encoding: string, callback: Function): void {
    this.transform(chunk)
    if (!this.queue.length) {
      setImmediate(this.immediate.bind(this))
    }
    this.queue.push(chunk)
    callback()
  }

  _read (size: number): void {
    let state = this.state
    while ((state = state.transform()) && size > 0) {
      let chunk = toSlice(state.valueOf())
      if (chunk == null) break
      this.push(chunk.length > size ? chunk.slice(0, size) : chunk)
      size -= chunk.length
    }
  }
}
