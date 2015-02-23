# expose loader for webpack

## Usage

``` javascript
require("expose?libraryName!./file.js");
// Exposes the exports for file.js to the global context on property "libraryName".
// In web browsers, window.libraryName is then available.
```

This line works to expose React to the web browser to enable the Chrome React devtools:

```js
require("expose?React!react");
```

Thus, `window.React` is then available to the Chrome React devtools extension.

Alternately, you can set this in your config file:

```js
module: {
  loaders: [
    { test: require.resolve("react"), loader: "expose?React" }
  ]
}
```

The `require.resolve` is a node.js call (unrelated to `require.resolve` in webpack
processing -- check the node.js docs instead). `require.resolve` gives you the
absolute path to the module ("/.../app/node_modules/react/react.js"). So the
expose only applies to the react module. And it's only exposed when used in the
bundle.

You can also configure a module name based on its path, filename and extension.
See [`loaderUtils#interpolateName`](https://github.com/webpack/loader-utils#interpolatename) function for the full list of available tokens.
The module name can be specified using `module` query param, like this:

```js
module: {
  loaders: [
    { test: /app\/.*\.js$/, loader: "'expose?module=[path][name]'" }
  ]
}
```

In case `module` query param is provided, two additional ones may be added:
 - `ns` - defines a global namespace all exposed modules are added to.
 - `upperCamelCase` - enable this flag when full file path should be converted to upper camel case.

The following example demonstrates the usage of those two params.

```js
module: {
  loaders: [
    {
      test: /app\/.*\.js$/,
      loader: 'expose?ns=App&module=[path][name]&upperCamelCase'
    }
  ]
}
```

Provided that your app has the following directories structure,
```js
|-app
  |-models
    |-user
    |-user-stream-item
```
you can get access to the modules listed above just by typing `App.Models.User` and `App.Models.UserStreamItem` in the console.


[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
