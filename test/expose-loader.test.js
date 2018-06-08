import path from 'path';

import { JSDOM } from 'jsdom';

import webpack from './helpers/compiler';

const html = `
  <!DOCTYPE html>
  <script src="${path.resolve(
    __dirname,
    './outputs/exposeLoader/main.chunk.js'
  )}"></script>
  <script src="${path.resolve(
    __dirname,
    './outputs/exposeLoader/runtime~main.js'
  )}"></script>
  <body>
    <h1>Hello, expose-loader!</h1>
  </body>
`;

const isExposed = (window, ...exposedVars) =>
  new Promise((resolve) => {
    window.onload = () => {
      exposedVars.forEach((key) => {
        expect(window[key]).toBeDefined();
        expect(window[key].hello()).toEqual('hello');
      });
      resolve();
    };
  });

describe('expose-loader', () => {
  test('Single global exposed', async () => {
    const config = {
      output: 'exposeLoader',
      rules: [
        {
          test: path.resolve(__dirname, './fixtures/bar.js'),
          use: {
            loader: path.resolve(__dirname, '../lib/index.js'),
            options: 'foo',
          },
        },
      ],
    };

    await webpack('expose_fixture.js', config, { output: true });
    const dom = new JSDOM(html, {
      resources: 'usable',
      runScripts: 'dangerously',
    });
    const window = dom.window;
    await isExposed(window, 'foo');
  });

  test('Multiple globals exposed', async () => {
    const config = {
      output: 'exposeLoader',
      rules: [
        {
          test: path.resolve(__dirname, './fixtures/bar.js'),
          use: [
            {
              loader: path.resolve(__dirname, '../lib/index.js'),
              options: 'foo',
            },
            {
              loader: path.resolve(__dirname, '../lib/index.js'),
              options: 'bar',
            },
          ],
        },
      ],
    };

    await webpack('expose_fixture.js', config, { output: true });
    const dom = new JSDOM(html, {
      resources: 'usable',
      runScripts: 'dangerously',
    });
    const window = dom.window;
    await isExposed(window, 'foo', 'bar');
  });
});
