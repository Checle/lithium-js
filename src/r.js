var Tree = require('./tree.js');

if (!Object.setPrototypeOf && '__proto__' in Object.prototype) {
  Object.setPrototypeOf = function setPrototypeOf(obj, prototype) {
    obj.__proto__ = prototype;
    return obj;
  }
}

var record = new function () {

  function Record(key, owner) {
    console.log('Record', [].slice.call(arguments));
    var self = this;
    // Instantiate inherited properties
    this.tree = Object.create(this.tree);
    this.map = Object.create(this.map);
    this.key = key != null ? key : '';
    this.owner = owner;

    // Create accessor
    this.accessor = function record() {
      console.log('record', [].slice.call(arguments));
      if (this instanceof arguments.callee) {
      }
      return self.exec.apply(self, arguments);
    };
    this.accessor._ = this;
    // Rebase accessor
    if (Object.setPrototypeOf) Object.setPrototypeOf(this.accessor, this.map);
    Object.defineProperties(this.accessor, {
      valueOf: { value: function () { return self.key; } },
      toString: { value: this.getPath.bind(this) }
    });

    return this.accessor;
  }
  Record.callee = null;
  var map = new String;
  Record.prototype = {
    tree: new Tree,
    map: function () { }, // Inherits from function so it can be inserted into the accessor's prototype chain
    key: '', // Inmutable nodal portion of path
    owner: null,
    accessor: null,
    caller: null, // Calling node of the current transformation
    target: null, // Greatest descendant node
    transformed: false,

    getPath: function () {
      if (!this.owner) return this.key;
      var path = this.owner.getPath();
      return this.owner.target == this.accessor ? path : path+this.key;
    },
    branch: function () {
      console.log('branch', [].slice.call(arguments));
      var branch = Object.create(this);
      Record.call(branch, this.key, this.owner);
      return branch;
    },
    exec: function (input) {
      console.log('exec', [].slice.call(arguments));
      this.caller = Record.callee;
      Record.callee = this;
      try {
        // Carry out execution in a branch and resolve result to function
        // FIXME: only branch when content is written (function write)
        var branch = this.branch();
        this.target = this.resolve.apply(branch, arguments);

        // Promote new branch to parent if the transition has been successful
        if (this.owner && this.key != null) {
          // FIXME: rely on paths, not pointers!
          this.owner.map[this.key] = branch.accessor;
          if (this.owner.target == this.accessor) this.owner.target = branch.accessor;
        }

        return this.accessor;
      }
      finally {
        Record.callee = this.caller;
      }
    },
    resolve: function (input) {
      console.log('resolve', [].slice.call(arguments));
      var target = this.write.apply(this, arguments);

      if (typeof target == 'function') return target;
      if (target instanceof Array) return this.resolve.apply(this, target);
      if (target != null) return this.resolve.call(this, target);

      // The target remains unchanged if nothing is returned
      return this.target;
    },
    get: function (key) {
      key = String(key);
      console.log('get', [].slice.call(arguments));
      var child = this.map[key];
      if (!child) return;

      // Return a child owned by the current branch
      if (child.hasOwnProperty(key)) return child;

      // Child inherited from the parent branch
      if (child !== Record.prototype.map[key]) {
        // Copy child of the predecessing branch
        return this.map[key] = child.branch();
      }
    },
    add: function (key) {
      console.log('add', [].slice.call(arguments));
      key = String(key);
      var child = new Record(key, this);
      this.map[key] = child;
      this.tree.add(key);
      return child;
    },
    accept: function (input) {
      console.log('accept', [].slice.call(arguments));
      if (arguments.length > 1) {
        return this.accept(input)(Array.prototype.slice.call(arguments, 1));
      }
      if (typeof input == 'function') {
        return Function.prototype.bind.call(input, this.accessor);/*function () {

        }.bind(this);*/ 
      }
      else if (input != null) {
        // Adding a key returns into its scope
        return this.add(input);
      }
    },
    write: function (input) {
      console.log('write', [].slice.call(arguments));
      if (arguments.length == 0) throw new Error("Called with 0 arguments"); //return this.value;

      var args = Array.prototype.slice.call(arguments);

      if (input != null && typeof input != 'function') {
        var key = String(input), child = this.get(key);

        // Pass on remaining arguments to child if exists
        if (child) return child.exec.apply(child, args.slice(1));

        // Get closest lesser sibling
        var match = this.tree.find(key);

        // Slice and delegate tail if prefix matches an existing successor
        if (match && key.substr(0, match.length) == match) {
          // Cut off prefix
          args[0] = key.substr(match.length);
          return this.get(key).apply(child, args);
        }

        // Create atomic child visible within scope of branch
        // Branch disappears when error is thrown on transform
        child = this.add(key);
      }

      // Reiteration of target is skipped if the child is created by target
      if (this.caller == this) {
        return this.accept.apply(this, arguments);
      }

      // Input not routed, so perform transition
      if (this.target) var target = this.target.apply(this.accessor, arguments);
      else target = this.accept.apply(this, arguments);
      this.transformed = true;
      return target;
    }
  };

  return new Record;

}

if (typeof module != 'undefined' && module) module.exports = record;
