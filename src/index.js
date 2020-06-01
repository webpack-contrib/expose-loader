/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

import path from 'path';

import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from './options.json';

function accessorString(value) {
  const childProperties = value.split('.');
  const { length } = childProperties;

  let propertyString = 'global';
  let result = '';

  for (let i = 0; i < length; i++) {
    if (i > 0) {
      result += `if (!${propertyString}) ${propertyString} = {};\n`;
    }

    propertyString += `[${JSON.stringify(childProperties[i])}]`;
  }

  result += `module.exports = ${propertyString}`;

  return result;
}

function loader() {}

function pitch(remainingRequest) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Expose Loader',
    baseDataPath: 'options',
  });

  // Change the request from an /abolute/path.js to a relative ./path.js
  // This prevents [chunkhash] values from changing when running webpack
  // builds in different directories.
  const newRequestPath = remainingRequest.replace(
    this.resourcePath,
    `./${path.relative(this.context, this.resourcePath)}`
  );

  const { expose } = options;

  /*
   * Workaround until module.libIdent() in webpack/webpack handles this correctly.
   *
   * fixes:
   * - https://github.com/webpack-contrib/expose-loader/issues/55
   * - https://github.com/webpack-contrib/expose-loader/issues/49
   */
  this._module.userRequest = `${this._module.userRequest}-exposed`;

  return `${accessorString(expose)} = require(${JSON.stringify(
    `-!${newRequestPath}`
  )});`;
}

export { loader, pitch };
