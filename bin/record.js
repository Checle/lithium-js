#! /usr/bin/env node

var Record = require('../src/r.js');

var record = new Record();

process.stdin.resume();

process.stdin.on('data', function (chunk) {
  var data = String(chunk);
  record(data);
  console.log(data);
});
