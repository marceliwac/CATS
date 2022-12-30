const { bindDatabase, destroyConnection } = require('@wls/models');

exports.up = async (knex) => {
  await bindDatabase();
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await knex.schema.createTable('stay_assignments', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('cognito_id').notNullable();
    table.integer('stay_id').notNullable();
    table.integer('order').defaultTo(0).notNullable();
    table.boolean('is_labelled').notNullable().defaultTo(false);
    table.uuid('group_id').nullable().defaultTo(null);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
  await knex.schema.createTable('labels', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('stay_assignment_id')
      .references('id')
      .inTable('stay_assignments')
      .notNullable();
    table.timestamp('start_time').defaultTo(null);
    table.timestamp('end_time').defaultTo(null);
    table.string('additional_data_json').defaultTo(null);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
  await knex.schema.createTable('groups', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.text('cognitoIdsJson').notNullable().defaultTo('[]');
    table.text('stayIdsJson').notNullable().defaultTo('[]');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });

  await destroyConnection();
};

exports.down = async (knex) => {
  await bindDatabase();
  await knex.schema.dropTable('groups');
  await knex.schema.dropTable('labels');
  await knex.schema.dropTable('stay_assignments');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";');
  await destroyConnection();
};
