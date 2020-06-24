const myGlobalThis = require('../../src/runtime/getGlobalThis');

myGlobalThis.myGlobal = 'not overridden';

myGlobalThis.myOtherGlobal = { foo: 'not overridden' };

const myExports = require('./global-commonjs2-single-export');

module.exports = 'no exports';
