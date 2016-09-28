import {Readable} from 'stream'
import {ReadStream, WriteStream} from 'fs'
import Sequence from './sequence'
import * as interfaces from './interfaces'

export const Str = {
  read (sequence) {
    var tail = sequence.slice()
    for (var length = 0, char; (char = tail.shift()); length++) {
      if (char == null) return null
    }
    return sequence.shift(length).toString()
  },
  write (sequence, string) {
    sequence.push(string)
    sequence.push(0)
  }
}

export const VN = {
  read (sequence: Sequence) {
    return sequence.read(4).readUInt32LE(0)
  },
  write (sequence, integer) {
    var buffer = new Buffer(4)
    buffer.writeUInt32LE(integer, 0)
    sequence.push(buffer)
  }
}

export const VarInt = {
  read (sequence: Sequence) {
    return sequence.read(4).readUInt32LE(0)
  },
  write (sequence, integer) {
    var buffer = new Buffer(4)
    buffer.writeUInt32LE(integer, 0)
    sequence.push(buffer)
  }
}
