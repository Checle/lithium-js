"use strict";
var vn = require('./vn.ts');
function read(stream) {
    var length = vn.read(stream);
    return stream.shift(length);
}
exports.read = read;
function write(stream, buffer) {
    vn.write(stream, buffer.length);
    stream.push(buffer);
}
exports.write = write;
