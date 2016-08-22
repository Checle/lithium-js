"use strict";
function read(stream) {
    return stream.shiftUInt32LE();
}
exports.read = read;
function write(stream, number) {
    stream.pushUInt32LE(number);
}
exports.write = write;
