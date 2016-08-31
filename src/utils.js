"use strict";
function getCommonPrefix() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
    }
    values = values.concat().sort();
    var min = values[0], max = values[values.length - 1];
    var length = min.length;
    var i = 0;
    while (i < length && min[i] === max[i])
        i++;
    return min.slice(0, i);
}
exports.getCommonPrefix = getCommonPrefix;
