var record = new function () {
  var DEBUG = true;

  function Node(state, parent) {
    var tree = new AVLTree, map = {}, value = null, stack = [];

    Object.defineProperties(node, {
      valueOf: { value: function () { return value } },
      toString: { value: function () { return value } }
    });
    if (DEBUG) {
      node.tree = tree;
      node.map = map;
    }
    return node;

    function node(string) {
      // Input required to be primitive so the machine is deterministically reproducible
      string = arguments[0] = String(string);

      if (map.hasOwnProperty(string)) return map[string];
      var root = tree.find(string);
      if (root && string.substr(0, root.length) == root) return map[root](string.substr(root.length));

      var newState = state.apply(node, arguments);
      var child = this[string] = new Node(string);
      if (value == null || string < value) value = string;
      map[string] = child;
      tree.add(string);
      return child;
    }
  }

  function Machine(options) {
    var machine = new Node('', exec);

    Object.defineProperties(machine, {
      start: function (path) {
        throw null;
      },
      stop: function (path) {
        throw null;
      },
      branch: function () {
        throw null;
      }
    });
    if (DEBUG) {
      machine.exec = exec;
    }
    return machine;

    function exec(object) {
      if (object == null) return null;
      if (typeof object != 'function') object = new Function(object);
      if (object instanceof Array) object = object.apply(this, object);
      if (arguments.length > 1) return exec.call(this, object.apply(this, [].slice.call(arguments, 1)));
      return object;
    }
  }

  var record = new Machine();
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

}

if (typeof module != 'undefined' && module) module.exports = record;
