const log = require('@cats/log');
const { destroyConnection, bindDatabase } = require('@cats/models');
const {
  destroyConnection: destroyConnectionMimic,
  bindDatabase: bindDatabaseMimic,
} = require('@cats/models-mimic');
const handleMiddlewareError = require('./helpers/handleMiddlewareError');

function wrapMiddlewareArray(operations) {
  return operations.map(
    ({ purpose, operation }) =>
      // eslint-disable-next-line consistent-return
      async function wrapped(args) {
        try {
          await bindDatabase();
          await bindDatabaseMimic();
          await operation(args);
        } catch (error) {
          log.warn(
            'A non pre-defined exception has been caught by middleware wrapper!'
          );
          log.error({
            purpose,
            error,
          });
          return handleMiddlewareError({
            error,
            message: purpose,
            httpResponseOptions: { statusCode: 500 },
          });
        } finally {
          await destroyConnectionMimic();
          await destroyConnection();
        }
      }
  );
}

module.exports = wrapMiddlewareArray;
