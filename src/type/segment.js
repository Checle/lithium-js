var vn = require('./vn.js');

module.exports = {
  read: function (stream) {
    var length = vn.read(stream);
    return stream.shift(length);
  },
  write: function (stream, buffer) {
    vn.write(stream, buffer.length);
    stream.push(buffer);
  }
};
