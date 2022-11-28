const knex = require('knex');
const knexfile = require('@wls/knexfile');
const assert = require('assert');
const models = require('@wls/models');
const log = require('@wls/log');
const { knexSnakeCaseMappers } = require('objection');

// Explicitly define models as the dependency for the @wls/migrations package.
assert(models);

async function initialiseDatabaseConnection() {
  log.debug('Initialising database connection.');
  return knex({
    ...{
      client: 'pg',
      connection: () => knexfile.getConnectionString(process.env.DATABASE_SECRET_NAME),
    },
    ...knexSnakeCaseMappers(),
  });
}

module.exports.list = async function list() {
  const db = await initialiseDatabaseConnection();
  log.debug('Listing migrations.');
  const [completed, pending] = await db.migrate.list();
  log.info(
    `Completed migrations: ${completed.length} migrations\n${completed
      .map((migration) => migration.file)
      .join('\n')}` +
      `Pending migrations: ${pending.length} migrations\n${pending
        .map((migration) => migration.file)
        .join('\n')}`
  );
  await db.destroy();
  return {
    completed,
    pending,
  };
};

module.exports.latest = async function latest() {
  const db = await initialiseDatabaseConnection();
  log.debug('Checking the state of migrations.');
  const [completed, pending] = await db.migrate.list();
  log.debug(
    `Completed migrations: ${completed.length} migrations\n${completed
      .map((migration) => migration.file)
      .join('\n')}` +
      `Pending migrations: ${pending.length} migrations\n${pending
        .map((migration) => migration.file)
        .join('\n')}`
  );
  let result = [null];
  if (pending.length === 0) {
    log.info('Already up to date');
  } else {
    log.debug('Running migrations up to latest entry.');
    while (result.length !== 0) {
      // eslint-disable-next-line no-await-in-loop
      [, result] = await db.migrate.up();
      if (result.length > 0) {
        log.info(`Migration ${result[0]} applied.`);
      }
    }
  }
  await db.destroy();
  return result;
};

module.exports.rollback = async function rollback() {
  const db = await initialiseDatabaseConnection();
  log.debug('Rolling back the latest batch of migrations.');
  const [batchNo, result] = await db.migrate.rollback();
  if (result.length === 0) {
    log.info('Already up to date');
  }
  log.info(
    `Batch ${batchNo} rolled-back: ${result.length} migrations\n${result.join(
      '\n'
    )}`
  );
  await db.destroy();
  return result;
};

module.exports.rollbackAll = async function rollbackAll() {
  const db = await initialiseDatabaseConnection();
  log.debug('Rolling back all migrations.');
  const [batchNo, result] = await db.migrate.rollback(null, true);
  if (result.length === 0) {
    log.info('Already up to date');
  }
  log.info(
    `Batch ${batchNo} rolled-back: ${result.length} migrations\n${result.join(
      '\n'
    )}`
  );
  await db.destroy();
  return result;
};
