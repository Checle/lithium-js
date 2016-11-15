import {readfile} from 'unistd'

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
    let content = await readfile('/etc/passwd')
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
