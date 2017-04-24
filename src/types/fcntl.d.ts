declare const F_DUPFD = 1
declare const F_DUPFD_CLOEXEC = 2
declare const F_GETFD = 3
declare const F_SETFD = 4
declare const F_GETFL = 5
declare const F_SETFL = 6
declare const F_GETLK = 7
declare const F_SETLK = 8
declare const F_SETLKW = 9
declare const F_GETOWN = 10
declare const F_SETOWN = 11
declare const F_RDLCK = 12
declare const F_UNLCK = 13
declare const F_WRLCK = 14
declare const O_RDONLY = 1
declare const O_RDWR: number
declare const O_WRONLY: number
declare const O_NOCTTY: number
declare const O_CREAT: number
declare const O_TRUNC: number
declare const O_APPEND: number
declare const O_DSYNC: number
declare const O_NONBLOCK: number
declare const O_CLOEXEC: number
declare const O_EXCL: number
declare const O_RSYNC: number
declare const O_SYNC: number

declare function open(path: string, oflag?: number, mode?: number): Promise<number>
declare function creat(path: string, mode?: number): PromiseLike<number>
