import * as fs from 'fs'
import { Readable, Writable } from 'stream'
import { prototype } from '../../decorators'
import Sequence from '../../sequence'
import { Str } from '../../types'
import { Forkable } from '../../utils'

@prototype(Forkable)
export default class FileStream extends Writable {
  // Target will be forked if forkable
  constructor (private target: Writable & Forkable) {
    super()
    Forkable.call(this)
    this.on('finish', () => this.send())
  }

  path: string
  buffer = new Sequence()

  _read () { }
  _write (chunk: Buffer) {
    this.buffer.push(chunk)
    for (let i = 0; i < chunk.length; i++) if (chunk[i] == 0) {
      chunk = chunk.slice(0, i)
      this.buffer.push(chunk)
      this.end()
    }
    this.buffer.push(chunk)
  }

  private send () {
    this.path = this.buffer.toString()
    fs.stat(this.path, (err, stats) => err || this.stat(stats))
  }
  private stat (stats: fs.Stats) {
    this.target.write(this.path+'\0')
    if (stats.isFile()) fs.createReadStream(this.path).pipe(this.target)
    else if (stats.isDirectory()) fs.readdir(this.path, (err, files) => err || this.readdir(files))
  }
  private readdir (files: string[]) {
    for (let file of files) this.target.write(file+'\0')
    this.target.end()
  }
}
