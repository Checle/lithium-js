import * as fs from 'fs'
import { Writable, Transform } from 'stream'
import { prototype } from '../../decorators'
import { Str } from '../../types'
import fork from 'object-fork'
import Sequence from '../../sequence'
import State from '../../record/sm/states'

/*
export default class LocalFileSystemState extends State {
  pathLength: number

  transform (input: Buffer, output: Sequence) {
    for (let length = 0; length < input.length && input[length]; length++) continue
    output.push(input.slice(0, length))
    if (length < input.length) this.open(length)
    if (this.pathLength != null) this.
      this.end()
    }
    this.output.push(chunk)
  }

  private open (length: number) {
    this.path = this.output.toString()
    fs.stat(this.path, (err, stats) => err || this.stat(stats))
  }
  private stat (stats: fs.Stats) {
    this.target.write(this.path+'\0')
    if (stats.isFile()) fs.createReadStream(this.path).pipe(this.target)
    else if (stats.isDirectory()) fs.readdir(this.path, (err, files) => err || this.readdir(files))
  }
  private readdir (files: string[]) {
    for (let file of files) this.target.write(file + '\0')
    this.target.end()
  }
}

@fork export default class FileSystemDevice extends Transform {
  // Target will be forked if forkable
  constructor (private target: Writable) {
    super()
  }

  path: string
  output = new Sequence()

  _transform (chunk: output, encoding: string, callback: Function) {
    this.output.push(chunk)
    for (let i = 0; i < chunk.length; i++) if (chunk[i] == 0) {
      chunk = chunk.slice(0, i)
      this.push(chunk)
      this.output.push(chunk)
      this.end()
    }
    this.output.push(chunk)
  }

  private send () {
    this.path = this.output.toString()
    fs.stat(this.path, (err, stats) => err || this.stat(stats))
  }
  private stat (stats: fs.Stats) {
    this.target.write(this.path+'\0')
    if (stats.isFile()) fs.createReadStream(this.path).pipe(this.target)
    else if (stats.isDirectory()) fs.readdir(this.path, (err, files) => err || this.readdir(files))
  }
  private readdir (files: string[]) {
    for (let file of files) this.target.write(file + '\0')
    this.target.end()
  }
}

*/
