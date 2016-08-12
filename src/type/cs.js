module.exports = {
  read: function (reader) {
    var tail = reader.slice();
    for (var length = 0; tail.shift(); length++);
    return reader.shift(length).toString();
  },
  write: function (writer, string) {
    writer.push(string);
    writer.push(0);
  }
};
