import base from '../base'
import {IDPool} from '../util/pool'
import {SystemError} from '../errors'

const files = {} as any
const fileIDs = new IDPool()

export function readFileSync(file: any): string {
  let buffer = Buffer.isBuffer(file) ? file : Buffer.from(String(file))

  let state = base.get(buffer)
  if (state == null) throw new SystemError('ENOENT')

  let value = state.valueOf()
  if (value == null) throw new SystemError('ENOENT')

  return value
}
