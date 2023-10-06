const { QueryBuilder } = require('objection');

/**
 * QueryBuilder extension that allows for 'paranoid'-like properties of the objects stored
 * in the database. This includes updates to the deletedAt field, and changes to updatedAt
 * field with timestamp matching data of delete/update. The extension also allows to search
 * for models that were deleted (using `includeDeleted()` and conversely removes the deleted
 * objects from the queries by default, unless explicitly included with `includeDeleted()`.
 */
module.exports = class BaseQueryBuilder extends QueryBuilder {
  /**
   * Include the deleted objects. Deleted objects have a timestamp value in deletedAt field.
   * @returns {BaseQueryBuilder} QueryBuilder object.
   */
  includeDeleted() {
    if (this._operations.length > 0) {
      // Remove operation that excludes deleted objects (iff this operation was set by
      // query extension in base model, a.k.a. the parameter "meta" has value of
      // "excludeDeleted").
      this._operations = this._operations.filter(
        (o) => o.meta !== 'excludeDeleted'
      );
    }
    return this;
  }

  /**
   * Override for delete method that updates the deletedAt field with current timestamp.
   * @returns QueryBuilder object.
   */
  delete() {
    // Date.now will not work due to format mismatch.
    return this.patch({ deletedAt: new Date().toISOString() });
  }

  /**
   * Removes the object from the database by actually deleting it.
   * @returns QueryBuilder object.
   */
  hardDelete() {
    return super.delete();
  }

  /**
   * Restores the object by resetting the deletedAt field (setting it to null).
   * @returns  QueryBuilder object.
   */
  undelete() {
    return this.patch({ deletedAt: null });
  }
};
