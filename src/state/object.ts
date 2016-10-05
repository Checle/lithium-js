import RecordState from './record'
import BaseState from './base'

const CHUNK = new Buffer('')

export default class ObjectState extends RecordState {
  owner: BaseState

  constructor (object: Object, owner: BaseState = null) {
    super(object, owner, CHUNK)
  }

  record (...inputs): RecordState {
    return this.owner.record(...inputs)
  }

  valueOf = () => null
}
