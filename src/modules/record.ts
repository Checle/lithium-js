import {Duplex} from 'stream'

import * as fs from 'fs'
import * as path from 'path'
import * as childProcess from 'child_process'
import {ChildProcess} from 'child_process'

export default function record () {

}

/*
abstract class Record extends Duplex {
}

class Executable extends Duplex {
  constructor (public process: ChildProcess) {
    super()
  }

  _read (size?: number): any {
    this.push(this.process.stdout.read())
  }

  _write (object: any, encoding: string, callback?: Function): boolean {
    return this.process.stdin.write(object, encoding, callback)
  }
}

class Node {
  constructor (path: string) {
    
  }
}

class File {}

class Util {
  constructor (public path: string) { }
}

function util (...args) {
  return new Executable(childProcess.spawn(this.path, args))
}


const paths = process.env.PATH.split(path.delimiter)

for (let dir of paths) {
  let names
  try {
    names = fs.readdirSync(dir)
  } catch (e) {
    continue
  }

  for (let name of names) {
    if (record.hasOwnProperty(name)) continue

    let file = path.join(dir, name)

    try {
      fs.accessSync(file, fs.constants.X_OK)
    } catch (e) {
      continue
    }

    record[name] = Record.prototype[name] = util.bind(new Util(file))
  }
}
*/
