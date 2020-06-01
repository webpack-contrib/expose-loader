import globalObject1 from './global-commonjs.js';
import { globalObject2, globalObject3 } from './global-commonjs2-multiple-exports.js';
import globalObject4 from './global-commonjs2-single-export.js';
import globalObject5 from './global-module-default-export.js';
import { globalObject6, globalObject7 } from './global-module-named-exports.js';

export default {
  'commonjs': globalObject1,
  'commonjs2-multiple-exports': { globalObject2, globalObject3 },
  'commonjs2-single-export': globalObject4,
  'module-default-export': globalObject5,
  'module-named-exports': {
    globalObject5,
    globalObject6,
  },
};
