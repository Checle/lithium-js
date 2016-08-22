"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_ts_1 = require('./base.ts');
var LocalStorageDAO = (function (_super) {
    __extends(LocalStorageDAO, _super);
    function LocalStorageDAO() {
        _super.apply(this, arguments);
    }
    LocalStorageDAO.prototype.get = function (key) {
        return String(localStorage.getItem(key));
    };
    LocalStorageDAO.prototype.update = function (key, string) {
        localStorage.setItem(key, String(string));
    };
    LocalStorageDAO.prototype.remove = function (key) {
        localStorage.removeItem(key);
    };
    return LocalStorageDAO;
}(base_ts_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalStorageDAO;
