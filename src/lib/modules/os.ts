import {getpwduid} from 'pwd'
import {getuid} from 'unistd'

export function homedir (): string {
  return getpwduid(getuid()).dir
}
