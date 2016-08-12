// TODO: promote written, undo branch if not written

if (!Object.setPrototypeOf && '__proto__' in Object.prototype) {
  Object.setPrototypeOf = function setPrototypeOf(obj, prototype) {
    obj.__proto__ = prototype;
    return obj;
  };
}

var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var caller, process; // Context processing record (cf. POSIX current working directory)

function BaseRecord(value) {
  this.key = keyOf(value);
  this.value = value;
  return this.instantiate();
}
BaseRecord.prototype = {
  map: function () { }, // Function prototype makes map suitable as accessor prototype
  value: null, // Immutable record value
  name: null, // Immutable function name
  parent: null, // Creating record
  accessor: null, // Public function interface of the record
  process: null, // Calling record of the current transformation
  running: false,
  processing: null,
  next: null, // Next in input stream
  target: null, // Greatest descendant record
  written: false, // Branch state differs from origin

  instantiate: function () {
    var self = this;

    /**
     * Public record interface.
     * @param {...*} input - One or more sequential inputs.
     * @return {Record} Selected or created record; next record if called with zero arguments.
     */
    function Record() {
      var parentProcess, branch;

      if (this instanceof Record) { // Instantiated with `new` operator
        branch = self.branch();
        if (arguments.length > 0) return branch.accessor.apply(null, arguments);
        return branch.accessor;
      }

      parentProcess = process;
      process = self;
      process.running = true;
      try {
        return self.exec.apply(self, arguments);
      }
      finally {
        process.running = false;
        process = parentProcess;
      }
    }

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
      toString: { value: function () { return String(self.valueOf()); } },
      name: { value: this.key }
    });
  },
  branch: function () {
    var branch = Object.create(this);
    branch.origin = this;
    branch.instantiate();
    return branch;
  },
  select: function (input) {
    var key = keyOf(input);
    var child;

    // Route input to existing transition
    if (key != null && this.map[key] !== BaseRecord.prototype.map[key]) {
      return this.map[key];
    }

    // Stub records accept without verification and direct recursion with identical leads to unverified acceptance
    if (!this.target || key != null && this.input == key) {
      // TODO: test hasOwnProperty
      if (typeof input == 'function') {
        this.target = input;
        return this.accessor;
      }
      child = this.create(input);
      this.next = child.accessor;
      if (!this.target) this.target = child.accessor;
      return child.accessor;
    }

    return null;
  },
  exec: function (input) {
    if (!arguments.length) return this.next;

    var annex = slice.call(arguments, 1);
    var key = keyOf(input);
    var target, child, parentCaller, parentInput;

    // Promote concretized context to branch
    // if (this.isPrototypeOf(context)) this.map = context.map;

    // Expand array input
    if (input instanceof Array) {
      input = arguments[0] = this.exec(input);
    }

    // Route to child record
    if (child = this.select(input)) {
      if (annex.length) return apply.call(child, null, annex);
      return child;
    }

    // New input to be verified
    parentCaller = caller;
    caller = this;
    parentInput = this.input;
    this.input = key;
    try {
      // Perform transition
      target = apply.call(this.target, this.accessor, arguments);
      if (target === false) throw new RangeError(
        this.accessor+' returned false');

      if (target == null) target = this.exec.apply(this, arguments);
      else if (typeof target != 'function') target = this.exec(target);

      if (key) this.map[key] = target;
      this.target = target;
      return target;
    }
    finally {
      caller = parentCaller;
      this.input = parentInput;
    }
  },
  create: function (value) {
    var key = keyOf(value);
    var child = new BaseRecord(value);
    child.parent = this;
    child.process = this.process || this;
    if (key != null) this.map[key] = child.accessor;
    return child;
  }
};

function keyOf(value) {
  var key = value == null ? value : value.valueOf();
  // Key must derive from primitive
  if (key instanceof Object || typeof value == 'function') return null;
  return String(key);
}

module.exports = new BaseRecord('').accessor;
