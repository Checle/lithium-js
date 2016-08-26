import { Readable } from 'stream'
import { ReadStream, WriteStream } from 'fs'
import * as interfaces from './interfaces'

export type Input = Buffer | string

export type Acceptor = (/*this: interfaces.Sequence,*/ buffer?: Buffer) => any

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
