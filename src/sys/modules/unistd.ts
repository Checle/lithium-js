import {posix as path} from 'path'

import Global from '../kernel/global'
import Process from '../kernel/process'
import Result from '../result'
import {Size, Ssize, Uid, Gid, Off, Pid, Useconds} from './sys/types'
import {SystemError} from '../errors'

export {Size, Ssize, Uid, Gid, Off, Pid, Useconds}

const process = Process.current

export function getuid (): Uid {
  return process.owner
}

export function getgid (): Gid {
  return process.group
}

export function setuid (uid: Uid): void {
  if (process.owner !== 0) throw new SystemError('Operation not permitted', 'EPERM')
  if (uid === process.owner) return

  
  process.context = new Global(process) // Drop native context
  process.require = Process.prototype.require // Drop native require
  process.owner = uid
}

export function setgid (gid: Gid): void {
  if (process.owner !== 0) throw new SystemError('Operation not permitted', 'EPERM')

  process.group = gid
}

export function getcwd (): string {
  return process.cwd
}

export function fork (): PromiseLike<Pid> {
  let child = Object.create(Process.prototype)
  Object.assign(child, this)
  Process.call(child, this)

  let result = new Result<Pid>()
  result.resolve(child.id)
  result.then = (resolve, reject) => {
    if (resolve) {
      resolve(child.id)
      child.run(() => resolve(0))
    }
    return this
  }
  return result
}

export function execv (pathname: string, argv: string[] = []): void {
  this.cache = {}
  this.args = argv

  return this.require(path.isAbsolute(pathname) ? pathname : path.join('.', pathname))
}

export function execve (path: string, argv: string[] = [], env: any): void {
  if (env) process.context.environ = env
  return execv(path, argv)
}

export function execl (path: string, ...args: string[]): void {
  return execv(path, args)
}

export function execle (path: string, ...args: string[]): void {
  let env: any = args.pop()
  return execve(path, args, env)
}

export function use (object: any): any {
  let source = Global.prototype
  let target = Object.create(source)
  Object.assign(target, object)
  Global.prototype = target
  return source
}

export function install (alias: string, target: string): void {
  // Normalize path
  alias = path.normalize(alias)

  // Transform glob pattern into regular expression
  let source = alias.replace(/(?=[^*?])/g, '\\').replace(/\?/g, '([^])').replace(/\*\*?/g, wildcard => wildcard.length == 1 ? '([^/]*)' : '([^]*)')
  let pattern = new RegExp('^' + source + '$')

  // Create a replacement string
  let i = 0
  let replacement = target.replace(/\$/g, '$$').replace(/\*/g, () => '$' + (++i))

  // Install a function that returns the target path or null
  process.paths[alias] = (path: string) => pattern.test(path) ? path.replace(pattern, replacement) : null
}
