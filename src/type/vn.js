module.exports = {
  read: function (stream) {
    return stream.shiftUInt32LE();
  },
  write: function (stream, number) {
    stream.pushUInt32LE(number);
  }
};
