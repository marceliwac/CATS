const { HttpResponse } = require('micro-aws-lambda');
const handleMiddlewareError = require('./helpers/handleMiddlewareError');

/**
 * Build the headers object based on the existing headers set in shared middleware parameter and the
 * origin as defined by the request headers of the event.
 * @param {APIGatewayProxyEvent} event request event.
 * @param {object} shared current value of shared middleware object.
 * @returns {object} pre-existing headers with the additional CORS headers appended. If  prior CORS
 * headers have existed, they will be overwritten.
 */

function getHeaders(event, shared) {
  const allowedOrigins = [process.env.WEBSITE_URL];
  const origin =
    event && event.headers && event.headers.origin
      ? event.headers.origin
      : null;
  const existingHeaders = shared.headers || {};
  if (allowedOrigins.includes(origin)) {
    return {
      ...existingHeaders,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    };
  }
  return {
    ...existingHeaders,
    'Access-Control-Allow-Origin': allowedOrigins[0],
    'Access-Control-Allow-Credentials': false,
  };
}

/**
 * Stringify the response's body parameter.
 * @param {HttpResponse} response current response.
 * @returns {HttpResponse} response with stringified `body` parameter if successfully stringified or
 * the passed response parameter on error.
 */
// eslint-disable-next-line consistent-return
function formatResponse({ event, shared }) {
  try {
    const body = JSON.stringify(shared.body);
    const { statusCode } = shared;
    const headers = getHeaders(event, shared);
    const response = HttpResponse.response({
      body,
      statusCode,
      headers,
    });
    return response;
  } catch (error) {
    return handleMiddlewareError({
      error,
      message: 'Failed to format the response!',
    });
  }
}

module.exports = formatResponse;
