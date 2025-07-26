// eslint-disable-next-line func-names
module.exports = (function () {
  if (typeof globalThis === "object") {
    return globalThis;
  }

  let globalObj;

  try {
    // This works if eval is allowed (see CSP)
    // eslint-disable-next-line no-new-func
    globalObj = this || new Function("return this")();
  } catch {
    // This works if the window reference is available
    if (typeof globalThis.window === "object") {
      return globalThis;
    }

    // This works if the self reference is available
    if (typeof globalThis.self === "object") {
      return globalThis;
    }

    // This works if the global reference is available
    if (typeof globalThis.global !== "undefined") {
      return globalThis;
    }
  }

  return globalObj;
})();
