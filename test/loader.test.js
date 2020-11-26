/**
 * @jest-environment node
 */
import path from "path";

import webpack from "webpack";

import {
  compile,
  execute,
  getCompiler,
  getErrors,
  getModulesList,
  getModuleSource,
  getWarnings,
  readAsset,
} from "./helpers";

jest.setTimeout(30000);

describe("loader", () => {
  it("should work", async () => {
    const compiler = getCompiler("simple-commonjs2-single-export.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should work with "moduleLocalName"', async () => {
    const compiler = getCompiler("simple-commonjs2-multiple-export.js", {
      exposes: "moduleMethod myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-multiple-exports-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with multiple exposes", async () => {
    const compiler = getCompiler("simple-commonjs2-single-export.js", {
      exposes: ["myGlobal", "myOtherGlobal"],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work multiple commonjs exports", async () => {
    const compiler = getCompiler("simple-commonjs2-multiple-export.js", {
      exposes: ["myOtherGlobal", "myGlobal.globalObject2 globalObject2"],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-multiple-exports-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work for a nested property for a global object", async () => {
    const compiler = getCompiler("simple-commonjs2-single-export.js", {
      exposes: "myGlobal.nested",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work for nested properties for a global object", async () => {
    const compiler = getCompiler("simple-commonjs2-single-export.js", {
      exposes: ["myGlobal.nested", "myOtherGlobal.nested foo"],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work from esModule export", async () => {
    const compiler = getCompiler("simple-module-single-export.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-default-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work string config", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: [
        "myGlobal_alias.globalObject6 globalObject6",
        "myGlobal_alias.globalObject7 globalObject7",
        "myGlobal_alias.default default",
        "myGlobal",
        "myOtherGlobal",
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-named-exports-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work string config 2", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: [
        "myGlobal_alias.globalObject6|globalObject6",
        "myGlobal_alias.globalObject7|globalObject7",
        "myGlobal_alias.default default",
        "    myGlobal   ",
        "myOtherGlobal",
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-named-exports-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work object config", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: {
        globalName: ["myGlobal.alias", "globalObject6"],
        moduleLocalName: "globalObject6",
      },
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-named-exports-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(stats.compilation.errors).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work multiple syntax to array", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: [
        {
          globalName: ["myGlobal_alias", "globalObject6"],
          moduleLocalName: "globalObject6",
        },
        {
          globalName: ["myGlobal_alias", "globalObject7"],
          moduleLocalName: "globalObject7",
        },
        "myGlobal_alias.default default",
      ],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-named-exports-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should be different modules id", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: ["myGlobal_alias.default"],
    });
    const stats = await compile(compiler);
    const modules = getModulesList("./global-module-named-exports.js", stats);

    expect(modules[0] !== modules[1]).toBe(true);
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work inline 1", async () => {
    const compiler = getCompiler(
      "inline-import.js",
      {},
      {
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /.*custom\.js/i,
              use: [
                {
                  loader: "babel-loader",
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./custom-exposed.js?foo=bar", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(readAsset("main.bundle.js.map", compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work inline 1 with config loader options", async () => {
    const compiler = getCompiler(
      "inline-import-equality.js",
      {},
      {
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /.*global-commonjs2-single-export\.js/i,
              use: [
                {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env"],
                  },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const isWebpack5 = webpack.version[0] === "5";
    const refRegexp = isWebpack5 ? /\?ruleSet\[\d+\].*!/ : /\?ref--[0-9-]+!/;

    expect(
      getModuleSource(
        "./global-commonjs2-single-export-exposed.js",
        stats
      ).replace(refRegexp, "?{{config-reference}}!")
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(readAsset("main.bundle.js.map", compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work inline 1 without extension", async () => {
    const compiler = getCompiler(
      "inline-import-1.js",
      {},
      {
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /.*custom/i,
              use: [
                {
                  loader: "babel-loader",
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    expect(getModuleSource("./custom-exposed?foo=bar", stats)).toMatchSnapshot(
      "module"
    );
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(readAsset("main.bundle.js.map", compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work inline 2", async () => {
    const compiler = getCompiler(
      "inline-import-2.js",
      {},
      {
        module: {},
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./simple-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(readAsset("main.bundle.js.map", compiler, stats)).toBeDefined();
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should match hashes on all operating systems", async () => {
    const compiler = getCompiler(
      "inline-import-2.js",
      {},
      {
        output: {
          path: path.resolve(__dirname, "./outputs"),
          filename: "[name]-[contenthash:8].bundle.js",
          chunkFilename: "[name]-[contenthash:8].chunk.js",
          library: "ExposeLoader",
          libraryTarget: "var",
        },
        module: {},
      }
    );
    const stats = await compile(compiler);
    const module = Array.from(stats.compilation.modules).find((m) =>
      m.id.endsWith("./simple-commonjs2-single-export-exposed.js")
    );
    const isWebpack5 = webpack.version[0] === "5";

    expect(
      getModuleSource("./simple-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(module.hash).toBe(
      isWebpack5
        ? "53b5c93a2ac82d2e55921ab5bcf9649e"
        : "c3e516476bee11406ecca2a29b66c743"
    );
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should emit error because of many arguments", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: ["myGlobal_alias globalObject6 excessArgument"],
    });
    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should emit error because of invalid arguments", async () => {
    const compiler = getCompiler("simple-module-named-export.js", {
      exposes: ["myGlobal_alias  |  globalObject6"],
    });
    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work interpolate", async () => {
    const compiler = getCompiler("simple-commonjs2-single-export.js", {
      exposes: ["[name]", "myGlobal.[name]"],
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should throw an error on existing value in the global object in the "development" mode', async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          globalName: ["myGlobal"],
          override: false,
        },
      },
      {
        mode: "development",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(() =>
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toThrowErrorMatchingSnapshot("runtime error");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should not override existing value in the global object in the "production" mode', async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          globalName: ["myGlobal"],
        },
      },
      {
        mode: "production",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should work and override existing value in the global object in the "development" mode', async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          globalName: ["myGlobal"],
          override: true,
        },
      },
      {
        mode: "development",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it('should work and override existing value in the global object in the "production" mode', async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          globalName: ["myGlobal"],
          override: true,
        },
      },
      {
        mode: "production",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should throw an error on existing module local value in the global object", async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          moduleLocalName: "foo",
          globalName: ["myGlobal"],
          override: false,
        },
      },
      {
        mode: "development",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(() =>
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toThrowErrorMatchingSnapshot("runtime error");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work and override existing module local value in the global object", async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          moduleLocalName: "foo",
          globalName: ["myGlobal"],
          override: true,
        },
      },
      {
        mode: "development",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should throw an error on existing nested value in the global object", async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          globalName: ["myOtherGlobal", "foo", "bar", "bar"],
          override: false,
        },
      },
      {
        mode: "development",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(() =>
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toThrowErrorMatchingSnapshot("runtime error");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work and override existing nested value in the global object", async () => {
    const compiler = getCompiler(
      "override-1.js",
      {
        exposes: {
          globalName: ["myOtherGlobal", "foo"],
          override: true,
        },
      },
      {
        mode: "development",
      }
    );
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-commonjs2-single-export-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with CommonJS format when module in CommonJS format", async () => {
    const compiler = getCompiler("loader-commonjs-with-commonjs.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-commonjs-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with CommonJS module format when module in ES module format", async () => {
    const compiler = getCompiler("loader-commonjs-with-es.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-es-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with ES module format when module in CommonJS format", async () => {
    const compiler = getCompiler("loader-es-with-commonjs.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-commonjs-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with ES module format when module in ES format", async () => {
    const compiler = getCompiler("loader-es-with-es.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-es-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with ES module format when module in ES format without default", async () => {
    const compiler = getCompiler("loader-es-with-es-without-default.js", {
      exposes: "myGlobal",
    });
    const stats = await compile(compiler);

    expect(
      getModuleSource("./global-module-es-without-default-exposed.js", stats)
    ).toMatchSnapshot("module");
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with side-effects free modules", async () => {
    const compiler = getCompiler(
      "side-effects.js",
      {
        exposes: "myGlobal",
      },
      {
        mode: "production",
      }
    );
    const stats = await compile(compiler);

    expect(getModuleSource("rx.all-exposed.js", stats)).toMatchSnapshot(
      "module"
    );
    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should work with side-effects free modules #1", async () => {
    const compiler = getCompiler(
      "side-effects-1.js",
      {
        exposes: "styled",
      },
      {
        mode: "production",
      }
    );
    const stats = await compile(compiler);

    expect(
      execute(readAsset("main.bundle.js", compiler, stats))
    ).toMatchSnapshot("result");
    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });

  it("should throw an error on invalid exposed value", async () => {
    const compiler = getCompiler("simple-commonjs2-single-export.js", {
      exposes: "myGlobal foo bar baz",
    });
    const stats = await compile(compiler);

    expect(getErrors(stats)).toMatchSnapshot("errors");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
  });
});
