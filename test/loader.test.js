import webpack from './helpers/compiler';

describe('Loader', () => {
  test('exposes module with webpack configuration syntax', async () => {
    const config = {
      loader: {
        test: /foo\.js$/,
        options: 'foo',
      },
    };

    const stats = await webpack('webpack.js', config);
    const { modules } = stats.toJson();
    const source = modules
      .filter((module) => module.name.includes('-exposed'))
      .map((module) => module.source);
    expect(source).toMatchSnapshot();
  });

  test('exposes module with inline import syntax', async () => {
    const stats = await webpack('inline.js', {});
    const { modules } = stats.toJson();
    const source = modules
      .filter((module) => module.name.includes('-exposed'))
      .map((module) => module.source);
    expect(source).toMatchSnapshot();
  });
});
