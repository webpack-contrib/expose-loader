import {
  compile,
  execute,
  getSourceMap,
  getCompiler,
  getErrors,
  getModuleSource,
  getWarnings,
  readAsset,
} from './helpers';

describe('loader', () => {
  it('should work', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      expose: 'myGlobal',
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
      expose: ['myGlobal', 'myOtherGlobal'],
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

  it('should work for a nested property for a global object', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      expose: 'myGlobal.nested',
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

  it('should work for nested preporties for a global object', async () => {
    const compiler = getCompiler('simple-commonjs2-single-export.js', {
      expose: ['myGlobal.nested', 'myOtherGlobal.nested'],
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

  it('should work with sourceMap', async () => {
    const compiler = getCompiler(
      'simple-module-default.js',
      {
        expose: 'globalObject1.foo',
      },
      {
        devtool: 'eval-cheap-module-source-map',
      }
    );
    const stats = await compile(compiler);

    expect(
      getSourceMap(readAsset('main.bundle.js', compiler, stats))
    ).toMatchSnapshot('sourceMap');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });
});
