import {Ino} from './sys/types'

export {Ino}

export type Dir = IterableIterator<Dirent>

export interface Dirent {
  ino: Ino
  name: string
}

export declare function opendir (dirname: string): Promise<Dir>

export function readdir (dirp: Dir): Dirent {
  let result = dirp.next()
  return result.done ? null : result.value
}

export function closedir (dirp: Dir): void { }
