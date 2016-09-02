/**
 * @source https://github.com/nodejs/node/blob/master/lib/internal/streams/BufferList.js
 */

class Entry {
  data: Buffer
  next: Entry
}

export default class BufferList {
  constructor () {
    this.head = null
    this.tail = null
    this.length = 0
  }

  head: Entry
  tail: Entry
  length: number

  push (v) {
    const entry: Entry = { data: v, next: null }
    if (this.length > 0) {
      this.tail.next = entry
    } else {
      this.head = entry
    }
    this.tail = entry;
    ++this.length
  }

  unshift (v) {
    const entry = { data: v, next: this.head }
    if (this.length === 0) {
      this.tail = entry
    }
    this.head = entry;
    ++this.length
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
}
