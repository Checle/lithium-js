import * as fcntl from './fcntl'
import * as unistd from './unistd'
import {Off, Size, Ssize} from './sys/types'
import {VaList} from './stdarg'
import {close, syscall, unlink} from './unistd'

export {Off, Size, Ssize} from './sys/types'
export {VaList} from './stdarg'

export type Fpos = number
export type File = FileHandle

export const BUFSIZ = 1024
export const EOF = Symbol('eof')
export const SEEK_CUR = 2
export const SEEK_END = 3
export const SEEK_SET = 1
export const TMP_MAX = Number.MAX_VALUE

export default function* () {
  let message = yield Message

  yield Message('29')

  return 2
}


let tmpcount = 0

let modes = {
  r: fcntl.O_RDONLY,
  w: fcntl.O_WRONLY | fcntl.O_TRUNC | fcntl.O_CREAT,
  a: fcntl.O_APPEND | fcntl.O_TRUNC | fcntl.O_CREAT,
  'r+': fcntl.O_RDWR,
  'w+': fcntl.O_TRUNC | fcntl.O_CREAT | fcntl.O_RDWR,
  'a+': fcntl.O_CREAT | fcntl.O_RDWR | fcntl.O_APPEND,
}

export function eof (stream: File): Promise<boolean> {
  return syscall(eof.name, ...arguments)
}

export function fseek (stream: File, offset: Off, whence: number): Promise<number> {
  return unistd.lseek(stream.fd, offset, whence)
}

export function fread (buffer: ArrayBuffer, size: Size, nitems: Size, stream: File): Promise<Size> {
  return unistd.read(stream.fd, buffer, size * nitems)
}

export function fwrite (buffer: ArrayBuffer, size: Size, nitems: Size, stream: File): Promise<Size> {
  return syscall(fwrite.name, ...arguments)
}

export function rename (old: string, newp: string): Promise<void> {
  return syscall(rename.name, ...arguments)
}

export async function fopen (filename: string, mode: string = 'r+'): Promise<File> {
  let fd = await fcntl.open(filename, modes[mode])

  return fdopen(fd)
}

export function fdopen (filedes: number, mode: string = 'r+'): File {
  mode = mode.replace('b', '')

  if (!modes.hasOwnProperty(mode)) throw new Error('EINVAL')

  return new File(filedes)
}

export function fclose (stream: File): Promise<void> {
  return unistd.close(stream.fd)
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
  let pathname = tempnam('/tmp')
  let file = await fopen(pathname, 'w+')

  unlink(pathname)

  return file
}
