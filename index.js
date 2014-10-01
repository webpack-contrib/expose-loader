/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

function accesorString(value) {
	var depths = value.split(".");
	var length = depths.length;
	var result = "";
	
	for (var i = 0; i < length; i++) {
		result += "[" + JSON.stringify(depths[i]) + "]";
	}

	return result;
}

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	this.cacheable && this.cacheable();
	if(!this.query) throw new Error("query parameter is missing");
	return "module.exports = " +
		"global" + accesorString(this.query.substr(1)) + " = " +
		"require(" + JSON.stringify("-!" + remainingRequest) + ");";
};