// This file is originally from the Concentré XML project (version 0.2.1)
// Licensed under GPL and LGPL.
// Modified by Jeremy Stephens.

import {Slice} from '../../interfaces'
import {toSlice} from '../../utils'
import {fork} from '../fork'
import Entry from '../entry'

@fork export default class AVLTree <T> extends Entry<Slice, T> {
  constructor (key: any = '', value?: T, next?: AVLTree<T>, previous?: AVLTree<T>) {
    super(toSlice(key), value, next, previous)
  }

  next: AVLTree<T>
  previous: AVLTree<T>

  private depth: number = 1
  private left: AVLTree<T> = null
  private right: AVLTree<T> = null

  private balance () {
    var ld = this.left == null ? 0 : this.left.depth
    var rd = this.right == null ? 0 : this.right.depth

    if (ld > rd + 1) {
      // LR or LL rotation
      var lld = this.left.left == null ? 0 : this.left.left.depth
      var lrd = this.left.right == null ? 0 : this.left.right.depth

      if (lld < lrd) {
        // LR rotation consists of a RR rotation of the left child
        this.left.rotateRightLeft()
        // plus a LL rotation of this value, which happens anyway
      }
      this.rotateLeftRight()
    } else if (ld + 1 < rd) {
      // RR or RL rorarion
      var rrd = this.right.right == null ? 0 : this.right.right.depth
      var rld = this.right.left == null ? 0 : this.right.left.depth

      if (rld > rrd) {
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
        this.left = new AVLTree<T>(value, value, this, this.previous)
        if (this.previous) this.previous.next = this.left
        this.previous = this.left
        ret = true
      } else {
        ret = this.left.add(value)
        if (ret) this.balance()
      }
    } else {
      if (this.right == null) {
        this.right = new AVLTree<T>(value, value, this.next)
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

  compare (target: any): number {
    if (this.value != null && typeof this.value['compare'] === 'function') {
      return this.value['compare'](target)
    }
    if (target) {
      if (target < this.value) return -1
      if (target !== this.value) return 1
    } else {
      if (target > this.value) return 1
      if (target !== this.value) return -1
    }
    return 0
  }

  has (key: any): boolean {
    var compares = this.compare(key)
    if (compares < 0) {
      if (this.left) return this.left.has(key)
      return false
    }
    if (compares > 0) {
      if (this.right) return this.right.has(key)
      return false
    }
    return true
  }

  find (key: any): AVLTree<T> {
    if (key < this.key) {
      if (this.left) return this.left.find(key)
    }
    if (key !== this.key) {
      if (this.right) return this.right.find(key)
    }
    return this
  }
}
