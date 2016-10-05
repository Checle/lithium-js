import fork from 'fork.js'
import {Zone, ZoneDelegate, ZoneSpec} from 'zone.js'

const FORK = Symbol()

const zone = Zone.current.fork({
  name: null,

  onInvoke (parent: ZoneDelegate, zone: Zone, target: Zone, delegate: Function, thisArg, args, source: string) {
    // Run all invocations of the zone in the associated object fork
    return zone[FORK].run(() => delegate.apply(thisArg, args))
  },

  onFork (parent: ZoneDelegate, zone: Zone, target: Zone, zoneSpec: ZoneSpec): Zone {
    let copy = zone.fork(zoneSpec)

    // Create an object fork
    copy[FORK] = zone[FORK].fork()

    // Create a new parent fork so modifications to the parent object fork by
    // possibly active timers will not affect the target fork
    zone[FORK] = zone[FORK].fork()

    return copy
  },
})

zone[FORK] = fork()

export default zone
