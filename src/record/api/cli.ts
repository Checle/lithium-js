import * as readline from 'readline'
import { createInterface, ReadLine } from 'readline'
import { Writable } from 'stream'
//import FileStream from '../devices/fs'
import { RecordStream } from './stream'

var stream = new RecordStream()
//var fs = new FileStream(stream).stream.pipe(fs).pipe(stream)

export function start () {
  var cwd = process.cwd()
  var args = process.argv.slice(2)

  stream.write(cwd+'\t')
  for (let arg of args) stream.write(arg+'\0')
  stream.write('\0')

  process.stdin.pipe(stream).pipe(process.stdout)
}
