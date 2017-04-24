declare const SIGHUP = 1
declare const SIGINT = 2
declare const SIGQUIT = 3
declare const SIGILL = 4
declare const SIGTRAP = 5
declare const SIGABRT = 6
declare const SIGBUS = 7
declare const SIGFPE = 8
declare const SIGKILL = 9
declare const SIGUSR1 = 10
declare const SIGSEGV = 11
declare const SIGUSR2 = 12
declare const SIGPIPE = 13
declare const SIGALRM = 14
declare const SIGTERM = 15
declare const SIGCHLD = 17
declare const SIGCONT = 18
declare const SIGSTOP = 19
declare const SIGTSTP = 20
declare const SIGTTIN = 21
declare const SIGTTOU = 22
declare const SIGURG = 23
declare const SIGXCPU = 24
declare const SIGXFSZ = 25
declare const SIGVTALRM = 26
declare const SIGPROF = 27
declare const SIGPOLL = 29
declare const SIGSYS = 31

declare type Sigset = number

declare interface Siginfo {
    signo: number
    code: number
    errno: number
    pid: Pid
    uid: Uid
    addr: Function
    status: number
    band: number
}

declare interface Sigaction {
    handler: (sig: number) => void
    mask?: Sigset
    flags?: number
    sigaction?: (signo: number, info: Siginfo, context: any) => void
}

declare function raise(sig: number): void
declare function kill(pid: Pid, sig?: number): void
