import { Tree } from '../../interfaces'
import { getCommonPrefix, sortedIndexOf, toSequence } from '../../utils'
import Node from './node'

export type Sequence = Array<any> | Buffer | string

export default class PatriciaTrie <T> extends Node<Sequence, T> {
  constructor (key: any, value: T = null, protected offset: number = 0) {
    super(toSequence(key), value)
    this.path = this.key.slice(offset)
  }

  next: PatriciaTrie<T> = null
  previous: PatriciaTrie<T> = null

  protected key
  protected path
  protected last: PatriciaTrie<T> = this
  protected children: { [element: string]: PatriciaTrie<T> } = {}
  protected elements: string[] = []
  protected shared: number = 0
  protected skipped: number = 0

  valueOf (): any {
    return this.value
  }

  private push (child: PatriciaTrie<T>): void {
    child.next = this.next
    child.previous = this
    if (this.next) this.next.previous = child
    this.next = child
  }

  private unshift (child: PatriciaTrie<T>): void {
    child.previous = this.previous
    child.next = this
    if (this.previous) this.previous.next = child
    this.previous = child
  }

  set (key: any, value: T, offset: number = 0): boolean {
    if (key == null) return false
    key = toSequence(key)

    var path = key.slice(offset)

    // Added value is lesser than the minimal value of the tree
    if (path < this.path) {
      // Flip new and old values
      let set = this.set.bind(this, this.value, this.key, this.offset)
      this.value = value
      this.key = key
      this.path = path
      return set()
    }

    // Paths are equal
    if (path <= this.path) {
      return false
    }

    try {
      let prefix = getCommonPrefix(path, this.path)
      let length = this.skipped + prefix.length

      if (length < 0) {
        return false // Cannot add a node outside this tree
      }

      // The value to be added has a common prefix with the node itself
      if (length > 0) {
        if (this.shared && length > this.shared) {
          return this.next.set(key, value, this.offset + this.shared - this.skipped)
        } else {
          this.push(new PatriciaTrie<T>(key, value, this.offset + prefix.length))
          this.shared = length
          return true
        }
      }

      let element = path[0]

      // Value has a common prefix with an existing child
      if (this.children.hasOwnProperty(element)) {
        let child: PatriciaTrie<T> = this.children[element]
        return child.set(key, value, this.offset + 1)
      }

      let child = new PatriciaTrie<T>(key, value, this.offset + 1)

      let index = sortedIndexOf(this.elements, element)
      if (index < this.elements.length) {
        this.children[this.elements[index]].unshift(child)
      } else {
        this.last.push(child)
        this.last = child
      }
      this.elements.splice(index, 0, element)
      this.children[element] = child

      return true
    } finally {
      // Update pointer to the last descendant
      if (!this.elements.length) this.last = this.next.last
      else this.last = this.last.last
    }
  }

  add (value: T): boolean {
    return this.set(value, value)
  }

  has (key: any): boolean {
    var path = toSequence(key)

    if (path < this.path) return false
    if (!(path > this.path)) return true

    let element = path[0]

    if (this.shared && element <= this.path[0]) {
      return this.next.has(path.slice(this.shared))
    }

    if (this.children.hasOwnProperty(element)) {
      return this.children[element].has(path.slice(1))
    }

    return false
  }

  match (key: Sequence): T {
    var path = toSequence(key)

    if (path.length == 0) return this.value
    if (path < this.path) return null
    if (path <= this.path) return this.value

    let element = path[0]

    if (this.shared && element <= this.path[0]) {
      return this.next.match(path.slice(this.shared))
    }

    if (this.children.hasOwnProperty(element)) {
      return this.children[element].match(path.slice(1))
    }

    return null
  }

  get (key: any): T {
    var match = this.match(key)
    if (match == null || toSequence(match).length !== toSequence(key).length) return null
    return match
  }

  find (key: any): PatriciaTrie<T> {
    var path = toSequence(key)

    if (path <= this.path) return this

    let element = path[0]

    if (this.shared && element <= this.path[0]) {
      return this.next.find(path.slice(this.shared))
    }

    if (this.children.hasOwnProperty(element)) {
      return this.children[element].find(path.slice(1))
    }

    return this
  }

  slice (start?: number): PatriciaTrie<T> {
    var length = this.key.length
    if (this.next && start > length && this.shared === length) {
      return this.next.slice(start)
    }
    var slice: PatriciaTrie<T> = Object.create(this)
    slice.path = this.key.slice(start)
    slice.skipped = start - this.offset
    return slice
  }

  select (path: Sequence): PatriciaTrie<T> {
    var target = this.find(path)
    if (target == null) return null
    var prefix = target.key.slice(0, path.length)
    if (prefix < path || prefix > path) return null // Object-tolerant non-equivalence test
    return target.slice(path.length)
  }
}
