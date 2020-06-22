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
      getModuleSource('./global-commonjs2-single-export.js-exposed', stats)
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
      getModuleSource('./global-commonjs2-single-export.js-exposed', stats)
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
      getModuleSource('./global-commonjs2-multiple-exports.js-exposed', stats)
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
      getModuleSource('./global-commonjs2-single-export.js-exposed', stats)
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
      getModuleSource('./global-commonjs2-single-export.js-exposed', stats)
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
      getModuleSource('./global-module-default-export.js-exposed', stats)
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
      getModuleSource('./global-module-named-exports.js-exposed', stats)
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
        'myGlobal',
        'myOtherGlobal',
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports.js-exposed', stats)
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
        localName: 'globalObject6',
      },
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports.js-exposed', stats)
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
          localName: 'globalObject6',
        },
        {
          globalName: ['myGlobal_alias', 'globalObject7'],
          localName: 'globalObject7',
        },
        'myGlobal_alias.default default',
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource('./global-module-named-exports.js-exposed', stats)
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
      getModuleSource('./custom.js?foo=bar-exposed', stats)
    ).toMatchSnapshot('module');
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
      getModuleSource('./simple-commonjs2-single-export.js-exposed', stats)
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

    const webpack4Filename = 'main-9486a32a.bundle.js';
    const webpack5Filename = 'main-22966fe7.bundle.js';
    const bundleName =
      webpack.version[0] === '5' ? webpack5Filename : webpack4Filename;

    expect(
      getModuleSource('./simple-commonjs2-single-export.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(Object.keys(stats.compilation.assets)[0]).toBe(bundleName);
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should work multiple name from one package', async () => {
    const compiler = getCompiler(
      'simple-commonjs2-single-export.js',
      {
        exposes: ['myOtherGlobal', 'myGlobal'],
      },
      {
        output: {
          path: path.resolve(__dirname, './outputs'),
          filename: '[name]-[contenthash:8].bundle.js',
          chunkFilename: '[name]-[contenthash:8].chunk.js',
          library: 'ExposeLoader',
          libraryTarget: 'var',
        },
      }
    );
    const stats = await compile(compiler);

    const webpack4Filename = 'main-c6c3f480.bundle.js';
    const webpack5Filename = 'main-e4eb4813.bundle.js';
    const bundleName =
      webpack.version[0] === '5' ? webpack5Filename : webpack4Filename;

    expect(
      getModuleSource('./global-commonjs2-single-export.js-exposed', stats)
    ).toMatchSnapshot('module');
    expect(Object.keys(stats.compilation.assets)[0]).toBe(bundleName);
    expect(execute(readAsset(bundleName, compiler, stats))).toMatchSnapshot(
      'result'
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
});
