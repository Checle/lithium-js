import BaseState from './state/base'
import bash from './content/bash'
import script from './content/script'
import device from './content/device'

const base = new BaseState()

base.record('#!', bash)
// base.record(0, block)
base.record(device, script) // TODO: script should be accepted like shown here, without causing invocation of device
// Input falls back to device, local directories are appended to existing record paths
// JavaScript is attempted to parse as a final measure

export default base
