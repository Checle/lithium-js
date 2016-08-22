// This file is originally from the Concentré XML project (version 0.2.1)
// Licensed under GPL and LGPL.
// Modified by Jeremy Stephens.
"use strict";
var Tree = (function () {
    function Tree(value) {
        this.left = null;
        this.right = null;
        this.value = value;
        this.depth = 1;
    }
    Tree.prototype.balance = function () {
        var ldepth = this.left == null ? 0 : this.left.depth;
        var rdepth = this.right == null ? 0 : this.right.depth;
        if (ldepth > rdepth + 1) {
            // LR or LL rotation
            var lldepth = this.left.left == null ? 0 : this.left.left.depth;
            var lrdepth = this.left.right == null ? 0 : this.left.right.depth;
            if (lldepth < lrdepth) {
                // LR rotation consists of a RR rotation of the left child
                this.left.rotateRR();
            }
            this.rotateLL();
        }
        else if (ldepth + 1 < rdepth) {
            // RR or RL rorarion
            var rrdepth = this.right.right == null ? 0 : this.right.right.depth;
            var rldepth = this.right.left == null ? 0 : this.right.left.depth;
            if (rldepth > rrdepth) {
                // RR rotation consists of a LL rotation of the right child
                this.right.rotateLL();
            }
            this.rotateRR();
        }
    };
    Tree.prototype.rotateLL = function () {
        // the left side is too long => rotate from the left (_not_ leftwards)
        var value = this.value;
        var right = this.right;
        this.value = this.left.value;
        this.right = this.left;
        this.left = this.left.left;
        this.right.left = this.right.right;
        this.right.right = right;
        this.right.value = value;
        this.right.updateInNewLocation();
        this.updateInNewLocation();
    };
    Tree.prototype.rotateRR = function () {
        // the right side is too long => rotate from the right (_not_ rightwards)
        var value = this.value;
        var left = this.left;
        this.value = this.right.value;
        this.left = this.right;
        this.right = this.right.right;
        this.left.right = this.left.left;
        this.left.left = left;
        this.left.value = value;
        this.left.updateInNewLocation();
        this.updateInNewLocation();
    };
    Tree.prototype.updateInNewLocation = function () {
        this.getDepthFromChildren();
    };
    Tree.prototype.getDepthFromChildren = function () {
        this.depth = 1;
        if (this.left != null)
            this.depth = this.left.depth + 1;
        if (this.right != null && this.depth <= this.right.depth)
            this.depth = this.right.depth + 1;
    };
    Tree.prototype.add = function (value) {
        // Clone subtrees into own properties
        if (this.left && !this.hasOwnProperty('left'))
            this.left = Object.create(this.left);
        if (this.right && !this.hasOwnProperty('right'))
            this.right = Object.create(this.right);
        if (this.value === value)
            return false;
        var ret = false;
        if (value < this.value) {
            if (this.left == null) {
                this.left = new Tree(value);
                ret = true;
            }
            else {
                ret = this.left.add(value);
                if (ret)
                    this.balance();
            }
        }
        else {
            if (this.right == null) {
                this.right = new Tree(value);
                ret = true;
            }
            else {
                ret = this.right.add(value);
                if (ret)
                    this.balance();
            }
        }
        if (ret)
            this.getDepthFromChildren();
        return ret;
    };
    Tree.prototype.contains = function (value) {
        if (value < this.value) {
            if (this.left)
                return this.left.contains(value);
            return false;
        }
        if (value !== this.value) {
            if (this.right)
                return this.right.contains(value);
            return false;
        }
        return true;
    };
    Tree.prototype.find = function (value) {
        if (value < this.value) {
            if (this.left)
                return this.left.find(value);
            return null;
        }
        if (value !== this.value) {
            if (this.right)
                return this.right.find(value) || this.value;
        }
        return this.value;
    };
    Tree.prototype.toString = function () {
        return '[' + this.left + ',' + this.value + ',' + this.right + ']';
    };
    return Tree;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tree;
