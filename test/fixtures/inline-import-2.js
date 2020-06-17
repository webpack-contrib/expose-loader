import myExports from '../../src/cjs.js?exposes=myGlobal!./simple-commonjs2-single-export.js';
import myExports2 from '../../src/cjs.js?exposes[]=myOtherGlobal.globalObject2%20globalObject2&exposes[]=myOtherGlobal.globalObject3%20globalObject3!./simple-commonjs2-multiple-export.js';

export { myExports, myExports2 };
