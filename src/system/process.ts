import {EventEmitter} from 'events'
import fork from 'fork.js'

import {IDMap} from '../util/pool'
import {File, Mode} from './file'
import Readable from '../state/context/readable'
import Writable from '../state/context/writable'
import zone from '../util/zone'
import base from '../base'

export default class Process extends EventEmitter {
  static current: Process = null

  parent: Process = null
  id: number = this.processes.add(this)

  private files = new IDMap<File>()
  private processes = new IDMap<Process>()
  private input = new Readable(base)
  private output = new Writable(base)
  private zone = zone.fork({ name: String(this.id) })

  constructor () {
    super()
    this.files.add(new File(this.input, Mode.Read)) // Standard input
    this.files.add(new File(this.output, Mode.Write)) // Standard output
  }

  run (callback: Function) {
    let current = Process.current
    try {
      Process.current = this
      return this.zone.run(callback) as any
    } finally {
      Process.current = current
    }
  }

  fork (): Process {
    let copy = fork(this)
    copy.id = this.processes.add(copy)
    copy.parent = this
    copy.zone = this.zone.fork({ name: String(copy.id) })
    return copy
  }

  exit (code: number) {
    if (code) {
      this.input.emit('error')
    }
    this.emit('exit', code)

    // Release any references to functions owned by the process
    this.files.forEach(file => file.stream.removeAllListeners())
  }
}
