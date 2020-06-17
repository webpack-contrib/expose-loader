<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# expose-loader

The `expose-loader` loader allow you to expose module to `global` object (`self`, `window` and `global`).

## Getting Started

To begin, you'll need to install `expose-loader`:

```console
$ npm install expose-loader --save-dev
```

Then you can use the `expose-loader` using two approaches.

## Inline

**src/index.js**

```js
import $ from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery';
//
// Adds the `jquery` to the `global` object under the names `$` and `jQuery`
```

```js
import { concat } from 'expose-loader?exposes=_.concat!lodash/concat';
//
// Adds the `lodash/concat` to the `global` object under the name `_.concat`
```

```js
import {
  map,
  reduce,
} from 'expose-loader?exposes[]=_.map%20map&exposes[]=_.reduce%20reduce!underscore';
//
// Adds the `map` and `reduce` method from `underscore` to the `global` object under the name `_.map` and `_.reduce`
```

The space (`%20`) is the separator between import segments.

Description of string values can be found in the documentation below.

## Using Configuration

**src/index.js**

```js
import $ from 'jquery';
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
      {
        test: require.resolve('underscore'),
        loader: 'expose-loader',
        options: {
          exposes: [
            '_.map map',
            {
              globalName: '_.reduce',
              localName: 'reduce',
            },
            {
              globalName: ['_', 'filter'],
              localName: 'filter',
            },
          ],
        },
      },
    ],
  },
};
```

The [`require.resolve`](https://nodejs.org/api/modules.html#modules_require_resolve_request_options) call is a Node.js function (unrelated to `require.resolve` in webpack processing).
`require.resolve` gives you the absolute path to the module (`"/.../app/node_modules/jquery/dist/jquery.js"`).
So the expose only applies to the `jquery` module. And it's only exposed when used in the bundle.

And run `webpack` via your preferred method.

## Options

### exposes

Type: `String|Object|Array`
Default: `undefined`

List of exposes.

#### `String`

Allows to use a string to describe an expose.

The space (`%20`) is the separator between import segments.

String syntax - `[[globalName] [localName]]`, where:

##### globalName

Type: `String|Array`
Default: `undefined`

Name of an exposed value in `global` object (**required**)

Possible syntax:

- `root`
- `root.nested`
- `["root", "nested"]` - may be useful if the dot is part of the name

##### localName

Type: `String`
Default: `undefined`

Name of an exposed value

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/expose-loader.svg
[npm-url]: https://npmjs.com/package/expose-loader
[node]: https://img.shields.io/node/v/expose-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/expose-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/expose-loader
[tests]: https://github.com/webpack-contrib/expose-loader/workflows/expose-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/expose-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/expose-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/expose-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=expose-loader
[size-url]: https://packagephobia.now.sh/result?p=expose-loader
