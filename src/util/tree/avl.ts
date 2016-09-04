// This file is originally from the Concentré XML project (version 0.2.1)
// Licensed under GPL and LGPL.
// Modified by Jeremy Stephens.

import { mergeable, forkable } from '../forks'
import { Tree } from '../../interfaces'

@forkable export default class AVLTree<T> implements Tree<T> {
  constructor (public value?: T, public next?: AVLTree<T>, private previous?: AVLTree<T>) { }

  private depth: number = 1
  private left: AVLTree<T> = null
  private right: AVLTree<T> = null

  private balance () {
    var ldepth = this.left == null ? 0 : this.left.depth
    var rdepth = this.right == null ? 0 : this.right.depth

    if (ldepth > rdepth + 1) {
      // LR or LL rotation
      var lldepth = this.left.left == null ? 0 : this.left.left.depth
      var lrdepth = this.left.right == null ? 0 : this.left.right.depth

      if (lldepth < lrdepth) {
        // LR rotation consists of a RR rotation of the left child
        this.left.rotateRightLeft()
        // plus a LL rotation of this value, which happens anyway
      }
      this.rotateLeftRight()
    } else if (ldepth + 1 < rdepth) {
      // RR or RL rorarion
      var rrdepth = this.right.right == null ? 0 : this.right.right.depth
      var rldepth = this.right.left == null ? 0 : this.right.left.depth

      if (rldepth > rrdepth) {
        // RR rotation consists of a LL rotation of the right child
        this.right.rotateLeftRight()
        // plus a RR rotation of this value, which happens anyway
      }
      this.rotateRightLeft()
    }
  }
  private rotate (from: string, to: string) {
    // the right side is too long => rotate from the right (_not_ rightwards)
    var value = this.value
    var next = this.next
    var target = this[to]
    this.value = this[from].value
    this.next = this[from].next
    this[to] = this[from]
    this[from] = this[from][from]
    this[to][from] = this[to][to]
    this[to][to] = target
    this[to].value = value
    this[to].next = next
    this[to].updateInNewLocation()
    this.updateInNewLocation()
  }
  private rotateLeftRight () {
    // Left side too long, so rotate from the left
    return this.rotate('left', 'right')
  }
  private rotateRightLeft () {
    // Right side too long, so rotate from the right
    return this.rotate('right', 'left')
  }
  private updateInNewLocation () {
    this.getDepthFromChildren()
  }
  private getDepthFromChildren () {
    this.depth = 1
    if (this.left != null) this.depth = this.left.depth + 1
    if (this.right != null && this.depth <= this.right.depth) this.depth = this.right.depth + 1
  }

  add (value: T): boolean {
    // Clone subtrees into own properties
    if (this.value === value) return false

    var ret = false
    if (value < this.value) {
      if (this.left == null) {
        this.left = new AVLTree(value, this, this.previous)
        if (this.previous) this.previous.next = this.left
        this.previous = this.left
        ret = true
      } else {
        ret = this.left.add(value)
        if (ret) this.balance()
      }
    } else {
      if (this.right == null) {
        this.right = new AVLTree(value, this.next)
        if (this.next) this.next.previous = this.right
        this.next = this.right
        ret = true
      } else {
        ret = this.right.add(value)
        if (ret) this.balance()
      }
    }

    if (ret) this.getDepthFromChildren()
    return ret
  }

  contains (value: T): boolean {
    if (value < this.value) {
      if (this.left) return this.left.contains(value)
      return false
    }
    if (value !== this.value) {
      if (this.right) return this.right.contains(value)
      return false
    }
    return true
  }

  find (value: T): AVLTree<T> {
    if (value < this.value) {
      if (this.left) return this.left.find(value)
    }
    if (value !== this.value) {
      if (this.right) return this.right.find(value)
    }
    return this
  }

  valueOf (): T {
    return this.value
  }

  toString (): string {
    return String(this.value)
  }

  [Symbol.iterator](): Iterator<T> {
    var current: AVLTree<T> = this

    return {
      next (): IteratorResult<T> {
        if (current) {
          let value = current.value
          current = current.next
          return {
            done: false,
            value: current.value
          }
        } else {
          return {
            done: true
          }
        }
      }
    }
  }
}
