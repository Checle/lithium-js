import * as fs from 'fs'//../../lib/modules/fs'

export interface Passwd {
  name: string
  uid: number
  gid: number
  dir: string
  shell: string
}

let lines: string[]

export function getpwent (): Thenable<Passwd> {
  if (lines == null) {
    return new Promise<void>((resolve, reject) => {
      fs.readFile('/etc/passwd', 'utf-8', (error, data) => {
        if (error) return reject(error)
        lines = data.split(/\r?\n/g).reverse()
        resolve()
      })
    }).then(() => getpwent())
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
