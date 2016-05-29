var record = new function () {
  function System(callback) {
    return Node();

    function Node(state, parent) {
      return Branch(new Tree, {});

      function Branch(tree, map, head, value) {
        Object.defineProperties(node, {
          valueOf: { value: function () { return value } },
          toString: { value: function () { return value } }
        });
        return node;

        function node(input) {
          if (this instanceof node) {
            var branch = Branch(Object.create(tree), Object.create(map), parent, head, value);
            tree = Object.create(tree);
            map = Object.create(map);
            return branch.apply(null, arguments);
          }
          if (!arguments.length) return node;

          var string = String(input), child = map[string];
          if (child) {
            if (child.hasOwnProperty(string)) return child;
            else if (child != Object.prototype[string]) {
              var child = map[string] = new child;
              if (value == string) head = child;
            }
          }
          var left = tree.find(string), previous = left ? map[left] : null;
          if (left && string.substr(0, left.length) == left) return previous.call(node, string.substr(left.length));

          var child = Node(string, node);
          if (!previous) {
            head = child;
            value = string;
          }
          map[string] = child;
          tree.add(string);
          if (callback) callback(node, string);
          return child;
        }
      }
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
