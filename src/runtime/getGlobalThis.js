// eslint-disable-next-line func-names
module.exports = (function () {
  if (typeof globalThis === "object") {
    return globalThis;
  }

  // eslint-disable-next-line id-length
  let g;

  try {
    // This works if eval is allowed (see CSP)
    // eslint-disable-next-line no-new-func
    g = this || new Function("return this")();
  } catch {
    // This works if the window reference is available
    /* eslint-disable unicorn/prefer-global-this, no-undef */
    if (typeof window === "object") {
      return window;
    }
    // This works if the self reference is available
    if (typeof self === "object") {
      return self;
    }

    // This works if the global reference is available
    if (typeof global !== "undefined") {
      return global;
    }
    /* eslint-enable unicorn/prefer-global-this, no-undef */
  }

  return g;
})();
