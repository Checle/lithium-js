import {processes} from '../../kernel/process'
import {Id, Pid} from './types'

export {Id, Pid}

export function waitpid (pid: Pid, options?: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let process = processes.get(pid)
    if (!process) reject(new Error('ECHILD'))
    process.then(result => resolve(0), error => reject(0))
  }
}
