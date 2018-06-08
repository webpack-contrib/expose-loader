/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const path = require('path');

const exposeLoaderPathRegex = new RegExp(
  `^(.*)${path.sep}expose-loader${path.sep}index.js`
);

function buildAccessorAndInitializersFor(value) {
  const childProperties = value.split('.');
  const { length } = childProperties;
  let propertyString = 'global';
  const initializers = [];

  for (let i = 0; i < length; i++) {
    if (i > 0)
      initializers.push(`if(!${propertyString}) ${propertyString} = {};`);
    propertyString += `[${JSON.stringify(childProperties[i])}]`;
  }

  return [propertyString, initializers];
}

module.exports = function loader() {};
module.exports.pitch = function pitch(remainingRequest) {
  // Change the request from an /abolute/path.js to a relative ./path.js
  // This prevents [chunkhash] values from changing when running webpack
  // builds in different directories.
  let newRequestPath = remainingRequest.replace(
    this.resourcePath,
    `.${path.sep}${path.relative(this.context, this.resourcePath)}`
  );
  const exposeLoaderMatch = remainingRequest.match(exposeLoaderPathRegex);
  if (exposeLoaderMatch) {
    const exposeLoaderPath = exposeLoaderMatch[0];
    newRequestPath = newRequestPath.replace(
      exposeLoaderPath,
      `.${path.sep}${path.relative(this.context, exposeLoaderPath)}`
    );
  }

  if (this.cacheable) {
    this.cacheable();
  }

  if (!this.query) throw new Error('query parameter is missing');

  let exposed;
  if (typeof this.query === 'string') {
    exposed = [this.query.substr(1)];
  } else if (this.query.expose) {
    exposed = this.query.expose;
  }

  /*
   * Workaround until module.libIdent() in webpack/webpack handles this correctly.
   *
   * fixes:
   * - https://github.com/webpack-contrib/expose-loader/issues/55
   * - https://github.com/webpack-contrib/expose-loader/issues/49
   */
  this._module.userRequest = `${this._module.userRequest}-exposed`;

  let initializers = [];
  const accessors = [];
  exposed.forEach((value) => {
    const [accessor, valueInitializers] = buildAccessorAndInitializersFor(
      value
    );
    accessors.push(accessor);
    initializers = initializers.concat(valueInitializers);
  });
  return (
    `${initializers.join('\n')}\nmodule.exports = ${accessors.join(' = ')} =` +
    `require(${JSON.stringify(`-!${newRequestPath}`)});`
  );
};
