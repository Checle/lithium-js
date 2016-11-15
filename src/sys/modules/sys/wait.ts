import {processes} from '../../kernel/process'
import {SystemError} from '../../errors'
import {Id, Pid} from './types'

export {Id, Pid}

export function waitpid (pid: Pid, options?: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let process = processes.get(pid)
    if (!process) reject(new SystemError('No such process', 'ECHILD'))
    process.then(result => resolve(0), error => reject(0))
  }
}
