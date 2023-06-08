const BaseModel = require('./BaseModel');

module.exports = class PinnedStay extends BaseModel {
  static get tableName() {
    return 'pinned_stays';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['stayId', 'cognitoId'],
      properties: {
        stayId: { type: 'integer' },
        cognitoId: { type: 'string' },
      },
    };
  }
};
