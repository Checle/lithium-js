import Process from './process'
import {processes} from './process'

export async function install (library: any): Promise<void> {
  let process = Process.current
  let namespace = process.namespace
  let module = library

  if (typeof library === 'string') {
    module = await System.import(library)
  }

  // Extend namespace
  namespace.context = Object.assign(namespace.context, module)

  // Copy into the current global object
  Object.assign(process.context, module)
}

export function getpid (): number {
  return Process.current.id
}

export function getuid (): number {
  return Process.current.owner
}

export function getgid (): number {
  return Process.current.group
}

export function setuid (uid: number): void {
  const process = Process.current

  if (process.owner !== 0) throw new Error('EPERM')

  process.owner = uid
}

export function setgid (gid: number): void {
  if (Process.current.owner !== 0) throw new Error('EPERM')

  Process.current.group = gid
}

export function getcwd (): string {
  return Process.current.cwd
}

export async function chdir (path: string): Promise<void> {
  path = await realpath(path)
  Process.current.cwd = path
}

export function access (path: string, amode: number): number {


  return 0
}

export function clone (fn: Function, childStack: any, flags: number, arg?: any): PromiseLike<Pid> {
  let child = new Process(Process.current)
  let promise1 = Promise.resolve(child.id)
  let promise2 = Promise.resolve(0)

  // Execute subsequent steps in both child and parent zone
  return {
    then: (resolve, reject) => {
      promise1.then(resolve, reject)
      child.run(() => promise2.then(resolve, reject))
      return this
    },
    valueOf: () => {
      promise2.valueOf()
      return promise1.valueOf()
    }
  }
}

export function exit (status: number): Promise<void> {
  Process.current.cancel(status || null)

  // Promise that does not resolve
  return new Promise<void>(() => null)
}

export async function execv (pathname: string, argv: string[] = []): Promise<void> {
  const process = Process.current

  // POSIX requires any pathname containing a slash to be referenced to a local context
  pathname = pathname.indexOf('/') === -1 ? pathname : './' + pathname

  // Resolve pathname against `PATH` and enable native module resolution such as filename extension
  const test = async pathname => pathname = await process.loader.resolve(pathname) && await access(pathname, X_OK)

  let filename = await resolve.call(environ && environ['PATH'], pathname, test)

  process.path = filename
  process.arguments = process.context.arguments = argv.slice()

  let object = process.require(filename)

  if (typeof object.default === 'function') {
    // Run main function asynchronously, pass `argv[0]` as `this` and subsequent values as `arguments`
    let status = await object.default(...argv)

    // Report exit code
    exit(Number(status))
  }

  // Promise that never resolves (see POSIX)
  return new Promise<void>(() => null)
}

export function realpath (file_name: string): Promise<string> {
  throw 'Not implemented'
}

export function dup (filedes: number): void {
  Process.current.files.add(Process.current.files.get(filedes))
}

export function dup2 (filedes: number, filedes2: number): void {
  Process.current.files.set(filedes, Process.current.files.get(filedes))
}

export function waitpid (pid: number, options?: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let process = processes.get(pid)
    if (!process) reject(new Error('ECHILD'))
    process.then(result => resolve(pid), error => reject(error))
  })
}
