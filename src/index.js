/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

import path from 'path';

import { getOptions, stringifyRequest } from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from './options.json';

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

  /*
   * Workaround until module.libIdent() in webpack/webpack handles this correctly.
   *
   * fixes:
   * - https://github.com/webpack-contrib/expose-loader/issues/55
   * - https://github.com/webpack-contrib/expose-loader/issues/49
   */
  this._module.userRequest = `${this._module.userRequest}-exposed`;

  const exposes = Array.isArray(options.expose)
    ? options.expose
    : [options.expose];

  let code = `var ___EXPOSE_LOADER_IMPORT___ = require(${JSON.stringify(
    `-!${newRequestPath}`
  )});
var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = require(${stringifyRequest(
    this,
    require.resolve('./runtime/getGlobalThis.js')
  )});
var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___();
`;

  for (const expose of exposes) {
    const childProperties = expose.split('.');
    const { length } = childProperties;

    let propertyString = '___EXPOSE_LOADER_GLOBAL_THIS___';

    for (let i = 0; i < length; i++) {
      if (i > 0) {
        code += `if (!${propertyString}) ${propertyString} = {};\n`;
      }

      propertyString += `[${JSON.stringify(childProperties[i])}]`;
    }

    code += `${propertyString} = ___EXPOSE_LOADER_IMPORT___;\n`;
  }

  code += `module.exports = ___EXPOSE_LOADER_IMPORT___;`;

  return code;
}

export { loader, pitch };
