import {BUFSIZ} from './stdio'
import {open} from './fcntl'
import {read, close} from './unistd'

export enum UID {
  ROOT = 0,
  BIN,
  DAEMON,
  ADM,
  LP,
  SYNC,
  SHUTDOWN,
  HALT,
  MAIL,
  NEWS,
  UUCP,
  OPERATOR,
  GAMES,
  GOPHER,
  FTP,
}

export enum GID {
  ROOT = 0,
  BIN = 1,
  DAEMON = 2,
  ADM = 4,
  LP = 7,
  SYNC = 0,
  SHUTDOWN = 0,
  HALT = 0,
  MAIL = 12,
  NEWS = 13,
  UUCP =  14,
  OPERATOR =  0,
  GAMES =  100,
  GOPHER =  30,
  FTP =  50,
}

export interface Passwd {
  name: string
  uid: number
  gid: number
  dir: string
  shell: string
}

let lines: string[]

export async function getpwent (): Promise<Passwd> {
  if (lines == null) {
    let fd = await open('/etc/passwd')
    let buffer = new ArrayBuffer(BUFSIZ)
    let buffers = []

    while (await read(fd, buffer) > 0) {
      buffers.push(buffer)
    }

    let content = buffers.join('')

    lines = content.toString().split(/\r?\n/g).reverse()
  }

  if (!lines.length) return null

  let [name, pwd, uid, gid, title, dir, shell] = lines.pop().split(':')

  return {name, uid: Number(uid), gid: Number(gid), dir, shell} as Passwd
}

export function setpwent () {
  lines = null
}

export function getpwduid (uid: number): Passwd {
  setpwent()

  const next = () => getpwent().then(passwd => passwd == null || passwd.uid === uid ? passwd : next())

  return next()
}
