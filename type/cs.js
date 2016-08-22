"use strict";
function read(reader) {
    var tail = reader.slice();
    for (var length = 0; tail.shift(); length++)
        ;
    return reader.shift(length).toString();
}
exports.read = read;
function write(writer, string) {
    writer.push(string);
    writer.push(0);
}
exports.write = write;
