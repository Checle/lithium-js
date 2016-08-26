import * as interfaces from './interfaces'
import { Readable } from 'stream'
import { ReadStream, WriteStream } from 'fs'

export type Input = Buffer | string

export type Acceptor = (/*this: interfaces.Sequence,*/ buffer?: Buffer) => any
