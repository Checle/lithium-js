import {Blkcnt, Blksize, Dev, Ino, Mode, Nlink, Uid, Gid, Off, Time} from './types'

export {Blkcnt, Blksize, Dev, Ino, Mode, Nlink, Uid, Gid, Off, Time}

export interface Stat {
  st_dev: Dev
  st_ino: Ino
  st_mode: Mode
  st_nlink: Nlink
  st_uid: Uid
  st_gid: Gid
  st_rdev: Dev
  st_size: Off
  st_atim: Time
  st_mtim: Time
  st_ctim: Time
  st_blksize: Blksize
  st_blocks: Blkcnt
}
