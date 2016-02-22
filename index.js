/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var utils = require("loader-utils");

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
	this.cacheable && this.cacheable();
	if(!this.query) throw new Error("query parameter is missing");
	var query = utils.interpolateName(this, this.query, {});
	return accesorString(query.substr(1)) + " = " +
		"require(" + JSON.stringify("-!" + remainingRequest) + ");";
};
