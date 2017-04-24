import {Id, Pid} from './types'
import {syscall} from '../unistd'

export {Id, Pid} from './types'

export function waitpid (pid: Pid, options?: number): Promise<number> {
  return syscall(waitpid.name, ...arguments)
}
