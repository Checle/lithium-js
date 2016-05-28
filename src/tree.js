// This file is originally from the Concentré XML project (version 0.2.1)
// Licensed under GPL and LGPL.
// Modified by Jeremy Stephens.

function AVLTree(value, attr) {
  this.init(value, attr);
}

AVLTree.prototype = {
  left: null,
  right: null
};

AVLTree.prototype.init = function(value, next) {
  this.node = { value: value || null, next: next || null };
  this.depth = 1;
};

AVLTree.prototype.balance = function() {
  var ldepth = this.left  == null ? 0 : this.left.depth;
  var rdepth = this.right == null ? 0 : this.right.depth;

  if (ldepth > rdepth + 1) {
    // LR or LL rotation
    var lldepth = this.left.left  == null ? 0 : this.left.left.depth;
    var lrdepth = this.left.right == null ? 0 : this.left.right.depth;

    if (lldepth < lrdepth) {
      // LR rotation consists of a RR rotation of the left child
      this.left.rotateRR();
      // plus a LL rotation of this value, which happens anyway
    }
    this.rotateLL();
  } else if (ldepth + 1 < rdepth) {
  // RR or RL rorarion
  var rrdepth = this.right.right == null ? 0 : this.right.right.depth;
  var rldepth = this.right.left  == null ? 0 : this.right.left.depth;

  if (rldepth > rrdepth) {
      // RR rotation consists of a LL rotation of the right child
      this.right.rotateLL();
      // plus a RR rotation of this value, which happens anyway
    }
    this.rotateRR();
  }
};

AVLTree.prototype.rotateLL = function() {
  // the left side is too long => rotate from the left (_not_ leftwards)
  var node = this.node;
  var right = this.right;
  this.node = this.left.node;
  this.right = this.left;
  this.left = this.left.left;
  this.right.left = this.right.right;
  this.right.right = right;
  this.right.node = node;
  this.right.updateInNewLocation();
  this.updateInNewLocation();
};

AVLTree.prototype.rotateRR = function() {
  // the right side is too long => rotate from the right (_not_ rightwards)
  var node = this.node;
  var left = this.left;
  this.node = this.right.node;
  this.left = this.right;
  this.right = this.right.right;
  this.left.right = this.left.left;
  this.left.left = left;
  this.left.node = node;
  this.left.updateInNewLocation();
  this.updateInNewLocation();
};

AVLTree.prototype.updateInNewLocation = function() {
  this.getDepthFromChildren();
};

AVLTree.prototype.getDepthFromChildren = function() {
  this.depth = this.node == null ? 0 : 1;
  if (this.left != null) {
    this.depth = this.left.depth + 1;
  }
  if (this.right != null && this.depth <= this.right.depth) {
    this.depth = this.right.depth + 1;
  }
};

AVLTree.prototype.add = function(value)  {
  if (this.node.value == value) return false;

  var ret = false;
  if (value < this.node.value) {
    if (this.left == null) {
      this.left = new AVLTree(value, this.node);
      ret = true;
    } else {
      ret = this.left.add(value);
      if (ret) this.balance();
    }
  } else {
    if (this.right == null) {
      this.right = new AVLTree(value, this.next);
      this.node.next = this.right.node;
      ret = true;
    } else {
      ret = this.right.add(value);
      if (ret) this.balance();
    }
  }

  if (ret) this.getDepthFromChildren();
  return ret;
};

AVLTree.prototype.find = function(value) {
  if (value < this.node.value) {
    if (this.left) return this.left.find(value);
    return null;
  }
  if (value > this.node.value) {
    if (this.right) return this.right.find(value) || this.node.value;
  }
  return this.node.value;
};

if (typeof module != 'undefined' && module) module.exports = AVLTree;
