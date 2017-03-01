/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const loaderUtils = require("loader-utils");
const SourceNode = require("source-map").SourceNode;
const SourceMapConsumer = require("source-map").SourceMapConsumer;
const FOOTER = "\n/*** EXPOSES FROM expose-loader ***/\n";
module.exports = function(content, sourceMap) {
	this.cacheable && this.cacheable();
	const query = loaderUtils.getOptions(this) || {};
	const exposes = [];
	const keys = Object.keys(query);
	keys.forEach(function(name) {
		exposes.push(`globals[${JSON.stringify(name)}] = module.exports;`);
	});
	const exposeClosure = `
	${FOOTER}
	(function(){
		const globals = require('webpack/buildin/global');
		${exposes.join("\n")}
	})();`
	if(sourceMap) {
		const currentRequest = loaderUtils.getCurrentRequest(this);
		const node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
		node.add(exposeClosure);
		const result = node.toStringWithSourceMap({
			file: currentRequest
		});
		this.callback(null, result.code, result.map.toJSON());
		return;
	}
	return content + exposeClosure;
}
