import { Duplex } from 'stream'
import { State, Sink } from '../../interfaces'
import { CodeState, StateContext } from '../sm/states'
import fork from '../../forks'
import Sequence from '../../sequence'

@fork export class RecordStream extends Duplex {
  context = new StateContext(this, new CodeState())

  _read () { }

  _write (chunk: Buffer, encoding: string, callback: Function) {
    try {
      this.context.push(chunk)
    } catch (e) {
      this.end()
      return
    }
    callback()
  }
}
