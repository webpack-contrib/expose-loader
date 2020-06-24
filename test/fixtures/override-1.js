const global = require('../../src/runtime/getGlobalThis');

global().myGlobal = 'not overridden';

global().myOtherGlobal = { foo: 'not overridden' };

const myExports = require('./global-commonjs2-single-export');

module.exports = 'no exports';
