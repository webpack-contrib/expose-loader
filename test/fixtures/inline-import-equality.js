import exposed from '../../src/cjs.js?exposes=myGlobal!./global-commonjs2-single-export.js';

import imported from './global-commonjs2-single-export.js'

export default {
  exposedEqualsGlobal: exposed === myGlobal,
  importedEqualsGlobal: imported === myGlobal,
  exposedEqualsImported: exposed === imported,
}
