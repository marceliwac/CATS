const {
  StayAssignment,
  bindDatabase,
  destroyConnection,
} = require('@wls/models');

exports.up = async (knex) => {
  await bindDatabase();
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await knex.schema.createTable('labels', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('cognito_id').notNullable();
    table.integer('stay_id').notNullable();
    table.timestamp('start_time').defaultTo(null);
    table.timestamp('end_time').defaultTo(null);
    table.string('additional_data_json').defaultTo(null);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });
  await knex.schema.createTable('stay_assignments', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('cognito_id').notNullable();
    table.integer('stay_id').notNullable();
    table.boolean('is_labelled').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });

  // Insert sample data
  await StayAssignment.query(knex).insert([
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 33897341,
      isLabelled: false,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 39347147,
      isLabelled: true,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 36750672,
      isLabelled: false,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 38450462,
      isLabelled: true,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 36409426,
      isLabelled: false,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 31232556,
      isLabelled: false,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 39793803,
      isLabelled: true,
    },
    {
      cognitoId: '0c9871d2-c8dd-41f7-a743-3b9adbf7fa12',
      stayId: 36415879,
      isLabelled: true,
    },
  ]);

  console.log('STAY ASSIGNMENTS', await StayAssignment.query(knex));

  await destroyConnection();
};

exports.down = async (knex) => {
  await bindDatabase();
  await knex.schema.dropTable('stay_assignments');
  await knex.schema.dropTable('labels');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";');
  await destroyConnection();
};
