// TODO: promote written, undo branch if not written

var Tree = require('./tree.js');

if (!Object.setPrototypeOf && '__proto__' in Object.prototype) {
  Object.setPrototypeOf = function setPrototypeOf(obj, prototype) {
    obj.__proto__ = prototype;
    return obj;
  }
}

var record = new function () {

  var context, // Context record of execution (cf. POSIX current working directory)
    called,
    caller;

  function Record() {
    var self = this;

    // Instantiate inherited properties
    this.map = Object.create(this.map);

    // Copy inherited pointers
    this.target = this.target;

    // Create accessor
    this.accessor = Record;
    this.accessor._ = this; // REMOVE

    // Rebase accessor
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this.accessor, this.map);
      // Reflect all external changes in map
      // TODO reinclude: this.map = this.accessor;
    }

    // Define accessor interface
    Object.defineProperties(this.accessor, {
      valueOf: { value: function () { return self.value; } },
      //toString: { value: this.getPath.bind(this) }
    });

    function Record() {
      if (this instanceof Record) { // Instantiated with `new` operator
        if (arguments.length > 0) throw Error('Not implemented');
        return self.branch().accessor;
      }

      var args = Array.prototype.slice.call(arguments);
      var branch = self;
      if (caller != self) {
        // Carry out any write executions in a branch
        branch = self.branch();
      }

      var environment = context;
      context = branch;
      try {
        return branch.exec(args);
      }
      finally {
        // Switch to new branch on success
        self = branch;
        Record._ = self; // REMOVE
        context = environment;
      }
    }
  }

  Record.prototype = {
    map: function () { }, // Function prototype makes map suitable as accessor prototype
    value: null, // Inmutable nodal portion of path
    owner: null,
    accessor: null,
    context: null, // Calling record of the current transformation
    target: null, // Greatest descendant record
    written: false,

    branch: function () {
      var branch = Object.create(this);
      branch.parent = this;
      Record.call(branch, this.value, this.owner);
      return branch;
    },
    exec: function (args) {
      var input = args[0], annex = args.slice(1), target;

      // Promote concretized context to branch
      //if (this.isPrototypeOf(context)) this.map = context.map;

      if (input instanceof Array) {
        input = this.exec(input); // May install a function as target // TODO: change to input function
      }
      if (typeof input != 'function') {
        var value = keyOf(input), child = this.get(value);
        if (child) {
          if (!annex.length) return child.accessor;
          // Execute pending input
          return child.exec(annex);
        }
      }
      else {
        // Functions are bound to the calling context and subsequent input arguments
        input = Function.prototype.bind.apply(input, [context].concat(annex));
        annex = [];
      }

      // New input issued by the current target itself, skip reiteration
      // Current record created in current context, skip verification
      if (caller == this || context == this.context) {
        // TODO: test hasOwnProperty
        var record = this.create(input);
        if (annex.length) record.exec(annex);
        return record.accessor;
      }

      // Input not routed
      called = caller;
      caller = this;
      try {
        // Verify new targets against default constraints
        var target = this.target;

        if (!target) {
          // Check input against default constraints
          var child = this.accept(input);
          // Execute pending input within existing context
          if (annex.length > 0) target = child.exec(annex);
        }
        else {
          // Perform transition in target context
          // TODO: consider limiting arguments to target.length and reiterate
          target = target.apply(null, args);
        }

        if (target === false) throw new RangeError(this.accessor+' returned false');
        if (target == null) target = args;

        if (typeof target != 'function') return this.exec([target]);
        return target;
      }
      finally {
        caller = called;
      }
    },
    accept: function (target) {
      var value = target != null ? target.valueOf() : target;
      if (!(value instanceof Object)) value = keyOf(value);
      if (value <= this.value) throw new RangeError(typeof value+' '+value+' not greater than '+typeof this.value+' '+this.value);
      return this.create(target);
    },
    create: function (value) {
      if (typeof value == 'function') {
        this.target = value;
        return this;
      }
      var key = keyOf(value), current = this.map[key], child = new Record;
      child.value = value;
      child.owner = this;
      child.context = context;
      if (this.map[key] == this.target) this.target = child.accessor;
      this.map[key] = child;
      return child;
    },
    get: function (value) {
      var value = keyOf(value), child = this.map[value];
      if (!child) return;

      // Return a child owned by the current branch
      if (child.hasOwnProperty(value)) return child;

      // Child inherited from the parent branch
      if (child !== Record.prototype.map[value]) {
        // Copy child of the predecessing branch
        return this.map[value] = child.branch();
      }
    }
  };

  return new Record().accessor;

  function keyOf(input) {
    // Undefined input (no arguments) returns value ''
    return input != null ? String(input) : '';
  }

}

if (typeof module != 'undefined' && module) module.exports = record;
