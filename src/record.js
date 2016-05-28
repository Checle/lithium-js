var record = new function () {
  var DEBUG = true;

  function Node(state) {
    var tree = new Tree, map = {}, head = null, value = null;

    Object.defineProperties(node, {
      valueOf: { value: function () { return value } },
      toString: { value: function () { return value } }
    });
    if (DEBUG) {
      node.tree = tree;
      node.map = map;
    }
    return node;

    function node(input) {
      var string = String(input);
      if (map.hasOwnProperty(string)) return map[string].node;
      // Find greatest lesser node
      var left = tree.find(string), previous = left ? map[left] : null;
      // Delegate call to child node
      if (left && string.substr(0, left.length) == left) return previous.call(node, string.substr(left.length));

      var child = new Node(string), item = { node: child, next: head };
      if (previous) {
        item.next = previous.next;
        previous.next = item;
      } else {
        head = item;
        value = string;
      }
      map[string] = item;
      tree.add(string);
      // Children are immortal within a scope
      Object.defineProperty(node, { value: child });
      return child;
    }
  }

  function Machine(options, callback) {
    var system = {}, scope = {}, state = init;
    
    this.record = record;

    function record(input) {
      if (system.hasOwnProperty(input)) return system[input];
      var output = state.apply(scope, arguments);
      if (!output) return;
      // TODO: remove recursion
      if (typeof output == 'function') state = output;
      else output = record(output);
      if (typeof input == 'string' && typeof output == 'string' && arguments.length == 1) {
        system[input] = output;
        if (callback) callback(input, output);
      }
      return output;
    }
    function compile(input) {
      if (typeof input == 'string' && arguments.length == 1) broadcast(input);
      if (typeof input == 'function') state = input;
      if (object == null) return null;
      if (typeof object != 'function') object = new Function(object);
      if (object instanceof Array) object = object.apply(this, object);
      if (arguments.length > 1) return exec.call(this, object.apply(this, [].slice.call(arguments, 1)));
      return object;
    }
    function init(input) {
      if (typeof input != 'function') state = new Function(input);
      else state = input;
    }
  }

  function stateMachine() {
    // if key > left: insert
    // else: select(key) return to state
    //   getOwnPropertyDescriptor, for in, if prop instanceof Object: Object.create(prop)
  }

  function machine(input) {
    this.root = new Node;
    return exec;

    function exec(input) {
      var output = this.root.apply(this.root, arguments);
      // TODO: work out
      if (output instanceof Array) exec.apply(this, result);
      if (typeof output == 'string') exec.call(this, output);
    }
  }
  function set(key, value) {
    localStorage[key] = value;
    broadcast(key, value);
  }
  function broadcast(key, value) {
  }

  var machine = new Machine(machine, set);

  function record() {
    return machine.record.apply(machine, arguments);
  }
  return record;

  var files = [], dict = { };
  
  this.open = function (path, flags, mode, callback) {
    var fd = files.length, object = dict.hasOwnProperty(path) && dict[path],
      data = object ? object.data : '', offset = 0, pending = 0,
      output = [], r, w, a, s;
    if (!/^(?:[wa]x?|rs?)\+?$/.test(flags)) return call(callback, { message: 'Bad flags' });
    if (/w|r\+/.test(flags)) w = true;
    if (/r|\+/.test(flags)) r = true;
    if (/s/.test(flags)) s = true;
    if (/a/.test(flags)) a = true;
    if (/x/.test(flags) && object) return call(callback, { type: 'EEXISTS' });
    if (/r/.test(flags) && !object) return call(callback, { type: 'ENOENT' });

    files[fd] = {
      read: read,
      write: write,
      close: close
    };
    call(callback, null, fd);

    function sync() {
      if (!output.length) return;
      if (a) data += output.join('');
      else data = data.substr(0, offset)+output.join('')+data.substr(offset+pending);
      offset += pending;
      pending = 0;
      output = [];
    }
    function read(count, callback) {
      if (!r) return call(callback, { type: 'EBADF' });
      sync();
      var buffer = data.substr(offset, count);
      offset += count;
      if (offset > data.length) offset = data.length;
      call(callback, null, buffer);
    }
    function write(data, callback) {
      if (!w && !a) return call(callback, { type: 'EBADF' });
      output.push(data);
      pending += data.length;
      call(callback, null, data.length, data);
    }
    function close() {
      sync();
      call(callback, null);
      if (data > object.data) object.data = data;
      /*
        dict[path] = {
          data: data,
          next: object,
          child: null,
          parent: object.parent
        };
      }
      if (data < object.data) {
        for (var next = object; data < next.)
      }
    */
    }

    function call(callback) {
      if (typeof callback != 'function') return;
      var args = [].slice.call(arguments, 1);
      setTimeout(function () { callback.apply(null, args); }, 0);
    }
  };

  function bind(method) {
    return function (fd) {
      if (!files.hasOwnProperty(fd)) return callback({ message: 'Bad file descriptor' });
      files[fd][method].apply(this, [].slice.call(arguments, 1));
    }
  }
  this.write = bind('write');
  this.read = bind('read');
  this.close = bind('close');
  this.exec = function (command, options, callback) {
    this.open(command, function (err, fd) {
      if (err) return callback(err);

    });
  };


  var hosts = ['record.network', location.hostname];

}

if (typeof module != 'undefined' && module) module.exports = record;
