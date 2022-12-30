const BaseModel = require('./BaseModel');

module.exports = class Group extends BaseModel {
  static get tableName() {
    return 'groups';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'cognitoIdsJson', 'stayIdsJson'],
      properties: {
        name: { type: 'string' },
        cognitoIdsJson: { type: 'string' },
        stayIdsJson: { type: 'string' },
      },
    };
  }
};
