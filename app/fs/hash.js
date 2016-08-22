"use strict";
var crypto = require('crypto');
var type = require('../../type.ts');
var stream_ts_1 = require('../../type/stream.ts');
function hash(buffer) {
    var stream = new stream_ts_1.default(buffer);
    var algorithm = 'sha256';
    var hash = type.cs.read(stream);
    var data = stream.read();
    var match = /^(\w+):/.exec(hash);
    if (match) {
        hash = hash.substr(match[0].length);
        algorithm = match[1];
    }
    var verifyHash = crypto.createHash(algorithm).update(data).digest('hex');
    if (hash !== verifyHash)
        throw 'Invalid hash';
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hash;
