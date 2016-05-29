var record = new function () {
  function System() {
    Node.prototype = {
      tree: new Tree,
      map: {},
      object: {},
      record: null
    };

    return new Node;

    function Node() {
      var node = this;
      this.tree = new Tree;
      this.map = {};
      this.object = {};

      Object.defineProperties(record, {
        valueOf: { value: function () { return node.value } },
        toString: { value: function () { return node.value } }
      }); 
      if (record.__proto__) record.__proto__ = this.object;
      else Object.setPrototypeOf(record, this.object);
      return this.record = record;

      function record(input) {
        if (this instanceof record) {
          var sibling = Object.create(node);
          sibling.tree = node.tree;
          sibling.map = node.map;
          sibling.object = node.object;
          branch(node);
          branch(sibling);
          if (arguments.length) return sibling.apply(null, arguments);
          return sibling;
        }

        var string = String(input), child = node.map[string];
        if (child) {
          if (child.hasOwnProperty(string)) return child;
          else if (child != Object.prototype[string]) {
            var child = node.map[string] = new child;
            if (node.value == string) node.head = child;
          }
        }
        var left = node.tree.find(string), previous = left ? node.map[left] : null;
        if (left && string.substr(0, left.length) == left) return previous.call(record, string.substr(left.length));

        var child = new Node(string, node);
        if (!previous) {
          node.head = child;
          node.value = string;
        }
        node.map[string] = child;
        node.tree.add(string);
        Object.defineProperty(node.object, string, { value: node.record });
        return child;
      }
    }
    function branch(node) {
      node.tree = Object.create(node.tree);
      node.map = Object.create(node.map);
      if (record.__proto__) record.__proto__ = Object.create(record.__proto__);
      else Object.setPrototypeOf(node.object, node.object = Object.create(Object.getPrototypeOf(record)));
    }
  }

  function a(a,b) { alert(a); }
  var Record = new System(a), record = new Record;
  Record("ssjsj");
  return Record;

  function Machine(options, callback) {
    var system = {}, scope = {}, state = init;
    return machine;

    function machine(input) {
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
    function init(input) {
      if (typeof input != 'function') state = new Function(input);
      else state = input;
    }
  }

  function machine(input) {
    var node = new Node;
    return exec;

    function exec(input) {
      var output = node.apply(node, arguments);
      if (output instanceof Array) return exec.apply(this, result);
      if (typeof output == 'string') return output;

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
