var Crypto = require('crypto');
var Type = require('../type.js');
var Stream = require('../stream.js');

function hash(buffer) {
  var stream = new Stream(buffer);
  var algorithm = 'sha256';
  var hash = Type.cs.read(stream);
  var data = Type.stream.toBuffer();

  if (algorithm = /^(\w+):/.exec(hash)) {
    algorithm = algorithm[1];
    hash = hash.substr(algorithm[0].length);
  }

  var verifyHash = Crypto.createHash(algorithm).update(data).digest('hex');
  if (hash != verifyHash) throw 'Invalid hash';
}

module.exports = hash;
