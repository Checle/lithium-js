import {Blkcnt, Blksize, Dev, Ino, Mode, Nlink, Uid, Gid, Off, Time} from './types'

export {Blkcnt, Blksize, Dev, Ino, Mode, Nlink, Uid, Gid, Off, Time}

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
