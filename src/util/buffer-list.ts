import { fork } from 'object-fork'

class Entry {
  data: Buffer
  next: Entry
  prev: Entry
}

export default class BufferList {
  head: Entry = null
  tail: Entry = null
  length: number = 0

  toString () {
    return this.join('')
  }

  push (v) {
    const entry: Entry = { data: v, next: null, prev: this.tail }
    if (this.length > 0) {
      this.tail.next = entry
    } else {
      this.head = entry
    }
    this.tail = entry
    ++this.length
  }

  unshift (v) {
    const entry = { data: v, next: this.head, prev: null }
    if (this.length === 0) {
      this.tail = entry
    }
    this.head = entry
    ++this.length
  }

  pop () {
    if (this.length === 0) {
      return
    }
    const ret = this.tail.data
    if (this.length === 1) {
      this.head = this.tail = null
    } else {
      this.tail = this.tail.prev
    }
    --this.length
    return ret
  }

  shift () {
    if (this.length === 0) {
      return
    }
    const ret = this.head.data
    if (this.length === 1) {
      this.head = this.tail = null
    } else {
      this.head = this.head.next
    }
    --this.length
    return ret
  }

  clear () {
    this.head = this.tail = null
    this.length = 0
  }

  join (s) {
    if (this.length === 0) {
      return ''
    }
    var p = this.head
    var ret = '' + p.data
    while ((p = p.next)) {
      ret += s + p.data
    }
    return ret
  }

  concat (n) {
    if (this.length === 0) {
      return new Buffer(0)
    }
    if (this.length === 1) {
      return this.head.data
    }
    const ret = new Buffer(n >>> 0)
    var p = this.head
    var i = 0
    while (p) {
      p.data.copy(ret, i)
      i += p.data.length
      p = p.next
    }
    return ret
  }

  splice (index: number, count?: number, data?: Buffer): void {
    var p = this.head
    var i
    for (i = 0; i < index && p; i++) p = p.next
    if (!p) {
      if (data) return this.push(data)
      return
    }
    p = p.prev
    if (count == null) {
      p.next = null
    } else for (i = 0; i < count && p.next; i++) {
      this.length -= p.next.data.length
      p.next.prev = p
      p.next = p.next.next
    }
    if (!p.next) this.tail = p
    if (data) {
      if (!p.next) return this.push(data)
      p.next = p.next.prev = { data: data, prev: p, next: p.next }
    }
  }

  slice (begin?: number, end?: number) {
    var copy = fork(this)
    copy.splice(0, begin)
    copy.splice(begin)
    return copy
  }

  compare (target) {
    if (!Buffer.isBuffer(target)) {
      target = new Buffer(String(target))
    }
    var p = this.head
    var i = 0
    while (p && i <= target.length) {
      var cmp = p.data.compare(target)
      if (cmp) return cmp
      i += p.data.length
      p = p.next
    }
    if (target.length == this.length) {
      return 0
    }
    return target.length < this.length ? 1 : -1
  }
}
