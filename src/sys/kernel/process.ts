import * as path from 'path'
import * as vm from 'jsvm'
import {EventEmitter} from 'events'
import {Zone} from 'operate'
import {Readable} from 'stream'

import resolve from '../util/resolve'
import Global from './global'
import Module from './module'
import {IDMap} from '../util/pool'

const ModulePath = path.resolve(__dirname, '../modules')

const processes = new IDMap<Process>()

export class File {
  fs: any
  fd: number
}

export default class Process extends Zone {
  static current: Process = Object.create(Process.prototype)

  owner: number
  group: number
  args: string[]
  cwd: string // Current working directory
  paths: { [alias: string]: (path: string) => string } = Object.create(this.parent.paths)
  cache: { [id: string]: Module } = {}
  id = processes.add(this)
  files: IDMap<File> = new IDMap<File>(this.parent.files)
  env = Object.assign({}, this.parent.env)
  context = vm.createContext(new Global(this))

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

  exec (filename: string, args: string[] = [], env?: any): void {
    if (env) this.env = env

    this.cache = {}
    this.args = args

    return this.require(path.isAbsolute(filename) ? filename : path.join('.', filename))
  }

  fork (): Process {
    let process = Object.create(Process.prototype)
    Object.assign(process, this)
    Process.call(process, this)
    return process
  }

  kill (): void {
    this.cancel()
    processes.delete(this.id)
  }

  require (pathname: string) {
    // Look up module
    let id = resolve(pathname, this.cwd, this.env.JSPATH)
    if (id == null) throw new Error(`Cannot find module '${pathname}'`)

    // Return cached export
    if (this.cache.hasOwnProperty(id)) return this.cache[id].exports

    let native = id.startsWith(ModulePath) && id.charAt(ModulePath.length) === path.delimiter

    // Load a native module
    if (native) {
      // Normalize ID
      id = require.resolve(id)

      // Disable cache
      let exists = require.cache.hasOwnProperty(id)
      let current = require.cache[id]
      delete require.cache[id]

      // Perform native require
      let exports = require(id)

      // Restore cache
      if (exists) require.cache[id] = current

      // Let native ES6 modules export custom objects as default export
      if (exports.hasOwnProperty('default')) exports = exports.default

      let module = new Module(id)
      module.exports = exports
      return module
    }

    // Read code from file system
    let code = this.require('fs').readFileSync(id)

    // Parse code
    let Function = vm.runInNewContext('Function', this.context)
    let func = new Function('exports', 'require', 'module', code)

    // Run module in process zone
    let module = new Module(id)
    this.run(() => func(module.exports, this.require.bind(this), module))

    this.cache[id] = module
    return module.exports
  }
}

Object.assign(Process.current, {
  context: global,
  require: require,
  id: processes.add(this),
  owner: 0,
  group: 0,
  cwd: '/',
  context: global,
  require: 
  paths: {}
})
