const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
const log = require('@cats/log');

const isLocal = process.env.IS_LOCAL;
const region = process.env.REGION;

async function getSecret(secretName) {
  log.debug(`Requesting database secret in region ${region}.`);
  if (
    !secretName ||
    typeof secretName !== 'string' ||
    secretName.length === 0
  ) {
    throw new Error(
      'Database Secret Name has to be provided via environment variable!'
    );
  }
  const sm = new SecretsManagerClient({ region });
  const data = await sm.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  log.debug('Secret retrieved successfully.');
  return data.SecretString;
}

async function getConnectionString(secretName) {
  if (isLocal) {
    return require('../../secrets').mimic.connectionString;
  }
  const connectionString = await getSecret(secretName);
  log.debug('Database connection string established successfully.');
  return connectionString;
}

/**
 * Returns the promise that resolves to a knexfile. There is an important caveat, wherein the
 * returned knexfile is not the same as the one defined in the BaseModel.js, which might result in
 * an undesired behaviour, such as lack of translation of column names from the camelCase to
 * snake_case, or anything else used in the BaseModel.
 * @returns {Promise<{client: string, connection: string}>}
 */
// eslint-disable-next-line camelcase
async function DANGEROUSLY_getKnexfile(secretName) {
  log.debug('Building knexfile configuration.');
  try {
    const connectionString = await getConnectionString(secretName);
    return {
      client: 'pg',
      connection: connectionString,
    };
  } catch (error) {
    log.error('Error has occurred while building knexfile!', error);
    throw error;
  }
}

module.exports = { DANGEROUSLY_getKnexfile, getConnectionString };
