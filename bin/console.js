#! /usr/bin/env node

var repl = require('repl');

R = Record = require('../src/r.js');
r = record = new Record;

process.stdout.write('(Shortcuts R and r correspond to Record and record, respectively)\n');

repl.start('> ');
