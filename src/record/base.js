// TODO: promote written, undo branch if not written

if (!Object.setPrototypeOf && '__proto__' in Object.prototype) {
  Object.setPrototypeOf = function setPrototypeOf(obj, prototype) {
    obj.__proto__ = prototype;
    return obj;
  }
}

var record = new function () {

  var context, // Context record of execution (cf. POSIX current working directory)
    caller;

  function Record(value) {
    this.value = value;
    if (typeof value == 'function') {
      this.target = value;
      this.name = value.name;
    } else {
      this.name = keyOf(value);
    }
    return this.instantiate(value);
  }
  Record.prototype = {
    map: function () { }, // Function prototype makes map suitable as accessor prototype
    value: null, // Immutable record value
    name: null, // Immutable function name
    owner: null, // Creating record
    accessor: null, // Public function interface of the record
    context: null, // Calling record of the current transformation
    next: null, // Next in input stream
    target: null, // Greatest descendant record
    written: false, // Branch state differs from parent

    instantiate: function () {
      var self = this;

      // Instantiate inherited properties
      this.map = Object.create(this.map);
      // Copy inherited pointers
      this.target = this.target;
      // Create accessor
      this.accessor = Record;

      // Rebase accessor
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this.accessor, this.map);
        // Reflect all external changes in map
        // TODO reinclude: this.map = this.accessor;
      }

      // Define accessor interface
      Object.defineProperties(this.accessor, {
        valueOf: { value: function () { return self.value; } },
        toString: { value: function () { return String(self.value || ''); } },
        name: { value: this.name }
      });

      function Record() {
        if (this instanceof Record) { // Instantiated with `new` operator
          if (arguments.length > 0) throw Error('Not implemented');
          return self.branch().accessor;
        }

        var args = Array.prototype.slice.call(arguments);

        var parentContext = context;
        context = self;
        try {
          return self.exec(args);
        }
        finally {
          context = parentContext;
        }
      }
    },

    branch: function () {
      var branch = Object.create(this);
      branch.parent = this;
      branch.instantiate();
      return branch;
    },

    exec: function (args) {
      if (!args.length) return this.next;

      var input = args[0], annex = args.slice(1), target;

      // Promote concretized context to branch
      //if (this.isPrototypeOf(context)) this.map = context.map;

      if (input instanceof Array) {
        input = this.exec(input); // May install a function as target // TODO: change to input function
      }

      var key = keyOf(input);
      if (key != null) {
        // Attempt to route input to a previous transition
        var child = this.get(key);
        if (child) {
          if (!annex.length) return child.accessor;
          return child.exec(annex); // Execute pending input
        }
      }

      // New input issued by the current target itself (skip reiteration) or
      // current record created in current context (skip verification)
      if (caller == this || !this.target) {
        // TODO: test hasOwnProperty
        var child = this.create(input);
        if (!this.target) this.target = child.accessor;
        if (!annex.length) return child.accessor;
        return child.exec(annex); // Execute pending input
      }

      // Input not routed
      var parentCaller = caller;
      caller = this;
      try {
        // Perform transition in target context
        // TODO: consider limiting arguments to target.length and reiterate
        // TODO: consider updating this.target to avoid long target() iteration chains
        var target = this.target.apply((this.context || this).accessor, args);

        if (target === false) throw new RangeError(this.accessor+' returned false');
        if (target == null) target = args;
        if (typeof target != 'function') target = this.exec([target]);

        if (context == this) {
          // TODO: merge with above block
          var child = this.create(input);
          annex.push(target);
          child.exec(annex);
        }
        return this.target = target;
      }
      finally {
        caller = parentCaller;
      }
    },

    accept: function (target) {
      if (this.next && valueOf(target) <= valueOf(this.next)) {
        throw new RangeError(typeof value+' '+value+' not greater than '+typeof this.value+' '+this.value);
      }
      return this.create(target);
    },

    create: function (value) {
      var key = keyOf(value), child = new Record(value);
      child.owner = this;
      child.context = context;
      if (key != null) {
        this.map[key] = child;
        if (!this.next) this.next = child.accessor; // Next only set if value is primitive
      }
      return child;
    },

    get: function (key) {
      var child = this.map[key];
      if (!child) return;

      // Return a child owned by the current branch
      if (child.hasOwnProperty(key)) return child;

      // Child inherited from the parent branch
      if (this.has(key)) {
        // Copy child of the predecessing branch
        // TODO: do not branch here but branch by splitting off underlying layer on write, recognize branch by global variable
        return this.map[key] = child.branch();
      }
    },

    has: function (key) {
      return this.map[key] !== Record.prototype.map[key];
    }
  };

  return new Record('').accessor;

  // Derive property key from value if applicable
  function keyOf(value) {
    var key = value != null ? value.valueOf() : value;
    // Key must derive from primitive
    if ((key instanceof Object) || typeof value == 'function')
      return null;
    return String(key);
  }
  // Derive value relevant for order relation
  function valueOf(value) {
    var key = keyOf(value);
    if (key != null) return key;
    return value;
  }

}

if (typeof module != 'undefined' && module) module.exports = record;
