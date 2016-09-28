import {EventEmitter} from 'events'
import {Readable, Writable, Duplex} from 'stream'
import {IDMap} from '../util/pool'
import {fork} from '../util/fork'
import Environment from './environment'
import {File, Mode} from './file'

export default class Process extends EventEmitter {
  constructor () {
    super()
    this.files.add(new File(this.input, Mode.Read)) // Standard input
    this.files.add(new File(this.output, Mode.Write)) // Standard output
  }

  @fork private files = new IDMap<File>()
  @fork private processes = new IDMap<Process>()
  @fork private input = new Environment()
  @fork private output = new Environment()

  id: number = this.processes.add(this)

  exit (code: number) {
    if (code) {
      this.input.emit('error')
    }
    this.emit('exit', code)
    // A process is terminated by releasing any references to functions owned by it
    this.files.forEach((file) => file.stream.removeAllListeners())
  }

  fork (): Process {
    var copy = fork(this)
    copy.id = this.processes.add(copy)
    return copy
  }
}
