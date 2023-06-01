const { bindDatabase, destroyConnection, Ruleset } = require('@wls/models');

exports.up = async (knex) => {
  await bindDatabase();

  await knex.schema.createTable('rulesets', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('cognito_id').notNullable();
    table.string('name').notNullable();
    table.text('ruleset_json').notNullable();
    table.text('parsed_ruleset_json').notNullable();
    table.string('execution_arn').defaultTo(null);
    table
      .enu('status', Object.values(Ruleset.STATUS))
      .notNullable()
      .defaultTo(Ruleset.STATUS.PENDING);

    table.text('statisticsJson').defaultTo(null);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });

  await knex.schema.createTable('ruleset_labels', (table) => {
    table
      .uuid('id')
      .unique()
      .notNullable()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('stay_id').notNullable();
    table.uuid('ruleset_id').references('id').inTable('rulesets').notNullable();
    table.timestamp('start_time').defaultTo(null);
    table.timestamp('end_time').defaultTo(null);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').defaultTo(null);
  });

  await destroyConnection();
};

exports.down = async (knex) => {
  await bindDatabase();
  await knex.schema.dropTable('ruleset_labels');
  await knex.schema.dropTable('rulesets');
  await destroyConnection();
};
