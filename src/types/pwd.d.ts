declare enum UID {
    ROOT = 0,
    BIN = 1,
    DAEMON = 2,
    ADM = 3,
    LP = 4,
    SYNC = 5,
    SHUTDOWN = 6,
    HALT = 7,
    MAIL = 8,
    NEWS = 9,
    UUCP = 10,
    OPERATOR = 11,
    GAMES = 12,
    GOPHER = 13,
    FTP = 14,
}
declare enum GID {
    ROOT = 0,
    BIN = 1,
    DAEMON = 2,
    ADM = 4,
    LP = 7,
    SYNC = 0,
    SHUTDOWN = 0,
    HALT = 0,
    MAIL = 12,
    NEWS = 13,
    UUCP = 14,
    OPERATOR = 0,
    GAMES = 100,
    GOPHER = 30,
    FTP = 50,
}

declare interface Passwd {
    name: string
    uid: number
    gid: number
    dir: string
    shell: string
}

declare function getpwent(): Promise<Passwd>
declare function setpwent(): void
declare function getpwduid(uid: number): Passwd
