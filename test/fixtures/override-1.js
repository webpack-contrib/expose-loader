const global = require('../../src/runtime/getGlobalThis');

global().myGlobal = 42;

const myExports = require('./global-commonjs2-single-export');

module.exports = myExports;
