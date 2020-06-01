module.exports = function getGlobalThis() {
  if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line no-undef
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    // eslint-disable-next-line no-undef
    return self;
  }

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('unable to locate global object');
};
