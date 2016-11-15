import {Ino} from './sys/types'

export {Ino}

export interface Dir {
  d_ino: Ino
  d_name: string
}
