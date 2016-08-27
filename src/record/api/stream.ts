import { Duplex } from 'stream'
import { State } from 'interfaces'
import InitialState from '../sm/states'
import fork from 'forks'
import Sequence from 'sequence'

@fork export class RecordStream extends Duplex {
  state: State = new InitialState()
  output = new Sequence()

  _read () { }

  _write (chunk: Buffer) {
    try {
      var position = this.output.position
      this.state = this.state.transform(chunk, this.output)
      
    } catch (e) {
      this.end()
    }
  }
}
