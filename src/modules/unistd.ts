import {Dir} from './dirent'
import {Size, Ssize, Uid, Gid, Off, Pid, Useconds} from './sys/types'
import {Stat} from './sys/stat'
import {syscall} from './sys/record'

export {Size, Ssize, Uid, Gid, Off, Pid, Useconds} from './sys/types'
export {SEEK_CUR, SEEK_END, SEEK_SET} from './stdio'

export * from './sys/record'

export const STDIN_FILENO = 0
export const STDOUT_FILENO = 1
export const STDERR_FILENO = 2

export const R_OK = 1
export const W_OK = 2
export const X_OK = 4
export const F_OK = 8

export function access (path: string, amode?: number): Promise<void> {
  return syscall(access.name, ...arguments)
}

export function chown (path: string, owner: number, group: number): Promise<void> {
  return syscall(chown.name, ...arguments)
}

export function close (fildes: number): Promise<void> {
  return syscall(close.name, ...arguments)
}

export function fchown (fildes: number, owner: number, group: number): Promise<void> {
  return syscall(fchown.name, ...arguments)
}

export function fdatasync (fildes: number): Promise<void> {
  return syscall(fdatasync.name, ...arguments)
}

export function fsync (fildes: number): Promise<void> {
  return syscall(fsync.name, ...arguments)
}

export function ftruncate (fildes: number, length: number): Promise<void> {
  return syscall(ftruncate.name, ...arguments)
}

export function lchmod (path: string, mode: number): Promise<void> {
  return syscall(lchmod.name, ...arguments)
}

export function lchown (path: string, owner: number, group: number): Promise<void> {
  return syscall(lchown.name, ...arguments)
}

export function link (path1: string, path2: string): Promise<void> {
  return syscall(link.name, ...arguments)
}

export function lseek (fildes: number, offset: Off, whence: number): Promise<Off> {
  return syscall(lseek.name, ...arguments)
}

export function mkdtemp (template: string): Promise<void> {
  return syscall(mkdtemp.name, ...arguments)
}

export function pread (fildes: number, buf: null | undefined, nbytes: Size, offset: number): Promise<string>
export function pread (fildes: number, buf: ArrayBuffer, nbytes: Size, offset: number): Promise<Ssize>

export function pread () {
  return syscall(pread.name, ...arguments)
}

export function pwrite (filedes: number, buf: string | ArrayBuffer, nbytes: Size, offset: number): Promise<Ssize> {
  return syscall(pwrite.name, ...arguments)
}

export function read (fildes: number, buf: ArrayBuffer, nbytes?: Size): Promise<Ssize>
export function read (fildes: number): Promise<ArrayBuffer>
export function read (fildes: number): Promise<ArrayBuffer>

export function read () {
  return syscall(read.name, ...arguments)
}

export function readlink (path: string): Promise<string> {
  return syscall(readlink.name, ...arguments)
}

export function realpath (file_name: string): Promise<string> {
  return syscall(realpath.name, ...arguments)
}

export function rmdir (path: string): Promise<void> {
  return syscall(rmdir.name, ...arguments)
}

export function symlink (path1: string, path2: string): Promise<void> {
  return syscall(symlink.name, ...arguments)
}

export function truncate (path: string, length: number): Promise<void> {
  return syscall(truncate.name, ...arguments)
}

export function unlink (path: string): Promise<void> {
  return syscall(unlink.name, ...arguments)
}

export function write (filedes: number, buf: string | ArrayBuffer, nbytes?: Size): Promise<Ssize> {
  return syscall(write.name, ...arguments)
}

export function getpid (): Promise<Pid> {
  return syscall(getpid.name, ...arguments)
}

export function getuid (): Promise<Uid> {
  return syscall(getuid.name, ...arguments)
}

export function getgid (): Promise<Gid> {
  return syscall(getgid.name, ...arguments)
}

export function setuid (uid: Uid): Promise<void> {
  return syscall(setuid.name, ...arguments)
}

export function setgid (gid: Gid): Promise<void> {
  return syscall(setgid.name, ...arguments)
}

export function getcwd (): Promise<string> {
  return syscall(getcwd.name, ...arguments)
}

export function chdir (path: string): Promise<void> {
  return syscall(chdir.name, ...arguments)
}

export function fork (): Promise<Pid> {
  return syscall(fork.name, ...arguments)
}

export function execv (pathname: string, argv: string[] = []): Promise<void> {
  return syscall(execv.name, ...arguments)
}

export function execve (path: string, argv: string[] = [], env: any): Promise<void> {
  if (env) environ = Object.assign({}, env)

  return execv(path, argv)
}

export function execl (path: string, ...args: string[]): Promise<void> {
  return execv(path, args)
}

export function execle (path: string, ...args: string[]): Promise<void> {
  let env = args.pop() as any

  return execve(path, args, env)
}

export function pipe (): number[] {
  throw 'Not implemented'
}

export function dup (filedes: number): Promise<void> {
  return syscall(dup.name, arguments)
}

export function dup2 (filedes: number, filedes2: number): Promise<void> {
  return syscall(dup2.name, arguments)
}
