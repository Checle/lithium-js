import * as path from 'path'
import * as vm from 'jsvm'
import {EventEmitter} from 'events'
import {Zone} from 'operate'
import {Readable} from 'stream'

import File from './file'
import {readfile} from '../modules/unistd'
import resolve from '../util/resolve'
import Global from './global'
import Module from './module'
import {IDMap} from '../util/pool'

export const processes = new IDMap<Process>()

const base: Process = Object.assign(Object.create(Process.prototype), {
  owner: 0,
  group: 0,
  cwd: '/',
  dirname: __dirname,
  context: global,
  require: require,
})

export default class Process extends Zone {
  static current: Process = base

  owner: number
  group: number
  cwd: string // Current working directory
  dirname: string
  id = processes.add(this)
  args: string[] = this.parent.args.slice()
  paths: { [alias: string]: (path: string) => string } = Object.assign({}, this.parent.paths)
  cache: { [id: string]: Module } = {}
  files: IDMap<File> = new IDMap<File>(this.parent.files)
  context: any = vm.createContext(new Global(this))

  // Root process: load from stream (fexecve) - fexecve loads Module() and executes in process context

  constructor (public parent: Process) {
    super()
  }

  run (callback: Function, thisArg?: any, ...args: any[]) {
    let previous = Process.current
    Process.current = this
    try { return super.run.apply(this, arguments) }
    finally { Process.current = previous }
  }

  require (...paths: string[]) {
    // Look up module
    let id = resolve.apply(environ && environ['JSPATH'], paths)

    // TODO: refactor
    let isNative = id.startsWith('/sys/')
    let requireFunction = isNative ? require : this.require.bind(this, id)

    // Return cached export
    if (this.cache.hasOwnProperty(id)) return this.cache[id].exports

    // Read code from file system
    let code = readfile(id).valueOf()

    // Parse code
    let Function = vm.runInNewContext('Function', this.context)
    let func = new Function('exports', 'require', 'module', code)

    // Run module in process zone
    let module = new Module(id)
    this.run(() => func.call(module.exports, module.exports, requireFunction, module))

    this.cache[id] = module
    return module.exports
  }
}
