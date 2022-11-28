const { Model, snakeCaseMappers, AjvValidator } = require('objection');
const log = require('@wls/log');
const addFormats = require('ajv-formats');
const BaseQueryBuilder = require('./BaseQueryBuilder');

/**
 * Base model that provides common behaviour across all models. It includes the 'paranoid'-like
 * behaviour that updates the "deletedAt" field, instead of deleting the object and updates
 * the updatedAt field whenever the changes are made to the object (this excludes the changes
 * made to the "deletedAt" field).
 */
module.exports = class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      // options: {
      //   allErrors: true,
      //   validateSchema: false,
      //   ownProperties: true,
      // },
    });
  }

  /**
   * Override for the query method that adds a hook for updating the updatedAt field
   * whenever updates are made to the model (this excludes the changes made to the "deletedAt"
   * field).
   * @param args arguments passed to the super-constructor.
   * @returns QueryBuilder object.
   */
  static query(...args) {
    const query = super.query(...args).onBuild((builder) => {
      if (builder._operations.map((o) => o.name).includes('upsertGraph')) {
        log.debug('Skipping deletedAt override for upsert graph!');
      } else {
        builder.where(`${builder.modelClass().tableName}.deleted_at`, null);
      }
      if (builder.isUpdate()) {
        // eslint-disable-next-line no-param-reassign
        builder._operations = builder._operations.map((o) => {
          // Handle direct methods
          if (['patch', 'update'].includes(o.name)) {
            // Do not update "updatedAt" field if performing deletion or undeletion
            if (o.model.deletedAt === undefined) {
              const op = o;
              op.model.updatedAt = new Date().toISOString();
              return op;
            }
          }
          // Handle methods that use delegates
          if (['patchAndFetch', 'updateAndFetch'].includes(o.name)) {
            // Do not update "updatedAt" field if performing deletion or undeletion
            if (o.model.deletedAt === undefined) {
              const op = o;
              op.delegate.model.updatedAt = new Date().toISOString();
              return op;
            }
          }
          // Handle graph upsert
          if (['upsertGraph', 'updateAndFetch'].includes(o.name)) {
            // handle the upsert updatedAt date.
          }
          return o;
        });
      }
      // Log the raw SQL query
      builder.onBuildKnex((knexQueryBuilder) => {
        knexQueryBuilder.on('query', (queryData) => {
          log.debug(queryData);
        });
      });
    });

    // Update the operations object and add "meta" property with "excludeDeleted" value
    query._operations = query._operations.map((o) => {
      if (
        o.name === 'where' &&
        o.args.length === 1 &&
        o.args[0].deletedAt === null
      ) {
        return {
          ...o,
          meta: 'excludeDeleted',
        };
      }
      return o;
    });

    return query;
  }

  /**
   * Override for the query builder for the base model.
   * @returns {BaseQueryBuilder} QueryBuilder object for this model.
   */
  static get QueryBuilder() {
    return BaseQueryBuilder;
  }

  /**
   * Set snakeCaseMappers
   */
  static get columnNameMappers() {
    return snakeCaseMappers();
  }
};
