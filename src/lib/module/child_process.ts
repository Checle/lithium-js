import * as path from 'path'
import * as unistd from 'unistd'
import * as process from 'process'
import {kill} from 'signal'
import {pipe, pread, dup2, execv, Pid, close} from 'unistd'
import {fileno, tmpfile} from 'stdio'
import {EventEmitter} from 'events'
import {SpawnSyncReturns} from 'child_process'
import {waitpid} from 'sys/wait'

export class ChildProcess extends EventEmitter {
  constructor (public readonly pid: Pid) {
    super()
  }

  kill (status?: number) { return kill(this.pid, status) }
}

export function spawn (command: string, args: string[] = []): ChildProcess {
  let result = unistd.fork()
  result.then(pid => pid === 0 && unistd.execv(command, args))

  let pid = result.valueOf()
  return new ChildProcess(pid)
}

export function spawnSync (command: string, args: string[] = []): SpawnSyncReturns<string> {
  const stdout = tmpfile().valueOf()
  const stderr = tmpfile().valueOf()
  const fork = unistd.fork()

  fork.then(pid => {
    if (pid) return

    dup2(fileno(stdout), 1)
    dup2(fileno(stderr), 2)

    execv(command, args)
  })

  const pid = fork.valueOf()
  const result = { pid, signal: null } as SpawnSyncReturns<string>

  try {
    result.status = waitpid(pid).valueOf()
  } catch (error) {
    result.error = error
  }

  result.stdout = pread(1, null, null, 0).valueOf()
  result.stderr = pread(2, null, null, 0).valueOf()
  result.output = [undefined, result.stdout, result.stderr]
  return result
}

export function fork (modulePath: string, args: string[] = []): ChildProcess {
  return spawn('../bin/js', ['--', modulePath].concat(args))
}
