var types = {
  DoubleBE: 8,
  DoubleLE: 8,
  FloatBE: 4,
  FloatLE: 4,
  Int8: 1,
  Int16BE: 16,
  Int16LE: 16,
  Int32BE: 32,
  Int32LE: 32,
  IntBE: 4,
  IntLE: 4,
  UInt8: 1,
  UInt16BE: 16,
  UInt16LE: 16,
  UInt32BE: 32,
  UInt32LE: 32,
  UIntBE: 4,
  UIntLE: 4
};
var key;

function Writer() {
  this.buffers = [];
  this.length = 0;
}
Writer.prototype = {
  toString: function () {
    return this.buffers.join('');
  },
  push: function (element) {
    for (var i = 0; i < arguments.length; i++) {
      element = arguments[i];
      if (!Buffer.isBuffer(element)) throw new Error('Not implemented');
      this.buffers.push(arguments);
    }
  }
};
for (key in types) if (types.hasOwnProperty(key)) {
  Reader.prototype['push' + key] = Reader.prototype['write' + key] = new function () {
    var method = 'write' + key;
    var size = types[key];
    return function write(number) {
      var buffer = new Buffer(size);
      buffer[method](number, 0);
      this.length += size;
      this.buffers.push(buffer);
    };
  };
}

function Reader(buffer) {
  this.buffer = buffer;
}
Reader.prototype = {
  toBuffer: function (start, end) {
    return this.buffer.slice(start, end);
  },
  slice: function (start, end) {
    return new Reader(this.buffer.slice(start, end));
  },
  splice: function (index, deleteCount) {
    if (index != 0 || arguments.length > 2) throw new Error('Not implemented');
    return this.shift(deleteCount);
  },
  shift: function (count) {
    if (count == null) return this.readInt8();
    var buffer = this.buffer.slice(0, count);
    this.buffer = this.buffer.slice(count);
    return buffer;
  },
  charAt: function (index) {
    return String.fromCharCode(this.buffer[index]);
  },
  charCodeAt: function (index) {
    return this.buffer[index];
  }
};
for (key in types) if (types.hasOwnProperty(key)) {
  Reader.prototype['shift' + key] = Reader.prototype['read' + key] = new function () {
    var method = 'read' + key;
    var size = types[key];
    return function read() {
      if (size > this.buffer.length) return null;
      var number = this.buffer[method](0);
      this.buffer = this.buffer.slice(size);
      return number;
    };
  };
  Reader.prototype['peek' + key] = new function () {
    var method = 'read' + key;
    var size = types[key];
    return function peek() {
      if (size > this.buffer.length) return null;
      return this.buffer[method](0);
    };
  };
}

Reader.prototype.shift = Reader.prototype.readInt8;

module.exports = Reader;
