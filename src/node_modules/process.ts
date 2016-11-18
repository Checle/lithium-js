import * as path from 'path'
import {getpid} from 'unistd'
import {fdopen, File} from 'stdio'

export {getuid, setuid, setgid, getcwd as cwd, chdir} from 'unistd'
export {exit} from 'stdlib'

export const pid = getpid()
export const env = environ
export const stdin = fdopen(0, 'r')
export const stdout = fdopen(1, 'w')
export const argv = arguments
