import * as path from 'path'
import Syscalls from './syscalls'
import {IDMap} from '../utils/pool'

export const processes = new IDMap<Process>()

export default class Process {
  static current: Process = Object.create({
    id: null,
    owner: 0,
    group: 0,
    cwd: process.cwd(),
    arguments: process.argv.slice(1),
    path: process.execPath,
    actions: [],
  }) as any

  owner: number
  group: number
  cwd: string // Current working directory
  path: string
  context: any
  actions: {[signo: number]: any}
  arguments: string[] = null

  id = processes.add(this)
  files = new IDMap<File>(this.parent.files)
  loader = new System.constructor()
  worker: Worker = null
  syscalls = new Syscalls(this)

  constructor (public parent: Process) {
    if (parent) {
      for (let name in parent) {
        if (!this.hasOwnProperty(name)) {
          this[name] = parent[name]
        }
      }
    }
  }

  attach (worker: Worker) {
    this.detach()
    this.worker = worker

    worker.addEventListener('message', event => {
      let {id, type, data} = event.data

      if (type === 'syscall') this.syscall.apply(this, data)
      else return

      event.stopImmediatePropagation()
    })
  }

  detach () {
    if (this.worker) this.worker.terminate()

    this.worker = null
  }

  terminate (status?: any) {
    this.detach()

    processes.delete(this.id)
  }

  async syscall (id: any, ...args): Promise<any> {
    let target = this.syscalls[id]

    if (typeof target !== 'function') {
      throw new Error('ENOTSUP')
    }

    return target(...args)
  }
}
