const { Model, snakeCaseMappers, AjvValidator } = require('objection');
const log = require('@cats/log');
const addFormats = require('ajv-formats');

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
      // Log the raw SQL query
      builder.onBuildKnex((knexQueryBuilder) => {
        knexQueryBuilder.on('query', (queryData) => {
          log.debug(queryData);
        });
      });
    });

    return query;
  }

  /**
   * Set snakeCaseMappers
   */
  static get columnNameMappers() {
    return snakeCaseMappers();
  }
};
