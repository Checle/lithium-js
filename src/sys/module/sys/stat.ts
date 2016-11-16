import {Blkcnt, Blksize, Dev, Ino, Mode, Nlink, Uid, Gid, Off, Time} from './types'

export {Blkcnt, Blksize, Dev, Ino, Mode, Nlink, Uid, Gid, Off, Time}

export const S = {
  IFBLK: 1 << 32 << 1,
  IFCHR: 1 << 32 << 2,
  IFIFO: 1 << 32 << 3,
  IFREG: 1 << 32 << 4,
  IFDIR: 1 << 32 << 5,
  IFLNK: 1 << 32 << 6,
  IFSOCK: 1 << 32 << 7,
  IRWXU: 0o700,
  IRUSR: 0o400,
  IWUSR: 0o200,
  IXUSR: 0o100,
  IRWXG: 0o70,
  IRGRP: 0o40,
  IWGRP: 0o20,
  IXGRP: 0o10,
  IRWXO: 0o7,
  IROTH: 0o4,
  IWOTH: 0o2,
  IXOTH: 0o1,
  ISUID: 0o4000,
  ISGID: 0o2000,
  ISVTX: 0o1000,
}

export interface Stat {
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
