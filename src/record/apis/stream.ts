import { Duplex } from 'stream'
import Sequence from '../../sequence'
import InitialState from '../sm/states'
import { State } from '../../interfaces'

export class RecordStream extends Duplex {
  state: State = new InitialState()
  output = new Sequence()

  _read () { }

  _write (chunk: Buffer) {
    try {
      this.state = this.state.transform(chunk, this.output)
    } catch (e) {
      this.end()
    }
  }
}
