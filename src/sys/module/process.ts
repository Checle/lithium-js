import * as fs from '../../lib/modules/fs'

import Process from '../kernel/process'

const process = Process.current

export {getuid, setuid, setgid, getcwd as cwd} from 'unistd'

export const argv = process.args
export const pid = process.id
export const env = environ
