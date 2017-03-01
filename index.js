/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var FOOTER = "/*** EXPOSES FROM expose-loader ***/\n";
module.exports = function(content, sourceMap) {
	if(this.cacheable) this.cacheable();
	var query = loaderUtils.getOptions(this) || {};
	var exposes = [];
	var keys = Object.keys(query);
	keys.forEach(function(name) {
		exposes.push("globals[" + JSON.stringify(name) + "] = module.exports;");
	});
	if(sourceMap) {
		var currentRequest = loaderUtils.getCurrentRequest(this);
		var node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
		node.add("\n\n" + FOOTER + exposes.join("\n"));
		var result = node.toStringWithSourceMap({
			file: currentRequest
		});
		this.callback(null, result.code, result.map.toJSON());
		return;
	}
	return content + "\n\n" + FOOTER + exposes.join("\n");
}
