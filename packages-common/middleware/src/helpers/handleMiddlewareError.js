const log = require('@wls/log');
const { HttpResponse } = require('micro-aws-lambda');

function buildErrorObject(message, error) {
  const defaultMessage = 'An unknown server error occurred.';
  const errorObject = { message: defaultMessage };

  if (process.env.STAGE !== 'production') {
    errorObject.message = message || defaultMessage;
    errorObject.error = error.stack.split('\n');
  }

  return errorObject;
}

function buildHttpErrorResponseOptions(httpResponseOptions) {
  const statusCode =
    httpResponseOptions && httpResponseOptions.statusCode
      ? httpResponseOptions.statusCode
      : 500;
  return {
    statusCode,
  };
}

function handleMiddlewareError({ error, message, httpResponseOptions }) {
  if (message) {
    log.error(message);
  }

  if (
    error &&
    Object.prototype.hasOwnProperty.call(error, 'statusCode') &&
    typeof error.statusCode === 'number'
  ) {
    return error;
  }

  const errorObject = buildErrorObject(message, error);
  const httpErrorResponseOptions =
    buildHttpErrorResponseOptions(httpResponseOptions);

  return HttpResponse.error({
    body: errorObject,
    ...httpErrorResponseOptions,
  });
}

module.exports = handleMiddlewareError;
