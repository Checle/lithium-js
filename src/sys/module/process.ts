import * as path from 'path'

import Process from '../kernel/process'

const process = Process.current

export {getuid, setuid, setgid, getcwd as cwd} from 'unistd'

export const argv = process.args
export const pid = process.id
export const env = environ

export function chdir (directory: string): void {
  process.cwd = path.resolve(process.cwd, directory)
}
