import {syscall} from './unistd'

export function exit (status: number): Promise<void> {
  return syscall(exit.name, ...arguments)
}
