// Cf. include/linux/fs.h

import { Stream } from '../interfaces'

export default File

export enum Mode {
  Read = 1,
  Write = 2,
  Seek = 4,
  Exec = 32,
}

export class File {
  constructor (public stream: Stream, public mode?: Mode) {
    if (mode == null) {
      // Let mode default to maximum capabilities of the underlying stream
      this.mode = 0
      if (stream.readable === true) this.mode |= Mode.Read
      if (stream.writable === true) this.mode |= Mode.Write
      if (stream.seekable === true) this.mode |= Mode.Seek
    }
  }
}
