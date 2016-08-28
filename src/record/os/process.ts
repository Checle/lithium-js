import * as vm from 'vm'
import * as fs from 'fs'
import { Readable, Writable } from 'stream'
import { EventEmitter } from 'events'
import { Script, Context } from 'vm'

import * as interfaces from '../../interfaces'
import { prototype } from '../../decorators'
import { Input } from '../../types'
import { SystemError } from '../errors'
import { IDs } from './pool'
import fork from '../../forks'
import Global from '../../context/global'
import Tree from '../../type/tree'
import Sequence from '../../sequence'

class Stream extends Readable implements fs.ReadStream, fs.WriteStream {
  path: string
  position: number
  length: number
  seekable: boolean
  readable: boolean
  writable: boolean
  bytesWritten: number

  read (size?: number): Buffer { throw new SystemError('EBADF') }
  write (chunk: Input): boolean { throw new SystemError('EBADF') }
  seek (offset: number): number { throw new SystemError('EBADF') }
  close (): void { throw new SystemError('EBADF') }

  end (): void { }
  shift (): Buffer { return null }
  pop (): Buffer { return null }
  unshift (chunk: Input): void { }
  slice(start?: number, end?: number): Sequence { return null }
  valueOf(): Buffer { return null }
  next (): IteratorResult<Buffer> { return { done: true, value: undefined } }
  compare () { return null }

  _read (size: number): void { }
  _write (chunk: Input, encoding: string, callback: Function): void { }

  static isReadable (stream): boolean {
    return stream.readable === true
  }
  static isWritable (stream): boolean {
    return stream.writable === true
  }
}

class FileStream extends Stream {
  fd: number
}

@prototype(Readable)
class ReadStream extends FileStream {
  constructor () {
    super()
    Readable.call(this)
  }

  readable = true

  close (): void {
    return this.end()
  }
  valueOf(): Buffer {
    var value = this.read()
    this.unshift(value)
    return value
  }
}

@prototype(Writable)
class WriteStream extends ReadStream {
  constructor () {
    super()
    Writable.call(this)
  }

  writable = true
}

@fork class RecordStream extends WriteStream {
  constructor (protected origin: RecordStream = null) {
    super()
    this.on('data', (chunk: Input) => this.data(chunk))
  }

  protected process: Process
  protected buffer: Sequence

  public get path (): string {
    return this.origin ? this.origin.path + this.origin.toString() : ''
  }

  private tree = new Tree()
  private map = {}
  private output = new Readable()
  private prefix: boolean = false

  _write (chunk: Input, encoding: string, callback: Function): void {
    this.process.stdout.write(chunk)
  }

  private data (chunk: Input): void {

  }

  protected match (chunk: any): RecordStream {
    this.buffer.push(chunk)

    var predecessor = this.tree.find(this.buffer)

    if (this.buffer.compare(predecessor.slice(0, this.buffer.length)) == 0) {
      // Wait
    }/*
    if (this.buffer.slice(0, predecessor.length).compare(predecessor) == 0) {
      // Cut and forward
    }*/
    return null
  }

  verify (): void { }

  clone (...args): this {
    var clone = Object.create(this)
    clone.constructor(...args)
    return clone
  }
}

class FunctionRecordStream extends RecordStream {
  accessor: Function

  verify (): void {
    var input
    try {
      var result = this.accessor.call(this.origin, this)
      // Evaluate result
      this.process.stdout.write(result)
    } catch (e) {
      this.process.exit(1)
    }
  }
}

class ModuleRecordStream extends RecordStream {
  accessor: Function
  context: Context = vm.createContext(new Global())

  verify (): void {
    try {
      var code = this.read()
      var script = new Script(String(code), { filename: this.path, displayErrors: true })
      script.runInContext(this.context)
    } catch (e) {
      this.process.exit(1)
    }
  }
}

class ScriptRecordStream extends RecordStream {
  constructor () {
    super()
  }
  accessor: Function
  context: Context = vm.createContext({ this: this }) // FIXME: Proxy

  verify (): void {
    try {
      var code = this.read()
      var script = new Script('this.this((function(input){' + String(code) + '\n}).call(this.this,this.this()))', { filename: this.path, displayErrors: true })
      script.runInContext(this.context)
    } catch (e) {
      this.process.exit(1)
    }
  }
}

class File {
  /*
  constructor (public stream: FileStream) {
    stream.on('newListener', (event, listener) => this.)
  }
  process: Process
  listeners: Map()

  newListener (event, listener) {
    if (Process.current && ) {
      v
      var deconstructor = () => { this.stream.removeListener(event, listener) }
      Process.current.deconstructors[symbol] = deconstructor
    }
  }
  */
}

@fork export class Process extends Writable {
  constructor (protected parent: Process) {
    super()
    console.log(this.pid)
  }

  get pid(): number { return Number(this.pids) }

  protected files: { [fd: number]: RecordStream } = {}
  protected fds = new IDs()
  protected pids = new IDs()
  protected cwd = new RecordStream()

  stdin: RecordStream = fork(this.cwd)
  stdout: RecordStream = fork(this.cwd)

  exit(code?: number): void { }

  open(path: Input, flags: string, mode?: number, callback?: (err: Error, fd: number) => any): void {
  }

  fexecve(file: Stream, argv: string[], envp: string[]) {
    file.pipe(this)
  }

  exec(filename: Input, argv: string, envp: string[]): Process {
    return null
  }

  static current: Process = null
}

class FileProcess extends Process {
  constructor (parent: Process) {
    super(parent)
    this.files = {}
    this.fds = new IDs()
    //this.stdin = parent.cwd.clone()
    //this.stdout = parent.cwd.clone()
    this.files[this.fds.acquire()] = this.stdin
    this.files[this.fds.acquire()] = this.stdout
  }

  exit (code) {
    if (code && this.parent) this.parent.exit(code)
  }
}
