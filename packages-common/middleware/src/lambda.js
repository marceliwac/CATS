const { lambdas } = require('micro-aws-lambda');
const parseBody = require('./parseBody');
const formatResponse = require('./formatResponse');
const logRequest = require('./logRequest');
const validatorWrapper = require('./validatorWrapper');
const wrapMiddlewareArray = require('./wrapMiddlewareArray');

function lambda(opts, operations) {
  const validators = validatorWrapper(opts);
  const middleware = [
    logRequest,
    parseBody,
    ...validators.before,
    ...wrapMiddlewareArray(operations),
    ...validators.after,
    formatResponse,
  ];

  return lambdas(middleware);
}

module.exports = lambda;
