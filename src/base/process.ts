import { Readable } from 'stream'
import Environment from './environment'
import { IDMap } from '../util/pool'
import { fork, forkable } from '../util/fork'

class File {
  stream: Readable
}

export default class Process {
  @forkable private environment: Environment
  private files: IDMap<File>

  exit (code: number) {
    if (code) {
      this.environment.emit('error')
    }
    this.files.forEach((file) => file.stream.removeAllListeners())
  }
  fork () {
    return fork(this)
  }
}
