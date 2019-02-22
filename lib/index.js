/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const path = require('path');

function accesorString(value) {
  const childProperties = value.split('.');
  const { length } = childProperties;
  let propertyString = 'global';
  let result = '';

  for (let i = 0; i < length; i++) {
    if (i > 0) result += `if(!${propertyString}) ${propertyString} = {};\n`;
    propertyString += `[${JSON.stringify(childProperties[i])}]`;
  }

  result += `module.exports = ${propertyString}`;
  return result;
}

module.exports = function loader() {};
module.exports.pitch = function pitch(remainingRequest) {
  // Change the request from an /abolute/path.js to a relative ./path.js
  // This prevents [chunkhash] values from changing when running webpack
  // builds in different directories.
  const newRequestPath = remainingRequest.replace(
    this.resourcePath,
    `.${path.sep}${path.relative(this.context, this.resourcePath)}`
  );

  if (this.cacheable) {
    this.cacheable();
  }

  if (!this.query) throw new Error('query parameter is missing');

  // Handle the object version of the options.
  let accessor = '';
  let exportKey = '';
  if (typeof this.query === 'object') {
    exportKey = this.query.exportKey;
    accessor = '.' + this.query.expose;
  } else {
    accessor = this.query.substr(1);
  }
  /*
     * Workaround until module.libIdent() in webpack/webpack handles this correctly.
     *
     * fixes:
     * - https://github.com/webpack-contrib/expose-loader/issues/55
     * - https://github.com/webpack-contrib/expose-loader/issues/49
     */
  this._module.userRequest = `${this._module.userRequest}-exposed`;
  return (
    `${accesorString(accessor)} = ` +
    `require(${JSON.stringify(`-!${newRequestPath}`)})${exportKey};`
  );
};
