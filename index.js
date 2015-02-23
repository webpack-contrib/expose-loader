/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var loaderUtils = require("loader-utils");

module.exports = function () {
};

module.exports.pitch = function (content) {
  var query,
      accesorValue;

  this.cacheable();

  if (!this.query) {
    throw new Error("query parameter is missing");
  }

  query = loaderUtils.parseQuery(this.query);

  if (query.module) {
    accesorValue = loaderUtils.interpolateName(this, query.module, {
      context: query.context || this.options.context,
      content: content,
      regExp: query.regExp
    });

    if (query.upperCamelCase) {
      accesorValue = accesorValue.split('/').map(toUpperCamelCase).join('.')
    }

    if (query.ns) {
      accesorValue = [query.ns, accesorValue].join(['.']);
    }
  } else {
    accesorValue = this.query.substr(1)
  }

  return accesorString(accesorValue) + " = require(" + JSON.stringify("-!" + content) + ");";
};

function accesorString(value) {
  var childProperties = value.split("."),
      length = childProperties.length,
      propertyString = "global",
      result = "";

  for (var i = 0; i < length; i++) {
    if (i > 0) {
      result += "if(!" + propertyString + ") " + propertyString + " = {};";
    }
    propertyString += "[" + JSON.stringify(childProperties[i]) + "]";
  }

  result += "module.exports = " + propertyString;

  return result;
}

function toUpperCamelCase(str) {
  return str.split('-').map(function (a) {
    return a.substr(0, 1).toUpperCase() + a.substr(1)
  }).join('');
}
