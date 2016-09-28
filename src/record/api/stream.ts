import {Duplex} from 'stream'
import {State, Sink} from '../../interfaces'
import {CodeState, StateContext} from '../sm/states'
import fork from 'object-fork'
import Sequence from '../../sequence'

@fork export class RecordStream extends Duplex {
  state = new StateContext(this, new CodeState())

  _read () { }

  _write (chunk: Buffer, encoding: string, callback: Function) {
    try {
      this.state.push(chunk)
    } catch (e) {
      this.end()
      return
    }
    callback()
  }
}
