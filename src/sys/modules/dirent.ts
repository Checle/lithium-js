import {Ino} from './sys/types'

export {Ino}

export interface Dir {
  ino: Ino
  name: string
}
