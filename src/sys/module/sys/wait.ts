import {Id, Pid} from 'sys/types'

import {processes} from '../../kernel/process'

export {Id, Pid}

export function waitpid (pid: Pid, options?: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let process = processes.get(pid)
    if (!process) reject(new Error('ECHILD'))
    process.then(result => resolve(pid), error => reject(error))
  })
}
