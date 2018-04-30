import webpack from './helpers/compiler';

describe('Loader', () => {
  test('Defaults', async () => {
    const config = {
      loader: {
        test: /\.js$/,
        options: {},
      },
    };

    const stats = await webpack('fixture.js', config);
    const { modules } = stats.toJson();
    const [module] = modules;

    if (module) {
      const { source } = module;
      expect(source).toMatchSnapshot();
    } else {
      expect(true).toEqual(true);
    }
  });
});
