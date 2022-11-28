module.exports = class ValidatorError extends Error {
  constructor(args) {
    super(args);
    this.name = 'ValidatorError';
  }
};
