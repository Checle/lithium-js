"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream = require('stream');
var Readable = (function (_super) {
    __extends(Readable, _super);
    function Readable(source) {
        _super.call(this);
        this.head = [];
        this.chunkLengths = [];
        this.pos = 0;
        this.len = 0;
        if (source != null) {
            if (source && Readable.isReadable(source)) {
                source.pipe(this);
            }
            else {
                this.push(source);
            }
        }
    }
    // Standard IO stream enhanced by string and seeking capabilities.
    Readable.isReadable = function (stream) {
        return stream && stream.readable === true;
    };
    Readable.prototype.valueOf = function () {
        var buffer = _super.prototype.read.call(this); // Read causes readable to copy chunks into single buffer
        if (buffer != null)
            this.unshift(buffer); // Add back single buffer as a single chunk
        return buffer;
    };
    Readable.prototype.toString = function () {
        return String(this.valueOf());
    };
    Readable.prototype.push = function (chunk, encoding) {
        if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string')
            chunk = String(chunk);
        var length = chunk.length;
        var result = _super.prototype.push.call(this, chunk, encoding);
        if (!result)
            return false;
        this.len += length;
        this.chunkLengths.push(length);
        return true;
    };
    Readable.prototype.unshift = function (chunk) {
        if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string')
            chunk = String(chunk);
        var length = chunk.length;
        var result = _super.prototype.unshift.call(this, chunk);
        if (result)
            return false;
        this.len += result;
        this.chunkLengths.unshift(length);
        return true;
    };
    Readable.prototype.read = function (size) {
        var result = _super.prototype.read.call(this, size);
        if (result == null)
            return null;
        var length = result.length;
        this.head.push(result);
        this.pos += length;
        this.len -= length;
        while (length > 0 && this.chunkLengths.length) {
            length -= this.chunkLengths.shift();
        }
        // Add remaining chunk length
        if (length < 0) {
            this.chunkLengths.unshift(-length);
        }
        return result;
    };
    Readable.prototype.seek = function (offset) {
        var chunk, length;
        if (offset < 0) {
            while (offset < 0 && this.head.length) {
                chunk = this.head.pop();
                length = chunk.length;
                offset += length;
                this.unshift(chunk);
                this.chunkLengths.push(length);
            }
            // Add remainder back to head
            if (offset > 0) {
                this.read(offset);
            }
        }
        else if (offset > 0) {
            while (offset > 0 && this.chunkLengths.length) {
                length = this.chunkLengths[0];
                if (offset < length)
                    length = offset;
                chunk = this.read(length);
                offset -= chunk.length;
            }
        }
        return this.pos;
    };
    Object.defineProperty(Readable.prototype, "length", {
        get: function () {
            return this.len;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Readable.prototype, "position", {
        get: function () {
            return this.pos;
        },
        enumerable: true,
        configurable: true
    });
    Readable.prototype._read = function () { };
    return Readable;
}(stream.Readable));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Readable;
