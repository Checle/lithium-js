import {Duplex, Writable} from 'stream'

export interface Seekable {
  seekable: Boolean

  seek (offset: number): number
}

export interface State {
  /**
   * Creates a new state as a transition of the current state. May alter the
   * current state.
   */
  transform (chunk?: Buffer): State
}

export interface StateContext extends State, Seekable {
  /**
   * Performs a state transition from the current context state feeding `chunk`
   * to the state machine and returns the resulting state. Updates the context
   * state to the resulting state.
   */
  transform (chunk?: Buffer): State

  /**
   * Reposition state to corresponding to the current input position plus
   * `offset` bytes. A new transition may be invokes if the target position
   * does not match a state boundary.
   */
  seek (offset: number): number
}

export interface Record {
  name: string
  path: string
  position: number

  (...inputs): Record

  pipe (destination: Writable): Writable
  write (chunk: Buffer, callback: Function): boolean
}

export interface Container extends Duplex {
  stop (): void
  record (...inputs): void
}
