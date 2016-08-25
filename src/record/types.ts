import { Readable } from 'stream'
import { ReadStream, WriteStream } from 'fs'

export type Input = Buffer | string

export type State = (Buffer?) => State
