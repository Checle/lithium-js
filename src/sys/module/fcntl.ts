export enum F {
  DUPFD,
  DUPFD_CLOEXEC,
  GETFD,
  SETFD,
  GETFL,
  SETFL,
  GETLK,
  SETLK,
  SETLKW,
  GETOWN,
  SETOWN,
  RDLCK,
  UNLCK,
  WRLCK,
}

export enum O {
  RDONLY = 1,
  RDWR = 1 << 1,
  WRONLY = 1 << 2,
  NOCTTY = 1 << 3,
  CREAT = 1 << 4,
  TRUNC = 1 << 5,
  APPEND = 1 << 6,
  DSYNC = 1 << 7,
  NONBLOCK = 1 << 8,
  CLOEXEC = 1 << 9,
  EXCL = 1 << 10,
  RSYNC = 1 << 11,
  SYNC = 1 << 12,
}

export declare function open(path: string, oflag?: number, mode?: number): Promise<number>

module.exports = Object.create(global)

export function creat(path: string, mode: number = O.RDWR): Thenable<number> {
  return open(path, O.CREAT, mode)
}
