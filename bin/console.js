#! /usr/bin/env node

var repl = require('repl');

Record = require('../src/r.js');
record = new Record;

repl.start('> ');
