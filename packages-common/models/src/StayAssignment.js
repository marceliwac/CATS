const BaseModel = require('./BaseModel');

module.exports = class StayAssignment extends BaseModel {
  static get tableName() {
    return 'stay_assignments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['cognitoId', 'stayId'],
      properties: {
        cognitoId: { type: 'string' },
        stayId: { type: 'integer' },
        isLabelled: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    const Label = require('./Label');

    return {
      labels: {
        relation: BaseModel.HasManyRelation,
        modelClass: Label,
        join: {
          from: 'stay_assignments.id',
          to: 'labels.stay_assignment_id',
        },
      },
    };
  }
};