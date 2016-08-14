// TODO: promote written, undo branch if not written

var apply = Function.prototype.apply
var slice = Array.prototype.slice
var global = function () { return this }() // Global scope

var caller, process // Context processing record (cf. POSIX current working directory)

export default function BaseRecord (value) {
  this.key = keyOf(value)
  this.value = value
  return this.instantiate()
}
BaseRecord.prototype = {
  map: {}, // Map of following records
  value: null, // Immutable record value
  name: null, // Immutable function name
  parent: null, // Creating record
  accessor: null, // Public function interface of the record
  process: null, // Calling record of the current transformation
  running: false,
  processing: null,
  inputs: null, // List of all transition inputs that have been applied on the current branch
  next: null, // Next in input stream
  target: null, // Greatest descendant record
  written: false, // Branch state differs from origin

  instantiate: function () {
    var self = this

    /**
     * Public record interface.
     * @param {...*} input - One or more sequential inputs.
     * @return {Record} Selected or created record; next record if called with zero arguments.
     */
    function Record () {
      var branch = self
      var parentProcess, context

      // Instantiated by the `new` operator
      if (this instanceof Record) {
        branch = self.branch()
        if (arguments.length > 0) return branch.accessor.apply(null, arguments)
        return branch.accessor
      }
      // Called in a function context that is not the system-specific global scope
      if (typeof this === 'function' && this !== global && (!process || this !== process.accessor)) {
        context = this
        self.merge(context) // Merge self into context
        if (arguments.length > 0) return context.apply(null, arguments)
        return context
      }

      // Branch the current state if called externally
      // if (!process) branch = self.branch();

      // Protocol sequence of raw inputs
      if (arguments.length > 0) branch.inputs.push(arguments)

      parentProcess = process
      process = branch
      process.running = true
      try {
        var result = branch.exec.apply(branch, arguments)
        // self = branch; // Switch to branch if no error occurred
        return result
      } finally {
        process.running = false
        process = parentProcess
      }
    }

    this.inputs = []
    // Instantiate inherited properties
    this.map = Object.create(this.map)
    // Copy inherited pointers
    this.target = this.target
    // Create accessor
    this.accessor = Record

    // Define accessor interface
    Object.defineProperties(this.accessor, {
      valueOf: { value: function () { return self.value } },
      toString: { value: function () { return String(self.valueOf()) } },
      name: { value: this.key }
    })
  },

  branch: function () {
    var branch = Object.create(this)
    branch.instantiate()
    branch.origin = this
    return branch
  },

  merge: function (target) {
    // TODO: analyze conflict graph
    // Perform full re-execution
    if (this.origin) target = this.origin.merge(target)
    for (var i = 0; i < this.inputs.length; i++) {
      try { target = target.apply(null, this.inputs[i]) } catch (e) { }
    }
    return target
  },

  get: function (key) {
    var child = this.map[key]
    if (!child) return

    // Return a child owned by the current branch
    if (this.map.hasOwnProperty(key)) return child

    // Instantiate an inherited child
    if (child !== BaseRecord.prototype.map[key]) {
      // Copy child of the predecessing branch
      // TODO: do not branch here but branch by splitting off underlying layer on write, recognize branch by global variable
      return (this.map[key] = child.branch())
    }
  },

  select: function (input) {
    var key = keyOf(input)
    var child

    // Route input to existing transition
    if (key != null) if ((child = this.get(key))) return child

    // Stub records accept without verification and direct recursion with identical leads to unverified acceptance
    if (!this.target || key != null && this.input === key) {
      // TODO: test hasOwnProperty
      if (typeof input === 'function') {
        this.target = input
        return this.accessor
      }
      child = this.create(input)
      this.next = child.accessor
      if (!this.target) this.target = child.accessor
      return child.accessor
    }
  },

  exec: function (input) {
    if (!arguments.length) return this.next

    var annex = slice.call(arguments, 1)
    var key = keyOf(input)
    var target, child, parentCaller, parentInput

    // Promote concretized context to branch
    // if (this.isPrototypeOf(context)) this.map = context.map;

    // Expand array input
    if (input instanceof Array) {
      input = arguments[0] = this.exec(input)
    }

    // Route to child record
    if ((child = this.select(input))) {
      if (annex.length) return apply.call(child, null, annex)
      return child
    }

    // New input to be verified
    parentCaller = caller
    caller = this
    parentInput = this.input
    this.input = key
    try {
      // Perform transition
      target = apply.call(this.target, this.accessor, arguments)
      if (target === false) throw new RangeError(this.accessor + ' returned false')

      if (target == null) target = this.exec.apply(this, arguments)
      else if (typeof target !== 'function') target = this.exec(target)

      if (key) this.map[key] = target
      this.target = target
      return target
    } finally {
      caller = parentCaller
      this.input = parentInput
    }
  },

  create: function (value) {
    var key = keyOf(value)
    var child = new BaseRecord(value)
    child.parent = this
    child.process = this.process || this
    if (key != null) this.map[key] = child.accessor
    return child
  }
}

function keyOf (value) {
  var key = value == null ? value : value.valueOf()
  // Key must derive from primitive
  if (key instanceof Object || typeof value === 'function') return null
  return String(key)
}

export default new BaseRecord('').accessor
