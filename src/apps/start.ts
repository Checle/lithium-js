import bash from './bash'
import block from './block'
import device from './device'
import js from './js'
import record from 'record'

record('/usr/bin/js', js)
record('#!', bash)
record(0, block)
record(device) // Input falls back to device, local directories are appended to existing record paths
