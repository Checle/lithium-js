import { State } from '../interfaces'
import { toBuffer } from '../utils'
import FunctionState from './function'

export default class RecordState implements State {
  transform (chunk?: Buffer): RecordState {
    return this
  }

  resolve (input: any): RecordState {
    // Undefined identity causes no state transition
    if (input === undefined) return this

    let buffer = toBuffer(input)
    if (buffer) return this.transform(buffer)

    if (typeof input === 'function') return new FunctionState(input, this)
    // TODO: handle stream
    return this
  }

  /**
   * Executes arbitrary arguments on the current state, yielding a new state.
   */
  record (...inputs: any[]): RecordState {
    let input = inputs.shift()
    let target = this.resolve(input)
    if (inputs.length) target = target.record(...inputs)
    return target
  }
}
