/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

import path from 'path';
import url from 'url';

import {
  getOptions,
  stringifyRequest,
  getRemainingRequest,
  interpolateName,
} from 'loader-utils';

import validateOptions from 'schema-utils';

import schema from './options.json';

import { modifyUserRequest, getExposes } from './utils';

export default function loader() {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Expose Loader',
    baseDataPath: 'options',
  });

  // Change the request from an /abolute/path.js to a relative ./path.js
  // This prevents [chunkhash] values from changing when running webpack
  // builds in different directories.
  const newRequestPath = getRemainingRequest(this)
    .split('!')
    .map((currentUrl) => {
      const result = `./${path.relative(
        this.context,
        url.parse(currentUrl).pathname
      )}`;

      return process.platform === 'win32'
        ? result.split(path.sep).join('/')
        : result;
    })
    .join('!');

  /*
   * Workaround until module.libIdent() in webpack/webpack handles this correctly.
   *
   * fixes:
   * - https://github.com/webpack-contrib/expose-loader/issues/55
   * - https://github.com/webpack-contrib/expose-loader/issues/49
   */
  this._module.userRequest = modifyUserRequest(this._module.userRequest);

  const callback = this.async();

  let exposes;

  try {
    exposes = getExposes(options.exposes);
  } catch (error) {
    callback(error);

    return;
  }

  const isModule = options.type !== 'commonjs';

  let code = '';

  if (isModule) {
    code = `import * as ___EXPOSE_LOADER_IMPORT___ from ${stringifyRequest(
      this,
      `-!${newRequestPath}`
    )};\n`;
  } else {
    code = `var ___EXPOSE_LOADER_IMPORT___ = require(${stringifyRequest(
      this,
      `-!${newRequestPath}`
    )});\n`;
  }

  code += `var ___EXPOSE_LOADER_GET_GLOBAL_THIS___ = require(${stringifyRequest(
    this,
    require.resolve('./runtime/getGlobalThis.js')
  )});\n`;
  code += `var ___EXPOSE_LOADER_GLOBAL_THIS___ = ___EXPOSE_LOADER_GET_GLOBAL_THIS___();\n`;

  for (const expose of exposes) {
    const { globalName, moduleLocalName } = expose;
    const globalNameInterpolated = globalName.map((item) => {
      return interpolateName(this, item, {});
    });

    if (typeof moduleLocalName !== 'undefined') {
      code += `var ___EXPOSE_LOADER_IMPORT_MODULE_LOCAL_NAME___ = ___EXPOSE_LOADER_IMPORT___.${moduleLocalName}\n`;
    }

    let propertyString = '___EXPOSE_LOADER_GLOBAL_THIS___';

    for (let i = 0; i < globalName.length; i++) {
      if (i > 0) {
        code += `if (!${propertyString}) ${propertyString} = {};\n`;
      }

      propertyString += `[${JSON.stringify(globalNameInterpolated[i])}]`;
    }

    code +=
      typeof moduleLocalName !== 'undefined'
        ? `${propertyString} = ___EXPOSE_LOADER_IMPORT_MODULE_LOCAL_NAME___;\n`
        : `${propertyString} = ___EXPOSE_LOADER_IMPORT___;\n`;
  }

  if (isModule) {
    code += `export { default } from ${stringifyRequest(
      this,
      `-!${newRequestPath}`
    )};\n`;
    code += `export * from ${stringifyRequest(this, `-!${newRequestPath}`)};\n`;
  } else {
    code += `module.exports = ___EXPOSE_LOADER_IMPORT___;`;
  }

  callback(null, code);
}
