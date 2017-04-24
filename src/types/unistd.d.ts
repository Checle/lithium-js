declare const STDIN_FILENO = 0
declare const STDOUT_FILENO = 1
declare const STDERR_FILENO = 2
declare const R_OK = 1
declare const W_OK = 2
declare const X_OK = 4
declare const F_OK = 8

declare function access(path: string, amode?: number): Promise<void>
declare function chmod(path: string, mode: number): Promise<void>
declare function chown(path: string, owner: number, group: number): Promise<void>
declare function close(fildes: number): Promise<void>
declare function fchmod(fildes: number, mode: number): Promise<void>
declare function fchown(fildes: number, owner: number, group: number): Promise<void>
declare function fdatasync(fildes: number): Promise<void>
declare function fstat(fildes: number): Promise<Stat>
declare function fsync(fildes: number): Promise<void>
declare function ftruncate(fildes: number, length: number): Promise<void>
declare function lchmod(path: string, mode: number): Promise<void>
declare function lchown(path: string, owner: number, group: number): Promise<void>
declare function link(path1: string, path2: string): Promise<void>
declare function lseek(fildes: number, offset: Off, whence: number): Promise<Off>
declare function lstat(path: string): Promise<Stat>
declare function mkdir(path: string, mode: number): Promise<void>
declare function mkdtemp(template: string): Promise<void>
declare function pread(fildes: number, buf: null | undefined, nbytes: Size, offset: number): Promise<string>
declare function pread(fildes: number, buf: ArrayBuffer, nbytes: Size, offset: number): Promise<Ssize>
declare function pwrite(filedes: number, buf: string | ArrayBuffer, nbytes: Size, offset: number): Promise<Ssize>
declare function read(fildes: number, buf: ArrayBuffer, nbytes?: Size): Promise<Ssize>
declare function read(fildes: number): Promise<ArrayBuffer>
declare function read(fildes: number): Promise<ArrayBuffer>
declare function readlink(path: string): Promise<string>
declare function realpath(file_name: string): Promise<string>
declare function rmdir(path: string): Promise<void>
declare function stat(path: string): Promise<Stat>
declare function symlink(path1: string, path2: string): Promise<void>
declare function truncate(path: string, length: number): Promise<void>
declare function unlink(path: string): Promise<void>
declare function write(filedes: number, buf: string | ArrayBuffer, nbytes?: Size): Promise<Ssize>
declare function getpid(): Promise<Pid>
declare function getuid(): Promise<Uid>
declare function getgid(): Promise<Gid>
declare function setuid(uid: Uid): Promise<void>
declare function setgid(gid: Gid): Promise<void>
declare function getcwd(): Promise<string>
declare function chdir(path: string): Promise<void>
declare function fork(): Promise<Pid>
declare function execv(pathname: string, argv?: string[]): Promise<void>
declare function execve(path: string, argv: string[], env: any): Promise<void>
declare function execl(path: string, ...args: string[]): Promise<void>
declare function execle(path: string, ...args: string[]): Promise<void>
declare function pipe(): number[]
declare function dup(filedes: number): Promise<void>
declare function dup2(filedes: number, filedes2: number): Promise<void>
