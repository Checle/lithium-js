var Crypto = require('crypto');
var Type = require('../../type.js');
var Stream = require('../../stream.js');

function hash(buffer) {
  var stream = new Stream(buffer);
  var algorithm = 'sha256';
  var hash = Type.cs.read(stream);
  var data = Type.stream.toBuffer();

  if (algorithm = /^(\w+):/.exec(hash)) {
    hash = hash.substr(algorithm[0].length);
    algorithm = algorithm[1];
  }

  var verifyHash = Crypto.createHash(algorithm).update(data).digest('hex');
  if (hash != verifyHash) throw 'Invalid hash';
}

module.exports = hash;
