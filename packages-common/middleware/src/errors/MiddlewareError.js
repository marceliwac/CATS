module.exports = class MiddlewareError extends Error {
  constructor(args) {
    super(args);
    this.name = 'MiddlewareError';
  }
};
