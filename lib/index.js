/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const loaderUtils = require('loader-utils');

function accessorString(value) {
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
  if (this.cacheable) {
    this.cacheable();
  }

  if ((typeof this.query !== 'string') || !this.query) throw new Error('query parameter is missing, wrong type or empty string');
  /*
     * Workaround until module.libIdent() in webpack/webpack handles this correctly.
     *
     * fixes:
     * - https://github.com/webpack-contrib/expose-loader/issues/55
     * - https://github.com/webpack-contrib/expose-loader/issues/49
     */
  this._module.userRequest = `${this._module.userRequest}-exposed`;
  return (
    `${accessorString(this.query.substr(1))} = ` +
    `require(${loaderUtils.stringifyRequest(this, remainingRequest)});`
  );
};
