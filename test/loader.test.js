import {
  compile,
  execute,
  getCompiler,
  getErrors,
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
});
