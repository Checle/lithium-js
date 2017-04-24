import Process from './process'
import {processes} from './process'
import {instantiate, Instance} from './assembly'

export default class Syscalls {
  constructor (public process: Process) { }

  async install (library: any): Promise<void> {
    let process = this.process
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

  getpid (): number {
    return this.process.id
  }

  getuid (): number {
    return this.process.owner
  }

  getgid (): number {
    return this.process.group
  }

  setuid (uid: number): void {
    const process = this.process

    if (process.owner !== 0) throw new Error('EPERM')

    process.owner = uid
  }

  setgid (gid: number): void {
    if (this.process.owner !== 0) throw new Error('EPERM')

    this.process.group = gid
  }

  getcwd (): string {
    return this.process.cwd
  }

  async chdir (path: string): Promise<void> {
    path = await realpath(path)
    this.process.cwd = path
  }

  access (path: string, amode: number): number {
    return 0
  }

  exit (status: number): Promise<void> {
    this.process.terminate(status || null)

    // Promise that does not resolve
    return new Promise<void>(() => null)
  }

  execv (pathname: string, argv: string[] = []): Promise<void> {
    let process = this.process

    // POSIX requires any pathname containing a slash to be referenced to a local context
    pathname = pathname.indexOf('/') === -1 ? pathname : './' + pathname

    // Resolve pathname against `PATH` and enable native module resolution such as filename extension
    const test = async pathname => pathname = await process.loader.resolve(pathname) && await access(pathname, X_OK)

    let filename = await resolve.call(environ && environ['PATH'], pathname, test)

    process.path = filename
    process.arguments = process.context.arguments = argv.slice()

    let buffer = new ArrayBuffer(BUFSIZ)
    let buffers = []

    while (await read(fd, buffer) > 0) {
      buffers.push(buffer)
    }

    let content = buffers.join('')

    exec (code: string) {
      let blob = new Blob([code])
      let url = URL.createObjectURL(blob)
      let worker = new Worker(url)

      this.worker = worker

      worker.addEventListener('message', event => {
        let args = event.data as any[]

        this.syscall....args)
      })
    }

    let exports = await process.run(() => System.import(filename))

    if (typeof exports.default === 'function') {
      // Run main function asynchronously, pass `argv[0]` as `this` and subsequent values as `arguments`
      let status = await exports.default(...argv)

      // Report exit code
      exit(Number(status))
    }

    // Promise that never resolves (see POSIX)
    return new Promise<void>(() => null)
  }

  async realpath (fileName: string): Promise<string> {
    throw 'Not implemented'
  }

  dup (filedes: number): void {
    this.process.files.add(this.process.files.get(filedes))
  }

  dup2 (filedes: number, filedes2: number): void {
    this.process.files.set(filedes, this.process.files.get(filedes))
  }

  waitpid (pid: number, options?: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let process = processes.get(pid)
      if (!process) reject(new Error('ECHILD'))
      process.then(result => resolve(pid), error => reject(error))
    })
  }
}
