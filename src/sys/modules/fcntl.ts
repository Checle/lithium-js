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

export const O_CLOEXEC = 1
export const O_CREAT = 2
export const O_DIRECTORY = 3
export const O_EXCL = 4
export const O_NOCTTY = 5
export const O_NOFOLLOW = 6
export const O_TRUNC = 7
export const O_TTY_INIT = 8
export const O_APPEND = 9
export const O_DSYNC = 10
export const O_NONBLOCK = 11
export const O_RSYNC = 12
export const O_SYNC = 13
export const O_ACCMODE = 14
export const O_EXEC = 15
export const O_RDONLY = 16
export const O_RDWR = 17
export const O_SEARCH = 18
export const O_WRONL = 19

export declare function open(path: string, oflag: number, mode?: number): Thenable<number>
