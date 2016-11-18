import * as path from 'path'
import {Zone} from 'operate'
import {Gid, Uid} from 'unistd'
import {Module} from 'module'

import File from './file'
import Namespace from './namespace'
import {IDMap} from '../util/pool'

export const processes = new IDMap<Process>()

export default class Process extends Zone {
  static current: Process = Object.create({
    id: null,
    owner: 0,
    group: 0,
    cwd: process.cwd(),
    arguments: process.argv.slice(1),
    path: process.execPath,
    context: global,
    require: require,
    namespace: new Namespace(),
    actions: [],
  }) as any

  owner: Uid
  group: Gid
  cwd: string // Current working directory
  path: string
  require: Require
  context: any
  actions: { [signo: number]: any }

  id = processes.add(this)
  arguments: string[] = null
  cache: { [id: string]: Module } = {}
  namespace: Namespace = Object.create(this.parent.namespace)
  files: IDMap<File> = new IDMap<File>(this.parent.files)

  constructor (public parent: Process) {
    super()
    if (parent) for (let name in parent) if (!this.hasOwnProperty(name)) this[name] = parent[name]

    let cancel = () => processes.delete(this.id)
    this.then(cancel, cancel)
  }

  run (callback: Function, thisArg?: any, ...args: any[]) {
    const previous = Process.current
    Process.current = this
    try { return super.run.apply(this, arguments) }
    finally { Process.current = previous }
  }
}
