const knex = require('knex');
const objection = require('objection');
const knexfile = require('@wls/knexfile-mimic');
const log = require('@wls/log');
const BaseModel = require('./src/BaseModel');

async function bindDatabase() {
  log.debug('Binding database connection to knex. (mimic)');
  const connectionString = await knexfile.getConnectionString(
    process.env.MIMIC_DATABASE_SECRET_NAME
  );

  const db = knex({
    ...{
      client: 'pg',
      connection: connectionString,
    },
    ...objection.knexSnakeCaseMappers(),
  });

  await BaseModel.knex(db);
}

async function destroyConnection() {
  const connection = BaseModel.knex();
  if (connection) {
    log.debug('Connection present. Destroying connection. (mimic)');
    await connection.destroy();
  }
}

module.exports = {
  bindDatabase,
  destroyConnection,
  RawQuery: require('./src/RawQuery'),
  Row: require('./src/Row'),
};
