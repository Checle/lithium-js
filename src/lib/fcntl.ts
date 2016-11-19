export const F = {
  DUPFD: 1,
  DUPFD_CLOEXEC: 2,
  GETFD: 3,
  SETFD: 4,
  GETFL: 5,
  SETFL: 6,
  GETLK: 7,
  SETLK: 8,
  SETLKW: 9,
  GETOWN: 10,
  SETOWN: 11,
  RDLCK: 12,
  UNLCK: 13,
  WRLCK: 14,
}

export const O = {
  RDONLY: 1,
  RDWR: 1 << 1,
  WRONLY: 1 << 2,
  NOCTTY: 1 << 3,
  CREAT: 1 << 4,
  TRUNC: 1 << 5,
  APPEND: 1 << 6,
  DSYNC: 1 << 7,
  NONBLOCK: 1 << 8,
  CLOEXEC: 1 << 9,
  EXCL: 1 << 10,
  RSYNC: 1 << 11,
  SYNC: 1 << 12,
}

export declare function open(path: string, oflag?: number, mode?: number): Promise<number>

export function creat(path: string, mode: number = O.RDWR): PromiseLike<number> {
  return open(path, O.CREAT, mode)
}
