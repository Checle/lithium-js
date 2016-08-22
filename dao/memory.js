"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_ts_1 = require('./base.ts');
var MemoryDAO = (function (_super) {
    __extends(MemoryDAO, _super);
    function MemoryDAO() {
        _super.call(this);
        this.map = {};
    }
    MemoryDAO.prototype.get = function (key) {
        if (!this.map.hasOwnProperty(key))
            return null;
        return this.map[key];
    };
    MemoryDAO.prototype.update = function (key, string) {
        this.map[key] = String(string);
    };
    MemoryDAO.prototype.remove = function (key) {
        delete this.map[key];
    };
    return MemoryDAO;
}(base_ts_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MemoryDAO;
