/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	this.cacheable && this.cacheable();
	if(!this.query) throw new Error("query parameter is missing");
	return "module.exports = " +
		"global[" + JSON.stringify(this.query.substr(1)) + "] = " +
		"require(" + JSON.stringify("-!" + remainingRequest) + ");";
};