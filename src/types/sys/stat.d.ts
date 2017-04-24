declare const S_IFBLK: number
declare const S_IFCHR: number
declare const S_IFIFO: number
declare const S_IFREG: number
declare const S_IFDIR: number
declare const S_IFLNK: number
declare const S_IFSOCK: number
declare const S_IRWXU = 448
declare const S_IRUSR = 256
declare const S_IWUSR = 128
declare const S_IXUSR = 64
declare const S_IRWXG = 56
declare const S_IRGRP = 32
declare const S_IWGRP = 16
declare const S_IXGRP = 8
declare const S_IRWXO = 7
declare const S_IROTH = 4
declare const S_IWOTH = 2
declare const S_IXOTH = 1
declare const S_ISUID = 2048
declare const S_ISGID = 1024
declare const S_ISVTX = 512

declare interface Stat {
    dev: Dev
    ino: Ino
    mode: Mode
    nlink: Nlink
    uid: Uid
    gid: Gid
    rdev: Dev
    size: Off
    atim: Time
    mtim: Time
    ctim: Time
    blksize: Blksize
    blocks: Blkcnt
}
