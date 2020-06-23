import path from 'path';

import webpack from 'webpack';

import {
  compile,
  execute,
  getCompiler,
  getErrors,
  getModulesList,
  getModuleSource,
  getWarnings,
  readAsset,
} from './helpers';

describe('loader', () => {
  it('should work', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with "moduleLocalName"', async () => {
    const compiler = getCompiler('simple-commonjs2-multiple-export.js', {
      exposes: 'moduleMethod myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-multiple-exports-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with multiple exposes', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      exposes: ['myGlobal', 'myOtherGlobal'],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work multiple commonjs exports', async () => {
    const compiler = getCompiler('simple-commonjs2-multiple-export.js', {
      exposes: ['myOtherGlobal', 'myGlobal.globalObject2 globalObject2'],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-multiple-exports-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work for a nested property for a global object', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      exposes: 'myGlobal.nested',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work for nested properties for a global object', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      exposes: ['myGlobal.nested', 'myOtherGlobal.nested foo'],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work from esModule export', async () => {
    const compiler = getCompiler('simple-module-single-export.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-default-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work string config', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: [
        'myGlobal_alias.globalObject6 globalObject6',
        'myGlobal_alias.globalObject7 globalObject7',
        'myGlobal_alias.default default',
        'myGlobal',
        'myOtherGlobal',
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work string config 2', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: [
        'myGlobal_alias.globalObject6|globalObject6',
        'myGlobal_alias.globalObject7|globalObject7',
        'myGlobal_alias.default default',
        '    myGlobal   ',
        'myOtherGlobal',
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work object config', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: {
        globalName: ['myGlobal.alias', 'globalObject6'],
        moduleLocalName: 'globalObject6',
      },
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(stats.compilation.errors).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work multiple syntax to array', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: [
        {
          globalName: ['myGlobal_alias', 'globalObject6'],
          moduleLocalName: 'globalObject6',
        },
        {
          globalName: ['myGlobal_alias', 'globalObject7'],
          moduleLocalName: 'globalObject7',
        },
        'myGlobal_alias.default default',
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should be different modules id', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: ['myGlobal_alias.default'],
    });
    const stats = await compile(compiler);
    const modules = getModulesList('./global-module-named-exports.js', stats);

    expect(modules[0] !== modules[1]).toBe(true);
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work inline 1', async () => {
    const compiler = getCompiler(
      'inline-import.js',
      {},
      {
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /.*custom\.js/i,
              use: [
                {
                  loader: 'babel-loader',
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource('./custom-exposed.js?foo=bar', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(readAsset('main.bundle.js.map', compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work inline 1 without extension', async () => {
    const compiler = getCompiler(
      'inline-import-1.js',
      {},
      {
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /.*custom/i,
              use: [
                {
                  loader: 'babel-loader',
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    expect(getModuleSource('./custom-exposed?foo=bar', stats)).toMatchSnapshot(
      'module'
    );
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(readAsset('main.bundle.js.map', compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work inline 2', async () => {
    const compiler = getCompiler(
      'inline-import-2.js',
      {},
      {
        module: {},
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource('./simple-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(readAsset('main.bundle.js.map', compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match hashes on all operating systems', async () => {
    const compiler = getCompiler(
      'inline-import-2.js',
      {},
      {
        output: {
          path: path.resolve(__dirname, './outputs'),
          filename: '[name]-[contenthash:8].bundle.js',
          chunkFilename: '[name]-[contenthash:8].chunk.js',
          library: 'ExposeLoader',
          libraryTarget: 'var',
        },
        module: {},
      }
    );
    const stats = await compile(compiler);
    const module = stats.compilation.modules.find((m) =>
      m.id.endsWith('./simple-commonjs2-single-export-exposed.js')
    );
    const isWebpack5 = webpack.version[0] === '5';

    expect(
      getModuleSource('./simple-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(module.hash).toBe(
      isWebpack5
        ? 'c440ca2d9d70459fecf24e8109d10515'
        : 'a580dd85c96d18d417b3be8979faeee5'
    );
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should emit error because of many arguments', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: ['myGlobal_alias globalObject6 excessArgument'],
    });
    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should emit error because of invalid arguments', async () => {
    const compiler = getCompiler('simple-module-named-export.js', {
      exposes: ['myGlobal_alias  |  globalObject6'],
    });
    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work interpolate', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      exposes: ['[name]', 'myGlobal.[name]'],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-commonjs2-single-export-exposed.js', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with CommonJS format when module in CommonJS format', async () => {
    const compiler = getCompiler('loader-commonjs-with-commonjs.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-commonjs.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with CommonJS module format when module in ES module format', async () => {
    const compiler = getCompiler('loader-commonjs-with-es.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-es.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with ES module format when module in CommonJS format', async () => {
    const compiler = getCompiler('loader-es-with-commonjs.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-commonjs.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with ES module format when module in ES format', async () => {
    const compiler = getCompiler('loader-es-with-es.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-es.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work with ES module format when module in ES format without default', async () => {
    const compiler = getCompiler('loader-es-with-es-without-default.js', {
      exposes: 'myGlobal',
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-es-without-default.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(
      execute(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('result');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });
});
