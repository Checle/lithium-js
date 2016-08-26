import { Duplex } from 'stream'
import Sequence from '../sequence'
import State from '../sm/state'

export class RecordStream extends Duplex {
  state = new State()
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
