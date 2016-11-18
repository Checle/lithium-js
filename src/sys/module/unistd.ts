import * as vm from 'jsvm'
import * as path from 'path'
import {dlopen} from 'dlfcn'
import {freeze} from 'jsvm/object'
import {open, O} from 'fcntl'
import {Dir} from 'dirent'
import {Stat} from 'sys/stat'
import {Size, Ssize, Uid, Gid, Off, Pid, Useconds} from 'sys/types'
import {sendfile} from 'sys/sendfile'

import Global from '../kernel/global'
import Namespace from '../kernel/namespace'
import Process from '../kernel/process'
import resolve from '../util/resolve'
import {raise} from './signal'
import {fclose, tmpfile, Seek} from './stdio'
import {exit} from './stdlib'
import {Module} from './module'

export const STDIN_FILENO = 0
export const STDOUT_FILENO = 1
export const STDERR_FILENO = 2

export const R_OK = 1
export const W_OK = 2
export const X_OK = 4
export const F_OK = 8

// System calls

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
export declare function pread (fildes: number, buf: null | undefined, nbytes: Size, offset: number): Promise<string>
export declare function pread (fildes: number, buf: Buffer, nbytes: Size, offset: number): Promise<Ssize>
export declare function pwrite (filedes: number, buf: string | Buffer, nbytes: Size, offset: number): Promise<Ssize>
export declare function read (fildes: number, buf: Buffer, nbytes?: Size): Promise<Ssize>
export declare function read (fildes: number): Promise<Buffer>
export declare function readlink (path: string): Promise<string>
export declare function realpath (file_name: string): Promise<string>
export declare function rmdir (path: string): Promise<void>
export declare function stat (path: string): Promise<Stat>
export declare function symlink (path1: string, path2: string): Promise<void>
export declare function truncate (path: string, length: number): Promise<void>
export declare function unlink (path: string): Promise<void>
export declare function write (filedes: number, buf: string | Buffer, nbytes?: Size): Promise<Ssize>

// Standard implementations

export {Size, Ssize, Uid, Gid, Off, Pid, Useconds, Seek}

export function getpid (): Pid {
  return Process.current.id
}

export function getuid (): Uid {
  return Process.current.owner
}

export function getgid (): Gid {
  return Process.current.group
}

export function setuid (uid: Uid): void {
  const process = Process.current

  if (process.owner !== 0) throw new Error('EPERM')
  if (uid === process.owner) return

  const context = Global.call(Object.create(process.namespace.context), process)
  process.context = vm.createContext(context) // Drop native context
  process.require = new Module(null).require // Drop native require
  process.owner = uid
}

export function setgid (gid: Gid): void {
  if (Process.current.owner !== 0) throw new Error('EPERM')

  Process.current.group = gid
}

export function getcwd (): string {
  return Process.current.cwd
}

export async function chdir (path: string): Promise<void> {
  path = await realpath(path)
  Process.current.cwd = path
}

export function fork (): PromiseLike<Pid> {
  let child = new Process(Process.current)
  let promise1 = Promise.resolve(child.id)
  let promise2 = Promise.resolve(0)

  // Execute subsequent steps in both child and parent zone
  return {
    then: (resolve, reject) => {
      promise1.then(resolve, reject)
      child.run(() => promise2.then(resolve, reject))
      return this
    },
    valueOf: () => {
      promise2.valueOf()
      return promise1.valueOf()
    }
  }
}

export async function execv (pathname: string, argv: string[] = []): Promise<void> {
  const process = Process.current

  // POSIX requires any pathname containing a slash to be referenced to a local context
  pathname = pathname.indexOf('/') === -1 ? pathname : path.join('.', pathname)

  // Resolve pathname against `PATH` and enable native module resolution such as filename extension
  const test = async pathname => console.log(process.require.resolve(pathname)) || (pathname = process.require.resolve(pathname)) && await access(pathname, X_OK)

  let filename = await resolve.call(environ && environ['PATH'], pathname, test)

  process.path = filename
  process.arguments = process.context.arguments = argv.slice()

  let object = process.require(filename)

  if (typeof object.default === 'function') {
    // Run main function asynchronously, pass `argv[0]` as `this` and subsequent values as `arguments`
    let status = await object.default(...argv)

    // Report exit code
    exit(Number(status))
  }

  // Promise that never resolves (see POSIX)
  return new Promise<void>(() => null)
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
  Process.current.files.add(Process.current.files.get(filedes))
}

export function dup2 (filedes: number, filedes2: number): void {
  Process.current.files.set(filedes, Process.current.files.get(filedes))
}

// Extensions

/**
 * Load a shared library to be used by the calling process and all subsequently
 * created child processes. `library` specifies the pathname of the object and is
 * resolved as by dlopen(). Current symbols exported by the process are
 * overridden by symbols exported by the loaded library with the same name. In
 * JS, symbols exported by the library become visible in the global scope.
 * Subsequently requests to the library with the same path or alias (e.g., by
 * dlopen() or uselib()) will return a reference to the same instance.
 */
export function uselib (library: string, alias?: string): void {
  if (!alias) alias = library

  const process = Process.current
  const namespace = process.namespace
  const context = process.context
  const module = dlopen(library) as Module

  // Extend namespace
  namespace.context = freeze(Object.assign(Object.create(namespace.context), module.exports))

  // Extend libraries
  namespace.libraries = Object.create(namespace.libraries)
  namespace.libraries[alias] = module.exports

  // Also copy to the current global object
  Object.assign(process.context, module.exports)

  // Cache complete frozen namespace global object as module export
  module.exports = process.namespace.context

  // Cache also the alias natively
  process.require.cache[alias] = module
}

/**
 * Copies the content of a file into a given buffer or into a new buffer
 * which is allocated with `malloc()` and finally returned.
 **/
export async function readfile (path: string, buffer?: Buffer): Promise<Buffer> {
  let fd = await open(path, O.RDONLY)
  let size = await lseek(fd, 0, Seek.END)
  if (!buffer) buffer = new Buffer(size)
  await read(fd, buffer, size)
  return buffer
}
