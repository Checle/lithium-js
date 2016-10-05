import base from '../base'
import {IDPool} from '../util/pool'
import {SystemError} from '../errors'

const processes = {} as any
const processIDs = new IDPool()

export const pid = processIDs.acquire()
