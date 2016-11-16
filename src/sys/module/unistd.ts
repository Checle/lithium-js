import * as path from './path'
import Global from '../kernel/global'
import Process from '../kernel/process'
import {open, O} from './fcntl'
import {Dir} from './dirent'
import {Stat} from './sys/stat'
import {Size, Ssize, Uid, Gid, Off, Pid, Useconds} from './sys/types'
import {fclose, tmpfile, Seek} from './stdio'

const process = Process.current

export const STDIN_FILENO = 0
export const STDOUT_FILENO = 1
export const STDERR_FILENO = 2

// System calls

module.exports = Object.create(global)

export declare function access (path: string, amode?: number): Promise<void>
export declare function chmod (path: string, mode: number): Promise<void>
export declare function chown (path: string, owner: number, group: number): Promise<void>
export declare function close (fildes: number): Promise<void>
export declare function fchmod (fildes: number, mode: number): Promise<void>
export declare function fchown (fildes: number, owner: number, group: number): Promise<void>
export declare function fdatasync (fildes: number): Promise<void>
export declare function fstat (fildes: number): Promise<Stat>
export declare function fsync (fildes: number): Promise<void>
export declare function ftruncate (fildes: number, length: number): Promise<void>
export declare function lchmod (path: string, mode: number): Promise<void>
export declare function lchown (path: string, owner: number, group: number): Promise<void>
export declare function link (path1: string, path2: string): Promise<void>
export declare function lseek (fildes: number, offset: Off, whence: number): Promise<Off>
export declare function lstat (path: string): Promise<Stat>
export declare function mkdir (path: string, mode: number): Promise<void>
export declare function mkdtemp (template: string): Promise<void>
export declare function pread (fildes: number, nbyte: number, buf: null, offset: number): Promise<string>
export declare function pread (fildes: number, nbyte: number, buf: Buffer, offset: number): Promise<Ssize>
export declare function pwrite (filedes: number, buf: string | Buffer, nbyte: Size, offset: number): Promise<Ssize>
export declare function read (fildes: number, nbyte: number, buf: Buffer): Promise<Ssize>
export declare function read (fildes: number, nbyte?: number): Promise<string>
export declare function readlink (path: string): Promise<string>
export declare function realpath (file_name: string): Promise<string>
export declare function rmdir (path: string): Promise<void>
export declare function stat (path: string): Promise<Stat>
export declare function symlink (path1: string, path2: string): Promise<void>
export declare function truncate (path: string, length: number): Promise<void>
export declare function unlink (path: string): Promise<void>
export declare function write (filedes: number, buf: string | Buffer, nbyte?: Size): Promise<Ssize>

// Standard implementations

export {Size, Ssize, Uid, Gid, Off, Pid, Useconds, Seek}

export function getuid (): Uid {
  return process.owner
}

export function getgid (): Gid {
  return process.group
}

export function setuid (uid: Uid): void {
  if (process.owner !== 0) throw new Error('EPERM')
  if (uid === process.owner) return

  process.context = new Global(process) // Drop native context
  process.require = Process.prototype.require // Drop native require
  process.owner = uid
}

export function setgid (gid: Gid): void {
  if (process.owner !== 0) throw new Error('EPERM')

  process.group = gid
}

export function getcwd (): string {
  return process.cwd
}

export function fork (): PromiseLike<Pid> {
  let child = Object.create(Process.prototype)
  Object.assign(child, this)
  Process.call(child, this)

  let promise1 = Promise.resolve(child.id)
  let promise2 = child.run(() => Promise.resolve(0))

  // Execute subsequent steps in both child and parent zone
  return {
    then: (resolve, reject) => {
      promise1.then(resolve, reject)
      promise2.then(resolve, reject)
      return this
    },
    valueOf: () => {
      promise2.valueOf()
      return promise1.valueOf()
    }
  }
}

export function execv (pathname: string, argv: string[] = []): PromiseLike<void> {
  process.cache = {}
  process.args = argv
  process.dirname = path.dirname(pathname)

  this.require(path.isAbsolute(pathname) ? pathname : path.join('.', pathname))

  // Promise that never resolves (see POSIX)
  return { then () { return this } }
}

export function execve (path: string, argv: string[] = [], env: any): PromiseLike<void> {
  if (env) environ = env
  return execv(path, argv)
}

export function execl (path: string, ...args: string[]): PromiseLike<void> {
  return execv(path, args)
}

export function execle (path: string, ...args: string[]): PromiseLike<void> {
  let env: any = args.pop()
  return execve(path, args, env)
}

export function pipe (): number[] {
  throw 'Not implemented'
}

export function dup (filedes: number): void {
  process.files.add(process.files.get(filedes))
}

export function dup2 (filedes: number, filedes2: number): void {
  process.files.set(filedes, process.files.get(filedes))
}

// Extensions

/**
 * Load a shared library to be used by the calling process. `library` specifies
 * the pathname of the object and is resolved as by `dlopen()`. Current symbols
 * exported by the process are overridden by symbols exported by the loaded
 * library with the same name. Returns a handle that is iterable with `dlsym()`
 * that lists new entry points of the old overridden symbols.
 **/
export function uselib (library: string): any {
  let exports = require(library)
  Object.assign(global, exports)
}

/**
 * Copies the content of a file into a given buffer or into a new buffer
 * which is allocated with `malloc()` and finally returned.
 **/
export async function readfile (path: string, buffer?: Buffer): Promise<Buffer | void> {
  let fd = await open(path, O.RDONLY)
  let size = await lseek(fd, 0, Seek.END)
  if (!buffer) buffer = new Buffer(size)
  await read(fd, size, buffer)
  return buffer
}
