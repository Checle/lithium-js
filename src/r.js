var Record = require('./record/base.js');

if (typeof window != 'undefined') {
  window.Record = Record;
  window.record = new Record;
}
module.exports = Record;
