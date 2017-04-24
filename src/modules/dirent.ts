import * as types from './sys/types'
import {syscall} from './unistd'


export {Ino} from './sys/types'

export type Dir = IterableIterator<Dirent>

export interface Dirent {
  ino: types.Ino
  name: string
}

export function opendir (dirname: string): Promise<Dir> {
  return syscall(opendir.name, ...arguments)
}

export function readdir (dirp: Dir): Dirent {
  let result = dirp.next()
  return result.done ? null : result.value
}

export function closedir (dirp: Dir): void { }
