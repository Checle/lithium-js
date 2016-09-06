import { Tree } from '../../interfaces'
import { getCommonPrefix, sortedIndexOf, toSequence } from '../../utils'
import Node from './node'

export type Sequence = Array<any> | Buffer | string

export default class PatriciaTrie <T> extends Node<T> {
  constructor (value: T = null, protected sequence = toSequence(value), protected offset: number = 0) {
    super(value)
  }

  next: PatriciaTrie<T> = null
  previous: PatriciaTrie<T> = null

  protected path = this.sequence.slice(this.offset)
  protected last: PatriciaTrie<T> = this
  protected children: { [element: string]: PatriciaTrie<T> } = {}
  protected elements: string[] = []
  protected shared: number = null
  protected skipped: number = 0

  valueOf (): any {
    return this.path
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

  add (value: T, sequence: Sequence = toSequence(value), offset: number = 0): boolean {
    if (sequence == null) return false
    var path = sequence.slice(offset)

    // Added value is lesser than the minimal value of the tree
    if (path < this.path) {
      // Flip new and old values
      let add = this.add.bind(this, this.value, this.sequence, this.offset)
      this.value = value
      this.sequence = sequence
      this.path = path
      return add()
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
          return this.next.add(value, sequence, this.offset + this.shared - this.skipped)
        } else {
          this.push(new PatriciaTrie<T>(value, sequence, this.offset + prefix.length))
          this.shared = length
          return true
        }
      }

      let element = path[0]

      // Value has a common prefix with an existing child
      if (this.children.hasOwnProperty(element)) {
        let child: PatriciaTrie<T> = this.children[element]
        return child.add(value, sequence, this.offset + 1)
      }

      let child = new PatriciaTrie<T>(value, sequence, this.offset + 1)

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

  has (value: any): boolean {
    var path = toSequence(value)

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

  find (value: any): PatriciaTrie<T> {
    var path = toSequence(value)

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
    var slice: PatriciaTrie<T> = Object.create(this)
    slice.path = this.sequence.slice(start)
    slice.skipped += start - this.offset
    return slice
  }

  select (path: Sequence): PatriciaTrie<T> {
    var target = this.find(path)
    if (target == null) return null
    var prefix = target.sequence.slice(0, path.length)
    if (prefix < path || prefix > path) return null // Object-tolerant equivalence test
    return target.slice(path.length)
  }
}
