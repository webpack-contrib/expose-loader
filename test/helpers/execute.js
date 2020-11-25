import Module from "module";
import path from "path";

const parentModule = module;

export default (code) => {
  const resource = "test.js";
  const module = new Module(resource, parentModule);
  // eslint-disable-next-line no-underscore-dangle
  module.paths = Module._nodeModulePaths(
    path.resolve(__dirname, "../fixtures")
  );
  module.filename = resource;

  // eslint-disable-next-line no-underscore-dangle
  module._compile(
    `
console.log = () => {};

const result = {};

if (typeof myGlobal !== "undefined") {
  delete myGlobal;
}

if (typeof myOtherGlobal !== "undefined") {
  delete myOtherGlobal;
}

if (typeof myGlobal_alias !== "undefined") {
  delete myGlobal_alias;
}

if (typeof global['myGlobal.alias'] !== "undefined") {
  delete global['myGlobal.alias'];
}

if (typeof myGlobal_alias !== "undefined") {
  delete global['global-commonjs2-single-export'];
}

${code};

result['ExposeLoader'] = ExposeLoader;

if (typeof myGlobal !== "undefined") {
  result['myGlobal'] = myGlobal;
}

if (typeof myOtherGlobal !== "undefined") {
  result['myOtherGlobal'] = myOtherGlobal;
}

if (typeof myGlobal_alias !== "undefined") {
  result['myGlobal_alias'] = myGlobal_alias;
}

if (typeof global['myGlobal.alias'] !== "undefined") {
  result['myGlobal.alias'] = global['myGlobal.alias'];
}

if (typeof global['global-commonjs2-single-export'] !== "undefined") {
  result['global-commonjs2-single-export'] = global['global-commonjs2-single-export'];
}

module.exports = result;`,
    resource
  );

  return module.exports;
};
