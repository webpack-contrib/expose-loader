/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var path = require('path');

function accesorString(value) {
	var childProperties = value.split(".");
	var length = childProperties.length;
	var propertyString = "global";
	var result = "";

	for(var i = 0; i < length; i++) {
		if(i > 0)
			result += "if(!" + propertyString + ") " + propertyString + " = {};\n";
		propertyString += "[" + JSON.stringify(childProperties[i]) + "]";
	}

	result += "module.exports = " + propertyString;
	return result;
}

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	// Change the request from an /abolute/path.js to a relative ./path.js
	// This prevents [chunkhash] values from changing when running webpack
	// builds in different directories.
	var newRequestPath = "." + path.sep + path.basename(remainingRequest);
	this.cacheable && this.cacheable();
	if(!this.query) throw new Error("query parameter is missing");
	return accesorString(this.query.substr(1)) + " = " +
		"require(" + JSON.stringify("-!" + newRequestPath) + ");";
};
