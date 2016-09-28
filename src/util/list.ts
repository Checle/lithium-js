import {Element} from './entry'
import {fork} from './fork'
import {Slice} from '../interfaces'
import {toSlice} from '../utils'

export default List

@fork export class List <T extends Slice> extends Element <T> {
  @fork next: Element<T> = null // Head
  @fork previous: Element<T> = null // Tail
  length: number = 0

  toString () {
    return this.join('')
  }

  push (v) {
    const entry = new Element<T>(v, null, this.previous)
    if (this.length > 0) {
      this.previous.next = entry
    } else {
      this.next = entry
    }
    this.previous = entry
    ++this.length
  }

  unshift (v) {
    const entry = new Element<T>(v, this.next, null)
    if (this.length === 0) {
      this.previous = entry
    }
    this.next = entry
    ++this.length
  }

  pop () {
    if (this.length === 0) {
      return
    }
    const ret = this.previous.value
    if (this.length === 1) {
      this.next = this.previous = null
    } else {
      this.previous = this.previous.previous
    }
    --this.length
    return ret
  }

  shift () {
    if (this.length === 0) {
      return
    }
    const ret = this.next.value
    if (this.length === 1) {
      this.next = this.previous = null
    } else {
      this.next = this.next.next
    }
    --this.length
    return ret
  }

  clear () {
    this.next = this.previous = null
    this.length = 0
  }

  join (s) {
    if (this.length === 0) {
      return ''
    }
    var p = this.next
    var ret = '' + p.value
    while ((p = p.next)) {
      ret += s + p.value
    }
    return ret
  }

  toArray (): T[] {
    var array: T[] = new Array<T>(this.length)
    for (let i = 0, p = this.next; p; i++) {
      array[i] = p.value
    }
    return array
  }

  splice (index: number, count?: number, value?: T): void {
    var p: Element<T> = this
    var i
    for (i = 0; i < index && p.next; i++) p = p.next
    if (!p.next) {
      if (value) return this.push(value)
      return
    }
    if (count == null) {
      p.next = null
    } else for (i = 0; i < count && p.next; i++) {
      --this.length
      p.next.previous = p
      p.next = p.next.next
    }
    if (!p.next) this.previous = p
    if (value) {
      if (!p.next) return this.push(value)
      p.next = p.next.previous = new Element<T>(value, p, p.next)
      ++this.length
    }
  }

  slice (begin?: number, end?: number): List<T> {
    var copy = fork(this)
    if (begin != null) {
      copy.splice(0, begin)
      if (end != null) {
        copy.splice(begin, end - begin)
      }
    }
    return copy
  }

  compare (value: any) {
    value = toSlice(value)
    var p = this.next
    var i = 0
    while (p && i <= value.length) {
      let slice = value.slice(i, i + p.value.length)
      if (slice < p.value) return 1
      if (slice > p.value) return -1
      i += p.value.length
      p = p.next
    }
    if (value.length == this.length) {
      return 0
    }
    return value.length < this.length ? 1 : -1
  }
}

export class BufferList extends List<Buffer> {
  concat (n) {
    if (this.length === 0) {
      return new Buffer(0)
    }
    if (this.length === 1) {
      return this.next.value
    }
    const ret = new Buffer(n >>> 0)
    var p = this.next
    var i = 0
    while (p) {
      p.value.copy(ret, i)
      i += p.value.length
      p = p.next
    }
    return ret
  }
}
