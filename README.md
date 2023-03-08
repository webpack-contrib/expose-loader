<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# expose-loader

The `expose-loader` loader allows to expose a module (in whole or in part) to global object (`self`, `window` and `global`).

For further hints on compatibility issues, check out [Shimming](https://webpack.js.org/guides/shimming/) of the official docs.

## Getting Started

To begin, you'll need to install `expose-loader`:

```console
npm install expose-loader --save-dev
```

or

```console
yarn add -D expose-loader
```

or

```console
pnpm add -D expose-loader
```

(If you're using WebPack 4, install `expose-loader@1` and follow the [corresponding instructions](https://v4.webpack.js.org/loaders/expose-loader/) instead.)

Then you can use the `expose-loader` using two approaches.

## Inline

The `|` or `%20` (space) allow to separate the `globalName`, `moduleLocalName` and `override` of expose.
The documentation and syntax examples can be read [here](#syntax).

> **Warning**
>
> `%20` is space in a query string, because you can't use spaces in URLs

```js
import $ from "expose-loader?exposes=$,jQuery!jquery";
//
// Adds the `jquery` to the global object under the names `$` and `jQuery`
```

```js
import { concat } from "expose-loader?exposes=_.concat!lodash/concat";
//
// Adds the `lodash/concat` to the global object under the name `_.concat`
```

```js
import {
  map,
  reduce,
} from "expose-loader?exposes=_.map|map,_.reduce|reduce!underscore";
//
// Adds the `map` and `reduce` method from `underscore` to the global object under the name `_.map` and `_.reduce`
```

## Using Configuration

**src/index.js**

```js
import $ from "jquery";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"],
        },
      },
      {
        test: require.resolve("underscore"),
        loader: "expose-loader",
        options: {
          exposes: [
            "_.map|map",
            {
              globalName: "_.reduce",
              moduleLocalName: "reduce",
            },
            {
              globalName: ["_", "filter"],
              moduleLocalName: "filter",
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

|                Name                 |                   Type                    |   Default   | Description                    |
| :---------------------------------: | :---------------------------------------: | :---------: | :----------------------------- |
|      **[`exposes`](#exposes)**      | `{String\|Object\|Array<String\|Object>}` | `undefined` | List of exposes                |
| **[`globalObject`](#globalObject)** |                 `String`                  | `undefined` | Object used for global context |

### `exposes`

Type:

```ts
type exposes =
  | string
  | {
      globalName: string | Array<string>;
      moduleLocalName?: string;
      override?: boolean;
    }
  | Array<
      | string
      | {
          globalName: string | Array<string>;
          moduleLocalName?: string;
          override?: boolean;
        }
    >;
```

Default: `undefined`

List of exposes.

#### `string`

Allows to use a string to describe an expose.

##### `syntax`

The `|` or `%20` (space) allow to separate the `globalName`, `moduleLocalName` and `override` of expose.

String syntax - `[[globalName] [moduleLocalName] [override]]` or `[[globalName]|[moduleLocalName]|[override]]`, where:

- `globalName` - the name in the global object, for example `window.$` for a browser environment (**required**)
- `moduleLocalName` - the name of method/variable/etc of the module (the module must export it) (**may be omitted**)
- `override` - allows to override existing value in the global object (**may be omitted**)

If `moduleLocalName` is not specified, it exposes the entire module to the global object, otherwise it exposes only the value of `moduleLocalName`.

**src/index.js**

```js
import _ from "underscore";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          // For `underscore` library, it can be `_.map map` or `_.map|map`
          exposes: "jquery",
        },
      },
    ],
  },
};
```

#### `object`

Allows to use an object to describe an expose.

##### `globalName`

Type:

```ts
type globalName = string | Array<string>;
```

Default: `undefined`

The name in the global object. (**required**).

**src/index.js**

```js
import _ from "underscore";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("underscore"),
        loader: "expose-loader",
        options: {
          exposes: {
            // Can be `['_', 'filter']`
            globalName: "_.filter",
            moduleLocalName: "filter",
          },
        },
      },
    ],
  },
};
```

##### `moduleLocalName`

Type:

```ts
type moduleLocalName = string;
```

Default: `undefined`

The name of method/variable/etc of the module (the module must export it).
If `moduleLocalName` is specified, it exposes only the value of `moduleLocalName`.

**src/index.js**

```js
import _ from "underscore";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("underscore"),
        loader: "expose-loader",
        options: {
          exposes: {
            globalName: "_.filter",
            moduleLocalName: "filter",
          },
        },
      },
    ],
  },
};
```

##### `override`

Type:

```ts
type override = boolean;
```

Default: `false`

By default loader does not override the existing value in the global object, because it is unsafe.
In `development` mode, we throw an error if the value already present in the global object.
But you can configure loader to override the existing value in the global object using this option.

To force override the value that is already present in the global object you can set the `override` option to the `true` value.

**src/index.js**

```js
import $ from "jquery";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: {
            globalName: "$",
            override: true,
          },
        },
      },
    ],
  },
};
```

#### `array`

**src/index.js**

```js
import _ from "underscore";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("underscore"),
        loader: "expose-loader",
        options: {
          exposes: [
            "_.map map",
            {
              globalName: "_.filter",
              moduleLocalName: "filter",
            },
            {
              globalName: ["_", "find"],
              moduleLocalName: "myNameForFind",
            },
          ],
        },
      },
    ],
  },
};
```

It will expose **only** `map`, `filter` and `find` (under `myNameForFind` name) methods to the global object.

In a browser these methods will be available under `windows._.map(..args)`, `windows._.filter(...args)` and `windows._.myNameForFind(...args)` methods.

### `globalObject`

```ts
type globalObject = string;
```

Default: `undefined`

Object used for global context

```js
import _ from "underscore";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: require.resolve("underscore"),
        loader: "expose-loader",
        options: {
          exposes: [
            {
              globalName: "_",
            },
          ],
          globalObject: "this",
        },
      },
    ],
  },
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/expose-loader.svg
[npm-url]: https://npmjs.com/package/expose-loader
[node]: https://img.shields.io/node/v/expose-loader.svg
[node-url]: https://nodejs.org
[tests]: https://github.com/webpack-contrib/expose-loader/workflows/expose-loader/badge.svg
[tests-url]: https://github.com/webpack-contrib/expose-loader/actions
[cover]: https://codecov.io/gh/webpack-contrib/expose-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/expose-loader
[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=expose-loader
[size-url]: https://packagephobia.now.sh/result?p=expose-loader
