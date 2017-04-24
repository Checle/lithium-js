import {syscall} from './unistd'

export const F_DUPFD = 1
export const F_DUPFD_CLOEXEC = 2
export const F_GETFD = 3
export const F_SETFD = 4
export const F_GETFL = 5
export const F_SETFL = 6
export const F_GETLK = 7
export const F_SETLK = 8
export const F_SETLKW = 9
export const F_GETOWN = 10
export const F_SETOWN = 11
export const F_RDLCK = 12
export const F_UNLCK = 13
export const F_WRLCK = 14

export const O_RDONLY = 1
export const O_RDWR = 1 << 1
export const O_WRONLY = 1 << 2
export const O_NOCTTY = 1 << 3
export const O_CREAT = 1 << 4
export const O_TRUNC = 1 << 5
export const O_APPEND = 1 << 6
export const O_DSYNC = 1 << 7
export const O_NONBLOCK = 1 << 8
export const O_CLOEXEC = 1 << 9
export const O_EXCL = 1 << 10
export const O_RSYNC = 1 << 11
export const O_SYNC = 1 << 12

export function open(path: string, oflag?: number, mode?: number): Promise<number> {
  return syscall(open.name, ...arguments)
}

export function creat(path: string, mode: number = O_RDWR): PromiseLike<number> {
  return open(path, O_CREAT, mode)
}
