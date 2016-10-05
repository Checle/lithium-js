import BaseState from './base'

export default class BufferState extends BaseState {
  private active: boolean = false

  constructor (chunk: Buffer, owner: RecordState = null) {
    super(chunk, owner, chunk)
  }
}
