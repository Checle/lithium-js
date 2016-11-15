import {processes} from '../kernel/process'
import {Pid} from './sys/types'

export {Pid}

export const SIGHUP = 1
export const SIGINT = 2
export const SIGQUIT = 3
export const SIGILL = 4
export const SIGTRAP = 5
export const SIGABRT = 6
export const SIGBUS = 7
export const SIGFPE = 8
export const SIGKILL = 9
export const SIGUSR1 = 10
export const SIGSEGV = 11
export const SIGUSR2 = 12
export const SIGPIPE = 13
export const SIGALRM = 14
export const SIGTERM = 15
export const SIGCHLD = 17
export const SIGCONT = 18
export const SIGSTOP = 19
export const SIGTSTP = 20
export const SIGTTIN = 21
export const SIGTTOU = 22
export const SIGURG = 23
export const SIGXCPU = 24
export const SIGXFSZ = 25
export const SIGVTALRM = 26
export const SIGPROF = 27
export const SIGPOLL = 29
export const SIGSYS = 31

export function kill (pid: Pid, status?: number): void {
  processes.get(pid).cancel()
  processes.delete(pid)
}
