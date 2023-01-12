const knex = require('knex');
const objection = require('objection');
const knexfile = require('@wls/knexfile');
const log = require('@wls/log');
const BaseModel = require('./src/BaseModel');

async function bindDatabase() {
  log.debug('Binding database connection to knex.');
  const connectionString = await knexfile.getConnectionString(
    process.env.DATABASE_SECRET_NAME
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
    log.debug('Connection present. Destroying connection.');
    await connection.destroy();
  }
}

module.exports = {
  bindDatabase,
  destroyConnection,
  Label: require('./src/Label'),
  StayAssignment: require('./src/StayAssignment'),
  GroupAssignment: require('./src/GroupAssignment'),
  OrderedGroupAssignment: require('./src/OrderedGroupAssignment'),
};
