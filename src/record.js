var record = new function () {

  function NotImplementedError() { }
  NotImplementedError.prototype = new Error('Not implemented');

  var files = [], dict = { "lala": { data: "Ph", next: null, child: null } };
  
  this.open = function (path, flags, mode, callback) {
    var fd = fds.length, object = dict.hasOwnProperty(path) && dict[path], file = {
      path: path,
      object: object,
      flags: flags,
      mode: mode,
      data: [object.data],
      fragment: 0,
      offset: 0,
      r: false,
      w: false,
      a: false,
      s: false
    };
    if (!/^(?:[wa]x?|rs?)\+?$/.test(flags)) return callback({ message: 'Invalid flags' });
    if (/w|r\+/.test(flags)) file.w = true;
    if (/r|\+/.test(flags)) file.r = true;
    if (/s/.test(flags)) file.s = true;
    if (/a/.test(flags)) file.a = true;
    if (/x/.test(flags) && object) return callback({ type: 'EEXISTS' });
    if (/r/.test(flags) && !object) return callback({ type: 'ENOENT' });

    files[fd] = file;
    callback(null, fd);
  };
  this.write = function (fd, data, callback) {
    if (!fds.hasOwnProperty(fd)) return callback({ message: 'Bad file descriptor' });
    var file = files[fd];
    if (!file.w && !file.a) return callback({ type: 'EBADF' });

    if (file.a) {
      file.data.push(data);
    } else {
      var fragment = file.data[file.fragment];
      if (file.offset+data.length > fragment.length) {
        file.data[file.fragment] = fragment.substr(0, file.offset);
        
      }
    }
    else file.data = file.substr
    file.data += data;
  };
  this.close = function (fd, callback) {
    if (!fds.hasOwnProperty(fd)) callback(new Error('Bad file descriptor'));
    var file = files[fd];
    parent[file.data] = {};
    delete files[fd];
    callback(null);
  };
  this.exec = function (command, options, callback) {
    this.open(command, function (err, fd)) {
      if (err) return callback(err);

    });
  };

}

if (typeof module != 'undefined' && module) module.exports = record;
