import {Duplex} from 'stream'

import RecordState from './record'
import BaseState from './base'
import ObjectState from './object'

export default class StreamState extends ObjectState {
  value: Duplex
  target: RecordState = this.owner

  constructor (value: Duplex, owner: BaseState = null) {
    super(value, owner)

    if (value.readable === true && typeof value.on === 'function') {
      value.on('data', chunk => this.record(chunk))
    }
    if (value.writable === true && typeof value.write === 'function') {
      this.on('data', chunk => value.write(chunk))
    }
  }

  record (...inputs) {
    return this.target = this.target.record(...inputs)
  }
}
