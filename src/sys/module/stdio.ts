import {VaList} from 'stdarg'
import {open, O} from 'fcntl'
import {close, unlink} from 'unistd'

import File from '../kernel/file'
import {Off, Size, Ssize} from './sys/types'

export {Off, Size, Ssize, VaList}

export type Fpos = number

export enum Seek {
  SET,
  CUR,
  END,
}

// Constants

export const TMP_MAX = Number.MAX_VALUE

export const BUFSIZ = 1024
export const EOF = Symbol('eof')

// System calls

module.exports = Object.create(global)

export declare function eof (stream: File): boolean
export declare function fseek (stream: File, offset: Off, whence: number)
export declare function fread (buffer: Buffer, size: Size, nitems: Size, stream: File): Size
export declare function fwrite (buffer: Buffer, size: Size, nitems: Size, stream: File): Size
export declare function rename (old: string, newp: string): Promise<void>

let tmpcount = 0

// Implementations

const Modes = {
  r: O.RDONLY,
  w: O.WRONLY | O.TRUNC | O.CREAT,
  a: O.APPEND | O.TRUNC | O.CREAT,
  'r+': O.RDWR,
  'w+': O.TRUNC | O.CREAT | O.RDWR,
  'a+': O.CREAT | O.RDWR | O.APPEND,
}

export async function fopen (filename: string, mode: string = 'r+'): Promise<File> {
  mode = mode.replace('b', '')
  if (!Modes.hasOwnProperty(mode)) throw new Error('EINVAL')

  const fd = await open(filename, Modes[mode])
  return new File(fd)
}

export function fclose (stream: File): Promise<void> {
  return close(stream.fd)
}

export function fileno (stream: File): number {
  return stream.fd
}

export function tmpnam (): string {
  if (tmpcount === TMP_MAX) return null
  return [process.pid, ++tmpcount, Date.now()].join('-')
}

export function tempnam (dir?: string, pfx: string = ''): string {
  return [dir, '/', pfx, tmpnam()].join('')
}

export async function tmpfile (): Promise<File> {
  const file = await fopen(tempnam('/tmp'), 'w+')
  file.release = () => unlink(file.fd)
  return file
}
