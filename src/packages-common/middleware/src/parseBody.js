const handleError = require('./helpers/handleMiddlewareError');

/**
 * Parse the body of the request as JSON if it's defined.
 * @param {APIGatewayProxyEvent} event request event.
 * @param {object} shared current value of shared middleware object.
 */
function parseBody({ event }) {
  try {
    if (Object.prototype.hasOwnProperty.call(event, 'body')) {
      // eslint-disable-next-line no-param-reassign
      event.body = JSON.parse(event.body);
    }
  } catch (error) {
    handleError({
      error,
      message: 'Failed to parse the body!',
    });
  }
}

module.exports = parseBody;
