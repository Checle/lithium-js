import { Tree, Slice } from '../../interfaces'
import { getCommonPrefix, sortedIndexOf, toSlice, elementOf } from '../../utils'
import { Entry, Element } from '../entry'

export default class PatriciaTrie <T> extends Entry<Slice, T> implements Tree<Slice, T> {
  constructor (value: T = undefined, key: any = value) {
    super(toSlice(key), value)
  }

  next: PatriciaTrie<T> = null
  previous: PatriciaTrie<T> = null
  parent: PatriciaTrie<T> = null
  first: PatriciaTrie<T> = this
  last: PatriciaTrie<T> = this

  private children: { [element: string]: PatriciaTrie<T> } = {}
  private elements: string[] = []

  private static concat <T> (previous: PatriciaTrie<T>, ...nodes: PatriciaTrie<T>[]): void {
    for (let next of nodes) {
      if (previous) previous.last.next = next && next.first
      if (next) next.first.previous = previous && previous.last
      previous = next
    }
  }

  private update (): void {
    if (this.elements.length) {
      let first = this.elements[0]
      let last = this.elements[this.elements.length - 1]
      if (this.value === undefined) this.first = this.children[first].first
      this.last = this.children[last].last
    } else {
      this.first = this
      this.last = this
    }
  }

  private splice (child: PatriciaTrie<T>, offset?: number): PatriciaTrie<T> {
    if (offset) child.key = child.key.slice(offset)

    // Get the first character of the key
    let element = elementOf(child.key, 0)

    // Value has a common prefix with an existing child
    if (this.children.hasOwnProperty(element)) {
      child = this.children[element].insert(child)
    } else {
      let index = sortedIndexOf(this.elements, element)
      let previous, next
      if (this.elements.length === 0) {
        previous = this.value === undefined ? this.first.previous : this
        next = this.last.next
      } else if (index === 0) {
        next = this.children[this.elements[0]].first
        previous = next.first.previous
      } else {
        previous = this.children[this.elements[index - 1]].last
        next = previous.last.next
      }
      PatriciaTrie.concat(previous, child, next)
      this.elements.splice(index, 0, element)
      this.children[element] = child
      child.parent = this.value == null ? null : this
    }
    // Update first and last pointers
    this.update()
    return child
  }

  private split (offset: number): PatriciaTrie<T> {
    // Create a prefix node
    let target = new PatriciaTrie<T>(undefined, this.key.slice(0, offset))
    // Remove this node from parent
    this.remove()
    // Add prefix node to parent
    this.parent.splice(target)
    // Add current node as a suffix node
    target.splice(this, offset)
    return target
  }

  private insert (child: PatriciaTrie<T>): PatriciaTrie<T> {
    let prefix = getCommonPrefix(child.key, this.key)
    let length = prefix.length

    if (length < this.key.length) { // Ramify
      return this.split(length).splice(child, length)
    }
    if (child.key.length > length) { // Append
      return this.splice(child, length)
    }
    // Key exists
    if (this.value === undefined) this.value = child.value
    return this
  }

  private remove (): void {
    if (this.previous) this.previous.next = this.next
    if (this.next) this.next.previous = this.previous
    if (this.parent) {
      let element = this.key[0]
      this.parent.elements.splice(sortedIndexOf(this.parent.elements, element) - 1, 1)
      delete this.parent.children[element]
      this.parent.update()
    }
  }

  /**
   * Adds or updates an element with a specified key and value to the tree.
   */
  set (key: any, value: T): T {
    key = toSlice(key)
    let child = new PatriciaTrie<T>(value, key)
    let target = this.insert(child)
    // Overwrite target node if an equal key exists
    if (target !== child) target.value = child.value
    return target.value
  }

  /**
   * Inserts a new element to the tree at a sorted position.
   */
  add (value: T): T {
    let child = new PatriciaTrie<T>(value)
    // Insert and return false if a node with equal key exists
    return this.insert(child).value
  }

  /**
   * Returns a boolean indicating whether an element with the specified key
   * exists in the tree.
   */
  has (key: any): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Returns a specified element from the tree.
   */
  get (key: any): T {
    key = toSlice(key)

    let length = this.key.length
    let prefix = key.slice(0, length)
    if (prefix < this.key || prefix > this.key) return undefined
    if (key.length === length) return this.value

    let element = elementOf(key, length)
    if (this.children.hasOwnProperty(element)) {
      return this.children[element].get(key.slice(length))
    }
    return undefined
  }

  /**
   * Returns the subtree that matches the specified key most closely, that is,
   * the first element of the set of elements with the largest common number of
   * leading bytes in common with the specified key.
   */
  find (key: any): PatriciaTrie<T> {
    key = toSlice(key)

    let length = this.key.length
    let prefix = key.slice(0, length)
    if (prefix < this.key || prefix > this.key || key.length <= length) {
      return this.first
    }
    let element = elementOf(key, length)
    if (this.children.hasOwnProperty(element)) {
      return this.children[element].find(key.slice(length))
    }
    return this.first
  }

  locate (key: any): T {
    return this.find(key).value
  }

  /**
   * Returns the subtree as a result of stripping the specified number of
   * leading bytes of the current target element's key.
   */
  slice (start?: number): PatriciaTrie<T> {
    if (start > this.key.length) {
      if (!this.elements.length) return null
      return this.children[this.elements[0]].slice(start - this.key.length)
    }
    var slice: PatriciaTrie<T> = Object.create(this)
    slice.key = this.key.slice(start)
    return slice
  }

  /**
   * Returns a subtree whose path equals the specified key.
   */
  select (key: Slice): PatriciaTrie<T> {
    var target = this.find(key)
    if (target == null) return null
    var prefix = target.key.slice(0, key.length)
    if (prefix < key || prefix > key) return null // Object-tolerant non-equivalence test
    return target.slice(key.length)
  }
}
