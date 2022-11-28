const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');
const log = require('@wls/log');

const isLocal = process.env.IS_LOCAL;
const localConnectionString = process.env.LOCAL_CONNECTION_STRING;
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
  return JSON.parse(data.SecretString);
}

/**
 * Ensure that all components of the secret are present for assembly of the database connection
 * string and return that string or throw an error.
 * @param secret
 */
function assembleConnectionString(secret) {
  if (
    !(
      secret.engine &&
      secret.username &&
      secret.password &&
      secret.host &&
      secret.port &&
      secret.dbname
    )
  ) {
    throw new Error('Not all database credentials are present in the secret!');
  }
  log.debug(`All components of the secret were present.`);
  return `${secret.engine}://${secret.username}:${encodeURIComponent(
    secret.password
  )}@${secret.host}:${secret.port}/${secret.dbname}`;
}

async function getConnectionString(secretName) {
  if (isLocal) {
    return localConnectionString;
  }
  const secret = await getSecret(secretName);
  const connectionString = assembleConnectionString(secret);
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
