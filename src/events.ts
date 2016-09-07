import { forkable } from './fork'
import { EventEmitter as BaseEventEmitter } from 'events'

@forkable export class EventEmitter extends BaseEventEmitter {
  private map: { [event: string]: Set<Function> }

  /**
   * Adds the listener function to the end of the listeners array for the event
   * named `event`.
   */
  addListener (event: string, listener: Function): this {
    if (!this.hasOwnProperty('map')) {
      this.map = {}
    }
    if (!this.map.hasOwnProperty(event)) {
      this.map[event] = new Set<Function>()
    }
    this.map[event].add(listener)
    super.addListener(event, listener)
    return this
  }

  /**
   * Removes all own listeners, or those of the specified `event`. Does not
   * affect any listeners owned by a prototype.
   */
  removeAllListeners (event?: string): this {
    if (event == null) {
      for (let event in this.map) {
        if (this.map.hasOwnProperty(event)) {
          this.removeAllListeners(event)
        }
      }
    } else if (this.map.hasOwnProperty(event)) {
      this.map[event].forEach((listener) => this.removeListener(event, listener))
    }
    return this
  }

  /**
   * Removes the specified own listener from the listener array for the event named
   * `event`. Does not affect a listener owned by a prototype.
   */
  removeListener (event: string, listener: Function): this {
    if (this.map.hasOwnProperty(event)) {
      if (this.map[event].delete(listener)) {
        super.removeListener(event, listener)
      }
    }
    return this
  }
}
