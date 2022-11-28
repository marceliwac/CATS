const log = require('@wls/log');

/**
 * Log the received request. Logging will only take place in a non-production environment.
 * @param event request event.
 * @param context request context.
 */
function logRequest({ event, context }) {
  if (process.env.ENV !== 'production') {
    log.debug(
      JSON.stringify({
        event,
        context,
      })
    );
  }
}

module.exports = logRequest;
