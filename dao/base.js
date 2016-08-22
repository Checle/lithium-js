"use strict";
var stream_1 = require('stream');
var BaseDAO = (function () {
    function BaseDAO() {
    }
    BaseDAO.prototype.get = function (id) {
        return null;
    };
    BaseDAO.prototype.update = function (id, string) { };
    BaseDAO.prototype.remove = function (id) { };
    BaseDAO.prototype.open = function (id) {
        var string = this.get(id);
        var stream = new stream_1.Readable();
        if (string == null)
            return null;
        stream.push(string);
        stream.push(null);
        return stream;
    };
    return BaseDAO;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseDAO;
