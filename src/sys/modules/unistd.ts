import {open, O_RDONLY} from 'fcntl'
import {freeze} from 'jsvm'
import {posix as path} from 'path'

import Global from '../kernel/global'
import Process from '../kernel/process'
import {Dir} from './dirent'
import {Stat} from './sys/stat'
import {Size, Ssize, Uid, Gid, Off, Pid, Useconds} from './sys/types'
import {SEEK_CUR, SEEK_END, SEEK_SET} from './stdio'
import {SystemError} from '../errors'

export {Size, Ssize, Uid, Gid, Off, Pid, Useconds, SEEK_CUR, SEEK_END, SEEK_SET}

const process = Process.current

// System calls

export declare function access(path: string, amode?: number): Promise<void>
export declare function chmod(path: string, mode: number): Promise<void>
export declare function chown(path: string, owner: number, group: number): Promise<void>
export declare function close(fildes: number): Promise<void>
export declare function fchmod(fildes: number, mode: number): Promise<void>
export declare function fchown(fildes: number, owner: number, group: number): Promise<void>
export declare function fdatasync(fildes: number): Promise<void>
export declare function fstat(fildes: number): Promise<Stat>
export declare function fsync(fildes: number): Promise<void>
export declare function ftruncate(fildes: number, length: number): Promise<void>
export declare function lchmod(path: string, mode: number): Promise<void>
export declare function lchown(path: string, owner: number, group: number): Promise<void>
export declare function link(path1: string, path2: string): Promise<void>
export declare function lseek(fildes: number, offset: Off, whence: number): Promise<Off>
export declare function lstat(path: string): Promise<Stat>
export declare function mkdir(path: string, mode: number): Promise<void>
export declare function mkdtemp(template: string): Promise<void>
export declare function pread(fildes: number, nbyte: number, buf: Buffer, offset: number): Promise<void>
export declare function read(fildes: number, nbyte: number, buf: Buffer): Promise<void>
export declare function readdir(path: string): Promise<Dir>
export declare function readlink(path: string): Promise<string>
export declare function realpath(file_name: string): Promise<string>
export declare function rename(old: string, newp: string): Promise<void>
export declare function rmdir(path: string): Promise<void>
export declare function stat(path: string): Promise<Stat>
export declare function symlink(path1: string, path2: string): Promise<void>
export declare function truncate(path: string, length: number): Promise<void>
export declare function unlink(path: string): Promise<void>

export function getuid (): Uid {
  return process.owner
}

export function getgid (): Gid {
  return process.group
}

export function setuid (uid: Uid): void {
  if (process.owner !== 0) throw new SystemError('Operation not permitted', 'EPERM')
  if (uid === process.owner) return

  process.context = new Global(process) // Drop native context
  process.require = Process.prototype.require // Drop native require
  process.owner = uid
}

export function setgid (gid: Gid): void {
  if (process.owner !== 0) throw new SystemError('Operation not permitted', 'EPERM')

  process.group = gid
}

export function getcwd (): string {
  return process.cwd
}

export function fork (): PromiseLike<Pid> {
  let child = Object.create(Process.prototype)
  Object.assign(child, this)
  Process.call(child, this)

  let promise = Promise.resolve(child.id)

  // Execute subsequent steps in both child and parent zone
  return {
    then: (resolve, reject) => {
      promise.then(
        typeof resolve === 'function' ? value => child.run(() => resolve(value)) : null,
        typeof reject === 'function' ? value => child.run(() => reject(value)) : null
      )
      return promise.then(resolve, reject)
    }
  }
}

export function execv (pathname: string, argv: string[] = []): Promise<void> {
  process.cache = {}
  process.args = argv
  process.dirname = path.dirname(pathname)

  return this.require(path.isAbsolute(pathname) ? pathname : path.join('.', pathname))
}

export function execve (path: string, argv: string[] = [], env: any): Promise<void> {
  if (env) environ = env
  return execv(path, argv)
}

export function execl (path: string, ...args: string[]): Promise<void> {
  return execv(path, args)
}

export function execle (path: string, ...args: string[]): Promise<void> {
  let env: any = args.pop()
  return execve(path, args, env)
}

// Extensions

export function uselib (library: string): Promise<void> {
  let exports = require(library)
  Object.assign(global, exports)
  return Promise.resolve()
}

export async function readfile (path: string): Promise<number> {
  let fd = await open(path, O_RDONLY)
  let size = await lseek(fd, 0, SEEK_END)
  let buffer = new Buffer(size)
  await read(fd, size, buffer)
  return buffer
}
