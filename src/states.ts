import { sortedIndexOf } from './utils'

export default StateContext

export interface State {
  push (chunk: Buffer): State
  pop (count?: number): void
}

export abstract class StateContext {
  abstract push (chunk: Buffer)
  abstract seek (offset: number)
}
