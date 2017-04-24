import * as path from 'path'
import File from './file'
import Namespace from './namespace'
import Vm from './vm/worker'
import {IDMap} from '../utils/pool'

export const processes = new IDMap<Process>()

export default class Process extends Promise<void> {
  static current: Process = Object.create({
    id: null,
    owner: 0,
    group: 0,
    cwd: process.cwd(),
    arguments: process.argv.slice(1),
    path: process.execPath,
    namespace: new Namespace(),
    actions: [],
  }) as any

  owner: number
  group: number
  cwd: string // Current working directory
  path: string
  context: any
  actions: {[signo: number]: any}

  id = processes.add(this)
  arguments: string[] = null
  namespace = Object.create(this.parent.namespace) as Namespace
  files = new IDMap<File>(this.parent.files)
  vm = new Vm()
  loader = new System.constructor()

  constructor (public parent: Process) {
    super((resolve, reject) => {
      if (parent) {
        for (let name in parent) {
          if (!this.hasOwnProperty(name)) {
            this[name] = parent[name]
          }
        }
      }
 
      let cancel = () => processes.delete(this.id)

      this.vm.then(resolve, reject)
      this.then(cancel, cancel)
    })
  }

  exec (code: string) {
    const previous = Process.current

    Process.current = this

    try {
      return this.vm.exec.apply(this, arguments)
    } finally {
      Process.current = previous
    }
  }
}
