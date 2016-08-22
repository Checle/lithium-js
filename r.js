"use strict";
var base_1 = require('./record/base');
if (typeof window !== 'undefined') {
    window.Record = base_1.default;
    window.record = new base_1.default();
}
module.exports = base_1.default;
