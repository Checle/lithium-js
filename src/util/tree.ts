// This file is originally from the Concentré XML project (version 0.2.1)
// Licensed under GPL and LGPL.
// Modified by Jeremy Stephens.

import { mergeable, forkable } from 'object-fork'

@forkable export default class Tree <T> {
  constructor (value?: T) {
    this.value = value
    this.depth = 1
  }

  private value: T
  private depth: number
  private left: Tree<T> = null
  private right: Tree<T> = null

  private balance () {
    var ldepth = this.left == null ? 0 : this.left.depth
    var rdepth = this.right == null ? 0 : this.right.depth

    if (ldepth > rdepth + 1) {
      // LR or LL rotation
      var lldepth = this.left.left == null ? 0 : this.left.left.depth
      var lrdepth = this.left.right == null ? 0 : this.left.right.depth

      if (lldepth < lrdepth) {
        // LR rotation consists of a RR rotation of the left child
        this.left.rotateRR()
        // plus a LL rotation of this value, which happens anyway
      }
      this.rotateLL()
    } else if (ldepth + 1 < rdepth) {
      // RR or RL rorarion
      var rrdepth = this.right.right == null ? 0 : this.right.right.depth
      var rldepth = this.right.left == null ? 0 : this.right.left.depth

      if (rldepth > rrdepth) {
        // RR rotation consists of a LL rotation of the right child
        this.right.rotateLL()
        // plus a RR rotation of this value, which happens anyway
      }
      this.rotateRR()
    }
  }
  private rotateLL () {
    // the left side is too long => rotate from the left (_not_ leftwards)
    var value = this.value
    var right = this.right
    this.value = this.left.value
    this.right = this.left
    this.left = this.left.left
    this.right.left = this.right.right
    this.right.right = right
    this.right.value = value
    this.right.updateInNewLocation()
    this.updateInNewLocation()
  }
  private rotateRR () {
    // the right side is too long => rotate from the right (_not_ rightwards)
    var value = this.value
    var left = this.left
    this.value = this.right.value
    this.left = this.right
    this.right = this.right.right
    this.left.right = this.left.left
    this.left.left = left
    this.left.value = value
    this.left.updateInNewLocation()
    this.updateInNewLocation()
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
        this.left = new Tree(value)
        ret = true
      } else {
        ret = this.left.add(value)
        if (ret) this.balance()
      }
    } else {
      if (this.right == null) {
        this.right = new Tree(value)
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

  find (value: T): T {
    if (value < this.value) {
      if (this.left) return this.left.find(value)
      return null
    }
    if (value !== this.value) {
      if (this.right) return this.right.find(value) || this.value
    }
    return this.value
  }

  toString (): string {
    return '[' + this.left + ',' + this.value + ',' + this.right + ']'
  }
}
