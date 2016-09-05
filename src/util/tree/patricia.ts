import { Tree } from '../../interfaces'
import { getCommonPrefix, sortedIndexOf, toSequence } from '../../utils'
import Node from './node'

export type Sequence = Array<any> | Buffer | string

export default class PatriciaTrie <T> extends Node<T> {
  constructor (value: T = null, protected path: Sequence = toSequence(value)) {
    super(value)
  }

  next: PatriciaTrie<T> = null
  previous: PatriciaTrie<T> = null

  protected last: PatriciaTrie<T> = this
  protected children: { [element: string]: PatriciaTrie<T> } = {}
  protected elements: string[] = []
  protected length: number = null

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

  add (value: T, path?: Sequence): boolean {
    if (value == null) return false
    if (path == null) path = toSequence(value)

    // Added value is lesser than the minimal value of the tree
    if (path < this.path) {
      // Flip new and old values
      let add = this.add.bind(this, this.value, this.path)
      this.value = value
      this.path = path
      return add()
    }

    // Paths are equal
    if (path <= this.path) {
      return false
    }

    try {
      let prefix = getCommonPrefix(path, this.path)

      // The value to be added has a common prefix with the node itself
      if (prefix.length > 0) {
        if (this.length && prefix.length > this.length) {
          return this.next.add(value, path.slice(this.length))
        } else {
          this.push(new PatriciaTrie<T>(value, path.slice(prefix.length)))
          this.length = prefix.length
          return true
        }
      }

      let element = path[0]

      // Value has a common prefix with an existing child
      if (this.children.hasOwnProperty(element)) {
        let child: PatriciaTrie<T> = this.children[element]
        return child.add(value, path.slice(1))
      }

      let child = new PatriciaTrie<T>(value, path.slice(1))

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

  has (value: T, path?: Sequence): boolean {
    if (path == null) path = toSequence(value)
    if (path < this.path) return false
    if (!(path > this.path)) return true

    let element = path[0]

    if (this.length && element <= this.path[0]) {
      return this.next.has(value, path.slice(this.length))
    }

    if (this.children.hasOwnProperty(element)) {
      return this.children[element].has(value, path.slice(1))
    }

    return false
  }

  find (value: T, path?: Sequence): PatriciaTrie<T> {
    if (path == null) path = toSequence(value)
    if (path <= this.path) return this

    let element = path[0]

    if (this.length && element <= this.path[0]) {
      return this.next.find(value, path.slice(this.length))
    }

    if (this.children.hasOwnProperty(element)) {
      return this.children[element].find(value, path.slice(1))
    }

    return this
  }
}
